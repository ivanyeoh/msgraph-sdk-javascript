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
var StreamUpload_1 = require("../../../src/tasks/FileUploadTask/FileObjectClasses/StreamUpload");
var fileName = "sample_image.jpg";
var filePath = "./test/sample_files/".concat(fileName);
var stats = fs.statSync("./test/sample_files/".concat(fileName));
var totalsize = stats.size;
describe("StreamUpload", function () {
    it("Stream size smaller than upload range size", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var readStream, sliceSize, upload, slice;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readStream = fs.createReadStream("./test/sample_files/".concat(fileName), { highWaterMark: 8 });
                    sliceSize = 200;
                    upload = new StreamUpload_1.StreamUpload(readStream, fileName, totalsize);
                    return [4 /*yield*/, upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 })];
                case 1:
                    slice = _a.sent();
                    chai_1.assert.isDefined(slice);
                    chai_1.assert.equal(sliceSize, slice.length);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Stream size greater than upload range size", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var readStream, sliceSize, upload, slice;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readStream = fs.createReadStream(filePath, { highWaterMark: 200 });
                    sliceSize = 100;
                    upload = new StreamUpload_1.StreamUpload(readStream, fileName, totalsize);
                    return [4 /*yield*/, upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 })];
                case 1:
                    slice = _a.sent();
                    chai_1.assert.isDefined(slice);
                    chai_1.assert.equal(sliceSize, slice.length);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Stream size with complete file and greater than upload range size", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var readStream, sliceSize, upload, slice;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readStream = fs.createReadStream(filePath, { highWaterMark: totalsize });
                    sliceSize = 100;
                    upload = new StreamUpload_1.StreamUpload(readStream, fileName, totalsize);
                    return [4 /*yield*/, upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 })];
                case 1:
                    slice = _a.sent();
                    chai_1.assert.isDefined(slice);
                    chai_1.assert.equal(sliceSize, slice.length);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("Stream upload resume", function () {
    it("New range is equal to previous upload range", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var readStream, sliceSize, upload, slice, retrySlice;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readStream = fs.createReadStream(filePath, { highWaterMark: totalsize });
                    sliceSize = 20;
                    upload = new StreamUpload_1.StreamUpload(readStream, fileName, totalsize);
                    return [4 /*yield*/, upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 })];
                case 1:
                    slice = _a.sent();
                    return [4 /*yield*/, upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 })];
                case 2:
                    retrySlice = _a.sent();
                    chai_1.assert.isDefined(slice);
                    chai_1.assert.isDefined(retrySlice);
                    chai_1.assert.equal(Buffer.compare(slice, retrySlice), 0);
                    return [2 /*return*/];
            }
        });
    }); });
    it("New Range.Minimum greater than previous Range.Minimum and new Range.Maximum is equal previous Range.Maximum", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var readStream, sliceSize, upload, retryRangeMin, slice, retrySlice;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readStream = fs.createReadStream(filePath, { highWaterMark: totalsize });
                    sliceSize = 20;
                    upload = new StreamUpload_1.StreamUpload(readStream, fileName, totalsize);
                    retryRangeMin = 15;
                    return [4 /*yield*/, upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 })];
                case 1:
                    slice = _a.sent();
                    return [4 /*yield*/, upload.sliceFile({ minValue: 15, maxValue: sliceSize - 1 })];
                case 2:
                    retrySlice = _a.sent();
                    chai_1.assert.isDefined(slice);
                    chai_1.assert.isDefined(retrySlice);
                    chai_1.assert.equal(sliceSize, slice.length);
                    chai_1.assert.equal(Buffer.compare(slice.slice(retryRangeMin, sliceSize), retrySlice), 0);
                    return [2 /*return*/];
            }
        });
    }); });
    it("New Range.Minimum greater than previous Range.Minimum and new Range.Maximum is greater than previous Range.Maximum", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var readStream, sliceSize, retryRangeMin, retryRangeMax, upload, slice, retrySlice;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readStream = fs.createReadStream(filePath, { highWaterMark: totalsize });
                    sliceSize = 20;
                    retryRangeMin = 15;
                    retryRangeMax = 21;
                    upload = new StreamUpload_1.StreamUpload(readStream, fileName, totalsize);
                    return [4 /*yield*/, upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 })];
                case 1:
                    slice = _a.sent();
                    return [4 /*yield*/, upload.sliceFile({ minValue: retryRangeMin, maxValue: retryRangeMax })];
                case 2:
                    retrySlice = (_a.sent());
                    chai_1.assert.isDefined(slice);
                    chai_1.assert.isDefined(retrySlice);
                    chai_1.assert.equal(retrySlice.length, retryRangeMax - retryRangeMin + 1);
                    chai_1.assert.equal(Buffer.compare(slice.slice(retryRangeMin, sliceSize), retrySlice.slice(0, sliceSize - retryRangeMin)), 0);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=StreamUpload.js.map