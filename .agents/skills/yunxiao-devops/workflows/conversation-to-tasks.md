---
description: 根据对话内容整理成任务和子任务并创建
---

# 对话内容整理为任务

## Step 1: 读取配置

// turbo
```
读取 .yunxiao.json 获取 organizationId、spaceId、workitemTypeId
```

## Step 2: 提取任务信息

```
从对话上下文中提取：
1. 讨论的功能点 / 问题点 / 优化点
2. 涉及的模块（从配置的 modules 列表中匹配）
3. 具体要做的事项
4. 优先级判断

整理为结构化的任务列表：
  - 哪些是独立的主任务/需求
  - 哪些是某主任务下的子任务
  - 哪些是 Bug

向用户确认整理结果后再创建。
```

## Step 3: 批量创建

// turbo
```
按确认后的任务列表，依次调用 create_work_item：

对于主任务/需求：
  - subject: "[模块] 功能描述"
  - workitemTypeId: Req 或 Task 类型 ID
  - description: 从对话中提炼的需求描述

对于子任务：
  - parentId: 对应主任务的 workItemId
  - subject: "[层级] 具体实现"
  - workitemTypeId: Task 类型 ID

对于 Bug：
  - subject: "[模块] 问题现象"
  - workitemTypeId: Bug 类型 ID
  - description: |
      ## 现象
      从对话中提取的问题描述
      ## 复现步骤（如有）
      ...
```

## Step 4: 输出汇总

```
汇总所有创建的工作项：

从本次对话中创建了 N 个工作项：

需求/任务：
  1. [编号] [模块] 标题
     └── [编号] 子任务1
     └── [编号] 子任务2

Bug：
  1. [编号] [模块] 问题描述
```
