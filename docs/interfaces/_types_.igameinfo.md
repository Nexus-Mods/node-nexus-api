[nexus-api](../README.md) > ["types"](../modules/_types_.md) > [IGameInfo](../interfaces/_types_.igameinfo.md)

# Interface: IGameInfo

extended information about a game

## Hierarchy

 [IGameListEntry](_types_.igamelistentry.md)

**↳ IGameInfo**

## Index

### Properties

* [approved_date](_types_.igameinfo.md#approved_date)
* [categories](_types_.igameinfo.md#categories)
* [domain_name](_types_.igameinfo.md#domain_name)
* [downloads](_types_.igameinfo.md#downloads)
* [file_count](_types_.igameinfo.md#file_count)
* [forum_url](_types_.igameinfo.md#forum_url)
* [genre](_types_.igameinfo.md#genre)
* [id](_types_.igameinfo.md#id)
* [mods](_types_.igameinfo.md#mods)
* [name](_types_.igameinfo.md#name)
* [nexusmods_url](_types_.igameinfo.md#nexusmods_url)

---

## Properties

<a id="approved_date"></a>

###  approved_date

**● approved_date**: *`number`*

unix timestamp of when this game was added to nexuis mods

___
<a id="categories"></a>

###  categories

**● categories**: *[ICategory](_types_.icategory.md)[]*

list of categories for this game

___
<a id="domain_name"></a>

###  domain_name

**● domain_name**: *`string`*

domain name (as used in urls and as the game id in all other requests)

___
<a id="downloads"></a>

###  downloads

**● downloads**: *`number`*

number of downloads from nexus for files for this game

___
<a id="file_count"></a>

###  file_count

**● file_count**: *`number`*

number of files hosted on nexus for this game

___
<a id="forum_url"></a>

###  forum_url

**● forum_url**: *`string`*

url for the corresponding forum section

___
<a id="genre"></a>

###  genre

**● genre**: *`string`*

genre of the game (possible values?)

___
<a id="id"></a>

###  id

**● id**: *`number`*

numerical id

___
<a id="mods"></a>

###  mods

**● mods**: *`number`*

number of mods hosted on nexus for this game

___
<a id="name"></a>

###  name

**● name**: *`string`*

display name

___
<a id="nexusmods_url"></a>

###  nexusmods_url

**● nexusmods_url**: *`string`*

url for the primary nexusmods page (should be [https://www.nexusmods.com/](https://www.nexusmods.com/))

___

