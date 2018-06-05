class Quota {
  private mCount: number;
  private mMaximum: number;
  private mMSPerIncrement: number;
  private mLastCheck: number = Date.now();

  constructor(init: number, max: number, msPerIncrement: number) {
    this.mCount = init;
    this.mMaximum = max;
    this.mMSPerIncrement = msPerIncrement;
  }

  public reset() {
    this.mCount = 0;
    this.mLastCheck = Date.now();
  }

  public wait(): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = Date.now();
      const recovered = Math.floor((now - this.mLastCheck) / this.mMSPerIncrement);
      this.mCount = Math.min(this.mCount + recovered, this.mMaximum);
      this.mLastCheck = now;
      --this.mCount;
      if (this.mCount >= 0) {
        return resolve();
      } else {
        setTimeout(resolve, this.mCount * this.mMSPerIncrement * -1);
      }
    });
  }

  public setMax(newMax: number) {
    this.mMaximum = newMax;
  }
}

export default Quota;
