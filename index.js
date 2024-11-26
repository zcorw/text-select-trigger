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

export default class TextSelectTrigger {
  constructor(el) {
    if (!(el instanceof Element || typeof el === 'string')) {
      throw new TypeError('el must be an Element or a selector');
    }
    if (typeof el === 'string') {
      el = document.querySelector(el);
    }
    const allDescendants = el.querySelectorAll("*");
    allDescendants.forEach(setDataNoSelect);
    this.el = el;
  }
}