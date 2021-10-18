[@nexusmods/nexus-api](../README.md) › [Globals](../globals.md) › ["customErrors"](../modules/_customerrors_.md) › [JwtExpiredError](_customerrors_.jwtexpirederror.md)

# Class: JwtExpiredError

Error thrown when the JWT has expired
You should not see this error in your application as a refresh is performed when encountering it

## Hierarchy

* [Error](_customerrors_.timeouterror.md#static-error)

  ↳ **JwtExpiredError**

## Index

### Constructors

* [constructor](_customerrors_.jwtexpirederror.md#constructor)

### Properties

* [message](_customerrors_.jwtexpirederror.md#message)
* [name](_customerrors_.jwtexpirederror.md#name)
* [stack](_customerrors_.jwtexpirederror.md#optional-stack)
* [Error](_customerrors_.jwtexpirederror.md#static-error)

## Constructors

###  constructor

\+ **new JwtExpiredError**(): *[JwtExpiredError](_customerrors_.jwtexpirederror.md)*

*Defined in [src/customErrors.ts:82](https://github.com/Nexus-Mods/node-nexus-api/blob/af3f187/src/customErrors.ts#L82)*

**Returns:** *[JwtExpiredError](_customerrors_.jwtexpirederror.md)*

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
