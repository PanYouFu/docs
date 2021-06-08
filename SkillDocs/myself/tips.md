# TIPS

https://zhuanlan.zhihu.com/p/286021449

https://juejin.cn/post/6844903885488783374#heading-52

#### DOM文档加载步骤： 

1. 解析HTML结构 
2. 加载外部的脚本和样式文件 
3. 解析并执行脚本代码 
4. 执行`$(function(){})`内对应代码 
5. 加载图片等二进制资源 
6. 页面加载完毕，执行`window.onload`

#### 类型判断

##### typeof

```javascript
console.log(typeof null)  //object
console.log(typeof NaN)   //number

function fn() {}
typeof fn // function
```

##### instanceof

通过原型链来判断数据类型的

```javascript
function Person() {}
p1 = new Person()
p1 instanceof Person // true
p1 instanceof Object // true

[] instanceof Array // true
[] instanceof Object // true

const fn = () => {}
fn instanceof Function
fn instanceof Object
```

##### Object.prototype.toString.call(x)

```javascript
Object.prototype.toString.call([1, 2, 3]) // "[object Array]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
```

#### 作用域

##### 变量声明提升

1. 函数声明`（function fn() {}）`与变量声明`var `，会被隐式的提到作用域顶部
2. 函数声明的优先级高于变量，如果变量名跟函数名相同且未赋值，则函数声明会覆盖变量声明
3. 声明语句中的赋值部分并不会被提升，只有变量的名称被提升

##### 作用域链

因为函数的嵌套形成作用域的层级关系。当函数执行时，从当前作用域开始搜，没有找到的变量，会向上层作用域查找，直至全局函数，这就是作用域链。

- 在 JavaScript 中，作用域为 function(){}内的区域，称为函数作用域。
- 全局函数无法查看局部函数的内部细节，但局部函数可以查看其上层的函数细节，直至全局细节

##### 闭包

函数F内部有一个函数G，函数 G可以访问到函数F中的变量，那么函数G就是闭包。作用域的劫持。

```javascript
function F() {
  let a = 1
  window.G = function () {
  	console.log(a)
  }
}
F()
G() // 1 G中使用了F函数作用域中定义的变量，劫持了F的作用域
```

#### 寄生组合式继承

```javascript
function inherits (Child, Parent) {
    // 更改原型对象，构造函数，_proto_ 指向
    Child.prototype = Object.create(Parent.prototype)
    Child.prototype.constructor = Child
    Child._proto_ = Parent
  }
  
  function Person(age) {
    this.age = age
  }
  Person.prototype.parentFn = function() {
    console.log('parentFn-', this.age)
    return this.age
  }
  function Chinese(name, age) {
    Person.call(this, age)
    this.name = name
  }
  inherits(Chinese, Person)
  
  // 继承之后 再 定义子类构造函数的原型对象上的方法
  Chinese.prototype.childFn = function() {
    console.log('childFn --', this.name)
    return this.name
  }
  
  const pkx = new Chinese('pankx', '22')
  console.log(pkx)
  pkx.parentFn()
  pkx.childFn()
  
  
  // Object.create() 约等于如下函数
  function create(proto) {
    function fn () {}
    fn.prototype = proto
    return new fn()
  }
```

#### new

- 创建一个空对象obj
- 设置原型链 即 obj . _proto _ = 构造函数.prototype ;
- 让构造函数中的this指向obj
- 返回对象obj

#### this

1. this 总是指向函数的直接调用者
2. 如果有 new 关键字，this 指向 new 出来的实例对象
3. 在事件中，this 指向触发这个事件的对象
4. 箭头函数中，函数体内的this对象，就是定义时所在作用域的对象，而不是使用时所在的作用域的对象。

#### 手写call apply bind

#### 数组去重

#### CSS渲染优先级

解析CSS的时候会按照如下顺序来定义优先级：浏览器默认设置 < 用户设置 < 外链样式 < 内联样式 < html中的style。

##### CSS选择器优先级关系

内联 > ID选择器 > 类选择器 > 标签选择器。

#### 渲染树

DOM Tree + CSSOM --> 渲染树（render tree）

DOM树完全和html标签一一对应

渲染树会忽略掉不需要渲染的元素，比如head、display:none的元素等

渲染树中的每一个节点都存储有对应的css属性

#### 浏览器缓存

**浏览器在加载资源时，先根据这个资源的一些`http header`判断它是否命中强缓存**

