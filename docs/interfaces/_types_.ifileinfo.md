[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["types"](../modules/_types_.md) › [IFileInfo](_types_.ifileinfo.md)

# Interface: IFileInfo

Information about a specific mod file

## Hierarchy

* **IFileInfo**

## Index

### Properties

* [category_id](_types_.ifileinfo.md#category_id)
* [category_name](_types_.ifileinfo.md#category_name)
* [changelog_html](_types_.ifileinfo.md#changelog_html)
* [content_preview_link](_types_.ifileinfo.md#content_preview_link)
* [description](_types_.ifileinfo.md#description)
* [external_virus_scan_url](_types_.ifileinfo.md#external_virus_scan_url)
* [file_id](_types_.ifileinfo.md#file_id)
* [file_name](_types_.ifileinfo.md#file_name)
* [is_primary](_types_.ifileinfo.md#is_primary)
* [mod_version](_types_.ifileinfo.md#mod_version)
* [name](_types_.ifileinfo.md#name)
* [size](_types_.ifileinfo.md#size)
* [size_kb](_types_.ifileinfo.md#size_kb)
* [uploaded_time](_types_.ifileinfo.md#uploaded_time)
* [uploaded_timestamp](_types_.ifileinfo.md#uploaded_timestamp)
* [version](_types_.ifileinfo.md#version)

## Properties

###  category_id

• **category_id**: *number*

*Defined in [src/types.ts:173](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L173)*

File type as a number (1 = main, 2 = patch, 3 = optional, 4 = old, 6 = deleted)

___

###  category_name

• **category_name**: *string*

*Defined in [src/types.ts:177](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L177)*

File type as a string ('MAIN', 'PATCH', 'OPTION', 'OLD_VERSION', 'DELETED')

___

###  changelog_html

• **changelog_html**: *string*

*Defined in [src/types.ts:182](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L182)*

html encoded changelog (matched via file version)
null if there is none

___

###  content_preview_link

• **content_preview_link**: *string*

*Defined in [src/types.ts:186](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L186)*

url of the content preview (json file containing list of files)

___

###  description

• **description**: *string*

*Defined in [src/types.ts:194](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L194)*

file description

___

###  external_virus_scan_url

• **external_virus_scan_url**: *string*

*Defined in [src/types.ts:227](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L227)*

link to the virus scan results
null if there is none

___

###  file_id

• **file_id**: *number*

*Defined in [src/types.ts:169](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L169)*

file id

___

###  file_name

• **file_name**: *string*

*Defined in [src/types.ts:210](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L210)*

actual file name (derived from name with id and version appended)

___

###  is_primary

• **is_primary**: *boolean*

*Defined in [src/types.ts:232](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L232)*

whether this is the primary download for the mod
(the one that users download through the link in the top right of the mod page)

___

###  mod_version

• **mod_version**: *string*

*Defined in [src/types.ts:222](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L222)*

version of the mod (at the time this was uploaded?)

___

###  name

• **name**: *string*

*Defined in [src/types.ts:190](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L190)*

readable file name

___

###  size

• **size**: *number*

*Defined in [src/types.ts:202](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L202)*

File size in kilobytes

___

###  size_kb

• **size_kb**: *number*

*Defined in [src/types.ts:206](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L206)*

File size. also in kilobytes. Because - ugh, don't ask

___

###  uploaded_time

• **uploaded_time**: *string*

*Defined in [src/types.ts:218](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L218)*

readable representation of the file time

___

###  uploaded_timestamp

• **uploaded_timestamp**: *number*

*Defined in [src/types.ts:214](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L214)*

unix timestamp of the time this file was uploaded

___

###  version

• **version**: *string*

*Defined in [src/types.ts:198](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L198)*

File version (doesn't actually have to match any mod version)
