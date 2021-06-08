# VUE 2+

#### MVVM简介

Model-view-viewmodel

model数据模型、view视图组件。viewModel是view和model层的桥梁。

数据绑定到viewModel层并自动渲染到视图层。

视图变化时通知viewModel更新数据。

#### Vue2.x响应式数据原理

Vue初始化数据时，使用 Object.defineProperty 重新定义 data 数据，给属性添加，get 、set 。页面使用属性时，先进行依赖收集，收集到watcher。如果属性发生变化，会通知相关依赖进行更新操作。

`Observer`中进行响应式的绑定，在数据被读的时候，触发`get`方法，执行`Dep`来收集依赖，也就是收集`Watcher`。

在数据被改的时候，触发`set`方法，通过对应的所有依赖(`Watcher`)，去执行更新。比如`watch`和`computed`就执行开发者自定义的回调方法。

使用发布订阅模式。

##### 观察者模式与发布订阅模式的区别

观察者模式，松耦合

发布订阅模式，解耦。发布者与订阅者之间存在代理人。发布者 将消息 推给 代理人。 订阅者从代理人那获得信息。

#### vue2.x中如何监测数组变化

使用了函数劫持的方式，重写了数组的方法，Vue将data中的数组进行了原型链重写，指向了自己定义的数组原型方法。这样当调用数组api时，可以通知依赖更新。如果数组中包含着引用类型，会对数组中的引用类型再次递归遍历进行监控。这样就实现了监测数组变化。

#### 组件中的data为什么是一个函数

一个组件被复用多次的话，也就会创建多个实例。本质上，`这些实例用的都是同一个构造函数`。如果data是对象的话，对象属于引用类型，会影响到所有的实例。所以为了保证组件不同的实例之间data不冲突，data必须是一个函数。

#### 模板语法中为什么可以不用写this.data

初始化时，通过数据代理，将props,data 中的值放入了this中





#### 生命周期

###### bdeforeCreate

data,el 均为初始化，在当前阶段data、methods、computed以及watch上的数据和方法都不能被访问。

###### created

在实例创建完成后发生，当前阶段已经完成了数据观测，也就是可以使用数据，更改数据，在这里更改数据不会触发updated函数。可以做一些初始数据的获取，在当前阶段无法与Dom进行交互，如果非要想，可以通过vm.$nextTick来访问Dom。

###### beforeMount

data和el均已经初始化，但此时el并没有渲染进数据，el的值为“虚拟”的元素节点。虚拟DOM已创建且生成。在此时也可以对数据进行更改，不会触发updated。

###### mounted

在挂载完成后发生，在当前阶段，真实的Dom挂载完毕，数据完成双向绑定，可以访问到Dom节点，使用$refs属性对Dom进行操作。此时el已经渲染完成并挂载到实例上。

###### beforeUpdate

发生在更新之前，也就是响应式数据发生更新，虚拟dom重新渲染之前被触发，你可以在当前阶段进行更改数据，不会造成重渲染。

###### updated

发生在更新完成之后，当前阶段组件Dom已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新。

###### beforeDestory

发生在实例销毁之前，在当前阶段实例完全可以被使用，我们可以在这时进行善后收尾工作，比如清除计时器。

###### destoryed

发生在实例销毁之后，这个时候只剩下了dom空壳。组件已被拆解，数据绑定被卸除，监听被移出，子实例也统统被销毁。

##### 父子组件生命周期

###### 加载过程

父 - beforeCreate - created

​	--- 子 beforeCreate - created

​	--- 子 beforeMount - mounted

父 - beforeMount - mounted

###### 更新过程

父 - beforeUpdate 

​	-- 子 beforeUpdate

​	-- 子 updated

父 - updated

###### 销毁过程

父 - beforeDestory

​	-- 子 beforeDestory

​	-- 子 destoryed

父 - destoryed

#### Computed和Watch

> watcher 的作用是观察某个响应式变量的改变然后执行相应的回调,由 Watcher 类实例化而成, Vue 中定义了3个 watcher。

> render watcher: 模板依赖并且需要显示在视图上变量，其内部保存了一个 render watcher

> computed watcher: 计算属性内部保存了一个 computed watcher

> user watcher: 使用 watch 属性观察的变量内部保存了一个 user watcher

##### Computed 计算属性

计算属性的初始化是发生在 Vue 实例初始化阶段的 `initState` 函数中。

场景：**一个数据受到多个数据的影响**

计算属性内部保存了一个 computed watcher

一个计算属性的初始化分为两个阶段：

1、实例化一个 computed watcher

2、定义计算属性的getter函数

###### 生成computed watcher

在初始化当前组件时,会执行 `initComputed` 方法初始化计算属性,会给每个计算属性实例化一个 computed watcher。

