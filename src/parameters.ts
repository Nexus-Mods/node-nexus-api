// note: quota settings are coordinated with the server, manipulating
//   them can cause network errors or IP bans

// quota recovers one request per second
export const QUOTA_RATE_MS: number = 1000;
// limit short-term bursts
export const QUOTA_MAX: number = 50;
// limit short-term bursts
export const QUOTA_MAX_PREMIUM: number = 50;

export const DEFAULT_TIMEOUT_MS: number = 30000;

// time to wait before retrying a request that failed with a 429 (too many requests) error
// applies only when the request limit for the hour hasn't been exceeded yet
export const DELAY_AFTER_429_MS: number = 1000;

const API_SUBDOMAIN = process.env['API_SUBDOMAIN'] || 'api';
const NEXUS_DOMAIN = process.env['NEXUS_DOMAIN'] || 'nexusmods.com';
export const BASE_URL: string = `https://${API_SUBDOMAIN}.${NEXUS_DOMAIN}`;
export const API_URL: string = `${BASE_URL}/v1`;
export const GRAPHQL_URL: string = `${BASE_URL}/v2/graphql`;

// can be used to redirect requests for in-development requests to a different server and separate
// api key
export const API_DEV_URL: string = '';
export const APIKEY_DEV: string = '';

// used so the server can provide compatibility behaviour with older protocols.
// Please don't mess with this unless you're in contact with NexusMods
export const PROTOCOL_VERSION: string = require('../package.json').version.split('-')[0];

// server will reject feedback if attachments are > 20mb large
export const MAX_FILE_SIZE: number = 20 * 1024 * 1024;
