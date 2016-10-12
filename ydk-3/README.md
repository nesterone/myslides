###You Don't Know JS: Types & Grammar
#####types & grammar
inspired by [getify](https://github.com/getify/You-Dont-Know-JS/tree/master/types%20%26%20grammar)

### Presented by
* [Igor Nesterenko](https://twitter.com/nesterone)

### High-level Overview

* Types
* Values
* Natives
* Coercion
* Grammar


## Types

* What it's type ? Why does it matter ?
* Built-in Types
* Values as Types
* Review

### What it's type ? Why does it matter ?

* These two values have different types.
* There are many different ways that coercion can happen

### Built-in Types

* `null`
* `undefined`
* `boolean`
* `number`
* `string`
* `object`
* `symbol` -- added in ES6!

### The "typeof"

```js
typeof undefined     === "undefined"; // true
typeof true          === "boolean";   // true
typeof 42            === "number";    // true
typeof "42"          === "string";    // true
typeof { life: 42 }  === "object";    // true

// added in ES6!
typeof Symbol()      === "symbol";    // true
```

### "typeof" bug

`typeof null === "object"; // true`

### "Subtypes" of object

```js
typeof function a(){ /* .. */ } === "function"; // true, callable object
typeof [1,2,3] === "object"; // true

```

### Values as Types

In JavaScript, variables don't have types -- **values have types**


### `undefined` vs "undeclared"

In JavaScript, they're quite different

```js
var a;

typeof a; // "undefined"
typeof b; // "undefined", safety guard

a; // undefined
b; // ReferenceError: b is not defined

```


### `typeof` Undeclared

* feature detection 
* different JS environments
* different modes: development, production

```js

// this is a safe existence check
if (typeof DEBUG !== "undefined") {
	console.log( "Debugging is starting" );
}

// this is a safe existence check
if (typeof someApi !== "undefined"){
    simeApi.runIt();
}

```

### Review

* seven build-in types
* `undefined` and "undeclared" are different
* usage of `typeof` for safe existence check
