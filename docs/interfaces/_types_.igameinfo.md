[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["types"](../modules/_types_.md) › [IGameInfo](_types_.igameinfo.md)

# Interface: IGameInfo

extended information about a game

## Hierarchy

* [IGameListEntry](_types_.igamelistentry.md)

  ↳ **IGameInfo**

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

## Properties

###  approved_date

• **approved_date**: *number*

*Inherited from [IGameListEntry](_types_.igamelistentry.md).[approved_date](_types_.igamelistentry.md#approved_date)*

*Defined in [src/types.ts:347](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L347)*

unix timestamp of when this game was added to nexuis mods

___

###  categories

• **categories**: *[ICategory](_types_.icategory.md)[]*

*Defined in [src/types.ts:357](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L357)*

list of categories for this game

___

###  domain_name

• **domain_name**: *string*

*Inherited from [IGameListEntry](_types_.igamelistentry.md).[domain_name](_types_.igamelistentry.md#domain_name)*

*Defined in [src/types.ts:314](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L314)*

domain name (as used in urls and as the game id in all other requests)

___

###  downloads

• **downloads**: *number*

*Inherited from [IGameListEntry](_types_.igamelistentry.md).[downloads](_types_.igamelistentry.md#downloads)*

*Defined in [src/types.ts:343](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L343)*

number of downloads from nexus for files for this game

___

###  file_count

• **file_count**: *number*

*Inherited from [IGameListEntry](_types_.igamelistentry.md).[file_count](_types_.igamelistentry.md#file_count)*

*Defined in [src/types.ts:339](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L339)*

number of files hosted on nexus for this game

___

###  forum_url

• **forum_url**: *string*

*Inherited from [IGameListEntry](_types_.igamelistentry.md).[forum_url](_types_.igamelistentry.md#forum_url)*

*Defined in [src/types.ts:322](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L322)*

url for the corresponding forum section

___

###  genre

• **genre**: *string*

*Inherited from [IGameListEntry](_types_.igamelistentry.md).[genre](_types_.igamelistentry.md#genre)*

*Defined in [src/types.ts:331](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L331)*

genre of the game
(possible values?)

___

###  id

• **id**: *number*

*Inherited from [IGameListEntry](_types_.igamelistentry.md).[id](_types_.igamelistentry.md#id)*

*Defined in [src/types.ts:310](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L310)*

numerical id

___

###  mods

• **mods**: *number*

*Inherited from [IGameListEntry](_types_.igamelistentry.md).[mods](_types_.igamelistentry.md#mods)*

*Defined in [src/types.ts:335](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L335)*

number of mods hosted on nexus for this game

___

###  name

• **name**: *string*

*Inherited from [IGameListEntry](_types_.igamelistentry.md).[name](_types_.igamelistentry.md#name)*

*Defined in [src/types.ts:318](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L318)*

display name

___

###  nexusmods_url

• **nexusmods_url**: *string*

*Inherited from [IGameListEntry](_types_.igamelistentry.md).[nexusmods_url](_types_.igamelistentry.md#nexusmods_url)*

*Defined in [src/types.ts:326](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L326)*

url for the primary nexusmods page (should be https://www.nexusmods.com/<domain_name>)
