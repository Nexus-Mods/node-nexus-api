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
  private mBlockHour: number;
  private mLimit: number = 1000;

  constructor(init: number, max: number, msPerIncrement: number) {
    this.mCount = init;
    this.mMaximum = max;
    this.mMSPerIncrement = msPerIncrement;
  }

  public updateLimit(limit: number) {
    this.mLimit = limit;
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

  public wait(): Promise<void> {
    const now = new Date();
    if ((this.mBlockHour !== undefined)
        && (now.getHours() === this.mBlockHour)) {
      // if the hourly and daily limit was exceeded, don't make any new requests
      // until the next full hour. If the time is almost up, wait, otherwise report
      // an error
      if (now.getMinutes() === 59) {
        return delay((60 - now.getSeconds()) * 1000);
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
      return delay(this.mCount * this.mMSPerIncrement * -1);
    }
  }
}

export default Quota;
