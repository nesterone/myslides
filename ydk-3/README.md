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

## Values

* Arrays
* Strings
* Numbers
* Special Values
* Values vs. Reference
* Review

## Arrays

* Arrays
* Array-Likes

### Arrays

```js

var a = [ 1, "2", [3] ];

a.length;		// 3
a[0] === 1;		// true
a[2][0] === 3;	// true

a.length;	// 0

a[0] = 1;
a[1] = "2";
a[2] = [ 3 ];

a.length;	// 3

```

### "Sparse" Arrays

```js
var a = [ ];

a[0] = 1;
// no `a[1]` slot set here
a[2] = [ 3 ];

a[1];		// undefined

a.length;	// 3
```

### String ad Index

```js
var a = [ ];

a["13"] = 42; // coersion from string to number

a.length; // 14
```

use number for index

### Array-Likes

* 'arguments' in function
* some of DOM elements (NodesList)

```js
function foo() {
	var arr = Array.prototype.slice.call( arguments );
	arr.push( "bam" );
	console.log( arr );
}

foo( "bar", "baz" ); // ["bar","baz","bam"]

// in ES6

var arr = Array.from( arguments );

```

### String

* Arrays and Strings Similarities
* Arrays and String Differences
* Reuse of Methods from Arrays

### Arrays and Strings Similarities


```js
var a = "foo";
var b = ["f","o","o"];

a.length;							// 3
b.length;							// 3

a.indexOf( "o" );					// 1
b.indexOf( "o" );					// 1

var c = a.concat( "bar" );			// "foobar"
var d = b.concat( ["b","a","r"] );	// ["f","o","o","b","a","r"]

a === c;							// false
b === d;							// false

a;									// "foo"
b;									// ["f","o","o"]

```

### Strings are immutable

```js
a[1] = "O";
b[1] = "O";

a; // "foo"
b; // ["f","O","o"];

c = a.toUpperCase();
a === c;	// false
a;			// "foo"
c;			// "FOO"

b.push( "!" );
b;			// ["f","O","o","!"]

```

### Reuse of Methods from Arrays

* "borrow" non-mutation array methods 

```js
a.join;			// undefined
a.map;			// undefined

var c = Array.prototype.join.call( a, "-" );
var d = Array.prototype.map.call( a, function(v){
	return v.toUpperCase() + ".";
} ).join( "" );

c;				// "f-o-o"
d;				// "F.O.O."
```
