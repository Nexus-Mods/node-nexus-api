[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["types"](../modules/_types_.md) › [IFileUpdate](_types_.ifileupdate.md)

# Interface: IFileUpdate

details about a file update
These exist only if the author sets the field "this file is
a newer version of ...".

## Hierarchy

* **IFileUpdate**

## Index

### Properties

* [new_file_id](_types_.ifileupdate.md#new_file_id)
* [new_file_name](_types_.ifileupdate.md#new_file_name)
* [old_file_id](_types_.ifileupdate.md#old_file_id)
* [old_file_name](_types_.ifileupdate.md#old_file_name)
* [uploaded_time](_types_.ifileupdate.md#uploaded_time)
* [uploaded_timestamp](_types_.ifileupdate.md#uploaded_timestamp)

## Properties

###  new_file_id

• **new_file_id**: *number*

*Defined in [src/types.ts:258](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L258)*

id of the new file

___

###  new_file_name

• **new_file_name**: *string*

*Defined in [src/types.ts:262](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L262)*

name of the new file

___

###  old_file_id

• **old_file_id**: *number*

*Defined in [src/types.ts:266](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L266)*

id of the old file

___

###  old_file_name

• **old_file_name**: *string*

*Defined in [src/types.ts:270](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L270)*

name of the old file

___

###  uploaded_time

• **uploaded_time**: *string*

*Defined in [src/types.ts:274](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L274)*

readable upload time of the new file

___

###  uploaded_timestamp

• **uploaded_timestamp**: *number*

*Defined in [src/types.ts:278](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/types.ts#L278)*

unix timestamp of when the new file was uploaded
