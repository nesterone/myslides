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

## Natives

* Internal `[[Class]]`
* Boxing Wrappers
* Unboxing
* Natives as Constructors
* Review

### List of Natives

* `String()`
* `Number()`
* `Boolean()`
* `Array()`
* `Object()`
* `Function()`
* `RegExp()`
* `Date()`
* `Error()`
* `Symbol()` -- added in ES6!

### Object wrappers around primitives

```js
var a = new String( "abc" );

typeof a; // "object" ... not "String"

a instanceof String; // true

Object.prototype.toString.call( a ); // "[object String]"
```

### Internal `[[Class]]`

Internal *class* classification rather than related to classes from traditional class-oriented coding

```js
Object.prototype.toString.call( [1,2,3] );			// "[object Array]"
Object.prototype.toString.call( /regex-literal/i );	// "[object RegExp]"

Object.prototype.toString.call( null );			// "[object Null]"
Object.prototype.toString.call( undefined );	// "[object Undefined]"

Object.prototype.toString.call( "abc" );	// "[object String]"
Object.prototype.toString.call( 42 );		// "[object Number]"
Object.prototype.toString.call( true );		// "[object Boolean]"
```

### Boxing Wrappers

```js
var a = "abc";

a.length; // 3
a.toUpperCase(); // "ABC"
```

It's better to just let the boxing happen implicitly where necessary


### Object Wrapper Gotchas 

```js
var a = new Boolean( false );

if (!a) {
   
	console.log( "Oops" ); // never runs
}
```

## Unboxing

```js
var a = new String( "abc" );
var b = new Number( 42 );
var c = new Boolean( true );

a.valueOf(); // "abc"
b.valueOf(); // 42
c.valueOf(); // true
```

Unboxing can also happen implicitly

## Natives as Constructors

* Arrays(..)
* `Object(..)`, `Function(..)`, and `RegExp(..)`
* `Date(..)` and `Error(..)`
* `Symbol(..)`


### Arrays(..)

```js
var a = new Array( 1, 2, 3 );
a; // [1, 2, 3]

var b = [1, 2, 3];
b; // [1, 2, 3]
```

### Sparse Arrays

```js

var a = new Array( 3 );

a.length; // 3
a;

var a = new Array( 3 ); // [ undefined x 3 ]
var b = [ undefined, undefined, undefined ];
var c = [];
c.length = 3;

a; // [ undefined x 3 ]
b; // [ undefined, undefined, undefined ]
c; // []

a.join( "-" ); // "--"
b.join( "-" ); // "--"

a.map(function(v,i){ return i; }); // [ undefined x 3 ]
b.map(function(v,i){ return i; }); // [ 0, 1, 2 ]

var a = Array.apply( null, { length: 3 } );
a; // [ undefined, undefined, undefined ]

```

### `Object(..)`, `Function(..)`, and `RegExp(..)`

```js
var c = new Object();
c.foo = "bar";
c; // { foo: "bar" }

var d = { foo: "bar" };
d; // { foo: "bar" }

var e = new Function( "a", "return a * 2;" );
var f = function(a) { return a * 2; };
function g(a) { return a * 2; }

var h = new RegExp( "^a*b+", "g" );
var i = /^a*b+/g;

var name = "Kyle";
//usage of constructor form
var namePattern = new RegExp( "\\b(?:" + name + ")+\\b", "ig" );

var matches = someText.match( namePattern );
```

Prefer literal form over `constructor`

### `Date(..)` and `Error(..)`

No literal form

```js
if (!Date.now) {
    //emulate ES5 feature
	Date.now = function(){
		return (new Date()).getTime();
	};
}

var currentDate = Date.now();
```

### `Symbol(..)`

```js
var mysym = Symbol( "my own symbol" );
mysym;				// Symbol(my own symbol)
mysym.toString();	// "Symbol(my own symbol)"
typeof mysym; 		// "symbol"

var a = { };
a[mysym] = "foobar";

Object.getOwnPropertySymbols( a );
// [ Symbol(my own symbol) ]
```

`Symbol`s are *not* `object`s, they are simple scalar primitives.

### Native Prototypes

Each of the built-in native constructors has its own `.prototype` object:

```js
// don't leave it that way, though, or expect weirdness!
// reset the `Array.prototype` to empty
Array.prototype.length = 0;
```

Override native prototype is a bad idea

## Review

1. JS provides object wrappers around primitive values
1. `"abc".length` automatically boxes value with object wrapper 


## Coercion

