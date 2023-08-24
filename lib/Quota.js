"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    finishInit() {
        var _a;
        (_a = this.mOnInitDone) === null || _a === void 0 ? void 0 : _a.call(this);
        this.mOnInitDone = undefined;
    }
    block() {
        this.mCount = 0;
        this.mLastCheck = Date.now();
        if (this.mLimit <= 0) {
            this.mBlockHour = (new Date()).getHours();
            return true;
        }
        return false;
    }
    wait() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            if (this.mInitBlock === undefined) {
                this.mInitBlock = new Promise(resolve => { this.mOnInitDone = resolve; });
            }
            else {
                yield this.mInitBlock;
            }
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
        });
    }
}
exports.default = Quota;
//# sourceMappingURL=Quota.js.map