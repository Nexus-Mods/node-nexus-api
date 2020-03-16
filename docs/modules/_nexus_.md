[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["Nexus"](_nexus_.md)

# Module: "Nexus"

## Index

### Classes

* [Nexus](../classes/_nexus_.nexus.md)

### Interfaces

* [IRequestArgs](../interfaces/_nexus_.irequestargs.md)

### Type aliases

* [REST_METHOD](_nexus_.md#rest_method)

### Variables

* [format](_nexus_.md#format)
* [request](_nexus_.md#request)

### Functions

* [handleRestResult](_nexus_.md#handlerestresult)
* [rest](_nexus_.md#rest)
* [restGet](_nexus_.md#restget)
* [restPost](_nexus_.md#restpost)

## Type aliases

###  REST_METHOD

Ƭ **REST_METHOD**: *"DELETE" | "POST"*

Defined in src/Nexus.ts:12

## Variables

###  format

• **format**: *any*

Defined in src/Nexus.ts:9

___

###  request

• **request**: *RequestAPI‹Request‹›, CoreOptions, UriOptions | UrlOptions›*

Defined in src/Nexus.ts:8

## Functions

###  handleRestResult

▸ **handleRestResult**(`resolve`: any, `reject`: any, `url`: string, `error`: any, `response`: request.RequestResponse, `body`: any, `onUpdateLimit`: function): *any*

Defined in src/Nexus.ts:30

**Parameters:**

▪ **resolve**: *any*

▪ **reject**: *any*

▪ **url**: *string*

▪ **error**: *any*

▪ **response**: *request.RequestResponse*

▪ **body**: *any*

▪ **onUpdateLimit**: *function*

▸ (`daily`: number, `hourly`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`daily` | number |
`hourly` | number |

**Returns:** *any*

___

###  rest

▸ **rest**(`url`: string, `args`: [IRequestArgs](../interfaces/_nexus_.irequestargs.md), `onUpdateLimit`: function, `method?`: [REST_METHOD](_nexus_.md#rest_method)): *Promise‹any›*

Defined in src/Nexus.ts:138

**Parameters:**

▪ **url**: *string*

▪ **args**: *[IRequestArgs](../interfaces/_nexus_.irequestargs.md)*

▪ **onUpdateLimit**: *function*

▸ (`daily`: number, `hourly`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`daily` | number |
`hourly` | number |

▪`Optional`  **method**: *[REST_METHOD](_nexus_.md#rest_method)*

**Returns:** *Promise‹any›*

___

###  restGet

▸ **restGet**(`url`: string, `args`: [IRequestArgs](../interfaces/_nexus_.irequestargs.md), `onUpdateLimit`: function): *Promise‹any›*

Defined in src/Nexus.ts:90

**Parameters:**

▪ **url**: *string*

▪ **args**: *[IRequestArgs](../interfaces/_nexus_.irequestargs.md)*

▪ **onUpdateLimit**: *function*

▸ (`daily`: number, `hourly`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`daily` | number |
`hourly` | number |

**Returns:** *Promise‹any›*

___

###  restPost

▸ **restPost**(`method`: [REST_METHOD](_nexus_.md#rest_method), `url`: string, `args`: [IRequestArgs](../interfaces/_nexus_.irequestargs.md), `onUpdateLimit`: function): *Promise‹any›*

Defined in src/Nexus.ts:113

**Parameters:**

▪ **method**: *[REST_METHOD](_nexus_.md#rest_method)*

▪ **url**: *string*

▪ **args**: *[IRequestArgs](../interfaces/_nexus_.irequestargs.md)*

▪ **onUpdateLimit**: *function*

▸ (`daily`: number, `hourly`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`daily` | number |
`hourly` | number |

**Returns:** *Promise‹any›*
