"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customErrors_1 = require("./customErrors");
class Quota {
    constructor() {
    }
    block() {
        this.mBlockHour = (new Date()).getHours();
    }
    wait() {
        const now = new Date();
        if ((this.mBlockHour !== undefined)
            && (now.getHours() === this.mBlockHour)) {
            if (now.getMinutes() === 59) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, (60 - now.getSeconds()) * 1000);
                });
            }
            else {
                return Promise.reject(new customErrors_1.RateLimitError());
            }
        }
        return Promise.resolve();
    }
}
exports.default = Quota;
//# sourceMappingURL=Quota.js.map