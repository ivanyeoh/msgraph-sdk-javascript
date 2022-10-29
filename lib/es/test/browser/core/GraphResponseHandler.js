/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { __awaiter } from "tslib";
import { assert } from "chai";
import { DocumentType, GraphResponseHandler } from "../../../src/GraphResponseHandler";
import { ResponseType } from "../../../src/ResponseType";
/**
 * References - https://fetch.spec.whatwg.org/#responses
 */
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
    /* tslint:disable: no-string-literal */
    describe("parseDocumentResponse", () => {
        it("Should return the html string", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = new Response(htmlString, status200);
            const dom = yield GraphResponseHandler["parseDocumentResponse"](response, DocumentType.TEXT_HTML);
            assert.isDefined(dom);
            assert.instanceOf(dom, Document);
        }));
        it("Should return response value as text for text/html return type", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = new Response(htmlString, status200);
            const responseValue = yield GraphResponseHandler["convertResponse"](response, ResponseType.DOCUMENT);
            assert.isDefined(responseValue);
            assert.instanceOf(responseValue, Document);
        }));
    });
    /* tslint:enable: no-string-literal */
});
//# sourceMappingURL=GraphResponseHandler.js.map