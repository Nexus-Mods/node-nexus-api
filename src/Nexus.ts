import * as param from './parameters';
import * as types from './types';
import * as graphQL from './typesGraphQL';
import Quota from './Quota';

import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as os from 'os';
import * as process from 'process';
import * as querystring from 'querystring';
import * as url from 'url';
import format = require('string-template');
import { HTTPError, NexusError, RateLimitError, TimeoutError, ParameterInvalid, ProtocolError } from './customErrors';
import { IGraphQLError, LogFunc } from './types';

type REST_METHOD = 'DELETE' | 'POST';

//#region REST
interface IRequestArgs {
  headers?: any;
  path?: any;
  data?: any;
  method?: REST_METHOD;
  requestConfig?: {
    timeout: number,
    noDelay: boolean,
  };
  responseConfig?: {
    timeout: number,
  };
}

function handleRestResult(resolve, reject, url: string, error: any,
                          response: http.IncomingMessage, body: string, onUpdateLimit: (daily: number, hourly: number) => void) {
  if (error !== null) {
    if ((error.code === 'ETIMEDOUT') || (error.code === 'ESOCKETTIMEOUT')) {
      return reject(new TimeoutError('request timed out: ' + url));
    } else if (error.code === 'EPROTO') {
      const message = error.message.indexOf('wrong version number') !== -1 
        ? 'protocol version mismatch between client and server (if using a proxy/vpn, please ensure it supports TLS 1.2 and above)'
        : error.message;
      return reject(new ProtocolError('Security protocol error: ' + message));
    }
    return reject(error);
  }

  try {
    let hourlyLimit = response.headers['x-rl-hourly-remaining'];
    let dailyLimit = response.headers['x-rl-daily-remaining'];

    if (hourlyLimit !== undefined) {
      onUpdateLimit(parseInt(dailyLimit.toString(), 10), parseInt(hourlyLimit.toString(), 10));
    }

    if ((response.statusCode === 521)
        || (body === 'Bad Gateway')) {
      // in this case the body isn't something the api sent so it probably can't be parsed
      return reject(new NexusError('API currently offline', response.statusCode, url));
    }

    if (response.statusCode === 429) {
      // server asks us to slow down because rate limit was exceeded or high server load
      return reject(new RateLimitError());
    }

    if (response.statusCode === 202) {
      // server accepted our request but didn't produce a result in time (for an internal timeout).
      // As a result we simply don't know if the request was processed or not.
      // If it was a simple data query, this is the same as a timeout. If it was a query that
      // has a side effect (e.g. endorsing a mod) we don't know if it succeeded
      return reject(new TimeoutError('Not processed in time'));
    }

    const data = JSON.parse(body || '{}');

    if ((response.statusCode < 200) || (response.statusCode >= 300)) {
      return reject(new NexusError(data.message || data.error || response.statusMessage,
                                   response.statusCode, url));
    }

    resolve(data);
  } catch (err) {
    if ((body.length > 0) && (body[0] === '<')) {
      // if the body starts with a < it's probably an html page (which is always the case in previous cases)
      // if it is an html page, it has to be coming from a load balancer or firewall or something that apparently doesn't
      // give a shit about the content type we asked for, so the API is apparently not reachable atm.
      return reject(new NexusError('API currently not reachable, please try again later.', response.statusCode, url));
    }
    const ecMatch = body.match(/error code: ([0-9]+)/);
    if (ecMatch !== null) {
      return reject(new ProtocolError(`Network error ${ecMatch[1]}`));
    }
    reject(new Error(`failed to parse server response for request "${url}": ${err.message}`));
  }
}

function lib(inputUrl: string): typeof http | typeof https {
  return url.parse(inputUrl).protocol === 'http:'
    ? http
    : https;
}

function restGet(inputUrl: string, args: IRequestArgs, onUpdateLimit: (daily: number, hourly: number) => void): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    const finalURL = format(inputUrl, args.path || {});
    const req = lib(inputUrl).get({
      ...url.parse(finalURL),
      headers: args.headers,
      timeout: args.requestConfig.timeout,
    }, (res: http.IncomingMessage) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let err: string;
      if (statusCode >= 300) {
        err = 'Request Failed';
      } else if (!/^application\/json/.test(contentType)) {
        err = `Invalid content-type ${contentType}`;
      }

      if (err !== undefined) {
        res.resume();
        return reject(new HTTPError(statusCode, err, ''));
      }

      res.setEncoding('utf8');
      let rawData = '';
      res
        .on('data', (chunk) => { rawData += chunk; })
        .on('error', err => {
          handleRestResult(resolve, reject, inputUrl, err, res, rawData, onUpdateLimit);
        })
        .on('end', () => {
          handleRestResult(resolve, reject, inputUrl, null, res, rawData, onUpdateLimit);
        });
    });
    req.on('error', err => {
      reject(err);
    });
  });
}

