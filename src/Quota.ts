import { RateLimitError } from './customErrors';

class Quota {
  private mBlockHour: number;

  constructor() {
  }

  public block() {
    this.mBlockHour = (new Date()).getHours();
  }

  public wait(): Promise<void> {
    const now = new Date();
    if ((this.mBlockHour !== undefined)
        && (now.getHours() === this.mBlockHour)) {
      if (now.getMinutes() === 59) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, (60 - now.getSeconds()) * 1000);
        });
      } else {
        return Promise.reject(new RateLimitError());
      }
    }
    return Promise.resolve();
  }
}

export default Quota;
