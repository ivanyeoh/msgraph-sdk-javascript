"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var GraphResponseHandler_1 = require("../../../src/GraphResponseHandler");
var ResponseType_1 = require("../../../src/ResponseType");
/**
 * References - https://fetch.spec.whatwg.org/#responses
 */
describe("GraphResponseHandler.ts", function () {
    var htmlString = "<!DOCTYPE html>\n                        <html lang=\"en\">\n                            <head>\n                                <meta charset=\"UTF-8\">\n                                <title>Testing Document</title>\n                            </head>\n                            <body>\n                                <h1 id=\"test\">Testing</h1>\n                            </body>\n                        </html>";
    var status200 = {
        status: 200,
        statusText: "OK",
    };
    /* tslint:disable: no-string-literal */
    describe("parseDocumentResponse", function () {
        it("Should return the html string", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var response, dom;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = new Response(htmlString, status200);
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler["parseDocumentResponse"](response, GraphResponseHandler_1.DocumentType.TEXT_HTML)];
                    case 1:
                        dom = _a.sent();
                        chai_1.assert.isDefined(dom);
                        chai_1.assert.instanceOf(dom, Document);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should return response value as text for text/html return type", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var response, responseValue;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = new Response(htmlString, status200);
                        return [4 /*yield*/, GraphResponseHandler_1.GraphResponseHandler["convertResponse"](response, ResponseType_1.ResponseType.DOCUMENT)];
                    case 1:
                        responseValue = _a.sent();
                        chai_1.assert.isDefined(responseValue);
                        chai_1.assert.instanceOf(responseValue, Document);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    /* tslint:enable: no-string-literal */
});
//# sourceMappingURL=GraphResponseHandler.js.map