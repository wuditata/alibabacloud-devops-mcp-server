---
description: 基于提交记录自动生成 CHANGELOG 或开发周报
---

# 自动生成 CHANGELOG

## Step 1: 获取上下文

```
读取 .yunxiao.json 获取 organizationId
调用 list_repositories 定位目标仓库（或用户直接提供 repositoryId）
确定目标分支（默认 master）
```

## Step 2: 确定时间范围

```
方式一：用户指定起止日期
方式二：按预设区间：
  - 本周：最近 7 天
  - 本月：最近 30 天
  - 上个迭代：从 list_sprints 获取最近完成迭代的起止日期
方式三：两个 tag/commit 之间
```

## Step 3: 收集提交记录

```
调用 list_commits：
  - repositoryId
  - refName: 目标分支
  - since / until: 时间范围

若需更多维度，追加：
  调用 list_change_requests：
    - state: "merged"
    - createdBefore / createdAfter: 时间范围
  从 MR 中提取关联信息（标题、描述、关联工作项）
```

## Step 4: 分类汇总

```
按 commit message 前缀分类：
  🚀 新功能 (feat)
  🐛 Bug 修复 (fix)
  ♻️ 重构 (refactor)
  📝 文档 (docs)
  🧪 测试 (test)
  🔧 构建/工具 (chore)
  💄 样式 (style)

额外维度（可选）：
  - 按模块/scope 分组
  - 按作者统计贡献
  - 提取关联的云效任务编号（如 [TASK-183]）
```

## Step 5: 生成输出

```
CHANGELOG 模式：
  # Changelog - v1.x.x (YYYY-MM-DD)

  ## 🚀 新功能
  - 新增班级分组 CRUD 接口 (#MR-42) [TASK-185]

  ## 🐛 Bug 修复
  - 修复搜索地址+业主姓名无结果 (#MR-38) [TASK-183]

周报模式：
  # 开发周报 (MM/DD - MM/DD)

  ## 本周进展
  - 合并 MR 数量：X
  - 提交次数：Y
  - 贡献者：A(n), B(m), ...

  ## 详细变更
  （按模块分组列出）
```
