import { _YuumiRequestCtor, _RequestQueueAddItemOptions, _NoMethodRequestOptions, _RequestQueueCtor } from '../src/interface'

declare class RequestQueue {
  constructor (options: _RequestQueueCtor);
  addItem (
    options: _RequestQueueAddItemOptions,
    resolve: (value?: any) => void,
    reject: (value?: any) => void
  ): void;
}

export default class YuumiRequest {
  constructor (options: _YuumiRequestCtor);
  $queue: RequestQueue;
  request (options: _RequestQueueAddItemOptions): Promise<any>;
  get (path: string, options?: _NoMethodRequestOptions): Promise<any>
  post (path: string, options?: _NoMethodRequestOptions): Promise<any>
  put (path: string, options?: _NoMethodRequestOptions): Promise<any>
  delete (path: string, options?: _NoMethodRequestOptions): Promise<any>
}