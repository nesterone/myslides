###You Don't Know JS: Async & Performance
#####async & performance
inspired by [getify](https://github.com/getify/You-Dont-Know-JS/tree/master/async%20%26%20performance)

### Presented by
* [Igor Nesterenko](https://twitter.com/nesterone)

## High-level Overview

* Asynchrony: Now & Later
* Callbacks
* Promises
* Generators
* Program Performance
* Benchmarking & Tuning


## Asynchrony: Now & Later

* A Program in Chunks
* Event Loop
* Parallel Threading
* Concurrency
* Jobs
* Review

### Asynchrony: Now & Later

* How to express and manipulate program behavior spread out over a period of time ?
* We're going to have to understand much more deeply what asynchrony is and how it operates in JS 

### A Program in Chunks

```js
// ajax(..) is some arbitrary Ajax function given by a library
var data = ajax( "http://some.url.1" );

console.log( data );
// Oops! `data` generally won't have the Ajax results
```

### Callback

```js
// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", function myCallbackFunction(data){

	console.log( data ); // Yay, I gots me some `data`!

} );
```

* never, ever do sync ajax request...


### Find now and later


```js
function now() {
	return 21;
}

function later() {
	answer = answer * 2;
	console.log( "Meaning of life:", answer );
}

var answer = now();

setTimeout( later, 1000 ); // Meaning of life: 42
```

### More Explicit

Now:
```js
function now() {
	return 21;
}

function later() { .. }

var answer = now();

setTimeout( later, 1000 );
```
Later:
```js
answer = answer * 2;
console.log( "Meaning of life:", answer );
```

### Async Console

```js
var a = {
	index: 1
};

// later
console.log( a ); // ??

// even later
a.index++;
```

* `console.log` doesn't guaranty immediate output
*  breakpoints and `JSON.stringify` for object snapshot


## Event Loop

* Before ES6, no direct notion of async build into JS
* JS engine execute single chunk of code when asked... by whom?
* JS engine doesn't run in isolation, always inside a hosting env.

### What is the event loop ?

Let's conceptualize:

```js
// `eventLoop` is an array that acts as a queue (first-in, first-out)
var eventLoop = [ ];
var event;

// keep going "forever"
while (true) {
	// perform a "tick"
	if (eventLoop.length > 0) {
		// get the next event in the queue
		event = eventLoop.shift();

		// now, execute the next event
		try {
			event();
		}
		catch (err) {
			reportError(err);
		}
	}
}
```

### `setTimeout(..)`

You're guaranteed (roughly speaking) that your callback won't fire *before* the time interval you specify

### ES6 and `event loop`

* ES6 now specifies how the event loop works
* main reason is `ES6 Promise`

## Parallel Threading

* "async" - about gat between `now` and `later`
* "parallel" - about things being able to occur simultaneously

### Parallel Computing 

* processes
    * threads (share memory of single process)
* separate processors or separate computers

### Event Loop by Contrast

* break work into tasks and execute them in serial
* disallowing parallel access and changes in memory

### Dozen different low-level operations

```js
function later() {
	answer = answer * 2;  
	console.log( "Meaning of life:", answer );
}
```

* assignment
* reading of `answer`
* multiplication by `2`

### Unpredictable Behaviour of Parallel System

```js
var a = 20;

function foo() {
	a = a + 1;
}

function bar() {
	a = a * 2;
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", foo );
ajax( "http://some.url.2", bar );
```
* 42 - ?
* 41 - ?

### Thread 1 (`X` and `Y` are temporary memory locations)

```
foo():
  a. load value of `a` in `X`
  b. store `1` in `Y`
  c. add `X` and `Y`, store result in `X`
  d. store value of `X` in `a`
```

### Thread 2 (`X` and `Y` are temporary memory locations)

```
bar():
  a. load value of `a` in `X`
  b. store `2` in `Y`
  c. multiply `X` and `Y`, store result in `X`
  d. store value of `X` in `a`
```

### If truly parallel, then Case 1

```
1a  (load value of `a` in `X`   ==> `20`)
2a  (load value of `a` in `X`   ==> `20`)
1b  (store `1` in `Y`   ==> `1`)
2b  (store `2` in `Y`   ==> `2`)
1c  (add `X` and `Y`, store result in `X`   ==> `22`)
1d  (store value of `X` in `a`   ==> `22`)
2c  (multiply `X` and `Y`, store result in `X`   ==> `44`)
2d  (store value of `X` in `a`   ==> `44`)
```

* `a` will be `44`

### If truly parallel, then Case 1

```
1a  (load value of `a` in `X`   ==> `20`)
2a  (load value of `a` in `X`   ==> `20`)
2b  (store `2` in `Y`   ==> `2`)
1b  (store `1` in `Y`   ==> `1`)
2c  (multiply `X` and `Y`, store result in `X`   ==> `20`)
1c  (add `X` and `Y`, store result in `X`   ==> `21`)
1d  (store value of `X` in `a`   ==> `21`)
2d  (store value of `X` in `a`   ==> `21`)
```

* `a` will be `21`
* yep, threaded programming is very tricky 


### Run-to-Completion

* Code inside of `foo()` (and `bar()`) is atomic

```js
var a = 1;
var b = 2;

function foo() {
	a++;
	b = b * a;
	a = b + 3;
}

function bar() {
	b--;
	a = 8 + b;
	b = a * 2;
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", foo );
ajax( "http://some.url.2", bar );
```

### In Chunks

* chunk 1 - happens now (sync)
* chunk 2 and 3 happens later (async)

Chunk 1:
```js
var a = 1;
var b = 2;
```

Chunk 2 (`foo()`):
```js
a++;
b = b * a;
a = b + 3;
```

Chunk 3 (`bar()`):
```js
b--;
a = 8 + b;
b = a * 2;
```

### Outcome 1

```js
var a = 1;
var b = 2;

// foo()
a++;
b = b * a;
a = b + 3;

// bar()
b--;
a = 8 + b;
b = a * 2;

a; // 11
b; // 22
```

### Outcome 2

```js
var a = 1;
var b = 2;

// bar()
b--;
a = 8 + b;
b = a * 2;

// foo()
a++;
b = b * a;
a = b + 3;

a; // 183
b; // 180
```

### "Race Condition"

Cannot predict reliably how a and b will turn out

### ES6 Generators

Introduces special type of function which doesn't have 'run-to-completion' behaviour

## Concurrency

Concurrency is when two or more "processes" are executing simultaneously over the same period

> Prefer "process" over "task" because terminology-wise

### Use Case: Scroll and Ajax

* user scrolls fast enought, many `onscroll` events fired
* ajax responses taking place

### "Process" 1 (`onscroll` events)

```
onscroll, request 1
onscroll, request 2
onscroll, request 3
onscroll, request 4
onscroll, request 5
onscroll, request 6
onscroll, request 7
```

### "Process" 2 (Ajax response events)

```
response 1
response 2
response 3
response 4
response 5
response 6
response 7
```

### 'onscroll' and Ajax request at the same moment

```
onscroll, request 1
onscroll, request 2          response 1
onscroll, request 3          response 2
response 3
onscroll, request 4
onscroll, request 5
onscroll, request 6          response 4
onscroll, request 7
response 6
response 5
response 7
```

### Event Loop Queue

```
onscroll, request 1   <--- Process 1 starts
onscroll, request 2
response 1            <--- Process 2 starts
onscroll, request 3
response 2
response 3
onscroll, request 4
onscroll, request 5
onscroll, request 6
response 4
onscroll, request 7   <--- Process 1 finishes
response 6
response 5
response 7            <--- Process 2 finishes
```

Notice how `response 6` and `response 5` came back out of expected order?

### Noninteracting

```js
var res = {};

function foo(results) {
	res.foo = results;
}

function bar(results) {
	res.bar = results;
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", foo );
ajax( "http://some.url.2", bar );
```

* if not interaction then non-determinism is perfectly acceptable


### Sometimes broken without coordination 

```js
var res = [];

function response(data) {
	res.push( data );
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", response );
ajax( "http://some.url.2", response );
```

### Coordinated Interaction

```js
var res = [];

function response(data) {
	if (data.url == "http://some.url.1") {
		res[0] = data;
	}
	else if (data.url == "http://some.url.2") {
		res[1] = data;
	}
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", response );
ajax( "http://some.url.2", response );
```

### Always broken without coordination 

```js
var a, b;

function foo(x) {
	a = x * 2;
	baz();
}

function bar(y) {
	b = y * 2;
	baz();
}

function baz() {
	console.log(a + b); // ops !!!
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", foo );
ajax( "http://some.url.2", bar );
```

### Simple way to address issue

```js
var a, b;

function foo(x) {
	a = x * 2;
	if (a && b) {
		baz();
	}
}

function bar(y) {
	b = y * 2;
	if (a && b) {
		baz();
	}
}

function baz() {
	console.log( a + b );
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", foo );
ajax( "http://some.url.2", bar );
```

### Another broken code

```js
var a;

function foo(x) {
	a = x * 2;
	baz();
}

function bar(x) {
	a = x / 2;
	baz();
}

function baz() {
	console.log( a );
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", foo );
ajax( "http://some.url.2", bar );
```

### Let only the first to got thought

```js
var a;

function foo(x) {
	if (a == undefined) {
		a = x * 2;
		baz();
	}
}
function bar(x) {
	if (a == undefined) {
		a = x / 2;
		baz();
	}
}
function baz() {
	console.log( a );
}
// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", foo );
ajax( "http://some.url.2", bar );
```

### Cooperation

```js
var res = [];

// `response(..)` receives array of results from the Ajax call
function response(data) {
	// add onto existing `res` array
	res = res.concat(
		// make a new transformed array with all `data` values doubled
		data.map( function(val){
			return val * 2;
		} )
	);
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", response );
ajax( "http://some.url.2", response );
```
* with really bug `data` can hangs UI for few seconds

### Break long-running "process" into steps

```js
var res = [];
// `response(..)` receives array of results from the Ajax call
function response(data) {
	// let's just do 1000 at a time
	var chunk = data.splice( 0, 1000 );

	// add onto existing `res` array
	res = res.concat(
		// make a new transformed array with all `chunk` values doubled
		chunk.map( function(val){
			return val * 2;
		} )
	);
	// anything left to process?
	if (data.length > 0) {
		// async schedule next batch
		setTimeout( function(){
			response( data );
		}, 0 );
	}
}
// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", response );
ajax( "http://some.url.2", response );
```

### Controlling Event Loop Ordering

* no single direct way to ensure async event ordering
* `setTimeout(..)` hack to push function at the end of event loop queue
* `process.nextTick(..)` Node.js analog

## Jobs

* ES6 provides "Job queue" concept

```js
console.log( "A" );

setTimeout( function(){
	console.log( "B" );
}, 0 );

// theoretical "Job API"
schedule( function(){
	console.log( "C" );

	schedule( function(){
		console.log( "D" );
	} );
} );
```

* print out `A C D B` instead of `A B C D`

## Review

* JS program is (practically) always broken into chucks (now and later)
* The event loop runs until the queue is empty
* Each iteration of the event loop is a "tick"
* UI, IO, timers are events in queue
* Only one event can be processed from the queue at a time
* Concurrency is when two or more chains of events interleave over time
* It's often necessary to do some form of interaction coordination between these concurrent "processes"

## Callbacks

* Continuations
* Sequential Brain
* Trust Issues
* Trying to Save Callbacks
* Review

## Plain old way to deal with async

* from the beginning of JS
* no a best async pattern

Let's review it in depth


## Continuations

```js
// A  - now
ajax( "..", function(..){
	// C - later
} );
// B -now 
```

Let's make the code even simpler:

```js
// A
setTimeout( function(){
	// C
}, 1000 );
// B
```

* stop for a moment and think


## Sequence of thoughts 

1. Do A, then set up a timeout to wait 1,000 milliseconds, then once that fires, do C.
1. Do A, setup the timeout for 1,000 milliseconds, then do B, then after the timeout fires, do C

## Sequential Brain

* it's a fake multitasking, just fast context switcher
* our brain works kinda `event loop`

### Doing Versus Planning

* following mental plan, however switching happens
* desire to relay for sequence A -> B -> C

### Plan things out carefully, sequentially

```js
// swap `x` and `y` (via temp variable `z`)
z = x;
x = y;
y = z;
```

* Thankfully, we don't need to bother with async here

### Async evented code is hard to reason

Because it's not how our brain planning works

Especially when all in callbacks ... 

### Nested/Chained Callbacks

```js
listen( "click", function handler(evt){
	setTimeout( function request(){
		ajax( "http://some.url.1", function response(text){
			if (text == "hello") {
				handler();
			}
			else if (text == "world") {
				request();
			}
		} );
	}, 500) ;
} );
```

* "callback hell"
* "pyramid of doom"


### Split in `now` and `later`

First (*now*), we:

```js
listen( "..", function handler(..){
	// ..
} );
```

Then *later*, we:

```js
setTimeout( function request(..){
	// ..
}, 500) ;
```

Then still *later*, we:

```js
ajax( "..", function response(..){
	// ..
} );
```

And finally (most *later*), we:

```js
if ( .. ) {
	// ..
}
else ..
```

### Another Scenario

```js
doA( function(){
	doB();

	doC( function(){
		doD();
	} )

	doE();
} );

doF();
```

* `doA()`
* `doF()`
* `doB()`
* `doC()`
* `doE()`
* `doD()`

### Name in top-down order

```js
doA( function(){
	doC();

	doD( function(){
		doF();
	} )

	doE();
} );

doB();
```

### Review Order

`A -> B -> C -> D -> E -> F`

What if `doA(..)` or `doD(..)` aren't actually async ?

`A -> C -> D -> F -> E -> B`

### "Callback Hell"

It's not about nesting/identation

It's about reasoning about your async flow 


### Trust Issue

```js
// A
ajax( "..", function(..){
	// C
} );
// B
```

We call this "inversion of control," when you take part of your program and give over control of its execution to another third party

### Tale of Five Callbacks

```js
analytics.trackPurchase( purchaseData, function(){
	chargeCreditCard();
	displayThankyouPage();
} );
```

What's next?

### 5 months later

```js
var tracked = false;

analytics.trackPurchase( purchaseData, function(){
	if (!tracked) {
		tracked = true;
		chargeCreditCard();
		displayThankyouPage();
	}
} );
```

### List of things that could go wrong

* Call the callback too early (before it's been tracked)
* Call the callback too late (or never)
* Call the callback too few or too many times (like the problem you encountered!)
* Fail to pass along any necessary environment/parameters to your callback
* Swallow any errors/exceptions that may happen
* ...

### Overly trusting of input

```js
function addNumbers(x,y) {
	// + is overloaded with coercion to also be
	// string concatenation, so this operation
	// isn't strictly safe depending on what's
	// passed in.
	return x + y;
}

addNumbers( 21, 21 );	// 42
addNumbers( 21, "21" );	// "2121"
```

### Defensive against untrusted input

```js
function addNumbers(x,y) {
	// ensure numerical input
	x = Number( x );
	y = Number( y );

	// + will safely do numeric addition
	return x + y;
}

addNumbers( 21, 21 );	// 42
addNumbers( 21, "21" );	// 42
```

### Most troublesome problem with callbacks

*inversion of control* leading to a complete breakdown along all  trust lines

## Trying to Save Callbacks

```js
function success(data) {
	console.log( data );
}

function failure(err) {
	console.error( err );
}

ajax( "http://some.url.1", success, failure );
```

* error and success callbacks

### "Error-first style"

```js
function response(err,data) {
	// error?
	if (err) {
		console.error( err );
	}
	// otherwise, assume success
	else {
		console.log( data );
	}
}

ajax( "http://some.url.1", response );
```

###  What about the trust issue of never being called?

```js
function timeoutify(fn,delay) {
	var intv = setTimeout( function(){
			intv = null;
			fn( new Error( "Timeout!" ) );
		}, delay )
	;

	return function() {
		// timeout hasn't happened yet?
		if (intv) {
			clearTimeout( intv );
			fn.apply( this, [ null ].concat( [].slice.call( arguments ) ) );
		}
	};
}
```

### Timeoutify

```js
// using "error-first style" callback design
function foo(err,data) {
	if (err) {
		console.error( err );
	}
	else {
		console.log( data );
	}
}

ajax( "http://some.url.1", timeoutify( foo, 500 ) );
```

### Nondeterminism with sync-or-async

* ["Callbacks, synchronous and asynchronous"](http://blog.ometer.com/2011/07/24/callbacks-synchronous-and-asynchronous/)

* ["Designing APIs for Asynchrony"](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)


### "Never release Zalgo"

```js
function result(data) {
	console.log( a );
}

var a = 0;

ajax( "..pre-cached-url..", result );
a++;
```

Always be async

### `asyncify(..)` boilerplate

```js
function result(data) {
	console.log( a );
}

var a = 0;

ajax( "..pre-cached-url..", asyncify( result ) );
a++;
```

* problem solved, but it inefficient
* better to use build-in language mechanics to deal with it

## Review

* callbacks are the fundamental unit of asynchrony in JS
* our brains desire sequential thinking
* we need express async in more sync more
* callbacks suffer from *inversion of control*
* all async problems could be solved with callback, however code would be clunkier
* JS demands for more sophisticated and capable async patterns
