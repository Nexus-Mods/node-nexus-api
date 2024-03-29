"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUOTA_RATE_MS = 1000;
exports.QUOTA_MAX = 50;
exports.QUOTA_MAX_PREMIUM = 50;
exports.DEFAULT_TIMEOUT_MS = 30000;
exports.DELAY_AFTER_429_MS = 1000;
const NEXUS_DOMAIN = process.env['NEXUS_DOMAIN'] || 'nexusmods.com';
const API_SUBDOMAIN = process.env['API_SUBDOMAIN'] || 'api';
const USERS_SUBDOMAIN = process.env['USERS_SUBDOMAIN'] || 'users';
exports.BASE_URL = `https://${API_SUBDOMAIN}.${NEXUS_DOMAIN}`;
exports.API_URL = `${exports.BASE_URL}/v1`;
exports.GRAPHQL_URL = `${exports.BASE_URL}/v2/graphql`;
exports.API_DEV_URL = '';
exports.APIKEY_DEV = '';
exports.USER_SERVICE_API_URL = `https://${USERS_SUBDOMAIN}.${NEXUS_DOMAIN}`;
exports.PROTOCOL_VERSION = require('../package.json').version.split('-')[0];
exports.MAX_FILE_SIZE = 40 * 1024 * 1024;
exports.MAX_JWT_REFRESH_TRIES = 3;
exports.MAX_BATCH_SIZE = 500;
//# sourceMappingURL=parameters.js.map