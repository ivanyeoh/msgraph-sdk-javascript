/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { __awaiter } from "tslib";
import "isomorphic-fetch";
import { assert } from "chai";
import * as fs from "fs";
import { StreamUpload } from "../../../src/tasks/FileUploadTask/FileObjectClasses/StreamUpload";
const fileName = "sample_image.jpg";
const filePath = `./test/sample_files/${fileName}`;
const stats = fs.statSync(`./test/sample_files/${fileName}`);
const totalsize = stats.size;
describe("StreamUpload", () => {
    it("Stream size smaller than upload range size", () => __awaiter(void 0, void 0, void 0, function* () {
        const readStream = fs.createReadStream(`./test/sample_files/${fileName}`, { highWaterMark: 8 });
        const sliceSize = 200;
        const upload = new StreamUpload(readStream, fileName, totalsize);
        const slice = yield upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 });
        assert.isDefined(slice);
        assert.equal(sliceSize, slice.length);
    }));
    it("Stream size greater than upload range size", () => __awaiter(void 0, void 0, void 0, function* () {
        const readStream = fs.createReadStream(filePath, { highWaterMark: 200 });
        const sliceSize = 100;
        const upload = new StreamUpload(readStream, fileName, totalsize);
        const slice = yield upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 });
        assert.isDefined(slice);
        assert.equal(sliceSize, slice.length);
    }));
    it("Stream size with complete file and greater than upload range size", () => __awaiter(void 0, void 0, void 0, function* () {
        const readStream = fs.createReadStream(filePath, { highWaterMark: totalsize });
        const sliceSize = 100;
        const upload = new StreamUpload(readStream, fileName, totalsize);
        const slice = yield upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 });
        assert.isDefined(slice);
        assert.equal(sliceSize, slice.length);
    }));
});
describe("Stream upload resume", () => {
    it("New range is equal to previous upload range", () => __awaiter(void 0, void 0, void 0, function* () {
        const readStream = fs.createReadStream(filePath, { highWaterMark: totalsize });
        const sliceSize = 20;
        const upload = new StreamUpload(readStream, fileName, totalsize);
        const slice = yield upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 });
        const retrySlice = yield upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 });
        assert.isDefined(slice);
        assert.isDefined(retrySlice);
        assert.equal(Buffer.compare(slice, retrySlice), 0);
    }));
    it("New Range.Minimum greater than previous Range.Minimum and new Range.Maximum is equal previous Range.Maximum", () => __awaiter(void 0, void 0, void 0, function* () {
        const readStream = fs.createReadStream(filePath, { highWaterMark: totalsize });
        const sliceSize = 20;
        const upload = new StreamUpload(readStream, fileName, totalsize);
        const retryRangeMin = 15;
        const slice = yield upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 });
        const retrySlice = yield upload.sliceFile({ minValue: 15, maxValue: sliceSize - 1 });
        assert.isDefined(slice);
        assert.isDefined(retrySlice);
        assert.equal(sliceSize, slice.length);
        assert.equal(Buffer.compare(slice.slice(retryRangeMin, sliceSize), retrySlice), 0);
    }));
    it("New Range.Minimum greater than previous Range.Minimum and new Range.Maximum is greater than previous Range.Maximum", () => __awaiter(void 0, void 0, void 0, function* () {
        const readStream = fs.createReadStream(filePath, { highWaterMark: totalsize });
        const sliceSize = 20;
        const retryRangeMin = 15;
        const retryRangeMax = 21;
        const upload = new StreamUpload(readStream, fileName, totalsize);
        const slice = yield upload.sliceFile({ minValue: 0, maxValue: sliceSize - 1 });
        const retrySlice = (yield upload.sliceFile({ minValue: retryRangeMin, maxValue: retryRangeMax }));
        assert.isDefined(slice);
        assert.isDefined(retrySlice);
        assert.equal(retrySlice.length, retryRangeMax - retryRangeMin + 1);
        assert.equal(Buffer.compare(slice.slice(retryRangeMin, sliceSize), retrySlice.slice(0, sliceSize - retryRangeMin)), 0);
    }));
});
//# sourceMappingURL=StreamUpload.js.map