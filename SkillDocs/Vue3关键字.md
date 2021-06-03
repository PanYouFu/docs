### proxy

响应式优化

Proxy API 替代 defineProperty API

1. defineProperty API 的局限性最大原因是**它只能针对单例属性做监听**。

   + 对 data 中的属性做了遍历 + 递归，为每个属性设置了 getter、setter。

   + Vue 只能对 data 中预定义过的属性做出响应的原因，在Vue中使用下标的方式直接修改属性的值或者添加一个预先不存在的对象属性是无法做到setter监听的，这是defineProperty的局限性。

     上述问题可以使用 $set

     数组使用     target.splice(key, 1, val)

     对象使用	

     ```
     // 是响应式对象，进行依赖收集
     defineReactive(ob.value, key, val)
     ```

2.  Proxy API的监听是针对一个对象的，那么对这个对象的所有操作会进入监听操作， 这就完全可以代理所有属性，将会带来很大的性能提升和更优的代码。

   1. Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

3. 在 Vue.js 2.x 中，对于一个深层属性嵌套的对象，要劫持它内部深层次的变化，就需要递归遍历这个对象，执行 Object.defineProperty 把每一层对象数据都变成响应式的，这无疑会有很大的性能消耗。

4. Proxy API 并不能监听到对象内部深层次的属性变化，因此它的处理方式是在 getter 中去递归响应式，这样的好处是真正访问到的内部属性才会变成响应式，简单的可以说是按需实现响应式，减少性能消耗。

   **在读取到的时候才会去递归**

   ```javascript
   const proxy = new Proxy(target, handler)
   // target、handelr都是对象
   // handler对象包含，get ,set 等方法
   ```

5. Vue2 需要重写array方法。proxy API 不需要

### 编译优化

Vue.js 2.x 的数据更新并触发重新渲染的粒度是组件级的，单个组件内部 需要遍历该组件的整个 vnode 树。

**在2.0里，渲染效率的快慢与组件大小成正相关：组件越大，渲染效率越慢。**

并且，对于一些静态节点，又无数据更新，这些遍历都是性能浪费。



Vue.js 3.0 做到了通过**编译阶段**对**静态模板的分析**，编译生成了 Block tree。

**在3.0里，渲染效率不再与模板大小成正相关，而是与模板中动态节点的数量成正相关。**

###  **Composition API** 

Vue Composition API 围绕一个新的组件选项**setup** 而创建。setup() 为 Vue 组件提供了状态、计算值、watcher 和生命周期钩子。

### react hooks - vue hook

+ React hook 底层是基于链表实现，调用的条件是**每次组件被render的时候都会顺序执行所有的hooks**。
+ vue hook 只会被注册调用一次，vue 能避开这些麻烦的问题，原因在于它对数据的响应是基于proxy的，对数据直接代理观察。
+ react 数据更改的时候，会导致重新render，重新render又会重新把hooks重新注册一次，所以react复杂程度会高一些。

###  diff方法优化

- Vue2.x 中的虚拟dom是进行全量的对比。

- Vue3.0 中新增了静态标记（PatchFlag）：

  在与上次虚拟结点进行对比的时候，只对比带有patch flag的节点，

  并且可以通过flag 的信息得知当前节点要对比的具体内容化。

### hoistStatic 静态提升

- Vue2.x : 无论元素是否参与更新，每次都会重新创建。
- Vue3.0 : 对不参与更新的元素，只会被创建一次，之后会在每次渲染时候被不停的复用。

-----

----

---

###  Vue 3.0 性能提升主要是通过哪几方面体现

#### 1. 响应式系统提升

Vue2 初始化时，对data中每个属性使用definepropery调用getter和setter使之变为响应式对象。如果属性还是对象，则递归调用使之成为响应式对象。

vue3使用proxy对象重写响应式。proxy的性能本来比defineproperty好，proxy可以拦截属性的访问、赋值、删除等操作，不需要初始化的时候遍历所有属性，另外有多层属性嵌套的话，只有访问某个属性的时候，才会递归处理下一级的属性。

#### **优势：**

- 可以监听动态新增的属性；
- 可以监听删除的属性 ；
- 可以监听数组的索引和 length 属性；

#### **2. 编译优化**

vue3 标记和提升所有静态根节点,diff 的时候只比较动态节点内容

### **composition Api**

vue3 新增的一组 api，它是基于函数的 api，可以更灵活的组织组件的逻辑。

解决options api在大型项目中，options api不好拆分和重用的问题。

### **Proxy 相对于 Object.defineProperty**

有哪些优点？

proxy的性能本来比defineproperty好，proxy可以拦截属性的访问、赋值、删除等操作，不需要初始化的时候遍历所有属性，另外有多层属性嵌套的话，只有访问某个属性的时候，才会递归处理下一级的属性。

- 可以* 监听数组变化
- 可以劫持整个对象
- 操作时不是对原对象操作,是 new Proxy 返回的一个新对象
- 可以劫持的操作有 13 种

### **Vue 3.0 在编译方面有哪些优化？**

vue.js 3.x中标记和提升所有的静态节点，diff的时候只需要对比动态节点内容；

### **Vue.js 3.0 响应式系统的实现原理？**

#### **1. reactive**

设置对象为响应式对象。接收一个参数，判断这参数是否是对象。不是对象则直接返回这个参数，不做响应式处理。创建拦截器handerler，设置get/set/deleteproperty。

#### **get**

- 收集依赖（track）；
- 如果当前 key 的值是对象，则为当前 key 的对
- 象创建拦截器 handler, 设置 get/set/deleteProperty；

如果当前的 key 的值不是对象，则返回当前 key 的值。

#### **set**

设置的新值和老值不相等时，更新为新值，并触发更新（trigger）。

deleteProperty 当前对象有这个 key 的时候，删除这个 key 并触发更新（trigger）。

#### **2. effect**

接收一个函数作为参数。作用是：访问响应式对象属性时去收集依赖

#### **3. track**

#### **接收两个参数：target 和 key**

－如果没有 activeEffect，则说明没有创建 effect 依赖

－如果有 activeEffect，则去判断 WeakMap 集合中是否有 target 属性

－WeakMap 集合中没有 target 属性，则 set(target, (depsMap = new Map()))

－WeakMap 集合中有 target 属性，则判断 target 属性的 map 值的 depsMap 中是否有 key 属性

－depsMap 中没有 key 属性，则 set(key, (dep = new Set())) －depsMap 中有 key 属性，则添加这个 activeEffect

#### **4.trigger**

判断 WeakMap 中是否有 target 属性，WeakMap 中有 target 属性，则判断 target 属性的 map 值中是否有 key 属性，有的话循环触发收集的 effect()。