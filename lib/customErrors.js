"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeoutError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.TimeoutError = TimeoutError;
class ProtocolError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.ProtocolError = ProtocolError;
class RateLimitError extends Error {
    constructor() {
        super('Rate Limit Exceeded');
        this.name = this.constructor.name;
    }
}
exports.RateLimitError = RateLimitError;
class HTTPError extends Error {
    constructor(statusCode, message, body, url) {
        super(`HTTP (${statusCode}) - ${message}`);
        this.mStatusCode = statusCode;
        this.name = this.constructor.name;
        this.mStatusCode = statusCode;
        this.mBody = body !== null && body !== void 0 ? body : '';
        this.mURL = url !== null && url !== void 0 ? url : '';
    }
    get statusCode() {
        return this.mStatusCode;
    }
    get body() {
        return this.mBody;
    }
    get url() {
        return this.mURL;
    }
}
exports.HTTPError = HTTPError;
class NexusError extends Error {
    constructor(message, statusCode, url, code, description) {
        super(message);
        this.mStatusCode = statusCode;
        this.mRequest = url;
        this.mCode = code;
        this.mDescription = description;
    }
    get statusCode() {
        return this.mStatusCode;
    }
    get request() {
        return this.mRequest;
    }
    get code() {
        return this.mCode;
    }
    get description() {
        return this.mDescription;
    }
}
exports.NexusError = NexusError;
class GraphError extends Error {
    constructor(message, code, details, entries = [], query) {
        super(message);
        this.name = this.constructor.name;
        this.mCode = code;
        this.mDetails = details;
        this.mEntries = entries;
        this.mQuery = query;
    }
    get code() {
        return this.mCode;
    }
    get details() {
        return this.mDetails;
    }
    get entries() {
        return this.mEntries;
    }
    get query() {
        return this.mQuery;
    }
    get call() {
        var _a;
        const first = this.mEntries.find(e => e.path !== undefined);
        return (_a = first === null || first === void 0 ? void 0 : first.path) === null || _a === void 0 ? void 0 : _a.join(', ');
    }
}
exports.GraphError = GraphError;
class ParameterInvalid extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.ParameterInvalid = ParameterInvalid;
class JwtExpiredError extends Error {
    constructor() {
        super('JWT has expired');
        this.name = this.constructor.name;
    }
}
exports.JwtExpiredError = JwtExpiredError;
//# sourceMappingURL=customErrors.js.map