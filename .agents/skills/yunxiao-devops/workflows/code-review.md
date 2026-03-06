---
description: AI 辅助代码评审，对比分支差异并生成评审意见
---

# AI 辅助代码评审

## Step 1: 获取上下文

```
读取 .yunxiao.json 获取 organizationId
调用 list_repositories 定位目标仓库（或用户直接提供 repositoryId）
```

## Step 2: 确定对比分支

```
方式一：用户指定源分支和目标分支
方式二：自动检测当前 Git 分支作为源分支，目标分支默认 master/main
方式三：从已有 MR 获取：
  调用 list_change_requests → state: "opened" → 选择目标 MR
  从 MR 详情中提取 sourceBranch 和 targetBranch
```

## Step 3: 对比差异

```
调用 compare：
  - organizationId
  - repositoryId
  - from: 目标分支（如 master）
  - to: 源分支（如 feature/xxx）

分析返回的 diff 内容：
  - 变更文件列表
  - 新增/删除/修改行数
  - 具体代码改动
```

## Step 4: AI 评审分析

```
基于 diff 内容进行评审，关注：
  1. 潜在 Bug：空指针、边界条件、并发问题
  2. 代码规范：命名、方法长度、职责单一
  3. 安全风险：SQL 注入、XSS、敏感信息泄露
  4. 性能问题：N+1 查询、大循环、内存泄漏
  5. 逻辑完整性：异常处理、事务边界、幂等性

输出格式：
  ## 评审总结
  - 整体评价（通过/建议修改/需要重构）
  - 变更概要

  ## 具体问题
  | 文件 | 行号 | 级别 | 问题描述 | 建议 |
  按严重程度排序：🔴 严重 → 🟡 建议 → 🟢 优化
```

## Step 5: 提交评审（可选）

```
若已有 MR，将评审结果提交为 MR 评论：
  调用 list_change_request_patch_sets → 获取最新 patchset_biz_id
  
  全局评论：
    调用 create_change_request_comment：
      - comment_type: "GLOBAL_COMMENT"
      - content: 评审总结
      - patchset_biz_id: 最新版本 ID

  行内评论（针对具体问题）：
    调用 create_change_request_comment：
      - comment_type: "INLINE_COMMENT"
      - file_path, line_number
      - from_patchset_biz_id, to_patchset_biz_id
      - content: 具体问题描述

若无 MR，可先创建：
  调用 create_change_request：
    - sourceBranch, targetBranch
    - title: 基于变更内容自动生成
    - description: 附带评审总结
```
