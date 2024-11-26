# 拖拽鼠标获取文本选区文本的实现

`TextSelectTrigger` 是一个用于处理文本选择事件的 JavaScript 类，可以用来监听 DOM 元素的文本选择并触发回调函数。它通过阻止跨文档选择并过滤不可选择的内容，为用户提供了更精确的文本选择控制。

## 功能概述

- 提供自定义回调函数，当用户选择指定元素中的文本时触发。
- 返回的被选中文本中自动过滤掉不可选择的元素中的文本，也就是设置了`user-select: none`的元素。
- 阻止跨出绑定元素外的文本选择事件被触发。
- 支持取消绑定事件。



---

## 快速开始

将该文件复制到项目中，并通过 `import` 或 `require` 使用：

```javascript
import TextSelectTrigger from './index.js';

const callback = (data) => {
  console.log('Selected text:', data.text);
  console.log('Mouse position:', data.x, data.y);
};

const element = document.querySelector('#my-element');
// or
const element = '#my-element';

const trigger = new TextSelectTrigger(element, callback);

// 绑定监听
trigger.bind();

// 解绑监听
trigger.unbind();
```
- `element`: 一个 DOM 元素或有效的选择器字符串，用于绑定文本选择事件监听的目标元素。
- `callback`: 一个回调函数，当用户完成文本选择时触发。回调函数接收一个对象参数，包含以下属性：

|属性名|说明|类型|
|---|---|---|
|text|选中的文本内容|string|
|x|释放鼠标时的 X 坐标|number|
|y|释放鼠标时的 Y 坐标|number|