function restPost(method: REST_METHOD, inputUrl: string, args: IRequestArgs, onUpdateLimit: (daily: number, hourly: number) => void): Promise<any> {
  const stackErr = new Error();
  return new Promise<any>((resolve, reject) => {
    const finalURL = format(inputUrl, args.path);
    const body = JSON.stringify(args.data);
    const buffer = new Buffer(body, 'utf8');

    const headers = {
      ...args.headers,
      'Connection': 'keep-alive',
      'Content-Length': buffer.byteLength,
    };

    if (process.env.APIKEYMASTER !== undefined) {
      headers['apikeymaster'] = process.env.APIKEYMASTER;
    }

    const req = lib(inputUrl).request({
      ...url.parse(finalURL),
      method,
      headers,
      timeout: args.requestConfig.timeout,
    }, (res: http.IncomingMessage) => {
      res.setEncoding('utf8');
      let rawData = '';

      res
        .on('data', (chunk) => { rawData += chunk; })
        .on('error', err => {
          handleRestResult(resolve, reject, inputUrl, err, res, rawData, onUpdateLimit);
        })
        .on('end', () => {
          const { statusCode } = res;
          const contentType = res.headers['content-type'];

          let err: Error = null;
          if (statusCode !== 200) {
            err = new HTTPError(res.statusCode, res.statusMessage, rawData);
          } else if (!/^application\/json/.test(contentType)) {
            err = new Error(`Invalid content-type ${contentType}`);
          }

          handleRestResult(resolve, reject, inputUrl, err, res, rawData, onUpdateLimit);
        });
    });

    req.on('error', err => {
      reject(err);
    });

    req.write(buffer);
    req.end();
  });
}

function rest(url: string, args: IRequestArgs, onUpdateLimit: (daily: number, hourly: number) => void, method?: REST_METHOD): Promise<any> {
  return args.data !== undefined
    ? restPost(method || 'POST', url, args, onUpdateLimit)
    : restGet(url, args, onUpdateLimit);
}

//#endregion

/**
 * Main class of the api
 *
 * @class Nexus
 */
class Nexus {
  private mBaseData: IRequestArgs;

  private mBaseURL = param.API_URL;
  private mGraphBaseURL = param.GRAPHQL_URL;
  private mQuota: Quota;
  private mValidationResult: types.IValidateKeyResponse;
  private mRateLimit: { daily: number, hourly: number } = { daily: 1000, hourly: 100 };
  private mLogCB: LogFunc = () => undefined;

  //#region Constructor and maintenance

  /**
   * Constructor
   * please don't use this directly, use Nexus.create
   * @param appName {string} Name of the client application
   * @param appVersion {string} Version number of the client application (Needs to be semantic format)
   * @param defaultGame {string} (nexus) id of the game requests are made for. Can be overridden per request
   * @param timeout {number} Request timeout in milliseconds. Defaults to 30 seconds
   */
  constructor(appName: string, appVersion: string, defaultGame: string, timeout?: number) {
    this.mBaseData = {
      headers: {
        'Content-Type': 'application/json',
        APIKEY: undefined,
        'Protocol-Version': param.PROTOCOL_VERSION,
        'Application-Name': appName,
        'Application-Version': appVersion,
        'User-Agent': `NexusApiClient/${param.PROTOCOL_VERSION} (${os.type()} ${os.release()}; ${process.arch})`
                    + ` Node/${process.versions.node}`,
      },
      path: {
        gameId: defaultGame,
      },
      requestConfig: {
        timeout: timeout || param.DEFAULT_TIMEOUT_MS,
        noDelay: true,
      },
      responseConfig: {
        timeout: timeout || param.DEFAULT_TIMEOUT_MS,
      },
    };

    this.mQuota = new Quota(param.QUOTA_MAX, param.QUOTA_MAX, param.QUOTA_RATE_MS);
  }

  /**
   * create a Nexus instance and immediately verify the API Key
   * 
   * @param apiKey {string} the api key to use for connections
   * @param appName {string} name of the client application
   * @param appVersion {string} Version number of the client application (Needs to be semantic format)
   * @param defaultGame {string} (nexus) id of the game requests are made for. Can be overridden per request
   * @param timeout {number} Request timeout in milliseconds. Defaults to 5000ms
   */
  public static async create(apiKey: string, appName: string, appVersion: string, defaultGame: string, timeout?: number): Promise<Nexus> {
    const res = new Nexus(appName, appVersion, defaultGame, timeout);
    res.mValidationResult = await res.setKey(apiKey);
    return res;
  }
  
