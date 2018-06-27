export interface IValidateKeyResponse {
  user_id: number;
  key: string;
  name: string;
  is_premium: boolean;
  is_supporter: boolean;
  email: string;
  profile_url: string;
}

export type EndorsedStatus = 'Undecided' | 'Abstained' | 'Endorsed';

export interface IModInfo {
  id: number;
  category_id: number;
  adult: number;
  type: number;
  name: string;
  summary: string;
  description: string;
  version: string;
  author: string;
  picture_url: string;
  endorsement: {
    endorse_status: EndorsedStatus,
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

export interface IGameInfo extends IGameListEntry {
  categories: ICategory[];
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

export interface IDownloadURL {
  URI: string;
  name: string;
  short_name: string;
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
