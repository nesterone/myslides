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

//TBD
