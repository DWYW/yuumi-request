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

    var Interceptors = /** @class */ (function () {
        function Interceptors() {
            this.requestInterceptors = [];
            this.responseInterceptors = [];
        }
        Interceptors.prototype.request = function (resolve, reject) {
            this.requestInterceptors.push({
                resolve: resolve,
                reject: reject
            });
        };
        Interceptors.prototype.response = function (resolve, reject) {
            this.responseInterceptors.push({
                resolve: resolve,
                reject: reject
            });
        };
        return Interceptors;
    }());

    var validator = {
        is: function (input, type) {
            if (input === null || input === undefined) {
                return input === type;
            }
            var expectType = type.name || type;
            var inputType = '';
            if (input.constructor && input.constructor.hasOwnProperty('name')) {
                inputType = input.constructor.name;
            }
            return inputType === expectType;
        },
        isEmpty: function (input) {
            if (input === null || input === undefined)
                return true;
            if (input.toString) {
                var valueString = input.toString();
                return valueString === '' || valueString === 'NaN' || valueString === 'Invalid Date';
            }
            return false;
        }
    };

    var RequestQueue = /** @class */ (function () {
        function RequestQueue(options) {
            this.inExec = {
                length: 0
            };
            this.waiting = {
                high: [],
                normal: [],
                low: []
            };
            var maximum = options.maximum;
            this.maximum = maximum || 4;
        }
        RequestQueue.prototype.addItem = function (request) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                request.reject = function (reason) {
                    _this.itemCompleted(request);
                    reject(reason);
                };
                request.resolve = function (value) {
                    _this.itemCompleted(request);
                    resolve(value);
                };
                var level = request.options.level;
                if (_this.waiting[level]) {
                    _this.waiting[level].push(request);
                }
                else {
                    _this.waiting.normal.push(request);
                }
                _this.exec();
                _this.setCancelToken(request);
            });
        };
        RequestQueue.prototype.exec = function () {
            if (this.inExec.length >= this.maximum)
                return;
            var request;
            if (this.waiting.high.length) {
                request = this.waiting.high.shift();
            }
            else if (this.waiting.normal.length) {
                request = this.waiting.normal.shift();
            }
            else if (this.waiting.low.length) {
                request = this.waiting.low.shift();
            }
            if (request) {
                this.inExec.length++;
                this.inExec[request.id] = request;
                request.exec();
            }
        };
        RequestQueue.prototype.setCancelToken = function (request) {
            var _this = this;
            var _a = request.options, level = _a.level, cancelToken = _a.cancelToken;
            if (!validator.is(cancelToken, Function))
                return;
            cancelToken(function () {
                var waiting = _this.waiting[level] || _this.waiting.normal;
                var index = waiting.findIndex(function (item) { return item.id === request.id; });
                // 异步操作，防止取消后发出请求
                request.isCancel = true;
                if (index > -1) {
                    waiting.splice(index, 1);
                }
            });
        };
        RequestQueue.prototype.itemCompleted = function (request) {
            if (this.inExec[request.id]) {
                delete this.inExec[request.id];
                this.inExec.length--;
            }
            this.exec();
        };
        return RequestQueue;
    }());

    var helper = {
        params2string: function (params) {
            if (!validator.is(params, Object))
                return '';
            var items = [];
            for (var key in params) {
                var item = params[key];
                if (!validator.isEmpty(item)) {
                    items.push(key + "=" + item);
                }
            }
            return items.join('&');
        }
    };

    function getRequestURI(path, params) {
        if (params === void 0) { params = {}; }
        var joinText = /\?/.test(path) ? '&' : '?';
        return path + joinText + helper.params2string(params);
    }
    function getSendData(options) {
        var method = options.method, data = options.data, headers = options.headers;
        var sendData;
        if (/get/i.test(method) === false) {
            var contentType = headers['Content-Type'];
            if (/application\/json/i.test(contentType)) {
                sendData = JSON.stringify(data);
            }
            else {
                sendData = data;
            }
        }
        return sendData;
    }
    function setCancelToken(cancelToken, handle) {
        if (validator.is(cancelToken, Function))
            cancelToken(handle);
    }
    function bindCancel(xhr, reject) {
        xhr.addEventListener('abort', function () {
            reject(new Error('request:aborted'));
        });
    }
    function bindTimeout(xhr, reject, timeout) {
        if (validator.is(timeout, Number)) {
            xhr.timeout = timeout;
        }
        xhr.addEventListener('timeout', function () {
            reject(new Error('request:timeout'));
        });
    }
    function bindUpload(xhr, upload) {
        if (upload === void 0) { upload = {}; }
        for (var event in upload) {
            xhr.upload.addEventListener(event, upload[event]);
        }
    }
    function createXHR(options) {
        var path = options.path, method = options.method, params = options.params, data = options.data, headers = options.headers, async = options.async, timeout = options.timeout, upload = options.upload, cancelToken = options.cancelToken;
        var xhr = new XMLHttpRequest();
        return new Promise(function (resolve, reject) {
            xhr.open(method, getRequestURI(path, params), async);
            if (validator.is(data, FormData)) {
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            for (var key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }
            setCancelToken(cancelToken, function () { return (xhr.abort()); });
            bindCancel(xhr, reject);
            bindTimeout(xhr, reject, timeout);
            bindUpload(xhr, upload);
            xhr.addEventListener('error', function (e) {
                reject(e);
            });
            xhr.addEventListener('readystatechange', function () {
                if (xhr.readyState === 4 && xhr.status !== 0) {
                    resolve({
                        request: options,
                        status: xhr.status,
                        response: xhr.status === 200 ? xhr.response : undefined
                    });
                }
            });
            var sendData = getSendData(options);
            xhr.send(sendData);
        }).finally(function () {
            setCancelToken(cancelToken);
        });
    }

    var id = 0;
    var HTTPRequest = /** @class */ (function () {
        function HTTPRequest(options) {
            this.isCancel = false;
            this.id = id++;
            this.options = options;
        }
        HTTPRequest.prototype.exec = function () {
            var _this = this;
            var _a = this.options, baseURI = _a.baseURI, path = _a.path, _options = __rest(_a, ["baseURI", "path"]);
            var _path = "" + (baseURI || '') + path;
            var options = Object.assign({ path: _path }, _options);
            var promise = Promise.resolve(options).then(function (options) {
                // 如果在发送之前被取消了
                if (_this.isCancel) {
                    throw new Error('request:aborted');
                }
                return options;
            });
            this.interceptors.requestInterceptors.forEach(function (item) {
                promise = promise.then(item.resolve, item.reject);
            });
            promise = promise.then(createXHR, undefined);
            this.interceptors.responseInterceptors.forEach(function (item) {
                promise = promise.then(item.resolve, item.reject);
            });
            return promise.then(this.resolve, this.reject);
        };
        return HTTPRequest;
    }());

    var YuumiRequest = /** @class */ (function () {
        function YuumiRequest(options) {
            if (options === void 0) { options = {}; }
            this.defaults = {
                baseURI: '',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            this.interceptors = new Interceptors();
            var _a = options || {}, baseURI = _a.baseURI, headers = _a.headers, maximum = _a.maximum;
            this.defaults.baseURI = baseURI;
            this.defaults.headers = headers;
            this.queue = new RequestQueue({ maximum: maximum });
        }
        YuumiRequest.prototype.request = function (options) {
            var _headers = Object.assign({}, this.defaults.headers, options.headers);
            var _options = Object.assign({
                path: '',
                async: true,
                level: 'normal',
                method: 'GET'
            }, options, {
                baseURI: this.defaults.baseURI,
                headers: _headers
            });
            var request = new HTTPRequest(_options);
            request.interceptors = this.interceptors;
            return this.queue.addItem(request);
        };
        YuumiRequest.prototype.get = function (path, params, options) {
            var _params = options.params, _options = __rest(options, ["params"]);
            var requestParams = Object.assign({}, _params, params);
            var requestOptions = Object.assign({
                path: path,
                method: 'GET',
                params: requestParams
            }, _options);
            return this.request(requestOptions);
        };
        YuumiRequest.prototype.post = function (path, data, options) {
            var _data = options.data, _options = __rest(options, ["data"]);
            var requestData = Object.assign({}, _data, data);
            var requestOptions = Object.assign({
                path: path,
                method: 'POST',
                params: requestData
            }, _options);
            return this.request(requestOptions);
        };
        YuumiRequest.prototype.put = function (path, data, options) {
            var _data = options.data, _options = __rest(options, ["data"]);
            var requestData = Object.assign({}, _data, data);
            var requestOptions = Object.assign({
                path: path,
                method: 'PUT',
                params: requestData
            }, _options);
            return this.request(requestOptions);
        };
        YuumiRequest.prototype.delete = function (path, data, options) {
            var _data = options.data, _options = __rest(options, ["data"]);
            var requestData = Object.assign({}, _data, data);
            var requestOptions = Object.assign({
                path: path,
                method: 'DELETE',
                params: requestData
            }, _options);
            return this.request(requestOptions);
        };
        return YuumiRequest;
    }());

    return YuumiRequest;

})));
