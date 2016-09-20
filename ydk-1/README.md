###You Don't Know JS
#####scope & closure
inspired by [getify](https://github.com/getify/You-Dont-Know-JS/tree/master/scope%20%26%20closures)


###Presented by
* [Igor Nesterenko](https://twitter.com/nesterone)

###High-level Overview

* What is Scope?
* Lexical Scope
* Function vs. Block Scope
* Hoisting
* Scope Closures

###What is Scope?

Set of rules for storing variables in some location, and for finding those variables at a later time

###Compiled Language

JavaScript is not compiled well in advance, however it's compiled right before execution

###Compiler Theory

* Tokenizing/Lexing
* Parsing (AST)
* Code-Generation

###The Cast

1. *Engine*: start-to-finish compilation and execution program.

2. *Compiler*: handles all the dirty work of parsing and code-generation

3. *Scope*: collects and maintains declaration of all variables

###Compile Speaks

* *LHS* -  who's the target of the assignment
* *RHS* - who's the source of the assignment

###Right-hand Side (RHS)

```js
console.log( a );
```

* *RHS* - who's the source of the assignment

###Left-hand Side (LHS)

```js
a = 2;
```
* *LHS* -  who's the target of the assignment
     
### LHS and RHS

```js
function foo(a) {
    console.log( a ); // 2
}

foo( 2 );
```


### Engine/Scope Conversation

```js
function foo(a) {
    console.log( a ); // 2
}

foo( 2 );  // <- What`s 'foo' ?
```

> ***Engine***: Hey *Scope*, I have an RHS reference for `foo`. Ever heard of it?

> ***Scope***: Why yes, I have. *Compiler* declared it just a second ago. He's a function. Here you go.

### Engine/Scope Conversation

```js
function foo(a) {
    console.log( a ); // 2
}

foo( 2 ); // <- 'foo' is function, start execution ... 
```

> ***Engine***: Great, thanks! OK, I'm executing `foo`.

### Engine/Scope Conversation

```js
function foo(a) {   // <- I have LHS reference to 'a' What's 'a' ?  
    console.log( a ); // 2
}

foo( 2 ); 
```

> ***Engine***: Hey, *Scope*, I've got an LHS reference for `a`, ever heard of it?

> ***Scope***: Why yes, I have. *Compiler* declared it as a formal parameter to `foo` just recently. Here you go.

### Engine/Scope Conversation

```js
function foo(a) {   // <- 'a' is a formal parameter let's assign 2 to 'a'
    console.log( a ); // 2
}

foo( 2 ); 
```

> ***Engine***: Helpful as always, *Scope*. Thanks again. Now, time to assign `2` to `a`.

### Engine/Scope Conversation

```js
function foo(a) {   
    console.log( a ); // I have RHS for 'console'. What's 'console' ?
}

foo( 2 ); 
```

> ***Engine***: Hey, *Scope*, sorry to bother you again. I need an RHS look-up for `console`. Ever heard of it?

### Engine/Scope Conversation

```js
function foo(a) {   
    console.log( a ); // 'console' is a build in object, it has 'log' function 
}

foo( 2 ); 
```

> ***Scope***: No problem, *Engine*, this is what I do all day. Yes, I've got `console`. He's built-in. Here ya go.

> ***Engine***: Perfect. Looking up `log(..)`. OK, great, it's a function.

### Engine/Scope Conversation

```js
function foo(a) {   
    console.log( a ); // I have RHS to 'a'. Just to duble-check, What's 'a' ?
}

foo( 2 ); 
```

> ***Engine***: Yo, *Scope*. Can you help me out with an RHS reference to `a`. I think I remember it, but just want to double-check.

> ***Scope***: You're right, *Engine*. Same guy, hasn't changed. Here ya go.

### Engine/Scope Conversation

```js
function foo(a) {   
    console.log( a ); // passing 'a', which value is '2'
}

foo( 2 ); 
```

> ***Engine***: Cool. Passing the value of `a`, which is `2`, into `log(..)`.

### Quiz

```js
function foo(a) {
	var b = a;
	return a + b;
}

var c = foo( 2 );
```

* LHS - ?
* RHS - ?

### Quiz

```js
function foo(a) {   //LHS
	var b           //LHS
	    = a;        //RHS
	return a        //RHS
	        + b;    //RHS
}

var c               //LHS
    = foo(2);       //RHS           
```

* LHS - 3
* RHS - 4


###Nested Scope

```js
function foo(a) {
	console.log( a + b ); // Hey scope of 'foo'. I have RHS to 'b'.  What's 'b' ?
}

var b = 2;

foo( 2 ); // 4
```

> ***Engine***: "Hey, *Scope* of `foo`, ever heard of `b`? Got an RHS reference for it."

> ***Scope***: "Nope, never heard of it. Go fish."

###Nested Scope

```js
function foo(a) {
	console.log( a + b ); // Hey global scope. I have RHS to 'b'. . What's 'b' ? 
}

var b = 2;

foo( 2 ); // 4
```

> ***Engine***: "Hey, *Scope* outside of `foo`, oh you're the global *Scope*, ok cool. Ever heard of `b`? Got an RHS reference for it."

> ***Scope***: "Yep, sure have. Here ya go."

### Building Metaphors

<img src="img/fig1.png" width="250">



###Errors

```js
function foo(a) {
	console.log( a + b );
	b = a;
}

foo( 2 );
```

* *ReferenceError* - Scope resolution failure
    * Strict Mode
    * normal/relaxed/lazy mode
* *TypeError* - Scope resolution success, execution failure
 

##Lexical Scope

* Lex-time
    * Look-ups
* Cheating Lexical
    * eval
    * with
    * Performance

##Lexical Scope

There are two predominant models for how scope works:

* lexical scope
* dynamic scope (Bash, some Perl realizations, etc)

###Lex-time

Lexical scope is based on where variables and blocks of scope are authored, set in stone by the time the lexer process your code

```js
function foo(a) {

	var b = a * 2;

	function bar(c) {
		console.log( a, b, c );
	}

	bar(b * 3);
}

foo( 2 ); // 2 4 12
```

###Bubbles

<img src="img/fig2.png" width="500">

1. `foo`

1. `a`,`bar`,`b`

1. `c`

###Look-ups

<img src="img/fig2.png" width="500">

* scope look-up stops once it finds the first match

* multiple level of nested scope, "shadowing", access to globals 

* first class identifiers 

###Cheating Lexical

* `eval`
* `with`
* Performance

###eval

```js
function foo(str, a) {
	eval( str ); // cheating!
	console.log( a, b );
}

var b = 2;

foo( "var b = 3;", 1 ); // 1, 3
```

###eval in Strict Mode

```js
function foo(str) {
   "use strict";
   eval( str );
   console.log( a ); // ReferenceError: a is not defined
}

foo( "var a = 2" );
```

* `setTimeout`, `setInterval`
* `new Function(...)`

###with

```js
var obj = {
	a: 1,
	b: 2,
	c: 3
};

// more "tedious" to repeat "obj"
obj.a = 2;
obj.b = 3;
obj.c = 4;

// "easier" short-hand
with (obj) {
	a = 3;
	b = 4;
	c = 5;
}
```

###with - peculiar side-effect

```js
function foo(obj) {
	with (obj) {
		a = 2;
	}
}
var o1 = {
	a: 3
};
var o2 = {
	b: 3
};
foo( o1 );
console.log( o1.a ); // 2
foo( o2 );
console.log( o2.a ); // undefined
console.log( a ); // 2 -- Oops, leaked global!
```

###Performance

Cheating lexing usually turns into loosing engine`s optimization based on static code analyze during lex-time

###Cheating Lexing Summary 

* `eval` and `with` affected by Stict Mode (deprecated)
* don't use 'eval' and 'with'

##Function vs. Block Scope

* Scope from function
* Hiding In Plain Scope
* Functions as Scopes
* Block As Scope 

##Function vs. Block Scope

1. What exactly makes a new bubble? 
1. Is it only the function?
1. Can other structures in JavaScript create bubbles of scope?

###Scope from function

```js
function foo(a) {
	var b = 2;

	// some code

	function bar() {
		// ...
	}

	// more code

	var c = 3;
}

bar(); // fail
console.log(a, b, c) // all 3 fail

```

###Hiding in Plain Scope 

* "hide" variables and functions inside function
* Is it useful technique?
* "Principle of Least Privilege"

###Hiding in Plain Scope 

```js
function doSomething(a) {
	b = a + doSomethingElse( a * 2 );

	console.log( b * 3 );
}

function doSomethingElse(a) {
	return a - 1;
}

var b;

doSomething( 2 ); // 15
```

###Hiding in Plain Scope 

```js
function doSomething(a) {
	function doSomethingElse(a) {
		return a - 1;
	}

	var b;

	b = a + doSomethingElse( a * 2 );

	console.log( b * 3 );
}

doSomething( 2 ); // 15
```


### Collision Avoidance

```js
function foo() {
	function bar(a) {
		i = 3; // changing the `i` in the enclosing scope's for-loop
		console.log( a + i );
	}

	for (var i=0; i<10; i++) {
		bar( i * 2 ); // oops, infinite loop ahead!
	}
}

foo();
```

### Global "Namespaces"

```js
var MyReallyCoolLibrary = {
	awesome: "stuff",
	doSomething: function() {
		// ...
	},
	doAnotherThing: function() {
		// ...
	}
};
```

### Module Management

"Module" approach and using various dependencies managers help in avoiding `collisions`


### Functions As Scopes

```js
var a = 2;

function foo() { // <-- insert this

	var a = 3;
	console.log( a ); // 3

} // <-- and this
foo(); // <-- and this

console.log( a ); // 2
```

* How to not pollute enclosing scope with function`s name ?

### Functions As Scopes

```js
var a = 2;

(function foo(){ // <-- insert this

	var a = 3;
	console.log( a ); // 3

})(); // <-- and this

console.log( a ); // 2
```

* `function expression`

### Anonymous vs. Named

```js
setTimeout( function(){
	console.log("I waited 1 second!");
}, 1000 );
```

* quick and easy to type

### Anonymous Functions - Few drawbacks 

1. no function name in a call stack
1. no function name for recursion (arguments.callee is deprecated)
1. no self-documenting names

### Anonymous Functions - Best practice

```js
setTimeout( function timeoutHandler(){ // <-- Look, I have a name!
	console.log( "I waited 1 second!" );
}, 1000 );
```

### Invoking Function Expressions Immediately


```js
var a = 2;

(function IIFE(){

	var a = 3;
	console.log( a ); // 3

})();

console.log( a ); // 2
```

### IIFE with arguments

```js
var a = 2;

(function IIFE( global ){

	var a = 3;
	console.log( a ); // 3
	console.log( global.a ); // 2

})( window );

console.log( a ); // 2
```

### IIFE with `undefined`

```js
undefined = true; // setting a land-mine for other code! avoid!

(function IIFE( undefined ){

	var a;
	if (a === undefined) {
		console.log( "Undefined is safe here!" ); 
	}

})();
```

### IIFE inverts order of things


```js
var a = 2;

(function IIFE( def ){
	def( window );
})(function def( global ){

	var a = 3;
	console.log( a ); // 3
	console.log( global.a ); // 2

});
```

* like in UMD - Universal Module Definition

### Block As Scope 

Block scope is a tool to extend the earlier "Principle of Least Exposure"

```js
var foo = true;

if (foo) {
	var bar = foo * 2;
	bar = something( bar );
	console.log( bar );
}
```


### Block As Scope

```js
for (var i=0; i<10; i++) {
	console.log( i );
}
```

* `i` variable accessible out side of the loop   

### Block As Scope 

* with
* try/catch
* let
* const

### with

Creates (a form of) block scope from the object

### try/catch

```js
try {
	undefined(); // illegal operation to force an exception!
}
catch (err) {
	console.log( err ); // works!
}

console.log( err ); // ReferenceError: `err` not found
```

> some code linters complains 

### let

```js
var foo = true;

if (foo) {
	let bar = foo * 2;
	bar = something( bar );
	console.log( bar );
}

console.log( bar ); // ReferenceError
```

### let 

```js
{
   console.log( bar ); // ReferenceError!
   let bar = 2;
}
```

### Garbage Collection

```js
function process(data) {
	// do something interesting
}

var someReallyBigData = { .. };

process( someReallyBigData );

var btn = document.getElementById( "my_button" );

btn.addEventListener( "click", function click(evt){
	console.log("button clicked");
}, /*capturingPhase=*/false );
```

* depends from engine implementation

### Garbage Collection

```js
function process(data) {
	// do something interesting
}

// anything declared inside this block can go away after!
{
	let someReallyBigData = { .. };

	process( someReallyBigData );
}

var btn = document.getElementById( "my_button" );

btn.addEventListener( "click", function click(evt){
	console.log("button clicked");
}, /*capturingPhase=*/false );
```

### `let` Loops

```js
for (let i=0; i<10; i++) {
	console.log( i );
}

console.log( i ); // ReferenceError
```

### `let` Loops re-binding


```js
{
	let j;
	for (j=0; j<10; j++) {
		let i = j; // re-bound for each iteration!
		console.log( i );
	}
}
```

> benefits more visible when combining with closure 

### `let` refactoring

```js
var foo = true, baz = 10;

if (foo) {
	var bar = 3;

	if (baz > bar) {
		console.log( baz );
	}

	// ...
}
```

### `let` refactoring

```js
var foo = true, baz = 10;

if (foo) {
	var bar = 3;

	// ...
}

if (baz > bar) {
	console.log( baz );
}
```

### `let` refactoring

```js
var foo = true, baz = 10;

if (foo) {
	let bar = 3;

	if (baz > bar) { // <-- don't forget `bar` when moving!
		console.log( baz );
	}
}
```

### `const`

```js
var foo = true;

if (foo) {
	var a = 2;
	const b = 3; // block-scoped to the containing `if`

	a = 3; // just fine!
	b = 4; // error!
}

console.log( a ); // 3
console.log( b ); // ReferenceError!
```

## Hoisting 

* Chicken or Egg ?
* The Compile Strikes Again
* Function First

### Chicken or Egg

```js
a = 2;

var a;         

console.log( a );
```

### Chicken or Egg

```js        
console.log( a );

var a = 2;
```

### The Compiler Strikes Again

```js
var a;

a = 2;

console.log( a );
```

### Only Declaration(egg) First Not Assignment

```js
var a;

console.log( a );

a = 2;
```

### Ok. What about functions ?

```js
foo();

function foo() {
	console.log( a ); // undefined

	var a = 2;
}
```

### From Compiler Point of View

```js
function foo() {  // function declaration
	var a;

	console.log( a ); // undefined

	a = 2;
}

foo();
```
### Function Expression 

```js
foo(); // not ReferenceError, but TypeError!

var foo = function bar() {
	// ...
};
```
### Function Expression with Name


```js
foo(); // TypeError
bar(); // ReferenceError

var foo = function bar() {
	// ...
};
```

### From Compiler Point of View

```js
var foo;

foo(); // TypeError
bar(); // ReferenceError

foo = function() {
	var bar = ...self...
	// ...
}
```

## Functions First


```js
foo(); // 1

var foo;

function foo() {
	console.log( 1 );
}

foo = function() {
	console.log( 2 );
};
```

## Functions First (by Engine)

```js
function foo() {
	console.log( 1 );
}

foo(); // 1

foo = function() {
	console.log( 2 );
};
```

## Functions First (multiple declarations)

```js
foo(); // 3

function foo() {
	console.log( 1 );
}

var foo = function() {
	console.log( 2 );
};

function foo() {
	console.log( 3 );
}
```

## Functions First (multiple declarations)

```js
foo(); // "b"

var a = true;
if (a) {
   function foo() { console.log( "a" ); }
}
else {
   function foo() { console.log( "b" ); }
}
```

## Scope Closure

Closure is all around you in JavaScript, you just have to recognize and embrace it.

### Nitty Gritty

```js
function foo() {
	var a = 2;

	function bar() {
		console.log( a ); // 2
	}

	bar();
}

foo();
```

* Is this "closure"?

### Make it visible

```js
function foo() {
	var a = 2;

	function bar() {
		console.log( a );
	}

	return bar;
}

var baz = foo();

baz(); // 2 -- Whoa, closure was just observed, man.
```

### In any various ways

```js
function foo() {
	var a = 2;

	function baz() {
		console.log( a ); // 2
	}

	bar( baz );
}

function bar(fn) {
	fn(); // look ma, I saw closure!
}
```

### In any various ways

```js
var fn;
function foo() {
	var a = 2;
	function baz() {
		console.log( a );
	}
	fn = baz; // assign `baz` to global variable
}
function bar() {
	fn(); // look ma, I saw closure!
}
foo();
bar(); // 2
```

### Now I Can See

```js
function wait(message) {

	setTimeout( function timer(){
		console.log( message );
	}, 1000 );

}

wait( "Hello, closure!" );
```

### Now I Can See

```js
function setupBot(name,selector) {
	$( selector ).click( function activator(){
		console.log( "Activating: " + name );
	} );
}

setupBot( "Closure Bot 1", "#bot_1" );
setupBot( "Closure Bot 2", "#bot_2" );
```

### Observation of closure

```js
var a = 2;

(function IIFE(){
	console.log( a );
})();
```

## Loops + Closure

```js
for (var i=1; i<=5; i++) {
	setTimeout( function timer(){
		console.log( i );
	}, i*1000 );
}
```

### Eureka! It works!

```js
for (var i=1; i<=5; i++) {
	(function(j){
		setTimeout( function timer(){
			console.log( j );
		}, j*1000 );
	})( i ); // <- Attention
}
```

### Block Scoping Revisited

```js
for (var i=1; i<=5; i++) {
	let j = i; // yay, block-scope for closure!
	setTimeout( function timer(){
		console.log( j );
	}, j*1000 );
}
```

## Modules

```js
function foo() {
	var something = "cool";
	var another = [1, 2, 3];

	function doSomething() {
		console.log( something );
	}

	function doAnother() {
		console.log( another.join( " ! " ) );
	}
}
```

### Revealing Module

```js
function CoolModule() {
	var something = "cool";
	var another = [1, 2, 3];
	function doSomething() {
		console.log( something );
	}
	function doAnother() {
		console.log( another.join( " ! " ) );
	}
	return {
		doSomething: doSomething,
		doAnother: doAnother
	};
}
var foo = CoolModule();
foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

### Module Pattern

```js
var foo = (function CoolModule() {
	var something = "cool";
	var another = [1, 2, 3];
	function doSomething() {
		console.log( something );
	}
	function doAnother() {
		console.log( another.join( " ! " ) );
	}
	return {
		doSomething: doSomething,
		doAnother: doAnother
	};
})();
foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

### Passing Parameters

```js
function CoolModule(id) {
	function identify() {
		console.log( id );
	}

	return {
		identify: identify
	};
}

var foo1 = CoolModule( "foo 1" );
var foo2 = CoolModule( "foo 2" );

foo1.identify(); // "foo 1"
foo2.identify(); // "foo 2"
```

### Public API

```js
var foo = (function CoolModule(id) {
	function change() {
		// modifying the public API
		publicAPI.identify = identify2;
	}
	function identify1() {
		console.log( id );
	}
	function identify2() {
		console.log( id.toUpperCase() );
	}
	var publicAPI = {
		change: change,
		identify: identify1
	};
	return publicAPI;
})( "foo module" );
foo.identify(); // foo module
foo.change();
foo.identify(); // FOO MODULE
```

### Modern Modules

```js
var MyModules = (function Manager() {
	var modules = {};
	function define(name, deps, impl) {
		for (var i=0; i<deps.length; i++) {
			deps[i] = modules[deps[i]];
		}
		modules[name] = impl.apply( impl, deps );
	}
	function get(name) {
		return modules[name];
	}
	return {
		define: define,
		get: get
	};
})();
```

### Define Module 'bar'

```js
MyModules.define( "bar", [], function(){
	function hello(who) {
		return "Let me introduce: " + who;
	}

	return {
		hello: hello
	};
} );
```

### Define Module 'foo'

```js
MyModules.define( "foo", ["bar"], function(bar){
	var hungry = "hippo";

	function awesome() {
		console.log( bar.hello( hungry ).toUpperCase() );
	}

	return {
		awesome: awesome
	};
} );
```

### Use Modules

```js

var bar = MyModules.get( "bar" );
var foo = MyModules.get( "foo" );

console.log(
	bar.hello( "hippo" )
); // Let me introduce: hippo

foo.awesome(); // LET ME INTRODUCE: HIPPO
```

## Future Modules

ES6 adds first-class syntax support for the concept of modules.

### bar.js

```js
function hello(who) {
	return "Let me introduce: " + who;
}

export hello;
```

### foo.js

```js
// import only `hello()` from the "bar" module
import hello from "bar";

var hungry = "hippo";

function awesome() {
	console.log(
		hello( hungry ).toUpperCase()
	);
}

export awesome;
```