* Converting Values
* Abstract Value Operations
* Explicit Coercion
* Implicit Coercion
* Loose Equals vs. Strict Equals
* Abstract Relation Comparison
* Review

## Coercion

Our goal is to fully explore the pros and cons (yes, there *are* pros!) of coercion

## Converting Values

* "type casting"  in statically typed languages at compile time
* "type coercion" in runtime for dynamically typed languages
* "explicit" and "implicit" coercions are 'relative'

```js
var a = 42;

var b = a + "";			// implicit coercion

var c = String( a );	// explicit coercion
```


## Abstract Value Operations

* ToString
    * JSON Stringification
* ToNumber
* ToBoolean


## Abstract Value Operations

ES5 defines 6 several "abstract operations"

Let's pay attention to: 

ToString, ToNumber, ToBoolean and a bit in ToPrimitive

### ToString

```js

String(null);      //"null"
String(undefined); //"undefined"

// multiplying `1.07` by `1000`, seven times over
var a = 1.07 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000;

// seven times three digits => 21 digits
a.toString(); // "1.07e21"

var b = {};

console.log(b);  //  Object.prototype.toString() -> [object Object]

var arr = [1,2,3];

arr.toString(); // "1,2,3"

```

### JSON Stringification

1. `string`, `number`, `boolean` converted via `ToString` abstract operation.
2. `toJSON()` method is automatically called to (sort of) "coerce" the object to be *JSON-safe* before stringification.

### JSON-safe stringification

```js
var o = { };

var a = {
	b: 42,
	c: o,
	d: function(){}
};

// create a circular reference inside `a`
o.e = a;

// would throw an error on the circular reference
// JSON.stringify( a );

// define a custom JSON value serialization
a.toJSON = function() {
	// only include the `b` property for serialization
	return { b: this.b };
};

JSON.stringify( a ); // "{"b":42}"
```

### ToNumber

1. `true` -> 1, `false` -> 0
1. `string` -> `NaN`, if can't pars to `number`, treats '0' in the beginning of string as 8-base number
1.  Objects(and arrays) run `ToPrimitive` first
    * `ToPrimitive` search for `valueOf`, if not then `toString`, otherwise throws `TypeError`

### Override `valueOf`

```js
var a = {
	valueOf: function(){
		return "42";
	}
};

var b = {
	toString: function(){
		return "42";
	}
};

var c = [4,2];
c.toString = function(){
	return this.join( "" );	// "42"
};

Number( a );			// 42
Number( b );			// 42
Number( c );			// 42
Number( "" );			// 0
Number( [] );			// 0
Number( [ "abc" ] );	// NaN
```


### ToBoolean

Lots of confusions and misconceptions

* Falsy Values
* Falsy Objects

### Falsy Values

* `undefined`
* `null`
* `false`
* `+0`, `-0`, and `NaN`
* `""`

Everything else truthy

### Falsy Objects

```js

Boolean({});            // true
Boolean(document.all);  // false, WHAT!?

```

## Explicit Coercion

Make it clear and obvious that we converting value of one type to another type

* Explicitly: Strings <--> Numbers
* Explicitly: Parsing Numeric Strings
* Explicitly: * --> Boolean

### Explicitly: Strings <--> Numbers

1. `String` and `Number` functions without `new`
1. `toString()`
1. Unary operator +/-, however avoid their usage

```js
var a = 42;
var b = String( a );    // "42"

var c = "3.14";
var d = Number( c );    // 3.14

var a1 = 42;
var b1 = a.toString();  // "42"

var c1 = "3.14";
var d1 = +c;            // 3.14


var c = "3.14";
var d = 5+ +c;          // 8.14

1 + - + + + - + 1;	    // 2
```

### Data To number

Because data object coerced to timestamp

```js
var d = new Date( "Mon, 18 Aug 2014 08:53:06 CDT" );

+d; // 1408369986000

var timestamp = +new Date();
var timestamp1 = new Date().getTime();

if (!Date.now) {
    // emulate ES5 
	Date.now = function() {
		return +new Date();
	};
}

var timestamp2 = Date.new();
```

### The Curious Case of the ~

1. `~` aka "bitwise NOT"
2. Run `ToInt32`
1. `~x` is roughly the same as `-(x+1)`

```js
~42;	// -(42+1) ==> -43

var a = "Hello World";

~a.indexOf( "lo" );			// -4   <-- truthy!

if (~a.indexOf( "lo" )) {	// true
	// found it!
}

~a.indexOf( "ol" );			// 0    <-- falsy!
!~a.indexOf( "ol" );		// true

if (!~a.indexOf( "ol" )) {	// true
	// not found!
}

```

