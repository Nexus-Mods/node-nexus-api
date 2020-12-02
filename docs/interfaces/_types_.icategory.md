[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["types"](../modules/_types_.md) › [ICategory](_types_.icategory.md)

# Interface: ICategory

Nexus Mods category

## Hierarchy

* **ICategory**

## Index

### Properties

* [category_id](_types_.icategory.md#category_id)
* [name](_types_.icategory.md#name)
* [parent_category](_types_.icategory.md#parent_category)

## Properties

###  category_id

• **category_id**: *number*

*Defined in [src/types.ts:280](https://github.com/Nexus-Mods/node-nexus-api/blob/3265db7/src/types.ts#L280)*

numerical id

___

###  name

• **name**: *string*

*Defined in [src/types.ts:284](https://github.com/Nexus-Mods/node-nexus-api/blob/3265db7/src/types.ts#L284)*

display name

___

###  parent_category

• **parent_category**: *number | false*

*Defined in [src/types.ts:292](https://github.com/Nexus-Mods/node-nexus-api/blob/3265db7/src/types.ts#L292)*

id of the parent category or false if it's a top-level
category.
Note: often there is only a single root category named after the game.
But in some cases there are additional roots, e.g. the game 'skyrim' has
the roots 'Skyrim' and 'Sure AI: Enderal'
