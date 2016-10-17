var markdown = require('marked-sections'),
    fs = require('fs'),
    _ = require('underscore'),
    path  = require('path');


module.exports = function(grunt){

    console.log(this.options);

    grunt.registerTask('slides', function(){

        var options = grunt.config(this.name);

        function resolve(file){
           return path.resolve(__dirname, '../', file);
        }

        markdown.setOptions({
            levels: 3
        });

        var sections = grunt.file.read(resolve(options.src));

        if (sections){
            sections = sections.toString();
        }else{
            sections = '';
        }

        sections = markdown.parse(sections);

        var html = grunt.file.read(resolve(options.template));

        if (html){
            html = html.toString();
        }

        html = _.template(html)({sections: sections});


        if (html){

            grunt.file.write(resolve(options.dest), html);

            console.log("Slides generated");
        }

    });

};


