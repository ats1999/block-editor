const BlockEditorBuilder = require("./editorBuilder");
const EditorOps = require("./editor");

function init(containerId) {
  const blockEditor = new BlockEditorBuilder(containerId);
  const editorOps = new EditorOps(blockEditor);
}

init((containerId = "block-editor-container"));
module.exports = init;
