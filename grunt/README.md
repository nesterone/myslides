###Meet with Grunt.js
Just a task runner

###About me

* Lead Software Engineer in Globallogic
* like everything what's starts from Java
* REST evangelist ;-)
* working with JasperServer frontend ... and backend
* leading development of Visualize.js (javascript API)


###Why Grunt ?
* ultimate task runner (does one thing well)
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

###Project structure

```bash

|-foo/
|-bar/
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


###Grunt Collections

Not broadly used 

```javascript

 "keywords": [
    "gruntcollection"
  ]
 "dependencies": {
    //a lot of grunt plugins here
 }

```
[NPM register](https://www.npmjs.com/browse/keyword/gruntcollection)

####In your's project Gruntfile.js

```javascript
grunt.loadNpmTasks('grunt-my-collection');
```

###Running Tasks

Tasks are grunt`s bread and butter.

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

When task is a combination of one or more other tasks

```javascript
grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

//grunt default

```

### Basic Task

When a basic task is run, Grunt doesn't look at the configuration or environment — it just runs the specified task function

...


###Multi Task

When a multi task is run, Grunt looks for a property of the same name in the Grunt configuration

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


###Globbing Patterns

![Alt text](https://github.com/isaacs/node-glob/raw/master/oh-my-glob.gif)

* '*' matches any number of characters, but not /
* '?' matches a single character, but not /
* '**' matches any number of characters, including /, as long as it's the only thing in a path part
* '{}' allows for a comma-separated list of "or" expressions
* '!' at the beginning of a pattern will negate the match

* [node-glob](https://github.com/isaacs/node-glob)
* [minimatch](https://github.com/isaacs/minimatch)


###Configuring Tasks

[Configuring tasks](http://gruntjs.com/configuring-tasks#globbing-patterns)

```javascript

    // You can specify single files:
    {src: 'foo/this.js', dest: ...}
    // Or arrays of files:
    {src: ['foo/this.js', 'foo/that.js', 'foo/the-other.js'], dest: ...}
    // Or you can generalize with a glob pattern:
    {src: 'foo/th*.js', dest: ...}
    
    // This single node-glob pattern:
    {src: 'foo/{a,b}*.js', dest: ...}
    // Could also be written like this:
    {src: ['foo/a*.js', 'foo/b*.js'], dest: ...}
    
    ...
    
    // Templates may be used in filepaths or glob patterns:
    {src: ['src/<%= basename %>.js'], dest: 'build/<%= basename %>.min.js'}
    // But they may also reference file lists defined elsewhere in the config:
    {src: ['foo/*.js', '<%= jshint.all.src %>'], dest: ...}
    
```
###Configuting Tasks (few notes)
 
If you set expand option to true, you can use:
* 'cwd' - current working directory 'src, dest, ext',
* 'expand' - Enable dynamic expansion

```javascript
    dynamic_mappings : {
          // Grunt will search for "**/*.js" under "lib/" when the "uglify" task
          // runs and build the appropriate src-dest file mappings then, so you
          // don't need to update the Gruntfile when files are added or removed.
          files: [
            {
              expand: true,     // Enable dynamic expansion.
              cwd: 'lib/',      // Src matches are relative to this path.
              src: ['**/*.js'], // Actual pattern(s) to match.
              dest: 'build/',   // Destination path prefix.
              ext: '.min.js',   // Dest filepaths will have this extension.
              extDot: 'first'   // Extensions in filenames begin after the first dot
            },
          ],
    }
```


###Tips and tricks for tasks creation

```javascript
grunt.registerMultiTask('bar', 'Log stuff.', function() { 
    var done = this.async();         //to handle async stuff
    var taskName = this.name;        //current task name
    var targetName = this.target;    //current target name

    var version = grunt.config(        
                    ['pkg'],
                    ['version']
    );                                //read global grunt config
    grunt.task.requires('foo');       //fail if 'foo' was failed
});
```

###Lean from code

* [grunt-contrib-concat](Concat files)
* [grunt-contrib-jshint](JS famous linter)



###Resources 
 
 1. [Grunt](http://gruntjs.com/)
 1. [Grunt 101 (Kottans)](http://kottans.org/js-slides/grunt) 
 1. [Grunt Collections](https://github.com/gruntjs/grunt/issues/379)
 1. [More maintainable Gruntfiles](http://www.thomasboyt.com/2013/09/01/maintainable-grunt.html)
 1. [Supercharging your Gruntfile](http://www.html5rocks.com/en/tutorials/tooling/supercharging-your-gruntfile/)