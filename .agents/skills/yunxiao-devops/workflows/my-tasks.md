---
description: 列出我未完成的任务，按项目分组展示
---

# 查看我的待办任务

## Step 1: 读取配置

// turbo
```
读取 .yunxiao.json，定位目标组织（default 或用户指定），获取 token、organizationId 及项目配置
若无配置文件，调用 get_user_organizations 获取 organizationId
```

## Step 2: 查询所有项目的待办

// turbo
```
对配置中的每个 project（或调用 search_projects scenarioFilter="participate" 获取参与的项目），
调用 search_workitems：
  - organizationId: 配置中的值
  - spaceId: 项目的 spaceId
  - category: "Req,Task,Bug"
  - assignedTo: "self"
  - statusStage: 排除已完成的状态阶段
  - orderBy: "gmtModified"
  - sort: "desc"
  - perPage: 50
```

## Step 3: 按项目分组展示

```
将结果按项目分组，每组显示：
  - 项目名称
  - 工作项列表：编号 | 类型 | 标题 | 状态 | 优先级
  - 各项目汇总数量

输出格式示例：

## 项目（3 项）
| 编号 | 类型 | 标题 | 状态 | 优先级 |
|------|------|------|------|--------|
| TASK-183 | Bug | [租赁] 搜索地址+业主姓名时无结果 | 开发中 | P2 |
| TASK-185 | Task | [培训] 班级分组 CRUD 接口 | 待处理 | P1 |
```
