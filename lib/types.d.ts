export interface IValidateKeyResponse {
    user_id: number;
    key: string;
    name: string;
    is_premium: boolean;
    is_supporter: boolean;
    email: string;
    profile_url: string;
}
export declare type EndorsedStatus = 'Undecided' | 'Abstained' | 'Endorsed';
export interface IModInfo {
    category_id: number;
    contains_adult_content: number;
    type: number;
    name: string;
    summary: string;
    description: string;
    version: string;
    author: string;
    uploaded_by: string;
    uploaded_users_profile_url: string;
    picture_url: string;
    created_timestamp: number;
    created_time: string;
    updated_timestamp: number;
    updated_time: string;
    primary_file?: IFileInfo;
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
    name: string;
    version: string;
    size: number;
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
