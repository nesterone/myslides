###You Don't Know JS:  ES6 & Beyond
#####es6 & beyond
inspired by [getify](https://github.com/getify/You-Dont-Know-JS/tree/master/async%20%26%20performance)

### Presented by
* [Igor Nesterenko](https://twitter.com/nesterone)

## High-level Overview

* Syntax
* Organization
* Async Flow Control
* Collections
* API Additions
* Meta Programming
* Beyond ES6


## Syntax

* Block-Scoped Declarations
* Spread/Rest
* Default Parameter Values
* Destructuring
* Object Literal Extensions
* Template Literals
* Arrow Functions
* `for..of` Loops
* Regular Expressions
* Number Literal Extensions
* Symbols
* Review



## Block-Scoped Declarations

Before

```js
var a = 2;

(function IIFE(){
	var a = 3;
	console.log( a );	// 3
})();

console.log( a );		// 2

```

### `let` Declarations

```js
var a = 2;

{
	let a = 3;
	console.log( a );	// 3
}

console.log( a );		// 2

```

### Temporal Dead Zone (TDZ)

```js
{
	console.log( a );	// undefined
	console.log( b );	// ReferenceError!

	var a;
	let b;
}
```

### `typeof` gotcha

```js
{
	// `a` is not declared
	if (typeof a === "undefined") {
		console.log( "cool" );
	}

	// `b` is declared, but in its TDZ
	if (typeof b === "undefined") {		// ReferenceError!
		// ..
	}

	// ..

	let b;
}
```

### let + for

```js
var funcs = [];

for (let i = 0; i < 5; i++) {
	funcs.push( function(){
		console.log( i );
	} );
}

funcs[3]();		// 3
```

More verbose 

```js
var funcs = [];

for (var i = 0; i < 5; i++) {
	let j = i;
	funcs.push( function(){
		console.log( j );
	} );
}

funcs[3]();		// 3
```

### `const` Declarations

```js
{
	const a = 2;
	console.log( a );	// 2

	a = 3;				// TypeError!
}
```

However 

```js
{
	const a = [1,2,3];
	a.push( 4 );
	console.log( a );		// [1,2,3,4]

	a = 42;					// TypeError!
}
```

### `const` Or Not

* improvements in performance are questionable
* source code is communicated clearly

### Block-scoped Functions

```js
{
	foo();					// works!

	function foo() {
		// ..
	}
}

foo();						// ReferenceError
```

* "hoisted" inside a block

### Pre-ES6 and ES6 quiz
 
```js
if (something) {
	function foo() {
		console.log( "1" );
	}
}
else {
	function foo() {
		console.log( "2" );
	}
}

foo();		// ??
```

## Spread/Rest

```js
function foo(x,y,z) {
	console.log( x, y, z );
}

foo( ...[1,2,3] );				// 1 2 3
```

syntactic replacement for the `apply(..)`

```js
foo.apply( null, [1,2,3] );		// 1 2 3
```

### Spread Out/Expand

```js
var a = [2,3,4];
var b = [ 1, ...a, 5 ];

console.log( b );					// [1,2,3,4,5]
```

### Gather 

```js
function foo(x, y, ...z) {
	console.log( x, y, z );
}

foo( 1, 2, 3, 4, 5 );			// 1 2 [3,4,5]
```

```js
function foo(...args) {
	console.log( args );
}

foo( 1, 2, 3, 4, 5);			// [1,2,3,4,5]
```

### Solid alternative for `arguments`

```js
// doing things the new ES6 way
function foo(...args) {
	// `args` is already a real array
	// discard first element in `args`
	args.shift();
	// pass along all of `args` as arguments
	// to `console.log(..)`
	console.log( ...args );
}
// doing things the old-school pre-ES6 way
function bar() {
	// turn `arguments` into a real array
	var args = Array.prototype.slice.call( arguments );
	// add some elements on the end
	args.push( 4, 5 );
	// filter out odd numbers
	args = args.filter( function(v){
		return v % 2 == 0;
	} );
	// pass along all of `args` as arguments
	// to `foo(..)`
	foo.apply( null, args );
}
bar( 0, 1, 2, 3 );					// 2 4
```

## Default Parameter Values

```js
function foo(x,y) {
	x = x || 11;
	y = y || 31;

	console.log( x + y );
}

foo();				// 42
foo( 5, 6 );		// 11
foo( 5 );			// 36
foo( null, 6 );		// 17
```

```js
foo( 0, 42 );		// 53 <-- Oops, not 42
```

### More Strict 

```js
function foo(x,y) {
	x = (x !== undefined) ? x : 11;
	y = (y !== undefined) ? y : 31;

	console.log( x + y );
}

foo( 0, 42 );			// 42
foo( undefined, 6 );	// 17
```

### ES6 Default Parameters 

```js
function foo(x = 11, y = 31) {
	console.log( x + y );
}

foo();					// 42
foo( 5, 6 );			// 11
foo( 0, 42 );			// 42

foo( 5 );				// 36
foo( 5, undefined );	// 36 <-- `undefined` is missing
foo( 5, null );			// 5  <-- null coerces to `0`

foo( undefined, 6 );	// 17 <-- `undefined` is missing
foo( null, 6 );			// 6  <-- null coerces to `0`
```

### Default Value Expressions

```js
function bar(val) {
	console.log( "bar called!" );
	return y + val;
}

function foo(x = y + 3, z = bar( x )) {
	console.log( x, z );
}

var y = 5;
foo();								// "bar called"
									// 8 13
foo( 10 );							// "bar called"
									// 10 15
y = 6;
foo( undefined, 10 );				// 9 10
```

### (..) as a scope 

```js
var w = 1, z = 2;

function foo( x = w + 1, y = x + 1, z = z + 1 ) {
	console.log( x, y, z );
}

foo();					// ReferenceError
```

### Even IIFE
 
```js
function foo( x =
	(function(v){ return v + 11; })( 31 )
) {
	console.log( x );
}

foo();			// 42
```

```js
function ajax(url, cb = function(){}) {
	// ..
}

ajax( "http://some.url.1" );
```

## Destructuring

Pre-ES6

```js
function foo() {
	return [1,2,3];
}

var tmp = foo(),
	a = tmp[0], b = tmp[1], c = tmp[2];

console.log( a, b, c );				// 1 2 3
```

```js
function bar() {
	return {
		x: 4,
		y: 5,
		z: 6
	};
}

var tmp = bar(),
	x = tmp.x, y = tmp.y, z = tmp.z;

console.log( x, y, z );				// 4 5 6
```

### Destructuring in Action

```js
var [ a, b, c ] = foo();
var { x: x, y: y, z: z } = bar();

console.log( a, b, c );				// 1 2 3
console.log( x, y, z );				// 4 5 6
```

* righthand side of an `=` assignment, as the value being assigned
* lefthand side of the `=` assignment is treated as a kind of "pattern" for decomposing 

## Object Literal Extensions

```js
var { x, y, z } = bar();

console.log( x, y, z );				// 4 5 6
```

### Assign Properties

```js
var { x: bam, y: baz, z: bap } = bar();

console.log( bam, baz, bap );		// 4 5 6
console.log( x, y, z );				// ReferenceError
```

### Inverting `target:source`

```js
var aa = 10, bb = 20;

var o = { x: aa, y: bb };
var     { x: AA, y: BB } = o;

console.log( AA, BB );				// 10 20
```

### Not Just Declarations

```js
var a, b, c, x, y, z;  // could be defined

[a,b,c] = foo();
( { x, y, z } = bar() ); // for var/let/const

console.log( a, b, c );				// 1 2 3
console.log( x, y, z );				// 4 5 6
```

```js
var o = {};

[o.a, o.b, o.c] = foo();
( { x: o.x, y: o.y, z: o.z } = bar() );

console.log( o.a, o.b, o.c );		// 1 2 3
console.log( o.x, o.y, o.z );		// 4 5 6
```

### With Computed Properties

```js
var which = "x",
	o = {};

( { [which]: o[which] } = bar() );

console.log( o.x );					// 4
```

### Declarative Mapping/Transformation 

```js
var o1 = { a: 1, b: 2, c: 3 },
	o2 = {};

( { a: o2.x, b: o2.y, c: o2.z } = o1 );

console.log( o2.x, o2.y, o2.z );	// 1 2 3
```

Or the other way around:

```js
var a1 = [ 1, 2, 3 ],
	o2 = {};

[ o2.a, o2.b, o2.c ] = a1;

console.log( o2.a, o2.b, o2.c );	// 1 2 3
```

### Swap Two Variables

```js
var x = 10, y = 20;

[ y, x ] = [ x, y ];

console.log( x, y );				// 20 10
```

### Repeated Assignments

```js
var { a: { x: X, x: Y }, a } = { a: { x: 1 } };

X;	// 1
Y;	// 1
a;	// { x: 1 }

( { a: X, a: Y, a: [ Z ] } = { a: [ 1 ] } );

X.push( 2 );
Y[0] = 10;

X;	// [10,2]
Y;	// [10,2]
Z;	// 1
```

### Multiple Lines

```js
// harder to read:
var { a: { b: [ c, d ], e: { f } }, g } = obj;

// better:
var {
	a: {
		b: [ c, d ],
		e: { f }
	},
	g
} = obj;            //declarative readability
```

### Destructuring Assignment Expressions

```js
var o = { a:1, b:2, c:3 },
	a, b, c, p;

p = { a, b, c } = o;

console.log( a, b, c );			// 1 2 3
p === o;						// true
```

Chaining 

```js
var o = { a:1, b:2, c:3 },
	p = [4,5,6],
	a, b, c, x, y, z;

( {a} = {b,c} = o );
[x,y] = [z] = p;

console.log( a, b, c );			// 1 2 3
console.log( x, y, z );			// 4 5 4
```

### Too Many, Too Few, Just Enough

```js
var [,b] = foo();
var { x, z } = bar();

console.log( b, x, z );				// 2 4 6
```

```js
var [,,c,d] = foo();
var { w, z } = bar();

console.log( c, z );				// 3 6
console.log( d, w );				// undefined undefined
```

### Gather/Rest

```js
var a = [2,3,4];
var b = [ 1, ...a, 5 ];

console.log( b );					// [1,2,3,4,5]
```

```js
var a = [2,3,4];
var [ b, ...c ] = a;

console.log( b, c );				// 2 [3,4]
```

### Default Value Assignment

```js
var [ a = 3, b = 6, c = 9, d = 12 ] = foo();
var { x = 5, y = 10, z = 15, w = 20 } = bar();

console.log( a, b, c, d );			// 1 2 3 12
console.log( x, y, z, w );			// 4 5 6 20
```

### Assignment Expression

```js
var { x, y, z, w: WW = 20 } = bar();

console.log( x, y, z, WW );			// 4 5 6 20
```

### Overuse

```js
var x = 200, y = 300, z = 100;
var o1 = { x: { y: 42 }, z: { y: z } };

( { y: x = { y: y } } = o1 );
( { z: y = { y: z } } = o1 );
( { x: z = { y: x } } = o1 );

console.log( x.y, y.y, z.y );		// 300 100 42

```

### Nested Destructuring

```js
var a1 = [ 1, [2, 3, 4], 5 ];
var o1 = { x: { y: { z: 6 } } };

var [ a, [ b, c, d ], e ] = a1;
var { x: { y: { z: w } } } = o1;

console.log( a, b, c, d, e );		// 1 2 3 4 5
console.log( w );					// 6
```

### Flatten Out Object Namespace

```js
var App = {
	model: {
		User: function(){ .. }
	}
};

// instead of:
// var User = App.model.User;

var { model: { User } } = App;
```

### Destructuring Parameters

```js
function foo( [ x, y ] ) {          // implistic assigment
	console.log( x, y );
}

foo( [ 1, 2 ] );					// 1 2
foo( [ 1 ] );						// 1 undefined
foo( [] );							// undefined undefined
```

Object destructuring for parameters works, too:

```js
function foo( { x, y } ) {
	console.log( x, y );
}

foo( { y: 1, x: 2 } );				// 2 1
foo( { y: 42 } );					// undefined 42
foo( {} );							// undefined undefined
```

### Destructuring Defaults + Parameter Defaults

```js
function f6({ x = 10 } = {}, { y } = { y: 10 }) {
	console.log( x, y );
}

f6();								// 10 10
f6( undefined, undefined );			// 10 10
f6( {}, undefined );				// 10 10

f6( {}, {} );						// 10 undefined
f6( undefined, {} );				// 10 undefined

f6( { x: 2 }, { y: 3 } );			// 2 3
```
### Nested Defaults: Destructured and Restructured

```js
// taken from: http://es-discourse.com/t/partial-default-arguments/120/7

var defaults = {
	options: {
		remove: true,
		enable: false,
		instance: {}
	},
	log: {
		warn: true,
		error: true
	}
};
```

with 

```js
var config = {
	options: {
		remove: false,
		instance: null
	}
};
```

### Old School

```js
config.options = config.options || {};
config.options.remove = (config.options.remove !== undefined) ?
	config.options.remove : defaults.options.remove;
config.options.enable = (config.options.enable !== undefined) ?
	config.options.enable : defaults.options.enable;
...
```

### `Object.assign(..)`

Only shallow copy

```js
config = Object.assign( {}, defaults, config );
```

### Destructuring/Restructuring 

```js
// merge `defaults` into `config`
{
	// destructure (with default value assignments)
	let {
		options: {
			remove = defaults.options.remove,
			enable = defaults.options.enable,
			instance = defaults.options.instance
		} = {},
		log: {
			warn = defaults.log.warn,
			error = defaults.log.error
		} = {}
	} = config;

	// restructure
	config = {
		options: { remove, enable, instance },
		log: { warn, error }
	};
}
```

### Object Literal Extensions

ES6 adds a number of important convenience extensions to the humble `{ .. }` object literal.

### Concise Properties

Pre-ES6

```js
var x = 2, y = 3,
	o = {
		x: x,
		y: y
	};
```

ES6

```js
var x = 2, y = 3,
	o = {
		x,
		y
	};
```

### Concise Methods

The old way:

```js
var o = {
	x: function(){
		// ..
	},
	y: function(){
		// ..
	}
}
```

And as of ES6:

```js
var o = {
	x() {
		// ..
	},
	y() {
		// ..
	}
}
```

### Concisely Unnamed

```js
runSomething( {
	something(x,y) {
		if (x > y) {
			return something( y, x );
		}

		return y - x;
	}
} );
```

The above ES6 snippet is interpreted as meaning:

```js
runSomething( {
	something: function(x,y){
		if (x > y) {
			return something( y, x );
		}

		return y - x;
	}
} );
```

### ES5 Getter/Setter

More usage in ES6

```js
var o = {
	__id: 10,
	get id() { return this.__id++; },
	set id(v) { this.__id = v; }
}

o.id;			// 10
o.id;			// 11
o.id = 20;
o.id;			// 20

// and:
o.__id;			// 21
o.__id;			// 21 -- still!
```

### Computed Property Names

```js
var prefix = "user_";

var o = {
	baz: function(..){ .. }
};

o[ prefix + "foo" ] = function(..){ .. };
o[ prefix + "bar" ] = function(..){ .. };
..
```

ES6

```js
var prefix = "user_";

var o = {
	baz: function(..){ .. },
	[ prefix + "foo" ]: function(..){ .. },
	[ prefix + "bar" ]: function(..){ .. }
	..
};
```

### `Symbol` as Property Name
 
```js
var o = {
	[Symbol.toStringTag]: "really cool thing",
	..
};
```

### Setting `[[Prototype]]`

```js
var o1 = {
	// ..
};

var o2 = {
	__proto__: o1,
	// ..
};
```

With utility

```js
var o1 = {
	// ..
};

var o2 = {
	// ..
};

Object.setPrototypeOf( o2, o1 );
```

### Object `super`

```js
var o1 = {
	foo() {
		console.log( "o1:foo" );
	}
};

var o2 = {
	foo() {
		super.foo();
		console.log( "o2:foo" );
	}
};

Object.setPrototypeOf( o2, o1 );

o2.foo();		// o1:foo
				// o2:foo
```
* `super` allowed only in concise methods


## Template Literals

It's not only about templating like (Mustache, Handlebars, etc)

More appropriate name would be *interpolated string literals*

* ", ', `

### Template Literals Usage

Here's the old pre-ES6 way:

```js
var name = "Kyle";

var greeting = "Hello " + name + "!";

console.log( greeting );			// "Hello Kyle!"
console.log( typeof greeting );		// "string"
```

Now, consider the new ES6 way:

```js
var name = "Kyle";

var greeting = `Hello ${name}!`;

console.log( greeting );			// "Hello Kyle!"
console.log( typeof greeting );		// "string"
```

### Multiple Lines

```js
var text =
`Now is the time for all good men
to come to the aid of their
country!`;

console.log( text );
// Now is the time for all good men
// to come to the aid of their
// country!
```

### Interpolated Expressions

```js
function upper(s) {
	return s.toUpperCase();
}

var who = "reader";

var text =
`A very ${upper( "warm" )} welcome
to all of you ${upper( `${who}s` )}!`;

console.log( text );
// A very WARM welcome
// to all of you READERS!
```

Any valid expression is allowed to appear inside `${..}` in an interpolated string literal

### Expression Scope

```js
function foo(str) {
	var name = "foo";
	console.log( str );
}

function bar() {
	var name = "bar";
	foo( `Hello from ${name}!` );
}

var name = "global";

bar();					// "Hello from bar!"
```

### Tagged Template Literals

```js
function foo(strings, ...values) {
	console.log( strings );
	console.log( values );
}

var desc = "awesome";

foo`Everything is ${desc}!`;
// [ "Everything is ", "!"]
// [ "awesome" ]
```

### Tagged Template Literals Use Case


```js
function dollabillsyall(strings, ...values) {
	return strings.reduce( function(s,v,idx){
		if (idx > 0) {
			if (typeof values[idx-1] == "number") {
				// look, also using interpolated
				// string literals!
				s += `$${values[idx-1].toFixed( 2 )}`;
			}
			else {
				s += values[idx-1];
			}
		}
		return s + v;
	}, "" );
}
var amt1 = 11.99,
	amt2 = amt1 * 1.08,
	name = "Kyle";
var text = dollabillsyall
`Thanks for your purchase, ${name}! Your
product cost was ${amt1}, which with tax
comes out to ${amt2}.`

console.log( text );
// Thanks for your purchase, Kyle! Your
// product cost was $11.99, which with tax
// comes out to $12.95.
```

## Arrow Functions

```js
function foo(x,y) {
	return x + y;
}

// versus

var foo = (x,y) => x + y;
```

```js
var a = [1,2,3,4,5];

a = a.map( v => v * 2 );

console.log( a );				// [2,4,6,8,10]
```

### Not Just Shorter Syntax, But `this`

```js
var controller = {
	makeRequest: (..) => {
		// ..
		this.helper(..);
	},
	helper: (..) => {
		// ..
	}
};

controller.makeRequest(..);
```

### Set of rules for when `=>`
 
1. Single-statement inline function expression
1. No any `this` issues
1. No self-referencing (recursion)

For learn more, take at look [here](img/fig1.png)

## `for..of` Loops

The value you loop over with `for..of` must be an *iterable*

### Pre-ES6 version of the `for..of`

```js
var a = ["a","b","c","d","e"],
	k = Object.keys( a );

for (var val, i = 0; i < k.length; i++) {
	val = a[ k[i] ];
	console.log( val );
}
// "a" "b" "c" "d" "e"
```

### ES6 but non-`for..of` equivalent

```js
var a = ["a","b","c","d","e"];

for (var val, ret, it = a[Symbol.iterator]();
	(ret = it.next()) && !ret.done;
) {
	val = ret.value;
	console.log( val );
}
// "a" "b" "c" "d" "e"
```

### Default Iterables 

* Arrays
* Strings
* Generators
* Collections / TypedArrays 

## `for..of` Loops Usage

```js
for (var c of "hello") {
	console.log( c );
}
// "h" "e" "l" "l" "o"
```

```js
var o = {};

for (o.a of [1,2,3]) {
	console.log( o.a );
}
// 1 2 3

for ({x: o.a} of [ {x: 1}, {x: 2}, {x: 3} ]) {
  console.log( o.a );
}
// 1 2 3
```

## Regular Expressions

Couple of new tricks in ES6

### Unicode Flag

```js
/𝄞/.test( "𝄞-clef" );			// true
```

```js
/^.-clef/ .test( "𝄞-clef" );		// false
/^.-clef/u.test( "𝄞-clef" );		// true
```

### Sticky Flag

```js
var re1 = /foo/,
	str = "++foo++";

re1.lastIndex;			// 0
re1.test( str );		// true
re1.lastIndex;			// 0 -- not updated

re1.lastIndex = 4;
re1.test( str );		// true -- ignored `lastIndex`
re1.lastIndex;			// 4 -- not updated
```

### Sticky Positioning

```js
var re = /\d+\.\s(.*?)(?:\s|$)/y
	str = "1. foo 2. bar 3. baz";

str.match( re );		// [ "1. foo ", "foo" ]

re.lastIndex;			// 7 -- correct position!
str.match( re );		// [ "2. bar ", "bar" ]

re.lastIndex;			// 14 -- correct position!
str.match( re );		// ["3. baz", "baz"]
```

## Number Literal Extensions

```js
var dec = 42,
	oct = 052,
	hex = 0x2a;
```

```js
Number( "42" );				// 42
Number( "052" );			// 52
Number( "0x2a" );			// 42
```

```js
Number( "42" );			// 42
Number( "0o52" );		// 42
Number( "0x2a" );		// 42
Number( "0b101010" );	// 42
```

## Symbols

```js
var sym = Symbol( "some optional description" );

typeof sym;		// "symbol"

sym.toString();		// "Symbol(some optional description)"

```

### Uniq names

```js
const EVT_LOGIN = Symbol( "event.login" );

evthub.listen( EVT_LOGIN, function(data){
	// ..
} );

```

### Aka Singleton

```js
const INSTANCE = Symbol( "instance" );

function HappyFace() {
	if (HappyFace[INSTANCE]) return HappyFace[INSTANCE];

	function smile() { .. }

	return HappyFace[INSTANCE] = {
		smile: smile
	};
}

var me = HappyFace(),
	you = HappyFace();

me === you;			// true
```

### Symbol Registry

```js
const EVT_LOGIN = Symbol.for( "event.login" );

console.log( EVT_LOGIN );		// Symbol(event.login)
```

And:

```js
function HappyFace() {
	const INSTANCE = Symbol.for( "instance" );

	if (HappyFace[INSTANCE]) return HappyFace[INSTANCE];

	// ..

	return HappyFace[INSTANCE] = { .. };
}
```

### Symbols as Object Properties

```js
var o = {
	foo: 42,
	[ Symbol( "bar" ) ]: "hello world",
	baz: true
};

Object.getOwnPropertyNames( o );	// [ "foo","baz" ]
```

To retrieve an object's symbol properties:

```js
Object.getOwnPropertySymbols( o );	// [ Symbol(bar) ]
```

### Built-In Symbols

```js
var a = [1,2,3];

a[Symbol.iterator];			// native function
```

* `@@iterator`, `@@toStringTag`, `@@toPrimitive`
* not in a Symbol register

## Review

1. Syntactic sugar for common programming idioms
    * default values
    * spread/gather 
    * destructuring
    * concise methods/properties
    * templating literals
1. `=>` is a nice-syntax, but have issues, like 
    * non-consistent `this` behaviour
    * not for long functions
1. Expanded Unicode support
1. Extensions for RegExp
1. New type for meta-programming - `Symbol`

## Organization

* Iterators
* Generators
* Modules
* Classes


## Iterators

An *iterator* is a structured pattern for pulling information from a source in one-at-a-time fashion

### Iterators Specification Interfaces

```
Iterator [required]
	next() {method}: retrieves next IteratorResult
```

```
Iterator [optional]
	return() {method}: stops iterator and returns IteratorResult
	throw() {method}: signals error and returns IteratorResult
```

```
IteratorResult
	value {property}: current iteration value or final return value
		(optional if `undefined`)
	done {property}: boolean, indicates completion status
```

```
Iterable
	@@iterator() {method}: produces an Iterator
```

#### IteratorResult

```js
{ value: .. , done: true / false }
```

`@@iterator` is the special built-in `symbol` 

### `next()` Iteration

```js
var arr = [1,2,3];

var it = arr[Symbol.iterator]();

it.next();		// { value: 1, done: false }
it.next();		// { value: 2, done: false }
it.next();		// { value: 3, done: false }

it.next();		// { value: undefined, done: true }
```

`done: true` when you receive the `3` value. You have to call `next()` again

### Primitives Iterables By Default

```js
var greeting = "hello world";

var it = greeting[Symbol.iterator]();

it.next();		// { value: "h", done: false }
it.next();		// { value: "e", done: false }
..
```

### Collection Iterables by Default

```js
var m = new Map();
m.set( "foo", 42 );
m.set( { cool: true }, "hello world" );

var it1 = m[Symbol.iterator]();
var it2 = m.entries();

it1.next();		// { value: [ "foo", 42 ], done: false }
it2.next();		// { value: [ "foo", 42 ], done: false }
..
```

### Optional: `return(..)` and `throw(..)`

* `return(..)` is defined as sending a signal to an iterator that the consuming code is complete
*  `throw(..)` is used to signal an exception/error to an iterator

`return(..)`  -  imply stop, however `throw(..)` doesn't necessary stop iterator 

### Iterator Loop

```js
var it = {
	// make the `it` iterator an iterable
	[Symbol.iterator]() { return this; },

	next() { .. },
	..
};

it[Symbol.iterator]() === it;		// true

for (var v of it) {
	console.log( v );
}
```

### Iterator Loop with Old School Loop

```js
for (var v, res; (res = it.next()) && !res.done; ) {
	v = res.value;
	console.log( v );
}
```

### Custom Iterators - Fibonacci

```js
var Fib = {
	[Symbol.iterator]() {
		var n1 = 1, n2 = 1;

		return {
			// make the iterator an iterable
			[Symbol.iterator]() { return this; },

			next() {
				var current = n2;
				n2 = n1;
				n1 = n1 + current;
				return { value: current, done: false };
			},

			return(v) {
				console.log(
					"Fibonacci sequence abandoned."
				);
				return { value: v, done: true };
			}
		};
	}
};

for (var v of Fib) {
	console.log( v );

	if (v > 50) break;
}
// 1 1 2 3 5 8 13 21 34 55
// Fibonacci sequence abandoned.
```


### Custom Iterators - Actions

```js
var tasks = {
	[Symbol.iterator]() {
		var steps = this.actions.slice();

		return {
			// make the iterator an iterable
			[Symbol.iterator]() { return this; },

			next(...args) {
				if (steps.length > 0) {
					let res = steps.shift()( ...args );
					return { value: res, done: false };
				}
				else {
					return { done: true }
				}
			},

			return(v) {
				steps.length = 0;
				return { value: v, done: true };
			}
		};
	},
	actions: []
};
```

### Custom Iterators - Actions

```js
tasks.actions.push(
	function step1(x){
		console.log( "step 1:", x );
		return x * 2;
	},
	function step2(x,y){
		console.log( "step 2:", x, y );
		return x + (y * 2);
	},
	function step3(x,y,z){
		console.log( "step 3:", x, y, z );
		return (x * y) + z;
	}
);

var it = tasks[Symbol.iterator]();

it.next( 10 );			// step 1: 10
						// { value:   20, done: false }

it.next( 20, 50 );		// step 2: 20 50
						// { value:  120, done: false }

it.next( 20, 50, 120 );	// step 3: 20 50 120
						// { value: 1120, done: false }

it.next();				// { done: true }
```

### Custom Iterator - Range

Customization of `Number.prototype` can give next trick

```js
for (var i of 3) {
	console.log( i );
}
// 0 1 2 3

[...-3];				// [0,-1,-2,-3]
```

### Iterator Consumption

```js
var a = [1,2,3,4,5];    //any iterable here

function foo(x,y,z,w,p) {
	console.log( x + y + z + w + p );
}
foo( ...a );			// 15

var b = [ 0, ...a, 6 ];
b;						// [0,1,2,3,4,5,6]

var it = a[Symbol.iterator]();

var [x,y] = it;			// take just the first two elements from `it`
var [z, ...w] = it;		// take the third, then the rest all at once

// is `it` fully exhausted? Yep.
it.next();				// { value: undefined, done: true }

x;						// 1
y;						// 2
z;						// 3
w;						// [4,5]

```

## Generators

It can pause itseld in mid-execution, and can be resumed right away or at later time

### Syntax

```js
function *foo() {
	// ..
}
```

All valid

```js
function *foo()  { .. }
function* foo()  { .. }
function * foo() { .. }
function*foo()   { .. }
..
```

Concise Method

```js
var a = {
	*foo() { .. }
};
```

### Executing a Generator

```js
foo();
```

You can still pass it arguments, as in:

```js
function *foo(x,y) {
	// ..
}

foo( 5, 10 );
```

### Iterator as Result

```js
function *foo() {
	// ..
}

var it = foo();

// to start/advanced `*foo()`, call
// `it.next(..)`
```

#### `yield`

```js
function *foo() {
	var x = 10;
	var y = 20;

	yield;

	var z = x + y;
}
```

`yield` is not just a pause point. It's an expression 

```js
function *foo() {
	while (true) {
		yield Math.random();
	}
}
```

### `yield` can appear anywhere a normal expression can

```js
function *foo() {
	var arr = [ yield 1, yield 2, yield 3 ];
	console.log( arr, yield 4 );
}
```

Precedence
 
```js
var a, b;

a = 3;					// valid
b = 2 + a = 3;			// invalid
b = 2 + (a = 3);		// valid

yield 3;				// valid
a = 2 + yield 3;		// invalid
a = 2 + (yield 3);		// valid
```

### `yield *`

* `yield * ..` requires an iterable
* delegates its own host generator's control to that iterator 

```js
function *foo() {
	yield *[1,2,3];
}
```

```js
function *foo() {
	yield 1;
	yield 2;
	yield 3;
}

function *bar() {
	yield *foo();
}
```

### Generator Recursion

```js
function *foo(x) {
	if (x < 3) {
		x = yield *foo( x + 1 );
	}
	return x * 2;
}

foo( 1 );
```

### Iterator Control

```js
function *foo() {
	yield 1;
	yield 2;
	yield 3;
}

var it = foo();

it.next();				// { value: 1, done: false }
it.next();				// { value: 2, done: false }
it.next();				// { value: 3, done: false }

it.next();				// { value: undefined, done: true }
```

### Progressive Code Execution

```js
function *foo() {
	var x = yield 1;
	var y = yield 2;
	var z = yield 3;
	console.log( x, y, z );
}
```
```js
var it = foo();

// start up the generator
it.next();				// { value: 1, done: false }

// answer first question
it.next( "foo" );		// { value: 2, done: false }

// answer second question
it.next( "bar" );		// { value: 3, done: false }

// answer third question
it.next( "baz" );		// "foo" "bar" "baz"
						// { value: undefined, done: true }
```

### Early Completion

```js
function *foo() {
	yield 1;
	yield 2;
	yield 3;
}

var it = foo();

it.next();				// { value: 1, done: false }

it.return( 42 );		// { value: 42, done: true }

it.next();				// { value: undefined, done: true }
```

`return(..)` called automatically at the end of iteration

### Clean Up Tasks

```js
function *foo() {
	try {
		yield 1;
		yield 2;
		yield 3;
	}
	finally {
		console.log( "cleanup!" );
	}
}

for (var v of foo()) {
	console.log( v );
}
// 1 2 3
// cleanup!

var it = foo();

it.next();				// { value: 1, done: false }
it.return( 42 );		// cleanup!
						// { value: 42, done: true }
```

**Warning:** Do not put a `yield` statement inside the `finally` clause!

### Early Abort

```js
function *foo() {
	yield 1;
	yield 2;
	yield 3;
}

var it = foo();

it.next();				// { value: 1, done: false }

try {
	it.throw( "Oops!" );
}
catch (err) {
	console.log( err );	// Exception: Oops!
}

it.next();				// { value: undefined, done: true }
```

### Error Handling

```js
function *foo() {
	try {
		yield 1;
	}
	catch (err) {
		console.log( err );
	}

	yield 2;

	throw "Hello!";
}

var it = foo();

it.next();				// { value: 1, done: false }

try {
	it.throw( "Hi!" );	// Hi!
						// { value: 2, done: false }
	it.next();

	console.log( "never gets here" );
}
catch (err) {
	console.log( err );	// Hello!
}
```

### Error Propagation in Both Directions

```js
function *foo() {
	try {
		yield 1;
	}
	catch (err) {
		console.log( err );
	}

	yield 2;

	throw "foo: e2";
}

function *bar() {
	try {
		yield *foo();

		console.log( "never gets here" );
	}
	catch (err) {
		console.log( err );
	}
}

var it = bar();

try {
	it.next();			// { value: 1, done: false }

	it.throw( "e1" );	// e1
						// { value: 2, done: false }

	it.next();			// foo: e2
						// { value: undefined, done: true }
}
catch (err) {
	console.log( "never gets here" );
}

it.next();				// { value: undefined, done: true }
```

The error doesn't pass through `*bar()` like the `1` value did.

### Transpiling a Generator

For example Facebook's Regenerator tool (https://facebook.github.io/regenerator/).

### Generator Uses

* *Producing a series of values*
* *Queue of tasks to perform serially*

## Modules

Most important code organization pattern in all of JavaScript

### The Old Way

The traditional module pattern is based on an outer function with inner variables and functions, and a returned "public API" with methods that have closure over the inner data and capabilities. It's often expressed like this:

```js
var me = (function Hello(name){
	function greeting() {
		console.log( "Hello " + name + "!" );
	}

	// public API
	return {
		greeting: greeting
	};
})( "Kyle" );

me.greeting();			// Hello Kyle!
```

### Moving Forward

* ES6 uses file-based modules, meaning one module per file
* The API of an ES6 module is static
* ES6 modules are singletons
* The properties and methods of module are bindings
* Importing a module is the same thing as statically requesting it to load 

#### CommonJS, AMD/UMD

Transpilers will be an absolute necessity in the way to ES6 modules

### The New Way

The two main new keywords that enable ES6 modules are `import` and `export`.

#### `export`ing API Members

```js
export function foo() {
	// ..
}

export var awesome = 42;

var bar = [1,2,3];
export { bar };
```

Another way of expressing the same exports:

```js
function foo() {
	// ..
}

var awesome = 42;
var bar = [1,2,3];

export { foo, awesome, bar };
```

Rename aka alias

```js
function foo() { .. }

export { foo as bar };
```

### 'default' export

```js
function foo(..) {
	// ..
}

export default foo;
```

And this one:

```js
function foo(..) {
	// ..
}

export { foo as default };
```

```js
export default function foo(..) {
	// ..
}
```

### `import`ing API Members

```js
import { foo, bar, baz } from "foo";
```

* not a destructuring
* "foo" - *module specifier* any string (aka path), ES6 doesn't care

### Different imports

```js
import { foo } from "foo";

foo();
```

```js
import { foo as theFooFunc } from "foo";

theFooFunc();
```

```js
import foo from "foo";

// or:
import { default as foo } from "foo";
```

### Entire API to single module

```js
import * as foo from "foo";

foo.bar();
foo.x;			// 42
foo.baz();
```

or 

```js
export default function foo() { .. }
export function bar() { .. }
export function baz() { .. }
```

And this `import`:

```js
import foofn, * as hello from "world";

foofn();
hello.default();
hello.bar();
hello.baz();
```

### ES6`s module philosophy

Import only specific bindings which you need

### Immutable read-only binding

```js
import foofn, * as hello from "world";

foofn = 42;			// (runtime) TypeError!
hello.default = 42;	// (runtime) TypeError!
hello.bar = 42;		// (runtime) TypeError!
hello.baz = 42;		// (runtime) TypeError!
```

### `import` are "hoisted" 

```js
foo();

import { foo } from "foo";
```

### Basic `import` 

```js
import "foo";
```

### Circular Module Dependency


Let's consider how ES6 handles this. First, module `"A"`:

```js
import bar from "B";

export default function foo(x) {
	if (x > 10) return bar( x - 1 );
	return x * 2;
}
```

Now, module `"B"`:

```js
import foo from "A";

export default function bar(y) {
	if (y > 5) return foo( y / 2 );
	return y * 3;
}
```

### In a rough conceptual sense

1. Start analyzing 'A', find out A's API, fetch B 
2. Analyzing B, find out B's API, finish A, finish B 

### Module Loading

* another specification http://whatwg.github.io/loader/

## Classes

```js
class Foo {
	constructor(a,b) {
		this.x = a;
		this.y = b;
	}

	gimmeXY() {
		return this.x * this.y;
	}
}
```

### Old Way

```js
function Foo(a,b) {
	this.x = a;
	this.y = b;
}

Foo.prototype.gimmeXY = function() {
	return this.x * this.y;
}
```

### Usage pre-ES6 and ES6

```js
var f = new Foo( 5, 15 );

f.x;						// 5
f.y;						// 15
f.gimmeXY();				// 75
```

### `extends` and `super`

```js
class Bar extends Foo {
	constructor(a,b,c) {
		super( a, b );
		this.z = c;
	}

	gimmeXYZ() {
		return super.gimmeXY() * this.z;
	}
}

var b = new Bar( 5, 15, 25 );

b.x;						// 5
b.y;						// 15
b.z;						// 25
b.gimmeXYZ();				// 1875
```

#### `extend`ing Natives

```js
class MyCoolArray extends Array {
	first() { return this[0]; }
	last() { return this[this.length - 1]; }
}

var a = new MyCoolArray( 1, 2, 3 );

a.length;					// 3
a;							// [1,2,3]

a.first();					// 1
a.last();					// 3
```

#### `extend`ing Natives

```js
class Oops extends Error {
	constructor(reason) {
		super(reason);
		this.oops = reason;
	}
}

// later:
var ouch = new Oops( "I messed up!" );
throw ouch;
```

### `static`

```js
class Foo {
	static cool() { console.log( "cool" ); }
	wow() { console.log( "wow" ); }
}

class Bar extends Foo {
	static awesome() {
		super.cool();
		console.log( "awesome" );
	}
	neat() {
		super.wow();
		console.log( "neat" );
	}
}

Foo.cool();					// "cool"
Bar.cool();					// "cool"
Bar.awesome();				// "cool"
							// "awesome"

var b = new Bar();
b.neat();					// "wow"
							// "neat"

b.awesome;					// undefined
b.cool;						// undefined
```

## Review

* ES6 provides several new features for code organization
* Iterators provide sequential access to data or operations
* Generators are locally pause/resume capable functions controlled by an iterator
* Modules allow private encapsulation of implementation details with a publicly exported API
* Classes provide cleaner syntax around prototype-based coding
