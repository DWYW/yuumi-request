(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.YuumiRequest = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    var validator = {
        typeof: function (data) {
            return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
        },
        isFunction: function (data) {
            return this.typeof(data) === 'function';
        },
        isObject: function (data) {
            return this.typeof(data) === 'object';
        },
        isArray: function (data) {
            return this.typeof(data) === 'array';
        },
        isString: function (data) {
            return this.typeof(data) === 'string';
        },
        isEmpty: function (data) {
            return data === null || data === undefined || data === '';
        }
    };

    function getRequestFullPath(path, data) {
        if (data === void 0) { data = {}; }
        var items = [];
        var char = /\?/.test(path) ? '&' : '?';
        for (var key in data) {
            items.push(key + "=" + data[key].toString());
        }
        return /\?/.test(path) ? "" + path + char + items.join('&') : "" + path + char + items.join('&');
    }
    function createXHR(options) {
        return new Promise(function (resolve, reject) {
            var url = options.url, method = options.method, headers = options.headers, data = options.data, query = options.query, async = options.async, upload = options.upload, complete = options.complete, timeout = options.timeout, cancelToken = options.cancelToken;
            var xhr = new XMLHttpRequest();
            var sendType = '';
            xhr.open(method, getRequestFullPath(url, query), async);
            // headers
            if (headers) {
                for (var key in headers) {
                    xhr.setRequestHeader(key, headers[key]);
                    if (/application\/json/.test(headers[key])) {
                        sendType = 'json';
                    }
                }
            }
            // cancelToken
            cancelToken && cancelToken(function () {
                xhr.abort();
            });
            // events
            xhr.addEventListener('error', function (event) {
                cancelToken && cancelToken(undefined);
                reject(event);
            });
            xhr.addEventListener('abort', function (event) {
                cancelToken && cancelToken(undefined);
                reject(event);
            });
            xhr.addEventListener('timeout', function (event) {
                cancelToken && cancelToken(undefined);
                reject(event);
            });
            complete && xhr.addEventListener('loadend', complete);
            xhr.addEventListener('readystatechange', function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    cancelToken && cancelToken(undefined);
                    resolve({
                        request: options,
                        response: xhr.response
                    });
                }
            });
            // upload
            if (upload) {
                for (var event in upload) {
                    xhr.upload.addEventListener(event, upload[event]);
                }
            }
            if (timeout) {
                xhr.timeout = timeout;
            }
            // send data.
            if (method === 'GET') {
                xhr.send();
            }
            else {
                switch (sendType) {
                    case 'json':
                        xhr.send(JSON.stringify(data));
                        break;
                    default:
                        xhr.send(data);
                }
            }
        });
    }

    var NetworkRequest = /** @class */ (function () {
        function NetworkRequest(options) {
            this._baseURI = options.baseURI || '';
            // Prevent impact on the next use of the upper layer.
            this._headers = Object.assign({}, options.headers);
            this._translateRequest = [].concat(options.translateRequest || []);
            this._translateResponse = [].concat(options.translateResponse || []);
            this.setRequestID();
        }
        NetworkRequest.prototype.setRequestID = function () {
            var timeStamp = Date.now().toString(26);
            var random = Math.random().toString(26).slice(2);
            this._id = timeStamp + "." + random;
        };
        // Inspired by Axios.
        NetworkRequest.prototype.request = function (options) {
            var _this = this;
            // Initalize request config width default value.
            this._translateRequest.unshift(function (data) {
                return _this.mergeRequestConfig(data, options);
            });
            // Create http request.
            this._translateRequest.push(createXHR);
            var translate = [].concat(this._translateRequest, this._translateResponse);
            var promise = Promise.resolve({
                url: this._baseURI,
                headers: this._headers,
                async: true
            });
            while (translate.length) {
                promise = promise.then(translate.shift());
            }
            return promise;
        };
        NetworkRequest.prototype.mergeRequestConfig = function (data, options) {
            var path = options.path, method = options.method, headers = options.headers, _options = __rest(options, ["path", "method", "headers"]);
            var _method = options.method.toUpperCase();
            var _headers = {};
            if (validator.typeof(options.data) === 'formdata') {
                _headers['Content-Type'] = 'multipart/form-data';
            }
            return __assign({ url: data.url + path, method: _method, async: validator.isEmpty(data.async) ? true : data.async, headers: Object.assign({}, data.headers, headers, _headers) }, _options);
        };
        return NetworkRequest;
    }());

    var RequestQueue = /** @class */ (function () {
        function RequestQueue(options) {
            this._isRunning = false;
            this._running = [];
            this._waiting = {
                primary: [],
                secondary: []
            };
            var maximum = options.maximum, params = __rest(options, ["maximum"]);
            this._options = params;
            this.maximum = maximum || 4;
        }
        RequestQueue.prototype.addItem = function (options, resolve, reject) {
            var _this = this;
            var instance = new NetworkRequest(this._options);
            var level = options.level || 'primary';
            var complete = options.complete;
            options.complete = function () {
                complete && complete();
                // remove this from running
                var index = _this._running.findIndex(function (item) { return item._id === instance._id; });
                _this._running.splice(index, 1);
                // exec next request
                !_this._isRunning && _this.run();
            };
            this._waiting[level].push({
                options: options,
                instance: instance,
                run: function () {
                    instance.request(options).then(resolve, reject);
                    return instance;
                }
            });
            // cancelToken
            if (options.cancelToken) {
                options.cancelToken(function () {
                    var index = _this._waiting[level].findIndex(function (item) { return item.instance._id === instance._id; });
                    if (index > -1) {
                        _this._waiting[level].splice(index, 1);
                        options.cancelToken(undefined);
                    }
                });
            }
            !this._isRunning && this.run();
        };
        RequestQueue.prototype.run = function () {
            if (this._running.length >= this.maximum) {
                this._isRunning = false;
                return;
            }
            if (!this._isRunning) {
                this._isRunning = true;
            }
            var next = this._waiting.primary.shift() || this._waiting.secondary.shift();
            if (next) {
                this._running.push(next.run());
                this.run();
            }
            else {
                this._isRunning = false;
            }
        };
        return RequestQueue;
    }());

    var YuumiRequest = /** @class */ (function () {
        function YuumiRequest(options) {
            this.$queue = new RequestQueue(options);
        }
        YuumiRequest.prototype.staticMethod = function (path, options, method) {
            var level = options.level, _options = __rest(options, ["level"]);
            return this.request(Object.assign({}, _options, {
                path: path,
                level: level,
                method: method
            }));
        };
        YuumiRequest.prototype.request = function (options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.$queue.addItem(options, resolve, reject);
            });
        };
        YuumiRequest.prototype.get = function (path, options) {
            return this.staticMethod(path, options, 'GET');
        };
        YuumiRequest.prototype.post = function (path, options) {
            return this.staticMethod(path, options, 'POST');
        };
        YuumiRequest.prototype.put = function (path, options) {
            return this.staticMethod(path, options, 'PUT');
        };
        YuumiRequest.prototype.delete = function (path, options) {
            return this.staticMethod(path, options, 'DELETE');
        };
        return YuumiRequest;
    }());

    return YuumiRequest;

})));
