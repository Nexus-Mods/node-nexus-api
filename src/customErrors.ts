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
  constructor(statusCode: number, message: string, body: string) {
    super(`HTTP (${statusCode}) - ${message}`);
    this.mStatusCode = statusCode;
    this.name = this.constructor.name;
    this.mBody = body;
  }

  public get statusCode() {
    return this.mStatusCode;
  }

  public get body(): string {
    return this.mBody;
  }
}

/**
 * Error reported by the nexus api
 */
export class NexusError extends Error {
  private mStatusCode: number;
  private mRequest: string;
  constructor(message: string, statusCode: number, url: string) {
    super(message);
    this.mStatusCode = statusCode;
    this.mRequest = url;
  }

  public get statusCode() {
    return this.mStatusCode;
  }

  public get request() {
    return this.mRequest;
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
