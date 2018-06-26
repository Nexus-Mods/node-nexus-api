import * as types from './types';
declare class Nexus {
    private mBaseData;
    private mBaseURL;
    private mQuota;
    constructor(game: string, apiKey: string, appVersion: string, timeout?: number);
    setGame(gameId: string): void;
    setKey(apiKey: string): Promise<void>;
    validateKey(key?: string): Promise<types.IValidateKeyResponse>;
    endorseMod(modId: number, modVersion: string, endorseStatus: string, gameId?: string): Promise<any>;
    getGames(): Promise<types.IGameListEntry[]>;
    getGameInfo(gameId?: string): Promise<types.IGameInfo>;
    getModInfo(modId: number, gameId?: string): Promise<types.IModInfo>;
    getModFiles(modId: number, gameId?: string): Promise<types.IModFiles>;
    getFileInfo(modId: number, fileId: number, gameId?: string): Promise<types.IFileInfo>;
    getDownloadURLs(modId: number, fileId: number, gameId?: string): Promise<types.IDownloadURL[]>;
    getOwnIssues(): Promise<types.IIssue[]>;
    sendFeedback(title: string, message: string, fileBundle: string, anonymous: boolean, groupingKey?: string, id?: string): Promise<types.IFeedbackResponse>;
    private checkFileSize(filePath);
    private request(url, args);
    private filter(obj);
    private args(customArgs);
}
export default Nexus;
