[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["customErrors"](../modules/_customerrors_.md) › [NexusError](_customerrors_.nexuserror.md)

# Class: NexusError

Error reported by the nexus api

## Hierarchy

* [Error](_customerrors_.timeouterror.md#static-error)

  ↳ **NexusError**

## Index

### Constructors

* [constructor](_customerrors_.nexuserror.md#constructor)

### Properties

* [message](_customerrors_.nexuserror.md#message)
* [name](_customerrors_.nexuserror.md#name)
* [stack](_customerrors_.nexuserror.md#optional-stack)
* [Error](_customerrors_.nexuserror.md#static-error)

### Accessors

* [request](_customerrors_.nexuserror.md#request)
* [statusCode](_customerrors_.nexuserror.md#statuscode)

## Constructors

###  constructor

\+ **new NexusError**(`message`: string, `statusCode`: number, `url`: string): *[NexusError](_customerrors_.nexuserror.md)*

*Defined in [src/customErrors.ts:52](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/customErrors.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`statusCode` | number |
`url` | string |

**Returns:** *[NexusError](_customerrors_.nexuserror.md)*

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

###  request

• **get request**(): *string*

*Defined in [src/customErrors.ts:63](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/customErrors.ts#L63)*

**Returns:** *string*

___

###  statusCode

• **get statusCode**(): *number*

*Defined in [src/customErrors.ts:59](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/customErrors.ts#L59)*

**Returns:** *number*
