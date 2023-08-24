import { GraphErrorAttribute, GraphErrorCode, GraphErrorEntity, GraphErrorItemCode, GraphErrorType } from "./types";
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
    private mCode;
    private mDescription;
    constructor(message: string, statusCode: number, url: string, code: string, description?: string);
    get statusCode(): number;
    get request(): string;
    get code(): string;
    get description(): string;
}
export interface IGraphErrorDetail {
    attribute: GraphErrorAttribute;
    code: GraphErrorItemCode;
    entity: GraphErrorEntity;
    message: string;
    type: GraphErrorType;
    value: any;
}
export declare class GraphError extends Error {
    private mCode;
    private mDetails;
    constructor(message: string, code: GraphErrorCode, details: IGraphErrorDetail[]);
    get code(): GraphErrorCode;
    get details(): IGraphErrorDetail[];
}
export declare class ParameterInvalid extends Error {
    constructor(message: any);
}
export declare class JwtExpiredError extends Error {
    constructor();
}
