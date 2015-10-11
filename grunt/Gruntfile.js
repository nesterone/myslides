var markdown = require('marked-sections'),
fs = require('fs'),
_ = require('underscore');


module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.registerTask('slides', function(){

        markdown.setOptions({
            levels: 3
        });

        var sections = fs.readFileSync('README.md');

        if (sections){
            sections = sections.toString();
        }else{
            sections = '';
        }

        sections = markdown.parse(sections);

        var html = fs.readFileSync('template.html');

        if (html){
            html = html.toString();
        }

        html = _.template(html)({sections: sections});


        if (html){
            console.log("Slides generated");
        }

    });

    //other grunt tasks here
    grunt.registerTask('default', ['slides'])
};