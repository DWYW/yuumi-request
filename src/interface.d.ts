export declare type _RequestMethod = 'GET' | 'get' | 'POST' | 'post' | 'PUT'| 'put' | 'DELETE' | 'delete'
export declare type _RequestLevel = 'primary' | 'secondary'

export declare interface _object<T> {
  [key: string]: T
}

declare interface _RequestExtra {
  headers?: _object<string>;
  query?: _object<string|number>;
  data?: any;
  upload?: {
    loadstart: () => any;
    progress: () => any;
    load: () => any
  };
  complete?: () => any;
  timeout?: number;
  cancelToken?: (cancel: (() => void)| undefined) => void;
}

export declare interface _RequestOptions extends _RequestExtra {
  path: string;
  method: _RequestMethod;
  async?: boolean;
}

export declare interface createXHROptions extends _RequestExtra {
  url: string;
  method: _RequestMethod;
  async: boolean;
}

export declare interface _NetworkRequestCtor {
  baseURI?: string;
  headers?: _object<string>;
  translateRequest?: ((request: any) => any)[];
  translateResponse?: ((response: any) => any)[];
}

export declare interface _RequestQueueCtor extends _NetworkRequestCtor{
  maximum?: number
}

export declare interface _RequestQueueAddItemOptions extends _RequestOptions {
  level?: _RequestLevel
}

export declare interface _YuumiRequestCtor extends _RequestQueueCtor {}

export declare interface _NoMethodRequestOptions extends _RequestExtra {
  level?: _RequestLevel
}
