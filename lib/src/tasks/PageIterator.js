"use strict";
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageIterator = void 0;
var tslib_1 = require("tslib");
/**
 * @class
 * Class for PageIterator
 */
var PageIterator = /** @class */ (function () {
    /**
     * @public
     * @constructor
     * Creates new instance for PageIterator
     * @param {Client} client - The graph client instance
     * @param {PageCollection} pageCollection - The page collection object
     * @param {PageIteratorCallback} callBack - The callback function
     * @param {GraphRequestOptions} requestOptions - The request options
     * @returns An instance of a PageIterator
     */
    function PageIterator(client, pageCollection, callback, requestOptions) {
        this.client = client;
        this.collection = pageCollection.value;
        this.nextLink = pageCollection["@odata.nextLink"];
        this.deltaLink = pageCollection["@odata.deltaLink"];
        this.callback = callback;
        this.cursor = 0;
        this.complete = false;
        this.requestOptions = requestOptions;
    }
    /**
     * @private
     * Iterates over a collection by enqueuing entries one by one and kicking the callback with the enqueued entry
     * @returns A boolean indicating the continue flag to process next page
     */
    PageIterator.prototype.iterationHelper = function () {
        if (this.collection === undefined) {
            return false;
        }
        var advance = true;
        while (advance && this.cursor < this.collection.length) {
            var item = this.collection[this.cursor];
            advance = this.callback(item);
            this.cursor++;
        }
        return advance;
    };
    /**
     * @private
     * @async
     * Helper to make a get request to fetch next page with nextLink url and update the page iterator instance with the returned response
     * @returns A promise that resolves to a response data with next page collection
     */
    PageIterator.prototype.fetchAndUpdateNextPageData = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var graphRequest, response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        graphRequest = this.client.api(this.nextLink);
                        if (this.requestOptions) {
                            if (this.requestOptions.headers) {
                                graphRequest = graphRequest.headers(this.requestOptions.headers);
                            }
                            if (this.requestOptions.middlewareOptions) {
                                graphRequest = graphRequest.middlewareOptions(this.requestOptions.middlewareOptions);
                            }
                            if (this.requestOptions.options) {
                                graphRequest = graphRequest.options(this.requestOptions.options);
                            }
                        }
                        return [4 /*yield*/, graphRequest.get()];
                    case 1:
                        response = _a.sent();
                        this.collection = response.value;
                        this.nextLink = response["@odata.nextLink"];
                        this.deltaLink = response["@odata.deltaLink"];
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @public
     * Getter to get the deltaLink in the current response
     * @returns A deltaLink which is being used to make delta requests in future
     */
    PageIterator.prototype.getDeltaLink = function () {
        return this.deltaLink;
    };
    /**
     * @public
     * @async
     * Iterates over the collection and kicks callback for each item on iteration. Fetches next set of data through nextLink and iterates over again
     * This happens until the nextLink is drained out or the user responds with a red flag to continue from callback
     * @returns A Promise that resolves to nothing on completion and throws error incase of any discrepancy.
     */
    PageIterator.prototype.iterate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var advance;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        advance = this.iterationHelper();
                        _a.label = 1;
                    case 1:
                        if (!advance) return [3 /*break*/, 5];
                        if (!(this.nextLink !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fetchAndUpdateNextPageData()];
                    case 2:
                        _a.sent();
                        advance = this.iterationHelper();
                        return [3 /*break*/, 4];
                    case 3:
                        advance = false;
                        _a.label = 4;
                    case 4: return [3 /*break*/, 1];
                    case 5:
                        if (this.nextLink === undefined && this.cursor >= this.collection.length) {
                            this.complete = true;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @public
     * @async
     * To resume the iteration
     * Note: This internally calls the iterate method, It's just for more readability.
     * @returns A Promise that resolves to nothing on completion and throws error incase of any discrepancy
     */
    PageIterator.prototype.resume = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.iterate()];
            });
        });
    };
    /**
     * @public
     * To get the completeness status of the iterator
     * @returns Boolean indicating the completeness
     */
    PageIterator.prototype.isComplete = function () {
        return this.complete;
    };
    return PageIterator;
}());
exports.PageIterator = PageIterator;
//# sourceMappingURL=PageIterator.js.map