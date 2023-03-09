function text() {}
function heading(content, { level }) {
  return `<h${level}>${content}</h${level}>`;
}
function math() {}
function markdown() {}
function chart() {}

function render({ type, content, blockId, options }) {
  switch (type) {
    case "text":
      return content;
    case "heading":
      return heading(content, options);
  }
  return content;
}
module.exports = render;
