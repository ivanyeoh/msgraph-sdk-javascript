/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { assert } from "chai";
import { Range } from "../../../src/tasks/FileUploadTask/Range";
describe("Range.ts", () => {
    describe("Constructor", () => {
        const defaultValue = -1;
        it("Should create a Range instance with given min and max values", () => {
            const min = 1;
            const max = 10;
            const range = new Range(min, max);
            assert.equal(range.minValue, min);
            assert.equal(range.maxValue, max);
        });
        it("Should create a range instance with default values", () => {
            const range = new Range();
            assert.equal(range.minValue, defaultValue);
            assert.equal(range.maxValue, defaultValue);
        });
        it("Should create a range instance with default max value", () => {
            const min = 1;
            const range = new Range(min);
            assert.equal(range.minValue, min);
            assert.equal(range.maxValue, defaultValue);
        });
    });
});
//# sourceMappingURL=Range.js.map