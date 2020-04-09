/**
 * result of the validateKey request
 */
export interface IValidateKeyResponse {
  /**
   * nexus user id
   */
  user_id: number;
  /**
   * the api key
   */
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

export interface IUser {
  member_id: number;
  member_group_id: number;
  name: string;
  avatar?: { url: string };
}

export type EndorsedStatus = 'Undecided' | 'Abstained' | 'Endorsed';

/**
 * possible states the mod can be in
 */
export type ModStatus = 'under_moderation' | 'published' | 'not_published' | 'publish_with_game' | 'removed' | 'wastebinned' | 'hidden';

/**
 * Details about a mod
 */
export interface IModInfo {
  /**
   * id of this mod (should be the same you queried for)
   */
  mod_id: number;
  /**
   * internal id of the game this mod belongs to
   */
  game_id: number;
  /**
   * domain name (as used in urls and as the game id in all other requests)
   */
  domain_name: string;
  /**
   * id of the category
   */
  category_id: number;
  /**
   * whether this mod is tagged as adult
   */
  contains_adult_content: boolean;
  /**
   * Name of the mod
   * (not present if the file is under moderation)
   */
  name?: string;
  /**
   * short description
   */
  summary?: string;
  /**
   * long description
   */
  description?: string;
  /**
   * mod version
   */
  version: string;
  /**
   * Author of the mod
   */
  author: string;
  /**
   * more detailed info about the author
   */
  user: IUser;
  /**
   * name of the user who uploaded this mod
   */
  uploaded_by: string;
  /**
   * url of the profile image of the uploader
   */
  uploaded_users_profile_url: string;
  /**
   * current status of the mod
   */
  status: ModStatus;
  /**
   * whether the mod is currently available/visible to users
   * If a mod isn't available the api returns very limited information, essentially
   * hiding all textual info that could contain offensive content but certain "maintenance" info
   * is still provided.
   */
  available: boolean;
  /**
   * url of the primary screenshot
   */
  picture_url?: string;
  /**
   * unix timestamp of when the mod was created
   */
  created_timestamp: number;
  /**
   * readable time of when the mod was created
   */
  created_time: string;
  /**
   * unix timestamp of when the mod was updated
   */
  updated_timestamp: number;
  /**
   * readable time of when the mod was updated
   */
  updated_time: string;
  /**
   * obsolete - will be removed in the near future
   */
  endorsement?: {
    endorse_status: EndorsedStatus,
    timestamp: number,
    version: number,
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
   * null if there is none
   */
  changelog_html: string;
  /**
   * readable file name
   */
  name: string;
  /**
   * file description
   */
  description: string;
  /**
   * File version (doesn't actually have to match any mod version)
   */
  version: string;
  /**
   * File size in kilobytes
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
   * null if there is none
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

export interface IModInfoEx extends IModInfo {
  mod_id: number;
  game_id: number;
}

/**
 * Result from a md5 lookup
 */
export interface IMD5Result {
  mod: IModInfoEx,
  file_details: IFileInfo,
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

export interface ICollectionInfo {
  collection_id?: number;
  author: string;
  author_url: string;
  name: string;
  version: string;
  description: string;
  domain_name: string;
  adult_content: boolean;
}

export type UpdatePolicy = 'exact' | 'latest';
export type SourceType = 'browse' | 'manual' | 'direct' | 'nexus';

export interface ICollectionSource {
  type: SourceType;
  md5?: string;
  url?: string;
  instructions?: string;
  mod_id?: string;
  file_id?: string;
  // determines which file to get if there is an update compared to what's in the mod pack
  update_policy?: UpdatePolicy;
  file_size?: number;
  logical_filename?: string;
  file_expression?: string;
}

export interface ICollectionMod {
  name: string;
  version: string;
  optional: boolean;
  domain_name: string;
  source: ICollectionSource;
  author?: string;
}

export interface ICollectionManifest {
  info: ICollectionInfo;
  mods: ICollectionMod[];
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

/**
 * response to a request for changelogs
 */
export interface IChangelogs {
  [versionNumber: string]: string[],
}

/**
 * response to a request for tracked mods
 */
export interface ITrackedMod {
  mod_id: number;
  domain_name: string;
}

/**
 * response to a request for endorsements
 */
export interface IEndorsement {
  mod_id: number;
  domain_name: string;
  date: number;
  version: string;
  status: EndorsedStatus;
}

/**
 * (success) response to a endorse/abstain request
 */
export interface IEndorseResponse {
  /**
   * textual reply to the request, something like "Updated to: Endorsed"
   */
  message: string;
  status: EndorsedStatus;
}

/**
 * (success) response to a track/untrack request
 */
export interface ITrackResponse {
  /**
   * textual result of the action, something like "User 123 is now Tracking Mod: 456"
   */
  message: string;
}

/**
 * colourscheme entry as returned by getColourSchemes
 */
export interface IColourScheme {
  id: number;
  name: string;
  primary_colour: string;
  secondary_colour: string;
  darker_colour: string;
}

/**
 * range of updates to query
 */
export type UpdatePeriod = '1d' | '1w' | '1m';

/**
 * an entry in the update list
 */
export interface IUpdateEntry {
  mod_id: number;
  latest_file_update: number;
  latest_mod_activity: number;
}

/**
 * category collection
 * These are different from mod collections because it's a new system.
 * There are more fields than this but those should be irrelevant to a client.
 */
export interface ICollectionCategory {
  id: number;
  name: string;
  game_id: number;
  description: string;
}

/**
 * Base information about a collection
 */
export interface ICollection {
  collection_id: number;
  // whether donations for this collections are accepted
  name: string;
  summary: string;
  description: string;
  created_at: string;
  updated_at: string;
  // author/curator of this collection
  user: { member_id: number, member_group_id: number, name: string };
}

export interface ICollectionDetailed extends ICollection {
  enable_donations: boolean;
  endorsement_count: number;
  category: ICollectionCategory;
  game: { id: number, name: string, domain_name: string };
  collection_images: IImageInfo[];
  collection_videos: IVideoInfo[];
}

export interface IRevisionModInfo {
  name: string;
  summary: string;
  picture_url: string;
  author: string;
  uploader: IUser;
  mod_id: number;
  game_id: number;
  endorsement_count: number;
  available: boolean;
}

/**
 * a single file as referenced by a collection
 */
export interface IRevisionModFile {
  file_id: number;
  game_id: number;
  name: string;
  version: string;
  category_id: number;
  category_name: string;
  size: number;
  file_name: string;
}

export interface IRevisionMod {
  game_id: number;
  mod: IRevisionModInfo;
  mod_file: IRevisionModFile;
  collection_id: number;
  collection_revision_id: number;
}

export interface ICollectionDownloadLink {
  download_link: string;
}

export interface IExternalResource {
  collection_revision_id: number;
  collection_id: number;
  game_id: number;
  resource_url: string;
  update_policy: UpdatePolicy;
  version: string;
}

export type RevisionStatus = 'is_private' | 'is_public' | 'is_hidden' | 'is_testing' | 'is_nuked';

/**
 * a specific revision of a collection
 */
export interface IRevision {
  revision_id: number;
  revision: number;
  adult_content: boolean;
  revision_status_id: RevisionStatus;
  collection: ICollection;
  uri: string;
  success_rate: { positive: number, negative: number };
  tags: Array<{ name: string }>;
  collection_schema: { id: number, version: string };
  external_resources: IExternalResource[];
}

export interface IRevisionDetailed extends IRevision {
  collection_revision_mods: IRevisionMod[];
}

export interface IImageInfo {
}

export interface IVideoInfo {
  game_id: number;
  user_id: number;
  url: string;
  title: string;
  descriaption: string;
  verified: boolean;
  position: boolean;
  revision_number: number;
}
