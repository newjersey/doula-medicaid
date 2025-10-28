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

const VPC_NAME = "DHS-DMAHS-DoulaApp-Dev-VPC";
const ECR_REPOSITORY_NAME = "doula-app";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Use an existing VPC by name
    const vpc = ec2.Vpc.fromLookup(this, "ExistingVpc", {
      vpcName: VPC_NAME,
    });

    // Create ECS cluster
    const cluster = new ecs.Cluster(this, "DoulaAssistantCluster", {
      vpc,
      clusterName: "doula-assistant-cluster",
    });

    // Create Fargate service with internal HTTP ALB
    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "DoulaAssistantFargateService",
      {
        cluster,
        memoryLimitMiB: 512,
        cpu: 256,
        desiredCount: 1, // Single instance as requested
        loadBalancerName: "doula-assistant-alb",
        taskImageOptions: {
          image: ecs.ContainerImage.fromEcrRepository(
            ecr.Repository.fromRepositoryName(this, "DoulaAssistantRepo", ECR_REPOSITORY_NAME),
            "latest",
          ),
          containerPort: 3000,
          environment: {
            NODE_ENV: "production",
            PORT: "3000",
            HOST: "0.0.0.0",
            LOG_LEVEL: "info",
          },
        },
        publicLoadBalancer: false, // Internal ALB due to no public subnets
        listenerPort: 80, // HTTP port - API Gateway handles HTTPS termination
        taskSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      },
    );

    // Set minHealthyPercent to avoid deployment issues (override ECS service properties)
    const cfnService = fargateService.service.node.defaultChild as ecs.CfnService;
    cfnService.addPropertyOverride("DeploymentConfiguration", { MinimumHealthyPercent: 100 });

    // Configure health check to use dedicated health endpoint
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

    // S3 Gateway Endpoint (works without private DNS)
    vpc.addGatewayEndpoint("S3Endpoint", {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });

    // ECR Interface Endpoints (required for ECS to pull images)
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

    // CloudWatch Logs endpoint
    vpc.addInterfaceEndpoint("CloudWatchLogsEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
      privateDnsEnabled: true,
      securityGroups: [vpcEndpointSecurityGroup],
      subnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    // Allow ECS service to communicate with VPC endpoints
    fargateService.service.connections.allowTo(
      vpcEndpointSecurityGroup,
      ec2.Port.tcp(443),
      "Allow ECS service to access VPC endpoints",
    );

    // Add explicit ECR permissions to task execution role
    fargateService.taskDefinition.executionRole?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonECSTaskExecutionRolePolicy"),
    );

    // Add explicit ECR permissions
    // @ts-expect-error: Seems related to https://github.com/aws/aws-cdk/issues/24195 ? But mostly, just ignoring this because it works.
    fargateService.taskDefinition.executionRole?.addToPolicy(
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

    // CloudFormation Outputs
    new cdk.CfnOutput(this, "LoadBalancerUrl", {
      value: `http://${fargateService.loadBalancer.loadBalancerDnsName}`,
      description:
        "HTTP URL of the Internal Application Load Balancer (accessible from within VPC)",
      exportName: "DoulaAssistantLoadBalancerUrl",
    });

    new cdk.CfnOutput(this, "HealthCheckUrl", {
      value: `http://${fargateService.loadBalancer.loadBalancerDnsName}/health`,
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
    cdk.Tags.of(this).add("Environment", props?.env ? "Production" : "Development");
    cdk.Tags.of(this).add("ManagedBy", "CDK");
  }
}