### Explicitly: Parsing Numeric Strings

1. Separate parsing from coercion
1. Never use non-string values with `parseInt`

```js
var a = "42";
var b = "42px";

Number( a );	// 42
parseInt( a );	// 42

Number( b );	// NaN
parseInt( b );	// 42

var obj = {
	num: 21,
	toString: function() { return String( this.num * 2 ); }
};

parseInt( obj ); // 42

parseInt( 1/0, 19 ); // 18
parseInt( 0.000008 );		// 0   ("0" from "0.000008")
parseInt( 0.0000008 );		// 8   ("8" from "8e-7")
parseInt( false, 16 );		// 250 ("fa" from "false")
parseInt( parseInt, 16 );	// 15  ("f" from "function..")
parseInt( "0x10" );			// 16
parseInt( "103", 2 );		// 2

```

### Explicitly: * --> Boolean

1. `Boolean` without `new`
1. `!!` double-negate operator

```js
var a = "0";
var b = [];
var c = {};

var d = "";
var e = 0;
var f = null;
var g;

Boolean( a ); // true
!!a;          // true
Boolean( b ); // true
!!b;          // true
Boolean( c ); // true
!!c;          // true

Boolean( d ); // false
!!d           // false
Boolean( e ); // false
!!e;          // false
Boolean( f ); // false
!!f;          // false
Boolean( g ); // false
!!g;
```

## Implicit Coercion

*Implicit* coercion refers to type conversions that are hidden

* Simplifying Implicitly
* Implicitly: Strings <--> Numbers
* Implicitly: Booleans --> Numbers
* Implicitly: * --> Boolean
* Operators `||` and `&&`
* Symbol Coercion

### Simplifying Implicitly 

Don't assume *implicit* coercion is ALL bad

```js
SomeType x = SomeType( AnotherType( y ) )

//over 

SomeType x = SomeType( y )

```


### Implicitly: Strings <--> Numbers

1. `number` to `string` with `a+b`, if object, then run `ToPrimitive`->`ToNumber`->`toString`
1. `string` to `number` with `a-b`, it runs  `ToNumber`


```js
var a = "42";
var b = "0";

var c = 42;
var d = 0;

a + b; // "420"
c + d; // 42

var a1 = [1,2];
var b1 = [3,4];

a1 + b1; // "1,23,4"

var a2 = 42;
var b2 = a2 + "";

b2; // "42"

var a3 = {
	valueOf: function() { return 42; },
	toString: function() { return 4; }
};

a3 + "";			// "42"

String( a3 );	// "4"

var a4 = "3.14";
var b4 = a - 0;

b4; // 3.14

```

### Implicitly: Booleans --> Numbers

```js
function onlyOne() {
	var sum = 0;
	for (var i=0; i < arguments.length; i++) {
		// skip falsy values. same as treating
		// them as 0's, but avoids NaN's.
		if (arguments[i]) {
			sum += arguments[i]; // sum += Number(Boolean(arguments[i]));
		}
	}
	return sum == 1;
}

var a = true;
var b = false;

onlyOne( b, a );				// true
onlyOne( b, a, b, b, b );		// true

onlyOne( b, b );				// false
onlyOne( b, a, b, b, b, a );	// false
```

### Implicitly: * --> Boolean

1. The test expression in an `if (..)` statement.
2. The test expression (second clause) in a `for ( .. ; .. ; .. )` header.
3. The test expression in `while (..)` and `do..while(..)` loops.
4. The test expression (first clause) in `? :` ternary expressions.
5. The left-hand operand (which serves as a test expression -- see below!) to the `||` ("logical or") and `&&` ("logical and") operators.

```js
var a = 42;
var b = "abc";
var c;
var d = null;

if (a) {
	console.log( "yep" );		// yep
}

while (c) {
	console.log( "nope, never runs" );
}

c = d ? a : b;
c;								// "abc"

if ((a && d) || c) {
	console.log( "yep" );		// yep
}
```



### Operators `||` and `&&`

Select one of the two operand's values

```js
var a = 42;
var b = "abc";
var c = null;

a || b;		// 42
a && b;		// "abc"

c || b;		// "abc"
c && b;		// null

a || b;
// roughly equivalent to:
a ? a : b;

a && b;
// roughly equivalent to:
a ? b : a;



```

### Backup Defaults

