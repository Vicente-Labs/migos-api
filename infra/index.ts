import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'
import * as cloudflare from '@pulumi/cloudflare'
import * as dockerBuild from '@pulumi/docker-build'
import * as pulumi from '@pulumi/pulumi'

const zone = cloudflare.getZone({
  name: 'migos.me',
})

const cluster = new awsx.classic.ecs.Cluster('aws-host-cluster')

const certificate = new aws.acm.Certificate('aws-host-certificate', {
  domainName: 'api.migos.me',
  validationMethod: 'DNS',
})

const certificateValidation = new cloudflare.Record(
  'aws-host-certificate-validation',
  {
    name: certificate.domainValidationOptions[0].resourceRecordName,
    type: certificate.domainValidationOptions[0].resourceRecordType,
    value: certificate.domainValidationOptions[0].resourceRecordValue,
    zoneId: zone.then((zone) => zone.id),
  },
)

const certificateValidationToken = new aws.acm.CertificateValidation(
  'aws-host-certificate-validation',
  {
    certificateArn: certificate.arn,
    validationRecordFqdns: [certificateValidation.hostname],
  },
)

const loadBalancer = new awsx.classic.lb.ApplicationLoadBalancer(
  'aws-host-lb',
  {
    securityGroups: cluster.securityGroups,
  },
)

export const apiAlias = new cloudflare.Record(
  'aws-host-api-alias',
  {
    zoneId: zone.then((zone) => zone.id),
    name: 'api',
    type: 'CNAME',
    content: loadBalancer.loadBalancer.dnsName,
    proxied: true,
  },
  {
    customTimeouts: {
      create: '10m',
      update: '10m',
      delete: '10m',
    },
  },
)

const targetGroup = loadBalancer.createTargetGroup('aws-host-target-group', {
  port: 3333,
  protocol: 'HTTP',
  healthCheck: {
    path: '/health',
    protocol: 'HTTP',
    interval: 10,
    healthyThreshold: 3,
    unhealthyThreshold: 3,
    timeout: 5,
  },
})

const httpsListener = loadBalancer.createListener('aws-host-https-listener', {
  port: 443,
  targetGroup,
  protocol: 'HTTPS',
  sslPolicy: 'ELBSecurityPolicy-2016-08',
  certificateArn: certificateValidationToken.certificateArn,
})

const repository = new awsx.ecr.Repository('aws-host-repository', {
  forceDelete: true,
})

const authToken = aws.ecr.getAuthorizationTokenOutput({
  registryId: repository.repository.registryId,
})

const image = new dockerBuild.Image('aws-workshop-image', {
  tags: [pulumi.interpolate`${repository.repository.repositoryUrl}:latest`],
  context: {
    location: '../',
  },
  cacheFrom: [
    {
      registry: {
        ref: pulumi.interpolate`${repository.repository.repositoryUrl}:latest`,
      },
    },
  ],
  cacheTo: [
    {
      inline: {},
    },
  ],
  platforms: ['linux/amd64'],
  push: true,
  registries: [
    {
      address: repository.repository.repositoryUrl,
      password: authToken.password,
      username: authToken.userName,
    },
  ],
})

const executionRole = new aws.iam.Role('aws-workshop-execution-role', {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: 'ecs-tasks.amazonaws.com',
  }),
  managedPolicyArns: [
    'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
  ],
  inlinePolicies: [
    {
      name: 'inline',
      policy: aws.iam.getPolicyDocumentOutput({
        statements: [
          {
            sid: 'ReadSsmAndSecrets',
            actions: [
              'ssm:GetParameters',
              'ssm:GetParameter',
              'ssm:GetParameterHistory',
            ],
            resources: [
              'arn:aws:ssm:us-east-1:477682148008:parameter/migos/prod/*',
            ],
          },
        ],
      }).json,
    },
  ],
})

const app = new awsx.classic.ecs.FargateService('aws-host-app', {
  cluster,
  desiredCount: 1,
  waitForSteadyState: false,
  taskDefinitionArgs: {
    executionRole,
    container: {
      image: image.ref,
      cpu: 256,
      memory: 512,
      portMappings: [httpsListener],
      secrets: [
        {
          name: 'JWT_SECRET',
          valueFrom: '/migos/prod/JWT_SECRET',
        },
        {
          name: 'DATABASE_URL',
          valueFrom: '/migos/prod/DATABASE_URL',
        },
        {
          name: 'GOOGLE_CLIENT_ID',
          valueFrom: '/migos/prod/GOOGLE_CLIENT_ID',
        },
        {
          name: 'GOOGLE_CLIENT_SECRET',
          valueFrom: '/migos/prod/GOOGLE_CLIENT_SECRET',
        },
        {
          name: 'GOOGLE_REDIRECT_URI',
          valueFrom: '/migos/prod/GOOGLE_REDIRECT_URI',
        },
      ],
      environment: [
        {
          name: 'NODE_ENV',
          value: 'production',
        },
      ],
    },
  },
})

const scalingTarget = new aws.appautoscaling.Target(
  'aws-host-autoscaling-target',
  {
    minCapacity: 1,
    maxCapacity: 5,
    serviceNamespace: 'ecs',
    scalableDimension: 'ecs:service:DesiredCount',
    resourceId: pulumi.interpolate`service/${cluster.cluster.name}/${app.service.name}`,
  },
)

export const scalingPolicy = new aws.appautoscaling.Policy(
  'aws-host-autoscaling-policy-cpu',
  {
    serviceNamespace: scalingTarget.serviceNamespace,
    scalableDimension: scalingTarget.scalableDimension,
    resourceId: scalingTarget.resourceId,
    policyType: 'TargetTrackingScaling',
    targetTrackingScalingPolicyConfiguration: {
      predefinedMetricSpecification: {
        predefinedMetricType: 'ECSServiceAverageCPUUtilization',
      },
      targetValue: 50,
    },
  },
)

export const url = pulumi.interpolate`http://${httpsListener.endpoint.hostname}`
