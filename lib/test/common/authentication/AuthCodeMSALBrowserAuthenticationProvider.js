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
var msal_browser_1 = require("@azure/msal-browser");
var chai_1 = require("chai");
var sinon = require("sinon");
var AuthCodeMSALBrowserAuthenticationProvider_1 = require("../../../src/authentication/msal-browser/AuthCodeMSALBrowserAuthenticationProvider");
describe("AuthCodeMSALBrowserAuthenticationProvider.ts", function () {
    var scopes = ["test_scopes"];
    it("AccessToken is returned correctly from getToken function", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var dummyApp, account, options, accessToken, moq, msalBrowserAuthenticationProvider, access;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dummyApp = new msal_browser_1.PublicClientApplication({
                        auth: {
                            clientId: "",
                        },
                    });
                    if (typeof dummyApp.acquireTokenSilent !== "function") {
                        throw new Error("Method definition for getToken is not found");
                    }
                    account = {
                        homeAccountId: "",
                        localAccountId: "",
                        environment: "",
                        tenantId: "",
                        username: "",
                    };
                    options = {
                        interactionType: msal_browser_1.InteractionType.Popup,
                        scopes: scopes,
                        account: account,
                    };
                    accessToken = {
                        accessToken: "dummy_valid_token",
                        account: account,
                        authority: "",
                        scopes: scopes,
                        uniqueId: "",
                        tenantId: "",
                        idToken: "",
                        idTokenClaims: null,
                        fromCache: false,
                        expiresOn: new Date(),
                        tokenType: "",
                        correlationId: ""
                    };
                    moq = sinon.mock(dummyApp);
                    moq.expects("acquireTokenSilent").resolves(accessToken);
                    msalBrowserAuthenticationProvider = new AuthCodeMSALBrowserAuthenticationProvider_1.AuthCodeMSALBrowserAuthenticationProvider(dummyApp, options);
                    return [4 /*yield*/, msalBrowserAuthenticationProvider.getAccessToken()];
                case 1:
                    access = _a.sent();
                    chai_1.assert.equal(access, accessToken.accessToken);
                    return [2 /*return*/];
            }
        });
    }); });
    it("InteractionRequiredAuthError function is handled", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var dummyApp, account, options, accessToken, moq, msalBrowserAuthenticationProvider, access;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dummyApp = new msal_browser_1.PublicClientApplication({
                        auth: {
                            clientId: "",
                        },
                    });
                    if (typeof dummyApp.acquireTokenSilent !== "function") {
                        throw new Error("Method definition for getToken is not found");
                    }
                    account = {
                        homeAccountId: "",
                        localAccountId: "",
                        environment: "",
                        tenantId: "",
                        username: "",
                    };
                    options = {
                        interactionType: msal_browser_1.InteractionType.Popup,
                        scopes: scopes,
                        account: account,
                    };
                    accessToken = {
                        accessToken: "dummy_popUp_token",
                        account: account,
                        authority: "",
                        scopes: scopes,
                        uniqueId: "",
                        tenantId: "",
                        idToken: "",
                        idTokenClaims: null,
                        fromCache: false,
                        expiresOn: new Date(),
                        tokenType: "",
                        correlationId: ""
                    };
                    moq = sinon.mock(dummyApp);
                    moq.expects("acquireTokenSilent").throws(new msal_browser_1.InteractionRequiredAuthError("TEST_ERROR"));
                    moq.expects("acquireTokenPopup").resolves(accessToken);
                    msalBrowserAuthenticationProvider = new AuthCodeMSALBrowserAuthenticationProvider_1.AuthCodeMSALBrowserAuthenticationProvider(dummyApp, options);
                    return [4 /*yield*/, msalBrowserAuthenticationProvider.getAccessToken()];
                case 1:
                    access = _a.sent();
                    chai_1.assert.equal(access, accessToken.accessToken);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=AuthCodeMSALBrowserAuthenticationProvider.js.map