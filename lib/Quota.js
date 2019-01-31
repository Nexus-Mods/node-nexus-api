"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customErrors_1 = require("./customErrors");
function delay(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}
class Quota {
    constructor(init, max, msPerIncrement) {
        this.mLastCheck = Date.now();
        this.mLimit = 1000;
        this.mCount = init;
        this.mMaximum = max;
        this.mMSPerIncrement = msPerIncrement;
    }
    updateLimit(limit) {
        this.mLimit = limit;
    }
    block() {
        this.mCount = 0;
        this.mLastCheck = Date.now();
        if (--this.mLimit <= 0) {
            this.mBlockHour = (new Date()).getHours();
        }
    }
    wait() {
        const now = new Date();
        if ((this.mBlockHour !== undefined)
            && (now.getHours() === this.mBlockHour)) {
            if (now.getMinutes() === 59) {
                return delay((60 - now.getSeconds()) * 1000);
            }
            else {
                return Promise.reject(new customErrors_1.RateLimitError());
            }
        }
        const recovered = Math.floor((now.getTime() - this.mLastCheck) / this.mMSPerIncrement);
        this.mCount = Math.min(this.mCount + recovered, this.mMaximum);
        this.mLastCheck = now.getTime();
        --this.mCount;
        if (this.mCount >= 0) {
            return Promise.resolve();
        }
        else {
            return delay(this.mCount * this.mMSPerIncrement * -1);
        }
    }
}
exports.default = Quota;
//# sourceMappingURL=Quota.js.map