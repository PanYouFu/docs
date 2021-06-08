# CCS

## 移动端自适应布局

### 一些基本概念

#### 物理像素 physical pixel

物理像素又被称为设备像素，它是显示设备中一个最微小的物理部件。（一个小灯）操作系统根据需要设置它的颜色与亮度。

#### 设备独立像素 density-independent pixel

设备独立像素也称为密度无关像素，可以认为是计算机坐标系统中的一个点，这个点代表一个可以由程序使用的虚拟像素(比如说CSS像素)，然后由相关系统转换为物理像素。

1px css 像素，最后会转成相应的物理像素（转成后有可能是2px物理像素）

#### CSS像素

CSS像素是一个抽像的单位，主要使用在浏览器上。CSS像素称为与设备无关的像素(device-independent pixel）

#### 设备像素比(device pixel ratio) *********

**dpr**

设备像素比简称为dpr，其定义了物理像素和设备独立像素的对应关系

```javascript
设备像素比 ＝ 物理像素 / 设备独立像素
```

在Javascript中，可以通过 `window.devicePixelRatio `获取到当前设备的dpr。

在css中，可以通过 `-webkit-device-pixel-ratio`，`-webkit-min-device-pixel-ratio`和 `-webkit-max-device-pixel-ratio`进行媒体查询。

#### 位图像素

一个位图像素是栅格图像(如：png, jpg, gif等)最小的数据单元。每一个位图像素都包含着一些自身的显示信息(如：显示位置，颜色值，透明度等)。

理论上，1个位图像素对应于1个物理像素，图片才能得到完美清晰的展示。

##### 图片高清问题

使用两倍图片，即：200×300(css pixel)img标签，就需要提供400×600的图片。

#### 缩放比 scale

缩放比：scale = 1/dpr

#### 视窗 viewport

视口(viewport)代表当前可见的计算机图形区域。在Web浏览器术语中，通常与浏览器窗口相同，但不包括浏览器的UI， 菜单栏等——即指你正在浏览的文档的那一部分。(html元素)

移动端设置视窗

```html
<meta name="viewport" content="width=device-width; initial-scale=1; maximum-scale=1; minimum-scale=1; user-scalable=no;">
```

#### rem

font size of the root element.`rem`就是相对于根元素`<html>`的`font-size`来做计算。

尺寸缩放，字体大小跟着改变。但是页面会抖动。

##### rem解决 1px 问题

当dpr为2时。一个css像素等于4个物理像素  1x1 -> 2x2。存在1px的高度实际展示过高问题。

使用视窗缩放进行解决。

```javascript
var scale = 1 / window.devicePixelRation; // 计算出缩放比
```

在`head`中的`meta`标签设备

```html
<meta name="viewport" content="initial-scale=scale,maximum-scale=scale,minimum-scale=scale,user-scalable=no">
```

##### Flexible.js

在整个方案中采用了rem做为单位，但他的核心是通过JS对移动设备做了一些判断，特别是dpr方面的判断，然后再给html根元素赋值一个font-size。 达到动态生成font-size的值，从而完成rem 的布局效果。

1、设置body字体大小；2、设置初始化html根元素remunit (viewport的十分之一)；3、监听视窗变化，更改根元素rem单位值。

#### vw

基于viewport。100vw等于viewport的宽度。vw – 视区宽度百分值。

##### 为啥要用vw代替rem

因为rem会抖。

##### 为啥rem会抖

通过设定根元素的`font-size`大小，实现弹性自适应效果。具体元素或模块使用`rem`或`em`单位来实现。直接设定一个临界点字体大小

```css
// 这种方式会抖哦
html {
    font-size: 16px;
}
@media screen and (min-width: 600px) {
    html {
        font-size: 18px;
    }
}
@media screen and (min-width: 1000px) {
    html {
        font-size: 22px;
    }
}
```

##### 使用vw

例如，我们希望浏览器宽度在600px~1000px变化的时候，html根元素的`font-size`大小是18px~22px之间对应变化的，则可以：

```CSS
html { font-size: calc(18px + 4 * (100vw - 600px) / 400); }
```

当视区宽度是`600px`的时候，`100vw`就等于`600px`，于是：

```CSS
18px + 4 * (100vw - 600px) / 400
↓
18px + 4 * (600px - 600px) / 400
↓
18px
```

##### tips

使用百分比代替 18px

```CSS
html { font-size: calc(112.5% + 4 * (100vw - 600px) / 400); }
```

### 虚假的面试官问系列

#### 为啥要适配移动端

因为移动端手机尺寸、分辨率皆存在差异。

#### 什么是设备像素比

dpr:  设备像素比 ＝ 物理像素 / 设备独立像素

#### 适配方案

##### 使用rem

rem 是相对于html节点的font-size来做计算的。所以在页面初始话的时候给根元素设置一个font-size，接下来的元素就根据rem来布局，这样就可以保证在页面大小变化时，布局可以自适应。

```CSS
//假设我给根元素的大小设置为14px
html{
  font-size：14px
}
//那么我底下的p标签如果想要也是14像素
p{
  font-size:1rem
}
```

flexible，设置跟节点的fontsize等于宽度的十分之一，即set 1rem = viewWidth / 10。后续布局使用rem则可以控制页面大小变化时自适应布局。

##### 使用vw

跟rem思路类似。

##### px为主，vx和vxxx（vw/vh/vmax/vmin）为辅，搭配一些flex（推荐）

#### 移动端适配流程

**1. 在head 设置width=device-width的viewport**‘

**2. 在css中使用px**

**3. 在适当的场景使用flex布局，或者配合vw进行自适应**

**4. 在跨设备类型的时候（pc <-> 手机 <-> 平板）使用媒体查询**

**5. 在跨设备类型如果交互差异太大的情况，考虑分开项目开发**

### 1px问题

#### viewport + rem

在`devicePixelRatio = 2` 时，输出viewport

```css
<meta name="viewport" content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no">
```

在`devicePixelRatio = 3` 时，输出viewport

```CSS 
<meta name="viewport" content="initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no">
```

同时通过设置对应viewport的rem基准值，这种方式就可以像以前一样轻松愉快的写1px了。

#### 伪类 + transform

- 单条 border

  ```CSS
  .hairlines li{
      position: relative;
      border:none;
  }
  .hairlines li:after{
      content: '';
      position: absolute;
      left: 0;
      background: #000;
      width: 100%;
      height: 1px;
      -webkit-transform: scaleY(0.5);
              transform: scaleY(0.5);
      -webkit-transform-origin: 0 0;
              transform-origin: 0 0;
  }
  ```

- 四条 border

  ```CSS
  .hairlines li{
      position: relative;
      margin-bottom: 20px;
      border:none;
  }
  .hairlines li:after{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      border: 1px solid #000;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 200%;
      height: 200%;
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
      -webkit-transform-origin: left top;
      transform-origin: left top;
  }
  ```

##### border-box 与 content-box的区别

###### 盒模型

- content-box（默认样式）
- border-box

###### content-box与border-box区别

+ content-box：width 不包括 padding 和 border
+ border-box：width 包括 padding 和 border

###### 怎么记忆

名字有border，width就算border。

### 响应式布局

> 响应式设计与自适应设计的区别：响应式开发一套界面，通过检测视口分辨率，针对不同客户端在客户端做代码处理，来展现不同的布局和内容；

> 自适应需要开发多套界面，通过检测视口分辨率，来判断当前访问的设备是pc端、平板、手机，从而请求服务层，返回不同的页面。

#### 要点

在实际项目中，我们可能需用`rem`来做字体的适配，用`srcset`来做图片的响应式，宽度可以用`rem`，`flex`，栅格系统等来实现响应式，然后可能还需要利用媒体查询来作为响应式布局的基础，因此综合上面的实现方案，项目中实现响应式布局需要注意下面几点：

- 设置viewport
- 媒体查询
- 字体的适配（字体单位）
- 百分比布局
- 图片的适配（图片的响应式）
- 结合flex，grid，BFC，栅格系统等已经成型的方案

##### 媒体查询

`CSS3`媒体查询可以让我们针对不同的媒体类型定义不同的样式，当重置浏览器窗口大小的过程中，页面也会根据浏览器的宽度和高度重新渲染页面。

不管是移动优先还是PC优先，都是依据当随着屏幕宽度增大或减小的时候，后面的样式会覆盖前面的样式。因此，移动端优先首先使用的是`min-width`，PC端优先使用的`max-width`。

**移动优先:**

```
/* iphone6 7 8 */
body {
    background-color: yellow;
}
/* iphone 5 */
@media screen and (max-width: 320px) {
    body {
      background-color: red;
    }
}
/* iphoneX */
@media screen and (min-width: 375px) and (-webkit-device-pixel-ratio: 3) {
    body {
      background-color: #0FF000;
    }
}
/* iphone6 7 8 plus */
@media screen and (min-width: 414px) {
    body {
      background-color: blue;
    }
}
/* ipad */
@media screen and (min-width: 768px) {
    body {
      background-color: green;
    }
}
/* ipad pro */
@media screen and (min-width: 1024px) {
    body {
      background-color: #FF00FF;
    }
}
/* pc */
@media screen and (min-width: 1100px) {
    body {
      background-color: black;
    }
}
复制代码
```

**PC优先：**

```
/* pc width > 1024px */
    body {
        background-color: yellow;
    }
/* ipad pro */
@media screen and (max-width: 1024px) {
    body {
        background-color: #FF00FF;
    }
}
/* ipad */
@media screen and (max-width: 768px) {
    body {
        background-color: green;
    }
}
/* iphone6 7 8 plus */
@media screen and (max-width: 414px) {
    body {
        background-color: blue;
    }
}
/* iphoneX */
@media screen and (max-width: 375px) and (-webkit-device-pixel-ratio: 3) {
    body {
        background-color: #0FF000;
    }
}
/* iphone6 7 8 */
@media screen and (max-width: 375px) and (-webkit-device-pixel-ratio: 2) {
    body {
        background-color: #0FF000;
    }
}
/* iphone5 */
@media screen and (max-width: 320px) {
    body {
        background-color: #0FF000;
    }
}
```

##### 百分比布局

通过百分比单位，可以使得浏览器中组件的宽和高随着浏览器的高度的变化而变化，从而实现响应式的效果。还是要媒体查询哦~

###### 各种百分比

+ 子元素的`height`或`width`中使用百分比，是相对于子元素的直接父元素，`width`相对于父元素的`width`，`height`相对于父元素的`height`
+ 子元素的`top`和`bottom`如果设置百分比，则相对于直接非`static`定位(默认定位)的父元素的高度
+ 子元素的`left`和`right`如果设置百分比，则相对于直接非`static`定位(默认定位的)父元素的宽度
+ 子元素的`padding` & `margin`如果设置百分比，不论是垂直方向或者是水平方向，都相对于直接父亲元素的`width`
+ `border-radius`不一样，如果设置`border-radius`为百分比，则是相对于自身的宽度，除了`border-radius`外，还有比如`translate`、`background-size`等都是相对于自身的.

#### 图片响应式

图片响应式包括两个方面，一个就是**大小自适应**，这样能够保证图片在不同的屏幕分辨率下出现压缩、拉伸的情况；一个就是根据不同的屏幕分辨率和设备像素比来尽可能选择高分辨率的图片，也就是当在小屏幕上不需要高清图或大图，这样我们用小图代替，就可以减少网络带宽了。

##### 1.使用max-width（图片自适应）:

图片自适应意思就是图片能随着容器的大小进行缩放，可以采用如下代码：

```CSS
img {
    display: inline-block;
    max-width: 100%;
    height: auto;
}
```

**tips**去掉img标签的横线：1、把图片变成区块元素；2、把上级元素的字体大小改成0像素

##### 2.使用srcset

```html
<img srcset="photo_w350.jpg 1x, photo_w640.jpg 2x" src="photo_w350.jpg" alt="">
```

如果屏幕的dpi = 1的话则加载1倍图，而dpi = 2则加载2倍图.

PS: 在Mac上的Chrome它会同时加载`srcset`里面的那张2x的，还会再去加载src里面的那张，加载两张图片。顺序是先把所有`srcset`里面的加载完了，再去加载src的。

##### 3.使用background-image

也要用到媒体查询哟

```css
.banner{
  background-image: url(/static/large.jpg);
}
@media screen and (max-width: 767px){
  background-image: url(/static/small.jpg);
}
```

## BFC

### 什么是BFC? (What)

block formatting context

BFC称为块级格式化上下文，是CSS中的一种渲染机制。是一个拥有独立渲染区域的盒子(也可以理解为结界)，规定了内部元素如何布局，并且盒子内部元素与外部元素互不影响。

`BFC`规定了内部元素的布局渲染。

`BFC`的**目的**就是：**形成一个完全独立的空间，让空间中的子元素不会影响到外面的布局**。

> 简单理解就是具备BFC特性的元素, 就像被一个容器所包裹, 容器内的元素在布局上不会影响外面的元素。

#### 创建BFC

1. 根元素，即`html`
2. `float`的值不为`none`
3. `overflow`的值不为`visible`
4. `display`的值为`inline-block`、`table-cell`、`table-caption`
5. `position`的值为`absolute`或`fixed`

#### BFC规则

##### 1、在一个块格式化上下文中，盒在垂直方向一个接一个地放置，从包含块的顶部开始。

##### 2、两个兄弟盒之间的垂直距离由`margin`属性决定。

##### 3、同一个块格式化上下文中的相邻块级盒之间的垂直外边距会合并

**margin collapse**

	1. 父子外边距；
 	2. 兄弟外边距；
 	3. 没有高度的元素自身`margin-top`和`margin-bottom`会合并。

**注意**：

1. **需要属于普通流中的盒子**: 也就是脱离文档流不算
2. **毗邻**: 也就是元素间没有被`padding`、`border`、`clear`和`line box`分隔开
3. **垂直**: 也就是`margin-top`和`margin-bottom`

##### 4、BFC的区域不会与float box重叠

> 使用BFC清浮动

当我们设置一个元素为float，该元素脱离文档流，会覆盖在下方元素上面。而如果设置元素BFC，将不会与float重叠，这样我们可以通过该属性来实现自适应两栏布局。

##### 5、计算BFC的高度时，浮动元素也参与计算

因为浮动元素会脱离文档流，所以包含块元素的高度不会包含该浮动元素，导致高度发生塌陷。使用BFC，包含块的高度包含浮动元素在内。

##### 