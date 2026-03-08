---
description: Git 提交时携带云效任务编号
---

# Git 提交携带任务编号

## Step 1: 确定关联任务

```
确定当前开发关联的云效任务：
  方式一：用户直接提供任务编号（如 TASK-183）
  方式二：读取 .yunxiao.json，定位目标组织后调用 search_workitems 搜索：
    - assignedTo: "self"
    - status: "142838"（开发中）
    - category: "Task"
    让用户选择关联的任务
```

## Step 2: 生成 commit message

```
格式规范：

<type>(<scope>): <subject> [任务编号]

type 选项：
  feat     - 新功能
  fix      - Bug 修复
  refactor - 重构
  style    - 样式/格式
  docs     - 文档
  test     - 测试
  chore    - 构建/工具

示例：
  feat(training): 新增班级分组 CRUD 接口 [TASK-185]
  fix(rental): 修复搜索地址+业主姓名无结果 [TASK-183]
  refactor(training): 优化课时消耗逻辑 [TASK-190]
```

## Step 3: 执行提交

```bash
git add .
git commit -m "<生成的 commit message>"
```

## Step 4: 更新任务状态（可选）

```
提交后可调用 update_work_item 更新任务状态：
  - 首次提交 → 状态改为"开发中"(142838)
  - 功能完成 → 状态改为"开发完成"(100011)

也可调用 create_work_item_comment 添加提交记录：
  - content: "提交代码：<commit hash> <commit message>"
```