  public setLogger(logCB: LogFunc): void {
    this.mLogCB = logCB;
  }

  /**
   * change the default game id
   * @param gameId {string} game id
   */
  public setGame(gameId: string): void {
    this.mBaseData.path.gameId = gameId;
  }

  /**
   * update fetch validation info (including premium state) with the same key
   */
  public async revalidate(): Promise<types.IValidateKeyResponse> {
    this.mValidationResult = await this.setKey(this.mBaseData.headers?.APIKEY);
    return this.mValidationResult;
  }

  /**
   * retrieve the result of the last key validation.
   * This is useful primarily after creating the object with Nexus.create
   */
  public getValidationResult(): types.IValidateKeyResponse {
    return this.mValidationResult;
  }

  /**
   * change the API Key and validate it This can also be used to unset the key
   * @param apiKey the new api key to set
   * @returns A promise that resolves to the user info on success or null if the apikey was undefined
   */
  public async setKey(apiKey: string): Promise<types.IValidateKeyResponse> {
    this.mBaseData.headers.APIKEY = apiKey;
    if (apiKey !== undefined) {
      try {
        this.mValidationResult = await this.validateKey(apiKey);
        return this.mValidationResult;
      }
      catch (err) {
        this.mValidationResult = null;
        throw err;
      }
    } else {
      this.mValidationResult = null;
      return null;
    }
  }

  public getRateLimits(): { daily: number, hourly: number } {
    return this.mRateLimit;
  }

  //#endregion

  //#region Account

  /**
   * validate a specific API key
   * This does not update the request quota or the cached validation result so it's
   * not useful for re-checking the key after a validation error.
   * @param key the API key to validate. Tests the current one if left undefined
   */
  public async validateKey(key?: string): Promise<types.IValidateKeyResponse> {
    // key validation doesn't have to check quota because it doesn't require/consume tickets
    return this.request(this.mBaseURL + '/users/validate',
                this.args({ headers: this.filter({ APIKEY: key }) }));
  }

