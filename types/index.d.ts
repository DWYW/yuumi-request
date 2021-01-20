import { Interceptor } from "./interceptor";
import { QueueItmeLevel } from "./queue/item";
import { XHRCtor, XHRExtraCtor } from "./request/xhr/index";
interface StringObject {
    [key: string]: string;
}
interface YuumiRequestCtor {
    baseURI?: string;
    headers?: StringObject;
    requestMaxCount?: number;
}
export interface RequestOptions extends XHRCtor {
    level?: QueueItmeLevel;
}
export interface MethodRequestOptions extends XHRExtraCtor {
    level?: QueueItmeLevel;
}
export declare class YuumiRequest {
    baseURI: string;
    baseHeaders: StringObject;
    interceptor: Interceptor;
    constructor(config?: YuumiRequestCtor);
    request(options: RequestOptions): Promise<unknown>;
    get(path: string, params?: {
        [key: string]: number | string;
    }, options?: MethodRequestOptions): Promise<any>;
    post(path: string, data?: any, options?: MethodRequestOptions): Promise<any>;
    put(path: string, data?: any, options?: MethodRequestOptions): Promise<any>;
    delete(path: string, data?: any, options?: MethodRequestOptions): Promise<any>;
}
export { QueueItmeLevel } from './queue/item';
