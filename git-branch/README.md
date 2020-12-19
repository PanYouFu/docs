---
sidebarDepth: 3
---

# Git分支管理规范

## 前言
> 我们日常工作中，大部分需求是根据实际业务来实现或迭代某些功能。及功能驱动开发（Feature-driven development，简称FDD）。在一个需求周期中，多人同步开发，并历经开发，SIT测试，UAT测试，上线多个阶段，故维护好分支管理是很有必要的。因此设计并介绍一套分支管理规范。

## 常用分支简介
+ **Production 分支**  生产分支，master分支
    + 该分支用于部署代码至生产环境，一般由 `release` 或 `hotfix` 分支合并；任何情况下不允许直接在 `master` 分支上修改代码。

+ **Develop 分支**  开发分支
    + 该分支用于部署代码至测试环境，支持冒烟测试与SIT测试。分支的提交记录主要各从`Feature`分支合并而来

+ **Feature 分支** 功能分支
    + 开发一个新的功能时需要新增功能分支，一旦开发完成，合并代码至`Develop`分支。      <br/>
    多个功能并行开发时需要以某个`Develop`为基础，新建多个`Feature`分支。      <br/>
    冒烟测试发现的Bug在`Feature`分支上更改后合并至`Develop`。      <br/>
    冒烟通过，删除`Feature`分支

+ **Release 分支** 预发布分支
    + `Release`分支是为新产品的发布做准备的。基于`Develop`分支创建。部署该分支代码至测试环境，支持UAT测试     <br/>
    UAT结束后，合并该分支到`Master`和`Develop`分支     <br/>
    *注：非必须，需求紧迫时可不必建立。

+ **Bugfix 分支** 测试环境bug修复分支
    + `BugFix` 分支用于修复测试阶段发现的Bug。基于`Develop`分支创建。      <br/>
    测试阶段结束后，删除`BugFix`分支

+ **Hotfix 分支** 生产环境bug修复分支
    + `Hotfix` 分支用于修复生产环境发现的Bug, Bug修复后，合并至Master和Develop分支。
![Git的基本流程](./images/git-flow.png)

## 流程规范

### 正常开发流程规范
+ 基于 `master` 分支，新建 `Develop` 分支 -> 本次需求的主开发分支。
+ 基于 `Develop` 开发分支，根据需求任务，新建多个 `Feature` 功能开发分支。
+ 开发任务完成，合并 `Feature` 至 `Develop` 分支。部署`Develop` 分支至测试环境，进入冒烟测试。
+ 在 `Feature` 分支修复冒烟测试期间Bug，同样合并至`Develop` 分支进行部署。
+ 删除各 `Feature` 分支

### SIT阶段修复BUG流程规范
+ SIT阶段发现Bug，需基于 `Develop` 分支新建个人 `Bugfix` 分支。
+ `Bugfix` 分支，应对根据Bug所属功能责任人，进行创建。
+ Bug修复后，需合并 `Bugfix` 分支至 `Develop` 分支。重新部署。

### UAT阶段，回归阶段修复BUG流程规范
+ SIT结束后，基于 `Develop` 分支创建 `Release` 分支。部署 `Release` 分支代码，用于UAT与回归测试。 
+ UAT阶段同样在 `Bugfix` 分支上进行修复。修复后合并至 `Release`分支。
+ UAT、回归测试结束后，删除 `Bugfix` 分支。

### 版本归并，发版流程规范
+ 各测试阶段都通过后，将当前 `Release` 分支合并至`master`分支。
+ 删除 `Release` 分支。
+ 在 `master` 分支 上给最新一次提交打上Tag。记录版本信息。部署 `master` 分支代码至生产环境。
+ 删除上个版本`Develop 分支`。

### 生产环境修复BUG流程规范
+ 基于 `master` 分支，新建 `Hotfix` 分支。
+ 合并`Hotfix` 分支至 `Develop` 分支，部署测试环境，重新验证。
+ 验证通过，合并`Hotfix` 分支至 `master` 分支。删除 `Hotfix` 分支。
+ 在 `master` 分支 上给最新一次提交打上Tag。记录版本信息。部署 `master` 分支代码至生产环境。

## 分支命名规范
+ **`master 分支`**      <br/>
git仓库自带主分支。保持唯一性。

