---
description: 将需求按功能点或开发阶段自动拆解为子需求/子任务
---

# 需求自动拆解

## Step 1: 获取父需求信息

```
读取 .yunxiao.json，定位目标组织（default 或用户指定），获取 token、organizationId 及项目配置

获取父需求详情：
  方式一：用户提供工作项编号（如 TASK-100）→ 调用 search_workitems(subject: "TASK-100")
  方式二：用户提供 workItemId → 调用 get_work_item

提取关键信息：
  - 标题、描述内容
  - workitemTypeId（用于子需求继承类型）
  - assignedTo（用于子需求继承负责人）
  - parentId（父需求 ID）
```

## Step 2: 选择拆解策略

```
策略一：按功能点拆分
  解析描述中的功能列表（有序/无序列表、编号项）
  每个功能点 → 一个子需求

策略二：按开发阶段拆分
  固定阶段模板：
    1. 需求分析
    2. 方案设计
    3. 后端开发
    4. 前端开发
    5. 联调测试
    6. 上线部署

策略三：自定义拆分
  用户提供拆分维度和粒度
```

## Step 3: 生成子需求列表

```
为每个拆分项生成：
  - subject: "[父需求编号] - 子需求描述"
  - description: 从父需求描述中提取或 AI 生成相关细节
  - assignedTo: 继承父需求或由用户指定
  - workitemTypeId: 继承父需求类型（或使用子任务类型）

输出预览列表让用户确认：
  | # | 标题 | 负责人 | 类型 |
  用户可修改后再创建
```

## Step 4: 批量创建

```
逐个调用 create_work_item：
  - spaceId
  - subject
  - workitemTypeId
  - assignedTo
  - parentId: 父需求的 workItemId（建立层级关系）
  - description

每创建一个输出结果：
  ✅ 已创建: TASK-101 需求分析
  ✅ 已创建: TASK-102 方案设计
  ...

最终汇总：成功创建 N 个子需求，父需求 TASK-100 下
```
