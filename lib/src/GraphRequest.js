"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphRequest = void 0;
var tslib_1 = require("tslib");
/**
 * @module GraphRequest
 */
var GraphClientError_1 = require("./GraphClientError");
var GraphErrorHandler_1 = require("./GraphErrorHandler");
var GraphRequestUtil_1 = require("./GraphRequestUtil");
var GraphResponseHandler_1 = require("./GraphResponseHandler");
var MiddlewareControl_1 = require("./middleware/MiddlewareControl");
var RequestMethod_1 = require("./RequestMethod");
var ResponseType_1 = require("./ResponseType");
/**
 * @class
 * A Class representing GraphRequest
 */
var GraphRequest = /** @class */ (function () {
    /**
     * @public
     * @constructor
     * Creates an instance of GraphRequest
     * @param {HTTPClient} httpClient - The HTTPClient instance
     * @param {ClientOptions} config - The options for making request
     * @param {string} path - A path string
     */
    function GraphRequest(httpClient, config, path) {
        var _this = this;
        /**
         * @private
         * Parses the path string and creates URLComponents out of it
         * @param {string} path - The request path string
         * @returns Nothing
         */
        this.parsePath = function (path) {
            // Strips out the base of the url if they passed in
            if (path.indexOf("https://") !== -1) {
                path = path.replace("https://", "");
                // Find where the host ends
                var endOfHostStrPos = path.indexOf("/");
                if (endOfHostStrPos !== -1) {
                    // Parse out the host
                    _this.urlComponents.host = "https://" + path.substring(0, endOfHostStrPos);
                    // Strip the host from path
                    path = path.substring(endOfHostStrPos + 1, path.length);
                }
                // Remove the following version
                var endOfVersionStrPos = path.indexOf("/");
                if (endOfVersionStrPos !== -1) {
                    // Parse out the version
                    _this.urlComponents.version = path.substring(0, endOfVersionStrPos);
                    // Strip version from path
                    path = path.substring(endOfVersionStrPos + 1, path.length);
                }
            }
            // Strip out any leading "/"
            if (path.charAt(0) === "/") {
                path = path.substr(1);
            }
            var queryStrPos = path.indexOf("?");
            if (queryStrPos === -1) {
                // No query string
                _this.urlComponents.path = path;
            }
            else {
                _this.urlComponents.path = path.substr(0, queryStrPos);
                // Capture query string into oDataQueryParams and otherURLQueryParams
                var queryParams = path.substring(queryStrPos + 1, path.length).split("&");
                for (var _i = 0, queryParams_1 = queryParams; _i < queryParams_1.length; _i++) {
                    var queryParam = queryParams_1[_i];
                    _this.parseQueryParameter(queryParam);
                }
            }
        };
        this.httpClient = httpClient;
        this.config = config;
        this.urlComponents = {
            host: this.config.baseUrl,
            version: this.config.defaultVersion,
            oDataQueryParams: {},
            otherURLQueryParams: {},
            otherURLQueryOptions: [],
        };
        this._headers = {};
        this._options = {};
        this._middlewareOptions = [];
        this.parsePath(path);
    }
    /**
     * @private
     * Adds the query parameter as comma separated values
     * @param {string} propertyName - The name of a property
     * @param {string|string[]} propertyValue - The vale of a property
     * @param {IArguments} additionalProperties - The additional properties
     * @returns Nothing
     */
    GraphRequest.prototype.addCsvQueryParameter = function (propertyName, propertyValue, additionalProperties) {
        // If there are already $propertyName value there, append a ","
        this.urlComponents.oDataQueryParams[propertyName] = this.urlComponents.oDataQueryParams[propertyName] ? this.urlComponents.oDataQueryParams[propertyName] + "," : "";
        var allValues = [];
        if (additionalProperties.length > 1 && typeof propertyValue === "string") {
            allValues = Array.prototype.slice.call(additionalProperties);
        }
        else if (typeof propertyValue === "string") {
            allValues.push(propertyValue);
        }
        else {
            allValues = allValues.concat(propertyValue);
        }
        this.urlComponents.oDataQueryParams[propertyName] += allValues.join(",");
    };
    /**
     * @private
     * Builds the full url from the URLComponents to make a request
     * @returns The URL string that is qualified to make a request to graph endpoint
     */
    GraphRequest.prototype.buildFullUrl = function () {
        var url = (0, GraphRequestUtil_1.urlJoin)([this.urlComponents.host, this.urlComponents.version, this.urlComponents.path]) + this.createQueryString();
        if (this.config.debugLogging) {
            console.log(url);
        }
        return url;
    };
    /**
     * @private
     * Builds the query string from the URLComponents
     * @returns The Constructed query string
     */
    GraphRequest.prototype.createQueryString = function () {
        // Combining query params from oDataQueryParams and otherURLQueryParams
        var urlComponents = this.urlComponents;
        var query = [];
        if (Object.keys(urlComponents.oDataQueryParams).length !== 0) {
            for (var property in urlComponents.oDataQueryParams) {
                if (Object.prototype.hasOwnProperty.call(urlComponents.oDataQueryParams, property)) {
                    query.push(property + "=" + urlComponents.oDataQueryParams[property]);
                }
            }
        }
        if (Object.keys(urlComponents.otherURLQueryParams).length !== 0) {
            for (var property in urlComponents.otherURLQueryParams) {
                if (Object.prototype.hasOwnProperty.call(urlComponents.otherURLQueryParams, property)) {
                    query.push(property + "=" + urlComponents.otherURLQueryParams[property]);
                }
            }
        }
        if (urlComponents.otherURLQueryOptions.length !== 0) {
            for (var _i = 0, _a = urlComponents.otherURLQueryOptions; _i < _a.length; _i++) {
                var str = _a[_i];
                query.push(str);
            }
        }
        return query.length > 0 ? "?" + query.join("&") : "";
    };
    /**
     * @private
     * Parses the query parameters to set the urlComponents property of the GraphRequest object
     * @param {string|KeyValuePairObjectStringNumber} queryDictionaryOrString - The query parameter
     * @returns The same GraphRequest instance that is being called with
     */
    GraphRequest.prototype.parseQueryParameter = function (queryDictionaryOrString) {
        if (typeof queryDictionaryOrString === "string") {
            if (queryDictionaryOrString.charAt(0) === "?") {
                queryDictionaryOrString = queryDictionaryOrString.substring(1);
            }
            if (queryDictionaryOrString.indexOf("&") !== -1) {
                var queryParams = queryDictionaryOrString.split("&");
                for (var _i = 0, queryParams_2 = queryParams; _i < queryParams_2.length; _i++) {
                    var str = queryParams_2[_i];
                    this.parseQueryParamenterString(str);
                }
            }
            else {
                this.parseQueryParamenterString(queryDictionaryOrString);
            }
        }
        else if (queryDictionaryOrString.constructor === Object) {
            for (var key in queryDictionaryOrString) {
                if (Object.prototype.hasOwnProperty.call(queryDictionaryOrString, key)) {
                    this.setURLComponentsQueryParamater(key, queryDictionaryOrString[key]);
                }
            }
        }
        return this;
    };
    /**
     * @private
     * Parses the query parameter of string type to set the urlComponents property of the GraphRequest object
     * @param {string} queryParameter - the query parameters
     * returns nothing
     */
    GraphRequest.prototype.parseQueryParamenterString = function (queryParameter) {
        /* The query key-value pair must be split on the first equals sign to avoid errors in parsing nested query parameters.
                 Example-> "/me?$expand=home($select=city)" */
        if (this.isValidQueryKeyValuePair(queryParameter)) {
            var indexOfFirstEquals = queryParameter.indexOf("=");
            var paramKey = queryParameter.substring(0, indexOfFirstEquals);
            var paramValue = queryParameter.substring(indexOfFirstEquals + 1);
            this.setURLComponentsQueryParamater(paramKey, paramValue);
        }
        else {
            /* Push values which are not of key-value structure.
            Example-> Handle an invalid input->.query(test), .query($select($select=name)) and let the Graph API respond with the error in the URL*/
            this.urlComponents.otherURLQueryOptions.push(queryParameter);
        }
    };
    /**
     * @private
     * Sets values into the urlComponents property of GraphRequest object.
     * @param {string} paramKey - the query parameter key
     * @param {string} paramValue - the query paramter value
     * @returns nothing
     */
    GraphRequest.prototype.setURLComponentsQueryParamater = function (paramKey, paramValue) {
        if (GraphRequestUtil_1.oDataQueryNames.indexOf(paramKey) !== -1) {
            var currentValue = this.urlComponents.oDataQueryParams[paramKey];
            var isValueAppendable = currentValue && (paramKey === "$expand" || paramKey === "$select" || paramKey === "$orderby");
            this.urlComponents.oDataQueryParams[paramKey] = isValueAppendable ? currentValue + "," + paramValue : paramValue;
        }
        else {
            this.urlComponents.otherURLQueryParams[paramKey] = paramValue;
        }
    };
    /**
     * @private
     * Check if the query parameter string has a valid key-value structure
     * @param {string} queryString - the query parameter string. Example -> "name=value"
     * #returns true if the query string has a valid key-value structure else false
     */
    GraphRequest.prototype.isValidQueryKeyValuePair = function (queryString) {
        var indexofFirstEquals = queryString.indexOf("=");
        if (indexofFirstEquals === -1) {
            return false;
        }
        var indexofOpeningParanthesis = queryString.indexOf("(");
        if (indexofOpeningParanthesis !== -1 && queryString.indexOf("(") < indexofFirstEquals) {
            // Example -> .query($select($expand=true));
            return false;
        }
        return true;
    };
    /**
     * @private
     * Updates the custom headers and options for a request
     * @param {FetchOptions} options - The request options object
     * @returns Nothing
     */
    GraphRequest.prototype.updateRequestOptions = function (options) {
        var optionsHeaders = tslib_1.__assign({}, options.headers);
        if (this.config.fetchOptions !== undefined) {
            var fetchOptions = tslib_1.__assign({}, this.config.fetchOptions);
            Object.assign(options, fetchOptions);
            if (typeof this.config.fetchOptions.headers !== undefined) {
                options.headers = tslib_1.__assign({}, this.config.fetchOptions.headers);
            }
        }
        Object.assign(options, this._options);
        if (options.headers !== undefined) {
            Object.assign(optionsHeaders, options.headers);
        }
        Object.assign(optionsHeaders, this._headers);
        options.headers = optionsHeaders;
    };
    /**
     * @private
     * @async
     * Adds the custom headers and options to the request and makes the HTTPClient send request call
     * @param {RequestInfo} request - The request url string or the Request object value
     * @param {FetchOptions} options - The options to make a request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the response content
     */
    GraphRequest.prototype.send = function (request, options, callback) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var rawResponse, middlewareControl, customHosts, context_1, response, error_1, statusCode, gError;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        middlewareControl = new MiddlewareControl_1.MiddlewareControl(this._middlewareOptions);
                        this.updateRequestOptions(options);
                        customHosts = (_a = this.config) === null || _a === void 0 ? void 0 : _a.customHosts;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 6]);
                        return [4 /*yield*/, this.httpClient.sendRequest({
                                request: request,
                                options: options,
                                middlewareControl: middlewareControl,
                                customHosts: customHosts,
                            })];
                    case 2:
                        context_1 = _b.sent();
                        rawResponse = context_1.response;
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler.getResponse(rawResponse, this._responseType, callback)];
                    case 3:
                        response = _b.sent();
                        return [2 /*return*/, response];
                    case 4:
                        error_1 = _b.sent();
                        if (error_1 instanceof GraphClientError_1.GraphClientError) {
                            throw error_1;
                        }
                        statusCode = void 0;
                        if (rawResponse) {
                            statusCode = rawResponse.status;
                        }
                        return [4 /*yield*/, GraphErrorHandler_1.GraphErrorHandler.getError(error_1, statusCode, callback)];
                    case 5:
                        gError = _b.sent();
                        throw gError;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @private
     * Checks if the content-type is present in the _headers property. If not present, defaults the content-type to application/json
     * @param none
     * @returns nothing
     */
    GraphRequest.prototype.setHeaderContentType = function () {
        if (!this._headers) {
            this.header("Content-Type", "application/json");
            return;
        }
        var headerKeys = Object.keys(this._headers);
        for (var _i = 0, headerKeys_1 = headerKeys; _i < headerKeys_1.length; _i++) {
            var headerKey = headerKeys_1[_i];
            if (headerKey.toLowerCase() === "content-type") {
                return;
            }
        }
        // Default the content-type to application/json in case the content-type is not present in the header
        this.header("Content-Type", "application/json");
    };
    /**
     * @public
     * Sets the custom header for a request
     * @param {string} headerKey - A header key
     * @param {string} headerValue - A header value
     * @returns The same GraphRequest instance that is being called with
     */
    GraphRequest.prototype.header = function (headerKey, headerValue) {
        this._headers[headerKey] = headerValue;
        return this;
    };
    /**
     * @public
     * Sets the custom headers for a request
     * @param {KeyValuePairObjectStringNumber | HeadersInit} headers - The request headers
     * @returns The same GraphRequest instance that is being called with
     */
    GraphRequest.prototype.headers = function (headers) {
        for (var key in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, key)) {
                this._headers[key] = headers[key];
            }
        }
        return this;
    };
    /**
     * @public
     * Sets the option for making a request
     * @param {string} key - The key value
     * @param {any} value - The value
     * @returns The same GraphRequest instance that is being called with
     */
    GraphRequest.prototype.option = function (key, value) {
        this._options[key] = value;
        return this;
    };
    /**
     * @public
     * Sets the options for making a request
     * @param {{ [key: string]: any }} options - The options key value pair
     * @returns The same GraphRequest instance that is being called with
     */
    GraphRequest.prototype.options = function (options) {
        for (var key in options) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                this._options[key] = options[key];
            }
        }
        return this;
    };
    /**
     * @public
     * Sets the middleware options for a request
     * @param {MiddlewareOptions[]} options - The array of middleware options
     * @returns The same GraphRequest instance that is being called with
     */
    GraphRequest.prototype.middlewareOptions = function (options) {
        this._middlewareOptions = options;
        return this;
    };
    /**
     * @public
     * Sets the api endpoint version for a request
     * @param {string} version - The version value
     * @returns The same GraphRequest instance that is being called with
     */
    GraphRequest.prototype.version = function (version) {
        this.urlComponents.version = version;
        return this;
    };
    /**
     * @public
     * Sets the api endpoint version for a request
     * @param {ResponseType} responseType - The response type value
     * @returns The same GraphRequest instance that is being called with
     */
    GraphRequest.prototype.responseType = function (responseType) {
        this._responseType = responseType;
        return this;
    };
    /**
     * @public
     * To add properties for select OData Query param
     * @param {string|string[]} properties - The Properties value
     * @returns The same GraphRequest instance that is being called with, after adding the properties for $select query
     */
    /*
     * Accepts .select("displayName,birthday")
     *     and .select(["displayName", "birthday"])
     *     and .select("displayName", "birthday")
     *
     */
    GraphRequest.prototype.select = function (properties) {
        this.addCsvQueryParameter("$select", properties, arguments);
        return this;
    };
    /**
     * @public
     * To add properties for expand OData Query param
     * @param {string|string[]} properties - The Properties value
     * @returns The same GraphRequest instance that is being called with, after adding the properties for $expand query
     */
    GraphRequest.prototype.expand = function (properties) {
        this.addCsvQueryParameter("$expand", properties, arguments);
        return this;
    };
    /**
     * @public
     * To add properties for orderby OData Query param
     * @param {string|string[]} properties - The Properties value
     * @returns The same GraphRequest instance that is being called with, after adding the properties for $orderby query
     */
    GraphRequest.prototype.orderby = function (properties) {
        this.addCsvQueryParameter("$orderby", properties, arguments);
        return this;
    };
    /**
     * @public
     * To add query string for filter OData Query param. The request URL accepts only one $filter Odata Query option and its value is set to the most recently passed filter query string.
     * @param {string} filterStr - The filter query string
     * @returns The same GraphRequest instance that is being called with, after adding the $filter query
     */
    GraphRequest.prototype.filter = function (filterStr) {
        this.urlComponents.oDataQueryParams.$filter = filterStr;
        return this;
    };
    /**
     * @public
     * To add criterion for search OData Query param. The request URL accepts only one $search Odata Query option and its value is set to the most recently passed search criterion string.
     * @param {string} searchStr - The search criterion string
     * @returns The same GraphRequest instance that is being called with, after adding the $search query criteria
     */
    GraphRequest.prototype.search = function (searchStr) {
        this.urlComponents.oDataQueryParams.$search = searchStr;
        return this;
    };
    /**
     * @public
     * To add number for top OData Query param. The request URL accepts only one $top Odata Query option and its value is set to the most recently passed number value.
     * @param {number} n - The number value
     * @returns The same GraphRequest instance that is being called with, after adding the number for $top query
     */
    GraphRequest.prototype.top = function (n) {
        this.urlComponents.oDataQueryParams.$top = n;
        return this;
    };
    /**
     * @public
     * To add number for skip OData Query param. The request URL accepts only one $skip Odata Query option and its value is set to the most recently passed number value.
     * @param {number} n - The number value
     * @returns The same GraphRequest instance that is being called with, after adding the number for the $skip query
     */
    GraphRequest.prototype.skip = function (n) {
        this.urlComponents.oDataQueryParams.$skip = n;
        return this;
    };
    /**
     * @public
     * To add token string for skipToken OData Query param. The request URL accepts only one $skipToken Odata Query option and its value is set to the most recently passed token value.
     * @param {string} token - The token value
     * @returns The same GraphRequest instance that is being called with, after adding the token string for $skipToken query option
     */
    GraphRequest.prototype.skipToken = function (token) {
        this.urlComponents.oDataQueryParams.$skipToken = token;
        return this;
    };
    /**
     * @public
     * To add boolean for count OData Query param. The URL accepts only one $count Odata Query option and its value is set to the most recently passed boolean value.
     * @param {boolean} isCount - The count boolean
     * @returns The same GraphRequest instance that is being called with, after adding the boolean value for the $count query option
     */
    GraphRequest.prototype.count = function (isCount) {
        if (isCount === void 0) { isCount = true; }
        this.urlComponents.oDataQueryParams.$count = isCount.toString();
        return this;
    };
    /**
     * @public
     * Appends query string to the urlComponent
     * @param {string|KeyValuePairObjectStringNumber} queryDictionaryOrString - The query value
     * @returns The same GraphRequest instance that is being called with, after appending the query string to the url component
     */
    /*
     * Accepts .query("displayName=xyz")
     *     and .select({ name: "value" })
     */
    GraphRequest.prototype.query = function (queryDictionaryOrString) {
        return this.parseQueryParameter(queryDictionaryOrString);
    };
    /**
     * @public
     * @async
     * Makes a http request with GET method
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the get response
     */
    GraphRequest.prototype.get = function (callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, options, response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.buildFullUrl();
                        options = {
                            method: RequestMethod_1.RequestMethod.GET,
                        };
                        return [4 /*yield*/, this.send(url, options, callback)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * @public
     * @async
     * Makes a http request with POST method
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the post response
     */
    GraphRequest.prototype.post = function (content, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, options, className;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.buildFullUrl();
                        options = {
                            method: RequestMethod_1.RequestMethod.POST,
                            body: (0, GraphRequestUtil_1.serializeContent)(content),
                        };
                        className = content && content.constructor && content.constructor.name;
                        if (className === "FormData") {
                            // Content-Type headers should not be specified in case the of FormData type content
                            options.headers = {};
                        }
                        else {
                            this.setHeaderContentType();
                            options.headers = this._headers;
                        }
                        return [4 /*yield*/, this.send(url, options, callback)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @public
     * @async
     * Alias for Post request call
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the post response
     */
    GraphRequest.prototype.create = function (content, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post(content, callback)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @public
     * @async
     * Makes http request with PUT method
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the put response
     */
    GraphRequest.prototype.put = function (content, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.buildFullUrl();
                        this.setHeaderContentType();
                        options = {
                            method: RequestMethod_1.RequestMethod.PUT,
                            body: (0, GraphRequestUtil_1.serializeContent)(content),
                        };
                        return [4 /*yield*/, this.send(url, options, callback)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @public
     * @async
     * Makes http request with PATCH method
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the patch response
     */
    GraphRequest.prototype.patch = function (content, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.buildFullUrl();
                        this.setHeaderContentType();
                        options = {
                            method: RequestMethod_1.RequestMethod.PATCH,
                            body: (0, GraphRequestUtil_1.serializeContent)(content),
                        };
                        return [4 /*yield*/, this.send(url, options, callback)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @public
     * @async
     * Alias for PATCH request
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the patch response
     */
    GraphRequest.prototype.update = function (content, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.patch(content, callback)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @public
     * @async
     * Makes http request with DELETE method
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the delete response
     */
    GraphRequest.prototype.delete = function (callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.buildFullUrl();
                        options = {
                            method: RequestMethod_1.RequestMethod.DELETE,
                        };
                        return [4 /*yield*/, this.send(url, options, callback)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @public
     * @async
     * Alias for delete request call
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the delete response
     */
    GraphRequest.prototype.del = function (callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.delete(callback)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @public
     * @async
     * Makes a http request with GET method to read response as a stream.
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the getStream response
     */
    GraphRequest.prototype.getStream = function (callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.buildFullUrl();
                        options = {
                            method: RequestMethod_1.RequestMethod.GET,
                        };
                        this.responseType(ResponseType_1.ResponseType.STREAM);
                        return [4 /*yield*/, this.send(url, options, callback)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @public
     * @async
     * Makes a http request with GET method to read response as a stream.
     * @param {any} stream - The stream instance
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the putStream response
     */
    GraphRequest.prototype.putStream = function (stream, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.buildFullUrl();
                        options = {
                            method: RequestMethod_1.RequestMethod.PUT,
                            headers: {
                                "Content-Type": "application/octet-stream",
                            },
                            body: stream,
                        };
                        return [4 /*yield*/, this.send(url, options, callback)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return GraphRequest;
}());
exports.GraphRequest = GraphRequest;
//# sourceMappingURL=GraphRequest.js.map