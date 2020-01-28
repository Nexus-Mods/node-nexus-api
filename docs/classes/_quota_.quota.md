[@nexusmods/nexus-api](../README.md) > ["Quota"](../modules/_quota_.md) > [Quota](../classes/_quota_.quota.md)

# Class: Quota

## Hierarchy

**Quota**

## Index

### Constructors

* [constructor](_quota_.quota.md#constructor)

### Methods

* [block](_quota_.quota.md#block)
* [updateLimit](_quota_.quota.md#updatelimit)
* [wait](_quota_.quota.md#wait)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Quota**(init: *`number`*, max: *`number`*, msPerIncrement: *`number`*): [Quota](_quota_.quota.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| init | `number` |
| max | `number` |
| msPerIncrement | `number` |

**Returns:** [Quota](_quota_.quota.md)

___

## Methods

<a id="block"></a>

###  block

▸ **block**(): `boolean`

signal that the request was blocked by the server with an error code that indicates client is sending too many requests returns true if the rate limit is actually used up so we won't be able to make requests for a while, false if it's likely a temporary problem.

**Returns:** `boolean`

___
<a id="updatelimit"></a>

###  updateLimit

▸ **updateLimit**(limit: *`number`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| limit | `number` |

**Returns:** `void`

___
<a id="wait"></a>

###  wait

▸ **wait**(): `Promise`<`void`>

**Returns:** `Promise`<`void`>

___

