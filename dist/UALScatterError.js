"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const universal_authenticator_library_1 = require("universal-authenticator-library");
const interfaces_1 = require("./interfaces");
class UALScatterError extends universal_authenticator_library_1.UALError {
    constructor(message, type, cause) {
        super(message, type, cause, interfaces_1.Name);
    }
}
exports.UALScatterError = UALScatterError;