在实例化 watcher 时传入不同的配置项就可以生成不同的 watcher 实例 ，当传入`{ lazy: true }` 时,实例化的 watcher 即为 computed watcher。









##### watch 侦听属性

场景：**一个数据影响多个数据**









### 响应式原理

三个类：Observer、Dep、Watcher

+ new Vue()，在`initData` 中会执行 `observe` 方法进而实例化 `Observer`。`Observer` 的实例化过程就是递归地把 data 对象和子对象添加 `__ob__` 属性。`__ob__` 属性指向，Observer的实例。同时这个实例拥有一个dep属性，dep属性为 Dep 类的实例。

+ 遍历对象，为每一条属性执行 defineReactive()，为属性添加getter,setter。

+ 在get中收集依赖，在setter中触发依赖。

+ 初始化时会触发watcher，watcher实例化时会，访问属性，触发了属性的  getter。故在此时进行依赖收集

+ 将触发getter的watcher收集进依赖中，即将 watcher实例放入 dep 数组。

+ 使用dep.depend()方法收集依赖。dep实例中维护一个subs数组，存放watcher实例

+ 有多种watcher，如watch，computed等

+ 当给属性设置新值时，触发setter

+ 在setter中遍历subs里的watcher，派发更新，执行watcher的update

+ watcher 实例中会维护两个dep实例构成的数组。在更新值的时候，会同时触发依赖收集，这时候，会产生新的deps数组。我们需要将就的 dep实例删除。以防止不必要的开销。

  *细节*：考虑到 Vue 是数据驱动的，所以每次数据变化都会重新 render，那么 `vm._render()` 方法又会再次执行，并再次触发数据的 getters，所以 `Watcher` 在构造函数中会初始化 2 个 `Dep` 实例数组，`newDeps` 表示新添加的 `Dep` 实例数组，而 `deps` 表示上一次添加的 `Dep` 实例数组。

  在执行 `cleanupDeps` 函数的时候，会首先遍历 `deps`，移除对 `dep.subs` 数组中 `Wathcer` 的订阅，然后把 `newDepIds` 和 `depIds` 交换，`newDeps` 和 `deps` 交换，并把 `newDepIds` 和 `newDeps` 清空。

  考虑到一种场景，我们的模板会根据 `v-if` 去渲染不同子模板 a 和 b，当我们满足某种条件的时候渲染 a 的时候，会访问到 a 中的数据，这时候我们对 a 使用的数据添加了 getter，做了依赖收集，那么当我们去修改 a 的数据的时候，理应通知到这些订阅者。

  那么如果我们一旦改变了条件渲染了 b 模板，又会对 b 使用的数据添加了 getter，如果我们没有依赖移除的过程，那么这时候我去修改 a 模板的数据，会通知 a 数据的订阅的回调，这显然是有浪费的。此过程中移除了a的dep实例

+ 派发更新

  + watcher

    + 队列排序

    `queue.sort((a, b) => a.id - b.id)` 对队列做了从小到大的排序，这么做主要有以下要确保以下几点：

    1.组件的更新由父到子；因为父组件的创建过程是先于子的，所以 `watcher` 的创建也是先父后子，执行顺序也应该保持先父后子。

    2.用户的自定义 `watcher` 要优先于渲染 `watcher` 执行；因为用户自定义 `watcher` 是在渲染 `watcher` 之前创建的。

    3.如果一个组件在父组件的 `watcher` 执行期间被销毁，那么它对应的 `watcher` 执行都可以被跳过，所以父组件的 `watcher` 应该先执行。

    + 







#### Observer,dep,watcher

- `Observer` 将数据定义为响应式，每个 `Observer` 实例都有自己的 `Dep` 来管理依赖。实例化 `Wacther` 的时候进行求值会触发 `getter` ，进而执行 `dep.depend()` 将当前 `Wacther` 加入 Dep 维护的依赖列表，这就是**依赖收集**过程。
- 数据发生变化触发 `setter` 执行 `dep.notify`，`Dep` 会执行所有依赖的 `update` 方法并加入异步更新队列，这就是**触发依赖**过程。

























### 几个问题

#### Data为什么写成函数

#### 为什么在created中新增data的属性不刷新视图

#### 为什么模板里，不需要写成this.data

#### 怎么监听数组的

#### 为什么使用proxy，比较下





#### VUE $set 原理

数组使用     target.splice(key, 1, val)

对象使用	

```
// 是响应式对象，进行依赖收集
defineReactive(ob.value, key, val)
```



#### Vue 改写数组的7种方法

1. 'push',
2.   'pop',
3.   'shift',
4.   'unshift',
5.   'splice',
6.   'sort',
7.   'reverse'



