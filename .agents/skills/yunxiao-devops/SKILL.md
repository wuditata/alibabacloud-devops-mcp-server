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
  "token": "your-yunxiao-access-token",
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
3. 若配置中有 token 字段 → 每次调用 yunxiao_execute 时必须通过 token 参数传入
4. 若不存在或字段缺失 → 调用 API 查询并提示用户补充配置
```

> **重要**：MCP Server 是单进程，无法感知当前工作区目录。`.yunxiao.json` 中的 `token` 不会被 MCP Server 自动读取，**必须由 AI 读取后通过 `yunxiao_execute` 的 `token` 参数传入**。

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
| **`lite`** | **单工具模式，适用于有工具数量限制的 IDE** |

### Lite 模式

当 IDE 限制 MCP 工具数量（如不超过 100 个）时，使用 `--toolsets=lite` 启动，只注册 1 个工具：

- `yunxiao_execute`（统一入口，所有 action 包括 base 工具均通过此入口调用）

#### 启动方式

```bash
node dist/index.js --sse --toolsets=lite
```

#### yunxiao_execute 调用格式

```json
{
  "action": "search_workitems",
  "token": "pat-xxx（可选，不传则用默认 token）",
  "params": {
    "organizationId": "org-xxx",
    "category": "Req",
    "spaceId": "space-xxx"
  }
}
```

- `action`：对应原始工具名（如 `search_workitems`、`create_work_item`、`compare` 等），参见下方命令速查表
- `token`：可选，传入时临时切换身份，支持多组织场景
- `params`：原始工具的参数，格式与直接调用时一致

#### 多组织配置

在 `.yunxiao.json` 中配置 `token` 字段，AI 读取后通过 `yunxiao_execute` 的 `token` 参数传入：

```json
// 项目A/.yunxiao.json
{ "organizationId": "org-aaa", "token": "pat-aaa", ... }

