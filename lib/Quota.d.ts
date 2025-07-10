declare class Quota {
    private mCount;
    private mMaximum;
    private mMSPerIncrement;
    private mLastCheck;
    private mBlockHour;
    private mLimit;
    private mInitBlock;
    private mOnInitDone;
    constructor(init: number, max: number, msPerIncrement: number);
    updateLimit(limit: number): void;
    finishInit(): void;
    block(): boolean;
    wait(): Promise<void>;
}
export default Quota;
