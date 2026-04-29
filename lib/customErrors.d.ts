import { GraphErrorAttribute, GraphErrorCode, GraphErrorEntity, GraphErrorItemCode, GraphErrorType, IGraphQLLocation } from "./types";
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
export interface IGraphErrorEntry {
    message: string;
    path?: ReadonlyArray<string | number>;
    locations?: ReadonlyArray<IGraphQLLocation>;
    code?: string;
}
export declare class GraphError extends Error {
    private mCode;
    private mDetails;
    private mEntries;
    private mQuery;
    constructor(message: string, code: GraphErrorCode | undefined, details: IGraphErrorDetail[], entries?: ReadonlyArray<IGraphErrorEntry>, query?: string);
    get code(): GraphErrorCode | undefined;
    get details(): IGraphErrorDetail[];
    get entries(): ReadonlyArray<IGraphErrorEntry>;
    get query(): string | undefined;
    get call(): string | undefined;
}
export declare class ParameterInvalid extends Error {
    constructor(message: any);
}
export declare class JwtExpiredError extends Error {
    constructor();
}
