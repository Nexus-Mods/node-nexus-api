[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["types"](../modules/_types_.md) › [IGameListEntry](_types_.igamelistentry.md)

# Interface: IGameListEntry

basic information about a game

## Hierarchy

* **IGameListEntry**

  ↳ [IGameInfo](_types_.igameinfo.md)

## Index

### Properties

* [approved_date](_types_.igamelistentry.md#approved_date)
* [domain_name](_types_.igamelistentry.md#domain_name)
* [downloads](_types_.igamelistentry.md#downloads)
* [file_count](_types_.igamelistentry.md#file_count)
* [forum_url](_types_.igamelistentry.md#forum_url)
* [genre](_types_.igamelistentry.md#genre)
* [id](_types_.igamelistentry.md#id)
* [mods](_types_.igamelistentry.md#mods)
* [name](_types_.igamelistentry.md#name)
* [nexusmods_url](_types_.igamelistentry.md#nexusmods_url)

## Properties

###  approved_date

• **approved_date**: *number*

*Defined in [src/types.ts:339](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L339)*

unix timestamp of when this game was added to nexuis mods

___

###  domain_name

• **domain_name**: *string*

*Defined in [src/types.ts:306](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L306)*

domain name (as used in urls and as the game id in all other requests)

___

###  downloads

• **downloads**: *number*

*Defined in [src/types.ts:335](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L335)*

number of downloads from nexus for files for this game

___

###  file_count

• **file_count**: *number*

*Defined in [src/types.ts:331](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L331)*

number of files hosted on nexus for this game

___

###  forum_url

• **forum_url**: *string*

*Defined in [src/types.ts:314](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L314)*

url for the corresponding forum section

___

###  genre

• **genre**: *string*

*Defined in [src/types.ts:323](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L323)*

genre of the game
(possible values?)

___

###  id

• **id**: *number*

*Defined in [src/types.ts:302](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L302)*

numerical id

___

###  mods

• **mods**: *number*

*Defined in [src/types.ts:327](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L327)*

number of mods hosted on nexus for this game

___

###  name

• **name**: *string*

*Defined in [src/types.ts:310](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L310)*

display name

___

###  nexusmods_url

• **nexusmods_url**: *string*

*Defined in [src/types.ts:318](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/types.ts#L318)*

url for the primary nexusmods page (should be https://www.nexusmods.com/<domain_name>)
