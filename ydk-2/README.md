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

### Implicit Binding

```js
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2,
	foo: foo
};

obj.foo(); // 2
```

### Implicit Binding

```js
function foo() {
	console.log( this.a );
}

var obj2 = {
	a: 42,
	foo: foo
};

var obj1 = {
	a: 2,
	obj2: obj2
};

obj1.obj2.foo(); // 42
```

### Implicitly Lost

```js
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2,
	foo: foo
};

var bar = obj.foo; // function reference/alias!

var a = "oops, global"; // `a` also property on global object

bar(); // "oops, global"
```

### Implicitly Lost

```js
function foo() {
	console.log( this.a );
}
function doFoo(fn) {
	// `fn` is just another reference to `foo`
	fn(); // <-- call-site!
}
var obj = {
	a: 2,
	foo: foo
};
var a = "oops, global"; // `a` also property on global object
doFoo( obj.foo ); // "oops, global"
```

### Implicitly Lost

```js
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2,
	foo: foo
};

var a = "oops, global"; // `a` also property on global object

setTimeout( obj.foo, 100 ); // "oops, global"
```

### Pseudo-Implementation of `setTimeout()`

```js
function setTimeout(fn,delay) {
	// wait (somehow) for `delay` milliseconds
	fn(); // <-- call-site!
}
```

### Intentional Changes to this

* Event handlers in popular JS libs

### Explicit Binding

functions have `call(..)` and `apply(..)` methods

```js
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2
};

foo.call( obj ); // 2
foo.apply( obj ); // 2
```

### Hard Binding

```js
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2
};

var bar = function() {
	foo.call( obj );
};

bar(); // 2
setTimeout( bar, 100 ); // 2

// `bar` hard binds `foo`'s `this` to `obj`
// so that it cannot be overriden
bar.call( window ); // 2
```

### Hard Binding 

Fix problem with upper scoped object

```js
function foo(something) {
	console.log( this.a, something );
	return this.a + something;
}

var obj = {
	a: 2
};

var bar = function() {
	return foo.apply( obj, arguments );
};

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

### Hard Binding 

Fix problem with helper function

```js
function foo(something) {
	console.log( this.a, something );
	return this.a + something;
}

// simple `bind` helper
function bind(fn, obj) {
	return function() {
		return fn.apply( obj, arguments );
	};
}

var obj = {
	a: 2
};

