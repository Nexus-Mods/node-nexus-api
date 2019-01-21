"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
function handleRestResult(resolve, reject, url, error, response, body) {
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
        reject(new Error(`failed to parse server response for request "${url}": ${err.message}`));
    }
}
function restGet(url, args) {
    const stackErr = new Error();
    return new Promise((resolve, reject) => {
        request.get(format(url, args.path || {}), {
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
            handleRestResult(resolve, reject, url, error, response, body);
        });
    });
}
function restPost(url, args) {
    const stackErr = new Error();
    return new Promise((resolve, reject) => {
        request.post({
            url: format(url, args.path),
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
            handleRestResult(resolve, reject, url, error, response, body);
        });
    });
}
function rest(url, args) {
    return args.data !== undefined
        ? restPost(url, args)
        : restGet(url, args);
}
class Nexus {
    constructor(appVersion, defaultGame, timeout) {
        this.mBaseURL = param.API_URL;
        this.mBaseData = {
            headers: {
                'Content-Type': 'application/json',
                APIKEY: undefined,
                'Protocol-Version': param.PROTOCOL_VERSION,
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
        this.mQuota = new Quota_1.default();
    }
    static create(apiKey, appVersion, defaultGame, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = new Nexus(appVersion, defaultGame, timeout);
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
    validateKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/users/validate', this.args({ headers: this.filter({ APIKEY: key }) }));
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
    getGames() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games', this.args({}));
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
    getModInfo(modId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mQuota.wait();
            return this.request(this.mBaseURL + '/games/{gameId}/mods/{modId}', this.args({
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
                    console.log('anon headers', headers);
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
    request(url, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield rest(url, args);
            }
            catch (err) {
                if (err instanceof customErrors_1.RateLimitError) {
                    this.mQuota.block();
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
            result[key] = Object.assign({}, result[key], customArgs[key]);
        }
        return result;
    }
}
exports.default = Nexus;
//# sourceMappingURL=Nexus.js.map