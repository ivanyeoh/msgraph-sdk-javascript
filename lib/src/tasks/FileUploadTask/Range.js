"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = void 0;
/**
 * @module Range
 */
/**
 * @class
 * Class representing Range
 */
var Range = /** @class */ (function () {
    /**
     * @public
     * @constructor
     * Creates a range for given min and max values
     * @param {number} [minVal = -1] - The minimum value.
     * @param {number} [maxVal = -1] - The maximum value.
     * @returns An instance of a Range
     */
    function Range(minVal, maxVal) {
        if (minVal === void 0) { minVal = -1; }
        if (maxVal === void 0) { maxVal = -1; }
        this.minValue = minVal;
        this.maxValue = maxVal;
    }
    return Range;
}());
exports.Range = Range;
//# sourceMappingURL=Range.js.map