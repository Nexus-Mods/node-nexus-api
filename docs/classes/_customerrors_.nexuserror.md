[@nexusmods/nexus-api](../README.md) > ["customErrors"](../modules/_customerrors_.md) > [NexusError](../classes/_customerrors_.nexuserror.md)

# Class: NexusError

Error reported by the nexus api

## Hierarchy

 `Error`

**↳ NexusError**

## Index

### Constructors

* [constructor](_customerrors_.nexuserror.md#constructor)

### Properties

* [message](_customerrors_.nexuserror.md#message)
* [name](_customerrors_.nexuserror.md#name)
* [stack](_customerrors_.nexuserror.md#stack)
* [Error](_customerrors_.nexuserror.md#error)

### Accessors

* [request](_customerrors_.nexuserror.md#request)
* [statusCode](_customerrors_.nexuserror.md#statuscode)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new NexusError**(message: *`string`*, statusCode: *`number`*, url: *`string`*): [NexusError](_customerrors_.nexuserror.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | `string` |
| statusCode | `number` |
| url | `string` |

**Returns:** [NexusError](_customerrors_.nexuserror.md)

___

## Properties

<a id="message"></a>

###  message

**● message**: *`string`*

___
<a id="name"></a>

###  name

**● name**: *`string`*

___
<a id="stack"></a>

### `<Optional>` stack

**● stack**: *`string`*

___
<a id="error"></a>

### `<Static>` Error

**● Error**: *`ErrorConstructor`*

___

## Accessors

<a id="request"></a>

###  request

**get request**(): `string`

**Returns:** `string`

___
<a id="statuscode"></a>

###  statusCode

**get statusCode**(): `number`

**Returns:** `number`

___

