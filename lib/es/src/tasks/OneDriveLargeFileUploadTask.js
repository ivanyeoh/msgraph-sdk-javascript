/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { __awaiter } from "tslib";
/**
 * @module OneDriveLargeFileUploadTask
 */
import { GraphClientError } from "../GraphClientError";
import { FileUpload } from "./FileUploadTask/FileObjectClasses/FileUpload";
import { LargeFileUploadTask } from "./LargeFileUploadTask";
import { getValidRangeSize } from "./OneDriveLargeFileUploadTaskUtil";
/**
 * @class
 * Class representing OneDriveLargeFileUploadTask
 */
export class OneDriveLargeFileUploadTask extends LargeFileUploadTask {
    /**
     * @public
     * @constructor
     * Constructs a OneDriveLargeFileUploadTask
     * @param {Client} client - The GraphClient instance
     * @param {FileObject} file - The FileObject holding details of a file that needs to be uploaded
     * @param {LargeFileUploadSession} uploadSession - The upload session to which the upload has to be done
     * @param {LargeFileUploadTaskOptions} options - The upload task options
     * @returns An instance of OneDriveLargeFileUploadTask
     */
    constructor(client, file, uploadSession, options) {
        super(client, file, uploadSession, options);
    }
    /**
     * @private
     * @static
     * Constructs the create session url for Onedrive
     * @param {string} fileName - The name of the file
     * @param {path} [path = OneDriveLargeFileUploadTask.DEFAULT_UPLOAD_PATH] - The path for the upload
     * @returns The constructed create session url
     */
    static constructCreateSessionUrl(fileName, path = OneDriveLargeFileUploadTask.DEFAULT_UPLOAD_PATH) {
        fileName = fileName.trim();
        path = path.trim();
        if (path === "") {
            path = "/";
        }
        if (path[0] !== "/") {
            path = `/${path}`;
        }
        if (path[path.length - 1] !== "/") {
            path = `${path}/`;
        }
        // we choose to encode each component of the file path separately because when encoding full URI
        // with encodeURI, special characters like # or % in the file name doesn't get encoded as desired
        return `/me/drive/root:${path
            .split("/")
            .map((p) => encodeURIComponent(p))
            .join("/")}${encodeURIComponent(fileName)}:/createUploadSession`;
    }
    /**
     * @private
     * @static
     * Get file information
     * @param {Blob | Uint8Array | File} file - The file entity
     * @param {string} fileName - The file name
     * @returns {FileInfo} The file information
     */
    static getFileInfo(file, fileName) {
        let content;
        let size;
        if (typeof Blob !== "undefined" && file instanceof Blob) {
            content = new File([file], fileName);
            size = content.size;
        }
        else if (typeof File !== "undefined" && file instanceof File) {
            content = file;
            size = content.size;
        }
        else if (typeof Uint8Array !== "undefined" && file instanceof Uint8Array) {
            const b = file;
            size = b.byteLength;
            content = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
        }
        return {
            content,
            size,
        };
    }
    /**
     * @public
     * @static
     * @async
     * Creates a OneDriveLargeFileUploadTask
     * @param {Client} client - The GraphClient instance
     * @param {Blob | Uint8Array | File} file - File represented as Blob, Uint8Array or File
     * @param {OneDriveLargeFileUploadOptions} options - The options for upload task
     * @returns The promise that will be resolves to OneDriveLargeFileUploadTask instance
     */
    static create(client, file, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!client || !file || !options) {
                throw new GraphClientError("Please provide the Graph client instance, file object and OneDriveLargeFileUploadOptions value");
            }
            const fileName = options.fileName;
            const fileInfo = OneDriveLargeFileUploadTask.getFileInfo(file, fileName);
            const fileObj = new FileUpload(fileInfo.content, fileName, fileInfo.size);
            return this.createTaskWithFileObject(client, fileObj, options);
        });
    }
    /**
     * @public
     * @static
     * @async
     * Creates a OneDriveLargeFileUploadTask
     * @param {Client} client - The GraphClient instance
     * @param {FileObject} fileObject - FileObject instance
     * @param {OneDriveLargeFileUploadOptions} options - The options for upload task
     * @returns The promise that will be resolves to OneDriveLargeFileUploadTask instance
     */
    static createTaskWithFileObject(client, fileObject, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!client || !fileObject || !options) {
                throw new GraphClientError("Please provide the Graph client instance, FileObject interface implementation and OneDriveLargeFileUploadOptions value");
            }
            const requestUrl = options.uploadSessionURL ? options.uploadSessionURL : OneDriveLargeFileUploadTask.constructCreateSessionUrl(options.fileName, options.path);
            const uploadSessionPayload = {
                fileName: options.fileName,
                fileDescription: options.fileDescription,
                conflictBehavior: options.conflictBehavior,
            };
            const session = yield OneDriveLargeFileUploadTask.createUploadSession(client, requestUrl, uploadSessionPayload);
            const rangeSize = getValidRangeSize(options.rangeSize);
            return new OneDriveLargeFileUploadTask(client, fileObject, session, {
                rangeSize,
                uploadEventHandlers: options.uploadEventHandlers,
            });
        });
    }
    /**
     * @public
     * @static
     * @async
     * Makes request to the server to create an upload session
     * @param {Client} client - The GraphClient instance
     * @param {string} requestUrl - The URL to create the upload session
     * @param {string} payloadOptions - The payload option. Default conflictBehavior is 'rename'
     * @returns The promise that resolves to LargeFileUploadSession
     */
    static createUploadSession(client, requestUrl, payloadOptions) {
        const _super = Object.create(null, {
            createUploadSession: { get: () => super.createUploadSession }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                item: {
                    "@microsoft.graph.conflictBehavior": (payloadOptions === null || payloadOptions === void 0 ? void 0 : payloadOptions.conflictBehavior) || "rename",
                    name: payloadOptions === null || payloadOptions === void 0 ? void 0 : payloadOptions.fileName,
                    description: payloadOptions === null || payloadOptions === void 0 ? void 0 : payloadOptions.fileDescription,
                },
            };
            return _super.createUploadSession.call(this, client, requestUrl, payload);
        });
    }
    /**
     * @public
     * Commits upload session to end uploading
     * @param {string} requestUrl - The URL to commit the upload session
     * @param {string} conflictBehavior - Conflict behaviour option. Default is 'rename'
     * @returns The promise resolves to committed response
     */
    commit(requestUrl, conflictBehavior = "rename") {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                name: this.file.name,
                "@microsoft.graph.conflictBehavior": conflictBehavior,
                "@microsoft.graph.sourceUrl": this.uploadSession.url,
            };
            return yield this.client.api(requestUrl).put(payload);
        });
    }
}
/**
 * @private
 * @static
 * Default path for the file being uploaded
 */
OneDriveLargeFileUploadTask.DEFAULT_UPLOAD_PATH = "/";
//# sourceMappingURL=OneDriveLargeFileUploadTask.js.map