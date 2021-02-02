"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_FILE_SIZE = exports.PROTOCOL_VERSION = exports.APIKEY_DEV = exports.API_DEV_URL = exports.GRAPHQL_URL = exports.API_URL = exports.BASE_URL = exports.DELAY_AFTER_429_MS = exports.DEFAULT_TIMEOUT_MS = exports.QUOTA_MAX_PREMIUM = exports.QUOTA_MAX = exports.QUOTA_RATE_MS = void 0;
exports.QUOTA_RATE_MS = 1000;
exports.QUOTA_MAX = 50;
exports.QUOTA_MAX_PREMIUM = 50;
exports.DEFAULT_TIMEOUT_MS = 30000;
exports.DELAY_AFTER_429_MS = 1000;
const API_SUBDOMAIN = process.env['API_SUBDOMAIN'] || 'api';
const NEXUS_DOMAIN = process.env['NEXUS_DOMAIN'] || 'nexusmods.com';
exports.BASE_URL = `https://${API_SUBDOMAIN}.${NEXUS_DOMAIN}`;
exports.API_URL = `${exports.BASE_URL}/v1`;
exports.GRAPHQL_URL = `${exports.BASE_URL}/v2/graphql`;
exports.API_DEV_URL = '';
exports.APIKEY_DEV = '';
exports.PROTOCOL_VERSION = require('../package.json').version.split('-')[0];
exports.MAX_FILE_SIZE = 20 * 1024 * 1024;
//# sourceMappingURL=parameters.js.map