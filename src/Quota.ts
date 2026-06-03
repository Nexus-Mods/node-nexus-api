import { RateLimitError } from './customErrors';

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

class Quota {
  private mCount: number;
  private mMaximum: number;
  private mMSPerIncrement: number;
  private mLastCheck: number = Date.now();
  private mBlockHour: number | undefined;
  private mLimit: number = 1000;
  // to avoid making multiple requests with an expired jwt token during
  // application startup, we only allow a single request, all others are
  // blocked until that first one has succeeded, refreshing the token in
  // the process if necessary
  private mInitBlock: Promise<void> | undefined;
  private mOnInitDone: (() => void) | undefined;
  // upper bound on how long wait() may block before sending a request. Waiting
  // longer than the request itself is allowed to take is pointless: the caller's
  // request timeout would fire anyway and surface as a generic TimeoutError. When
  // a required wait exceeds this budget we fail fast with a typed RateLimitError
  // instead, so callers can back off to the hour boundary rather than hang.
  private mMaxWaitMS: number | undefined;

  constructor(init: number, max: number, msPerIncrement: number, maxWaitMS?: number) {
    this.mCount = init;
    this.mMaximum = max;
    this.mMSPerIncrement = msPerIncrement;
    this.mMaxWaitMS = maxWaitMS;
  }

  public updateLimit(limit: number) {
    this.mLimit = limit;
  }

  public finishInit() {
    this.mOnInitDone?.();
    this.mOnInitDone = undefined;
  }

  /**
   * signal that the request was blocked by the server with an error code that
   * indicates client is sending too many requests
   * returns true if the rate limit is actually used up so we won't be able to
   * make requests for a while, false if it's likely a temporary problem.
   */
  public block(): boolean {
    this.mCount = 0;
    this.mLastCheck = Date.now();

    if (this.mLimit <= 0) {
      // rate limit exceeded, block until the next full hour
      this.mBlockHour = (new Date()).getHours();
      return true;
    }
    return false;
  }

  /**
   * wait until a request ticket is available.
   * @param budgetMs the caller's remaining time budget in milliseconds. If a
   *   required wait would exceed it, reject with a RateLimitError instead of
   *   blocking past the point where the caller would time out anyway. Defaults
   *   to the configured request timeout (mMaxWaitMS). Pass nothing to use the
   *   default; pass undefined explicitly only to wait unconditionally.
   */
  public async wait(budgetMs: number | undefined = this.mMaxWaitMS): Promise<void> {
    const now = new Date();

    if (this.mInitBlock === undefined) {
      this.mInitBlock = new Promise(resolve => { this.mOnInitDone = resolve });
    } else {
      await this.mInitBlock;
    }

    if ((this.mBlockHour !== undefined) && (now.getHours() === this.mBlockHour)) {
      // if the hourly and daily limit was exceeded, don't make any new requests
      // until the next full hour. If the time is almost up, ride it out (the
      // window resets in <=60s, turning a guaranteed-imminent success into an
      // actual success) - but only when the wait fits the caller's budget.
      // Otherwise fail fast: a wait we know will outlast the request timeout
      // gains nothing and just hangs the resolve.
      if (now.getMinutes() === 59) {
        const waitMs = (60 - now.getSeconds()) * 1000;
        if (this.exceedsBudget(waitMs, budgetMs)) {
          return Promise.reject(new RateLimitError());
        }
        return delay(waitMs);
      } else {
        return Promise.reject(new RateLimitError());
      }
    }

    const recovered = Math.floor((now.getTime() - this.mLastCheck) / this.mMSPerIncrement);
    this.mCount = Math.min(this.mCount + recovered, this.mMaximum);
    this.mLastCheck = now.getTime();
    --this.mCount;
    if (this.mCount >= 0) {
      return Promise.resolve();
    } else {
      // token bucket went negative: under heavy fan-out the proportional wait
      // can exceed the request timeout. Same bounded-wait rule as above.
      const waitMs = this.mCount * this.mMSPerIncrement * -1;
      if (this.exceedsBudget(waitMs, budgetMs)) {
        return Promise.reject(new RateLimitError());
      }
      return delay(waitMs);
    }
  }

  private exceedsBudget(waitMs: number, budgetMs: number | undefined): boolean {
    return (budgetMs !== undefined) && (waitMs > budgetMs);
  }
}

export default Quota;
