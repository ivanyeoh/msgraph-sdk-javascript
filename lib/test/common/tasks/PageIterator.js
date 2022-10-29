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
var PageIterator_1 = require("../../../src/tasks/PageIterator");
var test_helper_1 = require("../../test-helper");
var client = (0, test_helper_1.getClient)();
var value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var getPageCollection = function () {
    return {
        value: tslib_1.__spreadArray([], value, true),
        additionalContent: "additional content",
    };
};
var getPageCollectionWithNext = function () {
    return {
        value: tslib_1.__spreadArray([], value, true),
        "@odata.nextLink": "nextURL",
        additionalContent: "additional content",
    };
};
var getEmptyPageCollection = function () {
    return {
        value: [],
    };
};
var getEmptyPageCollectionWithNext = function () {
    return {
        value: [],
        "@odata.nextLink": "nextURL",
    };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var truthyCallback = function (data) {
    return true;
};
var halfWayCallbackCounter = 5;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var halfWayCallback = function (data) {
    halfWayCallbackCounter--;
    if (halfWayCallbackCounter === 0) {
        return false;
    }
    else {
        return true;
    }
};
describe("PageIterator.ts", function () {
    describe("Constructor", function () {
        it("Should create instance without nextLink", function () {
            var pageIterator = new PageIterator_1.PageIterator(client, getPageCollection(), truthyCallback);
            (0, chai_1.assert)(pageIterator instanceof PageIterator_1.PageIterator);
        });
        it("Should create instance with nextLink", function () {
            var pageIterator = new PageIterator_1.PageIterator(client, getPageCollectionWithNext(), truthyCallback);
            (0, chai_1.assert)(pageIterator instanceof PageIterator_1.PageIterator);
        });
    });
    describe("iterate", function () {
        it("Should iterate over a complete collection without nextLink", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var pageIterator;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pageIterator = new PageIterator_1.PageIterator(client, getPageCollection(), truthyCallback);
                        return [4 /*yield*/, pageIterator.iterate()];
                    case 1:
                        _a.sent();
                        chai_1.assert.isTrue(pageIterator.isComplete());
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should not mutate the collection", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var collection, pageIterator;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = getPageCollection();
                        pageIterator = new PageIterator_1.PageIterator(client, collection, truthyCallback);
                        return [4 /*yield*/, pageIterator.iterate()];
                    case 1:
                        _a.sent();
                        chai_1.assert.deepEqual(collection, getPageCollection());
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should not iterate over an empty collection", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var pageIterator;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pageIterator = new PageIterator_1.PageIterator(client, getEmptyPageCollection(), truthyCallback);
                        halfWayCallbackCounter = 1;
                        return [4 /*yield*/, pageIterator.iterate()];
                    case 1:
                        _a.sent();
                        chai_1.assert.equal(halfWayCallbackCounter, 1);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should break in the middle way", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var pageIterator;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pageIterator = new PageIterator_1.PageIterator(client, getPageCollection(), halfWayCallback);
                        halfWayCallbackCounter = 5;
                        return [4 /*yield*/, pageIterator.iterate()];
                    case 1:
                        _a.sent();
                        chai_1.assert.isFalse(pageIterator.isComplete());
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("iterationHelper", function () {
        it("Should return true for empty collection with next link", function () {
            var pageIterator = new PageIterator_1.PageIterator(client, getEmptyPageCollectionWithNext(), truthyCallback);
            var advance = pageIterator["iterationHelper"]();
            chai_1.assert.isTrue(advance);
        });
    });
    describe("resume", function () {
        it("Should start from the place where it left the iteration", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var pageIterator;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pageIterator = new PageIterator_1.PageIterator(client, getPageCollection(), halfWayCallback);
                        halfWayCallbackCounter = 5;
                        return [4 /*yield*/, pageIterator.iterate()];
                    case 1:
                        _a.sent();
                        chai_1.assert.isFalse(pageIterator.isComplete());
                        return [4 /*yield*/, pageIterator.resume()];
                    case 2:
                        _a.sent();
                        chai_1.assert.isTrue(pageIterator.isComplete());
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("isComplete", function () {
        it("Should return false for incomplete iteration", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var pageIterator;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pageIterator = new PageIterator_1.PageIterator(client, getPageCollection(), halfWayCallback);
                        halfWayCallbackCounter = 5;
                        return [4 /*yield*/, pageIterator.iterate()];
                    case 1:
                        _a.sent();
                        chai_1.assert.isFalse(pageIterator.isComplete());
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should return true for complete iteration", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var pageIterator;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pageIterator = new PageIterator_1.PageIterator(client, getPageCollection(), truthyCallback);
                        return [4 /*yield*/, pageIterator.iterate()];
                    case 1:
                        _a.sent();
                        chai_1.assert.isTrue(pageIterator.isComplete());
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=PageIterator.js.map