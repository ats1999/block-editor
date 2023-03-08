module.exports = class Editor {
  constructor(blockEditor) {
    this.blockEditor = blockEditor;
    this.blocks = []; // type, content,options
    this.blockTypes = ["Text", "Heading", "Math", "Markdown", "Chart.js"];
    this.addBlock();
  }

  addBlock(type = "text", insertAfterIdx = -1) {
    debugger;
    this.blockEditor.editor;
    const block = document.createElement("div");
    block.id = `block-${insertAfterIdx + 1}`;
    block.style.height = "200px";
    block.style.width = "100%";
    block.style.position = "relative";
    block.style.marginTop = "20px";

    // add this block at the appropriate position
    if (insertAfterIdx >= 0) {
      const previousBlock = document.getElementById(`block-${insertAfterIdx}`);
      previousBlock.after(block);
    } else {
      // there is no existing block
      this.blocks.push({ type, content: "", options: {} });
      this.blockEditor.editor.append(block);
    }

    // add block types
    const blockTypeSelector = document.createElement("select");
    this.blockTypes.forEach((blockType) => {
      const option = document.createElement("option");
      option.value = blockType.toLowerCase();
      option.innerText = blockType;
      blockTypeSelector.append(option);
    });
    blockTypeSelector.value = type;

    blockTypeSelector.style.position = "absolute";
    blockTypeSelector.style.left = "0px";
    blockTypeSelector.style.top = "-20px";
    block.append(blockTypeSelector);

    // add text area
    const textBox = document.createElement("textarea");
    textBox.style.height = "90%";
    textBox.style.width = "100%";
    textBox.style.padding = "5px";
    textBox.innerText = insertAfterIdx;
    block.append(textBox);

    // add plus button
    const addBtn = document.createElement("button");
    addBtn.innerText = "+";
    addBtn.style.position = "absolute";
    addBtn.style.bottom = "0px";
    addBtn.style.left = "0px";
    addBtn.style.cursor = "pointer";

    // add event listner
    addBtn.addEventListener("click", () => {
      this.addBlock("text", insertAfterIdx + 1);
    });
    block.append(addBtn);
  }

  setBlockContent() {}
  setBlockType() {}

  removeBlock(idx) {
    if (!idx) {
      throw "Indxe value is required for removeBlock function";
    }
  }
};
