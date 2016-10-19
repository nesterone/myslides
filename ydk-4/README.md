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

## Promises

* What Is a Promise?
* Thenable Duck Typing
* Promise Trust
* Chain Flow
* Error Handling
* Promise Patterns
* Promise API Recap
* Promise Limitations
* Review

## What Is a Promise?

* Future Value
* Completion Event

### Promise as Future Value

Cheesburger metaphor 

### Values Now and Later

```js
var x, y = 2;

console.log( x + y ); // NaN  <-- because `x` isn't set yet
```

### Solve with callbacks

```js
function add(getX,getY,cb) {
	var x, y;
	getX( function(xVal){
		x = xVal;
		// both are ready?
		if (y != undefined) {
			cb( x + y );	// send along sum
		}
	} );
	getY( function(yVal){
		y = yVal;
		// both are ready?
		if (x != undefined) {
			cb( x + y );	// send along sum
		}
	} );
}

// `fetchX()` and `fetchY()` are sync or async
// functions
add( fetchX, fetchY, function(sum){
	console.log( sum ); // that was easy, huh?
} );
```

### Promise Value

```js
function add(xPromise,yPromise) {
	// `Promise.all([ .. ])` takes an array of promises,
	// and returns a new promise that waits on them
	// all to finish
	return Promise.all( [xPromise, yPromise] )

	// when that promise is resolved, let's take the
	// received `X` and `Y` values and add them together.
	.then( function(values){
		// `values` is an array of the messages from the
		// previously resolved promises
		return values[0] + values[1];
	} );
}
// `fetchX()` and `fetchY()` return promises for
// their respective values, which may be ready
// *now* or *later*.
add( fetchX(), fetchY() )

// we get a promise back for the sum of those
// two numbers.
// now we chain-call `then(..)` to wait for the
// resolution of that returned promise.
.then( function(sum){
	console.log( sum ); // that was easier!
} );
```

### Too Layers of Promises

1. `fetchX()` and `fetchY()` 
1. `Promise.all([ .. ])` 

and chaining with `.then(..)`


### Promise as Completion Event

Create control-flow mechanic: `this-then-that`
 
```js
function foo(x) {
	// start doing something that could take a while

	// make a `listener` event notification
	// capability to return

	return listener;
}

var evt = foo( 42 );

evt.on( "completion", function(){
	// now we can do the next step!
} );

evt.on( "failure", function(err){
	// oops, something went wrong in `foo(..)`
} );
```

* *separation of concerns*
* inversion of inversion of control -> restoring control back

### Promise "Events"

```js
function foo(x) {
	// start doing something that could take a while

	// construct and return a promise
	return new Promise( function(resolve,reject){
		// eventually, call `resolve(..)` or `reject(..)`,
		// which are the resolution callbacks for
		// the promise.
	} );
}

var p = foo( 42 );

bar( p );

baz( p );
```

### Promise "Events" Usage

```js
function bar(fooPromise) {
	// listen for `foo(..)` to complete
	fooPromise.then(
		function(){
			// `foo(..)` has now finished, so
			// do `bar(..)`'s task
		},
		function(){
			// oops, something went wrong in `foo(..)`
		}
	);
}

// ditto for `baz(..)`
```

### In Another Way 

```js
function bar() {
	// `foo(..)` has definitely finished, so
	// do `bar(..)`'s task
}

function oopsBar() {
	// oops, something went wrong in `foo(..)`,
	// so `bar(..)` didn't run
}

// ditto for `baz()` and `oopsBaz()`

var p = foo( 42 );

p.then( bar, oopsBar ); // other error handline approach

p.then( baz, oopsBaz );  //  chaining isn`t used here ... 
```

## Thenable Duck Typing

`Promise.resolve(..)` try to use your input as `thenable` object before wrapping in promise

## Promise Trust

* Call the callback too early
* Call the callback too late (or never)
* Call the callback too few or too many times
* Fail to pass along any necessary environment/parameters
* Swallow any errors/exceptions that may happen

### Calling Too Early

It's about sync-or-async issue

Promise can't be observed synchronously

> "Jobs" extension to `event-loop` in ES6

### Calling Too Late

```js
p.then( function(){
	p.then( function(){
		console.log( "C" );
	} );
	console.log( "A" );
} );
p.then( function(){
	console.log( "B" );
} );
// A B C
```

Here, `"C"` cannot interrupt and precede `"B"`, by virtue of how Promises are defined to operate.

### Promise Scheduling Quirks

```js
var p3 = new Promise( function(resolve,reject){
	resolve( "B" );
} );

