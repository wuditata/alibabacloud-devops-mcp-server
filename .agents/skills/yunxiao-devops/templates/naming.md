# 工作项命名规则与模板

## 命名规则

### 需求 (Req)

格式：`[模块] 功能描述`

```
✅ [培训] 班级分组管理
✅ [租赁] 逾期短信通知优化
✅ [小程序] 会员缴费状态查询
❌ 新功能开发              ← 太模糊
❌ 修改培训模块的一些东西    ← 不具体
```

### 任务 (Task)

格式：`[模块] 动作 + 对象 + 目标`

```
✅ [培训] 新增班级分组 CRUD 接口
✅ [培训] 课时消耗支持选择班级分组
✅ [小程序] 缴费状态页支持多会员筛选
❌ 写代码                  ← 毫无信息量
```

### 子任务

格式：`[层级] 具体实现描述`

```
✅ [后端] TrainingClassGroup 实体与 Mapper
✅ [后端] 班级分组 Service + Controller
✅ [前端] 班级分组管理页面
✅ [小程序] 课时记录展示班级分组信息
```

### 缺陷 (Bug)

格式：`[模块] 问题现象描述`

```
✅ [租赁] 搜索地址+业主姓名时无结果返回
✅ [小程序] 多选会员时缴费状态无数据
❌ Bug修复                  ← 毫无信息量
❌ 有个bug                  ← ???
```

---

## 创建模板

### 模板 1：标准需求 + 子任务拆分

```yaml
主需求:
  subject: "[模块] 功能描述"
  category: Req
  description: |
    ## 背景
    为什么要做这个功能

    ## 目标
    要达到什么效果

    ## 验收标准
    - [ ] 标准1
    - [ ] 标准2

子任务拆分:
  - subject: "[后端] 数据模型设计与实现"
    category: Task
    parentId: 主需求ID

  - subject: "[后端] Service + Controller 实现"
    category: Task
    parentId: 主需求ID

  - subject: "[前端] 管理页面实现"
    category: Task
    parentId: 主需求ID

  - subject: "[测试] 功能测试与验收"
    category: Task
    parentId: 主需求ID
```

### 模板 2：Bug 修复

```yaml
Bug:
  subject: "[模块] 问题现象描述"
  category: Bug
  description: |
    ## 现象
    具体问题描述

    ## 复现步骤
    1. 步骤1
    2. 步骤2

    ## 期望行为
    正确的表现应该是什么

    ## 影响范围
    受影响的功能/用户
```

### 模板 3：技术优化

```yaml
主需求:
  subject: "[模块] 优化描述"
  category: Req
  description: |
    ## 现状问题
    当前存在什么问题

    ## 优化方案
    如何优化

    ## 预期效果
    优化后的改善

子任务:
  - subject: "[后端] 重构 XXX 逻辑"
    category: Task
  - subject: "[后端] 性能优化 & 测试验证"
    category: Task
```

---

## 创建工作项的 API 调用示例

### 创建主需求

```
create_work_item:
  organizationId: "org-xxx"
  spaceId: "project-xxx"
  subject: "[培训] 班级分组管理"
  workitemTypeId: "req-type-id"    # 从 list_work_item_types 获取
  assignedTo: "user-xxx"           # 从 search_organization_members 获取
  description: "## 背景\n..."
  formatType: "MARKDOWN"
```

### 创建子任务（挂到主需求下）

```
create_work_item:
  organizationId: "org-xxx"
  spaceId: "project-xxx"
  subject: "[后端] TrainingClassGroup 实体与 Mapper"
  workitemTypeId: "task-type-id"
  assignedTo: "user-xxx"
  parentId: "主需求的 workItemId"   # 关键：建立父子关系
  description: "实现要点..."
  sprint: "sprint-id"              # 可选：关联迭代
```

---

## ID 获取流程

创建工作项前需要准备的 ID：

```
organizationId  ← get_user_organizations
spaceId         ← search_projects (项目的 id 字段)
workitemTypeId  ← list_work_item_types (按 category 筛选)
assignedTo      ← search_organization_members 或 get_current_organization_Info
parentId        ← 主需求创建后返回的 id（仅子任务需要）
sprint          ← list_sprints（可选）
```
