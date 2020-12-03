[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["types"](../modules/_types_.md) › [IModInfoEx](_types_.imodinfoex.md)

# Interface: IModInfoEx

## Hierarchy

* [IModInfo](_types_.imodinfo.md)

  ↳ **IModInfoEx**

## Index

### Properties

* [allow_rating](_types_.imodinfoex.md#allow_rating)
* [author](_types_.imodinfoex.md#author)
* [available](_types_.imodinfoex.md#available)
* [category_id](_types_.imodinfoex.md#category_id)
* [contains_adult_content](_types_.imodinfoex.md#contains_adult_content)
* [created_time](_types_.imodinfoex.md#created_time)
* [created_timestamp](_types_.imodinfoex.md#created_timestamp)
* [description](_types_.imodinfoex.md#optional-description)
* [domain_name](_types_.imodinfoex.md#domain_name)
* [endorsement](_types_.imodinfoex.md#optional-endorsement)
* [endorsement_count](_types_.imodinfoex.md#endorsement_count)
* [game_id](_types_.imodinfoex.md#game_id)
* [mod_id](_types_.imodinfoex.md#mod_id)
* [name](_types_.imodinfoex.md#optional-name)
* [picture_url](_types_.imodinfoex.md#optional-picture_url)
* [status](_types_.imodinfoex.md#status)
* [summary](_types_.imodinfoex.md#optional-summary)
* [updated_time](_types_.imodinfoex.md#updated_time)
* [updated_timestamp](_types_.imodinfoex.md#updated_timestamp)
* [uploaded_by](_types_.imodinfoex.md#uploaded_by)
* [uploaded_users_profile_url](_types_.imodinfoex.md#uploaded_users_profile_url)
* [user](_types_.imodinfoex.md#user)
* [version](_types_.imodinfoex.md#version)

## Properties

###  allow_rating

• **allow_rating**: *boolean*

*Inherited from [IModInfo](_types_.imodinfo.md).[allow_rating](_types_.imodinfo.md#allow_rating)*

*Defined in [src/types.ts:139](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L139)*

whether this mod allows endorsements

___

###  author

• **author**: *string*

*Inherited from [IModInfo](_types_.imodinfo.md).[author](_types_.imodinfo.md#author)*

*Defined in [src/types.ts:92](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L92)*

Author of the mod

___

###  available

• **available**: *boolean*

*Inherited from [IModInfo](_types_.imodinfo.md).[available](_types_.imodinfo.md#available)*

*Defined in [src/types.ts:115](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L115)*

whether the mod is currently available/visible to users
If a mod isn't available the api returns very limited information, essentially
hiding all textual info that could contain offensive content but certain "maintenance" info
is still provided.

___

###  category_id

• **category_id**: *number*

*Inherited from [IModInfo](_types_.imodinfo.md).[category_id](_types_.imodinfo.md#category_id)*

*Defined in [src/types.ts:67](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L67)*

id of the category

___

###  contains_adult_content

• **contains_adult_content**: *boolean*

*Inherited from [IModInfo](_types_.imodinfo.md).[contains_adult_content](_types_.imodinfo.md#contains_adult_content)*

*Defined in [src/types.ts:71](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L71)*

whether this mod is tagged as adult

___

###  created_time

• **created_time**: *string*

*Inherited from [IModInfo](_types_.imodinfo.md).[created_time](_types_.imodinfo.md#created_time)*

*Defined in [src/types.ts:127](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L127)*

readable time of when the mod was created

___

###  created_timestamp

• **created_timestamp**: *number*

*Inherited from [IModInfo](_types_.imodinfo.md).[created_timestamp](_types_.imodinfo.md#created_timestamp)*

*Defined in [src/types.ts:123](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L123)*

unix timestamp of when the mod was created

___

### `Optional` description

• **description**? : *string*

*Inherited from [IModInfo](_types_.imodinfo.md).[description](_types_.imodinfo.md#optional-description)*

*Defined in [src/types.ts:84](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L84)*

long description (bbcode)

___

###  domain_name

• **domain_name**: *string*

*Inherited from [IModInfo](_types_.imodinfo.md).[domain_name](_types_.imodinfo.md#domain_name)*

*Defined in [src/types.ts:63](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L63)*

domain name (as used in urls and as the game id in all other requests)

___

### `Optional` endorsement

• **endorsement**? : *object*

*Inherited from [IModInfo](_types_.imodinfo.md).[endorsement](_types_.imodinfo.md#optional-endorsement)*

*Defined in [src/types.ts:147](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L147)*

obsolete - will be removed in the near future

#### Type declaration:

* **endorse_status**: *[EndorsedStatus](../modules/_types_.md#endorsedstatus)*

* **timestamp**: *number*

* **version**: *number*

___

###  endorsement_count

• **endorsement_count**: *number*

*Inherited from [IModInfo](_types_.imodinfo.md).[endorsement_count](_types_.imodinfo.md#endorsement_count)*

*Defined in [src/types.ts:143](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L143)*

endorsement count

___

###  game_id

• **game_id**: *number*

*Overrides [IModInfo](_types_.imodinfo.md).[game_id](_types_.imodinfo.md#game_id)*

*Defined in [src/types.ts:374](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L374)*

___

###  mod_id

• **mod_id**: *number*

*Overrides [IModInfo](_types_.imodinfo.md).[mod_id](_types_.imodinfo.md#mod_id)*

*Defined in [src/types.ts:373](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L373)*

___

### `Optional` name

• **name**? : *string*

*Inherited from [IModInfo](_types_.imodinfo.md).[name](_types_.imodinfo.md#optional-name)*

*Defined in [src/types.ts:76](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L76)*

Name of the mod
(not present if the file is under moderation)

___

### `Optional` picture_url

• **picture_url**? : *string*

*Inherited from [IModInfo](_types_.imodinfo.md).[picture_url](_types_.imodinfo.md#optional-picture_url)*

*Defined in [src/types.ts:119](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L119)*

url of the primary screenshot

___

###  status

• **status**: *[ModStatus](../modules/_types_.md#modstatus)*

*Inherited from [IModInfo](_types_.imodinfo.md).[status](_types_.imodinfo.md#status)*

*Defined in [src/types.ts:108](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L108)*

current status of the mod

___

### `Optional` summary

• **summary**? : *string*

*Inherited from [IModInfo](_types_.imodinfo.md).[summary](_types_.imodinfo.md#optional-summary)*

*Defined in [src/types.ts:80](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L80)*

short description

___

###  updated_time

• **updated_time**: *string*

*Inherited from [IModInfo](_types_.imodinfo.md).[updated_time](_types_.imodinfo.md#updated_time)*

*Defined in [src/types.ts:135](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L135)*

readable time of when the mod was updated

___

###  updated_timestamp

• **updated_timestamp**: *number*

*Inherited from [IModInfo](_types_.imodinfo.md).[updated_timestamp](_types_.imodinfo.md#updated_timestamp)*

*Defined in [src/types.ts:131](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L131)*

unix timestamp of when the mod was updated

___

###  uploaded_by

• **uploaded_by**: *string*

*Inherited from [IModInfo](_types_.imodinfo.md).[uploaded_by](_types_.imodinfo.md#uploaded_by)*

*Defined in [src/types.ts:100](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L100)*

name of the user who uploaded this mod

___

###  uploaded_users_profile_url

• **uploaded_users_profile_url**: *string*

*Inherited from [IModInfo](_types_.imodinfo.md).[uploaded_users_profile_url](_types_.imodinfo.md#uploaded_users_profile_url)*

*Defined in [src/types.ts:104](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L104)*

url of the profile image of the uploader

___

###  user

• **user**: *[IUser](_types_.iuser.md)*

*Inherited from [IModInfo](_types_.imodinfo.md).[user](_types_.imodinfo.md#user)*

*Defined in [src/types.ts:96](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L96)*

more detailed info about the author

___

###  version

• **version**: *string*

*Inherited from [IModInfo](_types_.imodinfo.md).[version](_types_.imodinfo.md#version)*

*Defined in [src/types.ts:88](https://github.com/Nexus-Mods/node-nexus-api/blob/5dbdef6/src/types.ts#L88)*

mod version
