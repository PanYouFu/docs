

# questions

https://zhuanlan.zhihu.com/p/286021449

https://juejin.cn/post/6844903885488783374

https://www.cnblogs.com/fs0196/p/12500791.html

https://zhuanlan.zhihu.com/p/24001696

https://zhuanlan.zhihu.com/p/127015338





https://segmentfault.com/a/1190000007535316

https://segmentfault.com/a/1190000012806637#2

https://segmentfault.com/a/1190000017224799

https://segmentfault.com/a/1190000017329980

https://www.jianshu.com/p/e081f9aa03fb

https://zhuanlan.zhihu.com/p/55042740

https://www.zhihu.com/question/25532384

https://github.com/sisterAn/blog/issues/21

https://github.com/sisterAn/blog/issues/11

https://zhuanlan.zhihu.com/p/286021449





https://juejin.cn/post/6844904121368068103#heading-8
https://juejin.cn/post/6844904089902383112
https://segmentfault.com/a/1190000021816295
https://www.bilibili.com/read/cv2176252/
https://github.com/geekcompany/ResumeSample/blob/master/web.md





https://github.com/Advanced-Frontend/Daily-Interview-Question

## 常见

### 1. 防抖节流

##### 防抖
  > 触发高频事件n秒内，函数只执行一次，如果n秒内事件再次被触发，则重新计算时间。

###### 举例
搜索框，需要在用户输入时实时搜索。
但，若用户每输入一个字符就调用一次接口，则性能损耗过大。
故，可在此处使用防抖。
使用定时器，用户每次输入时新增一个定时器，清除上一个定时器。
这样保证用户输入过快时，也不会触发查询方法。

```javascript
// 定义防抖函数，入参为实际需要执行的业务方法
function debounce(fn) {
  // 新建标志用于存放定时器的返回值
  let timeout = null
  // 返回一个函数，是因为使用监听事件时，该返回函数作为事件的第二个入参，监听事件发生时，调用该方法
  return function() {
    // 用户输入时清空上一个定时器
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, arguments)
    }, 500)
  }
}

function search(name) {
  console.log(`hello~${name}`)
}

const testIpt = document.getElementById('ipt')
testIpt.addEventListener('input', debounce(search).bind(this, 'pkx')) // 使用bind传参
```



##### 节流

> 高频事件触发，但是在n秒内只执行一次，以降低频率，稀释函数执行频率

###### 举例

resize事件，或者滚动事件这类实时发生的，若一监听到触发就执行某方法则损耗过大。

故当监听到触发时需要加一个定时器，若一定时间内只执行一次。

此种方法即为节流。

```javascript
function throttle(fn) {
  let canRun = true // 通过闭包保存一个标志，标识当前是否可以执行业务方法
  return function() {
    if (!canRun) return // 若当前不能执行，则return
    canRun = false // 若当前可执行，先把标志改为false
    setTimeout(() => {
      fn.apply(this, arguments)
      canRun = true // 业务方法执行完毕后，将标志置为true
    }, 500)
  }
}

// 业务方法
function change(param) {
  console.log(`it has been ${param}`)
}
const box = document.getElementById('testBlock')
// 使用bind方法传出参数，bind方法返回的是一个新的函数，若需要立即执行，需要在后面加上括号
box.addEventListener('mouseover', throttle(change).bind(this, 'changed'))
```

-------



### 2. get&post请求

##### 对比

| 分类         | GET                                 | POST                               | 对比                                                         |
| ------------ | ----------------------------------- | ---------------------------------- | ------------------------------------------------------------ |
| 后退/刷新    | 无害                                | 数据会被重新提交                   | 每次刷新重新提交，性能压力                                   |
| 缓存         | 能被缓存                            | 不被缓存                           | get缓存后，后续发的get请求使用缓存                           |
| 历史         | 参数保留在浏览器历史中              | 参数不被保存                       | 减小浏览器压力                                               |
| 数据长度限制 | 受限于不通过浏览器对于URL长度的限制 | 无限制                             | 服务器因为处理长URL需要消耗资源，故对URL长度做限制           |
| 安全性       | 请求参数放在URL中-不安全            | 请求参数不会被浏览器保存--相对安全 | http协议中，信息是明文传输的。最好改为使用https 进行信息加密 |
| 数据类型限制 | 只允许ascll字符                     | 允许二进制等字符                   | get受限制<br />post选择多                                    |



##### GET比POST快的原因

1. POST 请求包含更多的请求头

2. POST在真正接受数据时，会先将请求头发送给服务器进行确认，然后才真正发数据

   **post请求过程**

   1、浏览器请求`TCP`连接（第一次握手）

   2、服务器响应进行`TCP`连接（第二次握手）

   3、浏览器确认，并发送`POST`请求头(第三次握手)

   4、服务器返回 `100`，`continue` 响应

   5、浏览器开始发送数据

   6、服务器返回 200 ok 响应

   **get请求过程**

   1、浏览器请求`TCP`连接(第一次握手)

   2、服务器答应进行`TCP`连接(第二次握手)

   3、浏览器确认，并发送`GEt`请求头和数据(第三次握手)

   4、服务器返回`200 OK`响应

   post请求多了一步发送请求头，所以慢

3. `GET`请求会缓存上一次请求得到的数据，后续请求会优先使用缓存数据。

4. `POST `请求不能进行管道化传输

   http1.1 后出现了持续链接，持续连接的基础上有了一种管道通信的方式进行速度优化。

   将需要发送给服务器的请求，放在一个队列里，第一个请求发送出去后，不等服务器应答，第二个请求就接着发出去。

   存在问题：服务器可能在队列请求未全部完成时断开，则后续需要重头重新发送请求。

   若是get请求固定的静态资源，重新发送是OK的

   但是post这样的非幂等请求，发送多次是不应当的



##### GET与POST的区别

+ GET 用于获取信息，无副作用，可缓存，幂等

+ POST请求，修改服务器上的数据有副作用，非幂等

  **PS** ：

  ​	幂等：

  ​		对于同一种行为，如果执行不论多少次，最终的结果都是一致相同的，就称这种行为是幂等的。

  ​	非幂等：

  ​		对于同一种行为，如果最终的结果与执行的次数有关，每次执行后结果都不相同，就称这种行为为非幂等。

+ 两个请求都是http协议的两种请求方式，http协议是基于TCP/IP 的应用层协议，无论是GET还是POST，用的都是同一个传输层协议。

+ 报文格式区别

  + 不带参数时，仅仅是第一行的方法名不同，post or get
  + 带参数时，get 的参数放在URL中；post参数放在body中

+ POST 请求将 header 和 body 分开发送。这并不是HTTP协议的规定，而是部分浏览或框架的请求方法。

  不是POST 的必然行为



##### 本质上的异同

+ 是 HTTP 协议的两种发送请求的方式
  + HTTP 是基于 TCP/IP 协议的关于数据如何在网络中通信的协议
  + 因此，GET，POST都是TCP连接
