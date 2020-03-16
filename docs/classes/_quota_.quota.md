[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["Quota"](../modules/_quota_.md) › [Quota](_quota_.quota.md)

# Class: Quota

## Hierarchy

* **Quota**

## Index

### Constructors

* [constructor](_quota_.quota.md#constructor)

### Methods

* [block](_quota_.quota.md#block)
* [updateLimit](_quota_.quota.md#updatelimit)
* [wait](_quota_.quota.md#wait)

## Constructors

###  constructor

\+ **new Quota**(`init`: number, `max`: number, `msPerIncrement`: number): *[Quota](_quota_.quota.md)*

Defined in src/Quota.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`init` | number |
`max` | number |
`msPerIncrement` | number |

**Returns:** *[Quota](_quota_.quota.md)*

## Methods

###  block

▸ **block**(): *boolean*

Defined in src/Quota.ts:35

signal that the request was blocked by the server with an error code that
indicates client is sending too many requests
returns true if the rate limit is actually used up so we won't be able to
make requests for a while, false if it's likely a temporary problem.

**Returns:** *boolean*

___

###  updateLimit

▸ **updateLimit**(`limit`: number): *void*

Defined in src/Quota.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`limit` | number |

**Returns:** *void*

___

###  wait

▸ **wait**(): *Promise‹void›*

Defined in src/Quota.ts:47

**Returns:** *Promise‹void›*
