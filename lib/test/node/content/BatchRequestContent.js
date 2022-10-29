"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("isomorphic-fetch");
var chai_1 = require("chai");
var fs = require("fs");
var BatchRequestContent_1 = require("../../../src/content/BatchRequestContent");
describe("BatchRequestContent.ts", function () {
    describe("getContent", function () {
        it("Should return image's base64 string", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var fileName;
            return tslib_1.__generator(this, function (_a) {
                fileName = "sample_image.jpg";
                fs.readFile("./test/sample_files/".concat(fileName), {}, function (err, file) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    var uploadOneDriveFile, batchReq, content;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err) {
                                    throw err;
                                }
                                uploadOneDriveFile = {
                                    id: "1",
                                    request: new Request("/me/drive/root:/Documents/".concat(fileName, ":/content"), {
                                        method: "PUT",
                                        headers: {
                                            "Content-type": "image/jpg",
                                        },
                                        body: file,
                                    }),
                                };
                                batchReq = new BatchRequestContent_1.BatchRequestContent([uploadOneDriveFile]);
                                return [4 /*yield*/, batchReq.getContent()];
                            case 1:
                                content = _a.sent();
                                chai_1.assert.isDefined(content.requests[0].body);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
    });
});
//# sourceMappingURL=BatchRequestContent.js.map