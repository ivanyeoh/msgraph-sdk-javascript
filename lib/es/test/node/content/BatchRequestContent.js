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
import { BatchRequestContent } from "../../../src/content/BatchRequestContent";
describe("BatchRequestContent.ts", () => {
    describe("getContent", () => {
        it("Should return image's base64 string", () => __awaiter(void 0, void 0, void 0, function* () {
            const fileName = "sample_image.jpg";
            fs.readFile(`./test/sample_files/${fileName}`, {}, (err, file) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    throw err;
                }
                const uploadOneDriveFile = {
                    id: "1",
                    request: new Request(`/me/drive/root:/Documents/${fileName}:/content`, {
                        method: "PUT",
                        headers: {
                            "Content-type": "image/jpg",
                        },
                        body: file,
                    }),
                };
                const batchReq = new BatchRequestContent([uploadOneDriveFile]);
                const content = yield batchReq.getContent();
                assert.isDefined(content.requests[0].body);
            }));
        }));
    });
});
//# sourceMappingURL=BatchRequestContent.js.map