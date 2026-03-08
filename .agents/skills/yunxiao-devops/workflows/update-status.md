---
description: 更新工作项状态（如待处理→处理中）
---

# 更新工作项状态

## Step 1: 读取配置

// turbo
```
读取 .yunxiao.json，定位目标组织（default 或用户指定），获取 token、organizationId 及项目配置
```

## Step 2: 查找目标工作项

// turbo
```
根据用户提供的编号（如 MGKH-21）：
  - 调用 search_workitems 搜索（需指定 category 和 spaceId）
  - 从结果中匹配 serialNumber 找到 workItemId
```

## Step 3: 获取工作流状态列表

// turbo
```
调用 get_work_item_workflow（projectId + workItemTypeId）获取可用状态及 ID
```

## Step 4: 变更为「处理中」的前置确认

> **重要**：变更为「处理中」时，项目工作流要求必填以下三要素。
> 且「预计工时」不可通过 customFieldValues 直接修改，必须先通过 create_estimated_effort 登记。

```
向用户确认以下信息（可提供默认值）：

1. 计划开始时间（fieldId: 79，format: date，如 2026-03-07）
2. 计划完成时间（fieldId: 80，format: date，如 2026-03-14）
3. 预计工时（单位：分钟，如 480 = 8小时）

用户确认后再执行后续步骤。
```

## Step 5: 登记预计工时

// turbo
```
调用 create_estimated_effort：
  - id: workItemId
  - owner: assignedTo 的 userId
  - spentTime: 用户确认的预计工时（分钟）
```

## Step 6: 更新状态

// turbo
```
调用 update_work_item：
  - workItemId: 目标工作项 ID
  - updateWorkItemFields:
      status: 目标状态 ID（处理中 = 100010）
      customFieldValues:
        "79": 计划开始时间
        "80": 计划完成时间
```

## Step 7: 确认结果

```
输出：
  [编号] [标题] 状态已更新为「处理中」
  计划开始: yyyy-MM-dd
  计划完成: yyyy-MM-dd
  预计工时: N 小时
```
