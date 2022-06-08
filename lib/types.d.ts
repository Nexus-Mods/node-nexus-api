export interface IValidateKeyResponse {
    user_id: number;
    key: string;
    name: string;
    is_premium: boolean;
    is_supporter: boolean;
    email: string;
    profile_url: string;
}
export interface IUser {
    member_id: number;
    member_group_id: number;
    name: string;
}
export declare type EndorsedStatus = 'Undecided' | 'Abstained' | 'Endorsed';
export declare type ModStatus = 'under_moderation' | 'published' | 'not_published' | 'publish_with_game' | 'removed' | 'wastebinned' | 'hidden';
export interface IModInfo {
    mod_id: number;
    game_id: number;
    domain_name: string;
    category_id: number;
    contains_adult_content: boolean;
    name?: string;
    summary?: string;
    description?: string;
    version: string;
    author: string;
    user: IUser;
    uploaded_by: string;
    uploaded_users_profile_url: string;
    status: ModStatus;
    available: boolean;
    picture_url?: string;
    created_timestamp: number;
    created_time: string;
    updated_timestamp: number;
    updated_time: string;
    allow_rating: boolean;
    endorsement_count: number;
    mod_downloads: number;
    mod_unique_downloads: number;
    endorsement?: {
        endorse_status: EndorsedStatus;
        timestamp: number;
        version: number;
    };
}
export interface IFileInfo {
    file_id: number;
    category_id: number;
    category_name: string;
    changelog_html: string;
    content_preview_link: string;
    name: string;
    description: string;
    version: string;
    size: number;
    size_kb: number;
    file_name: string;
    uploaded_timestamp: number;
    uploaded_time: string;
    mod_version: string;
    external_virus_scan_url: string;
    is_primary: boolean;
}
export interface IModFiles {
    file_updates: IFileUpdate[];
    files: IFileInfo[];
}
export interface IFileUpdate {
    new_file_id: number;
    new_file_name: string;
    old_file_id: number;
    old_file_name: string;
    uploaded_time: string;
    uploaded_timestamp: number;
}
export interface ICategory {
    category_id: number;
    name: string;
    parent_category: number | false;
}
export interface IGameListEntry {
    id: number;
    domain_name: string;
    name: string;
    forum_url: string;
    nexusmods_url: string;
    genre: string;
    mods: number;
    file_count: number;
    downloads: number;
    approved_date: number;
}
export interface IGameInfo extends IGameListEntry {
    categories: ICategory[];
}
export interface IDownloadURL {
    URI: string;
    name: string;
    short_name: string;
}
export interface IModInfoEx extends IModInfo {
    mod_id: number;
    game_id: number;
}
export interface IMD5Result {
    mod: IModInfoEx;
    file_details: IFileInfo;
}
export interface IIssue {
    id: number;
    issue_number: number;
    issue_state: string;
    issue_title: string;
}
export interface IGithubIssue {
    id: number;
    issue_number: number;
    issue_title: string;
    issue_state: string;
    grouping_key: string;
    created_at: string;
    updated_at: string;
}
export interface IFeedbackResponse {
    id: number;
    status: number;
    created_at: string;
    updated_at: string;
    reference: string;
    grouping_key: string;
    github_issue: IGithubIssue;
    user_blacklisted: boolean;
    count: number;
}
export interface IChangelogs {
    [versionNumber: string]: string[];
}
export interface ITrackedMod {
    mod_id: number;
    domain_name: string;
}
export interface IEndorsement {
    mod_id: number;
    domain_name: string;
    date: number;
    version: string;
    status: EndorsedStatus;
}
export interface IEndorseResponse {
    message: string;
    status: EndorsedStatus;
}
export interface ITrackResponse {
    message: string;
}
export interface IColourScheme {
    id: number;
    name: string;
    primary_colour: string;
    secondary_colour: string;
    darker_colour: string;
}
export declare type UpdatePeriod = '1d' | '1w' | '1m';
export interface IUpdateEntry {
    mod_id: number;
    latest_file_update: number;
    latest_mod_activity: number;
}
export interface IOAuthCredentials {
    token: string;
    refreshToken: string;
    fingerprint: string;
}
export interface IOAuthConfig {
    id: string;
    secret: string;
}
export interface INexusEvents {
    'oauth-credentials-updated': (credentials: IOAuthCredentials) => void;
}
