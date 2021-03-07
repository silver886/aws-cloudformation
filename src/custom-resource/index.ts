import type * as Json from '@silver886/type-json';
import * as axios from 'axios';

import * as Request from './request';
import * as Response from './response';

export {Request, Response};

export class Handle {
    public readonly response: Response.Result;

    protected event: Request.Event;

    private done: boolean;

    public constructor(event: Request.Event, physicalResourceId?: string) {
        this.event = event;
        let physResId = physicalResourceId;
        if (event.RequestType === Request.Type.UPDATE || event.RequestType === Request.Type.DELETE) {
            physResId = event.PhysicalResourceId;
        }
        if (!physResId) throw new Error('Expect has PhysicalResourceId in event.');

        this.response = {
            /* eslint-disable @typescript-eslint/naming-convention */
            Status:             Response.Status.FAILED,
            PhysicalResourceId: physResId,
            StackId:            event.StackId,
            RequestId:          event.RequestId,
            LogicalResourceId:  event.LogicalResourceId,
            /* eslint-enable @typescript-eslint/naming-convention */
        };

        if (!this.response.PhysicalResourceId) throw new Error('Expect has PhysicalResourceId.');
    }

    public async failed(reason?: string): Promise<void> {
        this.checkDone();

        this.response.Status = Response.Status.FAILED;
        if (reason) {
            if (this.reason) this.reasonInsert(reason);
            else this.reason = reason;
        }

        await this.sendResponse();
        this.done = true;
    }

    public async success(reason?: string): Promise<void> {
        this.checkDone();

        this.response.Status = Response.Status.SUCCESS;
        if (reason) {
            if (this.reason) this.reasonInsert(reason);
            else this.reason = reason;
        }

        await this.sendResponse();
        this.done = true;
    }

    public get reason(): string {
        return this.response.Reason ?? '';
    }

    public set reason(reason: string) {
        this.response.Reason = reason;
    }


    public get noEcho(): boolean {
        return this.response.NoEcho ?? false;
    }

    public set noEcho(noEcho: boolean) {
        this.response.NoEcho = noEcho;
    }

    public get data(): Json.Object {
        return this.response.Data ?? {};
    }

    public set data(data: Json.Object) {
        this.response.Data = data;
    }

    public reasonInsert(reason: string): void {
        this.response.Reason = this.response.Reason ?
            `${reason} ${this.response.Reason}` :
            reason;
    }

    private checkDone(): void {
        if (this.done) throw new Error('This resource has done');
    }

    private async sendResponse(): Promise<axios.AxiosResponse> { // eslint-disable-line @typescript-eslint/no-explicit-any
        return axios.default.put(this.event.ResponseURL, this.response);
    }
}
