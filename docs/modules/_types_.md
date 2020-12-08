[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["types"](_types_.md)

# Module: "types"

## Index

### Interfaces

* [ICategory](../interfaces/_types_.icategory.md)
* [IChangelogs](../interfaces/_types_.ichangelogs.md)
* [IColourScheme](../interfaces/_types_.icolourscheme.md)
* [IDownloadURL](../interfaces/_types_.idownloadurl.md)
* [IEndorseResponse](../interfaces/_types_.iendorseresponse.md)
* [IEndorsement](../interfaces/_types_.iendorsement.md)
* [IFeedbackResponse](../interfaces/_types_.ifeedbackresponse.md)
* [IFileInfo](../interfaces/_types_.ifileinfo.md)
* [IFileUpdate](../interfaces/_types_.ifileupdate.md)
* [IGameInfo](../interfaces/_types_.igameinfo.md)
* [IGameListEntry](../interfaces/_types_.igamelistentry.md)
* [IGithubIssue](../interfaces/_types_.igithubissue.md)
* [IIssue](../interfaces/_types_.iissue.md)
* [IMD5Result](../interfaces/_types_.imd5result.md)
* [IModFiles](../interfaces/_types_.imodfiles.md)
* [IModInfo](../interfaces/_types_.imodinfo.md)
* [IModInfoEx](../interfaces/_types_.imodinfoex.md)
* [INexusEvents](../interfaces/_types_.inexusevents.md)
* [IOAuthConfig](../interfaces/_types_.ioauthconfig.md)
* [IOAuthCredentials](../interfaces/_types_.ioauthcredentials.md)
* [ITrackResponse](../interfaces/_types_.itrackresponse.md)
* [ITrackedMod](../interfaces/_types_.itrackedmod.md)
* [IUpdateEntry](../interfaces/_types_.iupdateentry.md)
* [IUser](../interfaces/_types_.iuser.md)
* [IValidateKeyResponse](../interfaces/_types_.ivalidatekeyresponse.md)

### Type aliases

* [EndorsedStatus](_types_.md#endorsedstatus)
* [ModStatus](_types_.md#modstatus)
* [UpdatePeriod](_types_.md#updateperiod)

## Type aliases

###  EndorsedStatus

Ƭ **EndorsedStatus**: *"Undecided" | "Abstained" | "Endorsed"*

*Defined in [src/types.ts:41](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L41)*

___

###  ModStatus

Ƭ **ModStatus**: *"under_moderation" | "published" | "not_published" | "publish_with_game" | "removed" | "wastebinned" | "hidden"*

*Defined in [src/types.ts:46](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L46)*

possible states the mod can be in

___

###  UpdatePeriod

Ƭ **UpdatePeriod**: *"1d" | "1w" | "1m"*

*Defined in [src/types.ts:487](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L487)*

range of updates to query
