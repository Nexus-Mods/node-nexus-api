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
const http = require("http");
const https = require("https");
const os = require("os");
const process = require("process");
const querystring = require("querystring");
const url = require("url");
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
        const ecMatch = body.match(/error code: ([0-9]+)/);
        if (ecMatch == null) {
            return reject(new customErrors_1.ProtocolError(`Network error ${ecMatch[1]}`));
        }
        reject(new Error(`failed to parse server response for request "${url}": ${err.message}`));
    }
}
function lib(inputUrl) {
    return url.parse(inputUrl).protocol === 'http:'
        ? http
        : https;
}
function restGet(inputUrl, args, onUpdateLimit) {
    return new Promise((resolve, reject) => {
        const started = Date.now();
        const finalURL = format(inputUrl, args.path || {});
        lib(inputUrl).get(Object.assign(Object.assign({}, url.parse(finalURL)), { headers: args.headers, timeout: args.requestConfig.timeout }), (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
            let err;
            if (statusCode !== 200) {
                err = `Request Failed. Status Code: ${statusCode}`;
            }
            else if (!/^application\/json/.test(contentType)) {
                err = `Invalid content-type ${contentType}`;
            }
            if (err !== undefined) {
                res.resume();
                return reject(new Error(err));
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
    });
}
function restPost(method, inputUrl, args, onUpdateLimit) {
    const stackErr = new Error();
    return new Promise((resolve, reject) => {
        const finalURL = format(inputUrl, args.path);
        const body = JSON.stringify(args.data, undefined, 2);
        const headers = Object.assign(Object.assign({}, args.headers), { 'Content-Length': body.length });
        if (process.env.APIKEYMASTER !== undefined) {
            headers['apikeymaster'] = process.env.APIKEYMASTER;
        }
        const req = lib(inputUrl).request(Object.assign(Object.assign({}, url.parse(finalURL)), { method,
            headers, timeout: args.requestConfig.timeout }), (res) => {
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
                let err = null;
                if (statusCode !== 200) {
                    err = new customErrors_1.HTTPError(res.statusCode, res.statusMessage, rawData);
                }
                else if (!/^application\/json/.test(contentType)) {
                    err = new Error(`Invalid content-type ${contentType}`);
                }
                handleRestResult(resolve, reject, inputUrl, err, res, rawData, onUpdateLimit);
            });
        });
        req.write(body);
        req.end();
    });
}
function rest(url, args, onUpdateLimit, method) {
    return args.data !== undefined
        ? restPost(method || 'POST', url, args, onUpdateLimit)
        : restGet(url, args, onUpdateLimit);
}
class Nexus {
    constructor(appName, appVersion, defaultGame, timeout) {
        this.mBaseURL = param.API_URL;
        this.mGraphBaseURL = param.GRAPHQL_URL;
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
    createCollection(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return yield this.mutateGraph('createCollection', {
                collectionData: { type: 'CollectionPayload', optional: false },
            }, { collectionData: data }, this.args({ path: this.filter({}) }));
        });
    }
    updateCollection(data, collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return yield this.mutateGraph('updateCollection', {
                collectionData: { type: 'CollectionPayload', optional: false },
                collectionId: { type: 'Int', optional: false },
            }, { collectionData: data, collectionId }, this.args({ path: this.filter({}) }));
        });
    }
    getCollectionGraph(query, collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.requestGraph('collection', {
                id: { type: 'Int', optional: false },
            }, query, { id: collectionId }, this.args({ path: this.filter({}) }));
            return res;
        });
    }
    getCollectionListGraph(query, gameId, count, page) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.requestGraph('collections', {
                game: { type: 'String', optional: false },
                count: { type: 'Int', optional: true },
                page: { type: 'Int', optional: true },
            }, query, { game: gameId || this.mBaseData.path.game, count, page }, this.args({ path: this.filter({}) }));
            return res;
        });
    }
    getRevisionGraph(query, revisionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.requestGraph('collectionRevision', {
                id: { type: 'Int', optional: false },
            }, query, { id: revisionId }, this.args({ path: this.filter({}) }));
            return res;
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
    rateRevision(revisionId, rating, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((rating < -10) || (rating > 10)) {
                return Promise.reject('valid ratings are -10 to 10');
            }
            yield this.mQuota.wait();
            return yield this.request(this.mBaseURL + '/ratings', this.args({
                data: {
                    rating,
                    game_domain_name: gameId || this.mBaseData.path.gameId,
                    rateable_type: 'revision',
                    rateable_id: revisionId,
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
                const inputUrl = anonymous
                    ? `${param.API_URL}/feedbacks/anonymous`
                    : `${param.API_URL}/feedbacks`;
                const req = lib(inputUrl).request(Object.assign(Object.assign({}, url.parse(inputUrl)), { method: 'POST', headers, timeout: 30000 }), (res) => {
                    res.setEncoding('utf8');
                    let rawData = '';
                    res
                        .on('data', (chunk) => { rawData += chunk; })
                        .on('error', err => {
                        return reject(err);
                    })
                        .on('end', () => {
                        if (res.statusCode >= 400) {
                            return reject(new customErrors_1.HTTPError(res.statusCode, res.statusMessage, rawData));
                        }
                        else {
                            return resolve(JSON.parse(rawData));
                        }
                    });
                });
                req.write(querystring.stringify(formData));
                req.end();
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
    makeQueryImpl(query, variables, indent) {
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
    makeParameters(parameters) {
        const serParameter = (par) => {
            return `${par.type}${par.optional ? '' : '!'}`;
        };
        return Object.keys(parameters)
            .map(key => `\$${key}: ${serParameter(parameters[key])}`)
            .join(', ');
    }
    makeFilter(parameters) {
        return Object.keys(parameters)
            .map(key => `${key}: \$${key}`)
            .join(', ');
    }
    makeQuery(name, parameters, query, variables) {
        return `query ${name}(${this.makeParameters(parameters)}) {\n`
            + `  ${name}(${this.makeFilter(parameters)}) {${this.makeQueryImpl(query, variables, '    ')}`
            + '  }\n'
            + '}';
    }
    makeMutation(name, parameters, data) {
        return `mutation ${name}(${this.makeParameters(parameters)}) {\n`
            + `  ${name}(${this.makeFilter(parameters)}) { collectionId, revisionId, success }`
            + '}';
    }
    requestGraph(root, parameters, query, variables, args) {
        return __awaiter(this, void 0, void 0, function* () {
            args.data = {
                query: this.makeQuery(root, parameters, query, variables),
                variables,
            };
            const res = yield this.request(this.mGraphBaseURL, args, 'POST');
            if (res.data) {
                return res.data[root];
            }
            else {
                throw new Error(res.errors.map(err => err.message).join(', '));
            }
        });
    }
    mutateGraph(name, parameters, data, args) {
        return __awaiter(this, void 0, void 0, function* () {
            args.data = {
                query: this.makeMutation(name, parameters, data),
                variables: data,
            };
            const res = yield this.request(this.mGraphBaseURL, args, 'POST');
            if (res.data) {
                return res.data[name];
            }
            else {
                throw new Error(res.errors.map(err => err.message).join(', '));
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