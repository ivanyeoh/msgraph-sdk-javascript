import { __awaiter } from "tslib";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/*tslint:disable*/
import { ClientSecretCredential } from "@azure/identity";
import { assert } from "chai";
import * as sinon from "sinon";
import { TokenCredentialAuthenticationProvider } from "../../../src/authentication/azureTokenCredentials/TokenCredentialAuthenticationProvider";
describe("TokenCredentialAuthenticationProvider.ts", () => {
    const tenantId = "0000-1111-0000-1111";
    const clientId = "CLIENT_ID";
    const clientSecret = "CLIENT_SECRET";
    const scopes = ["test_scopes"];
    it("AccessToken is returned correctly from getToken function", () => __awaiter(void 0, void 0, void 0, function* () {
        const client = new ClientSecretCredential(tenantId, clientId, clientSecret);
        if (typeof client.getToken !== "function") {
            throw new Error("Method definition for getToken is not found");
        }
        const authProviderOptions = {
            getTokenOptions: null,
            scopes,
        };
        const accessToken = { token: "dummy_valid_token", expiresOnTimestamp: 1 };
        const moq = sinon.mock(client);
        moq.expects("getToken").resolves(accessToken);
        const tokenCredentialAuthenticationProvider = new TokenCredentialAuthenticationProvider(client, authProviderOptions);
        const access = yield tokenCredentialAuthenticationProvider.getAccessToken();
        assert.equal(access, accessToken.token);
    }));
    it("Error is thrown when accessToken cannot be retrieved from getToken function", () => __awaiter(void 0, void 0, void 0, function* () {
        let expectedError;
        try {
            const client = new ClientSecretCredential(tenantId, clientId, clientSecret);
            if (typeof client.getToken !== "function") {
                throw new Error("Method definition for getToken is not found");
            }
            const authProviderOptions = {
                getTokenOptions: null,
                scopes,
            };
            const accessToken = undefined;
            const moq = sinon.mock(client);
            moq.expects("getToken").resolves(accessToken);
            const tokenCredentialAuthenticationProvider = new TokenCredentialAuthenticationProvider(client, authProviderOptions);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const access = yield tokenCredentialAuthenticationProvider.getAccessToken();
        }
        catch (err) {
            expectedError = err;
        }
        assert.equal(expectedError.name, "Access token is undefined");
    }));
});
//# sourceMappingURL=TokenCredentialAuthenticationProvider.js.map