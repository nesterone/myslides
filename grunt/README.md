#Build with Grunt


###Why Grunt ?
* ultimate task runner
* ~5k plugins

###Any alternatives ?
* [*npm run*](https://docs.npmjs.com/cli/run-script)
* [gulp](http://gulpjs.com/)


###How to install ?
* Ships with 2 parts: grunt itself & grunt-cli
* Installing CLI:
	```bash
		npm install -g grunt-cli
	```

>Installing package is as easy as specifying proper version in package.json and running npm i or just npm i grunt

###Project structure

```bash

|-src/
|-Gruntfile.js
|-package.json

```

###Gruntfile.js

```javascript

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    task: {
      options: {
        // general options go here
      },
      targetName1: {
        // targetName1 specific
      },
      targetName2: { ... }
    }
  })
  grunt.loadNpmTasks('grunt-task');
  //other grunt tasks here
  grunt.registerTask('default', ['task'])
}

```

###Bored with *loadNpmTasks* ?

```javascript
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-sass');
grunt.loadNpmTasks('grunt-recess');
grunt.loadNpmTasks('grunt-sizediff');
grunt.loadNpmTasks('grunt-svgmin');
grunt.loadNpmTasks('grunt-styl');
grunt.loadNpmTasks('grunt-php');
grunt.loadNpmTasks('grunt-eslint');
```

Use [*load-grunt-tasks*](https://www.npmjs.com/package/load-grunt-tasks)

```javascript 
require('load-grunt-tasks')(grunt); 
```


###Deprecated Grunt Collections

> Not officially deprecated but no popular/useful grunt collections were found

####Create separate module with package.json
```javascript

 "keywords": [
    "gruntcollection"
  ]
 "dependencies": {
	//a lot of grunt plugins here
 },

```
>So it became searchable [through NPM register](https://www.npmjs.com/browse/keyword/gruntcollection)

####In your's project Gruntfile.js
```javascript

grunt.loadNpmTasks('grunt-my-collection');

```

###Running Tasks

>Tasks are grunt`s bread and butter.

```bash
>grunt
>grunt default
>grunt jshint:test
>grunt foo:testing:123  
```
### Task types

* Alias Tasks
* 'Basic' Tasks
* Multi Tasks


### Alias Tasks

>When task is a combination of one or more other tasks

```javascript
grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

//grunt default

```

### Basic Task

>When a basic task is run, Grunt doesn't look at the configuration or environment — it just runs the specified task function

...


###Multi Task

>When a multi task is run, Grunt looks for a property of the same name in the Grunt configuration

```javascript
grunt.initConfig({
  log: {
    foo: [1, 2, 3],
    bar: 'hello world',
    baz: false
  }
});

grunt.registerMultiTask('log', 'Log stuff.', function() {
  grunt.log.writeln(this.target + ': ' + this.data);
});

//grunt log:foo  
//grunt log
```


###Configuring Tasks

* [Globbing patterns](https://github.com/isaacs/node-glob#glob-primer): * ? ** {} ! i.e:
```javascript
	!foo/*{.js,.coffee}
```
If you set expand option to true, you can use:
* 'cwd' - current working directory 'src, dest, ext',
* 'flatten' - remove all path parts from generated dest paths
* 'rename' - func to be called for each matched src file, dest & src as arguments.


###Tips and tricks for tasks creation

```javascript

grunt.registerMultiTask('bar', 'Log stuff.', function() {
  
	var done = this.async(); 		//to handle async stuff
	var taskName = this.name;		//current task name
	var targetName = this.target;	//current target name

	var version = grunt.config(		
					['pkg'],
					['version']
	);								//read global grunt config
	grunt.task.requires('foo');		//fail if 'foo' was failed

});

```

###Lean from code

* [grunt-contrib-concat]()



##Resources 
 
 1. [Grunt](http://gruntjs.com/)
 1. [Grunt 101 (Kottans)](http://kottans.org/js-slides/grunt) 
 1. [Grunt Collections](https://github.com/gruntjs/grunt/issues/379)
 1. [More maintainable Gruntfiles](http://www.thomasboyt.com/2013/09/01/maintainable-grunt.html)
 1. [Supercharging your Gruntfile](http://www.html5rocks.com/en/tutorials/tooling/supercharging-your-gruntfile/)