expire 、cache-control等信息存储在唉http header里，由后端返回给前端

强缓存不需要发请求、协商缓存需要发请求

##### 强缓存

**强缓存是利用`Expires`或者`Cache-Control`这两个`http response header`实现**

Expires：服务器返回的一个绝对时间

Cache-Control：相对时间

Cache-Control的属性有：

max-age、no-store、no-cache

tips：

​	no-store：没有缓存

​	no-cache：每次有请求发出时，缓存会将此请求发到服务器（译者注：该请求应该会带有与本地缓存相关的验证字段），服务器端会	验证请求中所描述的缓存是否过期，若未过期（注：实际就是返回304），则缓存才使用本地缓存副本。

**`Cache-Control`优先级高于`Expires`**

###### 如何应用强缓存

1. 在`web`服务器返回的响应中添加`Expires`和`Cache-Control Header`
2. 通过配置`web`服务器的方式，让`web`服务器在响应资源的时候统一添加`Expires`和`Cache-Control Header`

**强缓存还有一点需要注意的是，通常都是针对静态资源使用，动态资源需要慎用**

##### 协商缓存

1. 浏览器第一次跟服务器请求一个资源，服务器在返回这个资源的同时，在`respone`的`header`加上`Last-Modified`的`header`，这个`header`表示这个资源在服务器上的最后修改时间
2. 当浏览器对某个资源的请求没有命中强缓存，就会发一个请求到服务器，验证协商缓存是否命中，如果协商缓存命中，请求响应返回的`http`状态为`304`并且会显示一个`Not Modified`
3. 浏览器再次跟服务器请求这个资源时，在`request`的`header`上加上`If-Modified-Since`的`header`，这个`header`的值就是上一次请求时返回的`Last-Modified`的值

服务器返回 `Last-Modified`

客户端带上 `If-Modified-Since`

服务端返回 `ETag`

客户端带上`If-None-Match`

#### Defer async

defer：延迟脚本。立即下载，但延迟执行（延迟到整个页面都解析完毕后再运行），按照脚本出现的先后顺序执行。
async：异步脚本。下载完立即执行，但不保证按照脚本出现的先后顺序执行。

#### 回流

当渲染树中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。这就称为回流(reflow)。

#### Web Worker

运行在后台的JavaScript，不影响页面的性能。获取不到document对象。

#### Symbol

对象中Symbol()属性不能被遍历。

#### Proxy

```javascript
const proxy = new Proxy(target, handler)
// target、handelr都是对象
// 
```

#### CDN

Content Delivery Network，即内容分发网络

通过cdn的方式可以快速访问到静态资源

在当前的前端框架下，结合webpack使用cdn更方便

1. 把dist下的图片，js，css上传到cdn
2. 在webpack里配置output.publicPath: '[http://cdn.test.com](http://cdn.test.com/)'，css的输出在css-loader里配置，同样图片的输出在url-loader里配置。



#### vue中的key

- v-for遍历时，用id，uuid之类作为key，唯一标识节点加速虚拟DOM渲染
- key主要作用于Vue的virtual DOM算法，在diff new nodes list和old nodes list时，作为识别VNode的一个线索。
- 使用了key，Vue会根据keys的顺序记录element，**曾经拥有了key的element如果不再出现的话，会被直接remove或者destoryed。**



### 按需引入

#### Rollup实现

正常以ES6模式导出即可

```JavaScript
const phUtils = {
  formatBankNo,
  formatDate,
  formatMoney,
  getUrlParameter,
  formatToMask,
}
export default phUtils
export { formatBankNo, formatDate, formatMoney, getUrlParameter, formatToMask }
```

#### 组件实现

需要引入 **babel-plugin-import** 插件

因为虽然可以通过 `ES6` 的 `import { } from` 的语法来导入单组件的 `JS` 文件。但是，我们还需要手动引入组件的样式。

所以需要引入 **babel-plugin-import** 插件

**通过这个插件自动引入需要的样式文件**

```javascript
import { Button } from 'antd';

      ↓ ↓ ↓ ↓ ↓ ↓

var _button = require('antd/lib/button');
require('antd/lib/button/style');
```



#### Cookie

**Cookie 不可以 跨域**





### v-if v-for

### Vue的派发更新



### 动态组件与异步组件



### es6面试题

#### 箭头函数与function的区别





#### 



### VUE 与 React







### webpack

#### 编译流程

#### 编译优化

#### 插件编写