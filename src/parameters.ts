export const DEFAULT_TIMEOUT_MS: number = 5000;

export const API_URL: string = 'https://api.nexusmods.com/v1';

// used so the server can provide compatibility behaviour with older protocols.
// Please don't mess with this unless you're in contact with NexusMods
export const PROTOCOL_VERSION: string = require('../package.json').version;

// Defines the preferred security protocol version to be used with the API server.
//  (The API will refuse any other protocols except for TLS 1.2 and TLS 1.3)
export const SECURITY_PROTOCOL_VERSION: string = 'TLSv1_2_method'; 

// server will reject feedback if attachments are > 20mb large
export const MAX_FILE_SIZE: number = 20 * 1024 * 1024;
