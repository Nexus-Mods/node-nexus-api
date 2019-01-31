[nexus-api](../README.md) > ["types"](../modules/_types_.md) > [IFileInfoEx](../interfaces/_types_.ifileinfoex.md)

# Interface: IFileInfoEx

## Hierarchy

 [IFileInfo](_types_.ifileinfo.md)

**↳ IFileInfoEx**

## Index

### Properties

* [category_id](_types_.ifileinfoex.md#category_id)
* [category_name](_types_.ifileinfoex.md#category_name)
* [changelog_html](_types_.ifileinfoex.md#changelog_html)
* [external_virus_scan_url](_types_.ifileinfoex.md#external_virus_scan_url)
* [file_id](_types_.ifileinfoex.md#file_id)
* [file_name](_types_.ifileinfoex.md#file_name)
* [is_primary](_types_.ifileinfoex.md#is_primary)
* [md5](_types_.ifileinfoex.md#md5)
* [mod_version](_types_.ifileinfoex.md#mod_version)
* [name](_types_.ifileinfoex.md#name)
* [size](_types_.ifileinfoex.md#size)
* [uploaded_time](_types_.ifileinfoex.md#uploaded_time)
* [uploaded_timestamp](_types_.ifileinfoex.md#uploaded_timestamp)
* [version](_types_.ifileinfoex.md#version)

---

## Properties

<a id="category_id"></a>

###  category_id

**● category_id**: *`number`*

File type as a number (1 = main, 2 = patch, 3 = optional, 4 = old, 6 = deleted)

___
<a id="category_name"></a>

###  category_name

**● category_name**: *`string`*

File type as a string ('MAIN', 'PATCH', 'OPTION', 'OLD\_VERSION', 'DELETED')

___
<a id="changelog_html"></a>

###  changelog_html

**● changelog_html**: *`string`*

html encoded changelog (matched via file version) null if there is none

___
<a id="external_virus_scan_url"></a>

###  external_virus_scan_url

**● external_virus_scan_url**: *`string`*

link to the virus scan results null if there is none

___
<a id="file_id"></a>

###  file_id

**● file_id**: *`number`*

___
<a id="file_name"></a>

###  file_name

**● file_name**: *`string`*

actual file name (derived from name with id and version appended)

___
<a id="is_primary"></a>

###  is_primary

**● is_primary**: *`boolean`*

whether this is the primary download for the mod (the one that users download through the link in the top right of the mod page)

___
<a id="md5"></a>

###  md5

**● md5**: *`string`*

___
<a id="mod_version"></a>

###  mod_version

**● mod_version**: *`string`*

version of the mod (at the time this was uploaded?)

___
<a id="name"></a>

###  name

**● name**: *`string`*

readable file name

___
<a id="size"></a>

###  size

**● size**: *`number`*

File size in bytes

___
<a id="uploaded_time"></a>

###  uploaded_time

**● uploaded_time**: *`string`*

readable representation of the file time

___
<a id="uploaded_timestamp"></a>

###  uploaded_timestamp

**● uploaded_timestamp**: *`number`*

unix timestamp of the time this file was uploaded

___
<a id="version"></a>

###  version

**● version**: *`string`*

File version (doesn't actually have to match any mod version)

___

