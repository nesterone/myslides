###You Don't Know JS
#####this & object prototypes
inspired by [getify](https://github.com/getify/You-Dont-Know-JS/tree/master/this%20%26%20object%20prototypes)


###Presented by
* [Igor Nesterenko](https://twitter.com/nesterone)

###High-level Overview

* *this* Or That?
* *this* All Makes Sense Now
* Objects
* Mixing (Up) "Class" Objects
* Prototypes
* Behavior Delegation
* ES6 *class*

###*this* Or That?

* Why `this` ?
* Confusions
    * Itself
    * It's scope
* What's `this` ?

### Why `this` ?

```js
function identify() {
	return this.name.toUpperCase();
}
function speak() {
	var greeting = "Hello, I'm " + identify.call( this );
	console.log( greeting );
}
var me = {
	name: "Kyle"
};
var you = {
	name: "Reader"
};
identify.call( me ); // KYLE
identify.call( you ); // READER
speak.call( me ); // Hello, I'm KYLE
speak.call( you ); // Hello, I'm READER
```

### Why `this` ?

```js
function identify(context) {
	return context.name.toUpperCase();
}

function speak(context) {
	var greeting = "Hello, I'm " + identify( context );
	console.log( greeting );
}

identify( you ); // READER
speak( me ); // Hello, I'm KYLE
```

* way of implicitly "passing along" an object reference
 
### Confusions

"this" creates confusion when developers try to think about it too literally

### Confusions - Itself

`this` refers to the function itself (in JS all functions are objects)

```js
function foo(num) {
	console.log( "foo: " + num );

	// keep track of how many times `foo` is called
	this.count++;
}
foo.count = 0;
var i;
for (i=0; i<10; i++) {
	if (i > 5) {
		foo( i );
	}
}
// how many times was `foo` called?
console.log( foo.count ); // 0 -- WTF?
```

### Confusions - Itself

Fixing with variable from outer scope

```js
function foo(num) {
	console.log( "foo: " + num );
	// keep track of how many times `foo` is called
	data.count++;
}
var data = {
	count: 0
};
var i;
for (i=0; i<10; i++) {
	if (i > 5) {
		foo( i );
	}
}
// how many times was `foo` called?
console.log( data.count ); // 4
```

### Referencing Function as an Object

```js
function foo() {
	foo.count = 4; // `foo` refers to itself
}

setTimeout( function(){
	// anonymous function (no name), cannot
	// refer to itself
}, 10 );
```

### Confusions - Itself

Fixing with lexical-scope function's name

```js
function foo(num) {
	console.log( "foo: " + num );

	// keep track of how many times `foo` is called
	foo.count++;
}
foo.count = 0;
var i;
for (i=0; i<10; i++) {
	if (i > 5) {
		foo( i );
	}
}
// how many times was `foo` called?
console.log( foo.count ); // 4
```

### Confusions - Itself

Fixing with `this`

```js
function foo(num) {
	console.log( "foo: " + num );
	// keep track of how many times `foo` is called
	// Note: `this` IS actually `foo` now, based on
	// how `foo` is called (see below)
	this.count++;
}
foo.count = 0;
var i;
for (i=0; i<10; i++) {
	if (i > 5) {
		// using `call(..)`, we ensure the `this`
		// points at the function object (`foo`) itself
		foo.call( foo, i );
	}
}
console.log( foo.count ); // 4
```

### Confusions - Its scope

```js
function foo() {
	var a = 2;
	this.bar();
}

function bar() {
	console.log( this.a );
}

foo(); //undefined
```

### What's `this`?

`this` is not an author-time binding but a runtime binding


###*this* All Makes Sense Now

* Call-site
* Nothing But Rules 
* Everything in Order
* Binding Exceptions
* Lexical this

### Call-site

Call-site: the location in code where a function is called

```js
function baz() {
    // call-stack is: `baz`
    // so, our call-site is in the global scope
    console.log( "baz" );
    bar(); // <-- call-site for `bar`
}
function bar() {
    // call-stack is: `baz` -> `bar`
    // so, our call-site is in `baz`
    console.log( "bar" );
    foo(); // <-- call-site for `foo`
}
function foo() {
    // call-stack is: `baz` -> `bar` -> `foo`
    // so, our call-site is in `bar`
    console.log( "foo" );
}
baz(); // <-- call-site for `baz`
```


### Nothing But Rules

Inspect the call-site and determine which of 4 rules applies

* Default Binding
* Implicit Binding
* Explicit Binding
* New Binding

### Default Binding

```js
function foo() {
	console.log( this.a );
}

var a = 2;

foo(); // 2
```

### Default Binding

```js
function foo() {
	"use strict";

	console.log( this.a );
}

var a = 2;

foo(); // TypeError: `this` is `undefined`
```

### Default Binding

```js
function foo() {
	console.log( this.a );
}

var a = 2;

(function(){
	"use strict";

	foo(); // 2
})();
```

* try to not mix `strict mode` and non-`strict mode`


###Objects

* Syntax
* Type
* Contents
* Iteration

### Syntax

Literal Form

```js
var myObj = {
	key: value
	// ...
};
```

Constructor Form

```js
var myObj = new Object();
myObj.key = value;
```

### Type

* `string`
* `number`
* `boolean`
* `null`
* `undefined`
* `object`

### Not All types are objects

* string, number, boolean, null, undefined are **not** objects

```js
 typeof null === "object"; //true, yep it's a language bug
```

### Complex Primitives

* Functions are 'callable objects'
* Arrays have special implementation to store date in more structured way 

### Build-in Objects

* `String`
* `Number`
* `Boolean`
* `Object`
* `Function`
* `Array`
* `Date`
* `RegExp`
* `Error`

> They are just build-in functions

### Primitive Literal and Object

```js
var strPrimitive = "I am a string";
typeof strPrimitive;							// "string"
strPrimitive instanceof String;					// false

var strObject = new String( "I am a string" );
typeof strObject; 								// "object"
strObject instanceof String;					// true

// inspect the object sub-type
Object.prototype.toString.call( strObject );	// [object String]
```

### Type Auto Coercion

```js
var strPrimitive = "I am a string";

console.log( strPrimitive.length );			// 13

console.log( strPrimitive.charAt( 3 ) );	// "m"

console.log( 42.359.toFixed(2) );           // 42.36

console.log( true.toString() );             // "true"

```

### Simple Primitives - Prefer literal form
 
```js
var str = "I'm a string";
var strObj = new String("I'm a string");

var number = 43;
var numberObj = new Number(43);

var boolean = true;
var boolean = new Boolean(true);

```

> no object wrappers for `null` and `undefined`

### Complex Primitives - Prefer literal form

```js
var obj = { key: "value"};
var obj = new Object();
obj["key1"] = "value";

var array = [1,2,3];
var array = new Array(1, 2, 3);

var fn = function(){};
var fn = new Function();

var regexp = /abc/;
var regexp = new RegExp("abc");

var error = new Error("some message"); // no literal form
var data = new Date("2016-03-03");     // no literal form

```

> use constructor form only for *extra options*

### Contents

```js
var myObject = {
	a: 2
};

myObject.a;		// 2

myObject["a"];	// 2
```

### Programmatic creation of values

```js
var wantA = true;
var myObject = {
	a: 2
};

var idx;

if (wantA) {
	idx = "a";
}

// later

console.log( myObject[idx] ); // 2

```


### Array's contents

```js
var myObject = { };

myObject[true] = "foo";
myObject[3] = "bar";
myObject[myObject] = "baz";

myObject["true"];				// "foo"
myObject["3"];					// "bar"
myObject["[object Object]"];	// "baz"
```
 
> designed for usage with number-indexed data

### Computed Property Names

```js
var prefix = "foo";

var myObject = {
	[prefix + "bar"]: "hello",  // only from ES6
	[prefix + "baz"]: "world"
};

myObject["foobar"]; // hello
myObject["foobaz"]; // world
```

* ES6 adds computed properties names

### Property vs. Method

If object's property is a function then it's a "property access" or "method access" ?

### Nothing but The Same Function

```js
function foo() {
	console.log( "foo" );
}

var someFoo = foo;	// variable reference to `foo`

var myObject = {
	someFoo: foo
};

foo;				// function foo(){..}

someFoo;			// function foo(){..}

myObject.someFoo;	// function foo(){..}
```

* implicit binding in last case

### Nothing but The Same Function

```js
var myObject = {
	foo: function foo() {
		console.log( "foo" );
	}
};

var someFoo = myObject.foo;

someFoo;		// function foo(){..}

myObject.foo;	// function foo(){..}
```

* ES6's *super* gives further more weight to the idea of "methods"

### Arrays

```js
var myArray = [ "foo", 42, "bar" ];

myArray.length;		// 3

myArray[0];			// "foo"

myArray[2];			// "bar"
```

* structured organization of how values are stored
* assume numeric indexing
* `[]` preferred access to values

### Arrays are objects

```js
var myArray = [ "foo", 42, "bar" ];

myArray.baz = "baz";

myArray.length;	// 3

myArray.baz;	// "baz"
```

* allow `.` access, but not to number-indexed values
* `.` doesn't change the `length` property of array

### Arrays are objects

```js
var myArray = [ "foo", 42, "bar" ];

myArray["3"] = "baz";  //converts to string

myArray.length;	// 4

myArray[3];		// "baz"
```

### Duplicating Objects

```js
function anotherFunction() { /*..*/ }

var anotherObject = {
	c: true
};

var anotherArray = [];

var myObject = {
	a: 2,
	b: anotherObject,	// reference, not a copy!
	c: anotherArray,	// another reference!
	d: anotherFunction
};

anotherArray.push( anotherObject, myObject );
```

### Duplicating Objects

* What exactly should be the representation of a *copy* of `myObject`?
* What "duplicating" a function would mean?
* What to do with circular references ?

### JSON-safe approach

```js
var newObj = JSON.parse( JSON.stringify( someObj ) );
```

### Shallow Copy

ES6 introduces `Object.assign(..)`

```js
var newObj = Object.assign( {}, myObject );

newObj.a;						// 2
newObj.b === anotherObject;		// true
newObj.c === anotherArray;		// true
newObj.d === anotherFunction;	// true
```

### Deep Copy

Take a look at different libraries, for example

* [lodash](https://lodash.com/docs/4.16.1#cloneDeep)
* [jQuery](http://api.jquery.com/jQuery.extend/)

### Property Descriptors

ES5 introduces API to get properties characteristics 

```js
var myObject = {
	a: 2
};

Object.getOwnPropertyDescriptor( myObject, "a" );
// {
//    value: 2,
//    writable: true,
//    enumerable: true,
//    configurable: true
// }
```


### Property Descriptors

Provide property descriptions in a manual way

```js
var myObject = {};

Object.defineProperty( myObject, "a", {
	value: 2,
	writable: true,
	configurable: true,
	enumerable: true
} );

myObject.a; // 2
```

### Writable

```js
var myObject = {};

Object.defineProperty( myObject, "a", {
	value: 2,
	writable: false, // not writable!
	configurable: true,
	enumerable: true
} );

myObject.a = 3;

myObject.a; // 2
```

* silently failed in none-strict mode

### Writable


```js
"use strict";

var myObject = {};

Object.defineProperty( myObject, "a", {
	value: 2,
	writable: false, // not writable!
	configurable: true,
	enumerable: true
} );

myObject.a = 3; // TypeError
```

* throws TypeError


### Configurable

```js
var myObject = {
	a: 2
};

myObject.a = 3;
myObject.a;					// 3

Object.defineProperty( myObject, "a", {
	value: 4,
	writable: true,
	configurable: false,	// not configurable!
	enumerable: true
} );

myObject.a;					// 4
myObject.a = 5;
myObject.a;					// 5

Object.defineProperty( myObject, "a", {
	value: 6,
	writable: true,
	configurable: true,
	enumerable: true
} ); // TypeError
```

### Configurable

* throws `TypeError` regardless to strict mode
* configurable to `false` can't be undone
    * except `writable` when changing from `true` to `false`
* `configurable: false` prevents is the ability to use `delete`

### Configurable

```js
var myObject = {
	a: 2
};

myObject.a;				// 2
delete myObject.a;
myObject.a;				// undefined

Object.defineProperty( myObject, "a", {
	value: 2,
	writable: true,
	configurable: false,
	enumerable: true
} );

myObject.a;				// 2
delete myObject.a;
myObject.a;				// 2
```

* delete is a just object's property removal operation

### Enumerable

Controls if a property will show up in certain object-property enumerations, such as the `for..in` loop

### Immutability

* ES5 adds support
* **all** of these approaches create shallow immutability

```js
myImmutableObject.foo; // [1,2,3]
myImmutableObject.foo.push( 4 );
myImmutableObject.foo; // [1,2,3,4]
```

### Object Constant

By combining `writable:false` and `configurable:false`

```js
var myObject = {};

Object.defineProperty( myObject, "FAVORITE_NUMBER", {
	value: 42,
	writable: false,
	configurable: false
} );
```

### Prevent Extensions

```js
var myObject = {
	a: 2
};

Object.preventExtensions( myObject );

myObject.b = 3;
myObject.b; // undefined
```
In `non-strict mode`, the creation of `b` fails silently. In `strict mode`, it throws a `TypeError`.

### Seal

`Object.seal(..)`

* can't extend, delete properties
* still can change values

### Freeze

`Object.freeze(..)`

* like `Object.seal`, but it also marks all "data accessor" properties as `writable:false`

### `[[Get]]`

* `[[Get]]` operation kinda like a function call: `[[Get]]()`

```js
var myObject = {
	a: 2
};

myObject.a; // 2
```

### `[[Get]]`

* it doesn't *just* look in `myObject` for a property of the name `a`
* if it does *not* find a property then search in `[[Prototype]]` chain
* if it does *not* find at all then return `undefined`

### `[[Get]]`

```js
var myObject = {
	a: 2
};

myObject.b; // undefined
```

```js
var myObject = {
	a: undefined
};

myObject.a; // undefined

myObject.b; // undefined
```

* can't distinguish where a property exists and holds explicit value `undefined`

### `[[Put]]`

If the property is present:

1. Call the setter, if any
2. Is `writable: false` ? **If so, silently fail in `non-strict mode`, or throw `TypeError` in `strict mode`.**
3. Otherwise, set the value to the existing property as normal.

### Getters & Setters

Control how values are set to existing or new properties, or retrieved from existing properties

* ES5 introduced a way to override part of these default operations

### Getters & Setters

```js
var myObject = {
	// define a getter for `a`
	get a() {
		return 2;
	}
};

Object.defineProperty(
	myObject,	// target
	"b",		// property name
	{			// descriptor
		// define a getter for `b`
		get: function(){ return this.a * 2 },

		// make sure `b` shows up as an object property
		enumerable: true
	}
);

myObject.a; // 2

myObject.b; // 4
```

### Getters & Setters

Using object-literal syntax with `get a() { .. }`

```js
var myObject = {
	// define a getter for `a`
	get a() {
		return 2;
	}
};

myObject.a = 3;

myObject.a; // 2
```  

### Getters & Setters

```js
var myObject = {
	// define a getter for `a`
	get a() {
		return this._a_;
	},

	// define a setter for `a`
	set a(val) {
		this._a_ = val * 2;
	}
};

myObject.a = 2;

myObject.a; // 4
```
* `_a_` is a normal property 

### Existence

```js
var myObject = {
	a: 2
};

("a" in myObject);				// true
("b" in myObject);				// false

myObject.hasOwnProperty( "a" );	// true
myObject.hasOwnProperty( "b" );	// false
```

* `in` if not found in the object it goes through `[[Prototype]]` chain
* `Object.hasOwnProperty(..)` looks only in the object
* `in` isn't for arrays content

### Enumeration

```js
var myObject = { };

Object.defineProperty(
	myObject,
	"a",
	// make `a` enumerable, as normal
	{ enumerable: true, value: 2 }
);

Object.defineProperty(
	myObject,
	"b",
	// make `b` NON-enumerable
	{ enumerable: false, value: 3 }
);

myObject.b; // 3
("b" in myObject); // true
myObject.hasOwnProperty( "b" ); // true

// .......

for (var k in myObject) {
	console.log( k, myObject[k] );
}
// "a" 2
```

* `for..in` loops better to not use with arrays

### Enumeration

Way that enumerable and non-enumerable properties can be distinguished:

```js
var myObject = { };

Object.defineProperty(
	myObject,
	"a",
	// make `a` enumerable, as normal
	{ enumerable: true, value: 2 }
);

Object.defineProperty(
	myObject,
	"b",
	// make `b` non-enumerable
	{ enumerable: false, value: 3 }
);

myObject.propertyIsEnumerable( "a" ); // true
myObject.propertyIsEnumerable( "b" ); // false

Object.keys( myObject ); // ["a"]
Object.getOwnPropertyNames( myObject ); // ["a", "b"]
```

* not build-in way to get list of all properties, including `[[Prototype]]` chain

### Iteration

The `for..in` loop iterates including its `[[Prototype]]` chain
What if you instead want to iterate over the values?

### Iteration

Just plain old `for` loop with indexes

```js
var myArray = [1, 2, 3];

for (var i = 0; i < myArray.length; i++) {
	console.log( myArray[i] );
}
// 1 2 3
```

### Iteration

ES5 also added several iteration helpers for arrays:
    * `forEach(..)`
    * `every(..)`
    * `some(..)`

### Iteration

ES6 adds `for..of` loop

```js
var myArray = [ 1, 2, 3 ];

for (var v of myArray) {
	console.log( v );
}
// 1
// 2
// 3
```

### Iteration

* `for..of` loop asks for an iterator object (`@@iterator` in spec)
* `@@iterator` has `next()` method

```js
var myArray = [ 1, 2, 3 ];
var it = myArray[Symbol.iterator]();

it.next(); // { value:1, done:false }
it.next(); // { value:2, done:false }
it.next(); // { value:3, done:false }
it.next(); // { done:true }
```

> note that we have 4 calls instead of 3

### Iteration

Define iterator

```js
var myObject = {
	a: 2,
	b: 3
};

Object.defineProperty( myObject, Symbol.iterator, {
	enumerable: false,
	writable: false,
	configurable: true,
	value: function() {
		var o = this;
		var idx = 0;
		var ks = Object.keys( o );
		return {
			next: function() {
				return {
					value: o[ks[idx++]],
					done: (idx > ks.length)
				};
			}
		};
	}
} );
```

### Iteration

Retrieve iterator and iterate

```js

// iterate `myObject` manually
var it = myObject[Symbol.iterator]();
it.next(); // { value:2, done:false }
it.next(); // { value:3, done:false }
it.next(); // { value:undefined, done:true }

// iterate `myObject` with `for..of`
for (var v of myObject) {
	console.log( v );
}
// 2
// 3
```

### Iteration

Define iterator with computed property name

```js
var randoms = {
	[Symbol.iterator]: function() {
		return {
			next: function() {
				return { value: Math.random() };
			}
		};
	}
};

var randoms_pool = [];
for (var n of randoms) {
	randoms_pool.push( n );

	// don't proceed unbounded!
	if (randoms_pool.length === 100) break;
}
```
