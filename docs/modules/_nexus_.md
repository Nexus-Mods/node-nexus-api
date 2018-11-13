[nexus-api](../README.md) > ["Nexus"](../modules/_nexus_.md)

# External module: "Nexus"

## Index

### Classes

* [Nexus](../classes/_nexus_.nexus.md)

### Interfaces

* [IRequestArgs](../interfaces/_nexus_.irequestargs.md)

### Functions

* [handleRestResult](_nexus_.md#handlerestresult)
* [rest](_nexus_.md#rest)
* [restGet](_nexus_.md#restget)
* [restPost](_nexus_.md#restpost)

---

## Functions

<a id="handlerestresult"></a>

###  handleRestResult

▸ **handleRestResult**(resolve: *`any`*, reject: *`any`*, url: *`string`*, error: *`any`*, response: *`request.RequestResponse`*, body: *`any`*): `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| resolve | `any` |
| reject | `any` |
| url | `string` |
| error | `any` |
| response | `request.RequestResponse` |
| body | `any` |

**Returns:** `any`

___
<a id="rest"></a>

###  rest

▸ **rest**(url: *`string`*, args: *[IRequestArgs](../interfaces/_nexus_.irequestargs.md)*): `Promise`<`any`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| url | `string` |
| args | [IRequestArgs](../interfaces/_nexus_.irequestargs.md) |

**Returns:** `Promise`<`any`>

___
<a id="restget"></a>

###  restGet

▸ **restGet**(url: *`string`*, args: *[IRequestArgs](../interfaces/_nexus_.irequestargs.md)*): `Promise`<`any`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| url | `string` |
| args | [IRequestArgs](../interfaces/_nexus_.irequestargs.md) |

**Returns:** `Promise`<`any`>

___
<a id="restpost"></a>

###  restPost

▸ **restPost**(url: *`string`*, args: *[IRequestArgs](../interfaces/_nexus_.irequestargs.md)*): `Promise`<`any`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| url | `string` |
| args | [IRequestArgs](../interfaces/_nexus_.irequestargs.md) |

**Returns:** `Promise`<`any`>

___

