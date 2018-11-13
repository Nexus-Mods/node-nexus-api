[nexus-api](../README.md) > ["customErrors"](../modules/_customerrors_.md) > [HTTPError](../classes/_customerrors_.httperror.md)

# Class: HTTPError

Error thrown if an HTTP error is reported (HTTP code 4xx or 5xx)

## Hierarchy

 `Error`

**↳ HTTPError**

## Index

### Constructors

* [constructor](_customerrors_.httperror.md#constructor)

### Properties

* [message](_customerrors_.httperror.md#message)
* [name](_customerrors_.httperror.md#name)
* [stack](_customerrors_.httperror.md#stack)
* [Error](_customerrors_.httperror.md#error)

### Accessors

* [body](_customerrors_.httperror.md#body)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new HTTPError**(statusCode: *`number`*, message: *`string`*, body: *`string`*): [HTTPError](_customerrors_.httperror.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| statusCode | `number` |
| message | `string` |
| body | `string` |

**Returns:** [HTTPError](_customerrors_.httperror.md)

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

<a id="body"></a>

###  body

getbody(): `string`

**Returns:** `string`

___

