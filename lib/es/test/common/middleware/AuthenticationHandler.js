/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { __awaiter } from "tslib";
import { assert } from "chai";
import { ChaosHandler, ChaosHandlerOptions, ChaosStrategy } from "../../../src";
import { GRAPH_BASE_URL } from "../../../src/Constants";
import { AuthenticationHandler } from "../../../src/middleware/AuthenticationHandler";
import { DummyAuthenticationProvider } from "../../DummyAuthenticationProvider";
const dummyAuthProvider = new DummyAuthenticationProvider();
const authHandler = new AuthenticationHandler(dummyAuthProvider);
const chaosHandler = new ChaosHandler(new ChaosHandlerOptions(ChaosStrategy.MANUAL, "TEST_MESSAGE", 200));
describe("AuthenticationHandler.ts", () => __awaiter(void 0, void 0, void 0, function* () {
    describe("Constructor", () => {
        it("Should return an AuthenticationHandler for given AuthenticationProvider", () => {
            assert.isTrue(authHandler instanceof AuthenticationHandler);
            assert.equal(authHandler["authenticationProvider"], dummyAuthProvider);
        });
    });
    describe("Auth Headers", () => {
        it("Should delete Auth header when Request object is passed with non Graph URL", () => __awaiter(void 0, void 0, void 0, function* () {
            const request = new Request("test_url");
            const context = {
                request,
                options: {
                    headers: {
                        Authorization: "TEST_VALUE",
                    },
                },
            };
            authHandler.setNext(chaosHandler);
            yield authHandler.execute(context);
            assert.equal(context.options.headers["Authorization"], undefined);
        }));
        it("Should contain Auth header when Request object is passed with custom URL", () => __awaiter(void 0, void 0, void 0, function* () {
            const request = new Request("https://custom/");
            const context = {
                request,
                customHosts: new Set(["custom"]),
                options: {
                    headers: {},
                },
            };
            const accessToken = "Bearer DUMMY_TOKEN";
            yield authHandler.execute(context);
            assert.equal(request.headers.get("Authorization"), accessToken);
        }));
        it("Should contain Auth header when Request object is passed with a valid Graph URL", () => __awaiter(void 0, void 0, void 0, function* () {
            const request = new Request(GRAPH_BASE_URL);
            const context = {
                request,
                customHosts: new Set(["custom"]),
                options: {
                    headers: {},
                },
            };
            const accessToken = "Bearer DUMMY_TOKEN";
            yield authHandler.execute(context);
            assert.equal(request.headers.get("Authorization"), accessToken);
        }));
    });
}));
//# sourceMappingURL=AuthenticationHandler.js.map