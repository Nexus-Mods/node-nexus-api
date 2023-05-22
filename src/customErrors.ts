import { GraphErrorAttribute, GraphErrorCode, GraphErrorEntity, GraphErrorItemCode, GraphErrorType } from "./types";

/**
 * Error thrown if a request timed out
 */
export class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when a protocol error is reported.
 */
export class ProtocolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when too many requests were made to the api
 * You should not see this error in your application as it is handled internally
 */
export class RateLimitError extends Error {
  constructor() {
    super('Rate Limit Exceeded');
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown if an HTTP error is reported (HTTP code 4xx or 5xx)
 */
export class HTTPError extends Error {
  private mStatusCode: number;
  private mBody: string;
  private mURL: string;
  constructor(statusCode: number, message: string, body?: string, url?: string) {
    super(`HTTP (${statusCode}) - ${message}`);
    this.mStatusCode = statusCode;
    this.name = this.constructor.name;
    this.mStatusCode = statusCode;
    this.mBody = body ?? '';
    this.mURL = url ?? '';
  }
  public get statusCode(): number {
    return this.mStatusCode;
  }
  public get body(): string {
    return this.mBody;
  }
  public get url(): string {
    return this.mURL;
  }
}

/**
 * Error reported by the nexus api
 */
export class NexusError extends Error {
  private mStatusCode: number;
  private mRequest: string;
  private mCode: string;
  private mDescription: string
  constructor(message: string, statusCode: number, url: string, code: string, description?: string) {
    super(message);
    this.mStatusCode = statusCode;
    this.mRequest = url;
    this.mCode = code;
    this.mDescription = description;
  }

  public get statusCode() {
    return this.mStatusCode;
  }

  public get request() {
    return this.mRequest;
  }

  public get code() {
    return this.mCode;
  }

  public get description() {
    return this.mDescription;
  }
}

export interface IGraphErrorDetail {
  attribute: GraphErrorAttribute;
  code: GraphErrorItemCode;
  entity: GraphErrorEntity;
  message: string;
  type: GraphErrorType;
  value: any;
}

export class GraphError extends Error {
  private mCode: GraphErrorCode;
  private mDetails: IGraphErrorDetail[];
  constructor(message: string, code: GraphErrorCode, details: IGraphErrorDetail[]) {
    super(message);
    this.mCode = code;
    this.mDetails = details;
  }

  public get code(): GraphErrorCode {
    return this.mCode;
  }

  public get details(): IGraphErrorDetail[] {
    return this.mDetails;
  }
}

/**
 * API called with an invalid parameter
 */
export class ParameterInvalid extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when the JWT has expired
 * You should not see this error in your application as a refresh is performed when encountering it
 */
export class JwtExpiredError extends Error {
  constructor() {
    super('JWT has expired');
    this.name = this.constructor.name;
  }
}
