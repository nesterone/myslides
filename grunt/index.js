var mdsec = require('marked-sections');
mdsec.setOptions({
    levels: 3
    // ,
    // hierarchy: true,
    // deep: true,
    // marked options too 
    // gfm: true // see marked for full docs 
});
 

var markdownText = '###Test1\n  Parsed\n ###Test2\n From\n  ###Test3\n Markdown';
var html = mdsec.parse(markdownText);

console.log(html);
// html2 = mdsec.parse(markdownText, { hierarchy: true }); // change options 
 
// // Or you can do it manually 
// tree = mdsec.marked.lexer(markdownText);
// sectree = mdsec.sectionalize(mdsec.marked.lexer(markdownText));
// html = mdsec.marked.parser(sectree);

// console.log(sectree);