---
name: yunxiao-devops
description: 阿里云云效 DevOps MCP Server 使用指南，含命令速查、项目管理工作流、工作项创建模板
---

# 云效 DevOps MCP Server 使用指南

## 前置条件：项目配置文件

每个项目根目录可放置 `.yunxiao.json` 配置文件，**使用云效 API 前优先读取此文件**。

### 配置文件格式

```json
{
  "organizationId": "org-xxx",
  "organizationName": "我的组织",
  "projects": [
    {
      "spaceId": "project-xxx",
      "name": "项目",
      "workitemTypes": {
        "Req": "type-id-for-req",
        "Task": "type-id-for-task",
        "Bug": "type-id-for-bug"
      }
    }
  ],
  "defaultAssignee": "user-xxx",
  "modules": ["SEP", "Apollo", "AI"]
}
```

### 使用流程

```
1. 优先读取当前项目根目录下的 .yunxiao.json
2. 若配置文件存在且字段完整 → 直接使用其中的 organizationId、spaceId、workitemTypeId 等
3. 若不存在或字段缺失 → 调用 API 查询并提示用户补充配置
```

### 初始化配置（首次使用）

```
1. 调用 get_user_organizations → 获取 organizationId
2. 调用 search_projects → 获取关注项目的 spaceId
3. 调用 list_work_item_types → 获取该项目的 Req/Task/Bug typeId
4. 调用 get_current_organization_Info → 获取当前用户 userId
5. 将以上信息写入项目根目录的 .yunxiao.json
```

> **多组织场景**：不同项目仓库放不同的 `.yunxiao.json`，各自指向对应的组织和项目，互不干扰。

## 工具集 Toolsets

可通过 `--toolsets` 参数按需启用，减少 token 消耗：

| Toolset | 用途 |
|---------|------|
| `project-management` | 项目、迭代、工作项、工时 |
| `code-management` | 代码仓库、分支、MR、文件 |
| `pipeline-management` | 流水线、构建、部署 |
| `organization-management` | 组织、部门、成员 |
| `packages-management` | 制品仓库 |
| `application-delivery` | 应用交付、部署单 |
| `test-management` | 测试用例、测试计划 |

---

## 一、项目管理命令速查

### 项目

| 命令 | 说明 | 关键参数 |
|------|------|----------|
| `search_projects` | 搜索项目 | `name`, `scenarioFilter`(manage/participate/favorite) |
| `get_project` | 获取项目详情 | `id` |

### 迭代 Sprint

| 命令 | 说明 | 关键参数 |
|------|------|----------|
| `list_sprints` | 列出迭代 | `id`(项目ID), `status`(TODO/DOING/ARCHIVED) |
| `get_sprint` | 迭代详情 | `projectId`, `id` |
| `create_sprint` | 创建迭代 | `projectId`, `name`, `owners`, `startDate`, `endDate` |
| `update_sprint` | 更新迭代 | `projectId`, `id`, `name` |

### 工作项

| 命令 | 说明 | 关键参数 |
|------|------|----------|
| `search_workitems` | 搜索工作项 | `category`(Req/Task/Bug), `spaceId`, `subject`, `status`, `assignedTo` |
| `get_work_item` | 工作项详情 | `workItemId` |
| `create_work_item` | 创建工作项 | `spaceId`, `subject`, `workitemTypeId`, `assignedTo` |
| `update_work_item` | 更新工作项 | `workItemId`, `updateWorkItemFields` |

### 工作项类型

| 命令 | 说明 |
|------|------|
| `list_work_item_types` | 列出项目空间中的工作项类型 |
| `get_work_item_type` | 获取类型详情 |
| `get_work_item_type_field_config` | 获取类型的字段配置 |
| `get_work_item_workflow` | 获取类型的工作流（状态流转） |

### 工作项评论 & 附件

| 命令 | 说明 |
|------|------|
| `list_work_item_comments` | 列出评论 |
| `create_work_item_comment` | 添加评论 |
| `get_work_item_file` | 获取附件下载链接 |

### 工时

| 命令 | 说明 |
|------|------|
| `list_current_user_effort_records` | 当前用户工时（≤6个月） |
| `create_effort_record` | 登记实际工时 |
| `create_estimated_effort` | 登记预计工时 |
| `update_effort_record` | 更新实际工时 |

---

## 二、代码管理命令速查

### 仓库

| 命令 | 说明 |
|------|------|
| `list_repositories` | 仓库列表 |
| `get_repository` | 仓库详情 |

### 分支

| 命令 | 说明 |
|------|------|
| `list_branches` | 分支列表 |
| `create_branch` | 创建分支 |
| `delete_branch` | 删除分支 |

### 文件操作

| 命令 | 说明 |
|------|------|
| `list_files` | 文件树 |
| `get_file_blobs` | 获取文件内容 |
| `create_file` | 创建文件 |
| `update_file` | 更新文件 |

### 合并请求 MR

| 命令 | 说明 |
|------|------|
| `list_change_request` | MR 列表 |
| `create_change_request` | 创建 MR |
| `get_change_request` | MR 详情 |
| `create_change_request_comment` | MR 评论 |
| `get_compare` | 代码比较 |

---

## 三、流水线命令速查

| 命令 | 说明 |
|------|------|
| `list_pipelines` | 流水线列表 |
| `get_pipeline` | 流水线详情 |
| `create_pipeline_run` | 触发运行 |
| `get_latest_pipeline_run` | 最新运行信息 |
| `get_pipeline_run` | 运行详情 |
| `list_pipeline_runs` | 运行历史 |
| `get_pipeline_job_run_log` | 任务日志 |
| `create_pipeline_from_description` | 用自然语言创建流水线 |

---

## 四、常用状态 ID 速查

| 状态名 | ID |
|--------|------|
| 待确认 | 28 |
| 待处理 | 100005 |
| 已选择 | 625489 |
| 分析中 | 154395 |
| 开发中 | 142838 |
| 开发完成 | 100011 |
| 测试中 | 100012 |
| 已重新打开 | 30 |
| 暂缓修复 | 34 |

---

## 五、工作项 Category 对照

| Category | 含义 |
|----------|------|
| `Req` | 需求 |
| `Task` | 任务 |
| `Bug` | 缺陷 |

---

## 六、重要注意事项

1. **先查 ID 再操作**：创建工作项前必须先通过 `list_work_item_types` 获取 `workitemTypeId`
2. **用户 ID**：`assignedTo` 等人员字段需要 userId，通过 `search_organization_members` 或 `get_current_organization_Info` 获取
3. **分页**：列表类 API 默认返回 20 条，用 `page` + `perPage` 翻页，`perPage` 最大 200
4. **搜索优化**：`search_workitems` 支持 `includeDetails=true` 直接返回描述，避免逐个调 `get_work_item`
5. **工时限制**：`list_current_user_effort_records` 的时间跨度不能超过 6 个月
6. **描述格式**：创建工作项时 `formatType` 默认 `MARKDOWN`，也支持 `RICHTEXT`
