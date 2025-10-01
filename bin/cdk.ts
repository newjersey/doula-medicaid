#!/usr/bin/env node

/**
 * AWS CDK Application Entry Point for Doula Common App Service
 *
 * This file serves as the main entry point for the AWS CDK application, responsible for
 * bootstrapping the infrastructure deployment process. It creates the CDK app instance and
 * instantiates the Doula Common App stack with appropriate configuration for different environments.
 *
 * The application supports environment-specific deployments and follows AWS CDK best practices for
 * infrastructure as code. Environment configuration is determined through CDK context variables and
 * AWS CLI configuration.
 *
 * @version 1.2.0
 * @file CDK application bootstrap and stack instantiation
 * @example
 *   ```bash
 *   # Deploy to default environment
 *   cdk deploy
 *
 *   # Deploy to specific account and region
 *   cdk deploy --context account=123456789012 --context region=us-east-1
 *
 *   # Synthesize CloudFormation template
 *   cdk synth
 *   ```;
 *
 * @see {@link https://docs.aws.amazon.com/cdk/latest/guide/} AWS CDK Developer Guide
 */

import * as cdk from "aws-cdk-lib";
import { CdkStack } from "../lib/cdk-stack.js";

/**
 * Main CDK application instance
 *
 * Creates the root CDK application that serves as the container for all stacks and constructs in
 * this deployment. The app handles synthesis, deployment, and destruction of infrastructure.
 */
const app = new cdk.App();

/**
 * Ping API Service Infrastructure Stack
 *
 * Deploys a complete, production-ready infrastructure for the Ping API service including:
 *
 * - VPC with public/private subnets
 * - Application Load Balancer
 * - Security groups and IAM roles
 * - CloudWatch monitoring
 *
 * The stack is configured for the AWS account and region specified in the CDK context or AWS CLI
 * configuration. For production deployments, specify explicit account and region values.
 */
new CdkStack(app, "DoulaCommonAppStack", {
  /**
   * Environment Configuration
   *
   * For production deployments, uncomment and specify explicit account and region: env: { account:
   * '123456789012', region: 'us-east-1' }
   *
   * For environment-agnostic deployments that work across accounts/regions: Leave env undefined
   * (current configuration)
   *
   * To use current AWS CLI configuration: env: { account: process.env.CDK_DEFAULT_ACCOUNT, region:
   * process.env.CDK_DEFAULT_REGION }
   */
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },

  /**
   * Stack Description
   *
   * Provides metadata about the stack purpose and contents for CloudFormation console and AWS
   * resource management.
   */
  description: "Infrastructure for Doula Common App Service - includes ALB and ECS",

  /**
   * Stack Tags
   *
   * Apply consistent tagging across all resources for cost allocation, resource management, and
   * compliance tracking.
   */
  tags: {
    Project: "DoulaCommonAppService",
    Owner: "NewJerseyInnovation",
    Environment: process.env.NODE_ENV ?? "development",
    ManagedBy: "CDK",
    CostCenter: "Innovation",
  },
});
