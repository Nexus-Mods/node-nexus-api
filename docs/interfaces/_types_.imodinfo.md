[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["types"](../modules/_types_.md) › [IModInfo](_types_.imodinfo.md)

# Interface: IModInfo

Details about a mod

## Hierarchy

* **IModInfo**

  ↳ [IModInfoEx](_types_.imodinfoex.md)

## Index

### Properties

* [allow_rating](_types_.imodinfo.md#allow_rating)
* [author](_types_.imodinfo.md#author)
* [available](_types_.imodinfo.md#available)
* [category_id](_types_.imodinfo.md#category_id)
* [contains_adult_content](_types_.imodinfo.md#contains_adult_content)
* [created_time](_types_.imodinfo.md#created_time)
* [created_timestamp](_types_.imodinfo.md#created_timestamp)
* [description](_types_.imodinfo.md#optional-description)
* [domain_name](_types_.imodinfo.md#domain_name)
* [endorsement](_types_.imodinfo.md#optional-endorsement)
* [endorsement_count](_types_.imodinfo.md#endorsement_count)
* [game_id](_types_.imodinfo.md#game_id)
* [mod_id](_types_.imodinfo.md#mod_id)
* [name](_types_.imodinfo.md#optional-name)
* [picture_url](_types_.imodinfo.md#optional-picture_url)
* [status](_types_.imodinfo.md#status)
* [summary](_types_.imodinfo.md#optional-summary)
* [updated_time](_types_.imodinfo.md#updated_time)
* [updated_timestamp](_types_.imodinfo.md#updated_timestamp)
* [uploaded_by](_types_.imodinfo.md#uploaded_by)
* [uploaded_users_profile_url](_types_.imodinfo.md#uploaded_users_profile_url)
* [user](_types_.imodinfo.md#user)
* [version](_types_.imodinfo.md#version)

## Properties

###  allow_rating

• **allow_rating**: *boolean*

*Defined in [src/types.ts:139](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L139)*

whether this mod allows endorsements

___

###  author

• **author**: *string*

*Defined in [src/types.ts:92](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L92)*

Author of the mod

___

###  available

• **available**: *boolean*

*Defined in [src/types.ts:115](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L115)*

whether the mod is currently available/visible to users
If a mod isn't available the api returns very limited information, essentially
hiding all textual info that could contain offensive content but certain "maintenance" info
is still provided.

___

###  category_id

• **category_id**: *number*

*Defined in [src/types.ts:67](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L67)*

id of the category

___

###  contains_adult_content

• **contains_adult_content**: *boolean*

*Defined in [src/types.ts:71](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L71)*

whether this mod is tagged as adult

___

###  created_time

• **created_time**: *string*

*Defined in [src/types.ts:127](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L127)*

readable time of when the mod was created

___

###  created_timestamp

• **created_timestamp**: *number*

*Defined in [src/types.ts:123](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L123)*

unix timestamp of when the mod was created

___

### `Optional` description

• **description**? : *string*

*Defined in [src/types.ts:84](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L84)*

long description (bbcode)

___

###  domain_name

• **domain_name**: *string*

*Defined in [src/types.ts:63](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L63)*

domain name (as used in urls and as the game id in all other requests)

___

### `Optional` endorsement

• **endorsement**? : *object*

*Defined in [src/types.ts:147](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L147)*

obsolete - will be removed in the near future

#### Type declaration:

* **endorse_status**: *[EndorsedStatus](../modules/_types_.md#endorsedstatus)*

* **timestamp**: *number*

* **version**: *number*

___

###  endorsement_count

• **endorsement_count**: *number*

*Defined in [src/types.ts:143](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L143)*

endorsement count

___

###  game_id

• **game_id**: *number*

*Defined in [src/types.ts:59](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L59)*

internal id of the game this mod belongs to

___

###  mod_id

• **mod_id**: *number*

*Defined in [src/types.ts:55](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L55)*

id of this mod (should be the same you queried for)

___

### `Optional` name

• **name**? : *string*

*Defined in [src/types.ts:76](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L76)*

Name of the mod
(not present if the file is under moderation)

___

### `Optional` picture_url

• **picture_url**? : *string*

*Defined in [src/types.ts:119](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L119)*

url of the primary screenshot

___

###  status

• **status**: *[ModStatus](../modules/_types_.md#modstatus)*

*Defined in [src/types.ts:108](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L108)*

current status of the mod

___

### `Optional` summary

• **summary**? : *string*

*Defined in [src/types.ts:80](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L80)*

short description

___

###  updated_time

• **updated_time**: *string*

*Defined in [src/types.ts:135](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L135)*

readable time of when the mod was updated

___

###  updated_timestamp

• **updated_timestamp**: *number*

*Defined in [src/types.ts:131](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L131)*

unix timestamp of when the mod was updated

___

###  uploaded_by

• **uploaded_by**: *string*

*Defined in [src/types.ts:100](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L100)*

name of the user who uploaded this mod

___

###  uploaded_users_profile_url

• **uploaded_users_profile_url**: *string*

*Defined in [src/types.ts:104](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L104)*

url of the profile image of the uploader

___

###  user

• **user**: *[IUser](_types_.iuser.md)*

*Defined in [src/types.ts:96](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L96)*

more detailed info about the author

___

###  version

• **version**: *string*

*Defined in [src/types.ts:88](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L88)*

mod version
