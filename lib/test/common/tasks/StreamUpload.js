"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
require("isomorphic-fetch");
var chai_1 = require("chai");
var stream_1 = require("stream");
var src_1 = require("../../../src");
var StreamUpload_1 = require("../../../src/tasks/FileUploadTask/FileObjectClasses/StreamUpload");
var fileName = "Test_File_Name";
describe("StreamUpload.test", function () {
    it("Should return slice with defined size less than complete range size", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var totalRangesize, sliceSize, buf, readStream, upload, slice;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    totalRangesize = 36;
                    sliceSize = 20;
                    buf = Buffer.alloc(totalRangesize, "a");
                    readStream = new stream_1.Readable({
                        read: function () {
                            this.push(buf);
                            this.push(null);
                        },
                    });
                    upload = new StreamUpload_1.StreamUpload(readStream, fileName, totalRangesize);
                    return [4 /*yield*/, upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 })];
                case 1:
                    slice = _a.sent();
                    chai_1.assert.isDefined(slice);
                    chai_1.assert.equal(sliceSize, slice.length);
                    chai_1.assert.equal(readStream.readableLength, 16);
                    return [2 /*return*/];
            }
        });
    }); });
});
it("Should return slice ", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var totalRangesize, buf, readStream, upload, slice;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                totalRangesize = 36;
                buf = Buffer.alloc(totalRangesize, "a");
                readStream = new stream_1.Readable({
                    read: function () {
                        this.push(buf);
                        this.push(null);
                    },
                });
                upload = new StreamUpload_1.StreamUpload(readStream, fileName, totalRangesize);
                return [4 /*yield*/, upload.sliceFile({ minValue: 0, maxValue: totalRangesize - 1 })];
            case 1:
                slice = _a.sent();
                chai_1.assert.isDefined(slice);
                chai_1.assert.equal(totalRangesize, slice.length);
                chai_1.assert.equal(readStream.readableLength, 0);
                return [2 /*return*/];
        }
    });
}); });
it("Should throw error if stream  ends before complete range size is read", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var totalsize, sliceSize, buf, readStream, upload, slice, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                totalsize = 6;
                sliceSize = 20;
                buf = Buffer.alloc(totalsize, "a");
                readStream = new stream_1.Readable({
                    read: function () {
                        this.push(buf);
                        this.push(null);
                    },
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                upload = new StreamUpload_1.StreamUpload(readStream, fileName, totalsize);
                return [4 /*yield*/, upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 })];
            case 2:
                slice = _a.sent();
                if (slice) {
                    throw Error("Test failed. Expected error now thrown");
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                chai_1.assert.instanceOf(err_1, src_1.GraphClientError);
                chai_1.assert.equal(err_1.message, "Stream ended before reading required range size");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=StreamUpload.js.map