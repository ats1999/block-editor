const renderer = require("./renderer");
const { v4: uuidv4 } = require("uuid");
const debounce = require("debounce");

module.exports = class Editor {
  constructor(blockEditor) {
    this.blockEditor = blockEditor;
    window.blocks = this.blocks = []; // type, content,options
    this.blockTypes = [
      "Text",
      "Heading",
      "Math",
      "Markdown",
      "Chart",
      "Code",
      "Image",
      "Link",
    ];
    this.headingLevels = [1, 2, 3, 4, 5, 6];
    this.languages = ["HTML", "CSS", "JavaScript", "JAVA", "C++", "C"];
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
    textBox.style.width = "95%";
    textBox.style.padding = "5px";
    textBox.addEventListener(
      "keyup",
      debounce((e) => {
        this.setBlockContent(e.target.value, blockId);
      }, 100)
    );
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
    this.renderBlock(blockId, insertAfterBlock);
  }

  setBlockContent(content, blockId) {
    this.blocks[this.getBlockIdx(blockId)].content = content;
    this.renderBlock(blockId);
  }

  setBlockType(type, blockId) {
    this.removeBlockExtension(
      this.blocks[this.getBlockIdx(blockId)].type,
      blockId
    );
    this.blocks[this.getBlockIdx(blockId)].type = type;
    this.extendBlock(blockId);
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

    // remove blocks from DOM
    document.getElementById(`block-${blockId}`).remove();
    document.getElementById(`content-${blockId}`).remove();

    // remove block from array
    const blockIdx = this.blocks.findIndex(
      (block) => block.blockId === blockId
    );
    this.blocks.splice(blockIdx, 1);
  }

  getBlockIdx(blockId) {
    return this.blocks.findIndex((block) => block.blockId === blockId);
  }

  getBlock(blockId) {
    return this.blocks[this.getBlockIdx(blockId)];
  }

  addHeadingLevelSelector(block) {
    const headingSelector = document.createElement("select");
    this.headingLevels.forEach((level) => {
      const option = document.createElement("option");
      option.value = level;
      option.innerText = `H${level}`;
      headingSelector.append(option);
    });

    // default level is H2
    headingSelector.value = 2;
    this.blocks[this.getBlockIdx(block.blockId)].options.level = 2;

    headingSelector.style.position = "absolute";
    headingSelector.style.left = "180px";
    headingSelector.style.top = "-20px";
    headingSelector.id = `block-heading-selector-${block.blockId}`;
    headingSelector.addEventListener("change", (e) => {
      this.blocks[this.getBlockIdx(block.blockId)].options.level =
        e.target.value;
      this.renderBlock(block.blockId);
    });
    document.getElementById(`block-${block.blockId}`).append(headingSelector);
  }

  addLangSelector(block) {
    const langSelector = document.createElement("select");
    this.languages.forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang.toLowerCase();
      option.innerText = lang;
      langSelector.append(option);
    });

    // default language is HTML
    langSelector.value = "html";
    this.blocks[this.getBlockIdx(block.blockId)].options.lang = "html";

    langSelector.style.position = "absolute";
    langSelector.style.left = "180px";
    langSelector.style.top = "-20px";
    langSelector.id = `block-lang-selector-${block.blockId}`;
    langSelector.addEventListener("change", (e) => {
      this.blocks[this.getBlockIdx(block.blockId)].options.lang =
        e.target.value;
      this.renderBlock(block.blockId);
    });
    document.getElementById(`block-${block.blockId}`).append(langSelector);
  }
  extendBlock(blockId) {
    // TODO: add language options
    const block = this.getBlock(blockId);
    switch (block.type) {
      case "heading":
        this.addHeadingLevelSelector(block);
        break;
      case "code":
        this.addLangSelector(block);
        break;
    }
  }

  removeBlockExtension(prevBlockType, blockId) {
    switch (prevBlockType) {
      case "heading":
        document.getElementById(`block-heading-selector-${blockId}`).remove();
        delete this.blocks[this.getBlockIdx(blockId)].options.level;
        break;
      case "code":
        document.getElementById(`block-lang-selector-${blockId}`).remove();
        delete this.blocks[this.getBlockIdx(blockId)].options.lang;
        break;
    }
  }
  renderBlock(blockId, prevContentBlockId = null) {
    const block = this.getBlock(blockId);
    let contentBlock = document.getElementById(`content-${blockId}`);

    if (contentBlock) {
      contentBlock.innerHTML = renderer(block);
      return;
    }
    contentBlock = document.createElement("div");
    contentBlock.id = `content-${blockId}`;
    contentBlock.className = `content-block-${block.type}`;
    contentBlock.innerHTML = renderer(block);
    contentBlock.style.height = "200px";
    contentBlock.style.width = "100%";
    contentBlock.style.marginTop = "20px";
    contentBlock.style.overflow = "auto";

    if (prevContentBlockId) {
      // insert new block after some block
      document
        .getElementById(`content-${prevContentBlockId}`)
        .after(contentBlock);
    } else {
      // insert new block at the end
      this.blockEditor.viewer.append(contentBlock);
    }
  }
};
