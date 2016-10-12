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

## Numbers

* Numeric Syntax
* Small Decimal Values
* Safe Integer Ranges
* Testing for Integers
* 32-bit (Signed) Integers

### Numbers

In JS we have only Numbers. "IEEE 754" standard, often called "floating-point."

### Numeric Syntax

```js
var a = 42;     // base-10 decimal literals
var b = 42.3;
var c1 = 0.3;   
var c2 = .3;    // valid
var d1 = 42.0
var d2 = 42.    // valid

```

### Exponent Form

```js
var a = 5E10;
a;					// 50000000000
a.toExponential();	// "5e+10"

var b = a * a;      // very large numbers
b;					// 2.5e+21

var c = 1 / a;
c;					// 2e-11
```

### Fixed and Precision

```js
var a = 42.59;

a.toFixed( 0 ); // "43"
a.toFixed( 1 ); // "42.6"
a.toFixed( 2 ); // "42.59"
a.toFixed( 3 ); // "42.590"
a.toFixed( 4 ); // "42.5900"

a.toPrecision( 1 ); // "4e+1"
a.toPrecision( 2 ); // "43"
a.toPrecision( 3 ); // "42.6"
a.toPrecision( 4 ); // "42.59"
a.toPrecision( 5 ); // "42.590"
a.toPrecision( 6 ); // "42.5900"
```


### Other Bases

```js
0xf3; // hexadecimal for: 243
0Xf3; // ditto

0363; // octal for: 243, doesn't allowed in strict mode

//ES 6
0o363;		// octal for: 243
0O363;		// or

0b11110011;	// binary for: 243
0B11110011; // or

```

### Small Decimal Values

* all languages based on "IEEE 754"

```js
0.1 + 0.2 === 0.3; // false
```


### Compare Small Decimal Values

```js
if (!Number.EPSILON) {
    //emulate ES6
	Number.EPSILON = Math.pow(2,-52);
}

function numbersCloseEnoughToEqual(n1,n2) {
	return Math.abs( n1 - n2 ) < Number.EPSILON;
}

var a = 0.1 + 0.2;
var b = 0.3;

numbersCloseEnoughToEqual( a, b );					// true
numbersCloseEnoughToEqual( 0.0000001, 0.0000002 );	// fals

```

### Safe Integer Ranges

* Number.MAX_VALUE and Number.MIN_VALUE - not quite useful
* ES6 Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER
* Big numbers may get official support soon


### Testing for Integers

```js
if (!Number.isInteger) {
    //emulate ES6
	Number.isInteger = function(num) {
		return typeof num == "number" && num % 1 == 0;
	};
}

Number.isInteger( 42 );		// true
Number.isInteger( 42.000 );	// true
Number.isInteger( 42.3 );	// false

```


### 32-bit (Signed) Integers

* 64-bit Floating Point
* bitwise operation only in 32-bit


## Special Values

* The Non-value Values
* Undefined
* Special Numbers
* Special Equality

### The Non-value Values

* `null` is an empty value
* `undefined` is a missing value

Or:

* `undefined` hasn't had a value yet
* `null` had a value and doesn't anymore


### Undefined

```js

function foo() {
	undefined = 2; // really bad idea!
}

foo();
```

### Undefined

```js

function foo() {
	"use strict";
	undefined = 2; // TypeError!
}

foo();

```

### Undefined

```js

function foo() {
	"use strict";
	var undefined = 2;
	console.log( undefined ); // 2
}

foo();
```
**Friends don't let friends override `undefined`.** Ever.


###`void` Operator

The expression `void ___` "voids" out any value (undefined)

```js
function doSomething() {
	// note: `APP.ready` is provided by our application
	if (!APP.ready) {
		// try again later
		return void setTimeout( doSomething, 100 );
	}

	var result;

	// do some other stuff
	return result;
}

// were we able to do it right away?
if (doSomething()) {
	// handle next tasks right away
}
```
### Special Numbers

The `number` type includes several special values. We'll take a look at each in detail.

### The Not Number, Number

`NaN` literally stands for "not a `number`"