var p1 = new Promise( function(resolve,reject){
	resolve( p3 );
} );

var p2 = new Promise( function(resolve,reject){
	resolve( "A" );
} );

p1.then( function(v){
	console.log( v );
} );

p2.then( function(v){
	console.log( v );
} );

// A B  <-- not  B A  as you might expect
```

### Never Calling the Callback

```js
// a utility for timing out a Promise
function timeoutPromise(delay) {
	return new Promise( function(resolve,reject){
		setTimeout( function(){
			reject( "Timeout!" );
		}, delay );
	} );
}

// setup a timeout for `foo()`
Promise.race( [
	foo(),					// attempt `foo()`
	timeoutPromise( 3000 )	// give it 3 seconds
] )
.then(
	function(){
		// `foo(..)` fulfilled in time!
	},
	function(err){
		// either `foo()` rejected, or it just
		// didn't finish in time, so inspect
		// `err` to know which
	}
);
```

### Calling Too Few or Too Many Times

Promise can only be resolved once

### Failing to Pass Along Any Parameters/Environment

* Promises can have, at most, one resolution value (fulfillment or rejection)
* `resolve(..)` or `reject(..)` silently ignore other than first value

### Swallowing Any Errors/Exceptions

```js
var p = new Promise( function(resolve,reject){
	foo.bar();	// `foo` is not defined, so error!
	resolve( 42 );	// never gets here :(
} );

p.then(
	function fulfilled(){
		// never gets here :(
	},
	function rejected(err){
		// `err` will be a `TypeError` exception object
		// from the `foo.bar()` line.
	}
);
```

* solve "Zalgo" moment when error can convert async in sync 

### Error Handing and immutability side effect

```js
var p = new Promise( function(resolve,reject){
	resolve( 42 );
} );

p.then(
	function fulfilled(msg){
		foo.bar();          // throw an error
		console.log( msg );	// never gets here :(
	},
	function rejected(err){
		// never gets here either :(
	}
);
```

### Trustable Promise?

Convert non-Promise to promise

```js
var p1 = Promise.resolve( 42 );

var p2 = Promise.resolve( p1 );

p1 === p2; // true
```

### Converting thenables

```js
var p = {
	then: function(cb) {
		cb( 42 );
	}
};

// this works OK, but only by good fortune
p
.then(
	function fulfilled(val){
		console.log( val ); // 42
	},
	function rejected(err){
		// never gets here
	}
);
```

### Converting thenables

```js
var p = {
	then: function(cb,errcb) {
		cb( 42 );
		errcb( "evil laugh" );
	}
};

p
.then(
	function fulfilled(val){
		console.log( val ); // 42
	},
	function rejected(err){
		// oops, shouldn't have run
		console.log( err ); // evil laugh
	}
);
```

### Converting thenables


```js
Promise.resolve( p )
.then(
	function fulfilled(val){
		console.log( val ); // 42
	},
	function rejected(err){
		// never gets here
	}
);
```

* `Promise.resolve(..)` make sure it's always a Promise


### Trust Built

Promise was designed specifically to bring sanity to our async


## Chain Flow

* build a chanin of promises with `.then(..)` (aka sequence of actions)
* result for `then(..)` is a fullfilment for next promise in a chain

### Create Async Sequences of Flow Control

 ```js
 var p = Promise.resolve( 21 );
 
 var p2 = p.then( function(v){
 	console.log( v );	// 21
 
 	// fulfill `p2` with value `42`
 	return v * 2;
 } );
 
 // chain off `p2`
 p2.then( function(v){
 	console.log( v );	// 42
 } );
 ```
 
### Create Async Sequences of Flow Control
 
```js
var p = Promise.resolve( 21 );

p
.then( function(v){
	console.log( v );	// 21

	// fulfill the chained promise with value `42`
	return v * 2;
} )
// here's the chained promise
.then( function(v){
	console.log( v );	// 42
} );
```

### Delay Utility as Example

```js
function delay(time) {
	return new Promise( function(resolve,reject){
		setTimeout( resolve, time );
	} );
}

