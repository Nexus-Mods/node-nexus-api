import * as types from './types';
import * as graphQL from './typesGraphQL';
import { IGraphQLError, LogFunc } from './types';
declare class Nexus {
    private mBaseData;
    private mBaseURL;
    private mGraphBaseURL;
    private mQuota;
    private mValidationResult;
    private mRateLimit;
    private mLogCB;
    constructor(appName: string, appVersion: string, defaultGame: string, timeout?: number);
    static create(apiKey: string, appName: string, appVersion: string, defaultGame: string, timeout?: number): Promise<Nexus>;
    setLogger(logCB: LogFunc): void;
    setGame(gameId: string): void;
    revalidate(): Promise<types.IValidateKeyResponse>;
    getValidationResult(): types.IValidateKeyResponse;
    setKey(apiKey: string): Promise<types.IValidateKeyResponse>;
    getRateLimits(): {
        daily: number;
        hourly: number;
    };
    validateKey(key?: string): Promise<types.IValidateKeyResponse>;
    getTrackedMods(): Promise<types.ITrackedMod[]>;
    trackMod(modId: string, gameId?: string): Promise<types.ITrackResponse>;
    untrackMod(modId: string, gameId?: string): Promise<types.ITrackResponse>;
    getGames(): Promise<types.IGameListEntry[]>;
    getLatestAdded(gameId?: string): Promise<types.IModInfo[]>;
    getLatestUpdated(gameId?: string): Promise<types.IModInfo[]>;
    getTrending(gameId?: string): Promise<types.IModInfo[]>;
    getEndorsements(): Promise<types.IEndorsement[]>;
    getColourschemes(): Promise<types.IColourScheme[]>;
    getColorschemes(): Promise<types.IColourScheme[]>;
    getGameInfo(gameId?: string): Promise<types.IGameInfo>;
    getRecentlyUpdatedMods(period: types.UpdatePeriod, gameId?: string): Promise<types.IUpdateEntry[]>;
    endorseMod(modId: number, modVersion: string, endorseStatus: 'endorse' | 'abstain', gameId?: string): Promise<types.IEndorseResponse>;
    getModInfo(modId: number, gameId?: string): Promise<types.IModInfo>;
    getChangelogs(modId: number, gameId?: string): Promise<types.IChangelogs>;
    getModFiles(modId: number, gameId?: string): Promise<types.IModFiles>;
    getFileInfo(modId: number, fileId: number, gameId?: string): Promise<types.IFileInfo>;
    getDownloadURLs(modId: number, fileId: number, key?: string, expires?: number, gameId?: string): Promise<types.IDownloadURL[]>;
    getFileByMD5(hash: string, gameId?: string): Promise<types.IMD5Result[]>;
    modsByUid(query: graphQL.IModQuery, uids: string[]): Promise<Partial<types.IMod>[]>;
    modFilesByUid(query: graphQL.IModFileQuery, uids: string[]): Promise<Partial<types.IModFile>[]>;
    fileHashes(query: graphQL.IFileHashQuery, md5Hashes: string[]): Promise<{
        data: Partial<types.IFileHash>[];
        errors: IGraphQLError[];
    }>;
    getCollectionDownloadLink(downloadLink: string): Promise<types.IDownloadURL[]>;
    createCollection(data: types.ICollectionPayload, assetFileUUID: string): Promise<types.ICreateCollectionResult>;
    updateCollection(data: types.ICollectionPayload, assetFileUUID: string, collectionId: number): Promise<types.ICreateCollectionResult>;
    createOrUpdateRevision(data: types.ICollectionPayload, assetFileUUID: string, collectionId: number): Promise<types.ICreateCollectionResult>;
    editCollection(collectionId: number, name: string, summary?: string, description?: string, category?: number): Promise<boolean>;
    publishRevision(revisionId: number): Promise<boolean>;
    attachCollectionsToCategory(categoryId: number, collectionIds: number[]): Promise<boolean>;
    getCollectionGraph(query: graphQL.ICollectionQuery, collectionId: number): Promise<Partial<types.ICollection>>;
    getCollectionListGraph(query: graphQL.ICollectionQuery, gameId?: string, count?: number, offset?: number): Promise<Partial<types.ICollection>[]>;
    getRevisionGraph(query: graphQL.IRevisionQuery, revisionId: number): Promise<Partial<types.IRevision>>;
    getRevisionUploadUrl(): Promise<types.IPreSignedUrl>;
    endorseCollection(collectionId: number, endorseStatus: 'abstain' | 'endorse', gameId?: string): Promise<any>;
    rateRevision(revisionId: number, rating: number, gameId?: string): Promise<any>;
    getCollectionVideo(collectionId: number, videoId: string): Promise<any[]>;
    getOwnIssues(): Promise<types.IIssue[]>;
    sendFeedback(title: string, message: string, fileBundle: string, anonymous: boolean, groupingKey?: string, id?: string): Promise<types.IFeedbackResponse>;
    private checkFileSize;
    private request;
    private makeQueryImpl;
    private makeParameters;
    private makeFilter;
    private makeQuery;
    private makeMutation;
    private requestGraph;
    private requestGraphWithErrors;
    private mutateGraph;
    private filter;
    private args;
}
export default Nexus;
