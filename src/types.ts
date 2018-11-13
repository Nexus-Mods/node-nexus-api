/**
 * result of the validateKey request
 */
export interface IValidateKeyResponse {
  /**
   * nexus user id
   */
  user_id: number;
  key: string;
  /**
   * User Name
   */
  name: string;
  /**
   * user is premium
   */
  is_premium: boolean;
  /**
   * user is supporter
   */
  is_supporter: boolean;
  /**
   * email address of the user
   */
  email: string;
  /**
   * url of the user image
   */
  profile_url: string;
}

export type EndorsedStatus = 'Undecided' | 'Abstained' | 'Endorsed';

/**
 * Details about a mod
 */
export interface IModInfo {
  /**
   * the mod id
   */
  id: number;
  /**
   * id of the category
   */
  category_id: number;
  /**
   * whether this mod is tagged as adult (1 = true, 0 = false)
   */
  adult: number;
  /**
   * mod type
   */
  type: number;
  /**
   * Name of the mod
   */
  name: string;
  /**
   * short description
   */
  summary: string;
  /**
   * long description
   */
  description: string;
  /**
   * mod version
   */
  version: string;
  /**
   * Author of the mod
   */
  author: string;
  /**
   * url of the primary screenshot
   */
  picture_url: string;
  /**
   * obsolete - will be removed in the near future
   */
  endorsement: {
    endorse_status: EndorsedStatus,
  };
}

/**
 * Information about a specific mod file
 */
export interface IFileInfo {
  /**
   * file id
   */
  file_id: number;
  /**
   * File type as a number (1 = main, 2 = patch, 3 = optional, 4 = old, 6 = deleted)
   */
  category_id: number;
  /**
   * File type as a string ('MAIN', 'PATCH', 'OPTION', 'OLD_VERSION', 'DELETED')
   */
  category_name: string;
  /**
   * html encoded changelog (matched via file version)
   */
  changelog_html: string;
  /**
   * readable file name
   */
  name: string;
  /**
   * File version (doesn't actually have to match any mod version)
   */
  version: string;
  /**
   * File size in bytes
   */
  size: number;
  /**
   * actual file name (derived from name with id and version appended)
   */
  file_name: string;
  /**
   * unix timestamp of the time this file was uploaded
   */
  uploaded_timestamp: number;
  /**
   * readable representation of the file time
   */
  uploaded_time: string;
  /**
   * version of the mod (at the time this was uploaded?)
   */
  mod_version: string;
  /**
   * link to the virus scan results
   */
  external_virus_scan_url: string;
  /**
   * whether this is the primary download for the mod
   * (the one that users download through the link in the top right of the mod page)
   */
  is_primary: boolean;
}

/**
 * list of files (and update chain) associated with a mod
 */
export interface IModFiles {
  /**
   * list of file updates stored with a mod
   */
  file_updates: IFileUpdate[];
  /**
   * list of files stored for a mod
   */
  files: IFileInfo[];
}

/**
 * details about a file update
 * These exist only if the author sets the field "this file is
 * a newer version of ...".
 */
export interface IFileUpdate {
  /**
   * id of the new file
   */
  new_file_id: number;
  /**
   * name of the new file
   */
  new_file_name: string;
  /**
   * id of the old file
   */
  old_file_id: number;
  /**
   * name of the old file
   */
  old_file_name: string;
  /**
   * readable upload time of the new file
   */
  uploaded_time: string;
  /**
   * unix timestamp of when the new file was uploaded
   */
  uploaded_timestamp: number;
}

/**
 * Nexus Mods category
 */
export interface ICategory {
  /**
   * numerical id
   */
  category_id: number;
  /**
   * display name
   */
  name: string;
  /**
   * id of the parent category or false if it's a top-level
   * category.
   * Note: often there is only a single root category named after the game.
   * But in some cases there are additional roots, e.g. the game 'skyrim' has
   * the roots 'Skyrim' and 'Sure AI: Enderal'
   */
  parent_category: number | false;
}

/**
 * basic information about a game
 */
export interface IGameListEntry {
  /**
   * numerical id
   */
  id: number;
  /**
   * domain name (as used in urls and as the game id in all other requests)
   */
  domain_name: string;
  /**
   * display name
   */
  name: string;
  /**
   * url for the corresponding forum section
   */
  forum_url: string;
  /**
   * url for the primary nexusmods page (should be https://www.nexusmods.com/<domain_name>)
   */
  nexusmods_url: string;
  /**
   * genre of the game
   * (possible values?)
   */
  genre: string;
  /**
   * number of mods hosted on nexus for this game
   */
  mods: number;
  /**
   * number of files hosted on nexus for this game
   */
  file_count: number;
  /**
   * number of downloads from nexus for files for this game
   */
  downloads: number;
  /**
   * unix timestamp of when this game was added to nexuis mods
   */
  approved_date: number;
}

/**
 * extended information about a game
 */
export interface IGameInfo extends IGameListEntry {
  /**
   * list of categories for this game
   */
  categories: ICategory[];
}

/**
 * direct download url for a file from nexus
 * Please note that these links have an expiry time, it's not
 * useful to store it for more than a few minutes
 */
export interface IDownloadURL {
  /**
   * the url itself
   */
  URI: string;
  /**
   * Display name of the download server hosting the file
   */
  name: string;
  /**
   * short name (id?) of the download server
   */
  short_name: string;
}

/**
 * Info about a Feedback report
 * INTERNAL USE ONLY
 */
export interface IIssue {
  id: number;
  issue_number: number;
  issue_state: string;
  issue_title: string;
}

/**
 * Info about a feedback report exported to github
 * INTERNAL USE ONLY
 */
export interface IGithubIssue {
  id: number;
  issue_number: number;
  issue_title: string;
  issue_state: string;
  grouping_key: string;
  created_at: string;
  updated_at: string;
}

/**
 * response to a feedback request
 * INTERNAL USE ONLY
 */
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
