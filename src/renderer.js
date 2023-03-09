const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();
function text() {}

function math() {}

function chart() {}

const renderers = {
  heading: function ({ content, options: { level } }) {
    return `<h${level}>${content}</h${level}>`;
  },
  markdown: function ({ content }) {
    return md.render(content);
  },
  image: function ({ content }) {
    return `<img src="${content}" alt="${"No alt specified"}"/>`;
  },
};

function render(block) {
  const { type } = block;
  return renderers[type] ? renderers[type](block) : "";
}
module.exports = render;
