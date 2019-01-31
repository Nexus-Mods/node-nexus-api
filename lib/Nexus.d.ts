import * as types from './types';
declare class Nexus {
    private mBaseData;
    private mBaseURL;
    private mQuota;
    private mValidationResult;
    constructor(appVersion: string, defaultGame: string, timeout?: number);
    static create(apiKey: string, appVersion: string, defaultGame: string, timeout?: number): Promise<Nexus>;
    setGame(gameId: string): void;
    getValidationResult(): types.IValidateKeyResponse;
    setKey(apiKey: string): Promise<types.IValidateKeyResponse>;
    validateKey(key?: string): Promise<types.IValidateKeyResponse>;
    endorseMod(modId: number, modVersion: string, endorseStatus: 'endorse' | 'abstain', gameId?: string): Promise<any>;
    getGames(): Promise<types.IGameListEntry[]>;
    getGameInfo(gameId?: string): Promise<types.IGameInfo>;
    getModInfo(modId: number, gameId?: string): Promise<types.IModInfo>;
    getModFiles(modId: number, gameId?: string): Promise<types.IModFiles>;
    getFileInfo(modId: number, fileId: number, gameId?: string): Promise<types.IFileInfo>;
    getDownloadURLs(modId: number, fileId: number, key?: string, expires?: number, gameId?: string): Promise<types.IDownloadURL[]>;
    getFileByMD5(hash: string, gameId?: string): Promise<types.IMD5Result[]>;
    getOwnIssues(): Promise<types.IIssue[]>;
    sendFeedback(title: string, message: string, fileBundle: string, anonymous: boolean, groupingKey?: string, id?: string): Promise<types.IFeedbackResponse>;
    private checkFileSize(filePath);
    private request(url, args);
    private filter(obj);
    private args(customArgs);
}
export default Nexus;
