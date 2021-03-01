import * as Json from '@silver886/type-json';

export enum Type {
    CREATE = 'Create',
    UPDATE = 'Update',
    DELETE = 'Delete',
}

export interface Event {
    /* eslint-disable @typescript-eslint/naming-convention */
    /**
     * The request type is set by the AWS CloudFormation stack operation (create-stack, update-stack, or delete-stack)
     * that was initiated by the template developer for the stack that contains the custom resource.
     */
    RequestType: Type;
    /**
     * The response URL identifies a presigned S3 bucket that receives responses from the custom resource provider to AWS CloudFormation.
     */
    ResponseURL: string;
    /**
     *  The Amazon Resource Name (ARN) that identifies the stack that contains the custom resource.
     *
     *  Combining the StackId with the RequestId forms a value that you can use to uniquely identify a request on a particular custom resource.
     */
    StackId: string;
    /**
     *  A unique ID for the request.
     *
     *  Combining the StackId with the RequestId forms a value that you can use to uniquely identify a request on a particular custom resource.
     */
    RequestId: string;
    /**
     * The template developer - chosen resource type of the custom resource in the AWS CloudFormation template.
     * Custom resource type names can be up to 60 characters long and can include alphanumeric and the following characters: _@-.
     */
    ResourceType: string;
    /**
     * The template developer-chosen name (logical ID) of the custom resource in the AWS CloudFormation template.
     * This is provided to facilitate communication between the custom resource provider and the template developer.
     */
    LogicalResourceId: string;
    /**
     * A required custom resource provider-defined physical ID that is unique for that provider.
     *
     * Always sent with Update and Delete requests; never sent with Create.
     */
    PhysicalResourceId?: string;
    /**
     * This field contains the contents of the Properties object sent by the template developer.
     * Its contents are defined by the custom resource provider.
     */
    ResourceProperties?: Json.Object;
    /**
     * Used only for Update requests.
     * Contains the resource properties that were declared previous to the update request.
     */
    OldResourceProperties?: Json.Object;
    /* eslint-enable @typescript-eslint/naming-convention */
}
