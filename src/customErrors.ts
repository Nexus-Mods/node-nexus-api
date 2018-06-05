export class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class RateLimitError extends Error {
  constructor() {
    super('Rate Limit Exceeded');
    this.name = this.constructor.name;
  }
}

export class HTTPError extends Error {
  private mBody: string;
  constructor(statusCode: number, message: string, body: string) {
    super(`HTTP (${statusCode}) - ${message}`);
    this.name = this.constructor.name;
    this.mBody = body;
  }
  public get body(): string {
    return this.mBody;
  }
}

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
