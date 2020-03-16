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
const param = require("./parameters");
const Quota_1 = require("./Quota");
const fs = require("fs");
const os = require("os");
const process = require("process");
const request = require("request");
const format = require("string-template");
const customErrors_1 = require("./customErrors");
function handleRestResult(resolve, reject, url, error, response, body, onUpdateLimit) {
    if (error !== null) {
        if ((error.code === 'ETIMEDOUT') || (error.code === 'ESOCKETTIMEOUT')) {
            return reject(new customErrors_1.TimeoutError('request timed out: ' + url));
        }
        else if (error.code === 'EPROTO') {
            const message = error.message.indexOf('wrong version number') !== -1
                ? 'protocol version mismatch between client and server (if using a proxy/vpn, please ensure it supports TLS 1.2 and above)'
                : error.message;
            return reject(new customErrors_1.ProtocolError('Security protocol error: ' + message));
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
            return reject(new customErrors_1.NexusError('API currently offline', response.statusCode, url));
        }
        if (response.statusCode === 429) {
            return reject(new customErrors_1.RateLimitError());
        }
        if (response.statusCode === 202) {
            return reject(new customErrors_1.TimeoutError('Not processed in time'));
        }
        const data = JSON.parse(body || '{}');
        if ((response.statusCode < 200) || (response.statusCode >= 300)) {
            return reject(new customErrors_1.NexusError(data.message || data.error || response.statusMessage, response.statusCode, url));
        }
        resolve(data);
    }
    catch (err) {
        if ((body.length > 0) && (body[0] === '<')) {
            return reject(new customErrors_1.NexusError('API currently not reachable, please try again later.', response.statusCode, url));
        }
        reject(new Error(`failed to parse server response for request "${url}": ${err.message}`));
    }
}
function restGet(url, args, onUpdateLimit) {
    const stackErr = new Error();
    return new Promise((resolve, reject) => {
        const finalURL = format(url, args.path || {});
        request.get(finalURL, {
            headers: args.headers,
            followRedirect: true,
            timeout: args.requestConfig.timeout,
            agentOptions: {
                secureProtocol: args.requestConfig.securityProtocol
            },
        }, (error, response, body) => {
            if (error) {
                error.message += ` (request: ${url})`;
                error.stack += '\n' + stackErr.stack;
            }
            handleRestResult(resolve, reject, url, error, response, body, onUpdateLimit);
        });
    });
}
function restPost(method, url, args, onUpdateLimit) {
    const stackErr = new Error();
    return new Promise((resolve, reject) => {
        const finalURL = format(url, args.path);
        console.log('POST', finalURL);
        request({
            method,
            url: finalURL,
            headers: args.headers,
            followRedirect: true,
            timeout: args.requestConfig.timeout,
            agentOptions: {
                secureProtocol: args.requestConfig.securityProtocol
            },
            body: JSON.stringify(args.data),
        }, (error, response, body) => {
            if (error) {
                error.message += ` (request: ${url})`;
                error.stack += '\n' + stackErr.stack;
            }
            handleRestResult(resolve, reject, url, error, response, body, onUpdateLimit);
        });
    });
}
function rest(url, args, onUpdateLimit, method) {
    console.log('rest request', url, args);
    return args.data !== undefined
        ? restPost(method || 'POST', url, args, onUpdateLimit)
        : restGet(url, args, onUpdateLimit);
}
class Nexus {
    constructor(appName, appVersion, defaultGame, timeout) {
        this.mBaseURL = param.API_URL;
        this.mRateLimit = { daily: 1000, hourly: 100 };
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
                securityProtocol: param.SECURITY_PROTOCOL_VERSION,
                timeout: timeout || param.DEFAULT_TIMEOUT_MS,
                noDelay: true,
            },
            responseConfig: {
                timeout: timeout || param.DEFAULT_TIMEOUT_MS,
            },
        };
        this.mQuota = new Quota_1.default(param.QUOTA_MAX, param.QUOTA_MAX, param.QUOTA_RATE_MS);
    }
    static create(apiKey, appName, appVersion, defaultGame, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = new Nexus(appName, appVersion, defaultGame, timeout);
            res.mValidationResult = yield res.setKey(apiKey);
            return res;
        });
    }
    setGame(gameId) {
        this.mBaseData.path.gameId = gameId;
    }
    getValidationResult() {
        return this.mValidationResult;
    }
    setKey(apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            this.mBaseData.headers.APIKEY = apiKey;
            if (apiKey !== undefined) {
                try {
                    this.mValidationResult = yield this.validateKey(apiKey);
                    return this.mValidationResult;
                }
                catch (err) {
                    this.mValidationResult = null;
                    throw err;
                }
            }
            else {
                this.mValidationResult = null;
                return null;
            }
        });
    }
    getRateLimits() {
        return this.mRateLimit;
    }
    validateKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(this.mBaseURL + '/users/validate', this.args({ headers: this.filter({ APIKEY: key }) }));
        });
    }
    getTrackedMods() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/user/tracked_mods', this.args({}));
        });
    }
    trackMod(modId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/user/tracked_mods', this.args({
                data: {
                    domain_name: gameId || this.mBaseData.path.gameId,
                    mod_id: modId,
                },
            }))
                .catch(err => (err.statusCode === 422)
                ? Promise.resolve({ message: err.message })
                : Promise.reject(err));
        });
    }
    untrackMod(modId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/user/tracked_mods', this.args({
                data: {
                    domain_name: gameId || this.mBaseData.path.gameId,
                    mod_id: modId,
                },
            }), 'DELETE');
        });
    }
    getGames() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games', this.args({}));
        });
    }
    getLatestAdded(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/latest_added', this.args({
                path: this.filter({ gameId }),
            }));
        });
    }
    getLatestUpdated(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/latest_updated', this.args({
                path: this.filter({ gameId }),
            }));
        });
    }
    getTrending(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/trending', this.args({
                path: this.filter({ gameId }),
            }));
        });
    }
    getCollectionsByGame(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.request(this.mBaseURL + '/games/{gameId}/collections', this.args({
                path: this.filter({ gameId }),
            }));
            return res.collections;
        });
    }
    getCollectionsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.request(this.mBaseURL + '/users/{userId}/collections', this.args({
                path: this.filter({ userId }),
            }));
            return res.collections;
        });
    }
    getRevisions(collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.request(this.mBaseURL + '/collections/{collectionId}/revisions', this.args({
                path: this.filter({ collectionId }),
            }));
            return res.collection_revisions;
        });
    }
    getRevisionMods(collectionId, revisionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/collections/{collectionId}/revisions/{revisionId}/revision_mods', this.args({
                path: this.filter({ collectionId, revisionId }),
            }));
        });
    }
    getCollectionImages(collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/collections/{collectionId}/images', this.args({
                path: this.filter({ collectionId }),
            }));
        });
    }
    getCollectionVideos(collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/collections/{collectionId}/videos', this.args({
                path: this.filter({ collectionId }),
            }));
        });
    }
    getEndorsements() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/user/endorsements', this.args({}));
        });
    }
    getColourschemes() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/colourschemes', this.args({}));
        });
    }
    getColorschemes() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getColourschemes();
        });
    }
    getGameInfo(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}', this.args({
                path: this.filter({ gameId }),
            }));
        });
    }
    getRecentlyUpdatedMods(period, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/updated?period={period}', this.args({
                path: this.filter({ gameId, period }),
            }));
        });
    }
    endorseMod(modId, modVersion, endorseStatus, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (['endorse', 'abstain'].indexOf(endorseStatus) === -1) {
                return Promise.reject('invalid endorse status, should be "endorse" or "abstain"');
            }
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}/{endorseStatus}', this.args({
                path: this.filter({ gameId, modId, endorseStatus }),
                data: this.filter({ Version: modVersion }),
            }));
        });
    }
    getModInfo(modId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}', this.args({
                path: this.filter({ modId, gameId }),
            }));
        });
    }
    getChangelogs(modId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}/changelogs', this.args({
                path: this.filter({ modId, gameId }),
            }));
        });
    }
    getModFiles(modId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}/files', this.args({
                path: this.filter({ modId, gameId }),
            }));
        });
    }
    getFileInfo(modId, fileId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}/files/{fileId}', this.args({
                path: this.filter({ modId, fileId, gameId }),
            }));
        });
    }
    getDownloadURLs(modId, fileId, key, expires, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            let urlPath = '/games/{gameId}/mods/{modId}/files/{fileId}/download_link';
            if ((key !== undefined) && (expires !== undefined)) {
                urlPath += '?key={key}&expires={expires}';
            }
            return this.request(this.mBaseURL + urlPath, this.args({ path: this.filter({ modId, fileId, gameId, key, expires }) }));
        });
    }
    getFileByMD5(hash, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const urlPath = '/games/{gameId}/mods/md5_search/{hash}';
            try {
                return this.request(this.mBaseURL + urlPath, this.args({ path: this.filter({ gameId, hash }) }));
            }
            catch (err) {
                if (err.code === '422') {
                    throw new customErrors_1.ParameterInvalid(err.message);
                }
                else {
                    throw err;
                }
            }
        });
    }
    sendCollection(manifest, assetFilePath, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return new Promise((resolve, reject) => {
                const formData = {
                    collection_schema_id: 1,
                    name: manifest.info.name,
                    description: manifest.info.description,
                    summary: manifest.info.description,
                    adult_content: manifest.info.adult_content ? 'true' : 'false',
                    collection_manifest: JSON.stringify(manifest),
                    collection_data: fs.createReadStream(assetFilePath),
                };
                if (manifest.info.collection_id !== undefined) {
                    formData['collection_id'] = manifest.info.collection_id;
                }
                const baseUrl = param.API_DEV_URL || param.API_URL;
                const url = `${baseUrl}/games/${gameId || this.mBaseData.path.gameId}/collections/revisions`;
                const headers = Object.assign({}, this.mBaseData.headers);
                if (!!param.APIKEY_DEV) {
                    headers.APIKEY = param.APIKEY_DEV;
                }
                request.post({
                    headers,
                    url,
                    formData,
                    timeout: this.mBaseData.requestConfig.timeout,
                }, (error, response, body) => {
                    if (error !== null) {
                        return reject(error);
                    }
                    else if (response.statusCode >= 400) {
                        if (response.statusCode === 422) {
                            try {
                                const parsed = JSON.parse(body);
                                const ex = parsed.message !== undefined
                                    ? new customErrors_1.ParameterInvalid(parsed.message)
                                    : new customErrors_1.ParameterInvalid(parsed);
                                if (parsed.name !== undefined) {
                                    ex.name = parsed.name;
                                }
                                Object.keys(parsed).forEach(key => {
                                    if (['name', 'message'].indexOf(key) === -1) {
                                        ex[key] = parsed[key];
                                    }
                                });
                                return reject(ex);
                            }
                            catch (err) {
                                return reject(new customErrors_1.ParameterInvalid(body));
                            }
                        }
                        else {
                            return reject(new customErrors_1.HTTPError(response.statusCode, response.statusMessage, body));
                        }
                    }
                    else {
                        const result = JSON.parse(body);
                        return resolve(result.collection_revision);
                    }
                });
            });
        });
    }
    getCollectionInfo(collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.request(this.mBaseURL + '/collections/{collectionId}', this.args({ path: this.filter({ collectionId }) }));
            return res.collection;
        });
    }
    getRevisionInfo(collectionId, revisionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.request(this.mBaseURL + '/collections/{collectionId}/revisions/{revisionId}', this.args({
                path: this.filter({ collectionId, revisionId }),
            }));
            return res.collection_revision;
        });
    }
    getCollectionDownloadURLs(collectionId, revisionId, key, expires, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            let urlPath = '/games/{gameId}/collections/{collectionId}/revisions/{revisionId}/download_link';
            if ((key !== undefined) && (expires !== undefined)) {
                urlPath += '?key={key}&expires={expires}';
            }
            return this.request(this.mBaseURL + urlPath, this.args({ path: this.filter({ collectionId, revisionId, gameId, key, expires }) }));
        });
    }
    endorseCollection(collectionId, endorseStatus, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (['endorse', 'abstain'].indexOf(endorseStatus) === -1) {
                return Promise.reject('invalid endorse status, should be "endorse" or "abstain"');
            }
            yield this.mQuota.wait();
            return yield this.request(this.mBaseURL + '/endorsements', this.args({
                data: {
                    rating: endorseStatus === 'endorse' ? 10 : 0,
                    game_id: gameId || this.mBaseData.path.gameId,
                    rateable_type: 'collection',
                    rateable_id: collectionId,
                },
            }), 'POST');
        });
    }
    rateCollection(collectionId, rating, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((rating < -10) || (rating > 10)) {
                return Promise.reject('valid ratings are -10 to 10');
            }
            yield this.mQuota.wait();
            return yield this.request(this.mBaseURL + '/ratings', this.args({
                data: {
                    rating,
                    game_id: gameId || this.mBaseData.path.gameId,
                    rateable_type: 'collection',
                    rateable_id: collectionId,
                },
            }), 'POST');
        });
    }
    getCollectionVideo(collectionId, videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/collections/{collectionId}/videos', this.args({
                path: this.filter({ collectionId }),
            }));
        });
    }
    getOwnIssues() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/feedbacks/list_user_issues/', this.args({}))
                .then(obj => obj.issues);
        });
    }
    sendFeedback(title, message, fileBundle, anonymous, groupingKey, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            if (message.length === 0) {
                return Promise.reject(new Error('Feedback message can\'t be empty'));
            }
            return this.checkFileSize(fileBundle)
                .then(() => new Promise((resolve, reject) => {
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
                const headers = Object.assign({}, this.mBaseData.headers);
                if (anonymous) {
                    delete headers['APIKEY'];
                }
                const url = anonymous
                    ? `${param.API_URL}/feedbacks/anonymous`
                    : `${param.API_URL}/feedbacks`;
                request.post({
                    headers,
                    url,
                    formData,
                    timeout: 30000,
                }, (error, response, body) => {
                    if (error !== null) {
                        return reject(error);
                    }
                    else if (response.statusCode >= 400) {
                        return reject(new customErrors_1.HTTPError(response.statusCode, response.statusMessage, body));
                    }
                    else {
                        return resolve(JSON.parse(body));
                    }
                });
            }));
        });
    }
    checkFileSize(filePath) {
        if (filePath === undefined) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
                if (err !== null) {
                    return reject(err);
                }
                if (stats.size > param.MAX_FILE_SIZE) {
                    return reject(new customErrors_1.ParameterInvalid('The attachment is too large'));
                }
                resolve();
            });
        });
    }
    request(url, args, method) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield rest(url, args, (daily, hourly) => {
                    this.mRateLimit = { daily, hourly };
                    this.mQuota.updateLimit(Math.max(daily, hourly));
                }, method);
            }
            catch (err) {
                if (err instanceof customErrors_1.RateLimitError) {
                    if (!this.mQuota.block()) {
                        yield this.mQuota.wait();
                        return this.request(url, args, method);
                    }
                }
                throw err;
            }
        });
    }
    filter(obj) {
        const result = {};
        Object.keys(obj).forEach((key) => {
            if (obj[key] !== undefined) {
                result[key] = obj[key];
            }
        });
        return result;
    }
    args(customArgs) {
        const result = Object.assign({}, this.mBaseData);
        for (const key of Object.keys(customArgs)) {
            result[key] = Object.assign(Object.assign({}, result[key]), customArgs[key]);
        }
        return result;
    }
}
exports.default = Nexus;
//# sourceMappingURL=Nexus.js.map