---
description: 根据需求或任务创建对应的测试任务
---

# 创建测试任务

## Step 1: 读取配置

// turbo
```
读取 .yunxiao.json，定位目标组织（default 或用户指定），获取 token、organizationId 及项目配置
```

## Step 2: 获取源需求信息

// turbo
```
根据用户提供的需求编号或关键词：
  - 调用 get_work_item 获取需求详情（含描述和验收标准）
  - 或调用 search_workitems 搜索相关需求

提取测试要点：
  - 功能点列表
  - 验收标准
  - 边界条件
  - 异常场景
```

## Step 3: 生成测试任务方案

```
基于需求分析，生成测试任务列表：

1. 功能测试项（每个功能点一个子任务）
2. 边界测试项
3. 异常场景测试项
4. 回归测试项（如涉及已有功能）

向用户确认后再创建。
```

## Step 4: 创建测试主任务

// turbo
```
调用 create_work_item：
  - subject: "[测试] 原需求标题 - 功能测试"
  - workitemTypeId: Task 类型 ID
  - parentId: 原需求的 workItemId（可选，建立关联）
  - description: |
      ## 测试范围
      基于需求 [编号] 的测试任务
      
      ## 测试要点
      - 功能测试：...
      - 边界测试：...
      - 异常测试：...
```

## Step 5: 创建测试子任务

// turbo
```
对每个测试项调用 create_work_item：
  - subject: "[测试] 具体测试描述"
  - workitemTypeId: Task 类型 ID
  - parentId: 测试主任务的 workItemId
  - description: |
      ## 测试步骤
      1. ...
      2. ...
      ## 预期结果
      ...
```

## Step 6: 输出汇总

```
测试任务创建完成：

主任务：[编号] [测试] 原需求标题 - 功能测试
  └── [编号] [测试] 功能点A 正常流程验证
  └── [编号] [测试] 功能点A 边界条件验证
  └── [编号] [测试] 功能点B 异常场景验证
  └── ...

关联需求：[编号] 原需求标题
```
