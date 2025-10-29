import {
  DescribeVpcAttributeCommand,
  DescribeVpcsCommand,
  EC2Client,
  ModifyVpcAttributeCommand,
} from "@aws-sdk/client-ec2";

const client = new EC2Client({});
const { Vpcs } = await client.send(
  new DescribeVpcsCommand({
    Filters: [{ Name: "tag:Name", Values: ["DHS-DMAHS-DoulaApp-*"] }],
  }),
);

if (Vpcs === undefined || Vpcs.length !== 1) {
  throw new Error(`Could not find VPC ${JSON.stringify(Vpcs)}`);
}
const vpcId = Vpcs[0].VpcId;

const { EnableDnsSupport } = await client.send(
  new DescribeVpcAttributeCommand({
    Attribute: "enableDnsSupport",
    VpcId: vpcId,
  }),
);
const { EnableDnsHostnames } = await client.send(
  new DescribeVpcAttributeCommand({
    Attribute: "enableDnsHostnames",
    VpcId: vpcId,
  }),
);

if (EnableDnsSupport?.Value !== true || EnableDnsHostnames?.Value !== true) {
  if (EnableDnsSupport?.Value !== true) {
    await client.send(
      new ModifyVpcAttributeCommand({
        EnableDnsSupport: {
          Value: true,
        },
        VpcId: vpcId,
      }),
    );
    console.log("Set EnableDnsSupport to true");
  }
  if (EnableDnsHostnames?.Value !== true) {
    await client.send(
      new ModifyVpcAttributeCommand({
        EnableDnsHostnames: {
          Value: true,
        },
        VpcId: vpcId,
      }),
    );
    console.log("Set EnableDnsHostnames to true");
  }
} else {
  console.log("VPC already correctly configured");
}
