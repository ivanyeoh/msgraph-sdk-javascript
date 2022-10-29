"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var OneDriveLargeFileUploadTask_1 = require("../../../src/tasks/OneDriveLargeFileUploadTask");
describe("OneDriveLargeFileUploadTask.ts", function () {
    describe("constructCreateSessionUrl", function () {
        var spaceFileName = " test.png ";
        var fileName = "test.png";
        var specialFileName = "test file.png";
        var encodedFileName = "test%20file.png";
        it("Should trim the extra spaces in the filename", function () {
            chai_1.assert.equal("/me/drive/root:/".concat(fileName, ":/createUploadSession"), OneDriveLargeFileUploadTask_1.OneDriveLargeFileUploadTask["constructCreateSessionUrl"](spaceFileName));
        });
        it("Should encode space in the filename", function () {
            chai_1.assert.equal("/me/drive/root:/".concat(encodedFileName, ":/createUploadSession"), OneDriveLargeFileUploadTask_1.OneDriveLargeFileUploadTask["constructCreateSessionUrl"](specialFileName));
        });
        it("Should return url with default root value", function () {
            chai_1.assert.equal("/me/drive/root:/".concat(fileName, ":/createUploadSession"), OneDriveLargeFileUploadTask_1.OneDriveLargeFileUploadTask["constructCreateSessionUrl"](fileName));
        });
        it("Should return url with default root value for an empty path string", function () {
            chai_1.assert.equal("/me/drive/root:/".concat(fileName, ":/createUploadSession"), OneDriveLargeFileUploadTask_1.OneDriveLargeFileUploadTask["constructCreateSessionUrl"](fileName, ""));
        });
        it("Should add / in front of the path", function () {
            chai_1.assert.equal("/me/drive/root:/Documents/".concat(fileName, ":/createUploadSession"), OneDriveLargeFileUploadTask_1.OneDriveLargeFileUploadTask["constructCreateSessionUrl"](fileName, "Documents/"));
        });
        it("Should add / in back of the path", function () {
            chai_1.assert.equal("/me/drive/root:/Documents/".concat(fileName, ":/createUploadSession"), OneDriveLargeFileUploadTask_1.OneDriveLargeFileUploadTask["constructCreateSessionUrl"](fileName, "/Documents"));
        });
        it("Should trim the extra spaces in the path", function () {
            chai_1.assert.equal("/me/drive/root:/Documents/".concat(fileName, ":/createUploadSession"), OneDriveLargeFileUploadTask_1.OneDriveLargeFileUploadTask["constructCreateSessionUrl"](fileName, " /Documents/ "));
        });
    });
    describe("getFileInfo", function () {
        /* tslint:disable: no-string-literal */
        it("Should return file content info for Buffer", function () {
            var bytes = [1, 2, 3, 4, 5];
            var buffer = Buffer.from(bytes);
            var fileContent = OneDriveLargeFileUploadTask_1.OneDriveLargeFileUploadTask["getFileInfo"](buffer, "test.png");
            var arrayBuffer = new ArrayBuffer(bytes.length);
            var typedArray = new Uint8Array(arrayBuffer);
            for (var i = 0; i < bytes.length; i++) {
                typedArray[i] = bytes[i];
            }
            chai_1.assert.deepEqual(fileContent, { content: arrayBuffer, size: bytes.length });
        });
        /* tslint:enable: no-string-literal */
    });
});
//# sourceMappingURL=OneDriveLargeFileUploadTask.js.map