var bar = bind( foo, obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

### Hard Binding 

Since *hard binding* is such a common pattern
* ES5: `Function.prototype.bind`

```js
function foo(something) {
	console.log( this.a, something );
	return this.a + something;
}

var obj = {
	a: 2
};

var bar = foo.bind( obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

> ES6 provide additional prefix in stack trace - "bound foo"

### API Call "Contexts"

```js
function foo(el) {
	console.log( el, this.id );
}

var obj = {
	id: "awesome"
};

// use `obj` as `this` for `foo(..)` calls
[1, 2, 3].forEach( foo, obj ); // 1 awesome  2 awesome  3 awesome
```

### `new` Binding

```js
something = new MyClass(..);
```

* constructors are **just functions**
* known as a "constructor call"

### "Constructor Call"

1. new object is created
2. `[[Prototype]]`-linked
3. `this` binding for new object
4. return the newly constructed object

> In 4 step you can return another object with 'return' keyword

### "Constructor Call"

```js
function foo(a) {
	this.a = a;
}

var bar = new foo( 2 );
console.log( bar.a ); // 2
```

### Everything In Order

Which is more precedent, *implicit binding* or *explicit binding*?

```js
function foo() {
	console.log( this.a );
}
var obj1 = {
	a: 2,
	foo: foo
};
var obj2 = {
	a: 3,
	foo: foo
};
obj1.foo(); // 2
obj2.foo(); // 3
obj1.foo.call( obj2 ); // 3 - implistic take over
obj2.foo.call( obj1 ); // 2
```

### *new* Binding Order

```js
function foo(something) {
	this.a = something;
}
var obj1 = {
	foo: foo
};
var obj2 = {};
obj1.foo( 2 );
console.log( obj1.a ); // 2

obj1.foo.call( obj2, 3 );
console.log( obj2.a ); // 3

var bar = new obj1.foo( 4 );
console.log( obj1.a ); // 2
console.log( bar.a ); // 4
```
* not clear what the order 

### *new* Binding Order

Use hard binding to test order

```js
function foo(something) {
	this.a = something;
}

var obj1 = {};

var bar = foo.bind( obj1 );
bar( 2 );
console.log( obj1.a ); // 2

var baz = new bar( 3 );
console.log( obj1.a ); // 2 - doesn't change obj1
console.log( baz.a ); // 3
```
* Whoa! `bar` is hard-bound against `obj1

### Not With Our Version of 'bind'

```js
function bind(fn, obj) {
	return function() {
		fn.apply( obj, arguments );
	};
}
```

### Build-in 'bind' Allows

MDN polyfill, ES5 version is more complex 

```js
if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError( "Function.prototype.bind - what " +
				"is trying to be bound is not callable"
			);
		}
		var aArgs = Array.prototype.slice.call( arguments, 1 ),
			fToBind = this,
			fNOP = function(){},
			fBound = function(){
				return fToBind.apply(
					(
						this instanceof fNOP &&
						oThis ? this : oThis    // check for 'new' call
					),
					aArgs.concat( Array.prototype.slice.call( arguments ) )
				);
			}
		;
		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
		return fBound;
	};
}
```

### Currying

```js
function foo(p1,p2) {
	this.val = p1 + p2;
}

// using `null` here because we don't care about
// the `this` hard-binding in this scenario, and
// it will be overridden by the `new` call anyway!
var bar = foo.bind( null, "p1" );

var baz = new bar( "p2" );

baz.val; // p1p2
```

### Determining `this` rules

```js

// #1 - new Binding
var bar = new foo(); // `this` is the newly constructed object

// #2 - Explicit Binding
var bar = foo.call( obj2 ); // `this` is the explicitly specified object.

// #3 - Implicit Binding
var bar = obj1.foo(); // `this` is *that* context object.

// #4 - Default Binding
var bar = foo(); // `undefined` or global object

```

###  Binding Exceptions

Ignored this

```js
function foo() {
	console.log( this.a );
}

var a = 2;

foo.call( null ); // 2
```

### What about curring ?

```js
function foo(a,b) {
	console.log( "a:" + a + ", b:" + b );
}

// spreading out array as parameters
foo.apply( null, [2, 3] ); // a:2, b:3

// currying with `bind(..)`
var bar = foo.bind( null, 2 );
bar( 3 ); // a:2, b:3
```
* ES6 `foo(...[1,2])` fixes problem
* hiding danger 

### Safer this

```js
function foo(a,b) {
	console.log( "a:" + a + ", b:" + b );
}

// our DMZ empty object
var ø = Object.create( null );

// spreading out array as parameters
foo.apply( ø, [2, 3] ); // a:2, b:3

// currying with `bind(..)`
var bar = foo.bind( ø, 2 );
bar( 3 ); // a:2, b:3
```

### Indirection

```js
function foo() {
	console.log( this.a );
}

var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };

o.foo(); // 3
(p.foo = o.foo)(); // 2  - default binding
```

### Softening Binding

```js
if (!Function.prototype.softBind) {
	Function.prototype.softBind = function(obj) {
		var fn = this,
			curried = [].slice.call( arguments, 1 ),
			bound = function bound() {
				return fn.apply(
					(!this ||
						(typeof window !== "undefined" &&
							this === window) ||
						(typeof global !== "undefined" &&
							this === global)
					) ? obj : this,
					curried.concat.apply( curried, arguments )
				);
			};
		bound.prototype = Object.create( fn.prototype );
		return bound;
	};
}
```

### Softening Binding

```js
function foo() {
   console.log("name: " + this.name);
}

var obj = { name: "obj" },
    obj2 = { name: "obj2" },
    obj3 = { name: "obj3" };

var fooOBJ = foo.softBind( obj );

fooOBJ(); // name: obj

obj2.foo = foo.softBind(obj);
obj2.foo(); // name: obj2   <---- look!!!

fooOBJ.call( obj3 ); // name: obj3   <---- look!

setTimeout( obj2.foo, 10 ); // name: obj   <---- falls back to soft-binding
```

## Lexical `this`

ES6 introduces a special kind of function 

```js
function foo() {
	// return an arrow function
	return (a) => {
		// `this` here is lexically adopted from `foo()`
		console.log( this.a );
	};
}

var obj1 = {
	a: 2
};

var obj2 = {
	a: 3
};

var bar = foo.call( obj1 );
bar.call( obj2 ); // 2, not 3!
```
* arrow-function cannot be overridden 

## Lexical `this`

Common use-case

```js
function foo() {
	setTimeout(() => {
		// `this` here is lexically adopted from `foo()`
		console.log( this.a );
	},100);
}

var obj = {
	a: 2
};

foo.call( obj ); // 2
```
### Just a sugar for plain old practice

```js
function foo() {
	var self = this; // lexical capture of `this`
	setTimeout( function(){
		console.log( self.a );
	}, 100 );
}

var obj = {
	a: 2
};

foo.call( obj ); // 2
```


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

###  Mixing (Up) "Class" Objects

* Class Theory
* Class Mechanics
* Class Inheritance
* Mixins

### Class Theory

* "Class/Inheritance" - modeling real world problem domains in our software
* Compound data with behaviour
* Classes imply a way of *classifying* a certain data structure (Car, Vehicle)
    * Inheritance
* "Polymorphism" - override parent behaviour in it's child
    * relative Polymorphism - reference base behaviour from overridden behaviour

### "Class" Design Pattern

It's not about "Iterator", "Observer", etc

* "procedural programming"
    * lack of higher abstraction -> spaghetti code
    * classes were the proper way to organize code

* "functional programing"
    * classes are just one of several common design patterns

> Is it optional abstraction on top of code ?

* Java - no
* C/C++, PHP - yes

### JavaScript "Classes"

But does that mean JavaScript actually *has* classes?

> Plain and simple: **No.**

* ES6 provide `class` keyword
* it's all about implementing approximation of classic class functionality

> real mechanics is quite different

### Class Mechanics

* class `Stack`
* must instantiate `Stack`

### Building 

'Class' is a blue-print

<img src="img/fig1.png">

**This object is a *copy*** of all the characteristics described by the class.

### Constructor

> pseudo-code

```js
class CoolGuy {

	specialTrick = nothing

	CoolGuy( trick ) {
		specialTrick = trick
	}

	showOff() {
		output( "Here's my trick: ", specialTrick )
	}
}
```

### Constructor

```js
Joe = new CoolGuy( "jumping rope" )

Joe.showOff() // Here's my trick: jumping rope
```

* constructor of a class *belongs* to the 
* the same name as the class

### Class Inheritance

* parent/child metaphor 
* child class contains an initial copy of the behavior from the parent

> actually in parent/child metaphor we have to talk about two parent's DNA

### Revisit `Vehicle` and `Car`

> constructors omitted for brevity

```js
class Vehicle {
	engines = 1

	ignition() {
		output( "Turning on my engine." )
	}

	drive() {
		ignition()
		output( "Steering and moving forward!" )
	}
}

```

### Revisit `Vehicle` and `Car`

```js
class Car inherits Vehicle {
	wheels = 4

	drive() {
		inherited:drive()
		output( "Rolling on all ", wheels, " wheels!" )
	}
}

```

### Revisit `Vehicle` and `Car`

```js
class SpeedBoat inherits Vehicle {
	engines = 2

	ignition() {
		output( "Turning on my ", engines, " engines." )
	}

	pilot() {
		inherited:drive()
		output( "Speeding through the water with ease!" )
	}
}
```

### Polymorphism

* `Car`s `drive()` method calls `inherited:drive()`
* `SpeedBoat`s `pilot()` use inherited copy of `drive()`

We would call that technic 'relative polymorphism'

* any method can reference another method at higher level
* method name can have multiple definition at different levels

### Polymorphism

* `inherited:` -> `super`
* `drive()` and `ignition()` is defined in both `Vehicle` and `Car` 

> In JS ES6 class "solves" issue with `super`

### Class inheritance implies copies

<img src="fig1.png">

### Multiple Inheritance

<img src="fig2.png">

* "Diamond Problem"
* JS does not provide a native mechanism

### Mixins

JS's object mechanism does not *automatically* perform copy behavior when you "inherit" or "instantiate"

* object's liked together
* JS devs fake the missing copy behaviour

### Explicit Mixins

```js
// vastly simplified `mixin(..)` example:
function mixin( sourceObj, targetObj ) {
	for (var key in sourceObj) {
		// only copy if not already present
		if (!(key in targetObj)) {
			targetObj[key] = sourceObj[key];
		}
	}

	return targetObj;
}
```

### Explicit Mixins

```js
var Vehicle = {
	engines: 1,

	ignition: function() {
		console.log( "Turning on my engine." );
	},

	drive: function() {
		this.ignition();
		console.log( "Steering and moving forward!" );
	}
};

```

### Explicit Mixins

```js
var Car = mixin( Vehicle, {
	wheels: 4,

	drive: function() {
		Vehicle.drive.call( this );
		console.log( "Rolling on all " + this.wheels + " wheels!" );
	}
} );
```

* no classes, only objects
* functions are not duplicated

###"Polymorphism" Revisited

`Vehicle.drive.call( this )` - "explicit pseudo-polymorphism"

* creates manual/explicit linkage
* hard to maintain

### Mixing Copies

```js
// alternate mixin, less "safe" to overwrites
function mixin( sourceObj, targetObj ) {
	for (var key in sourceObj) {
		targetObj[key] = sourceObj[key];
	}

	return targetObj;
}

var Vehicle = {
	// ...
};

// first, create an empty object with
// Vehicle's stuff copied in
var Car = mixin( Vehicle, { } );

// now copy the intended contents into Car
mixin( {
	wheels: 4,

	drive: function() {
		// ...
	}
}, Car );
```

### Mixing Copies

* both share that same common objects (such as array)
* full copy doesn't occurs
* no direct way to handle collisions

### Parasitic Inheritance

```js
// "Traditional JS Class" `Vehicle`
function Vehicle() {
	this.engines = 1;
}
Vehicle.prototype.ignition = function() {
	console.log( "Turning on my engine." );
};
Vehicle.prototype.drive = function() {
	this.ignition();
	console.log( "Steering and moving forward!" );
};
```

### Parasitic Inheritance

```js
/ "Parasitic Class" `Car`
function Car() {
	// first, `car` is a `Vehicle`
	var car = new Vehicle();

	// now, let's modify our `car` to specialize it
	car.wheels = 4;

	// save a privileged reference to `Vehicle::drive()`
	var vehDrive = car.drive;

	// override `Vehicle::drive()`
	car.drive = function() {
		vehDrive.call( this );
		console.log( "Rolling on all " + this.wheels + " wheels!" );
	};

	return car;
}
```

### Parasitic Inheritance

```js
var myCar = new Car();

myCar.drive();
// Turning on my engine.
// Steering and moving forward!
// Rolling on all 4 wheels!
```

### Implicit Mixins

```js
var Something = {
	cool: function() {
		this.greeting = "Hello World";
		this.count = this.count ? this.count + 1 : 1;
	}
};

Something.cool();
Something.greeting; // "Hello World"
Something.count; // 1

var Another = {
	cool: function() {
		// implicit mixin of `Something` to `Another`
		Something.cool.call( this );
	}
};

Another.cool();
Another.greeting; // "Hello World"
Another.count; // 1 (not shared state with `Something`)
```