+ 给GET加上request body，给POST带上url参数，技术上是完全行的通的
+ （大多数）浏览器通常都会限制url长度在2K个字节，
+ （大多数）服务器最多处理64K大小的url。超过的部分，恕不处理。
+ 如果你用GET服务，在request body偷偷藏了数据，不同服务器的处理方式也是不同的，有些服务器会帮你卸货，读出数据，有些服务器直接忽略，所以，虽然GET可以带request body，也不能保证一定能被接收到哦。
+ GET产生一个TCP数据包；POST产生两个TCP数据包。（**部分浏览器or框架的请求方法，非post必然行为**）
  + GET，浏览器会把http header和data一并发送出去，服务器响应200
  + POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200
  + 在网络环境好的情况下，发一次包的时间和发两次包的时间差别基本可以无视。
  + 在网络环境差的情况下，两次包的TCP在验证数据包完整性上，有非常大的优点。
  +  并不是所有浏览器都会在POST中发送两次包，Firefox就只发送一次。

-------



### 3. 模块发展

[模块对比](https://www.processon.com/view/link/5c8409bbe4b02b2ce492286a#map)

##### 模块的意义

+ 模块化是为了处理全局污染和依赖管理混乱的问题

##### IIFE

>  Immediately Invoked Function Expression，意为立即调用的函数表达式

在一个单独的函数作用域中执行代码

JS只有全局（global scope）作用域和函数（function scope）作用域。通过使用匿名函数实现作用域的隔离。

```javascript
(function() {
  return { data: {}}
})()
```



##### AMD

+ "Asynchronous Module Definition" --- "异步模块定义"

+ 异步方式加载模块，模块的加载不影响它后面语句的运行。

+ 所有依赖这个模块的语句，都定义在一个回调函数中。等到加载完成之后，这个回调函数才会运行。

+ 使用`requireJS `来编写模块化，特点：**依赖必须提前声明好**。

```javascript
// 模块加载
require([module], callback);
```

```javascript
// 模块定义
define('./index.js',function(code){
  // code 就是index.js 返回的内容
 	// define 语句需要有返回，这样定义的模块才能被其他模块引用
  return { codeVal: code }
})
```



###### require.js的好处

+ 实现js文件的异步加载，避免网页失去响应

+ 管理模块之间的依赖性，便于代码的编写和维护



###### 引入require.js注意事项

引入require.js 时为了防止造成网页失去响应，有两种方法

+ 放在网页底部加载
+ `<script src="js/require.js" defer async="true" ></script>`

  


###### require与define的区别

+ require 的callback不需要return，而define需要。
+ require是模块加载，define是模块定义(因此需要返回sth)



##### CMD

+ Common Module Definition，通用模块定义

+ 使用`seaJS` 来编写模块化，特点：**支持动态引入依赖文件**。
+ 一个模块就是一个文件，模块的区分通过define关键字来定义
	```javascript
  define(factory); // 这里的define是一个全局函数，factory可以是函数、对象或字符串
	```
	
	```javascript
	define(id, deps, factory); // id是模块标识字符串，deps是模块依赖数组
	```
+ 常规模式
	```javascript
define('helloworld', ['jquery'], function(require, exports, module) {
  // 默认参数require,exports,module
	  
	  // 获取模块 a 的接口，调用a模块的方法
	  // 模块加载同步执行
	  var a = require('./helloworlda');
	  a.doSomething();
	  
	  // 对外提供 foo 属性
	  exports.foo = 'bar';
	  // 对外提供 sayHello 方法
	  exports.sayHello = function() { console.log('say hello') };
	  
	  // module是一个对象，存储与当前模块相关的一些属性和方法。
	  console.log(module.id); // helloworld
	  
	  // 通过 return 直接提供接口
	  return {
	    foo: 'bar',
	    doSomething: function() {}
	  };
	})
	```



##### AMD与CMD的区别

**1、AMD推崇依赖前置，在定义模块的时候就要声明其依赖的模块**
**2、CMD推崇就近依赖，只有在用到某个模块的时候再去require** 



**最大的区别是对依赖模块的执行时机处理不同，注意不是加载的时机或者方式不同**

其实加载模块都是异步的。

只不过AMD依赖前置，js可以方便知道依赖模块是谁，立即加载。

而CMD就近依赖，需要使用把模块变为字符串解析一遍才知道依赖了那些模块。



AMD在加载模块完成后就会执行改模块，所有模块都加载执行完后会进入require的回调函数，执行主逻辑。

依赖模块的执行顺序和书写顺序不一定一致，看网络速度，哪个先下载下来，哪个先执行。



CMD加载完某个依赖模块后并不执行，只是下载而已。

所有依赖模块加载完成后进入主逻辑，遇到require语句的时候才执行对应的模块。

这样模块的执行顺序和书写顺序是完全一致的。



##### CommonJS

nodejs 中自带的模块化。

```javascript
var fs = require('fs');
```

+ CommonJS 的一个模块就是一个脚本文件，通过执行该文件来加载模块。

+ 每个模块内部，`module` 变量代表当前模块。

+ `module`是一个对象，它的 exports 属性（即 `module.exports`）是对外的接口。

+ 加载某个模块，其实是加载该模块的 `module.exports` 属性。

+ `require` 命令第一次加载该脚本时就会执行整个脚本，然后在内存中生成一个对象

  *模块可以多次加载，但是在第一次加载时才会运行，结果被缓存*

```javascript
// module.js
module.exports.sayHello = function() {
	console.log('Hello ');
};
// 调用module.js
var myModule = require('module');
myModule.sayHello();
```

```javascript
// module.js
module.exports = function() {
	console.log('Hello ');
};
// 调用module.js
var sayHello = require('module');
sayHello();
```



###### module.export跟exports的区别

+ module.exports 方法还可以单独返回一个数据类型(String、Number、Object...)，而 exports 只能返回一个 Object 对象
+ 所有的 exports 对象最终都是通过 module.exports 传递执行，因此可以更确切地说，exports 是给
   module.exports 添加属性和方法



###### CommonJS特点

- 所有代码都运行在模块作用域，不会污染全局作用域。
- 独立性是模块的重要特点就，模块内部最好不与程序的其他部分直接交互。
- 模块可以多次加载，但是只会在第一次加载时 **运行** 一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
- 模块加载的顺序，按照其在代码中出现的顺序。



######  CommonJS缺点

+ 加载模块是同步的，只有加载完成后才能执行后面的操作，也就是当要用到该模块了，现加载现用，不仅加载速度慢，而且还会导致性能、可用性、调试和跨域访问等问题。
+ Node.js主要用于服务器编程，加载的模块文件一般都存在本地硬盘，加载起来比较快，不用考虑异步加载的方式，因此,CommonJS规范比较适用。然而，这并不适合在浏览器环境，同步意味着阻塞加载，浏览器资源是异步加载的，因此有了AMD CMD解决方案。



##### UMD

兼容AMD，CommonJS 模块化语法。



##### ES Modules

 ES6 引入的模块化，支持import 来引入另一个 js 。一个模块就是一个独立文件。

```javascript
import a from 'a';
```

ES Modules设计思想：尽量的静态化，**编译时**确定模块的依赖关系，以及输入输出的变量

ES6 模块不是对象，而是通过`export`命令显式指定输出的代码，再通过`import`命令输入

```javascript
import { stat, exists, readFile } from 'fs';
// 从fs模块加载3个方法，其他方法不加载
// 此为编译时加载或者静态加载，可以在编译时就完成模块加载
// 这也导致了没法引用 ES6 模块本身，因为它不是对象
```



###### export

+  一个模块可以有多个 `export`。

+ `export`命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。
+ `export`语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
+ `export`变量声明提升

```javascript
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);
```

上面代码输出变量`foo`，值为`bar`，500毫秒之后变成`baz`。



###### import

+ `import`命令是编译阶段执行的，在代码运行之前。优先执行。

+ 由于`import`是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。



###### ES6模块的运行机制

+ 遇到模块加载命令`import`时，不会去执行模块，而是只生成一个动态的**只读**引用。

+ 等到真的需要用到时，再到模块里面去取值，换句话说，ES6的输入有点像Unix系统的“符号连接”，原始值变了，`import`输入的值也会跟着变。

+ 因此，ES6模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

+ 由于ES6输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。



###### ES module工作原理

[工作原理](https://segmentfault.com/a/1190000020388889)



##### CommonJS与ES Modules的区别

+ CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。

+ CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

+ CommonJs 是单个值导出，ES6 Module可以导出多个

+ CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层

+ CommonJs 的 this 是当前模块，ES6 Module的 this 是 undefined



###### ESModule的优势：

- 死代码检测和排除。我们可以用静态分析工具检测出哪些模块没有被调用过。比如，在引入工具类库时，工程中往往只用到了其中一部分组件或接口，但有可能会将其代码完整地加载进来。未被调用到的模块代码永远不会被执行，也就成为了死代码。通过静态分析可以在打包时去掉这些未曾使用过的模块，以减小打包资源体积（treeshaking）。
- 模块变量类型检查。JavaScript属于动态类型语言，不会在代码执行前检查类型错误（比如对一个字符串类型的值进行函数调用）。ES6 Module的静态模块结构有助于确保模块之间传递的值或接口类型是正确的。
- 编译器优化。在CommonJS等动态模块系统中，无论采用哪种方式，本质上导入的都是一个对象，而ES6 Module支持直接导入变量，减少了引用层级，程序效率更高。



###### 二者的差异

**CommonJS模块引用后是一个值的拷贝，而ESModule引用后是一个值的动态映射，并且这个映射是只读的。**

- CommonJS 模块输出的是值的拷贝，一旦输出之后，无论模块内部怎么变化，都无法影响之前的引用。
- ESModule 是引擎会在遇到`import`后生成一个引用链接，在脚本真正执行时才会根据这个引用链接去模块里面取值，模块内部的原始值变了`import`加载的模块也会变。

**CommonJS运行时加载，ESModule编译阶段引用。**

- CommonJS在引入时是加载整个模块，生成一个对象，然后再从这个生成的对象上读取方法和属性。
- ESModule 不是对象，而是通过`export`暴露出要输出的代码块，在`import`时使用静态命令的方法引用指定的输出代码块，并在`import`语句处执行这个要输出的代码，而不是直接加载整个模块。



###### 循环加载

**CommonJS**

1、只输出已执行部分

2、模块只执行一次，再次require时使用缓存值

3、循环加载时，返回的是当前已执行的值

```javascript
// a.js
exports.done = false;
var b = require('./b.js');
console.log('在 a.js 之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');
```

```javascript
// b.js
exports.done = false;
var a = require('./a.js');
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');
```

```javascript
// main.js
var a = require('./a.js');
var b = require('./b.js');
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);
```

执行`main.js`

```
在 b.js 之中，a.done = false
b.js 执行完毕
在 a.js 之中，b.done = true
a.js 执行完毕
在 main.js 之中, a.done=true, b.done=true
```

**ES Modules**

1、ES 是动态引用，取值是指向当前被加载模块的引用

2、执行过的文件，再import时不会重复执行

```javascript
// a.js如下
import {bar} from './b.js';
console.log('a.js');
console.log(bar);
export let foo = 'foo';

// b.js
import {foo} from './a.js';
console.log('b.js');
console.log(foo);
export let bar = 'bar';
```

```
b.js
undefined
a.js
bar
```

------



### 4. npm

##### npm 模块安装机制
+ 发出`npm install`命令
+ 查询`node_modules`目录中是否已经包含指定模块
	+ 若包含，不再重新安装
	+ 若不存在
		+ npm 向 registry 查询模块压缩包的网址
		+ 下载压缩包，存放至根目录的`.npm`目录里
		+ 解压压缩包至`node_modules`



##### npm install实现原理

输入`npm install`后

1. **执行工程自身的 preinstall**

2. **确定首层依赖**

   首层依赖：dependencies 和 devDependencies 属性中直接指定的模块

   *工程本身是整棵依赖树的根节点，每个首层依赖模块都是根节点下面的一棵子树*

   *npm 会开启多进程从每个首层依赖模块开始逐步寻找更深层级的节点*

3. **获取模块**

   + 获取模块信息。确定版本，获取到模块的压缩包地址。
   + 获取模块实体。使用压缩包地址检查本地缓存，若有则去缓存，若无则从仓库员下载。
   + 查找该模块依赖，若有依赖则开始新一轮获取模块信息。

4. **模块扁平化**

   所有模块放在根节点下，去除**重复模块**。

   **重复模块**指 **模块名相同** & **semver 兼容**。semantic version（semver，语义化版本）

   每个semver都对应一段版本允许范围，如果两个允许版本范围存在交集，则得到一个兼容版本

   ```
   node_modules
   -- foo
   
   -- bar
   
   -- lodash（保留的版本为兼容版本）
   ```

   ```
   node_modules
   -- foo
   -- lodash@version1
   
   -- bar
   ---- lodash@version2
   ```
   
5. **安装模块**

6. **执行工程自身生命周期**

   当前 npm 工程如果定义了钩子此时会被执行（按照 install、postinstall、prepublish、prepare 的顺序）。

   最后一步是生成或更新版本描述文件，npm install 过程完成。

-----



### 5. ES5,ES6继承

#### ES6 class

ES5通过构造函数定义并生成新对象，这跟传统的面相对象语言，存在差异。

ES6引入Class(类)，作为对象模板，通过class关键字定义类。

ES6的`class`可以看作只是一个语法糖，它的绝大部分功能，ES5都可以做到。

```javascript
// ES5
function Ponit(x, y) {
  this.x = x
  this.y = y
}
Ponit.prototype.toString = function() {
  return '(' + this.x + ',' + this.y +')'
}
var point5 = new Ponit(2, 3)
point5.toString() // "(2,3)"
```

```javascript
// ES6
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  toString() {
    return `(${this.x},${this.y})`
  }
  sayHi() {
    return '好歌献给你'
  }
}
var point6 = new Ponit(2, 3)
point6.toString() // "(2,3)"

typeOf Point // "function"
Point === Point.prototype.constructor // 类本身就指向构造函数
```

+ constructor是类中的构造方法。每个类中默认有一个constructor。若没写，会使用默认的。

+ this 关键字，指向这个类生成的实例对象。

+ 定义类中其他方法时，不需要添加function关键字，也不要用 **逗号** 隔开。

+ **类的数据类型是  *函数* **

+ **类本身就指向构造函数**

+ 类的所有方法都定义在类的`prototype`属性上面。

  + ```javascript
    class Ponit {
      f1() { console.log('fff') }
    }
    // 等同于
    class Ponit {
      ...
    }
    A.prototype.f1 = function() { console.log('fff') }
    ```
  + 可以通过Object.assign方法一次性给类添加多个方法
		```javascript
		class Ponit {
      ...
    }
    Object.assign(Ponit.prototype, {
    	f1() {},
    	f2() {}
    })
		```


+ 类的原型对象的构造函数指向自身	

  ```javascript
  Ponit.prototype.constructor === A // true
  ```

+ **类**内部定义的方法**不可枚举**。及对类的原型对象使用Object.keys()方法获取的结果为空数组

+ ES5的写法是**可以枚举的**。因为方法是直接定义在原型对象的属性上的。

  ```javascript
  // es6
  Object.keys(Ponit.prototype) // []
  Object.getOwnPropertyNames(Point.prototype) // ["constructor","toString"]
  ```

  ```javascript
  // es5
  var Point = function (x, y) {
    // ...
  }
  Point.prototype.toString = function() {
    // ...
  }
  Object.keys(Point.prototype) // ["toString"]
  Object.getOwnPropertyNames(Point.prototype) // ["constructor","toString"]
  ```

##### constructor方法

+ constructor方法是类的默认方法。

+ 通过new命令生成实例对象时，会调用该方法。

+ 类中必须有constructor方法，若未显示定义，则会被默认添加。

+ constructor方法默认返回类的实例对象。*也可以自定义返回其他对象，其他对象不是类的实例*。
+ ES5中构造函数不使用new操作符也能调用，但是类必须使用new操作符才能是用，否则报语法错误。

##### 类的实例对象

+ 实例的属性定义在自身，或者定义在原型链上。

  ```JavaScript
  class Point {
    constructor(x, y) {
      this.x = x
      this.y = y
    }
    f() {
      return [x, y]
    }
  }
  const p = new Point(2, 3)
  p.f() // [2, 3]
  p.hasOwnerProperty('x') // true
  p.hasOwnerProperty('y') // true
  p.hasOwnerProperty('f') // false
  
  p.__proto__.hasOwnProperty('f') // true 方法 f 定义在实例对象的构造函数的原型对象上
  ```

+ 类的所有实例，共享一个原型对象。

  ```JavaScript
  let p1 = new Point(2, 3)
  let p2 = new Point(6, 7)
  p1.__proto__ === p2.__proto__ === Point.prototype
  
  // 若此时在p1的原型对象上添加方法，p2也可以同步使用
  p1.__proto__.f2 = function () { return 'this is f2' }
  p2.f2() // "this is f2"
  ```

+ 不存在变量提升。使用new操作符是，必须已经定义了类。

##### class表达式

```javascript
const MyClass = class my {
	...
}
const MyClass = class {
	...
}
```

```javascript
// 立即执行class
let instance1 = new class {
  constructor(x) {
    this.x = x
  }
  f1() { return x }
}(55)

instance1.f1() // 55
```

##### 私有方法&私有属性

通过 symbol 数据类型实现私有方法，私有属性

```JavaScript
const bar = Symbol('bar')
const snaf = Symbol('snaf')

class My {
  constructor(x) {
    this.x = x
  }
  // 公有方法
  fun1(baz) {
    this[bar](baz) // 调用私有方法
  }
  // 私有方法
  [bar](baz) {
    this[snaf] = baz
  }
}
```

##### this指向

+ 类中的this默认指向，类的实例对象

+ 解决类中方法单独使用时的this报错问题。

  *因为this指向的是实例对象。单独使用方法时会找不到this*

  ```javascript
  // bind
  class point {
    constructor() {
      this.printName = this.printName.bind(this);
    }
    printName(name) {
      this.print(`Hello ${name}`);
    }
  }
  // 箭头函数
  class point {
    constructor() {
      this.printName = this.printName.bind(this);
    }
    printName(name) {
      this.print(`Hello ${name}`);
    }
  }
  ```

##### name属性

+ 类也有name属性

```JavaScript
class Point {}
Point.name // "Point"
```

##### Class的继承

通过 extends 关键字实现继承

```JavaScript
class ColorPoint extends Point {}
// ColorPoint 继承 Point 类所有属性和方法
```

```javascript
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y) // super() --> 调用父类构造函数
    this.color = color
  }
  toString() {
    return this.color + super.toString() // super.xx 调用父类的 xx 方法
  }
}
```

+ 子类必须在constructor中调用super方法。
+ 子类没有自己的this对象，继承父类的this。
+ **ES6** 继承是先在子类中创建父类的实例对象this，(调用super方法)，再用子类构造函数修改this
+ 子类只有在constructor中调用完super方法后，才能使用this。因为子类的实例是基于父类实例的加工
+ 子类的实例，同时也是父类的实例。

###### proto & prototype

> 每个对象都有 `__proto__`属性。指向这个对象的 构造函数的  `prototype `属性

+ 子类的`__proto__`的属性表示构造函数的继承，总是指向 **父类**

+ 子类`prototype`属性的`__proto__`属性，表示方法的继承，总是指向父类的`prototype`属性。

  *子类的原型对象的`__proto__`是指向父类的原型对象的*

  ```javascript
  class A {}
  class B extends A {}
  
  B.__proto__ === A // true
  B.prototype.__proto__ === A.prototype // true
  ```

  有上述结果是因为：类的继承按照下面的模式实现的

  ```JavaScript
  class A {}
  class B extends A {}
  
  // B的实例继承A的实例
  Object.setPrototypeOf(B.prototype, A.prototype)
  
  // B继承A的静态属性
  Object.setPrototypeOf(B, A)
  
  // setPrototypeOf(a, b) a的__proto__属性指向b; b是a构造函数的原型对象
  Object.setPrototypeOf = function (obj, proto) {
    obj.__proto__ = proto
    return obj
  }
  ```

  **作为对象，子类的原型( `__proto__`)是父类。作为构造函数，子类的原型对象的原型是父类的原型**

###### Extends的继承目标

`extends`关键字后面可以跟多种类型的值

```javascript
class b extends A {}
```

A 只要是一个有`prototype`属性的函数，就能被`B`继承。任意函数(除了Function.prototype函数)皆有`prototype`。

三种特殊情况

1. 子类继承Object类

   ```JavaScript
   class A extends Object {}
   
   A.__proto__ === Object // true
   A.prototype.__proto__ === Object.prototype // true
   ```

2. 不存在继承

   ```javascript
   class A {}
   
   A.__proto__ === Function.prototype // true
   // a是一个普通函数，故a.__proto__ 指向其构造函数及Function的原型对象，及Function.prototype
   
   A.prototype.__proto__ === Object.prototype // true
   // A.prototype是一个普通对象，故一个普通对象的__proto__指向 Object的原型对象
   ```

3. 子类继承null

   ```javascript
   class A extends null {}
   
   A.__proto__ === Function.prototype // true
   // a是一个普通函数，
   A.prototype.__proto__ === undefined // true
   ```

###### Object.getPrototypeOf

`Object.getPrototypeOf`方法可以用来从子类上获取父类。

```javascript
Object.getPrototypeOf(ColorPoint) === Point // true
```

###### super关键字

`super`关键字既可以做函数使用，也可以作为对象使用。

+ 作为函数时
	```javascript
  class A {}

  class B extends A {
    constructor() {
      super()
    }
  }
	```
  
  1. 子类`B`的构造函数之中的`super()`，代表调用父类的构造函数。
  2. `super()`返回的是子类的实例。`super`内部this指向B。
  3. 故`super()`在这里相当于`A.prototype.constructor.call(this)`
  4. `super()`只能用在子类的构造函数之中。
  
+ 作为对象时

  1. `super`指向父类的原型对象。

  ```javascript
  class A {
    p() { return 2 }
  }
  
  class B extends A {
    constructor() {
      super()
      console.log(super.p())
      // 2
      // 通过super调用父类的方法时，会绑定子类的this；super.print.call(this)
      
    }
  }
  
  let b = new B()
  ```

  ```javascript
  class A {
    constructor() { this.x = 1 }
  }
  
  class B extends A {
    constructor() {
      super()
      this.x = 2
      super.x = 3 // 由于绑定子类的this，所以如果通过super对某个属性赋值，这时super就是this，
      console.log(super.x) // undefined
      console.log(this.x) // 3  赋值的属性会变成子类实例的属性。
    }
  }
  
  let b = new B()
  ```

  **注意** ：

  + `super`指向父类的原型对象，所以定义在父类*实例*上的方法或属性，是无法通过`super`调用的。

  + 使用`super`的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错

###### 实例的`__proto__`属性

子类实例的`__proto__`属性的`__proto__`属性，指向父类**实例**的`__proto__`属性。及，子类的原型的原型，是父类的原型。

```javascript
var p1 = new Point(2, 3)
var p2 = new ColorPoint(2, 3, 'red')

p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // true p2.__proto__ 指向p2的构造函数(类)的原型对象

// 通过子类实例的__proto__.__proto__属性，可以修改父类实例的行为
p2.__proto__.__proto__.printName = function () {
  console.log('Ha')
}
p1.printName() // "Ha"
```

###### 原生构造函数的继承

Number()、String()、Array()、Date()、Boolean()、Function()、Object()、Error()、RegExp()

ES6实现，因为ES6是先新建父类的实例对象`this`（super方法创建父类实例），然后再用子类的构造函数修饰`this`，使得父类的所有行为都可以继承。

+ 继承原生Array构造函数

```javascript
class MyArray extends Array {
  constructor(...args) {
    super(...args)
  }
}

var arr = new MyArray() // 子类的实例拥有了Array的属性
arr[0] = 12
arr.length // 1
arr.length = 0
arr[0] // undefined
```

+ 继承原生Object构造函数，有差异，无法读取入参

```JavaScript
class NewObj extends Object{
  constructor(){
    super(...arguments);
  }
}
var o = new NewObj({attr: true});
console.log(o.attr === true);  // false
// NewObj继承了Object，但是无法通过super方法向父类Object传参。
// 这是因为ES6改变了Object构造函数的行为，一旦发现Object方法不是通过new Object()这种形式调用，ES6规定 // Object构造函数会忽略参数
```

###### Class的静态方法

+ 类的静态方法，可以直接在类上调用，不可以在类的实例上调用。

  如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法。

+ 父类的静态方法，可以被子类继承。

```javascript
class Foo {
  static classMethod() {
    return 'hello'
  }
}
Foo.classMethod() // 'hello'

var foo = new Foo()
foo.classMethod() // TypeError: foo.classMethod is not a function

class Bar extends Foo {}

Bar.classMethod() // 'hello'
```

###### new.target属性

+ Class内部调用`new.target`，返回当前Class。

+ 子类继承父类时，`new.target`会返回子类。



#### ES5,ES6继承比较

+ ES5 继承是：**先创建子类的实例，再将父类的方法添加到this上**(Parent.apply(this))
+ ES6 继承是：**先创建父类实例对象this，然后再用子类的构造函数修改this**(必须在子类的构造函数中调用父类的super()方法)

##### ES5继承

###### 原型链继承

```javascript
function Parent() {
	this.name = 'ppp'
}
Parent.prototype.getName = function() {
  console.log(this.name)
}
function Child() {}

// 子 构造函数的 原型对象 是 父 的实例
Child.prototype = new Parent()
Child.prototype.constructor = Child

var childInstance = new Child()
childInstance.getName() // "ppp"
```

**缺点**

1. 每个实例修改**引用**类型属性，会被其他实例共享。
2. 在创建child实例时，无法向parent传参。

```JavaScript
// 修改简单类型数据，不影响其他实例哈。因为实则并未改变原型链上的数据，而是在实例上新增了一条属性
var child1 = new Child()
child1.name = '111' // 此时child1 有两个name属性，一个在实例上，一个在原型链上
var child2 = new Child()
child2.getName() // 'ppp' 取的是原型链上的数据
```

```JavaScript
// 修改引用类型数据，影响其他实例的取值
function Parent() {
	this.name = 'ppp',
  this.picArr = ['11', '22']
}
//...
var child1 = new Child()
child1.picArr.push('333')
var child2 = new Child()
child2.picArr // ['11', '22', '333']
```

###### 借用构造函数(经典继承)

**优点**

1. 子类可以向父类传参
2. 子类实例修改

**缺点**

1. 每次子类构造实例都需要调用一次父类函数
2. 无法复用父类原型对象的方法

```javascript
function Parent(name) {
  this.arr = ['aa', 'bb']
  this.name = name
}
Parent.prototype.getName = function() {
  return this.name
}

function Child(name) {
  // 接受子类参数；
  // this是子类的某个实例，此时修改this上的属性不影响其他的实例
  // 因为没有new出一个父类的实例，所以无法使用原型链上提供的方法
  Parent.call(this, name) 
}

var child1 = new Child()
child1.arr.push('child1') // ['aa', 'bb', 'child1']

var child2 = new Child()
child2.arr.push('child2') // ['aa', 'bb', 'child2']

var child3 = new Child('333')
child3.name // '333'
child3.getName() // TypeError: child3.getName is not a function
```

###### 组合式继承(原型链继承和借用构造函数合并)

**优点**

1. 解决了每个实例对 引用类型属性 的修改都会被其他的实例共享的问题
2. 子类可以向父类构造函数传参
3. 实现父类方法复用

**缺点**

1. 需要调用两次父类构造函数，第一次是`Child.prototype = new Parent()`,第二次是`Parent.call(this, name)`造成不必要的浪费

```javascript
function Parent(name) {
  this.name = name
  this.arr = [1, 2]
}
Parent.prototype.getName = function() {
  return this.name
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}
Child.prototype = new Parent()
Child.prototype.constructor = Child

// 新建两个实例，两个实例互不影响
var child1 = new Child('A', 10)
console.log('child1', child1) // {name: "A", arr: Array(2), age: 10}
child1.arr.push(3) // child1.arr [1, 2, 3]
child1.getName() // "A"
var child2 = new Child('B', 12)
console.log('child2', child2) // {name: "B", arr: Array(2), age: 12}
child1.arr.push(5) // child1.arr [1, 2, 5]
child1.getName() // "B"
```

###### 原型式继承

将对象复制到新创建实例的原型上

**缺点**：每个实例对引用类型的修改会被其他实例共享

```javascript
var parent = {
  name: 'A',
  arr: [1, 2, 3]
}
function createNewObj(o) {
  function F() {}
  F.prototype = o
  return new F()
}
var child1 = createNewObj(parent)
var child2 = createNewObj(parent)
// name & arr 存在于实例的原型对象上，因此某个实例修改引用类型属性时，会影响其他实例
child1.arr.push(4)
console.log(child2.arr) // [1, 2, 3, 4]
```

**寄生式继承**

使用`Object.create`来代替上述`createNewObj`的实现

**缺点**：无法复用父类的函数，每次创建对象都会创建一遍方法

```javascript
function createNewObj(o) {
	//代替原型式继承的 createNewObj
  var clone = Object.create(o)
  clone.getName = function() {
    console.log()
    return this.name
  }
  return clone
}
```

###### 寄生组合式继承

**优点**：不必为了指定子类型的原型而调用父类型的构造函数

```javascript
function inheritPrototype(Parent, Child) {
  // Object.create(proto) 新建一个对象，新对象的原型对象为proto
  Child.prototype = Object.create(Parent.prototype) 
  Child.prototype.constructor = Child
}
function Parent(name) {
  this.name = name
}
Parent.prototype.getName = function() {
  return this.name
}
function Child(name, color) {
  Parent.call(this, name) // 调用父类构造函数，传递参数
  this.color = color
}
inheritPrototype(Parent, Child)

var child1 = new Child('aaa', 'pink')
console.log(child1) // {name: "aaa", color: "pink"}
child1.getName() // "aaa"
```

-------



### 6. setTimeout、Promise、Async/Await 

> 宏任务`Macrotasks`，微任务`Microtasks`，事件循环`event loop`

#### event loop

JS主线程不断的循环往复的从任务队列中读取任务，执行任务，这个运行机制叫做事件循环。每进行一次循环操作称为 tick。

一次事件循环包括：执行tasks，检查Microtasks队列并执行，执行UI渲染（如果需要）。



#### Microtasks、Macrotasks（task）

JS的Microtasks、Macrotasks(task)是**异步任务**的一种类型

Microtasks微任务 **优先级** *高于* Macrotasks(task)。microtasks 用于处理 I/O 和计时器等事件，每次执行一个。

microtask 为 `async`/`await` 和 Promise 实现延迟执行，并在每个 task 结束时执行。

在每一个事件循环之前，microtask 队列总是被清空（执行）。

##### 微任务 Microtasks

+ process.nextTick
+ promise
+ MutationObserver

##### 宏任务 Macrotasks

+ setTimeout
+ setImmediate
+ setInterval
+ I/O
+ UI 渲染
+ script(整体代码) **PS：部分解释不一样**

**注意**

+ 每个 event loop 都有一个 microtask queue (微任务队列)

+ 每个 event loop 有一个或多个macrotask queue ( 也可以称为task queue )(宏任务队列/任务队列)

+ 一个任务可以放入macrotask queue 也可以放入 microtask queue中

**执行顺序**
每次 event loop 会首先执行 microtask queue微任务队列。
执行完成后，会提取 macrotask queue 的一个任务加入 microtask queue。
接着继续执行microtask queue，依次执行下去直至所有任务执行结束。



#### 异步运行机制

JS是单线程的

##### 一、进程与线程

###### 1.浏览器是多进程的

主要包含以下进程：

+ Browser 进程：浏览器的**主进程**，**唯一**，负责创建和销毁其它进程、网络资源的下载与管理、浏览器界面的展示、前进后退等。
+ GPU 进程：用于 3D 绘制等，最多一个。
+ 第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建。
+ 浏览器渲染进程（浏览器内核）：内部是多线程的，每打开一个新网页就会创建一个进程，主要用于页面渲染，脚本执行，事件处理等。

###### 2. 渲染进程(浏览器内核)

> 浏览器的渲染进程是**多线程**的，页面的渲染，JavaScript 的执行，事件的循环，都在这个进程内进行

+ GUI渲染线程：

  负责渲染浏览器界面，当界面需要*重绘（Repaint）*或由于某种操作引发*回流(Reflow)*时，该线程就会执行。

+ **JavaScript 引擎线程**：

  也称为 JavaScript 内核，负责处理 Javascript 脚本程序、解析 Javascript 脚本、运行代码等。（例如 **V8 引擎**）

+ 事件触发线程：

  用来控制浏览器**事件循环**，注意这不归 JavaScript 引擎线程管。

  当事件被触发时，事件触发线程会把事件添加到待处理队列的队尾，等待 JavaScript 引擎的处理。

+ 定时器触发线程：

   `setInterval` 与 `setTimeout` 所在线程。

  > tips：W3C 在 HTML 标准中规定，规定要求 `setTimeout` 中低于 4ms 的时间间隔算为 4ms 

+ 异步HTTP请求线程：

  在 `XMLHttpRequest` 连接后通过浏览器新开一个线程请求，将检测到状态变更时，如果设置有回调函数，异步线程就**产生状态变更事件**，将这个回调再放入事件队列中。再由 JavaScript 引擎执行。

**注意**：

**GUI 渲染线程 与 JavaScript 引擎线程**  是**互斥**的。当 JavaScript 引擎执行时 GUI 线程会被挂起（相当于被冻结了）。GUI 更新会被保存在一个队列中**等到 JavaScript 引擎空闲时**立即被执行。

> 所以如果 JavaScript 执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞。



##### 二、单线程的 JavaScript

> 在 JavaScript 引擎中负责解释和执行 JavaScript 代码的线程唯一，**同一时间**上只能**执行一件**任务。

**问：为何JS需要是单线程？**

**答：为了避免DOM冲突**

1. 浏览器需要渲染DOM
2. JavaScript可以修改DOM
3. JS执行时，DOM停止渲染
4. 若JS同时执行多个，同时对DOM进行修改，会造成冲突

**为什么不用web worker **：*web worker 是多线程，但web worker 不能访问 window对象，document对象*。

**单线程存在的问题**：

任务需要排队，前一个任务结束，才会执行后一个任务。

当前一个任务执行时间过长时，后面的任务会一直等着。

**总结**

单线程优点：实现比较简单，执行环境单纯

单线程缺点：某一个任务执行过长时，因为后面任务必须排队等待，所以会造成页面卡死。

*为解决上述问题，JS引入**同步**，**异步**。*



##### 三、同步，异步

**1.同步函数**

调用函数立刻获取到返回值

**2.异步函数**

如果在函数 `func` 返回的时候，调用者还不能够得到预期结果，而是需要在将来通过一定的手段得到，那么这个函数就是异步的。

```javascript
fs.readFile('foo.txt', 'utf8', function(err, data) {
    console.log(data)
})
```



##### 四、异步过程

```javascript
fs.readFile('data.json', 'utf8', function(err, data) {
    console.log(data)
})
```

在执行这段代码时，`fs.readFile` 函数返回时，并不会立刻打印 `data` ，只有 `data.json` 读取完成时才打印。

也就是异步函数 `fs.readFile` 执行很快，但后面还有**工作线程**执行*异步任务*、*通知主线程*、*主线程回调等*操作，这个过程就叫做**异步过程**。

> 主线程发起一个异步操作，相应的工作线程接受请求并告知主线程已收到（异步函数返回）；
>
> 主线程继续执行后面的任务，同时工作线程执行异步任务；
>
> 工作线程完成任务后，通知主线程；
>
> 主线程收到通知后，执行一定的动作（调用回调函数）。

**工作线程在异步操作完成后通知主线程，那么这个通知机制又是如何显现喃？答案就是就是消息队列与事件循环。**



##### 五、消息队列与事件循环

> **工作线程将消息放在消息队列，主线程通过事件循环过程去取消息。**

- 消息队列：消息队列是一个先进先出的队列，它里面存放着各种消息。
- 事件循环：事件循环是指主线程重复从消息队列中取消息、执行的过程。

###### 1.事件循环eventloop

主线程不断的从消息队列中取消息，执行消息，这个过程称为事件循环，这种机制叫事件循环机制，取一次消息并执行的过程叫一次循环。

```javascript
$.ajax({
  url: 'xxxx',
  success: function(result) {
    console.log(1)
  }
})
setTimeout(function() {
  console.log(2)
}, 100)
setTimeout(function() {
  console.log(3)
})
console.log(4)
// output：4321 或 4312
```

主线程：

```javascript
console.log(4)
```

异步队列

```javascript
$.ajax({
  url: 'xxxx',
  success: function(result) {
    console.log(1)
  }
})
setTimeout(function() {
  console.log(2)
}, 100)
setTimeout(function() {
  console.log(3)
})
```

**事件循环是JavaScript实现异步的具体解决方案，其中同步代码，直接执行；异步函数先放在异步队列中，待同步函数执行完毕后，轮询执行 异步队列 的回调函数。**

###### 2.消息队列

消息就是注册异步任务时添加的回调函数。

```javascript
$.ajax('XXX', function(res) {
    console.log(res)
})
...
```

主线程在发起 AJAX 请求后，会继续执行其他代码，AJAX 线程负责请求 `XXX`，拿到请求后，会封装成 JavaScript 对象，然后构造一条消息：

```javascript
// 消息队列里的消息
var message = function () {
    callback(response)
}
```

其中 `callback` 是 AJAX 网络请求成功响应时的回调函数。

主线程在执行完当前循环中的所有代码后，就会到消息队列取出这条消息(也就是 `message` 函数)，并执行它。

到此为止，就完成了工作线程对主线程的 `通知` ，回调函数也就得到了执行。

如果一开始主线程就没有提供回调函数，AJAX 线程在收到 HTTP 响应后，也就没必要通知主线程，从而也没必要往消息队列放消息。

##### 六、DOM事件

 **DOM事件**也是异步过程

```javascript
var button = document.getElementById('button')
button.addEventLister('click', function(e) {
   console.log('事件')
})
```

从异步的角度看，`addEventLister` 函数就是异步过程的发起函数，事件监听器函数就是异步过程的回调函数。事件触发时，表示异步任务完成，会将事件监听器函数封装成一条消息放在消息队列中，等待主线程执行。

##### 七、例题

```javascript
console.log(1)
setTimeout(function () {
  console.log(2)
  Promise.resolve(1).then(function () {
    console.log('ok')
  })
})
setTimeout(function (){	
   console.log(3)
})
// 1 2 ok 3
```

**JS异步执行机制**

JS主线程拥有一个 **执行栈（同步任务）**和一个 **任务队列（queue）**。主线程会一次执行代码。

1. 主线程遇到同步函数时，会先将函数入栈，函数运行结束后再将该函数出栈；
2. 当遇到 task 任务（异步）时，这些 task 会返回一个值，让主线程不在此阻塞，使主线程继续执行下去。而真正的 task 任务将交给 **浏览器内核（其他工作线程）** 执行，浏览器内核执行结束后，会将该任务事先定义好的**回调函数**加入相应的**任务队列（microtasks queue/ macrotasks queue）**中。
3. 当JS主线程**清空执行栈（同步任务执行结束）**之后，会按**先入先出**的顺序读取microtasks queue中的**回调函数**，并将该函数入栈，继续运行执行栈，直到清空执行栈，再去读取**任务队列**。（tips: 回调函数入栈后，这里面的同步任务按顺序执行）
4. 当microtasks queue中的任务执行完成后，会提取 macrotask queue 的一个任务加入 microtask queue， 接着继续执行microtask queue，依次执行下去直至所有任务执行结束。

> 复习：微任务 Microtasks（process.nextTick、promise、MutationObserver ）；宏任务Macrotasks（setTimeout、setImmediate、setInterval、I/O、UI 渲染）

**setTimeout**

```javascript
console.log('script start')	//1. 打印 script start
setTimeout(function(){
    console.log('settimeout')	// 4. 打印 settimeout
})	// 2. 调用 setTimeout 函数，并定义其完成后执行的回调函数
console.log('script end')	//3. 打印 script start
// 结果顺序： script start -- script end -- settimeout
```

**Promise**

Promise本身是**同步的立即执行函数**， 当在 executor 中执行 resolve 或者 reject 的时候, 此时是异步操作， 会先执行 then/catch 等，当主栈完成后，才会去调用 resolve/reject 中存放的方法执行，打印 p 的时候，是打印的返回结果，一个 Promise 实例。

```javascript
console.log('script start')
let promise1 = new Promise(function (resolve) {
    console.log('promise1')
    resolve('i am res') // 不影响后面的语句执行。工作线程执行这个异步，执行完后，将结果放入队列
    console.log('promise1 end')
}).then(function (res) {
    console.log('promise2' + res) // 栈执行完成后，读取队列的消息。将队列中的这个回到放入栈中执行。
})
setTimeout(function(){
    console.log('settimeout')
})
console.log('script end')
// 结果顺序：script start -- promise1 -- promise1 end -- script end -- promise2 i am res -- settimeout
```

```javascript
console.log('script start');
// 宏任务
setTimeout(function() {
  console.log('setTimeout');
}, 0);
// .then() 微任务
Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});
console.log('script end');
// 结果顺序： script start -- script end -- promise1 -- promise2 -- setTimeout
```

**async await**

```javascript
async function async1(){
   console.log('async1 start');
   await async2();
   console.log('async1 end')
}
async function async2(){
   console.log('async2')
}
console.log('script start');
async1();
console.log('script end')
// 结果顺序：script start -- async1 start -- async2 -- script end-- async1 end
```

async 函数返回一个 Promise 对象，当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再执行函数体内后面的语句。可以理解为，是让出了线程，跳出了 async 函数体。

await 的含义为等待，也就是 async 函数需要等待 await 后的函数执行完成并且有了返回结果（ Promise 对象）之后，才能继续执行下面的代码。await通过返回一个Promise对象来实现同步的效果。

```javascript
async function async1() {
  console.log('async1 start')
  const a2 = await async2()
  console.log('a2---', a2)
}
async function async2() {
  console.log('async2 start')
  return new Promise(resolve => {
    setTimeout(() => {
      // 定时器异步任务，放置消息队列，不影响栈中的同步任务执行，即不影响最后一行的执行
      console.log('setTimeout start')
      resolve('i am async2 res')
    }, 0)
  })
}

console.log('script-start')
async1()
console.log('script-end')
// script-start -- async1 start -- async2 start -- script-end-- setTimeout start -- a2---i am async2 res
```

#### async await

##### async

async 放在函数声明前，函数成为异步函数。

异步函数的返回值是一个 promise ，如果在函数中 `return` 一个直接量，async 会把这个直接量通过 `Promise.resolve()` 封装成 Promise 对象。

```JavaScript
let hello = async function() { return "Hello" };
hello();
// Promise {<fulfilled>: "Hello"}

let p = hello()
p.then(res => console.log(res)) // Hello
```

##### await

await 只在异步函数里面才起作用。它可以放在任何异步的，基于 promise 的函数之前。它会暂停代码在该行上，直到 promise 完成，然后返回结果值。在暂停的同时，其他正在等待执行的代码就有机会执行了。

```javascript
let res = await hello()
console.log(res)  // Hello
// 添加await关键字后，获得的是promise的结果
```

await 关键字使JavaScript运行时暂停于此行，允许其他代码在此期间执行，直到异步函数调用返回其结果。一旦完成，您的代码将继续从下一行开始执行。

**await 等待的是一个表达式，这个表达式的计算结果是 Promise 对象或者其它值（换句话说，就是没有特殊限定）。**

**await关键字只能用在async定义的函数内。**

**`await` 是个运算符，用于组成表达式，await 表达式的运算结果取决于它等的东西。**

​	1.如果它等到的不是一个 Promise 对象，那 await 表达式的运算结果就是它等到的东西。(**如果不是 promise , await会阻塞后面的代码，先执行async外面的同步代码，同步代码执行完，再回到async内部，把这个非promise的东西，作为 await表达式的结果**)

​	2.如果它等到的是一个 Promise 对象，await 就忙起来了，它会阻塞后面的代码，等着 Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果。(**await 也会暂停async后面的代码，先执行async外面的同步代码，等着 Promise 对象 fulfilled，然后把 resolve 的参数作为 await 表达式的运算结果。**)

##### 为什么使用Async、Await更好

1. 简介，减少使用then
2. Async/Await让try/catch可以同时处理同步和异步错误。
3. Async/Await编写编写条件语句更方便（含有then的条件语句）。

##### async/await 的优势在于处理 then 链

假设一个业务，分多个步骤完成，每个步骤都是异步的，而且依赖于上一个步骤的结果。我们仍然用 `setTimeout` 来模拟异步操作：

```javascript
/**
 * 传入参数 n，表示这个函数执行的时间（毫秒）
 * 执行的结果是 n + 200，这个值将用于下一步骤
 */
function takeLongTime(n) {
    return new Promise(resolve => {
        setTimeout(() => resolve(n + 200), n);
    });
}

function step1(n) {
    console.log(`step1 with ${n}`);
    return takeLongTime(n);
}

function step2(n) {
    console.log(`step2 with ${n}`);
    return takeLongTime(n);
}

function step3(n) {
    console.log(`step3 with ${n}`);
    return takeLongTime(n);
}
```

使用Promise来实现
```javascript
function doIt() {
    console.time("doIt");
    const time1 = 300;
    step1(time1)
        .then(time2 => step2(time2))
        .then(time3 => step3(time3))
        .then(result => {
            console.log(`result is ${result}`);
            console.timeEnd("doIt");
        });
}

doIt();
```

用 async/await 来实现

```javascript
async function doIt() {
    console.time("doIt");
    const time1 = 300;
    const time2 = await step1(time1);
    const time3 = await step2(time2);
    const result = await step3(time3);
    console.log(`result is ${result}`);
    console.timeEnd("doIt");
}

doIt();
```

##### async promise 执行顺序

```javascript
async function async1() {
  console.log( 'async1 start' )
  await async2()
  console.log( 'async1 end' )
}

async function async2() {
  console.log( 'async2' )
}

console.log( 'script start' )

setTimeout( function () {
  console.log( 'setTimeout' )
}, 0 )

async1();

new Promise( function ( resolve ) {
  console.log( 'promise1' )
  resolve();
} ).then( function () {
  console.log( 'promise2' )
} )

console.log( 'script end' )

// script start - async1 start - async2 - promise1 - script end - async1 end - promise2 - setTimeout
```

```javascript
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    //async2做出如下更改：
    new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
    });
}
console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();

new Promise(function(resolve) {
    console.log('promise3');
    resolve();
}).then(function() {
    console.log('promise4');
});

console.log('script end');

// script start -- async1 start -- promise1 -- promise3 -- script end -- promise2 -- async1 end -- promise4 --setTimeout
```

```javascript
async function async1() {
    console.log('async1 start');
    await async2();
    setTimeout(function() {
        console.log('setTimeout1')
    },0)
}
async function async2() {
	setTimeout(function() {
		console.log('setTimeout2')
	},0)
}
console.log('script start');

setTimeout(function() {
    console.log('setTimeout3');
}, 0)
async1();

new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');

// script start -- async1 start -- promise1 -- script end -- promise2 -- setTimeout3 -- setTimeout2 -- setTimeout1
```

```JavaScript
async function a1 () {
    console.log('a1 start')
    await a2()
    console.log('a1 end') // wei 2
}
async function a2 () {
    console.log('a2')
}

console.log('script start')

setTimeout(() => {
    console.log('setTimeout') // hong 1
}, 0)

Promise.resolve().then(() => {
    console.log('promise1') // wei 1
})

a1()

let promise2 = new Promise((resolve) => {
    resolve('promise2.then')
    console.log('promise2') // 这行是同步的，立即执行
})

promise2.then((res) => {
    console.log(res) // wei 3
    Promise.resolve().then(() => {
        console.log('promise3') // wei 4
    })
})
console.log('script end') 

// script start -- a1 start -- a2 -- promise2 -- script end -- promise1 -- a1 end -- promise2.then -- promise3 -- setTimeout
```

```javascript
new Promise(resolve => {
    resolve(1);
    Promise.resolve().then(() => console.log(2)); // 微任务 1
    console.log(4) // 同步
}).then(t => console.log(t)); // 微任务 2
console.log(3); // 同步
// 4 3 2 1
```

-----



### 7. ['1','2','3'].map(parseInt) 输出什么,为什么?

map方法: Array.prototype.map()

是一个数组原型对象上的方法，map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。

```JavaScript
array.map(function(currentValue,index,arr), thisValue)
// function(currentValue,index,arr) 必要
	// currentValue 当前元素值
	// index 当前元素索引
	// arr 当前元素属于的数组对象
// thisValue 可选 上述回调函数的this
```

```javascript
let newArr = ['a', 'b', 'c'].map(function(item, index, arr) {
  console.log(item, index, arr)
 	return item + item
})
console.log(newArr)
// a 0 ["a", "b", "c"] ···
// ["aa", "bb", "cc"]
```

parseInt方法（将字符串转成数字，2进制，8进制，10进制等）

parseInt(string, radix);

第一个参数是需要转换成数字的字符串，第二个参数表示需转换成几进制

```javascript
// ['1','2','3'].map(parseInt) --> ['1','2','3'].map(parseInt(item, index))
parseInt('1', 0) // 10进制，返回 1 
parseInt('2', 1) // 1进制，最大值小于2，故返回 NaN
parseInt('3', 2) // 2进制，最大值小于3，故返回 NaN
```

### 8. Doctype作用? 严格模式与混杂模式如何区分？它们有何意义?

Doctype声明于文档最前面，告诉浏览器以何种方式来渲染页面，这里有两种模式，严格模式和混杂模式。

> <!DOCTYPE> 声明不是一个 HTML 标签

- 严格模式的排版和 JS 运作模式是 以该浏览器支持的最高标准运行。
- 混杂模式，向后兼容，模拟老式浏览器，防止浏览器无法兼容页面。

### 9. fetch发送2次请求的原因

**fetch发送post请求的时候，总是发送2次，第一次状态码是204，第二次才成功**

fetch发送post请求时，fetch第一次发送一个options请求，询问服务器是否支持当前请求头。如果支持，则在第二次请求中，发送真正的post请求。

## http、浏览器对象

### 1. HTTPS 握手过程中，客户端如何验证证书的合法性

