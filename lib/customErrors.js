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
    constructor(statusCode, message, body) {
        super(`HTTP (${statusCode}) - ${message}`);
        this.name = this.constructor.name;
        this.mBody = body;
    }
    get body() {
        return this.mBody;
    }
}
exports.HTTPError = HTTPError;
class NexusError extends Error {
    constructor(message, statusCode, url) {
        super(message);
        this.mStatusCode = statusCode;
        this.mRequest = url;
    }
    get statusCode() {
        return this.mStatusCode;
    }
    get request() {
        return this.mRequest;
    }
}
exports.NexusError = NexusError;
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