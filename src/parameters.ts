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

export const API_URL: string = 'https://api.nexusmods.com/v1';

export const USER_SERVICE_API_URL: string = 'https://users.nexusmods.com';

// used so the server can provide compatibility behaviour with older protocols.
// Please don't mess with this unless you're in contact with NexusMods
export const PROTOCOL_VERSION: string = require('../package.json').version.split('-')[0];

// Defines the preferred security protocol version to be used with the API server.
//  (The API will refuse any other protocols except for TLS 1.2 and TLS 1.3)
export const SECURITY_PROTOCOL_VERSION: string = 'TLSv1_2_method'; 

// server will reject feedback if attachments are > 20mb large
export const MAX_FILE_SIZE: number = 20 * 1024 * 1024;

export const MAX_JWT_REFRESH_TRIES: number = 3;