delay( 100 ) // step 1
.then( function STEP2(){
	console.log( "step 2 (after 100ms)" );
	return delay( 200 );
} )
.then( function STEP3(){
	console.log( "step 3 (after another 200ms)" );
} )
.then( function STEP4(){
	console.log( "step 4 (next Job)" );
	return delay( 50 );
} )
.then( function STEP5(){
	console.log( "step 5 (after another 50ms)" );
} )
...
```

### Play with Ajax

```js
request( "http://some.url.1/" )
.then( function(response1){
	return request( "http://some.url.2/?v=" + response1 );
} )
.then( function(response2){
	console.log( response2 );
} );
```

### Play with Ajax

```js
// step 1:
request( "http://some.url.1/" )
// step 2:
.then( function(response1){
	foo.bar(); // undefined, error!

	// never gets here
	return request( "http://some.url.2/?v=" + response1 );
} )
// step 3:
.then(
	function fulfilled(response2){
		// never gets here
	},
	// rejection handler to catch the error
	function rejected(err){
		console.log( err );	// `TypeError` from `foo.bar()` error
		return 42;
	}
)
// step 4:
.then( function(msg){
	console.log( msg );		// 42
} );
```

### Rejection Omitted

```js
var p = new Promise( function(resolve,reject){
	reject( "Oops" );
} );

var p2 = p.then(
	function fulfilled(){
		// never gets here
	}
	// assumed rejection handler, if omitted or
	// any other non-function value passed
	// function(err) {
	//     throw err;
	// }
);
```

### Resolution Omitted

```js
var p = Promise.resolve( 42 );

p.then(
	// assumed fulfillment handler, if omitted or
	// any other non-function value passed
	// function(v) {
	//     return v;
	// }
	null,
	function rejected(err){
		// never gets here
	}
);
```

## Error Handling

`try..catch` construct is synchronous-only

```js
function foo() {
	setTimeout( function(){
		baz.bar();
	}, 100 );
}

try {
	foo();
	// later throws global error from `baz.bar()`
}
catch (err) {
	// never gets here
}
```

### Error-First Callback Style

```js
function foo(cb) {
	setTimeout( function(){
		try {
			var x = baz.bar();
			cb( null, x ); // success!
		}
		catch (err) {
			cb( err );
		}
	}, 100 );
}

foo( function(err,val){
	if (err) {
		console.error( err ); // bummer :(
	}
	else {
		console.log( val );
	}
} );
```

### Promise `rejected(..)`

 ```js
 var p = Promise.reject( "Oops" );
 
 p.then(
 	function fulfilled(){
 		// never gets here
 	},
 	function rejected(err){
 		console.log( err ); // "Oops"
 	}
 );
 ```
 
### Nuances

```js
var p = Promise.resolve( 42 );

p.then(
	function fulfilled(msg){
		// numbers don't have string functions,
		// so will throw an error
		console.log( msg.toLowerCase() );
	},
	function rejected(err){
		// never gets here
	}
);
```

### Pit of Despair

["pit of despair"](http://blog.codinghorror.com/falling-into-the-pit-of-success) 

```js
var p = Promise.resolve( 42 );

p.then(
	function fulfilled(msg){
		// numbers don't have string functions,
		// so will throw an error
		console.log( msg.toLowerCase() );
	}
)
.catch( handleErrors );
```

### Pit of Success (by workaround)

```js
var p = Promise.reject( "Oops" ).defer();

// `foo(..)` is Promise-aware
foo( 42 )
.then(
	function fulfilled(){
		return p;
	},
	function rejected(err){
		// handle `foo(..)` error
	}
);
...
```

* not a ES6 standard


## Promise Patterns 

Review common async control flow patterns

Two of them already defined in ES6


### Promise.all([ .. ])

```js
// `request(..)` is a Promise-aware Ajax utility,
// like we defined earlier in the chapter

var p1 = request( "http://some.url.1/" );
var p2 = request( "http://some.url.2/" );

Promise.all( [p1,p2] )
.then( function(msgs){
	// both `p1` and `p2` fulfill and pass in
	// their messages here
	return request(
		"http://some.url.3/?v=" + msgs.join(",")
	);
} )
.then( function(msg){
	console.log( msg );
} );
```

### Promise.race([ .. ])

```js
// `request(..)` is a Promise-aware Ajax utility,
// like we defined earlier in the chapter

