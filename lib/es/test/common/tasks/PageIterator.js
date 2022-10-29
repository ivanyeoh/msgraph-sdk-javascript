/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { __awaiter } from "tslib";
import { assert } from "chai";
import { PageIterator } from "../../../src/tasks/PageIterator";
import { getClient } from "../../test-helper";
const client = getClient();
const value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const getPageCollection = () => {
    return {
        value: [...value],
        additionalContent: "additional content",
    };
};
const getPageCollectionWithNext = () => {
    return {
        value: [...value],
        "@odata.nextLink": "nextURL",
        additionalContent: "additional content",
    };
};
const getEmptyPageCollection = () => {
    return {
        value: [],
    };
};
const getEmptyPageCollectionWithNext = () => {
    return {
        value: [],
        "@odata.nextLink": "nextURL",
    };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const truthyCallback = (data) => {
    return true;
};
let halfWayCallbackCounter = 5;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const halfWayCallback = (data) => {
    halfWayCallbackCounter--;
    if (halfWayCallbackCounter === 0) {
        return false;
    }
    else {
        return true;
    }
};
describe("PageIterator.ts", () => {
    describe("Constructor", () => {
        it("Should create instance without nextLink", () => {
            const pageIterator = new PageIterator(client, getPageCollection(), truthyCallback);
            assert(pageIterator instanceof PageIterator);
        });
        it("Should create instance with nextLink", () => {
            const pageIterator = new PageIterator(client, getPageCollectionWithNext(), truthyCallback);
            assert(pageIterator instanceof PageIterator);
        });
    });
    describe("iterate", () => {
        it("Should iterate over a complete collection without nextLink", () => __awaiter(void 0, void 0, void 0, function* () {
            const pageIterator = new PageIterator(client, getPageCollection(), truthyCallback);
            yield pageIterator.iterate();
            assert.isTrue(pageIterator.isComplete());
        }));
        it("Should not mutate the collection", () => __awaiter(void 0, void 0, void 0, function* () {
            const collection = getPageCollection();
            const pageIterator = new PageIterator(client, collection, truthyCallback);
            yield pageIterator.iterate();
            assert.deepEqual(collection, getPageCollection());
        }));
        it("Should not iterate over an empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
            const pageIterator = new PageIterator(client, getEmptyPageCollection(), truthyCallback);
            halfWayCallbackCounter = 1;
            yield pageIterator.iterate();
            assert.equal(halfWayCallbackCounter, 1);
        }));
        it("Should break in the middle way", () => __awaiter(void 0, void 0, void 0, function* () {
            const pageIterator = new PageIterator(client, getPageCollection(), halfWayCallback);
            halfWayCallbackCounter = 5;
            yield pageIterator.iterate();
            assert.isFalse(pageIterator.isComplete());
        }));
    });
    describe("iterationHelper", () => {
        it("Should return true for empty collection with next link", () => {
            const pageIterator = new PageIterator(client, getEmptyPageCollectionWithNext(), truthyCallback);
            const advance = pageIterator["iterationHelper"]();
            assert.isTrue(advance);
        });
    });
    describe("resume", () => {
        it("Should start from the place where it left the iteration", () => __awaiter(void 0, void 0, void 0, function* () {
            const pageIterator = new PageIterator(client, getPageCollection(), halfWayCallback);
            halfWayCallbackCounter = 5;
            yield pageIterator.iterate();
            assert.isFalse(pageIterator.isComplete());
            yield pageIterator.resume();
            assert.isTrue(pageIterator.isComplete());
        }));
    });
    describe("isComplete", () => {
        it("Should return false for incomplete iteration", () => __awaiter(void 0, void 0, void 0, function* () {
            const pageIterator = new PageIterator(client, getPageCollection(), halfWayCallback);
            halfWayCallbackCounter = 5;
            yield pageIterator.iterate();
            assert.isFalse(pageIterator.isComplete());
        }));
        it("Should return true for complete iteration", () => __awaiter(void 0, void 0, void 0, function* () {
            const pageIterator = new PageIterator(client, getPageCollection(), truthyCallback);
            yield pageIterator.iterate();
            assert.isTrue(pageIterator.isComplete());
        }));
    });
});
//# sourceMappingURL=PageIterator.js.map