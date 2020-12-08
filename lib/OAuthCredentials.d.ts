export default class OAuthCredentials {
    token: string;
    refreshToken: string;
    fingerprint: string;
    constructor(token: string, refreshToken: string, fingerprint: string);
}
