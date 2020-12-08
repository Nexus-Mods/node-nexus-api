[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["customErrors"](../modules/_customerrors_.md) › [HTTPError](_customerrors_.httperror.md)

# Class: HTTPError

Error thrown if an HTTP error is reported (HTTP code 4xx or 5xx)

## Hierarchy

* [Error](_customerrors_.timeouterror.md#static-error)

  ↳ **HTTPError**

## Index

### Constructors

* [constructor](_customerrors_.httperror.md#constructor)

### Properties

* [message](_customerrors_.httperror.md#message)
* [name](_customerrors_.httperror.md#name)
* [stack](_customerrors_.httperror.md#optional-stack)
* [Error](_customerrors_.httperror.md#static-error)

### Accessors

* [body](_customerrors_.httperror.md#body)

## Constructors

###  constructor

\+ **new HTTPError**(`statusCode`: number, `message`: string, `body`: string): *[HTTPError](_customerrors_.httperror.md)*

*Defined in [src/customErrors.ts:36](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/customErrors.ts#L36)*

**Parameters:**

Name | Type |
------ | ------ |
`statusCode` | number |
`message` | string |
`body` | string |

**Returns:** *[HTTPError](_customerrors_.httperror.md)*

## Properties

###  message

• **message**: *string*

*Inherited from [TimeoutError](_customerrors_.timeouterror.md).[message](_customerrors_.timeouterror.md#message)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:974

___

###  name

• **name**: *string*

*Inherited from [TimeoutError](_customerrors_.timeouterror.md).[name](_customerrors_.timeouterror.md#name)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:973

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [TimeoutError](_customerrors_.timeouterror.md).[stack](_customerrors_.timeouterror.md#optional-stack)*

*Overrides [TimeoutError](_customerrors_.timeouterror.md).[stack](_customerrors_.timeouterror.md#optional-stack)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:975

___

### `Static` Error

▪ **Error**: *ErrorConstructor*

Defined in node_modules/typescript/lib/lib.es5.d.ts:984

## Accessors

###  body

• **get body**(): *string*

*Defined in [src/customErrors.ts:42](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/customErrors.ts#L42)*

**Returns:** *string*