var p1 = request( "http://some.url.1/" );
var p2 = request( "http://some.url.2/" );

Promise.race( [p1,p2] )
.then( function(msg){
	// either `p1` or `p2` will win the race
	return request(
		"http://some.url.3/?v=" + msg
	);
} )
.then( function(msg){
	console.log( msg );
} );
```

### Timeout Race

```js
// `foo()` is a Promise-aware function

// `timeoutPromise(..)`, defined ealier, returns
// a Promise that rejects after a specified delay

// setup a timeout for `foo()`
Promise.race( [
	foo(),					// attempt `foo()`
	timeoutPromise( 3000 )	// give it 3 seconds
] )
.then(
	function(){
		// `foo(..)` fulfilled in time!
	},
	function(err){
		// either `foo()` rejected, or it just
		// didn't finish in time, so inspect
		// `err` to know which
	}
);
```

### "Finally"

Promise can't be canceled

```js
var p = Promise.resolve( 42 );

p.then( something )
.finally( cleanup )
.then( another )
.finally( cleanup );
```

To clean up or do some after tasks (logging etc)

* may appear in ES7+

### Other way `.observe(..)` (not in standard)

```js
// polyfill-safe guard check
if (!Promise.observe) {
	Promise.observe = function(pr,cb) {
		// side-observe `pr`'s resolution
		pr.then(
			function fulfilled(msg){
				// schedule callback async (as Job)
				Promise.resolve( msg ).then( cb );
			},
			function rejected(err){
				// schedule callback async (as Job)
				Promise.resolve( err ).then( cb );
			}
		);

		// return original promise
		return pr;
	};
}
```

### Other way `.observe(..)` (not in standard)

```js
Promise.race( [
	Promise.observe(
		foo(),					// attempt `foo()`
		function cleanup(msg){
			// clean up after `foo()`, even if it
			// didn't finish before the timeout
		}
	),
	timeoutPromise( 3000 )	// give it 3 seconds
] )
```


### Variations on all([ .. ]) and race([ .. ])

Not ES6 

* `none([ .. ])` - all rejected
* `any([ .. ])`  - ignore rejection, one have to be fullfill
* `first([ .. ])` - lake a `race([..])` but ignore rejections
* `last([ .. ])` is like `first([ .. ])`, but only the latest fulfillment wins.


### Concurrent Iterations (not in standart)

```js
var p1 = Promise.resolve( 21 );
var p2 = Promise.resolve( 42 );
var p3 = Promise.reject( "Oops" );

// double values in list even if they're in
// Promises
Promise.map( [p1,p2,p3], function(pr,done){
	// make sure the item itself is a Promise
	Promise.resolve( pr )
	.then(
		// extract value as `v`
		function(v){
			// map fulfillment `v` to new value
			done( v * 2 );
		},
		// or, map to promise rejection message
		done
	);
} )
.then( function(vals){
	console.log( vals );	// [42,84,"Oops"]
} );
```

### Concurrent Iterations (not in standart)

```js
if (!Promise.map) {
	Promise.map = function(vals,cb) {
		// new promise that waits for all mapped promises
		return Promise.all(
			// note: regular array `map(..)`, turns
			// the array of values into an array of
			// promises
			vals.map( function(val){
				// replace `val` with a new promise that
				// resolves after `val` is async mapped
				return new Promise( function(resolve){
					cb( val, resolve );
				} );
			} )
		);
	};
}
```


## Promise API Recap

Let's review the ES6 `Promise` API that we've already seen unfold in bits and pieces throughout this chapter.

### new Promise(..) Constructor

```js
var p = new Promise( function(resolve,reject){
	// `resolve(..)` to resolve/fulfill the promise
	// `reject(..)` to reject the promise
} );
```

### Promise.resolve(..) and Promise.reject(..)

```js
var p1 = new Promise( function(resolve,reject){
	reject( "Oops" );
} );

var p2 = Promise.reject( "Oops" );
```

### Promise.resolve(..) and Promise.reject(..)

```js
var fulfilledTh = {
	then: function(cb) { cb( 42 ); }
};
var rejectedTh = {
	then: function(cb,errCb) {
		errCb( "Oops" );
	}
};

var p1 = Promise.resolve( fulfilledTh );
var p2 = Promise.resolve( rejectedTh );

// `p1` will be a fulfilled promise
// `p2` will be a rejected promise
```

### then(..) and catch(..)

```js
p.then( fulfilled );

