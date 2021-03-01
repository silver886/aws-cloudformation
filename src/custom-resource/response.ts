import * as Json from '@silver886/type-json';

export enum Status {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

// The total size cannot exceed 4096 bytes.
export interface Result {
    /* eslint-disable @typescript-eslint/naming-convention */
    /**
     * The status value sent by the custom resource provider in response to an AWS CloudFormation-generated request.
     */
    Status: Status;
    /**
     * Describes the reason for a failure response.
     *
     * Required if Status is FAILED.
     */
    Reason?: string;
    /**
     * This value should be an identifier unique to the custom resource vendor, and can be up to 1 Kb in size.
     * The value must be a non-empty string and must be identical for all responses for the same resource.
     */
    PhysicalResourceId: string;
    /**
     * The Amazon Resource Name (ARN) that identifies the stack that contains the custom resource.
     * This response value should be copied verbatim from the request.
     */
    StackId: string;
    /**
     * A unique ID for the request.
     * This response value should be copied verbatim from the request.
     */
    RequestId: string;
    /**
     * The template developer-chosen name (logical ID) of the custom resource in the AWS CloudFormation template.
     * This response value should be copied verbatim from the request.
     */
    LogicalResourceId: string;
    /**
     * Indicates whether to mask the output of the custom resource when retrieved by using the Fn::GetAtt function.
     * If set to true, all returned values are masked with asterisks (*****), except for those stored in the Metadata section of the template.
     * CloudFormation does not transform, modify, or redact any information you include in the Metadata section.
     *
     * The default value is false.
     *
     * For more information about using NoEcho to mask sensitive information, see the Do not embed credentials in your templates best practice.
     */
    NoEcho?: boolean;
    /**
     * The custom resource provider-defined name-value pairs to send with the response.
     * You can access the values provided here by name in the template with Fn::GetAtt.
     *
     * If the name-value pairs contain sensitive information, you should use the NoEcho field to mask the output of the custom resource.
     * Otherwise, the values are visible through APIs that surface property values (such as DescribeStackEvents).
     */
    Data?: Json.Object;
    /* eslint-enable @typescript-eslint/naming-convention */
}
