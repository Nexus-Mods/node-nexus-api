[@nexusmods/nexus-api](../README.md) > ["Nexus"](../modules/_nexus_.md)

# External module: "Nexus"

## Index

### Classes

* [Nexus](../classes/_nexus_.nexus.md)

### Interfaces

* [IRequestArgs](../interfaces/_nexus_.irequestargs.md)

### Type aliases

* [REST_METHOD](_nexus_.md#rest_method)

### Functions

* [handleRestResult](_nexus_.md#handlerestresult)
* [rest](_nexus_.md#rest)
* [restGet](_nexus_.md#restget)
* [restPost](_nexus_.md#restpost)

---

## Type aliases

<a id="rest_method"></a>

###  REST_METHOD

**Ƭ REST_METHOD**: *"DELETE" \| "POST"*

___

## Functions

<a id="handlerestresult"></a>

###  handleRestResult

▸ **handleRestResult**(resolve: *`any`*, reject: *`any`*, url: *`string`*, error: *`any`*, response: *`request.RequestResponse`*, body: *`any`*, onUpdateLimit: *`function`*): `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| resolve | `any` |
| reject | `any` |
| url | `string` |
| error | `any` |
| response | `request.RequestResponse` |
| body | `any` |
| onUpdateLimit | `function` |

**Returns:** `any`

___
<a id="rest"></a>

###  rest

▸ **rest**(url: *`string`*, args: *[IRequestArgs](../interfaces/_nexus_.irequestargs.md)*, onUpdateLimit: *`function`*, method?: *[REST_METHOD](_nexus_.md#rest_method)*): `Promise`<`any`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| url | `string` |
| args | [IRequestArgs](../interfaces/_nexus_.irequestargs.md) |
| onUpdateLimit | `function` |
| `Optional` method | [REST_METHOD](_nexus_.md#rest_method) |

**Returns:** `Promise`<`any`>

___
<a id="restget"></a>

###  restGet

▸ **restGet**(url: *`string`*, args: *[IRequestArgs](../interfaces/_nexus_.irequestargs.md)*, onUpdateLimit: *`function`*): `Promise`<`any`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| url | `string` |
| args | [IRequestArgs](../interfaces/_nexus_.irequestargs.md) |
| onUpdateLimit | `function` |

**Returns:** `Promise`<`any`>

___
<a id="restpost"></a>

###  restPost

▸ **restPost**(method: *[REST_METHOD](_nexus_.md#rest_method)*, url: *`string`*, args: *[IRequestArgs](../interfaces/_nexus_.irequestargs.md)*, onUpdateLimit: *`function`*): `Promise`<`any`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| method | [REST_METHOD](_nexus_.md#rest_method) |
| url | `string` |
| args | [IRequestArgs](../interfaces/_nexus_.irequestargs.md) |
| onUpdateLimit | `function` |

**Returns:** `Promise`<`any`>

___

