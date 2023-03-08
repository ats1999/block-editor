const { v4: uuidv4 } = require("uuid");

module.exports = class Editor {
  constructor(blockEditor) {
    this.blockEditor = blockEditor;
    this.blocks = []; // type, content,options
    this.blockTypes = ["Text", "Heading", "Math", "Markdown", "Chart.js"];
    this.addBlock();
  }

  addBlock(type = "text", insertAfterBlock = null) {
    this.blockEditor.editor;
    const block = document.createElement("div");
    const blockId = uuidv4();
    block.id = `block-${blockId}`;
    block.style.height = "200px";
    block.style.width = "100%";
    block.style.position = "relative";
    block.style.marginTop = "20px";
    block.className = "block";

    // add this block at the appropriate position
    if (insertAfterBlock) {
      // insert the block
      const previousBlock = document.getElementById(
        `block-${insertAfterBlock}`
      );
      previousBlock.after(block);
      const prevBlockIdx = this.blocks.findIndex(
        (block) => block.blockId == insertAfterBlock
      );

      // data json data for this block
      this.blocks.splice(prevBlockIdx + 1, 0, {
        type,
        blockId,
        content: "",
        options: {},
      });
    } else {
      // there is no existing block
      this.blocks.push({ type, blockId, content: "", options: {} });
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
    blockTypeSelector.addEventListener("change", (e) => {
      this.setBlockType(e.target.value, blockId);
    });
    block.append(blockTypeSelector);

    // add text area
    const textBox = document.createElement("textarea");
    textBox.style.height = "90%";
    textBox.style.width = "100%";
    textBox.style.padding = "5px";
    textBox.addEventListener("blur", (e) => {
      this.setBlockContent(e.target.value, blockId);
    });
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
      this.addBlock("text", blockId);
    });
    block.append(addBtn);

    // add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.style.position = "absolute";
    deleteBtn.style.top = "0px";
    deleteBtn.style.left = "100px";
    deleteBtn.style.top = "-20px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.addEventListener("click", () => {
      this.removeBlock(blockId);
    });
    block.append(deleteBtn);

    // render block
    this.renderBlock(blockId);
  }

  setBlockContent(content, blockId) {
    this.blocks[this.getBlockIdx(blockId)].content = content;
    this.renderBlock(blockId);
  }

  setBlockType(type, blockId) {
    this.blocks[this.getBlockIdx(blockId)].type = type;
    this.renderBlock(blockId);
  }

  removeBlock(blockId) {
    if (!blockId) {
      throw "Indxe value is required for removeBlock function";
    }

    if (this.blocks.length <= 1) {
      alert("Last block can not be removed");
      return;
    }

    if (!confirm("Are you sure?")) {
      return;
    }

    // remove block from DOM
    document.getElementById(`block-${blockId}`).remove();

    // remove block from array
    const blockIdx = this.blocks.findIndex(
      (block) => block.blockId === blockId
    );
    this.blocks.splice(blockIdx, 1);
    // TODO: remove content block
  }

  getBlockIdx(blockId) {
    return this.blocks.findIndex((block) => block.blockId === blockId);
  }

  renderBlock(blockId) {
    const blockIdx = this.getBlockIdx(blockId);
    // TODO: update content block
  }
};
