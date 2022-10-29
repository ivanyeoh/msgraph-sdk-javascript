"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var tslib_1 = require("tslib");
/**
 * @module Client
 */
var Constants_1 = require("./Constants");
var CustomAuthenticationProvider_1 = require("./CustomAuthenticationProvider");
var GraphRequest_1 = require("./GraphRequest");
var HTTPClient_1 = require("./HTTPClient");
var HTTPClientFactory_1 = require("./HTTPClientFactory");
var ValidatePolyFilling_1 = require("./ValidatePolyFilling");
var Client = /** @class */ (function () {
    /**
     * @private
     * @constructor
     * Creates an instance of Client
     * @param {ClientOptions} clientOptions - The options to instantiate the client object
     */
    function Client(clientOptions) {
        /**
         * @private
         * A member which stores the Client instance options
         */
        this.config = {
            baseUrl: Constants_1.GRAPH_BASE_URL,
            debugLogging: false,
            defaultVersion: Constants_1.GRAPH_API_VERSION,
        };
        (0, ValidatePolyFilling_1.validatePolyFilling)();
        for (var key in clientOptions) {
            if (Object.prototype.hasOwnProperty.call(clientOptions, key)) {
                this.config[key] = clientOptions[key];
            }
        }
        var httpClient;
        if (clientOptions.authProvider !== undefined && clientOptions.middleware !== undefined) {
            var error = new Error();
            error.name = "AmbiguityInInitialization";
            error.message = "Unable to Create Client, Please provide either authentication provider for default middleware chain or custom middleware chain not both";
            throw error;
        }
        else if (clientOptions.authProvider !== undefined) {
            httpClient = HTTPClientFactory_1.HTTPClientFactory.createWithAuthenticationProvider(clientOptions.authProvider);
        }
        else if (clientOptions.middleware !== undefined) {
            httpClient = new (HTTPClient_1.HTTPClient.bind.apply(HTTPClient_1.HTTPClient, tslib_1.__spreadArray([void 0], [].concat(clientOptions.middleware), false)))();
        }
        else {
            var error = new Error();
            error.name = "InvalidMiddlewareChain";
            error.message = "Unable to Create Client, Please provide either authentication provider for default middleware chain or custom middleware chain";
            throw error;
        }
        this.httpClient = httpClient;
    }
    /**
     * @public
     * @static
     * To create a client instance with options and initializes the default middleware chain
     * @param {Options} options - The options for client instance
     * @returns The Client instance
     */
    Client.init = function (options) {
        var clientOptions = {};
        for (var i in options) {
            if (Object.prototype.hasOwnProperty.call(options, i)) {
                clientOptions[i] = i === "authProvider" ? new CustomAuthenticationProvider_1.CustomAuthenticationProvider(options[i]) : options[i];
            }
        }
        return Client.initWithMiddleware(clientOptions);
    };
    /**
     * @public
     * @static
     * To create a client instance with the Client Options
     * @param {ClientOptions} clientOptions - The options object for initializing the client
     * @returns The Client instance
     */
    Client.initWithMiddleware = function (clientOptions) {
        return new Client(clientOptions);
    };
    /**
     * @public
     * Entry point to make requests
     * @param {string} path - The path string value
     * @returns The graph request instance
     */
    Client.prototype.api = function (path) {
        return new GraphRequest_1.GraphRequest(this.httpClient, this.config, path);
    };
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=Client.js.map