p.then( fulfilled, rejected );

p.catch( rejected ); // or `p.then( null, rejected )`
```

### Promise.all([ .. ]) and Promise.race([ .. ])

```js
var p1 = Promise.resolve( 42 );
var p2 = Promise.resolve( "Hello World" );
var p3 = Promise.reject( "Oops" );

Promise.race( [p1,p2,p3] )
.then( function(msg){
	console.log( msg );		// 42
} );

Promise.all( [p1,p2,p3] )
.catch( function(err){
	console.error( err );	// "Oops"
} );

Promise.all( [p1,p2] )
.then( function(msgs){
	console.log( msgs );	// [42,"Hello World"]
} );
```

> empty array and `Promise.race([ .. ])` will hang forever and never resolve.

## Promise Limitations

Review Limitations

### Sequence Error Handling

Usually you have a reference to *last* promisse, so errors propagated

```js
// `foo(..)`, `STEP2(..)` and `STEP3(..)` are
// all promise-aware utilities

var p = foo( 42 )
.then( STEP2 )
.then( STEP3 );

// if other error hadlers in chain we won't be aware of error
p.catch( handleErrors );

```

Like `try..catch`, it's lack of information about rejection errors

### Single Value

Usually a signal to split params in promises 

### Splitting Values

```js
function getY(x) {
	return new Promise( function(resolve,reject){
		setTimeout( function(){
			resolve( (3 * x) - 1 );
		}, 100 );
	} );
}

function foo(bar,baz) {
	var x = bar * baz;

	return getY( x )
	.then( function(y){
		// wrap both values into container
		return [x,y];
	} );
}

foo( 10, 20 )
.then( function(msgs){
	var x = msgs[0];
	var y = msgs[1];

	console.log( x, y );	// 200 599
} );
```

### Splitting Values

```js
function foo(bar,baz) {
	var x = bar * baz;

	// return both promises
	return [
		Promise.resolve( x ),
		getY( x )
	];
}

Promise.all(
	foo( 10, 20 )
)
.then( function(msgs){
	var x = msgs[0];
	var y = msgs[1];

	console.log( x, y );
} );
```

### Unwrap/Spread Arguments

```js
function spread(fn) {
	return Function.apply.bind( fn, null );
}

Promise.all(
	foo( 10, 20 )
)
.then(
	spread( function(x,y){
		console.log( x, y );	// 200 599
	} )
)
```

### Unwrap/Spread Arguments (ES6)

```js
Promise.all(
	foo( 10, 20 )
)
.then( function(msgs){
	var [x,y] = msgs;       // destructuring

	console.log( x, y );	// 200 599
} );

// or

Promise.all(
	foo( 10, 20 )
)
.then( function([x,y]){     // params destructuring
	console.log( x, y );	// 200 599
} );

```


### Single Resolution

There's also a lot of async cases that fit into a different model -- one that's more akin to events and/or streams of data

It's not for promises

### Promise Uncancelable

```js
var p = foo( 42 );

Promise.race( [
	p,
	timeoutPromise( 3000 )
] )
.then(
	doSomething,
	handleError
);

p.then( function(){
	// still happens even in the timeout case :(
} );
```

### Promise Uncancelable

```js
var OK = true;

var p = foo( 42 );

Promise.race( [
	p,
	timeoutPromise( 3000 )
	.catch( function(err){
		OK = false;
		throw err;
	} )
] )
.then(
	doSomething,
	handleError
);

p.then( function(){
	if (OK) {
		// only happens if no timeout! :)
	}
} );
```


### Promise Uncancelable

Cancel in promise would bring us to [Action at a distance anti-pattern](http://en.wikipedia.org/wiki/Action_at_a_distance_%28computer_programming%29)]

Promise doesn't provide you with full control-flow mehanis, you need more high-level abstraction

For example entity *sequence*  could be cancelable (refer to Promises libs)


### Promise Performance

Both simple and complex

* a 'bit' slower that callbacks, it's kind of an apples-to-oranges comparison
* build main code base with Promises and optimize critical parts if any with callbacks


## Review

1. Promises are awesome. Use them.
1. They don't get rid of callbacks, they just can help in redirect the orchestration of those callbacks
1. Promise chains also begin to address (though certainly not perfectly) a better way of expressing async flow in sequential fashion,
