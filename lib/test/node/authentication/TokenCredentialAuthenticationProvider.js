"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/*tslint:disable*/
var identity_1 = require("@azure/identity");
var chai_1 = require("chai");
var sinon = require("sinon");
var TokenCredentialAuthenticationProvider_1 = require("../../../src/authentication/azureTokenCredentials/TokenCredentialAuthenticationProvider");
describe("TokenCredentialAuthenticationProvider.ts", function () {
    var tenantId = "0000-1111-0000-1111";
    var clientId = "CLIENT_ID";
    var clientSecret = "CLIENT_SECRET";
    var scopes = ["test_scopes"];
    it("AccessToken is returned correctly from getToken function", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var client, authProviderOptions, accessToken, moq, tokenCredentialAuthenticationProvider, access;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new identity_1.ClientSecretCredential(tenantId, clientId, clientSecret);
                    if (typeof client.getToken !== "function") {
                        throw new Error("Method definition for getToken is not found");
                    }
                    authProviderOptions = {
                        getTokenOptions: null,
                        scopes: scopes,
                    };
                    accessToken = { token: "dummy_valid_token", expiresOnTimestamp: 1 };
                    moq = sinon.mock(client);
                    moq.expects("getToken").resolves(accessToken);
                    tokenCredentialAuthenticationProvider = new TokenCredentialAuthenticationProvider_1.TokenCredentialAuthenticationProvider(client, authProviderOptions);
                    return [4 /*yield*/, tokenCredentialAuthenticationProvider.getAccessToken()];
                case 1:
                    access = _a.sent();
                    chai_1.assert.equal(access, accessToken.token);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Error is thrown when accessToken cannot be retrieved from getToken function", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var expectedError, client, authProviderOptions, accessToken, moq, tokenCredentialAuthenticationProvider, access, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    client = new identity_1.ClientSecretCredential(tenantId, clientId, clientSecret);
                    if (typeof client.getToken !== "function") {
                        throw new Error("Method definition for getToken is not found");
                    }
                    authProviderOptions = {
                        getTokenOptions: null,
                        scopes: scopes,
                    };
                    accessToken = undefined;
                    moq = sinon.mock(client);
                    moq.expects("getToken").resolves(accessToken);
                    tokenCredentialAuthenticationProvider = new TokenCredentialAuthenticationProvider_1.TokenCredentialAuthenticationProvider(client, authProviderOptions);
                    return [4 /*yield*/, tokenCredentialAuthenticationProvider.getAccessToken()];
                case 1:
                    access = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    expectedError = err_1;
                    return [3 /*break*/, 3];
                case 3:
                    chai_1.assert.equal(expectedError.name, "Access token is undefined");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=TokenCredentialAuthenticationProvider.js.map