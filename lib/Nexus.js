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
const FormData = require("form-data");
const fs = require("fs");
const http = require("http");
const https = require("https");
const os = require("os");
const process = require("process");
const url = require("url");
const setCookieParser = require("set-cookie-parser");
const format = require("string-template");
const jwt = require("jsonwebtoken");
const customErrors_1 = require("./customErrors");
function translateMessage(message) {
    var _a;
    return (_a = {
        'TOO_SOON_AFTER_DOWNLOAD': 'You have to wait 15 minutes before endorsing a mod.',
        'NOT_DOWNLOADED_MOD': 'You have not downloaded this mod (with this account).',
    }[message]) !== null && _a !== void 0 ? _a : message;
}
function chunkify(input, maxSize) {
    const res = [];
    for (let i = 0; i < input.length; i += maxSize) {
        const chunk = input.slice(i, i + maxSize);
        res.push(chunk);
    }
    return res;
}
const REFRESH_TOKEN_ERRORS = [
    'Token has expired',
    'Signature verification raised',
    'invalid_token'
];
function handleRestResult(resolve, reject, url, error, response, body, onUpdateLimit) {
    var _a;
    if (error !== null) {
        try {
            const data = JSON.parse(body);
            const message = (_a = data.message) !== null && _a !== void 0 ? _a : data.error;
            if (message) {
                if ((response.statusCode === 401)) {
                }
                return reject(new customErrors_1.NexusError(translateMessage(message), response.statusCode, url, message, data.error_description));
            }
        }
        catch (_e) {
        }
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
            return reject(new customErrors_1.NexusError('API currently offline', response.statusCode, url, body));
        }
        if (response.statusCode === 429) {
            return reject(new customErrors_1.RateLimitError());
        }
        if (response.statusCode === 202) {
            return reject(new customErrors_1.TimeoutError('Not processed in time'));
        }
        const data = JSON.parse(body || '{}');
        if ((response.statusCode < 200) || (response.statusCode >= 300)) {
            const message = data.message || data.error || response.statusMessage;
            return reject(new customErrors_1.NexusError(message, response.statusCode, url, message));
        }
        const cookies = setCookieParser.parse(response, { map: true });
        if (cookies['jwt_fingerprint'] !== undefined) {
            data['jwt_fingerprint'] = cookies['jwt_fingerprint'].value;
        }
        resolve(data);
    }
    catch (err) {
        if ((body.length > 0) && (body[0] === '<')) {
            return reject(new customErrors_1.NexusError('API currently not reachable, please try again later.', response.statusCode, url, 'API_UNREACHABLE'));
        }
        const ecMatch = body.match(/error code: ([0-9]+)/);
        if (ecMatch !== null) {
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
        var _a;
        const finalURL = format(inputUrl, args.path || {});
        const headers = parseRequestCookies(args).headers;
        if (((_a = headers === null || headers === void 0 ? void 0 : headers.hasOwnProperty) === null || _a === void 0 ? void 0 : _a.call(headers, 'APIKEY')) && (headers['APIKEY'] === undefined)) {
            delete headers['APIKEY'];
        }
        const req = lib(inputUrl).get(Object.assign(Object.assign({}, url.parse(finalURL)), { headers, timeout: args.requestConfig.timeout }), (res) => {
            const { statusCode, statusMessage } = res;
            const contentType = res.headers['content-type'];
            let err;
            if ((statusCode === 401)) {
            }
            if (statusCode >= 300) {
                err = 'Request Failed';
            }
            else if (!/^application\/json/.test(contentType)) {
                err = `Invalid content-type ${contentType}`;
            }
            if (err !== undefined) {
                res.resume();
                return reject(new customErrors_1.HTTPError(statusCode, err, '', finalURL));
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
function restPost(method, inputUrl, args, onUpdateLimit) {
    const stackErr = new Error();
    return new Promise((resolve, reject) => {
        const finalURL = format(inputUrl, args.path);
        const body = JSON.stringify(args.data) + '\r\n';
        const buffer = Buffer.from(body, 'utf8');
        const headers = Object.assign(Object.assign({}, parseRequestCookies(args).headers), { 'Connection': 'keep-alive', 'Content-Length': buffer.byteLength });
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
                if (![200, 201].includes(statusCode)) {
                    err = new customErrors_1.HTTPError(res.statusCode, res.statusMessage, rawData, finalURL);
                }
                else if (!/^application\/json/.test(contentType)) {
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
function parseRequestCookies(args) {
    var _a;
    const cookieString = Object.keys((_a = args.cookies) !== null && _a !== void 0 ? _a : {}).map((key) => `${key}=${args.cookies[key]}`).join('; ');
    if (cookieString) {
        args.headers['Cookie'] = cookieString;
    }
    return args;
}
function rest(url, args, onUpdateLimit, method) {
    return args.data !== undefined
        ? restPost(method || 'POST', url, args, onUpdateLimit)
        : restGet(url, args, onUpdateLimit);
}
function transformJwtToValidationResult(oAuthCredentials) {
    const tokenData = jwt.decode(oAuthCredentials.token);
    return {
        user_id: tokenData.user.id,
        key: null,
        name: tokenData.user.username,
        is_premium: tokenData.user.membership_roles.includes('premium'),
        is_supporter: tokenData.user.membership_roles.includes('supporter'),
        email: tokenData.user.email,
        profile_url: tokenData.user.avatar,
    };
}
class Nexus {
    constructor(appName, appVersion, defaultGame, timeout) {
        this.mBaseURL = param.API_URL;
        this.mUserServiceBaseURL = param.USER_SERVICE_API_URL;
        this.mGraphBaseURL = param.GRAPHQL_URL;
        this.mRateLimit = { daily: 1000, hourly: 100 };
        this.mLogCB = () => undefined;
        this.mJwtRefreshTries = 0;
        this.isValidValue = (value) => !Number.isNaN(value) && Number.isInteger(value) && value > 0;
        this.mBaseData = {
            headers: {
                'Content-Type': 'application/json',
                'Protocol-Version': param.PROTOCOL_VERSION,
                'Application-Name': appName,
                'Application-Version': appVersion,
                'User-Agent': `NexusApiClient/${param.PROTOCOL_VERSION} (${os.type()} ${os.release()}; ${process.arch})`
                    + ` Node/${process.versions.node}`,
            },
            cookies: {},
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
    setLogger(logCB) {
        this.mLogCB = logCB;
    }
    static createWithOAuth(credentials, config, appName, appVersion, defaultGame, timeout, onJWTRefresh) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = new Nexus(appName, appVersion, defaultGame, timeout);
            res.oAuthCredentials = credentials;
            res.mOAuthConfig = config;
            res.mJWTRefreshCallback = onJWTRefresh;
            res.oAuthCredentials = yield res.handleJwtRefresh();
            return res;
        });
    }
    setGame(gameId) {
        this.mBaseData.path.gameId = gameId;
    }
    revalidate() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const key = (_a = this.mBaseData.headers) === null || _a === void 0 ? void 0 : _a.APIKEY;
            this.mLogCB('info', 'revalidate', { isUndefined: key === undefined });
            if (key !== undefined) {
                this.mValidationResult = yield this.setKey(key);
            }
            return this.mValidationResult;
        });
    }
    getValidationResult() {
        return this.mValidationResult;
    }
    setOAuthCredentials(credentials, config, onJWTRefresh) {
        return __awaiter(this, void 0, void 0, function* () {
            this.oAuthCredentials = credentials;
            this.mOAuthConfig = config;
            this.mJWTRefreshCallback = onJWTRefresh;
            const decoded = jwt.decode(credentials.token);
            const userInfo = yield this.userById({ avatar: true }, decoded.user.id);
            return {
                key: '',
                email: '',
                is_premium: decoded.user.membership_roles.includes('premium'),
                is_supporter: decoded.user.membership_roles.includes('supporter'),
                name: decoded.user.username,
                profile_url: userInfo.avatar,
                user_id: decoded.user.id,
            };
        });
    }
    setKey(apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            this.mLogCB('info', 'assigning api key', { isUndefined: apiKey === undefined });
            if (apiKey === undefined) {
                delete this.mBaseData.headers.APIKEY;
            }
            else {
                this.mBaseData.headers.APIKEY = apiKey;
            }
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
    getUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return yield this.request(`${this.mUserServiceBaseURL}/oauth/userinfo`, this.args({}));
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
            if (!this.isValidValue(parseInt(modId, 10))) {
                return Promise.reject(new customErrors_1.ParameterInvalid('Invalid modId: must be a positive integer.'));
            }
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/user/tracked_mods', this.args({
                data: {
                    domain_name: gameId || this.mBaseData.path.gameId,
                    mod_id: parseInt(modId, 10),
                },
            }))
                .catch(err => (err.statusCode === 422)
                ? Promise.resolve({ message: err.message })
                : Promise.reject(err));
        });
    }
    untrackMod(modId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidValue(parseInt(modId, 10))) {
                return Promise.reject(new customErrors_1.ParameterInvalid('Invalid modId: must be a positive integer.'));
            }
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/user/tracked_mods', this.args({
                data: {
                    domain_name: gameId || this.mBaseData.path.gameId,
                    mod_id: parseInt(modId, 10),
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
                return Promise.reject(new Error('invalid endorse status, should be "endorse" or "abstain"'));
            }
            if (!this.isValidValue(modId)) {
                return Promise.reject(new customErrors_1.ParameterInvalid('Invalid modId: must be a positive integer.'));
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
            if (!this.isValidValue(modId)) {
                return Promise.reject(new customErrors_1.ParameterInvalid('Invalid modId: must be a positive integer.'));
            }
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}', this.args({
                path: this.filter({ modId, gameId }),
            }));
        });
    }
    getChangelogs(modId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidValue(modId)) {
                return Promise.reject(new customErrors_1.ParameterInvalid('Invalid modId: must be a positive integer.'));
            }
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}/changelogs', this.args({
                path: this.filter({ modId, gameId }),
            }));
        });
    }
    getModFiles(modId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidValue(modId)) {
                return Promise.reject(new customErrors_1.ParameterInvalid('Invalid modId: must be a positive integer.'));
            }
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}/files', this.args({
                path: this.filter({ modId, gameId }),
            }));
        });
    }
    getFileInfo(modId, fileId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidValue(modId) || !this.isValidValue(fileId)) {
                return Promise.reject(new customErrors_1.ParameterInvalid('Invalid mod/file id: must be a positive integer.'));
            }
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}/files/{fileId}', this.args({
                path: this.filter({ modId, fileId, gameId }),
            }));
        });
    }
    getDownloadURLs(modId, fileId, key, expires, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidValue(modId) || !this.isValidValue(fileId)) {
                return Promise.reject(new customErrors_1.ParameterInvalid('Invalid mod/file id: must be a positive integer.'));
            }
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
    userById(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.requestGraph('user', {
                id: { type: 'Int', optional: false },
            }, query, { id: userId }, this.args({ path: this.filter({}) }));
            return res;
        });
    }
    modsByUid(query, uids) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = [];
            for (const chunk of chunkify(uids, param.MAX_BATCH_SIZE)) {
                yield this.mQuota.wait();
                res.push(...(yield this.requestGraph('modsByUid', {
                    uids: { type: '[ID!]', optional: false },
                }, { nodes: chunk }, { uids }, this.args({ path: this.filter({}) }))).nodes);
            }
            return res;
        });
    }
    modFilesByUid(query, uids) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = [];
            for (const chunk of chunkify(uids, param.MAX_BATCH_SIZE)) {
                yield this.mQuota.wait();
                res.push(...(yield this.requestGraph('modFilesByUid', {
                    uids: { type: '[ID!]', optional: false },
                }, { nodes: query }, { uids }, this.args({ path: this.filter({}) }))).nodes);
            }
            return res;
        });
    }
    fileHashes(query, md5Hashes) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const results = {
                data: [], errors: undefined,
            };
            for (const chunk of chunkify(md5Hashes, param.MAX_BATCH_SIZE)) {
                yield this.mQuota.wait();
                const inner = yield this.requestGraphWithErrors('fileHashes', {
                    md5s: { type: '[String!]', optional: false },
                }, query, { md5s: chunk }, this.args({ path: this.filter({}) }));
                results.data.push(...inner.data);
                if (inner.errors !== undefined) {
                    if (results.errors === undefined) {
                        results.errors = [];
                    }
                    results.errors.push(...inner.errors);
                }
            }
            this.mLogCB('info', 'fileHashes', {
                time: Date.now() - startTime,
                count: results.data.length,
                hashes: (_a = results.data) === null || _a === void 0 ? void 0 : _a.map(x => x.md5).join(', '),
                errors: (_c = (_b = results.errors) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0,
            });
            return results;
        });
    }
    convertFilterValuesToStrings(filter) {
        const converted = {};
        if (filter.filter !== undefined) {
            converted.filter = filter.filter.map(f => this.convertFilterValuesToStrings(f));
        }
        if (filter.op !== undefined) {
            converted.op = filter.op;
        }
        const filterFields = [
            'fileId', 'modId', 'gameId', 'filePathWildcard',
            'filePathPartsExact', 'fileNameWildcard', 'fileExtensionExact', 'fileSize'
        ];
        for (const field of filterFields) {
            if (filter[field] !== undefined) {
                converted[field] = filter[field].map((filterValue) => ({
                    op: filterValue.op,
                    value: String(filterValue.value)
                }));
            }
        }
        return converted;
    }
    modFileContents(query, filter, offset, count) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const parameters = {};
            const variables = {};
            if (filter !== undefined) {
                parameters.filter = { type: 'ModFileContentSearchFilter', optional: true };
                variables.filter = this.convertFilterValuesToStrings(filter);
            }
            if (offset !== undefined) {
                parameters.offset = { type: 'Int', optional: true };
                variables.offset = offset;
            }
            if (count !== undefined) {
                parameters.count = { type: 'Int', optional: true };
                variables.count = count;
            }
            const res = yield this.requestGraph('modFileContents', parameters, query, variables, this.args({ path: this.filter({}) }));
            return res;
        });
    }
    sendMetric(eventType, entityType, entityId, metadata, clientString) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return yield this.mutateGraph('trackAppMetric', {
                eventType: { type: 'AppMetricEventType', optional: false },
                entityType: { type: 'AppMetricEntityType', optional: false },
                entityId: { type: 'String', optional: false },
                metadata: { type: 'JSON', optional: false },
                clientString: { type: 'String', optional: true },
            }, { eventType, entityType, entityId, metadata, clientString }, this.args({ path: this.filter({}) }), { success: true });
        });
    }
    getCollectionDownloadLink(downloadLink) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.request(param.BASE_URL + downloadLink, this.args({}));
            return (_a = res.download_links) !== null && _a !== void 0 ? _a : [res.download_link];
        });
    }
    createCollection(data, assetFileUUID, retQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return yield this.mutateGraph('createCollection', {
                collectionData: { type: 'CollectionPayload', optional: false },
                uuid: { type: 'String', optional: false },
            }, { collectionData: data, uuid: assetFileUUID }, this.args({ path: this.filter({}) }), retQuery !== null && retQuery !== void 0 ? retQuery : this.defaultCreateQuery());
        });
    }
    updateCollection(data, assetFileUUID, collectionId, retQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return yield this.mutateGraph('updateCollection', {
                collectionData: { type: 'CollectionPayload', optional: false },
                uuid: { type: 'String', optional: false },
                collectionId: { type: 'Int', optional: false },
            }, { collectionData: data, uuid: assetFileUUID, collectionId }, this.args({ path: this.filter({}) }), retQuery !== null && retQuery !== void 0 ? retQuery : this.defaultCreateQuery());
        });
    }
    createOrUpdateRevision(data, assetFileUUID, collectionId, retQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return yield this.mutateGraph('createOrUpdateRevision', {
                collectionData: { type: 'CollectionPayload', optional: false },
                uuid: { type: 'String', optional: false },
                collectionId: { type: 'Int', optional: false },
            }, { collectionData: data, uuid: assetFileUUID, collectionId }, this.args({ path: this.filter({}) }), retQuery !== null && retQuery !== void 0 ? retQuery : this.defaultCreateQuery());
        });
    }
    editCollection(collectionId, name, summary, description, category) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return (yield this.mutateGraph('editCollection', {
                collectionId: { type: 'Int', optional: false },
                name: { type: 'String', optional: true },
                summary: { type: 'String', optional: true },
                description: { type: 'String', optional: true },
                categoryId: { type: 'ID', optional: true },
            }, { collectionId, name, summary, description, category }, this.args({ path: this.filter({}) }), { success: true })).success;
        });
    }
    publishRevision(revisionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return (yield this.mutateGraph('publishRevision', {
                revisionId: { type: 'Int', optional: false },
            }, { revisionId }, this.args({ path: this.filter({}) }), { success: true })).success;
        });
    }
    attachCollectionsToCategory(categoryId, collectionIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return (yield this.mutateGraph('attachCollectionsToCategory', {
                id: { type: 'ID', optional: false },
                collectionIds: { type: '[Int!]', optional: false },
            }, { id: categoryId, collectionIds }, this.args({ path: this.filter({}) }), { success: true })).success;
        });
    }
    getCollectionGraph(query, slug, ignoreAdultBlock = true) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.requestGraph('collection', {
                slug: { type: 'String', optional: false },
                viewAdultContent: { type: 'Boolean', optional: true }
            }, query, { slug, viewAdultContent: ignoreAdultBlock }, this.args({ path: this.filter({}) }));
            return res;
        });
    }
    getCollectionListGraph(query, gameId, count, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.requestGraph('collections', {
                gameDomain: { type: 'String', optional: false },
                count: { type: 'Int', optional: true },
                offset: { type: 'Int', optional: true },
            }, { nodes: query }, { gameDomain: gameId || this.mBaseData.path.game, count, offset }, this.args({ path: this.filter({}) }));
            return res.nodes;
        });
    }
    searchCollectionsGraph(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const { gameId, count = 20, offset = 0, sort = { field: 'endorsements', direction: 'DESC' }, search, categoryName, collectionStatuses = ['listed', 'published', 'under_moderation', 'unlisted'], includeAdultContent = true, userId, } = options;
            const sortParam = {};
            sortParam[sort.field] = { direction: sort.direction };
            const filter = {
                collectionStatus: collectionStatuses.map(status => ({ op: 'EQUALS', value: status })),
                gameDomain: [{ op: 'EQUALS', value: gameId }],
                op: 'AND',
            };
            if (categoryName && categoryName.length > 0) {
                filter.categoryName = categoryName;
            }
            if (includeAdultContent === false) {
                filter.adultContent = [{ op: 'EQUALS', value: false }];
            }
            if (search && search.trim()) {
                filter.generalSearch = [{ op: 'WILDCARD', value: search.trim() }];
            }
            if (userId !== undefined) {
                filter.userId = [{ op: 'EQUALS', value: userId }];
            }
            const variables = {
                count,
                offset,
                filter,
                sort: sortParam,
            };
            const res = yield this.requestGraph('collectionsV2', {
                count: { type: 'Int', optional: true },
                filter: { type: 'CollectionsSearchFilter', optional: true },
                offset: { type: 'Int', optional: true },
                sort: { type: '[CollectionsSearchSort!]', optional: true },
            }, {
                totalCount: true,
                nodes: query,
            }, variables, this.args({ path: this.filter({}) }));
            return {
                nodes: res.nodes || [],
                totalCount: res.totalCount || 0,
            };
        });
    }
    getMyCollections(query, gameId, count, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.requestGraph('myCollections', {
                gameDomain: { type: 'String', optional: true },
                count: { type: 'Int', optional: true },
                offset: { type: 'Int', optional: true },
                viewAdultContent: { type: 'Boolean', optional: false },
                viewUnlisted: { type: 'Boolean', optional: false },
                viewUnderModeration: { type: 'Boolean', optional: false },
            }, { nodes: query }, {
                gameDomain: gameId,
                count, offset,
                viewAdultContent: true,
                viewUnlisted: true,
                viewUnderModeration: true,
            }, this.args({ path: this.filter({}) }));
            return res.nodes;
        });
    }
    getCollectionRevisionGraph(query, collectionSlug, revisionNumber, ignoreAdultBlock = true) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const parameters = {
                slug: { type: 'String', optional: false },
                viewAdultContent: { type: 'Boolean', optional: true },
            };
            const variables = { slug: collectionSlug, viewAdultContent: ignoreAdultBlock };
            if (!!revisionNumber) {
                parameters['revision'] = { type: 'Int', optional: false };
                variables['revision'] = revisionNumber;
            }
            const res = yield this.requestGraph('collectionRevision', parameters, query, variables, this.args({ path: this.filter({}) }));
            return res;
        });
    }
    getRevisionUploadUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            const res = yield this.requestGraph('collectionRevisionUploadUrl', {}, {
                url: true,
                uuid: true,
            }, {}, this.args({ path: this.filter({}) }));
            return res;
        });
    }
    endorseCollection(collectionId, endorseStatus, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (['endorse', 'abstain'].indexOf(endorseStatus) === -1) {
                return Promise.reject(new Error('invalid endorse status, should be "endorse" or "abstain"'));
            }
            yield this.mQuota.wait();
            return (yield this.mutateGraph('endorse', {
                abstain: { type: 'Boolean', optional: true },
                modelId: { type: 'Int', optional: false },
                modelType: { type: 'String', optional: false },
            }, { abstain: endorseStatus === 'abstain', modelId: collectionId, modelType: 'Collection' }, this.args({ path: this.filter({}) }), { success: true, endorsement: { status: true } }));
        });
    }
    rateRevision(revisionId, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return (yield this.mutateGraph('rate', {
                id: { type: 'ID', optional: false },
                type: { type: 'Ratable', optional: false },
                rating: { type: 'RatingOptions', optional: false },
            }, { id: revisionId, type: 'CollectionRevision', rating }, this.args({ path: this.filter({}) }), { success: true, averageRating: { average: true, positive: true, total: true } }));
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
                const form = new FormData();
                form.append("feedback_text", message);
                form.append("feedback_title", title.substr(0, 255));
                if (fileBundle !== undefined) {
                    form.append('feedback_file', fs.createReadStream(fileBundle));
                }
                if (groupingKey !== undefined) {
                    form.append('grouping_key', groupingKey);
                }
                if (id !== undefined) {
                    form.append('reference', id);
                }
                const headers = Object.assign(Object.assign({}, this.mBaseData.headers), form.getHeaders());
                if (anonymous) {
                    delete headers['APIKEY'];
                }
                else if (this.mOAuthCredentials !== undefined) {
                    headers['Authorization'] = `Bearer: ${this.mOAuthCredentials.token}`;
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
                            return reject(new customErrors_1.HTTPError(res.statusCode, res.statusMessage, rawData, inputUrl));
                        }
                        else {
                            return resolve(JSON.parse(rawData));
                        }
                    });
                });
                req.on('error', err => reject(err));
                form.pipe(req);
            }));
        });
    }
    defaultCreateQuery() {
        return {
            collection: { id: true, slug: true },
            revision: { id: true, revisionNumber: true },
            success: true,
        };
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
                    this.mJwtRefreshTries = 0;
                }, method);
            }
            catch (err) {
                if (err instanceof customErrors_1.RateLimitError) {
                    if (!this.mQuota.block()) {
                        yield this.mQuota.wait();
                        return yield this.request(url, args, method);
                    }
                }
                if (err.statusCode === 401 && this.mJwtRefreshTries < param.MAX_JWT_REFRESH_TRIES) {
                    this.mJwtRefreshTries++;
                    this.oAuthCredentials = yield this.handleJwtRefresh();
                    return yield this.request(url, this.args(args), method);
                }
                this.mJwtRefreshTries = 0;
                throw err;
            }
            finally {
                this.mQuota.finishInit();
            }
        });
    }
    makeQueryImpl(query, variables, indent) {
        return Object.keys(query).filter(key => key[0] !== '$').reduce((prev, key) => {
            if (query[key] !== false) {
                prev += (indent + key);
                if (typeof query[key] !== 'boolean') {
                    const filter = query[key]['$filter'];
                    if (filter !== undefined) {
                        const filterText = Object.keys(filter)
                            .map(key => `${key}: ${filter[key]}`)
                            .join(', ');
                        prev += `(${filterText})`;
                    }
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
        let parString = Object.keys(parameters)
            .map(key => `\$${key}: ${serParameter(parameters[key])}`)
            .join(', ');
        if (parString.length > 0) {
            parString = `(${parString})`;
        }
        return parString;
    }
    makeFilter(parameters) {
        let filtString = Object.keys(parameters)
            .map(key => `${key}: \$${key}`)
            .join(', ');
        if (filtString.length > 0) {
            filtString = `(${filtString})`;
        }
        return filtString;
    }
    makeQuery(name, parameters, query, variables) {
        const pars = this.makeParameters(parameters);
        const filters = this.makeFilter(parameters);
        return `query ${name}${pars} {\n`
            + `  ${name}${filters} {${this.makeQueryImpl(query, variables, '    ')}`
            + '  }\n'
            + '}';
    }
    makeMutation(name, parameters, retValues) {
        const pars = this.makeParameters(parameters);
        const filters = this.makeFilter(parameters);
        return `mutation ${name}${pars} {\n`
            + `  ${name}${filters} { ${this.makeQueryImpl(retValues, {}, '    ')} }`
            + '}';
    }
    genError(input) {
        const ex = new Error(input.map(err => err.message).join(', '));
        const callPath = input.find(iter => iter.path !== undefined);
        if (callPath !== undefined) {
            ex['call'] = callPath.path.join(', ');
        }
        const codeEx = input.find(iter => { var _a; return ((_a = iter.extensions) === null || _a === void 0 ? void 0 : _a.code) !== undefined; });
        if (codeEx !== undefined) {
            ex['code'] = codeEx.extensions.code;
        }
        return ex;
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
                throw this.genError(res.errors);
            }
        });
    }
    requestGraphWithErrors(root, parameters, query, variables, args) {
        return __awaiter(this, void 0, void 0, function* () {
            args.data = {
                query: this.makeQuery(root, parameters, query, variables),
                variables,
            };
            const res = yield this.request(this.mGraphBaseURL, args, 'POST');
            if (res.data) {
                return { data: res.data[root], errors: res.errors };
            }
            else {
                throw this.genError(res.errors);
            }
        });
    }
    convertErrDetail(det) {
        return {
            attribute: det.attribute,
            code: det.code,
            entity: det.entity,
            message: det.message,
            type: det.type,
            value: det.value,
        };
    }
    mutateGraph(name, parameters, data, args, retValues) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            args.data = {
                query: this.makeMutation(name, parameters, retValues),
                variables: data,
            };
            const res = yield this.request(this.mGraphBaseURL, args, 'POST');
            if (!!((_a = res.data) === null || _a === void 0 ? void 0 : _a[name])) {
                return res.data[name];
            }
            else {
                const ext = (_c = (_b = res.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.extensions;
                if ((ext === null || ext === void 0 ? void 0 : ext.code) === undefined) {
                    throw new Error(res.errors.map(err => err.message).join(', '));
                }
                else {
                    throw new customErrors_1.GraphError(res.errors[0].message, ext.code, ((_d = ext.detail) !== null && _d !== void 0 ? _d : []).map(this.convertErrDetail));
                }
            }
        });
    }
    set oAuthCredentials(credentials) {
        this.mOAuthCredentials = credentials;
        this.mValidationResult = transformJwtToValidationResult(this.mOAuthCredentials);
    }
    handleJwtRefresh() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                client_id: this.mOAuthConfig.id,
                refresh_token: this.mOAuthCredentials.refreshToken,
                grant_type: 'refresh_token',
            };
            if (this.mOAuthConfig.secret !== undefined) {
                data['client_secret'] = this.mOAuthConfig.secret;
            }
            const refreshResult = yield this.request(`${param.USER_SERVICE_API_URL}/oauth/token`, this.args({
                data
            }));
            const newOAuthCredentials = {
                token: refreshResult.access_token,
                refreshToken: refreshResult.refresh_token,
                fingerprint: refreshResult.jwt_fingerprint,
            };
            (_a = this.mJWTRefreshCallback) === null || _a === void 0 ? void 0 : _a.call(this, newOAuthCredentials);
            return newOAuthCredentials;
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
        if (this.mOAuthCredentials !== undefined) {
            result.headers['Authorization'] = `Bearer ${this.mOAuthCredentials.token}`;
        }
        for (const key of Object.keys(customArgs)) {
            result[key] = Object.assign(Object.assign({}, result[key]), customArgs[key]);
        }
        return result;
    }
}
exports.default = Nexus;
//# sourceMappingURL=Nexus.js.map