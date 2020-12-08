export declare class TimeoutError extends Error {
    constructor(message: any);
}
export declare class ProtocolError extends Error {
    constructor(message: string);
}
export declare class RateLimitError extends Error {
    constructor();
}
export declare class HTTPError extends Error {
    private mBody;
    constructor(statusCode: number, message: string, body: string);
    get body(): string;
}
export declare class NexusError extends Error {
    private mStatusCode;
    private mRequest;
    constructor(message: string, statusCode: number, url: string);
    get statusCode(): number;
    get request(): string;
}
export declare class ParameterInvalid extends Error {
    constructor(message: any);
}
export declare class JwtExpiredError extends Error {
    constructor();
}
