function setDataNoSelect(element) {
  // 获取计算样式
  const style = window.getComputedStyle(element);
  if (style.userSelect === "none") {
    // 添加自定义属性
    element.setAttribute("data-noSelect", "true");
  } else {
    if (element.hasAttribute("data-noSelect")) {
      element.removeAttribute("data-noSelect");
    }
  }
}

function addNoSelectAttribute(element) {
  const allDescendants = element.querySelectorAll("*");
  allDescendants.forEach(setDataNoSelect);
}

function getText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.hasAttribute("data-noSelect")) {
      return "";
    }
    return Array.from(node.childNodes).map(getText).join("");
  }
}

export default class TextSelectTrigger {
  constructor(el, callback) {
    if (!(el instanceof Element || typeof el === "string")) {
      throw new TypeError("el must be an Element or a selector");
    }
    if (typeof el === "string") {
      el = document.querySelector(el);
    }
    if (typeof callback !== "function") {
      throw new TypeError("callback must be a function");
    }

    const observer = new MutationObserver(() => {
      addNoSelectAttribute(el);
    });

    observer.observe(el, {
      childList: true,
      subtree: true,
    });

    addNoSelectAttribute(el);
    this.el = el;
    this.timeStamp = 0;
    this.waitUp = false;
    this.observe = observer;
    this.callback = callback;
    this.handler = this._handler.bind(this);
    this.removeListener = this._removeEventListener.bind(this);
    this.selectText = this._selectText.bind(this);
  }

  _selectText(ev) {
    const nowStamp = Date.now();
    this.removeListener();
    if (nowStamp - this.timeStamp > 200) {
      setTimeout(() => {
        const sel = window.getSelection();
        if (sel.rangeCount > 0 && sel.toString().length > 0) {
          const range = sel.getRangeAt(0);
          if (
            !(
              range.commonAncestorContainer === this.el ||
              this.el.contains(range.commonAncestorContainer)
            )
          ) {
            throw new Error("不支持跨文档选择");
          }
          const fragment = range.cloneContents();
          let selectedText = "";
          if (fragment.childNodes.length > 0) {
            // 遍历文档片段，提取其中可选的文本
            fragment.childNodes.forEach((node) => {
              const text = getText(node);
              if (text) {
                selectedText += text;
              }
            });
          } else {
            selectedText = sel.toString();
          }
          if (selectedText.trim() !== "")
            this.callback({
              text: selectedText,
              x: ev.clientX,
              y: ev.clientY,
            });
        }
      });
    }
    this.timeStamp = 0;
  }

  _removeEventListener() {
    this.waitUp = false;
    document.removeEventListener("mouseup", this.selectText);
    document.removeEventListener("dragend", this.removeListener);
  }

  _handler() {
    if (!this.waitUp) {
      this.waitUp = true;
      this.timeStamp = Date.now();
      document.addEventListener("mouseup", this.selectText);
      document.addEventListener("dragend", this.removeListener);
    }
  }

  bind() {
    this.el.addEventListener("mousedown", this.handler);
  }

  unbind() {
    this.el.removeEventListener("mousedown", this.handler);
  }
}
