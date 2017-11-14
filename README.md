# Color Picker

一款简易的拾色器插件，功能如下：

- 获取 RGB\HEX 值；
- 色值改变时执行回调；

## 安装

```html
<script src="color-picker.js"></script>
```

###### 插件需要 `jQuery` 支持，请确保页面中有使用 `jQuery`。

## 使用

一般用法：

```javascript
// 将拾色器放入 dom 元素中并初始化
colorPicker.init(dom)

// 获取拾色器当前 RGB 值
colorPicker.getRGB()
```

设置色值变化回调函数：

```javascript
colorPicker.init(dom, function (rgb, hex) {
  console.log(rgb, hex)
})
```

回调函数有两个参数分别为实时颜色的 RGB 值和 16 进制值。

## 方法

方法 | 参数 | 说明
---- | ---- | ----
init | [Object][, Function] | 初始化函数，返回拾色器元素
getRGB | - | 获取当前颜色的 RGB 值
getHEX | - | 获取当前颜色的 16 进制值
destory | - | 销毁拾色器

## Thanks




