import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'
import * as cloudflare from '@pulumi/cloudflare'
import * as dockerBuild from '@pulumi/docker-build'
import * as pulumi from '@pulumi/pulumi'

const zone = cloudflare.getZone({
  name: 'migos.me',
})

const cluster = new awsx.classic.ecs.Cluster('aws-host-cluster')

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
    healthyThreshold: 3,
    unhealthyThreshold: 3,
    timeout: 5,
    interval: 10,
  },
})

const httpsListener = loadBalancer.createListener('aws-host-https-listener', {
  port: 443,
  targetGroup,
  protocol: 'HTTPS',
  sslPolicy: 'ELBSecurityPolicy-2016-08',
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

const app = new awsx.classic.ecs.FargateService('aws-host-app', {
  cluster,
  desiredCount: 1,
  waitForSteadyState: false,
  taskDefinitionArgs: {
    container: {
      image: image.ref,
      cpu: 256,
      memory: 512,
      portMappings: [httpsListener],
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
