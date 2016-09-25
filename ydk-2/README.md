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

//TBD

###*this* All Makes Sense Now

//TBD

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



