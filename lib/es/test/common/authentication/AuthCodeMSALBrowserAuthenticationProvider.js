import { __awaiter } from "tslib";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/*tslint:disable*/
import { InteractionRequiredAuthError, InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { assert } from "chai";
import * as sinon from "sinon";
import { AuthCodeMSALBrowserAuthenticationProvider } from "../../../src/authentication/msal-browser/AuthCodeMSALBrowserAuthenticationProvider";
describe("AuthCodeMSALBrowserAuthenticationProvider.ts", () => {
    const scopes = ["test_scopes"];
    it("AccessToken is returned correctly from getToken function", () => __awaiter(void 0, void 0, void 0, function* () {
        const dummyApp = new PublicClientApplication({
            auth: {
                clientId: "",
            },
        });
        if (typeof dummyApp.acquireTokenSilent !== "function") {
            throw new Error("Method definition for getToken is not found");
        }
        const account = {
            homeAccountId: "",
            localAccountId: "",
            environment: "",
            tenantId: "",
            username: "",
        };
        const options = {
            interactionType: InteractionType.Popup,
            scopes,
            account,
        };
        const accessToken = {
            accessToken: "dummy_valid_token",
            account,
            authority: "",
            scopes,
            uniqueId: "",
            tenantId: "",
            idToken: "",
            idTokenClaims: null,
            fromCache: false,
            expiresOn: new Date(),
            tokenType: "",
            correlationId: ""
        };
        const moq = sinon.mock(dummyApp);
        moq.expects("acquireTokenSilent").resolves(accessToken);
        const msalBrowserAuthenticationProvider = new AuthCodeMSALBrowserAuthenticationProvider(dummyApp, options);
        const access = yield msalBrowserAuthenticationProvider.getAccessToken();
        assert.equal(access, accessToken.accessToken);
    }));
    it("InteractionRequiredAuthError function is handled", () => __awaiter(void 0, void 0, void 0, function* () {
        const dummyApp = new PublicClientApplication({
            auth: {
                clientId: "",
            },
        });
        if (typeof dummyApp.acquireTokenSilent !== "function") {
            throw new Error("Method definition for getToken is not found");
        }
        const account = {
            homeAccountId: "",
            localAccountId: "",
            environment: "",
            tenantId: "",
            username: "",
        };
        const options = {
            interactionType: InteractionType.Popup,
            scopes,
            account,
        };
        const accessToken = {
            accessToken: "dummy_popUp_token",
            account,
            authority: "",
            scopes,
            uniqueId: "",
            tenantId: "",
            idToken: "",
            idTokenClaims: null,
            fromCache: false,
            expiresOn: new Date(),
            tokenType: "",
            correlationId: ""
        };
        const moq = sinon.mock(dummyApp);
        moq.expects("acquireTokenSilent").throws(new InteractionRequiredAuthError("TEST_ERROR"));
        moq.expects("acquireTokenPopup").resolves(accessToken);
        const msalBrowserAuthenticationProvider = new AuthCodeMSALBrowserAuthenticationProvider(dummyApp, options);
        const access = yield msalBrowserAuthenticationProvider.getAccessToken();
        assert.equal(access, accessToken.accessToken);
    }));
});
//# sourceMappingURL=AuthCodeMSALBrowserAuthenticationProvider.js.map