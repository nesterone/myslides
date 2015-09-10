#Build with Grunt


###Why Grunt ?
* ultimate task runner
* ~5k plugins

###What's alternatives ?
* [*npm run*](https://docs.npmjs.com/cli/run-script)
* [gulp](http://gulpjs.com/)


###How to install ?
* Ships with 2 parts: grunt itself & grunt-cli
* Installing CLI:
	```bash
		npm install -g grunt-cli
	```

>Installing package is as easy as specifying proper version in package.json and running npm i or just npm i grunt

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








##Resources 
 
 1. [Grunt](http://gruntjs.com/)
 1. [Grunt 101 (Kottans)](http://kottans.org/js-slides/grunt) 
 1. [Grunt Collections](https://github.com/gruntjs/grunt/issues/379)
 1. [More maintainable Gruntfiles](http://www.thomasboyt.com/2013/09/01/maintainable-grunt.html)
 1. [Supercharging your Gruntfile](http://www.html5rocks.com/en/tutorials/tooling/supercharging-your-gruntfile/)