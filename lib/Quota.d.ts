declare class Quota {
    private mCount;
    private mMaximum;
    private mMSPerIncrement;
    private mLastCheck;
    constructor(init: number, max: number, msPerIncrement: number);
    reset(): void;
    wait(): Promise<void>;
    setMax(newMax: number): void;
}
export default Quota;
