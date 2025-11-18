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
export interface IModCategory {
    category_id: number;
    name: string;
    parent_category: number | false;
}
export interface IGameListEntry {
    id: number;
    domain_name: string;
    name: string;
    name_lower: string;
    forum_url: string;
    nexusmods_url: string;
    genre: string;
    mods: number;
    file_count: number;
    downloads: number;
    approved_date: number;
    collections: number;
}
export interface IGameInfo extends IGameListEntry {
    categories: IModCategory[];
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
export declare type UpdatePolicy = 'exact' | 'latest' | 'prefer';
export declare type SourceType = 'browse' | 'manual' | 'direct' | 'nexus';
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
export declare type IDateTime = string;
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
export declare type CollectionPermission = 'collection:publish' | 'collection:moderate' | 'collection:discard' | 'collection:view_discarded' | 'collection:view_unlisted' | 'collection:view_under_moderation' | 'collection:view_draft_revisions' | 'collection:add_tag' | 'collection:remove_tag' | 'collection:set_status' | 'collection:discard_revisions' | 'collection:edit' | 'collection:close_bug_reports' | 'collection:open_bug_reports';
export interface ICollectionPermission {
    global: boolean;
    key: CollectionPermission | string;
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
export declare type ICollectionMedia = ICollectionImage & ICollectionVideo;
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
export declare type RevisionStatus = 'is_private' | 'is_public' | 'is_hidden' | 'is_testing' | 'is_nuked';
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
export interface INodesFacet {
    count: number;
    facet: string;
    value: string;
}
export interface IModFileContent {
    id: string;
    gameId: number;
    modId: number;
    fileId: number;
    filePath: string;
    filePathParts: string[];
    fileName: string;
    fileExtension: string;
    fileSize: string;
}
export interface IModFileContentPage {
    nodes: IModFileContent[];
    nodesCount: number;
    totalCount: number;
    facets?: INodesFacet[];
    facetsData?: any;
    nodesFacets?: INodesFacet[];
    nodesFilter?: string;
}
export declare type FilterComparisonOperator = 'EQUALS' | 'NOT_EQUALS' | 'MATCHES' | 'WILDCARD' | 'GT' | 'GTE' | 'LT' | 'LTE';
export declare type FilterComparisonOperatorEqualsMatches = 'EQUALS' | 'NOT_EQUALS' | 'MATCHES';
export declare type FilterComparisonOperatorEqualsWildcard = 'EQUALS' | 'NOT_EQUALS' | 'WILDCARD';
export declare type FilterComparisonOperatorNumeric = 'EQUALS' | 'NOT_EQUALS' | 'GT' | 'GTE' | 'LT' | 'LTE';
export declare type FilterLogicalOperator = 'AND' | 'OR';
export interface IBaseFilterValue {
    op: 'EQUALS' | 'NOT_EQUALS';
    value: string | number;
}
export interface IBaseFilterValueEqualsWildcard {
    op: FilterComparisonOperatorEqualsWildcard;
    value: string;
}
export interface IBaseFilterValueEqualsMatches {
    op: FilterComparisonOperatorEqualsMatches;
    value: string;
}
export interface IBaseFilterValueNumeric {
    op: FilterComparisonOperatorNumeric;
    value: string;
}
export interface IModFileContentSearchFilter {
    filter?: IModFileContentSearchFilter[];
    op?: FilterLogicalOperator;
    fileId?: IBaseFilterValue[];
    modId?: IBaseFilterValue[];
    gameId?: IBaseFilterValue[];
    filePathWildcard?: IBaseFilterValueEqualsWildcard[];
    filePathPartsExact?: IBaseFilterValueEqualsMatches[];
    fileNameWildcard?: IBaseFilterValueEqualsWildcard[];
    fileExtensionExact?: IBaseFilterValueEqualsMatches[];
    fileSize?: IBaseFilterValueNumeric[];
}
export declare type RatingOptions = 'positive' | 'negative' | 'abstained';
export declare type GraphErrorCode = 'REVISION_INVALID';
export declare type GraphErrorAttribute = 'modId' | 'fileId';
export declare type GraphErrorItemCode = 'NOT_AVAILABLE' | 'NOT_FOUND' | 'DELETED';
export declare type GraphErrorEntity = 'Mod' | 'ModFile';
export declare type GraphErrorType = 'LOCATE_ERROR';
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
    };
}
export declare type LogLevel = 'info' | 'error';
export declare type LogFunc = (level: LogLevel, message: string, meta: any) => void;
export interface IOAuthCredentials {
    token: string;
    refreshToken: string;
    fingerprint: string;
}
export interface IOAuthConfig {
    id: string;
    secret?: string;
}
export declare type CollectionSortField = 'endorsements' | 'downloads' | 'createdAt' | 'recentRating';
export declare type SortDirection = 'ASC' | 'DESC';
export interface ICategoryNameFilter {
    op: 'EQUALS' | 'NOT_EQUALS';
    value: string;
}
export interface ICollectionSearchOptions {
    gameId: string;
    count?: number;
    offset?: number;
    sort?: {
        field: CollectionSortField;
        direction: SortDirection;
    };
    search?: string;
    categoryName?: ICategoryNameFilter[];
    collectionStatuses?: string[];
    includeAdultContent?: boolean;
    userId?: string;
}
export interface ICollectionSearchResult {
    nodes: Partial<ICollection>[];
    totalCount: number;
}
