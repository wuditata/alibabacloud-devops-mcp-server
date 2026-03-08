---
description: 分析需求描述，创建主需求并拆分子任务
---

# 分析需求并拆分子任务

## Step 1: 读取配置

// turbo
```
读取 .yunxiao.json，定位目标组织（default 或用户指定），获取 token、organizationId 及项目配置
```

## Step 2: 分析需求

```
根据用户提供的需求描述，分析出：
1. 主需求标题（按命名规则：[模块] 功能描述）
2. 需求背景和目标
3. 验收标准
4. 子任务拆分方案（按层级：后端/前端/小程序/测试）
5. 每个子任务的具体实现要点

向用户确认拆分方案后再继续。
```

## Step 3: 创建主需求

// turbo
```
调用 create_work_item：
  - spaceId: 配置中的项目 ID
  - subject: "[模块] 功能描述"
  - workitemTypeId: 配置中的 Req 类型 ID
  - assignedTo: defaultAssignee 或用户指定
  - formatType: "MARKDOWN"
  - description: |
      ## 背景
      需求背景描述
      
      ## 目标
      要达到的效果
      
      ## 验收标准
      - [ ] 标准1
      - [ ] 标准2

记录返回的 workItemId 作为 parentId
```

## Step 4: 创建子任务

// turbo
```
对每个子任务调用 create_work_item：
  - spaceId: 同主需求
  - subject: "[层级] 具体实现描述"（如 "[后端] 数据模型设计与实现"）
  - workitemTypeId: 配置中的 Task 类型 ID
  - assignedTo: 对应负责人
  - parentId: 主需求的 workItemId
  - description: 具体实现要点
```

## Step 5: 关联迭代（可选）

```
调用 list_sprints 查看进行中的迭代（status: ["DOING"]）
调用 update_work_item 将主需求和子任务关联到迭代：
  - updateWorkItemFields.sprint: 迭代 ID
```

## Step 6: 输出汇总

```
汇总创建结果：
  主需求：[编号] [标题]
  子任务：
    1. [编号] [标题] → 负责人
    2. [编号] [标题] → 负责人
    ...
```
