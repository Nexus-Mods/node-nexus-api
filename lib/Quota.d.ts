declare class Quota {
    private mBlockHour;
    constructor();
    block(): void;
    wait(): Promise<void>;
}
export default Quota;