```js
var a = 2 / "foo";		// NaN

typeof a === "number";	// true

a == NaN;	// false
a === NaN;	// false
```

### 19 years `isNaN` bug


```js
var a = 2 / "foo";
var b = "foo";

a; // NaN
b; // "foo"

window.isNaN( a ); // true
window.isNaN( b ); // true -- ouch!

if (!Number.isNaN) {
    // emulate ES6
	Number.isNaN = function(n) {
		return (
			typeof n === "number" &&
			window.isNaN( n )
		);
	};
}

var a = 2 / "foo";
var b = "foo";

Number.isNaN( a ); // true
Number.isNaN( b ); // false -- phew!

```

### Infinities

```js
var a = 1 / 0;	// Infinity, yep not an error
var b = -1 / 0;	// -Infinity

var a = Number.MAX_VALUE;	// 1.7976931348623157e+308
a + a;						// Infinity
a + Math.pow( 2, 970 );		// Infinity
a + Math.pow( 2, 969 );		// 1.7976931348623157e+308

```

### Zeros

```js
var a = 0 / -3; // -0
var b = 0 * -3; // -0

var a = 0 / -3;

// (some browser) consoles at least get it right
a;							// -0

// but the spec insists on lying to you!
a.toString();				// "0"
a + "";						// "0"
String( a );				// "0"

// strangely, even JSON gets in on the deception
JSON.stringify( a );		// "0"

-0 == 0;	// true
+0 == 0;   // true
-0 === 0;	// true
+0 === 0;   // true

```

### Distinguish Zeros


```js
function isNegZero(n) {
	n = Number( n );
	return (n === 0) && (1 / n === -Infinity);
}

isNegZero( -0 );		// true
isNegZero( 0 / -3 );	// true
isNegZero( 0 );			// false
```


### Special Equality (for tricky cases)

```js
if (!Object.is) {
    // emulate ES6
	Object.is = function(v1, v2) {
		// test for `-0`
		if (v1 === 0 && v2 === 0) {
			return 1 / v1 === 1 / v2;
		}
		// test for `NaN`
		if (v1 !== v1) {
			return v2 !== v2;
		}
		// everything else
		return v1 === v2;
	};
}

var a = 2 / "foo";
var b = -3 * 0;

Object.is( a, NaN );	// true
Object.is( b, -0 );		// true

Object.is( b, 0 );		// false

```

## Value vs. Reference

In JavaScript, there are no pointers

### Value Copy

```js
var a = 2;
var b = a; // `b` is always a copy of the value in `a`
b++;
a; // 2
b; // 3
```

All simple values: `null`, `undefined`, `string`, `number`, `boolean`, and ES6's `symbol`.

### Reference Copy

```js
var c = [1,2,3];
var d = c; // `d` is a reference to the shared `[1,2,3]` value
d.push( 4 );
c; // [1,2,3,4]
d; // [1,2,3,4]
```

For Objects

### Common Confusions With Function Parameters

```js
function foo(x) {
	x.push( 4 );
	x; // [1,2,3,4]

	// later
	x = [4,5,6];
	x.push( 7 );
	x; // [4,5,6,7]
}

var a = [1,2,3];

foo( a );

a; // [1,2,3,4]  not  [4,5,6,7]
```

### Common Confusions With Function Parameters

```js
function foo(x) {
	x = x + 1;
	x; // 3
}

var a = 2;
var b = new Number( a ); // or equivalently `Object(a)`

foo( b );
console.log( b ); // 2, not 3
```
primitive value is *not mutable*, even boxed (wrapped in an object)

## Review 

1. `array`s are simply numerically indexed collections of any value-type
1. Numbers in JavaScript include both "integers" and floating-point values
1. The `null` type has just one value: `null`
1. `undefined` is basically the default value
1. `void` operator lets you create the `undefined` value from any other value
1. `number`s include several special values, like `NaN`, `+Infinity`, `-Infinity`, `-0`
1. Simple values assigned/passed by `value-copy`
1. Compound values assigned/passed by `reference-copy`
