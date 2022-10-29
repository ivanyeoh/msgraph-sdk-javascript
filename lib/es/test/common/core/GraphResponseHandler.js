/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { __awaiter } from "tslib";
import { assert } from "chai";
import { GraphResponseHandler } from "../../../src/GraphResponseHandler";
import { ResponseType } from "../../../src/ResponseType";
describe("GraphResponseHandler.ts", () => {
    const htmlString = `<!DOCTYPE html>
                        <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <title>Testing Document</title>
                            </head>
                            <body>
                                <h1 id="test">Testing</h1>
                            </body>
                        </html>`;
    const status200 = {
        status: 200,
        statusText: "OK",
    };
    const status204 = {
        status: 204,
        statusText: "OK",
    };
    const status500 = {
        status: 500,
        statusText: "Internal Server Error",
    };
    const status202 = {
        status: 202,
        statusText: "OK",
    };
    const status200Text = {
        status: 200,
        stautsText: "OK",
        headers: {
            "Content-Type": "text/plain",
        },
    };
    const status200Json = {
        status: 200,
        stautsText: "OK",
        headers: {
            "Content-Type": "application/json",
        },
    };
    const status200Unknown = {
        status: 200,
        statusText: "OK",
        headers: {
            "Content-Type": "dummy/unknown",
        },
    };
    /* tslint:disable: no-string-literal */
    describe("convertResponse", () => {
        it("Should return empty response for the NO CONTENT (204 response)", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = new Response(undefined, status204);
            const responseValue = yield GraphResponseHandler["convertResponse"](response);
            assert.isUndefined(responseValue);
        }));
        it("Should return internal server error (500 response)", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = new Response(undefined, status500);
            const responseValue = yield GraphResponseHandler["convertResponse"](response);
            assert.isNull(responseValue);
        }));
        it("Should return empty text value for empty response", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = new Response(undefined, status202);
            const responseValue = yield GraphResponseHandler["convertResponse"](response);
            assert.isNull(responseValue);
        }));
        it("Should return text data for text/plain content-type", () => __awaiter(void 0, void 0, void 0, function* () {
            const data = "text data";
            const response = new Response(data, status200Text);
            const responseValue = yield GraphResponseHandler["convertResponse"](response);
            assert.equal(responseValue, data);
        }));
        it("Should return json data for application/json content-type", () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                test: "test",
            };
            const response = new Response(JSON.stringify(data), status200Json);
            const responseValue = yield GraphResponseHandler["convertResponse"](response);
            assert.equal(responseValue.test, data.test);
        }));
        it("Should return raw response incase of unknown content-type", () => __awaiter(void 0, void 0, void 0, function* () {
            const data = "test data";
            const response = new Response(data, status200Unknown);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const responseValue = yield GraphResponseHandler["convertResponse"](response);
            // TODO - Handle unknown responses
            // assert.equal(responseValue, data);
        }));
        it("Should return response value as text", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = new Response(htmlString, status200);
            const responseValue = yield GraphResponseHandler["convertResponse"](response, ResponseType.TEXT);
            assert.isDefined(responseValue);
            assert.equal(typeof responseValue, "string");
            assert.equal(responseValue, htmlString);
        }));
        it("Should return response value as json", () => __awaiter(void 0, void 0, void 0, function* () {
            const json = { test: "test" };
            const response = new Response(JSON.stringify(json), status200);
            const responseValue = yield GraphResponseHandler["convertResponse"](response, ResponseType.JSON);
            assert.isDefined(responseValue);
            assert.equal(responseValue.test, "test");
        }));
        it("Should return response value as text for default response type", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = new Response(htmlString, status200);
            const responseValue = yield GraphResponseHandler["convertResponse"](response);
            assert.isDefined(responseValue);
            assert.equal(typeof responseValue, "string");
            assert.equal(responseValue, htmlString);
        }));
    });
    describe("getResponse", () => {
        it("Should return a raw response", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = new Response(htmlString, status200);
            const responseValue = yield GraphResponseHandler.getResponse(response, ResponseType.RAW);
            assert.isDefined(responseValue);
            assert.isTrue(responseValue instanceof Response);
        }));
        it("Should return valid 200 OK response", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = new Response(htmlString, status200);
            const responseValue = yield GraphResponseHandler.getResponse(response, ResponseType.TEXT);
            assert.isDefined(responseValue);
        }));
    });
});
//# sourceMappingURL=GraphResponseHandler.js.map