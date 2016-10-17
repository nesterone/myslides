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
* Statement Ordering
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
