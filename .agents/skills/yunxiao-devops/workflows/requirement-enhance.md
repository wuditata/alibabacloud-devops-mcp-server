---
description: 将简略需求优化为标准 User Story 并补充验收条件
---

# 需求内容优化

## Step 1: 读取原始需求

```
读取 .yunxiao.json 获取 organizationId

获取目标需求：
  调用 get_work_item(workItemId) → 提取当前标题和描述

判断优化范围：
  单个需求 → 直接处理
  批量优化 → search_workitems 筛选（如标题以"实现"开头的技术描述类需求）
```

## Step 2: AI 改写为 User Story

```
将原始描述改写为标准用户故事格式：

【用户故事】
作为 [角色]，
我希望 [功能/行为]，
以便 [业务价值/目标]。

【业务流程】
1. 用户执行 xxx
2. 系统响应 xxx
→ ...

【影响分析】
- 涉及模块：xxx
- 关联接口：xxx
- 数据变更：xxx
```

## Step 3: 补充验收条件

```
根据需求描述生成至少 5 条可量化的验收条件（AC）：

【验收条件】
1. 功能性验收：xxx（预期输入 → 预期输出）
2. 边界条件：xxx
3. 异常处理：xxx
4. 性能要求：xxx（如响应时间 < 500ms）
5. 兼容性：xxx

每条 AC 须满足：
  - 可测试（有明确的通过/失败判定）
  - 可量化（有具体数值或标准）
```

## Step 4: 写回云效

```
调用 update_work_item：
  - workItemId
  - updateWorkItemFields:
      description: 合并后的完整描述（User Story + 流程 + AC）

输出变更对比：
  📝 需求 TASK-xxx 已更新
  原始描述：xxx（简略）
  优化后：包含 User Story + 业务流程 + 5 条 AC
```

## 批量模式

```
搜索目标需求：
  search_workitems(category: "Req", spaceId, subject: "实现*")

对每个需求执行 Step 2-4

汇总报告：
  已优化 N 个需求，其中：
  - 补充 User Story: N
  - 补充验收条件: N
  - 跳过（已有完整描述）: M
```