```js
function foo(a,b) {
	a = a || "hello";
	b = b || "world";

	console.log( a + " " + b );
}

foo();					// "hello world"
foo( "yeah", "yeah!" );	// "yeah yeah!"

foo( "That's it!", "" ); // "That's it! world" <-- Oops!
```

### Guard Operator

```js
function foo() {
	console.log( a );
}

var a = 42;

a && foo(); // 42
```

### Compare Implicit and Explicit

```js

var a = 42;
var b = null;
var c = "foo";

if (a && (b || c)) {
	console.log( "yep" );
}

//or

if (!!a && (!!b || !!c)) {
	console.log( "yep" );
}

//or

if (Boolean(a) && (Boolean(b) || Boolean(c))) {
	console.log( "yep" );
}

```

### Symbol Coercion

Exceedingly rare for you to need to coerce a `symbol` value

```js
var s1 = Symbol( "cool" );
String( s1 );					// "Symbol(cool)"

var s2 = Symbol( "not cool" );
s2 + "";						// TypeError
```

## Loose Equals vs. Strict Equals

1. '==' allows coercion
1. '===' disallow coercion

* Abstract Equality
* Edge Cases



### Abstract Equality

if the two values being compared are of the same type, they are simply and naturally compared via Identity

* `NaN` is never equal to itself
* `+0` and `-0` are equal to each other

For objects(arrays, functions) references point to *the exact same value*

### Comparing: `string`s to `number`s

1. x == ToNumber(y)
1. ToNumber(x) == y

```js
var a = 42;
var b = "42";

a === b;	// false
a == b;		// true
```

### Comparing: anything to `boolean`

1. x == ToNumber(y)
1. ToNumber(x) == y

**It is not performing a boolean test/coercion** at all

```js
var a = "42";
var b = true;

a == b;    // false

42 == 1;   // false

```

Avoid '==' with `true` and `false`, however `===` is ok

### Comparing: `null`s to `undefined`s

1. If x is null and y is undefined, return true.
1. If x is undefined and y is null, return true.


```js
var a = null;
var b;

a == b;		// true
a == null;	// true
b == null;	// true

a == false;	// false
b == false;	// false
a == "";	// false
b == "";	// false
a == 0;		// false
b == 0;		// false
```

### Comparing: `object`s to non-`object`s

1. x == ToPrimitive(y)
1. ToPrimitive(x) == y

```js
var a = 42;
var b = [ 42 ];

a == b;	// true

42 == "42"; //true

```

### Edge Cases

Examined how the *implicit* coercion of `==` loose equality works

###  A Number By Any Other Value Would...

```js
var i = 2;

Number.prototype.valueOf = function() {
	return i++; // an evil trick
};

var a = new Number( 42 );

if (a == 2 && a == 3) {
	console.log( "Yep, this happened." );
}
```


### False-y Comparisons

```js
"0" == null;			// false
"0" == undefined;		// false
"0" == false;			// true -- UH OH!
"0" == NaN;				// false
"0" == 0;				// true
"0" == "";				// false

false == null;			// false
false == undefined;		// false
false == NaN;			// false
false == 0;				// true -- UH OH!
false == "";			// true -- UH OH!
false == [];			// true -- UH OH!
false == {};			// false

"" == null;				// false
"" == undefined;		// false
"" == NaN;				// false
"" == 0;				// true -- UH OH!
"" == [];				// true -- UH OH!
"" == {};				// false

0 == null;				// false
0 == undefined;			// false
0 == NaN;				// false
0 == [];				// true -- UH OH!
0 == {};				// false
```


### The Crazy Ones

```js
[] == ![];		// true
[] == false;    // true

2 == [2];       // true
"" == [null]    // true

0 == "\n";		// true

```

### Reasonable examples


```js
42 == "43";							// false
"foo" == 42;						// false
"true" == true;						// false

42 == "42";							// true
"foo" == [ "foo" ];					// true
```

### Sanity Check

```js

"0" == false;			// true -- UH OH!
false == 0;				// true -- UH OH!
false == "";			// true -- UH OH!
false == [];			// true -- UH OH!


"" == 0;				// true -- UH OH!
"" == [];				// true -- UH OH!
0 == [];				// true -- UH OH!
```

1. If either side of the comparison can have `true` or `false` values, don't ever, EVER use `==`.
2. If either side of the comparison can have `[]`, `""`, or `0` values, seriously consider not using `==`.

### JavaScript Equality Table

https://github.com/dorey/JavaScript-Equality-Table


## Abstract Relational Comparison
