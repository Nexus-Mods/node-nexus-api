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
  avatar?: string;
}

export interface IUserInfo {
  sub: string;
  name: string;
  email: string;
  avatar: string;
  group_id: number;
  membership_roles: string[];
  premium_expiry: number;
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
   * long description (bbcode)
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
   * whether this mod allows endorsements
   */
  allow_rating: boolean;
  /**
   * endorsement count
   */
  endorsement_count: number;
  /**
   * number of total downloads
   */
  mod_downloads: number;
  /**
   * number of unique downloads
   */
  mod_unique_downloads: number;
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
   * File type as a number (1 = main, 2 = patch, 3 = optional, 4 = old, 6 = deleted, 7 = archived)
   */
  category_id: number;
  /**
   * File type as a string ('MAIN', 'PATCH', 'OPTION', 'OLD_VERSION', 'DELETED', 'ARCHIVED')
   */
  category_name: string;
  /**
   * html encoded changelog (matched via file version)
   * null if there is none
   */
  changelog_html: string;
  /**
   * url of the content preview (json file containing list of files)
   */
  content_preview_link: string;
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
   * File size. also in kilobytes. Because - ugh, don't ask
   */
  size_kb: number;
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
export interface IModCategory {
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
   * lower-cased display name
   */
  name_lower: string;
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
   * unix timestamp of when this game was added to nexus mods
   */
  approved_date: number;
  /**
   * number of collections for this game
   */
  collections: number;
}

/**
 * extended information about a game
 */
export interface IGameInfo extends IGameListEntry {
  /**
   * list of categories for this game
   */
  categories: IModCategory[];
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

export type UpdatePolicy = 'exact' | 'latest' | 'prefer';
export type SourceType = 'browse' | 'manual' | 'direct' | 'nexus';

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


// GraphQL classes

// just a string in format YYYY-MM-DDTHH:MM:SSZ, see RFC3339
export type IDateTime = string;

export interface ITimestamped {
  updatedAt: IDateTime;
  createdAt: IDateTime;
}

export interface IGraphUser {
  avatar: string;
  memberId: number;
  name: string;
}

export interface ICollectionMetadata {
  endorsementValue: number;
  downloadedAt?: IDateTime;
}

export interface ICollectionBadge {
  name: string;
  description: string;
}

export interface ICollectionPermission {
  global: boolean;
  key: string;
}

export interface IGame {
  id: number;
  domainName: string;
  name: string;
}

export interface ICategory {
  approved: boolean;
  approvedBy?: number;
  categoryGames: IGame[];
  createdAt: IDateTime;
  description: string;
  discardedAt?: IDateTime;
  id: number;
  name: string;
  parentId: number;
  suggestedBy: number;
  updatedAt: IDateTime;
}

export interface ITagCategory extends ITimestamped {
  discardedAt?: IDateTime;
  id: string;
  name: string;
  tags: ITag[];
}

export interface ITag extends ITimestamped {
  adult: boolean;
  category?: ITagCategory;
  discardedAt: IDateTime;
  global: boolean;
  id: string;
  name: string;
}

/*
export interface IImageType {
  description: string;
  id: number;
  rHorizontal: number;
  rVertical: number;
}
*/

export interface ICollectionImage extends ITimestamped {
  altText: string;
  collection: ICollection;
  discardedAt?: IDateTime;
  id: string;
  position: number;
  revision?: IRevision;
  thumbnailUrl?: string;
  url: string;
  user: IGraphUser;
}

export interface ICollectionVideo extends ITimestamped {
  collection: ICollection;
  description: string;
  discardedAt?: IDateTime;
  id: string;
  position: number;
  revision?: IRevision;
  title: string;
  url: string;
  user: IGraphUser;
}

export type ICollectionMedia = ICollectionImage & ICollectionVideo;

export interface IForumPost {
  authorId: number;
  authorName: string;
  id: number;
  post: string;
  postDate: IDateTime;
  user: IGraphUser;
}

export interface IForumTopic {
  approved: boolean;
  description: string;
  forumId: number;
  id: number;
  pinned: boolean;
  posts: IForumPost[];
  postsCount: number;
  state: string;
  title: string;
  views: number;
  visible: string;
}

/**
 * Base information about a collection
 */
export interface ICollection extends ITimestamped {
  category?: ICategory;
  collectionStatus?: string;
  contentPreviewLink: string;
  currentRevision: IRevision;
  discardedAt?: IDateTime;
  downloadLink: string;
  draftRevisionNumber?: number;
  enableDonations: boolean;
  endorsements: number;
  forumTopic?: IForumTopic;
  game: IGame;
  gameId: number;
  headerImage?: ICollectionImage;
  id: number;
  latestPublishedRevision?: IRevision;
  slug: string;
  media: ICollectionMedia[];
  metadata?: ICollectionMetadata;
  name: string;
  revisions: IRevision[];
  tags: ITag[];
  tileImage?: ICollectionImage;
  totalDownloads?: number;
  user: IGraphUser;
  userId: number;
  viewerIsBlocked: boolean;
  visible: boolean;
  description: string;
  summary: string;
  commentLink: string;
  overallRating: string;
  overallRatingCount: number;
  recentRating: string;
  recentRatingCount: number;
  badges?: ICollectionBadge[];
  permissions?: ICollectionPermission[];
}

export interface IExternalResource {
  collectionRevisionId: number;
  fileExpression: string;
  id: number;
  instructions: string;
  name: string;
  optional: boolean;
  resourceType: string;
  resourceUrl: string;
  version: string;
}
export type RevisionStatus = 'is_private' | 'is_public' | 'is_hidden' | 'is_testing' | 'is_nuked';

export interface ICollectionSchema extends ITimestamped {
  id: number;
  version: string;
}

export interface ICollectionBugReport extends ITimestamped {
  collectionBugStatusId: number;
  collectionRevisionId: number;
  description: string;
  id: number;
  title: string;
  user: IGraphUser;
  userId: number;
}

export interface IModCategory {
  date?: number;
  gameId: number;
  id: string;
  name: string;
  tags?: string;
}

export interface ITrackingState {
  test?: number;
}

export interface IMod {
  author?: string;
  category: string;
  description: string;
  game: IGame;
  gameId: number;
  id: number;
  ipAddress: string;
  modCategory: IModCategory;
  modId: number;
  name: string;
  pictureUrl?: string;
  status: string;
  summary: string;
  trackingData: ITrackingState;
  uid: string;
  uploader: IGraphUser;
  version: string;
}

export interface IModFile {
  categoryId: number;
  count: number;
  date: number;
  description: string;
  fileId: number;
  game: IGame;
  manager: number;
  mod: IMod;
  modId: number;
  name: string;
  owner: IGraphUser;
  primary: number;
  reportLink: string;
  requirementsAlert: number;
  scanned: number;
  size: number;
  sizeInBytes?: string;
  uCount: number;
  uid: string;
  uri: string;
  version: string;
}

export interface ICollectionRevisionMod {
  collectionRevisionId: number;
  file?: IModFile;
  fileId: number;
  gameId: number;
  id: number;
  optional: boolean;
  updatePolicy: string;
  version: string;
}

export interface IPreSignedUrl {
  url: string;
  uuid: string;
}
export interface IRating {

