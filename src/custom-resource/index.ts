import * as Json from '@silver886/type-json';
import * as axios from 'axios';

import * as Request from './request';
import * as Response from './response';

export { Request, Response };

export class Handle {
    public readonly response: Response.Result;

    private done: boolean;

    constructor(protected event: Request.Event, physicalResourceId?: string) {
        if (event.RequestType === Request.Type.UPDATE || event.RequestType === Request.Type.DELETE) {
            physicalResourceId = event.PhysicalResourceId;
        }
        if (!physicalResourceId) throw new Error('Expect has PhysicalResourceId in event.');

        this.response = {
            /* eslint-disable @typescript-eslint/naming-convention */
            Status: Response.Status.FAILED,
            PhysicalResourceId: physicalResourceId,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            /* eslint-enable @typescript-eslint/naming-convention */
        };

        if (!this.response.PhysicalResourceId) throw new Error('Expect has PhysicalResourceId.');
    }

    async failed(reason?: string): Promise<void> {
        this.checkDone();

        this.response.Status = Response.Status.FAILED;
        if (reason) {
            if (this.reason) this.reasonInsert(reason);
            else this.reason = reason;
        }

        await this.sendResponse();
        this.done = true;
    }

    async success(reason?: string): Promise<void> {
        this.checkDone();

        this.response.Status = Response.Status.SUCCESS;
        if (reason) {
            if (this.reason) this.reasonInsert(reason);
            else this.reason = reason;
        }

        await this.sendResponse();
        this.done = true;
    }

    get reason(): string {
        return this.response.Reason ?
            this.response.Reason :
            '';
    }

    set reason(reason: string) {
        this.response.Reason = reason;
    }


    get noEcho(): boolean {
        return this.response.NoEcho ?
            this.response.NoEcho :
            false;
    }

    set noEcho(noEcho: boolean) {
        this.response.NoEcho = noEcho;
    }

    get data(): Json.Object {
        return this.response.Data ?
            this.response.Data :
            {};
    }

    set data(data: Json.Object) {
        this.response.Data = data;
    }

    reasonInsert(reason: string): void {
        this.response.Reason = this.response.Reason ?
            reason + ' ' + this.response.Reason :
            reason;
    }

    private checkDone(): void {
        if (this.done) throw new Error('This resource has done');
    }


    private sendResponse(): Promise<axios.AxiosResponse<any>> { // eslint-disable-line @typescript-eslint/no-explicit-any
        return axios.default.put(this.event.ResponseURL, this.response);
    }
}
