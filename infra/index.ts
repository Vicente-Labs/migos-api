import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const repository = new awsx.ecr.Repository('aws-host-repository', {
  forceDelete: true,
})

const image = new awsx.ecr.Image('aws-host-image', {
  repositoryUrl: repository.url,
  context: '../',
  platform: 'linux/amd64',
})

const cluster = new awsx.classic.ecs.Cluster('aws-host-cluster')

const loadBalancer = new awsx.classic.lb.ApplicationLoadBalancer('aws-host-lb', {
  securityGroups: cluster.securityGroups,
})

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

const httpListener = loadBalancer.createListener('aws-host-http-listener', {
  port: 80,
  protocol: 'HTTP',
  targetGroup,
})

const app = new awsx.classic.ecs.FargateService('aws-host-app', {
  cluster,
  desiredCount: 1,
  waitForSteadyState: false,
  taskDefinitionArgs: {
    container: {
      image: image.imageUri,
      cpu: 256,
      memory: 512,
      portMappings: [httpListener],
    },
  },
})

const scalingTarget = new aws.appautoscaling.Target('aws-host-autoscaling-target', {
  minCapacity: 1,
  maxCapacity: 5,
  serviceNamespace: 'ecs',
  scalableDimension: 'ecs:service:DesiredCount',
  resourceId: pulumi.interpolate`service/${cluster.cluster.name}/${app.service.name}`
})

new aws.appautoscaling.Policy('aws-host-autoscaling-policy-cpu', {
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
})

export const url = httpListener.endpoint.hostname