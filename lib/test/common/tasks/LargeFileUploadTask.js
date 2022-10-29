"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-unused-vars */
var chai_1 = require("chai");
var sinon = require("sinon");
var src_1 = require("../../../src");
var UploadResult_1 = require("../../../src/tasks/FileUploadTask/UploadResult");
var LargeFileUploadTask_1 = require("../../../src/tasks/LargeFileUploadTask");
var test_helper_1 = require("../../test-helper");
describe("LargeFileUploadTask.ts", function () {
    var rangeSize = 327680;
    var uploadSession = {
        url: "test url",
        expiry: new Date(),
    };
    describe("Parsing Range", function () {
        var name = "sample_image.jpg";
        var arrayBuffer = new ArrayBuffer(80000);
        var size = 100000;
        var options = {};
        var fileObj = new src_1.FileUpload(arrayBuffer, name, size);
        var uploadTask = new LargeFileUploadTask_1.LargeFileUploadTask((0, test_helper_1.getClient)(), fileObj, uploadSession, options);
        it("Should return default range for given undefined range", function (done) {
            var range = uploadTask["parseRange"]([]);
            chai_1.assert.equal(range.minValue, -1);
            chai_1.assert.equal(range.maxValue, -1);
            done();
        });
        it("Should return default range for given empty range", function (done) {
            var range = uploadTask["parseRange"]([""]);
            chai_1.assert.equal(range.minValue, -1);
            chai_1.assert.equal(range.maxValue, -1);
            done();
        });
        it("Should return valid range for given range with from and to values", function (done) {
            var range = uploadTask["parseRange"](["100-200"]);
            chai_1.assert.equal(range.minValue, 100);
            chai_1.assert.equal(range.maxValue, 200);
            done();
        });
        it("Should return valid range for given range without to value", function (done) {
            var range = uploadTask["parseRange"](["0-"]);
            chai_1.assert.equal(range.minValue, 0);
            chai_1.assert.equal(range.maxValue, 99999);
            done();
        });
    });
    describe("Update Task Status", function () {
        var name = "sample_image.jpg";
        var arrayBuffer = new ArrayBuffer(80000);
        var size = 100000;
        var options = {};
        var fileObj = new src_1.FileUpload(arrayBuffer, name, size);
        var uploadTask = new LargeFileUploadTask_1.LargeFileUploadTask((0, test_helper_1.getClient)(), fileObj, uploadSession, options);
        it("Should update status with expiration date and next expected ranges as given", function (done) {
            var statusResponse = {
                expirationDateTime: "2018-08-06T09:05:45.195Z",
                nextExpectedRanges: ["100-2000"],
            };
            uploadTask["updateTaskStatus"](statusResponse);
            chai_1.assert.equal(uploadTask["nextRange"].minValue, 100);
            chai_1.assert.equal(uploadTask["nextRange"].maxValue, 2000);
            done();
        });
        it("Should update status with given expiration date and (fileSize - 1) for next expected range maxValue", function (done) {
            var statusResponse = {
                expirationDateTime: "2018-08-06T09:05:45.195Z",
                nextExpectedRanges: ["100-"],
            };
            uploadTask["updateTaskStatus"](statusResponse);
            chai_1.assert.equal(uploadTask["nextRange"].minValue, 100);
            chai_1.assert.equal(uploadTask["nextRange"].maxValue, 99999);
            done();
        });
    });
    describe("GetNextRange", function () {
        var name = "sample_image.jpg";
        var arrayBuffer = new ArrayBuffer(80000);
        var size = 328680;
        var options = {
            rangeSize: rangeSize,
        };
        var fileObj = new src_1.FileUpload(arrayBuffer, name, size);
        var uploadTask = new LargeFileUploadTask_1.LargeFileUploadTask((0, test_helper_1.getClient)(), fileObj, uploadSession, options);
        it("Should return proper next range well within the file size", function (done) {
            var nextRange = uploadTask.getNextRange();
            chai_1.assert.equal(nextRange.minValue, 0);
            chai_1.assert.equal(nextRange.maxValue, 327679);
            done();
        });
        it("Should return next range maxValue equal to the file size", function (done) {
            var statusResponse = {
                expirationDateTime: "2018-08-06T09:05:45.195Z",
                nextExpectedRanges: ["327680-"],
            };
            uploadTask["updateTaskStatus"](statusResponse);
            var nextRange = uploadTask.getNextRange();
            chai_1.assert.equal(nextRange.minValue, 327680);
            chai_1.assert.equal(nextRange.maxValue, 328679);
            done();
        });
        it("Should return next range as default(empty) range, this is for the upload task completed", function (done) {
            var statusResponse = {
                expirationDateTime: "2018-08-06T09:05:45.195Z",
                nextExpectedRanges: [],
            };
            uploadTask["updateTaskStatus"](statusResponse);
            var nextRange = uploadTask.getNextRange();
            chai_1.assert.equal(nextRange.minValue, -1);
            chai_1.assert.equal(nextRange.maxValue, -1);
            done();
        });
    });
    describe("Upload File", function () {
        var name = "sample_image.jpg";
        var arrayBuffer = new ArrayBuffer(80000);
        var size = 328680;
        var options = {
            rangeSize: 327680,
        };
        var fileObj = new src_1.FileUpload(arrayBuffer, name, size);
        var location = "TEST_URL";
        var body = {
            id: "TEST_ID",
        };
        it("Should return a Upload Result object after a completed task with 201 status", function () {
            var location = "TEST_URL";
            it("Test with progressCallback", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var isProgressReportCalled, progress, uploadEventHandlers, optionsWithProgress, emptyBody, uploadTask, status201, rawResponse, moq, result;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isProgressReportCalled = false;
                            progress = function (range) {
                                isProgressReportCalled = true;
                            };
                            uploadEventHandlers = {
                                progress: progress,
                            };
                            optionsWithProgress = {
                                rangeSize: rangeSize,
                                uploadEventHandlers: uploadEventHandlers,
                            };
                            emptyBody = {};
                            uploadTask = new LargeFileUploadTask_1.LargeFileUploadTask((0, test_helper_1.getClient)(), fileObj, uploadSession, optionsWithProgress);
                            status201 = {
                                status: 201,
                                statusText: "OK",
                                headers: {
                                    "Content-Type": "application/json",
                                    location: location,
                                },
                            };
                            rawResponse = new Response(JSON.stringify(emptyBody), status201);
                            moq = sinon.mock(uploadTask);
                            moq.expects("uploadSliceGetRawResponse").resolves(rawResponse);
                            return [4 /*yield*/, uploadTask.upload()];
                        case 1:
                            result = _a.sent();
                            chai_1.assert.isDefined(result);
                            chai_1.assert.instanceOf(result, UploadResult_1.UploadResult);
                            chai_1.assert.equal(result["location"], location);
                            chai_1.assert.isTrue(isProgressReportCalled);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Test without progress callback", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var uploadTask, status201, rawResponse, moq, result, responseBody;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            uploadTask = new LargeFileUploadTask_1.LargeFileUploadTask((0, test_helper_1.getClient)(), fileObj, uploadSession, options);
                            status201 = {
                                status: 201,
                                statusText: "OK",
                                headers: {
                                    "Content-Type": "application/json",
                                    location: location,
                                },
                            };
                            rawResponse = new Response(JSON.stringify(body), status201);
                            moq = sinon.mock(uploadTask);
                            moq.expects("uploadSliceGetRawResponse").resolves(rawResponse);
                            return [4 /*yield*/, uploadTask.upload()];
                        case 1:
                            result = _a.sent();
                            chai_1.assert.isDefined(result);
                            chai_1.assert.instanceOf(result, UploadResult_1.UploadResult);
                            chai_1.assert.equal(result["location"], location);
                            responseBody = result["responseBody"];
                            chai_1.assert.isDefined(responseBody);
                            chai_1.assert.equal(responseBody["id"], "TEST_ID");
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it("Should return a Upload Result object after a completed task with 200 status and body", function () {
            it("Test with progress callback", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var isProgressReportCalled, progress, uploadEventHandlers, optionsWithProgress, uploadTask, status200, rawResponse, moq, result, responseBody;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isProgressReportCalled = false;
                            progress = function (range) {
                                isProgressReportCalled = true;
                            };
                            uploadEventHandlers = {
                                progress: progress,
                            };
                            optionsWithProgress = {
                                rangeSize: rangeSize,
                                uploadEventHandlers: uploadEventHandlers,
                            };
                            uploadTask = new LargeFileUploadTask_1.LargeFileUploadTask((0, test_helper_1.getClient)(), fileObj, uploadSession, optionsWithProgress);
                            status200 = {
                                status: 200,
                                statusText: "OK",
                                headers: {
                                    "Content-Type": "application/json",
                                    location: location,
                                },
                            };
                            rawResponse = new Response(JSON.stringify(body), status200);
                            moq = sinon.mock(uploadTask);
                            moq.expects("uploadSliceGetRawResponse").resolves(rawResponse);
                            return [4 /*yield*/, uploadTask.upload()];
                        case 1:
                            result = _a.sent();
                            chai_1.assert.isDefined(result);
                            chai_1.assert.instanceOf(result, UploadResult_1.UploadResult);
                            chai_1.assert.equal(result["location"], location);
                            responseBody = result["responseBody"];
                            chai_1.assert.isDefined(responseBody);
                            chai_1.assert.equal(responseBody["id"], "TEST_ID");
                            chai_1.assert.isFalse(isProgressReportCalled);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Test without progress callback", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var uploadTask, status200, rawResponse, moq, result, responseBody;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            uploadTask = new LargeFileUploadTask_1.LargeFileUploadTask((0, test_helper_1.getClient)(), fileObj, uploadSession, options);
                            status200 = {
                                status: 200,
                                statusText: "OK",
                                headers: {
                                    "Content-Type": "application/json",
                                    location: location,
                                },
                            };
                            rawResponse = new Response(JSON.stringify(body), status200);
                            moq = sinon.mock(uploadTask);
                            moq.expects("uploadSliceGetRawResponse").resolves(rawResponse);
                            return [4 /*yield*/, uploadTask.upload()];
                        case 1:
                            result = _a.sent();
                            chai_1.assert.isDefined(result);
                            chai_1.assert.instanceOf(result, UploadResult_1.UploadResult);
                            chai_1.assert.equal(result["location"], location);
                            responseBody = result["responseBody"];
                            chai_1.assert.isDefined(responseBody);
                            chai_1.assert.equal(responseBody["id"], "TEST_ID");
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it("Should return an exception while trying to upload the file upload completed task", function (done) {
            var statusResponse = {
                expirationDateTime: "2018-08-06T09:05:45.195Z",
                nextExpectedRanges: [],
            };
            var uploadTask = new LargeFileUploadTask_1.LargeFileUploadTask((0, test_helper_1.getClient)(), fileObj, uploadSession, options);
            uploadTask["updateTaskStatus"](statusResponse);
            uploadTask
                .upload()
                .then(function () {
                throw new Error("Test Failed - Upload is working for upload completed task");
            })
                .catch(function (err) {
                chai_1.assert.equal(err.name, "Invalid Session");
                chai_1.assert.equal(err.message, "Task with which you are trying to upload is already completed, Please check for your uploaded file");
                done();
            });
        });
    });
});
//# sourceMappingURL=LargeFileUploadTask.js.map