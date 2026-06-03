declare class Quota {
    private mCount;
    private mMaximum;
    private mMSPerIncrement;
    private mLastCheck;
    private mBlockHour;
    private mLimit;
    private mInitBlock;
    private mOnInitDone;
    private mMaxWaitMS;
    constructor(init: number, max: number, msPerIncrement: number, maxWaitMS?: number);
    updateLimit(limit: number): void;
    finishInit(): void;
    block(): boolean;
    wait(budgetMs?: number | undefined): Promise<void>;
    private exceedsBudget;
}
export default Quota;
