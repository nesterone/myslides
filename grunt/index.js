var markdown = require('marked-sections'),
	fs = require('fs'),
	_ = require('underscore');

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

console.log(sections);

var html = fs.readFileSync('template.html');

if (html){
	html = html.toString();
}

html = _.template(html)({sections: sections});


fs.writeFileSync('index.html', html);