  /**
   * Get list of all mods being tracked by the user
   */
  public async getTrackedMods(): Promise<types.ITrackedMod[]> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/user/tracked_mods',
                this.args({}));
  }

  /**
   * start tracking a mod
   * @param modId id of the mod
   * @param gameId id of the game
   */
  public async trackMod(modId: string, gameId?: string): Promise<types.ITrackResponse> {
    await this.mQuota.wait();
      return this.request(this.mBaseURL + '/user/tracked_mods', this.args({
        data: {
          domain_name: gameId || this.mBaseData.path.gameId,
          mod_id: modId,
        },
      }))
      .catch(err => (err.statusCode === 422)
        // 422 means already tracked, don't feel like this is an error
        ? Promise.resolve({ message: err.message })
        : Promise.reject(err));
  }

  /**
   * stop tracking a mod
   * @param modId id of the mod
   * @param gameId id of the game
   */
  public async untrackMod(modId: string, gameId?: string): Promise<types.ITrackResponse> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/user/tracked_mods', this.args({
      data: {
        domain_name: gameId || this.mBaseData.path.gameId,
        mod_id: modId,
      },
    }), 'DELETE');
  }

  //#endregion

  //#region Lists

  /**
   * retrieve a list of all games currently supported by Nexus Mods
   * @returns list of games
   */
  public async getGames(): Promise<types.IGameListEntry[]> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/games', this.args({}));
  }

  /**
   * get list of the latest added mods
   * @param gameId id of the game to query
   */
  public async getLatestAdded(gameId?: string): Promise<types.IModInfo[]> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/games/{gameId}/mods/latest_added', this.args({
      path: this.filter({ gameId }),
    }));
  }

  /**
   * get list of the latest updated mods
   * @param gameId id of the game to query
   */
  public async getLatestUpdated(gameId?: string): Promise<types.IModInfo[]> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/games/{gameId}/mods/latest_updated', this.args({
      path: this.filter({ gameId }),
    }));
  }

  /**
   * get list of trending mods
   * @param gameId id of the game to query
   */
  public async getTrending(gameId?: string): Promise<types.IModInfo[]> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/games/{gameId}/mods/trending', this.args({
      path: this.filter({ gameId }),
    }));
  }

  /**
   * get list of endorsements the user has given
   */
  public async getEndorsements(): Promise<types.IEndorsement[]> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/user/endorsements', this.args({}));
  }

  /**
   * get list of colourschemes
   */
  public async getColourschemes(): Promise<types.IColourScheme[]> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/colourschemes', this.args({}));
  }

  /**
   * get list of colorschemes
   */
  public async getColorschemes() {
    return this.getColourschemes();
  }

  //#endregion

  //#region Game info

  /**
   * retrieve details about a specific game
   * @param gameId {string} (nexus) game id to request
   */
  public async getGameInfo(gameId?: string): Promise<types.IGameInfo> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/games/{gameId}', this.args({
      path: this.filter({ gameId }),
    }));
  }

  /**
   * retrieve list of mods for a game that has recently been updated
   * @param period {string} rough time range to retrieve. This is limited to specific periods
   *                        (1d, 1w, 1m) because the list is cached on the server
   * @param gameId {string} (nexus) game id to request
   */
  public async getRecentlyUpdatedMods(period: types.UpdatePeriod, gameId?: string): Promise<types.IUpdateEntry[]> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/games/{gameId}/mods/updated?period={period}', this.args({
      path: this.filter({ gameId, period }),
    }));
  }

  //#endregion

  //#region Mod info/management

  /**
   * Endorse/Unendorse a mod
   * @param modId {number} (nexus) id of the mod to endorse
   * @param modVersion {string} version of the mod the user has installed (has to correspond to a version that actually exists)
   * @param endorseStatus {'endorse' | 'abstain'} the new endorsement state
   * @param gameId {string} (nexus) id of the game to endorse
   */
  public async endorseMod(modId: number, modVersion: string,
                          endorseStatus: 'endorse' | 'abstain', gameId?: string): Promise<types.IEndorseResponse> {
    if (['endorse', 'abstain'].indexOf(endorseStatus) === -1) {
      return Promise.reject('invalid endorse status, should be "endorse" or "abstain"');
    }
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}/{endorseStatus}', this.args({
      path: this.filter({ gameId, modId, endorseStatus }),
      data: this.filter({ Version: modVersion }),
    }));
  }

  /**
   * retrieve details about a mod
   * @param modId {number} (nexus) id of the mod
   * @param gameId {string} (nexus) game id
   */
  public async getModInfo(modId: number, gameId?: string): Promise<types.IModInfo> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}', this.args({
      path: this.filter({ modId, gameId }),
    }));
  }

  /**
   * retrieve all changelogs for a mod
   * @param modId {number} (nexus) id of the mod
   * @param gameId {string} (nexus) game id
   */
  public async getChangelogs(modId: number, gameId?: string): Promise<types.IChangelogs> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}/changelogs', this.args({
      path: this.filter({ modId, gameId }),
    }));
  }

  /**
   * get list of all files uploaded for a mod
   * @param modId {number} (nexus) id of the mod
   * @param gameId {string} (nexus) game id
   */
  public async getModFiles(modId: number, gameId?: string): Promise<types.IModFiles> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}/files', this.args({
      path: this.filter({ modId, gameId }),
    }));
  }

  //#endregion

  //#region File info
  /**
   * get details about a file
   * @param modId (nexus) id of the mod
   * @param fileId (nexus) id of the file
   * @param gameId (nexus) id of the game
   */
  public async getFileInfo(modId: number,
                           fileId: number,
                           gameId?: string): Promise<types.IFileInfo> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}/files/{fileId}', this.args({
      path: this.filter({ modId, fileId, gameId }),
    }));
  }

  /**
   * generate download links for a file
   * If the user isn't premium on Nexus Mods, this requires a key that can only
   * be generated on the website. The key is part of the nxm links that are generated by the "Download with Manager" buttons.
   * @param modId id of the mod
   * @param fileId id of the file
   * @param key a download key
   * @param expires expiry time of the key
   * @param gameId id of the game
   */
  public async getDownloadURLs(modId: number,
                               fileId: number,
                               key?: string,
                               expires?: number,
                               gameId?: string): Promise<types.IDownloadURL[]> {
    await this.mQuota.wait();
    let urlPath = '/games/{gameId}/mods/{modId}/files/{fileId}/download_link';
    if ((key !== undefined) && (expires !== undefined)) {
      urlPath += '?key={key}&expires={expires}';
    }
    return this.request(this.mBaseURL + urlPath,
                this.args({ path: this.filter({ modId, fileId, gameId, key, expires }) }));
  }

  /**
   * find information about a file based on its md5 hash
   * This can be used to find info about a file when you don't have its modid and fileid
   * Note that technically there may be multiple results for the same md5 hash, either the same
   * file uploaded in different places or (less likely) different files that just happen to have
   * the same hash.
   * This function will return all of them, you will have to sort out from the result which file
   * you were actually looking for (e.g. by comparing size)
   * @param hash the md5 hash of the file
   * @param gameId the game to search in
   */
  public async getFileByMD5(hash: string, gameId?: string): Promise<types.IMD5Result[]> {
    await this.mQuota.wait();
    const urlPath = '/games/{gameId}/mods/md5_search/{hash}';
    try {
    return this.request(this.mBaseURL + urlPath,
                this.args({path: this.filter({ gameId, hash })}));
    } catch (err) {
      if (err.code === '422') {
        throw new ParameterInvalid(err.message);
      } else {
        throw err;
      }
    }
  }

  //#endregion

  //#region GraphQL convenience

  /**
   * retrieve mod information about a list of mods by their uid
   * @param query the information to fetch
   * @param uids list of uids to fetch
   * @returns partial mod information
   * @note uids are numericals but since they are 64bit values (first 32bit identify the game,
   *       the second 32bit block identifies the mod) clients should use BigInt to do the math and
   *       then pass them in as strings
   */
  public async modsByUid(query: graphQL.IModQuery, uids: string[]): Promise<Partial<types.IMod>[]> { 
    await this.mQuota.wait();

    const res = await this.requestGraph<{ nodes: types.IMod[] }>(
      'modsByUid',
      {
        uids: { type: '[ID!]', optional: false },
      },
      { nodes: query }, { uids },
      this.args({ path: this.filter({}) }));

    return res.nodes;
  }

  /**
   * retrieve mod information about a list of mods by their uid
   * @param query the information to fetch
   * @param uids list of uids to fetch
   * @returns partial mod information
   * @note uids are numericals but since they are 64bit values (first 32bit identify the game,
   *       the second 32bit block identifies the mod) clients should use BigInt to do the math and
   *       then pass them in as strings
   */
  public async modFilesByUid(query: graphQL.IModFileQuery
                             , uids: string[])
                             : Promise<Partial<types.IModFile>[]> { 
    await this.mQuota.wait();

    const res = await this.requestGraph<{ nodes: types.IModFile[] }>(
      'modFilesByUid',
      {
        uids: { type: '[ID!]', optional: false },
      },
      { nodes: query }, { uids },
      this.args({ path: this.filter({}) }));

    return res.nodes;
  }

  /**
   * retrieve mod information about a list of mods by their md5 hash
   * @param query the information to fetch
   * @param md5Hashes list of hashes to fetch
   * @returns list of hash results
   */
  public async fileHashes(query: graphQL.IFileHashQuery
                          , md5Hashes: string[])
                          : Promise<{ data: Partial<types.IFileHash>[], errors: IGraphQLError[] }> {
    await this.mQuota.wait();

    return await this.requestGraphWithErrors<types.IFileHash[]>(
      'fileHashes',
      {
        md5s: { type: '[String!]', optional: false },
      },
      query, { md5s: md5Hashes },
      this.args({ path: this.filter({}) }));
  }

  //#endregion

  //#region Collection

  public async getCollectionDownloadLink(downloadLink: string): Promise<types.IDownloadURL[]> {
    await this.mQuota.wait();
    const res = await this.request(param.BASE_URL + downloadLink, this.args({}));
    return res.download_links ?? [res.download_link];
  }

  public async createCollection(data: types.ICollectionPayload,
                                assetFileUUID: string)
                                : Promise<types.ICreateCollectionResult> {
    await this.mQuota.wait();

    return await this.mutateGraph(
      'createCollection',
      {
        collectionData: { type: 'CollectionPayload', optional: false },
        uuid: { type: 'String', optional: false },
      },
      { collectionData: data, uuid: assetFileUUID },
      this.args({ path: this.filter({}) }),
      ['collectionId', 'revisionId', 'success'],
    );
  }

  public async updateCollection(data: types.ICollectionPayload,
                                assetFileUUID: string,
                                collectionId: number)
                                : Promise<types.ICreateCollectionResult> {
    await this.mQuota.wait();

    return await this.mutateGraph(
      'updateCollection',
      {
        collectionData: { type: 'CollectionPayload', optional: false },
        uuid: { type: 'String', optional: false },
        collectionId: { type: 'Int', optional: false },
      },
      { collectionData: data, uuid: assetFileUUID, collectionId },
      this.args({ path: this.filter({}) }),
      ['collectionId', 'revisionId', 'revisionNumber', 'success'],
    );
  }

  public async createOrUpdateRevision(data: types.ICollectionPayload,
                                      assetFileUUID: string,
                                      collectionId: number)
                                      : Promise<types.ICreateCollectionResult> {
    await this.mQuota.wait();

    return await this.mutateGraph(
      'createOrUpdateRevision',
      {
        collectionData: { type: 'CollectionPayload', optional: false },
        uuid: { type: 'String', optional: false },
        collectionId: { type: 'Int', optional: false },
      },
      { collectionData: data, uuid: assetFileUUID, collectionId },
      this.args({ path: this.filter({}) }),
      ['collectionId', 'revisionId', 'revisionNumber', 'success'],
    );
  }

  public async editCollection(collectionId: number,
                              name: string,
                              summary?: string,
                              description?: string,
                              category?: number)
                              : Promise<boolean> {
    await this.mQuota.wait();

    return (await this.mutateGraph<{ collection: types.ICollection, success: boolean }>(
      'editCollection',
      {
        collectionId: { type: 'Int', optional: false },
        name: { type: 'String', optional: true },
        summary: { type: 'String', optional: true },
        description: { type: 'String', optional: true },
        categoryId: { type: 'ID', optional: true },
      },
      { collectionId, name, summary, description, category },
      this.args({ path: this.filter({}) }),
      ['success'],
    )).success;
  }

  public async publishRevision(revisionId: number): Promise<boolean> {
    await this.mQuota.wait();

    return (await this.mutateGraph<{success: boolean}>(
      'publishRevision',
      {
        revisionId: { type: 'Int', optional: false },
      },
      { revisionId },
      this.args({ path: this.filter({}) }),
      ['success'],
    )).success;
  }

  public async attachCollectionsToCategory(categoryId: number, collectionIds: number[]): Promise<boolean> {
    await this.mQuota.wait();

    return (await this.mutateGraph<{success: boolean}>(
      'attachCollectionsToCategory',
      {
        id: { type: 'ID', optional: false },
        collectionIds: { type: '[Int!]', optional: false },
      },
      { id: categoryId, collectionIds },
      this.args({ path: this.filter({}) }),
      ['success'],
    )).success;
  }

  public async getCollectionGraph(query: graphQL.ICollectionQuery, collectionId: number): Promise<Partial<types.ICollection>> {
    await this.mQuota.wait();

    const res = await this.requestGraph<types.ICollection>(
      'collection',
      {
        id: { type: 'Int', optional: false },
      },
      query, { id: collectionId },
      this.args({ path: this.filter({}) }));

    return res;
  }

  public async getCollectionListGraph(query: graphQL.ICollectionQuery, gameId?: string, count?: number, offset?: number): Promise<Partial<types.ICollection>[]> {
    await this.mQuota.wait();

    interface ICollectionList {
      nodes: types.ICollection[];
    }

    const res = await this.requestGraph<ICollectionList>(
      'collections',
      {
        gameDomain: { type: 'String', optional: false },
        count: { type: 'Int', optional: true },
        offset: { type: 'Int', optional: true },
        // categoryId
        // sortBy
        // sortDirection
      },
      { nodes: query }, { gameDomain: gameId || this.mBaseData.path.game, count, offset },
      this.args({ path: this.filter({}) }));

    return res.nodes;
  }

  public async getRevisionGraph(query: graphQL.IRevisionQuery, revisionId: number): Promise<Partial<types.IRevision>> {
    await this.mQuota.wait();

    const res = await this.requestGraph<types.IRevision>(
      'collectionRevision',
      {
        id: { type: 'Int', optional: false },
      },
      query, { id: revisionId },
      this.args({ path: this.filter({}) }));

    return res;
  }

  public async getRevisionUploadUrl(): Promise<types.IPreSignedUrl> {
    await this.mQuota.wait();

    const res = await this.requestGraph<types.IPreSignedUrl>(
      'collectionRevisionUploadUrl',
      {
      }, {
        url: true,
        uuid: true,
      }, {

      },
      this.args({ path: this.filter({}) }));

    return res;
  }

  /**
   * endorse a collection
   * @param collectionId the collection to endorse
   * @param endorseStatus the new endorsement status
   * @param gameId id of the game
   */
  public async endorseCollection(collectionId: number, endorseStatus: 'abstain' | 'endorse', gameId?: string) {
    if (['endorse', 'abstain'].indexOf(endorseStatus) === -1) {
      return Promise.reject('invalid endorse status, should be "endorse" or "abstain"');
    }

    await this.mQuota.wait();

    return await this.request(this.mBaseURL + '/endorsements', this.args({
      data: {
        rating: endorseStatus === 'endorse' ? 10 : 0,
        game_id: gameId || this.mBaseData.path.gameId,
        rateable_type: 'collection',
        rateable_id: collectionId,
      },
    }), 'POST');
  }

  /**
   * rate a collection revision (how well it worked, not whether the user liked the content, use endorsements for that!)
   * @param collectionId collection id
   * @param rating the rating, between -10 (didn't work at all) and +10 (worked perfectly)
   * @param gameId id of the game
   */
  public async rateRevision(revisionId: number, rating: number, gameId?: string) {
    if ((rating < -10) || (rating > 10)) {
      return Promise.reject('valid ratings are -10 to 10');
    }
    await this.mQuota.wait();

    return await this.request(this.mBaseURL + '/ratings', this.args({
      data: {
        rating,
        game_domain_name: gameId || this.mBaseData.path.gameId,
        rateable_type: 'revision',
        rateable_id: revisionId,
      },
    }), 'POST');
  }

  //#endregion

  //#region Media

  /**
   * get informationo about a collection video
   * @param collectionId id of the collection
   */
  public async getCollectionVideo(collectionId: number, videoId: string): Promise<any[]> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/collections/{collectionId}/videos', this.args({
      path: this.filter({ collectionId }),
    }));
  }

  //#endregion

  //#region Feedback

  // these apis are only intended for the use in Vortex and don't make sense
  // for third party applications

  /**
   * get list of issues reported by this user
   * FOR INTERNAL USE ONLY
   */
  public async getOwnIssues(): Promise<types.IIssue[]> {
    await this.mQuota.wait();
    return this.request(this.mBaseURL + '/feedbacks/list_user_issues/', this.args({}))
      .then(obj => obj.issues);
  }

  /**
   * send a feedback message
   * FOR INTERNAL USE ONLY
   *
   * @param title title of the message
   * @param message content
   * @param fileBundle path to an archive that is sent along
   * @param anonymous whether the report should be made anonymously
   * @param groupingKey a key that is used to group identical reports
   * @param id reference id
   */
  public async sendFeedback(title: string,
                            message: string,
                            fileBundle: string,
                            anonymous: boolean,
                            groupingKey?: string,
                            id?: string): Promise<types.IFeedbackResponse> {
    await this.mQuota.wait();
    if (message.length === 0) {
      return Promise.reject(new Error('Feedback message can\'t be empty'));
    }
    return this.checkFileSize(fileBundle)
      .then(() => new Promise<types.IFeedbackResponse>((resolve, reject) => {
        const formData = {
          feedback_text: message,
          feedback_title: title.substr(0, 255),
        };
        if (fileBundle !== undefined) {
          formData['feedback_file'] = fs.createReadStream(fileBundle);
        }
        if (groupingKey !== undefined) {
          formData['grouping_key'] = groupingKey;
        }
        if (id !== undefined) {
          formData['reference'] = id;
        }
        const headers = { ...this.mBaseData.headers };

        if (anonymous) {
          delete headers['APIKEY'];
        }

        const inputUrl = anonymous
          ? `${param.API_URL}/feedbacks/anonymous`
          : `${param.API_URL}/feedbacks`;

        const req = lib(inputUrl).request({
          ...url.parse(inputUrl),
          method: 'POST',
          headers,
          timeout: 30000,
        }, (res: http.IncomingMessage) => {
          res.setEncoding('utf8');
          let rawData = '';
          res
            .on('data', (chunk) => { rawData += chunk; })
            .on('error', err => {
              return reject(err);
            })
            .on('end', () => {
              if (res.statusCode >= 400) {
                return reject(new HTTPError(res.statusCode, res.statusMessage, rawData));
              } else {
                return resolve(JSON.parse(rawData));
              }
            });
        });

        req.write(querystring.stringify(formData));
        req.end();
      }));
  }

  //#endregion

  //#region Implementation

  private checkFileSize(filePath: string): Promise<void> {
    if (filePath === undefined) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err: Error, stats: fs.Stats) => {
        if (err !== null) {
          return reject(err);
        }

        if (stats.size > param.MAX_FILE_SIZE) {
          return reject(new ParameterInvalid('The attachment is too large'));
        }

        resolve();
      });
    });
  }

  private async request(url: string, args: IRequestArgs, method?: REST_METHOD): Promise<any> {
    this.mLogCB('info', 'sending request', { url, args: JSON.stringify(args) });
    try {
      return await rest(url, args, (daily: number, hourly: number) => {
        this.mRateLimit = { daily, hourly };
        this.mQuota.updateLimit(Math.max(daily, hourly));
      }, method);
    } catch (err) {
      if (err instanceof RateLimitError) {
        if (!this.mQuota.block()) {
          await this.mQuota.wait();
          return this.request(url, args, method);
        }
      }
      throw err;
    }
  }

  private makeQueryImpl<T>(query: any, variables: any, indent: string) {
    return Object.keys(query).reduce((prev, key) => {
      if (query[key] !== false) {
        prev += (indent + key);
        if (typeof query[key] !== 'boolean') {
          prev = prev +
            ' {\n'
            + this.makeQueryImpl(query[key], variables, indent + '  ')
            + `${indent}}`;
        }
        return prev + '\n';
      }
      return prev;
    }, '') + indent;
  }

  private makeParameters(parameters: graphQL.GraphQueryParameters) {
    const serParameter = (par: { type: graphQL.GraphQLType, optional: boolean }) => {
      return `${par.type}${par.optional ? '' : '!'}`;
    }
    let parString = Object.keys(parameters)
      .map(key => `\$${key}: ${serParameter(parameters[key])}`)
      .join(', ');
    if (parString.length > 0) {
      parString = `(${parString})`;
    }
    return parString;
  }

  private makeFilter(parameters: graphQL.GraphQueryParameters) {
    let filtString = Object.keys(parameters)
      .map(key => `${key}: \$${key}`)
      .join(', ');
    if (filtString.length > 0) {
      filtString = `(${filtString})`;
    }
    return filtString;
  }

  private makeQuery<T>(name: string, parameters: graphQL.GraphQueryParameters, query: any, variables: any) {
    const pars = this.makeParameters(parameters);
    const filters = this.makeFilter(parameters);
    return `query ${name}${pars} {\n`
      + `  ${name}${filters} {${this.makeQueryImpl(query, variables, '    ')}`
      + '  }\n'
      + '}';
  }

  private makeMutation<T>(name: string,
                          parameters: graphQL.GraphQueryParameters,
                          retValues: Array<keyof T>): string {
    const pars = this.makeParameters(parameters);
    const filters = this.makeFilter(parameters);
    return `mutation ${name}${pars} {\n`
      + `  ${name}${filters} { ${retValues} }`
      + '}';
  }

  private genError(input: any[]): Error {
    const ex = new Error(input.map(err => err.message).join(', '));
    const callPath = input.find(iter => iter.path !== undefined);
    if (callPath !== undefined) {
      ex['call'] = callPath.path.join(', ');
    }
    const codeEx = input.find(iter => iter.extensions?.code !== undefined);
    if (codeEx !== undefined) {
      ex['code'] = codeEx.extensions.code;
    }
    return ex;
  }

  private async requestGraph<T>(root: string, parameters: graphQL.GraphQueryParameters, query: any,
                                variables: any, args: IRequestArgs): Promise<T> {
    args.data = {
      query: this.makeQuery<T>(root, parameters, query, variables),
      variables,
    };

    const res = await this.request(this.mGraphBaseURL, args, 'POST');
    if (res.data) {
      return res.data[root];
    } else {
      throw this.genError(res.errors);
    }
  }

  private async requestGraphWithErrors<T>(root: string
                                          , parameters: graphQL.GraphQueryParameters
                                          , query: any
                                          , variables: any
                                          , args: IRequestArgs)
                                          : Promise<{ data: T, errors: IGraphQLError[] }> {
    args.data = {
      query: this.makeQuery<T>(root, parameters, query, variables),
      variables,
    };

    const res = await this.request(this.mGraphBaseURL, args, 'POST');
    if (res.data) {
      return { data: res.data[root], errors: res.errors };
    } else {
      throw this.genError(res.errors);
    }
  }

  private async mutateGraph<T>(name: string, parameters: graphQL.GraphQueryParameters,
                               data: any, args: IRequestArgs,
                               retValues: Array<keyof T>): Promise<T> {
    args.data = {
      query: this.makeMutation<T>(name, parameters, retValues),
      variables: data,
    }
    const res = await this.request(this.mGraphBaseURL, args, 'POST');
    if (!!(res.data?.[name])) {
      return res.data[name];
    } else {
      throw new Error(res.errors.map(err => err.message).join(', '));
    }
  }

  private filter(obj: any): any {
    const result = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== undefined) {
        result[key] = obj[key];
      }
    });
    return result;
  }

  private args(customArgs: IRequestArgs) {
    const result: IRequestArgs = { ...this.mBaseData };
    for (const key of Object.keys(customArgs)) {
      result[key] = {
        ...result[key],
        ...customArgs[key],
      };
    }
    return result;
  }
  //#endregion
}

export default Nexus;
