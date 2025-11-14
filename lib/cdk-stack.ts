import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import { Protocol } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as iam from "aws-cdk-lib/aws-iam";

/**
 * AWS CDK Stack for deploying the Doula Assistant Service to ECS with Fargate
 *
 * This stack creates a production-ready infrastructure for the Doula Assistant service following
 * AWS best practices for security, scalability, and reliability. The architecture includes:
 *
 * - ECS cluster with Fargate for serverless container execution
 * - Application Load Balancer for public access and health checks
 * - Single task configuration (no auto-scaling) as requested
 * - Security Groups implementing least-privilege access
 * - CloudWatch monitoring and logging
 *
 * @example
 *   ```typescript
 *   const app = new cdk.App();
 *   new DoulaAssistantStack(app, 'DoulaAssistantStack', {
 *     env: { account: '123456789012', region: 'us-east-1' }
 *   });
 *   ```;
 */

const VPC_NAME = "DHS-DMAHS-DoulaApp-*";
const ECR_REPOSITORY_NAME = "doula-app";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const envName = this.node.tryGetContext("env");

    // Use an existing VPC by name
    const vpc = ec2.Vpc.fromLookup(this, "ExistingVpc", {
      vpcName: VPC_NAME,
    });

    const cluster = new ecs.Cluster(this, "DoulaAssistantCluster", {
      vpc,
      clusterName: "doula-assistant-cluster",
    });

    // Use an existing bucket with the environment file already deployed
    const bucket = cdk.aws_s3.Bucket.fromBucketName(
      this,
      "DoulaAssistantBucket",
      `doula-assistant-${this.account}`,
    );

    const taskDefinition = new ecs.FargateTaskDefinition(this, "DoulaTaskDefinition", {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    const appContainer = taskDefinition.addContainer("DoulaAppContainer", {
      image: ecs.ContainerImage.fromEcrRepository(
        ecr.Repository.fromRepositoryName(this, "DoulaAssistantRepo", ECR_REPOSITORY_NAME),
        "latest",
      ),
      environment: {
        NODE_ENV: "production",
        PORT: "3000",
        HOST: "0.0.0.0",
        LOG_LEVEL: "info",
      },
      environmentFiles: [ecs.EnvironmentFile.fromBucket(bucket, `configuration/.env`)],
    });

    appContainer.addPortMappings({ containerPort: 3000 });

    // Create Fargate service with internal HTTP ALB using the prepared task definition
    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "DoulaAssistantFargateService",
      {
        cluster,
        taskDefinition,
        serviceName: "doula-assistant-service",
        desiredCount: 1,
        minHealthyPercent: 0,
        maxHealthyPercent: 200,
        loadBalancerName: "doula-assistant-alb",
        publicLoadBalancer: false, // Internal ALB
        listenerPort: 80,
        taskSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      },
    );

    fargateService.targetGroup.configureHealthCheck({
      path: "/api/health",
      port: "3000",
      protocol: Protocol.HTTP,
      healthyHttpCodes: "200",
      interval: cdk.Duration.seconds(30),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 5,
      timeout: cdk.Duration.seconds(5),
    });

    // Create security group for VPC endpoints
    const vpcEndpointSecurityGroup = new ec2.SecurityGroup(this, "VpcEndpointSecurityGroup", {
      vpc,
      description: "Security group for VPC endpoints",
      allowAllOutbound: false,
    });

    // Allow HTTPS inbound from entire VPC CIDR
    vpcEndpointSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(443),
      "Allow HTTPS from VPC",
    );

    vpc.addGatewayEndpoint("S3Endpoint", {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });

    vpc.addInterfaceEndpoint("EcrEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
      privateDnsEnabled: true,
      securityGroups: [vpcEndpointSecurityGroup],
      subnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    vpc.addInterfaceEndpoint("EcrDockerEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
      privateDnsEnabled: true,
      securityGroups: [vpcEndpointSecurityGroup],
      subnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    vpc.addInterfaceEndpoint("CloudWatchLogsEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
      privateDnsEnabled: true,
      securityGroups: [vpcEndpointSecurityGroup],
      subnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    fargateService.service.connections.allowTo(
      vpcEndpointSecurityGroup,
      ec2.Port.tcp(443),
      "Allow ECS service to access VPC endpoints",
    );

    fargateService.taskDefinition.executionRole?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonECSTaskExecutionRolePolicy"),
    );

    fargateService.taskDefinition.addToExecutionRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:GetObject", "s3:GetBucketLocation"],
        resources: [bucket.bucketArn, bucket.arnForObjects("configuration/.env")],
      }),
    );

    fargateService.taskDefinition.addToExecutionRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
        ],
        resources: ["*"],
      }),
    );

    // Add ECS Exec / Session Manager permissions to debug the container on ECS
    fargateService.taskDefinition.addToTaskRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "ssm:StartSession",
          "ssmmessages:CreateControlChannel",
          "ssmmessages:CreateDataChannel",
          "ssmmessages:OpenControlChannel",
          "ssmmessages:OpenDataChannel",
        ],
        resources: ["*"],
      }),
    );

    // Create GitHub Actions IAM role for OIDC federation
    const githubActionsRole = new iam.Role(this, "GitHubActionsRole", {
      roleName: "GitHubAction-PushEcrUpdateEcs",
      assumedBy: new iam.WebIdentityPrincipal(
        `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
        {
          StringEquals: {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          },
          StringLike: {
            "token.actions.githubusercontent.com:sub": "repo:newjersey/doula-medicaid:*",
          },
        },
      ),
    });

    // Grant ECR push/pull to the role for the 'doula-app' repository
    const doulaRepo = ecr.Repository.fromRepositoryName(this, "DoulaEcrRepo", ECR_REPOSITORY_NAME);
    doulaRepo.grantPullPush(githubActionsRole);

    // Allow GitHub Actions role to update the ECS service (force new deployment)
    githubActionsRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["ecs:UpdateService", "ecs:DescribeServices", "ecs:DescribeClusters"],
        resources: [fargateService.service.serviceArn, cluster.clusterArn],
      }),
    );

    // CloudFormation Outputs
    new cdk.CfnOutput(this, "LoadBalancerUrl", {
      value: `http://${fargateService.loadBalancer.loadBalancerDnsName}`,
      description:
        "HTTP URL of the Internal Application Load Balancer (accessible from within VPC)",
      exportName: "DoulaAssistantLoadBalancerUrl",
    });

    new cdk.CfnOutput(this, "HealthCheckUrl", {
      value: `http://${fargateService.loadBalancer.loadBalancerDnsName}/api/health`,
      description: "HTTP URL for the health check endpoint (accessible from within VPC)",
      exportName: "DoulaAssistantHealthCheckUrl",
    });

    new cdk.CfnOutput(this, "LoadBalancerDnsName", {
      value: fargateService.loadBalancer.loadBalancerDnsName,
      description: "Load Balancer DNS name for DNS configuration",
      exportName: "DoulaAssistantLoadBalancerDnsName",
    });

    new cdk.CfnOutput(this, "InternalAccessNote", {
      value:
        "Service accessible via API Gateway (public HTTPS) or internal HTTP load balancer (VPC only). API Gateway provides HTTPS termination and public access.",
      description: "Service accessibility options",
    });

    // Tags for all resources
    cdk.Tags.of(this).add("Project", "DoulaAssistantService");
    cdk.Tags.of(this).add("Environment", envName);
    cdk.Tags.of(this).add("ManagedBy", "CDK");
  }
}
