[@nexusmods/nexus-api](../README.md) > ["types"](../modules/_types_.md) > [ICategory](../interfaces/_types_.icategory.md)

# Interface: ICategory

Nexus Mods category

## Hierarchy

**ICategory**

## Index

### Properties

* [category_id](_types_.icategory.md#category_id)
* [name](_types_.icategory.md#name)
* [parent_category](_types_.icategory.md#parent_category)

---

## Properties

<a id="category_id"></a>

###  category_id

**● category_id**: *`number`*

numerical id

___
<a id="name"></a>

###  name

**● name**: *`string`*

display name

___
<a id="parent_category"></a>

###  parent_category

**● parent_category**: *`number` \| `false`*

id of the parent category or false if it's a top-level category. Note: often there is only a single root category named after the game. But in some cases there are additional roots, e.g. the game 'skyrim' has the roots 'Skyrim' and 'Sure AI: Enderal'

___

