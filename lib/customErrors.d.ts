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
    private mStatusCode;
    private mBody;
    private mURL;
    constructor(statusCode: number, message: string, body?: string, url?: string);
    get statusCode(): number;
    get body(): string;
    get url(): string;
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
