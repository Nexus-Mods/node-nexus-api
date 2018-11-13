[nexus-api](../README.md) > ["types"](../modules/_types_.md) > [IFileInfo](../interfaces/_types_.ifileinfo.md)

# Interface: IFileInfo

Information about a specific mod file

## Hierarchy

**IFileInfo**

## Index

### Properties

* [category_id](_types_.ifileinfo.md#category_id)
* [category_name](_types_.ifileinfo.md#category_name)
* [changelog_html](_types_.ifileinfo.md#changelog_html)
* [external_virus_scan_url](_types_.ifileinfo.md#external_virus_scan_url)
* [file_id](_types_.ifileinfo.md#file_id)
* [file_name](_types_.ifileinfo.md#file_name)
* [is_primary](_types_.ifileinfo.md#is_primary)
* [mod_version](_types_.ifileinfo.md#mod_version)
* [name](_types_.ifileinfo.md#name)
* [size](_types_.ifileinfo.md#size)
* [uploaded_time](_types_.ifileinfo.md#uploaded_time)
* [uploaded_timestamp](_types_.ifileinfo.md#uploaded_timestamp)
* [version](_types_.ifileinfo.md#version)

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

html encoded changelog (matched via file version)

___
<a id="external_virus_scan_url"></a>

###  external_virus_scan_url

**● external_virus_scan_url**: *`string`*

link to the virus scan results

___
<a id="file_id"></a>

###  file_id

**● file_id**: *`number`*

file id

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

