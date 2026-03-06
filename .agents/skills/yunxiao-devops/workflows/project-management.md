---
description: 云效项目管理工作流 - 从需求到完成的标准流程
---

# 云效项目管理工作流

## 工作流概览

```
需求分析 → 创建主工作项 → 拆分子任务 → 分配迭代 → 开发 → 测试 → 完成
```

## Step 1: 获取项目上下文

// turbo
```
1. 读取当前项目根目录的 .yunxiao.json 配置文件
2. 若存在 → 直接使用 organizationId、spaceId、workitemTypeId、defaultAssignee
3. 若不存在或缺失字段 → 调用 API 查询：
   a. get_user_organizations → organizationId
   b. search_projects → spaceId
   c. list_work_item_types → workitemTypeId
   d. get_current_organization_Info → userId
   e. 将结果写入 .yunxiao.json 供后续使用
```

## Step 2: 创建主需求

// turbo
```
调用 create_work_item：
  - spaceId: 项目 ID
  - subject: 按命名规则（见 templates/naming.md）
  - workitemTypeId: Req 类型的 ID
  - assignedTo: 负责人 userId
  - description: 需求描述（Markdown 格式）
  - formatType: "MARKDOWN"
```

## Step 3: 拆分子任务

对主需求进行子任务拆分：

// turbo
```
对每个子任务调用 create_work_item：
  - spaceId: 同项目
  - subject: 按子任务命名规则
  - workitemTypeId: Task 类型的 ID
  - assignedTo: 对应开发人员
  - parentId: 主需求的 workItemId（建立父子关系）
  - description: 具体实现要点
```

## Step 4: 关联迭代

```
1. 调用 list_sprints 查看当前迭代（status: ["DOING"]）
2. 如需新建迭代，调用 create_sprint
3. 调用 update_work_item 将工作项关联到迭代：
   - updateWorkItemFields.sprint: 迭代 ID
```

## Step 5: 状态流转

开发过程中更新工作项状态：

```
调用 update_work_item：
  - updateWorkItemFields.status: 对应状态 ID

典型流转路径：
  待处理(100005) → 开发中(142838) → 开发完成(100011) → 测试中(100012)
```

## Step 6: 登记工时

```
调用 create_effort_record：
  - id: 工作项 ID
  - actualTime: 实际小时数
  - gmtStart / gmtEnd: 工作日期（格式 yyyy-MM-dd）
  - description: 工作内容摘要
```

## Step 7: 验收完成

```
1. 调用 update_work_item 将状态更新为最终状态
2. 必要时调用 create_work_item_comment 添加完成说明
```

---

## 快捷操作

### 查看我的待办
```
调用 search_workitems：
  - assignedTo: "self"
  - status: "100005,142838"（待处理 + 开发中）
  - category: "Req,Task,Bug"
```

### 查看迭代进度
```
1. 调用 list_sprints 获取当前迭代 ID
2. 调用 search_workitems 过滤 sprint 字段
```

### 批量查看工作项详情
```
调用 search_workitems 设置 includeDetails: true
避免逐个调用 get_work_item
```
