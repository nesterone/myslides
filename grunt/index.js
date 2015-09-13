var mdsec = require('marked-sections'),
	fs = require('fs'),
	_ = require('underscore');

mdsec.setOptions({
    levels: 3
});
 

var sections = fs.readFileSync('sections.md');

if (sections){
	sections = sections.toString();
}else{
	sections = '';
}

sections = mdsec.parse(sections);

console.log(sections);

var html = fs.readFileSync('template.html');

if (html){
	html = html.toString();
}

html = _.template(html)({sections: sections});


fs.writeFileSync('index.html', html);
