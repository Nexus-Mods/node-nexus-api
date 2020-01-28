[@nexusmods/nexus-api](../README.md) > ["types"](../modules/_types_.md) > [IModInfo](../interfaces/_types_.imodinfo.md)

# Interface: IModInfo

Details about a mod

## Hierarchy

**IModInfo**

↳  [IModInfoEx](_types_.imodinfoex.md)

## Index

### Properties

* [allow_rating](_types_.imodinfo.md#allow_rating)
* [author](_types_.imodinfo.md#author)
* [available](_types_.imodinfo.md#available)
* [category_id](_types_.imodinfo.md#category_id)
* [contains_adult_content](_types_.imodinfo.md#contains_adult_content)
* [created_time](_types_.imodinfo.md#created_time)
* [created_timestamp](_types_.imodinfo.md#created_timestamp)
* [description](_types_.imodinfo.md#description)
* [domain_name](_types_.imodinfo.md#domain_name)
* [endorsement](_types_.imodinfo.md#endorsement)
* [endorsement_count](_types_.imodinfo.md#endorsement_count)
* [game_id](_types_.imodinfo.md#game_id)
* [mod_id](_types_.imodinfo.md#mod_id)
* [name](_types_.imodinfo.md#name)
* [picture_url](_types_.imodinfo.md#picture_url)
* [status](_types_.imodinfo.md#status)
* [summary](_types_.imodinfo.md#summary)
* [updated_time](_types_.imodinfo.md#updated_time)
* [updated_timestamp](_types_.imodinfo.md#updated_timestamp)
* [uploaded_by](_types_.imodinfo.md#uploaded_by)
* [uploaded_users_profile_url](_types_.imodinfo.md#uploaded_users_profile_url)
* [user](_types_.imodinfo.md#user)
* [version](_types_.imodinfo.md#version-1)

---

## Properties

<a id="allow_rating"></a>

###  allow_rating

**● allow_rating**: *`boolean`*

whether this mod allows endorsements

___
<a id="author"></a>

###  author

**● author**: *`string`*

Author of the mod

___
<a id="available"></a>

###  available

**● available**: *`boolean`*

whether the mod is currently available/visible to users If a mod isn't available the api returns very limited information, essentially hiding all textual info that could contain offensive content but certain "maintenance" info is still provided.

___
<a id="category_id"></a>

###  category_id

**● category_id**: *`number`*

id of the category

___
<a id="contains_adult_content"></a>

###  contains_adult_content

**● contains_adult_content**: *`boolean`*

whether this mod is tagged as adult

___
<a id="created_time"></a>

###  created_time

**● created_time**: *`string`*

readable time of when the mod was created

___
<a id="created_timestamp"></a>

###  created_timestamp

**● created_timestamp**: *`number`*

unix timestamp of when the mod was created

___
<a id="description"></a>

### `<Optional>` description

**● description**: *`string`*

long description (bbcode)

___
<a id="domain_name"></a>

###  domain_name

**● domain_name**: *`string`*

domain name (as used in urls and as the game id in all other requests)

___
<a id="endorsement"></a>

### `<Optional>` endorsement

**● endorsement**: *`object`*

obsolete - will be removed in the near future

#### Type declaration

 endorse_status: [EndorsedStatus](../modules/_types_.md#endorsedstatus)

 timestamp: `number`

 version: `number`

___
<a id="endorsement_count"></a>

###  endorsement_count

**● endorsement_count**: *`number`*

endorsement count

___
<a id="game_id"></a>

###  game_id

**● game_id**: *`number`*

internal id of the game this mod belongs to

___
<a id="mod_id"></a>

###  mod_id

**● mod_id**: *`number`*

id of this mod (should be the same you queried for)

___
<a id="name"></a>

### `<Optional>` name

**● name**: *`string`*

Name of the mod (not present if the file is under moderation)

___
<a id="picture_url"></a>

### `<Optional>` picture_url

**● picture_url**: *`string`*

url of the primary screenshot

___
<a id="status"></a>

###  status

**● status**: *[ModStatus](../modules/_types_.md#modstatus)*

current status of the mod

___
<a id="summary"></a>

### `<Optional>` summary

**● summary**: *`string`*

short description

___
<a id="updated_time"></a>

###  updated_time

**● updated_time**: *`string`*

readable time of when the mod was updated

___
<a id="updated_timestamp"></a>

###  updated_timestamp

**● updated_timestamp**: *`number`*

unix timestamp of when the mod was updated

___
<a id="uploaded_by"></a>

###  uploaded_by

**● uploaded_by**: *`string`*

name of the user who uploaded this mod

___
<a id="uploaded_users_profile_url"></a>

###  uploaded_users_profile_url

**● uploaded_users_profile_url**: *`string`*

url of the profile image of the uploader

___
<a id="user"></a>

###  user

**● user**: *[IUser](_types_.iuser.md)*

more detailed info about the author

___
<a id="version-1"></a>

###  version

**● version**: *`string`*

mod version

___