// 项目B/.yunxiao.json
{ "organizationId": "org-bbb", "token": "pat-bbb", ... }
```

同一个 MCP Server 实例即可服务多个组织，无需重启。

---

## 一、项目管理命令速查

> 以下参数中，**加粗**为必填，其余为可选。所有命令均需 `organizationId`（必填），下方省略不再重复。

### 项目

| 命令 | 说明 | 参数 |
|------|------|------|
| `search_projects` | 搜索项目 | `name`, `scenarioFilter`(manage/participate/favorite), `userId`, `page`, `perPage` |
| `get_project` | 获取项目详情 | **`id`** |

### 迭代 Sprint

> **注意**：`list_sprints` 的项目参数名为 `id`，其余迭代操作用 `projectId`

| 命令 | 说明 | 参数 |
|------|------|------|
| `list_sprints` | 列出迭代 | **`id`**(项目ID), `status`(TODO/DOING/ARCHIVED), `page`, `perPage` |
| `get_sprint` | 迭代详情 | **`projectId`**, **`id`** |
| `create_sprint` | 创建迭代 | **`projectId`**, **`name`**, **`owners`**(userId[]), `startDate`, `endDate`, `description` |
| `update_sprint` | 更新迭代 | **`projectId`**, **`id`**, **`name`**, `owners`, `startDate`, `endDate` |

### 工作项

| 命令 | 说明 | 参数 |
|------|------|------|
| `search_workitems` | 搜索工作项 | **`category`**(Req/Task/Bug), **`spaceId`**, `subject`, `status`, `assignedTo`, `sprint`, `includeDetails`, `page`, `perPage` |
| `get_work_item` | 工作项详情 | **`workItemId`** |
| `create_work_item` | 创建工作项 | **`spaceId`**, **`subject`**, **`workitemTypeId`**, **`assignedTo`**, `description`, `formatType`(MARKDOWN/RICHTEXT), `parentId`, `sprint`, `labels` |
| `update_work_item` | 更新工作项 | **`workItemId`**, **`updateWorkItemFields`**: `{subject, description, status, assignedTo, priority, sprint, labels, verifier, participants, customFieldValues}` |

> **状态变更**：`updateWorkItemFields.status` 传状态 ID。状态 ID 因项目工作流而异，需先调 `get_work_item_workflow` 获取。

### 工作项类型

> **注意**：此处参数名为 `projectId`，非 `spaceId`（值相同但参数名不同）

| 命令 | 说明 | 参数 |
|------|------|------|
| `list_work_item_types` | 列出工作项类型 | **`projectId`**, `category`(Req/Task/Bug) |
| `get_work_item_type` | 类型详情 | **`id`** |
| `get_work_item_type_field_config` | 字段配置 | **`projectId`**, **`workItemTypeId`** |
| `get_work_item_workflow` | 工作流（状态流转） | **`projectId`**, **`workItemTypeId`** |

### 工作项评论 & 附件

| 命令 | 说明 | 参数 |
|------|------|------|
| `list_work_item_comments` | 列出评论 | **`workItemId`**, `page`, `perPage` |
| `create_work_item_comment` | 添加评论 | **`workItemId`**, **`content`** |
| `get_work_item_file` | 获取附件下载链接 | **`workItemId`**, **`fileId`** |

### 工时

| 命令 | 说明 | 参数 |
|------|------|------|
| `list_current_user_effort_records` | 当前用户工时（≤6个月） | **`startDate`**(yyyy-MM-dd), **`endDate`**(yyyy-MM-dd) |
| `list_effort_records` | 工作项的工时记录 | **`id`**(工作项ID) |
| `create_effort_record` | 登记实际工时 | **`id`**(工作项ID), **`actualTime`**, **`gmtStart`**, **`gmtEnd`**, `description` |
| `create_estimated_effort` | 登记预计工时 | **`id`**(工作项ID), **`owner`**(userId), **`spentTime`**, `description` |
| `update_effort_record` | 更新实际工时 | **`workitemId`**, **`id`**(工时记录ID), **`actualTime`**, **`gmtStart`**, **`gmtEnd`** |

### 项目管理典型场景

| 场景 | 核心工具链 |
|------|-----------|
| 需求拆解 | `get_work_item` → AI 解析 → 批量 `create_work_item(parentId)` |
| 需求优化 | `get_work_item` → AI 改写 → `update_work_item` |
| 项目健康度 | `search_workitems` → 多维统计 → 生成报告 |
| 迭代回顾 | `get_sprint` + `search_workitems(sprint)` → 分析 |
| 批量导入 | 解析文件 → 字段映射 → 批量 `create_work_item` |

---

## 二、代码管理命令速查

### 仓库

| 命令 | 说明 | 参数 |
|------|------|------|
| `list_repositories` | 仓库列表 | `search`, `page`, `perPage`, `orderBy`(created_at/name/path), `sort` |
| `get_repository` | 仓库详情 | **`repositoryId`** |

> **`repositoryId`** 支持纯数字 ID 或 `organizationId%2Frepo-name` 格式（斜杠需 URL 编码为 `%2F`）

### 分支

| 命令 | 说明 | 参数 |
|------|------|------|
| `list_branches` | 分支列表 | **`repositoryId`**, `search`, `page`, `perPage`, `sort` |
| `get_branch` | 分支详情 | **`repositoryId`**, **`branchName`** |
| `create_branch` | 创建分支 | **`repositoryId`**, **`branch`**, `ref`(默认 master) |
| `delete_branch` | 删除分支 | **`repositoryId`**, **`branchName`** |

### 文件操作

| 命令 | 说明 | 参数 |
|------|------|------|
| `list_files` | 文件树 | **`repositoryId`**, `path`, `ref`, `type`(DIRECT/RECURSIVE/FLATTEN) |
| `get_file_blobs` | 获取文件内容 | **`repositoryId`**, **`filePath`**, **`ref`** |
| `create_file` | 创建文件 | **`repositoryId`**, **`filePath`**, **`content`**, **`commitMessage`**, **`branch`** |
| `update_file` | 更新文件 | **`repositoryId`**, **`filePath`**, **`content`**, **`commitMessage`**, **`branch`** |
| `delete_file` | 删除文件 | **`repositoryId`**, **`filePath`**, **`commitMessage`**, **`branch`** |

### 合并请求 MR

| 命令 | 说明 | 参数 |
|------|------|------|
| `list_change_requests` | MR 列表 | `projectIds`, `authorIds`, `reviewerIds`, `state`(opened/merged/closed), `search`, `page`, `perPage` |
| `get_change_request` | MR 详情 | **`repositoryId`**, **`localId`** |
| `create_change_request` | 创建 MR | **`repositoryId`**, **`title`**, **`sourceBranch`**, **`targetBranch`**, `description`, `reviewerUserIds` |
| `list_change_request_comments` | MR 评论列表 | **`repositoryId`**, **`localId`**, `commentType`, `state` |
| `create_change_request_comment` | MR 评论 | **`repositoryId`**, **`localId`**, **`content`**, **`patchset_biz_id`**, `comment_type`(GLOBAL/INLINE) |
| `update_change_request_comment` | 更新 MR 评论 | **`repositoryId`**, **`localId`**, **`commentBizId`**, `content`, `resolved` |
| `list_change_request_patch_sets` | MR 版本列表 | **`repositoryId`**, **`localId`** |

### 提交 Commit

| 命令 | 说明 | 参数 |
|------|------|------|
| `list_commits` | 提交历史 | **`repositoryId`**, **`refName`**, `since`, `until`, `path`, `page`, `perPage` |
| `get_commit` | 提交详情 | **`repositoryId`**, **`sha`** |
| `create_commit_comment` | 提交评论 | **`repositoryId`**, **`sha`**, **`content`** |

### 代码比较

| 命令 | 说明 | 参数 |
|------|------|------|
| `compare` | 分支/提交比较 | **`repositoryId`**, **`from`**, **`to`**, `sourceType`(branch/tag), `targetType`, `straight` |

### 代码管理典型场景

| 场景 | 核心工具链 |
|------|-----------|
| AI 辅助评审 | `compare` → `create_change_request` → `create_change_request_comment` |
| 自动生成 CHANGELOG | `list_commits` + `list_change_requests` → 分类汇总 |
| 僵尸分支清理 | `list_branches` → 筛选 → `delete_branch` |
| 远程浏览代码 | `list_files` → `get_file_blobs` |
| 创建特性分支 | `create_branch(branch: "feature/xxx", ref: "master")` |

---

## 三、流水线命令速查

| 命令 | 说明 | 参数 |
|------|------|------|
| `list_pipelines` | 流水线列表 | `pipelineName`, `page`, `perPage` |
| `get_pipeline` | 流水线详情 | **`pipelineId`** |
| `create_pipeline_run` | 触发运行 | **`pipelineId`**, `params`(运行参数) |
| `get_latest_pipeline_run` | 最新运行信息 | **`pipelineId`** |
| `get_pipeline_run` | 运行详情 | **`pipelineId`**, **`pipelineRunId`** |
| `list_pipeline_runs` | 运行历史 | **`pipelineId`**, `page`, `perPage` |
| `get_pipeline_job_run_log` | 任务日志 | **`pipelineId`**, **`pipelineRunId`**, **`jobId`** |
| `create_pipeline_from_description` | 用自然语言创建流水线 | **`description`** |

---

## 四、常用状态 ID 速查

> **注意**：以下为系统预设状态 ID，实际可用状态因项目工作流而异。使用前应先调 `get_work_item_workflow` 获取当前项目的实际工作流。

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
