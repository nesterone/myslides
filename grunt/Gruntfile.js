module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        slides : {
            template: 'template.html',
            src: 'README.md',
            dest: 'index.html'
        },

        watch: {
            presentation : {
                files: ['*.md','template.html'],
                tasks: ['slides'],
                options: {
                    spawn: false
                }
            }
        }

    });

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
    require('time-grunt')(grunt);

    //Load local tasks
    grunt.loadTasks(__dirname + "/tasks");


    //other grunt tasks here
    grunt.registerTask('default', ['slides'])
};