---
description: 清理长期未更新的僵尸分支
---

# 僵尸分支清理

## Step 1: 获取上下文

```
读取 .yunxiao.json，定位目标组织（default 或用户指定），获取 token、organizationId 及项目配置
调用 list_repositories 定位目标仓库（或用户直接提供 repositoryId）
```

## Step 2: 扫描分支

```
调用 list_branches：
  - repositoryId
  - sort: "updated_asc"（最久未更新排前面）
  - perPage: 100

逐页获取所有分支信息
```

## Step 3: 筛选僵尸分支

```
筛选条件（可由用户自定义阈值）：
  - 最后提交时间 > 30 天（默认）
  - 排除保护分支：master, main, develop, release/*
  - 排除用户指定的白名单分支

输出候选清理列表：
  | 分支名 | 最后提交时间 | 闲置天数 | 最后提交者 |
  按闲置天数降序排列
```

## Step 4: 确认清理

```
⚠️ 必须让用户确认后再执行删除，逐个或批量确认

展示待清理分支列表，询问用户：
  1. 全部清理
  2. 选择性清理（用户指定保留的分支）
  3. 取消
```

## Step 5: 执行清理

```
确认后逐个调用 delete_branch：
  - repositoryId
  - branchName: 分支名（特殊字符需 URL 编码，如 feature/xxx → feature%2Fxxx）

每删除一个分支输出结果：
  ✅ 已删除: feature/old-experiment
  ❌ 删除失败: hotfix/legacy（原因：xxx）

最终汇总：
  清理完成：成功 X 个，失败 Y 个，保留 Z 个
```
