const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();
function text() {}
function heading(content, { level }) {
  return `<h${level}>${content}</h${level}>`;
}
function math() {}
function markdown(content) {
  return md.render(content);
}
function chart() {}

function render({ type, content, blockId, options }) {
  switch (type) {
    case "heading":
      return heading(content, options);
    case "markdown":
      return markdown(content);
  }
  return content;
}
module.exports = render;
