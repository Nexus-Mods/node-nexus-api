[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["customErrors"](../modules/_customerrors_.md) › [RateLimitError](_customerrors_.ratelimiterror.md)

# Class: RateLimitError

Error thrown when too many requests were made to the api
You should not see this error in your application as it is handled internally

## Hierarchy

* [Error](_customerrors_.timeouterror.md#static-error)

  ↳ **RateLimitError**

## Index

### Constructors

* [constructor](_customerrors_.ratelimiterror.md#constructor)

### Properties

* [message](_customerrors_.ratelimiterror.md#message)
* [name](_customerrors_.ratelimiterror.md#name)
* [stack](_customerrors_.ratelimiterror.md#optional-stack)
* [Error](_customerrors_.ratelimiterror.md#static-error)

## Constructors

###  constructor

\+ **new RateLimitError**(): *[RateLimitError](_customerrors_.ratelimiterror.md)*

*Defined in [src/customErrors.ts:25](https://github.com/Nexus-Mods/node-nexus-api/blob/master/src/customErrors.ts#L25)*

**Returns:** *[RateLimitError](_customerrors_.ratelimiterror.md)*

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
