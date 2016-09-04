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
There are two predominant models for how scope works:

* lexical scope
* dynamic scope

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

###Summary 

* `eval` and `with` affected by Stict Mode (deprecated)
* don't use 'eval' and 'with'

