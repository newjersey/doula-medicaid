/* eslint-disable @typescript-eslint/consistent-type-imports */

import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import { Protocol } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

/**
 * AWS CDK Stack for deploying the Doula Common App Service to ECS with Fargate
 *
 * This stack creates a production-ready infrastructure for the Doula Common App service following
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
 *   new DoulaCommonAppStack(app, 'DoulaCommonAppStack', {
 *     env: { account: '123456789012', region: 'us-east-1' }
 *   });
 *   ```;
 */
const VPC_ID = "vpc-0c56aa28eca92ed0b";
const ECR_REPOSITORY_NAME = "doula-app";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Use an existing VPC by ID
    const vpc = ec2.Vpc.fromLookup(this, "ExistingVpc", {
      vpcId: VPC_ID,
    });

    // Create ECS cluster
    const cluster = new ecs.Cluster(this, "DoulaCommonAppCluster", {
      vpc,
      clusterName: "doula-common-app-cluster",
    });

    // Reference existing ECR repository
    const ecrRepo = ecr.Repository.fromRepositoryName(
      this,
      "DoulaCommonAppRepo",
      ECR_REPOSITORY_NAME,
    );

    // Security Group for Fargate tasks
    const fargateSecurityGroup = ec2.SecurityGroup.fromLookupById(
      this,
      "FargateTaskSecurityGroup",
      "sg-0d99483e4cadc4db8",
    );

    // Create Fargate service with internal HTTP ALB
    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "DoulaCommonAppFargateService",
      {
        cluster,
        memoryLimitMiB: 512,
        cpu: 256,
        taskImageOptions: {
          image: ecs.ContainerImage.fromEcrRepository(ecrRepo, "latest"),
          containerPort: 3000,
          environment: {
            NODE_ENV: "production",
            PORT: "3000",
            HOST: "0.0.0.0",
            LOG_LEVEL: "info",
          },
        },
        securityGroups: [fargateSecurityGroup],
        desiredCount: 1,
        minHealthyPercent: 100,
        publicLoadBalancer: false, // Internal ALB due to no public subnets
        listenerPort: 80, // HTTP port - API Gateway handles HTTPS termination
        taskSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      },
    );

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

    // // Create VPC Link v2 for HTTP API Gateway
    // const vpcLink = new apigatewayv2.VpcLink(this, "DoulaCommonAppVpcLink", {
    //   vpc,
    //   subnets: {
    //     subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    //   },
    //   vpcLinkName: "doula-common-app-vpc-link",
    // });

    // JC TODO: Create a new ACM certificate
    // const certificate = new acm.Certificate(this, "DoulaCommonAppCertificate", {
    //   domainName: "ping.business.nj.gov",
    //   validation: acm.CertificateValidation.fromDns(),
    // });

    // // JC TODO: Create custom domain for API Gateway
    // const domainName = new apigatewayv2.DomainName(this, "DoulaCommonAppDomainName", {
    //   domainName: DOMAIN_NAME,
    //   certificate,
    // });

    // // Create HTTP API Gateway (v2) with ALB integration
    // const api = new apigatewayv2.HttpApi(this, "DoulaCommonAppGateway", {
    //   apiName: "Doula Common App Gateway",
    //   description: "HTTP API Gateway for Doula Common App Service",
    //   disableExecuteApiEndpoint: true, // Disable default endpoint to force custom domain usage
    //   corsPreflight: {
    //     allowOrigins: ["*"],
    //     allowMethods: [apigatewayv2.CorsHttpMethod.ANY],
    //     allowHeaders: ["*"],
    //   },
    // });

    // // Map the custom domain to the API Gateway
    // new apigatewayv2.ApiMapping(this, "DoulaCommonAppMapping", {
    //   api,
    //   domainName,
    //   stage: api.defaultStage,
    // });

    // // Create ALB integration for HTTP API Gateway with explicit configuration
    // const integration = new apigatewayv2Integrations.HttpAlbIntegration(
    //   "DoulaCommonAppIntegration",
    //   fargateService.listener,
    //   {
    //     vpcLink,
    //     method: apigatewayv2.HttpMethod.ANY,
    //   },
    // );

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

    // ECS VPC Endpoint (required for ECS agent communication)
    vpc.addInterfaceEndpoint("EcsEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.ECS,
      privateDnsEnabled: false,
      securityGroups: [vpcEndpointSecurityGroup],
      subnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    // ECS Agent VPC Endpoint
    vpc.addInterfaceEndpoint("EcsAgentEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.ECS_AGENT,
      privateDnsEnabled: false,
      securityGroups: [vpcEndpointSecurityGroup],
      subnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    // ECS Telemetry VPC Endpoint
    vpc.addInterfaceEndpoint("EcsTelemetryEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.ECS_TELEMETRY,
      privateDnsEnabled: false,
      securityGroups: [vpcEndpointSecurityGroup],
      subnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    // ECR Interface Endpoints (required for ECS to pull images)
    vpc.addInterfaceEndpoint("EcrEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
      privateDnsEnabled: false,
      securityGroups: [vpcEndpointSecurityGroup],
      subnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    vpc.addInterfaceEndpoint("EcrDockerEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
      privateDnsEnabled: false,
      securityGroups: [vpcEndpointSecurityGroup],
      subnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    // STS VPC Endpoint (required for ECR token authentication)
    vpc.addInterfaceEndpoint("StsEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.STS,
      privateDnsEnabled: false,
      securityGroups: [vpcEndpointSecurityGroup],
      subnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    // CloudWatch Logs endpoint
    vpc.addInterfaceEndpoint("CloudWatchLogsEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
      privateDnsEnabled: false,
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
      exportName: "DoulaCommonAppLoadBalancerUrl",
    });

    // new cdk.CfnOutput(this, "HealthCheckUrl", {
    //   value: `http://${fargateService.loadBalancer.loadBalancerDnsName}/health`,
    //   description: "HTTP URL for the health check endpoint (accessible from within VPC)",
    //   exportName: "DoulaCommonAppHealthCheckUrl",
    // });

    new cdk.CfnOutput(this, "LoadBalancerDnsName", {
      value: fargateService.loadBalancer.loadBalancerDnsName,
      description: "Load Balancer DNS name for DNS configuration",
      exportName: "DoulaCommonAppLoadBalancerDnsName",
    });

    // new cdk.CfnOutput(this, "ApiGatewayUrl", {
    //   value: `https://${domainName.name}`,
    //   description: "Public API Gateway URL for the Doula Common App service",
    //   exportName: "DoulaCommonAppGatewayUrl",
    // });

    // new cdk.CfnOutput(this, "ApiGatewayTimestampUrl", {
    //   value: `https://${domainName.name}/timestamp`,
    //   description: "Direct URL to the timestamp endpoint via API Gateway",
    //   exportName: "DoulaCommonAppGatewayTimestampUrl",
    // });

    // new cdk.CfnOutput(this, "CustomDomainName", {
    //   value: domainName.name,
    //   description: "Custom domain name for the API Gateway",
    //   exportName: "DoulaCommonAppCustomDomainName",
    // });

    // new cdk.CfnOutput(this, "DomainNameTarget", {
    //   value: domainName.regionalDomainName,
    //   description: "Target domain name for DNS CNAME record",
    //   exportName: "DoulaCommonAppDomainNameTarget",
    // });

    // new cdk.CfnOutput(this, "DomainNameHostedZoneId", {
    //   value: domainName.regionalHostedZoneId,
    //   description: "Hosted Zone ID for the custom domain (for Route 53 alias records)",
    //   exportName: "DoulaCommonAppDomainNameHostedZoneId",
    // });

    // new cdk.CfnOutput(this, "CertificateArn", {
    //   value: certificate.certificateArn,
    //   description: "ACM Certificate ARN being used for the custom domain",
    //   exportName: "DoulaCommonAppCertificateArn",
    // });

    // new cdk.CfnOutput(this, "InternalAccessNote", {
    //   value:
    //     "Service accessible via API Gateway (public HTTPS) or internal HTTP load balancer (VPC only). API Gateway provides HTTPS termination and public access.",
    //   description: "Service accessibility options",
    // });

    // new cdk.CfnOutput(this, "DnsSetupInstructions", {
    //   value: `Create a CNAME record: ping.business.nj.gov -> ${domainName.regionalDomainName}`,
    //   description: "DNS CNAME record needed to make the custom domain work",
    // });

    // Tags for all resources
    cdk.Tags.of(this).add("Project", "DoulaCommonAppService");
    cdk.Tags.of(this).add("Environment", "Development");
    cdk.Tags.of(this).add("ManagedBy", "CDK");
  }
}