  average: number;
  positive: number;
  total: number;
}

export interface IRevisionMetadata {
  ratingValue: RatingOptions;
}

export interface IGameVersion {
  id: number;
  reference: string;
}

export interface ICollectionChangelog {
  collectionRevisionId: number;
  createdAt: IDateTime;
  description: string;
  id: number;
  revisionNumber: number;
  updatedAt: IDateTime;
}

/**
 * a specific revision of a collection
 */
export interface IRevision extends ITimestamped {
  adultContent: string;
  bugReports: ICollectionBugReport[];
  collection: ICollection;
  collectionChangelog: ICollectionChangelog;
  collectionId: number;
  collectionSchema: ICollectionSchema;
  collectionSchemaId: number;
  contentPreviewLink: string;
  downloadLink: string;
  externalResources: IExternalResource[];
  fileSize: number;
  gameVersions: IGameVersion[];
  id: number;
  installationInfo?: string;
  latest: boolean;
  metadata: IRevisionMetadata;
  modCount?: number;
  modFiles: ICollectionRevisionMod[];
  rating: IRating;
  revisionNumber: number;
  revisionStatus: string;
  status: string;
  totalSize?: number;
}

export interface ICollectionManifestInfo {
  author: string;
  authorUrl?: string;
  name: string;
  description?: string;
  summary?: string;
  domainName: string;
  gameVersions?: string[];
}

export interface ICollectionManifestModSource {
  type: SourceType;
  modId?: number;
  fileId?: number;
  md5?: string;
  fileSize?: number;
  updatePolicy?: UpdatePolicy;
  logicalFilename?: string;
  fileExpression?: string;
  url?: string;
  adultContent?: boolean;
}

export interface ICollectionManifestMod {
  name: string;
  version: string;
  optional: boolean;
  domainName: string;
  source: ICollectionManifestModSource;
  author?: string;
}

export interface ICollectionManifest {
  info: ICollectionManifestInfo;
  mods: ICollectionManifestMod[];
}

/**
 * payload used to create a collection revision
 */
export interface ICollectionPayload {
  adultContent: boolean;
  collectionSchemaId: number;
  collectionManifest: ICollectionManifest;
}

export interface ICreateCollectionResult {
  collection?: Partial<ICollection>;
  revision?: Partial<IRevision>;
  success: boolean;
}

export interface IFileHash {
  createdAt: IDateTime;
  fileName: string;
  fileSize: string;
  fileType: string;
  gameId: number;
  md5: string;
  modFile: IModFile;
  modFileId: number;
}

export type RatingOptions = 'positive' | 'negative' | 'abstained';

export type GraphErrorCode = 'REVISION_INVALID';
export type GraphErrorAttribute = 'modId' | 'fileId';
export type GraphErrorItemCode = 'NOT_AVAILABLE' | 'NOT_FOUND' | 'DELETED';
export type GraphErrorEntity = 'Mod' | 'ModFile';
export type GraphErrorType = 'LOCATE_ERROR';

export interface IGraphQLError {
  message: string;
  extensions?: {
    attribute?: GraphErrorAttribute;
    code?: GraphErrorItemCode;
    entity?: GraphErrorEntity;
    message?: string;
    type?: GraphErrorType;
    value?: any;
    parameter?: any;
  }
}

export type LogLevel = 'info' | 'error';
export type LogFunc = (level: LogLevel, message: string, meta: any) => void;

export interface IOAuthCredentials {
  token: string,
  refreshToken: string,
  fingerprint: string,
}

export interface IOAuthConfig {
  id: string,
  secret?: string
}

/**
 * Sort field options for collection search
 */
export type CollectionSortField = 'endorsements' | 'totalDownloads' | 'name' | 'recentRating';

/**
 * Sort direction options
 */
export type SortDirection = 'ASC' | 'DESC';

/**
 * Options for searching collections
 */
export interface ICollectionSearchOptions {
  gameId: string;
  count?: number;
  offset?: number;
  sort?: {
    field: CollectionSortField;
    direction: SortDirection;
  };
  search?: string;
  categoryName?: string[];
  collectionStatuses?: string[];
}

/**
 * Result of a collection search
 */
export interface ICollectionSearchResult {
  nodes: Partial<ICollection>[];
  totalCount: number;
}
