---
description: 从本地文件（Excel/CSV/Markdown）批量导入工作项到云效
---

# 批量导入工作项

## Step 1: 准备导入源

```
读取 .yunxiao.json 获取 organizationId、spaceId、workitemTypes

确认导入文件：
  支持格式：.xlsx / .csv / .md
  用户提供文件路径

解析文件内容并识别结构：
  - 表头/列名
  - 数据行数
  - 是否包含层级关系（如 Epic → Feature → Story）
```

## Step 2: 字段映射

```
自动映射（按列名推断）：
  标题/名称/subject → subject
  描述/说明/description → description
  优先级/priority → priority（高→P1/中→P2/低→P3）
  负责人/assignee → assignedTo（需匹配用户 ID）
  类型/type → workitemTypeId

若自动映射不完整，展示预览让用户确认：
  | 源列名 | → | 云效字段 | 状态 |
  |--------|---|---------|------|
  | 标题   | → | subject | ✅ 已匹配 |
  | 详情   | → | description | ✅ 已匹配 |
  | 等级   | → | ？ | ❓ 待确认 |
```

## Step 3: 入库前校验

```
逐行检查：
  1. 必填字段完整性：subject 不能为空
  2. 优先级有效性：映射到合法值
  3. 负责人存在性：userId 能匹配到组织成员
  4. 类型有效性：workitemTypeId 存在于项目中
  5. 重复检测：search_workitems 检查同名工作项是否已存在

输出校验报告：
  ✅ 通过 X 条
  ⚠️ 警告 Y 条（如重复项）
  ❌ 失败 Z 条（缺必填字段）

用户确认后继续
```

## Step 4: 批量创建

```
逐条调用 create_work_item：
  - spaceId
  - subject, description, priority
  - workitemTypeId
  - assignedTo
  - parentId（若有层级关系）

支持层级导入：
  先创建父项 → 拿到 workItemId → 再创建子项设置 parentId

进度反馈：
  [3/10] ✅ 创建成功: 用户注册功能
  [4/10] ⚠️ 跳过（已存在）: 登录页面优化
  [5/10] ❌ 创建失败: xxx（原因）
```

## Step 5: 导入汇总

```
# 批量导入完成
- 数据源：需求列表.xlsx
- 目标项目：{项目名}
- 成功：X 条
- 跳过：Y 条
- 失败：Z 条

创建的工作项：
| # | 编号 | 标题 | 类型 | 负责人 |
```