+ **`Develop 分支`**      <br/>
要素：缩写，版本日期     <br/>
举例：`dev_200325`

+ **`Feature 分支`**      <br/>
要素：小写，版本日期，*需求卡片ID 或 需求简介，开发UM     <br/>
举例：`fea_200325_PH-MP#783_pankaixin792`    <br/>
*注：需求卡片由于会出现提供不及时情况，可按实际情况添加。*

+ **`Bugfix 分支`**
要素：小写，版本日期，开发UM     <br/>
举例：`bugfix_200325_pankaixin792`     <br/>

+ **`Release 分支`**     <br/>
要素：小写，版本日期     <br/>
举例：`release_200325`

+ **`Hotfix 分支`**      <br/>
要素：小写，版本日期(出现问题的版本)，开发UM      <br/>
举例：`hotfix_200325_pankaixin792`

## 分支操作与并行开发规范
在一个完整的项目周期中，我们主要对分支进行，新建，合并，删除操作。
### 新建分支
+ `Develop 分支`新建
    + `Develop 分支`，基于稳定的 `master` 新建。      <br/>
    多版本并行开发时：      <br/>
    如0325，0410并行开发；两个版本 `Develop 分支` 皆基于 `master` 新建。      <br/>
    0325发版后，合并 0325 `Develop 分支` 至 `master`；      <br/>
    合并 `master` 至0410 `Develop 分支`。      <br/>
+ `Feature`、`Release`、`Bugfix 分支`，必须基于当前版本的Develop新建。
+ `Hotfix 分支`，必须基于 `master` 新建

### 合并分支
+ `Feature 分支`若有待上线功能，需合并至 `Develop 分支`。
+ `Develop 分支` 由`Feature 分支`合并 或 由`master`合并而来。
+ `Bugfix 分支`需合并至 `Release 分支`。
+ `Release 分支`，需在备发版阶段，合并至 `master 分支`。
+ `Hotfix 分支`，需合并至 `Develop 分支`进行测试验证；合并至 `master 分支`，进行生产验证。
+ `master 分支`的每次更新，需及时同步至当前尚未发布的 `Develop 分支`。

### 删除分支
+ `Feature 分支`在冒烟测试结束后，需删除。
+ `Bugfix`，`Release 分支`在发版完成后，需删除。
+ `Hotfix 分支`在重新发版完成后，需删除。

## 日志与Tag规范
### Tag规范
+ `Release 分支`合并至 `master` 后，需给最新一次提交打Tag。      <br/>
    + Tag命名规范：      <br/>
    要素：日期，迭代版本号，备注信息（需求简介）      <br/>
    举例：1、`git tag -a v200325 -m "UI组件全量上线"` ；2、`git tag -a v20200325 -m "战疫营销活动"`
+ `Hotfix 分支`合并至 `master` 后，需给最新一次提交打Tag。      <br/>
    + Tag命名规范：      <br/>
    要素：日期，迭代版本号小版本上升，备注信息（需求简介，bug描述）      <br/>
    举例：1、`git tag -a v200325^1 -m "UI组件全量上线-输入框校验规则优化"` ；2、`git tag -a v200325^1 -m "战疫营销活动-紧急文案修改`"
### commit日志规范
> commit需添加，Type（类型），Subject（描述）
+ Type
    + feat：新功能（feature）
    + fix：修补bug （bug 对应卡片id）
    + docs：文档（documentation）
    + style： 格式（不影响代码运行的变动）
    + refactor：重构（即不是新增功能，也不是修改bug的代码变动）
    + test：增加测试
    + chore：构建过程或辅助工具的变动
+ Subject 本次提交内容的简单描述

## 小结
维护一个项目时。最重要的分支为 `Develop` 与 `master`。
`master`保持稳定，用于部署生产环境的代码。
`Develop 分支`持续迭代，使得项目的版本记录有迹可循。
`Feature 分支`用于开发功能，拆分不同任务，做到协同工作。
`Bugfix 分支`用于问题修复。
`Release 预发布分支`，作为正式发版前的准备，一般较为稳定，不在其上面做大的改动。
`Hotfix 热修复分支`，生命周期最短，修复且生产验证完毕后，则销毁，销毁前需合并至 `master`，并在 `master` 上打上标签，记录修复。

