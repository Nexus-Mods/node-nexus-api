[nexus-api](../README.md) > ["types"](../modules/_types_.md) > [IModInfoEx](../interfaces/_types_.imodinfoex.md)

# Interface: IModInfoEx

## Hierarchy

 [IModInfo](_types_.imodinfo.md)

**↳ IModInfoEx**

## Index

### Properties

* [author](_types_.imodinfoex.md#author)
* [category_id](_types_.imodinfoex.md#category_id)
* [contains_adult_content](_types_.imodinfoex.md#contains_adult_content)
* [created_time](_types_.imodinfoex.md#created_time)
* [created_timestamp](_types_.imodinfoex.md#created_timestamp)
* [description](_types_.imodinfoex.md#description)
* [endorsement](_types_.imodinfoex.md#endorsement)
* [game_id](_types_.imodinfoex.md#game_id)
* [mod_id](_types_.imodinfoex.md#mod_id)
* [name](_types_.imodinfoex.md#name)
* [picture_url](_types_.imodinfoex.md#picture_url)
* [primary_file](_types_.imodinfoex.md#primary_file)
* [summary](_types_.imodinfoex.md#summary)
* [type](_types_.imodinfoex.md#type)
* [updated_time](_types_.imodinfoex.md#updated_time)
* [updated_timestamp](_types_.imodinfoex.md#updated_timestamp)
* [uploaded_by](_types_.imodinfoex.md#uploaded_by)
* [uploaded_users_profile_url](_types_.imodinfoex.md#uploaded_users_profile_url)
* [version](_types_.imodinfoex.md#version-1)

---

## Properties

<a id="author"></a>

###  author

**● author**: *`string`*

Author of the mod

___
<a id="category_id"></a>

###  category_id

**● category_id**: *`number`*

id of the category

___
<a id="contains_adult_content"></a>

###  contains_adult_content

**● contains_adult_content**: *`number`*

whether this mod is tagged as adult (1 = true, 0 = false)

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

###  description

**● description**: *`string`*

long description

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
<a id="game_id"></a>

###  game_id

**● game_id**: *`number`*

___
<a id="mod_id"></a>

###  mod_id

**● mod_id**: *`number`*

___
<a id="name"></a>

###  name

**● name**: *`string`*

Name of the mod

___
<a id="picture_url"></a>

###  picture_url

**● picture_url**: *`string`*

url of the primary screenshot

___
<a id="primary_file"></a>

### `<Optional>` primary_file

**● primary_file**: *[IFileInfo](_types_.ifileinfo.md)*

the primary file for this mod

___
<a id="summary"></a>

###  summary

**● summary**: *`string`*

short description

___
<a id="type"></a>

###  type

**● type**: *`number`*

mod type

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
<a id="version-1"></a>

###  version

**● version**: *`string`*

mod version

___

