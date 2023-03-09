module.exports = class Editor {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    this.addStyleToContainer();
    this.createEditor();
    this.createViewer();
  }

  // adding style to the container
  addStyleToContainer() {
    this.container.style.height = "100%";
    this.container.style.width = "100%";
    this.container.style.position = "relative";
    this.container.style.display = "flex";
  }

  // create editor component
  createEditor() {
    this.editor = document.createElement("div");
    this.editor.id = "editor-" + this.containerId;
    this.container.append(this.editor);

    // adding style in editor
    this.editor.style.height = "100%";
    this.editor.style.width = "50%";
  }

  createViewer() {
    this.viewer = document.createElement("div");
    this.viewer.id = "viewer-" + this.containerId;
    this.container.append(this.viewer);

    // adding style in editor
    this.viewer.style.height = "100%";
    this.viewer.style.width = "50%";
  }
};
