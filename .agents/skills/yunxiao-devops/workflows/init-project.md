---
description: 在新项目中初始化云效 DevOps 开发环境（skill + 配置）
---

# 初始化云效开发环境

在新项目根目录执行以下步骤：

// turbo
1. 创建 skill 软链接
```bash
mkdir -p .agents/skills
ln -s /opt/foxhis/projects/lab/alibabacloud-devops-mcp-server/.agents/skills/yunxiao-devops .agents/skills/yunxiao-devops
```

// turbo
2. 复制配置文件模板
```bash
cp /opt/foxhis/projects/lab/alibabacloud-devops-mcp-server/.agents/skills/yunxiao-devops/templates/yunxiao.example.json .yunxiao.json
```

3. 编辑 `.yunxiao.json`，填入该项目对应的组织和项目信息

// turbo
4. 确保 `.gitignore` 包含敏感文件
```bash
echo '.yunxiao.json' >> .gitignore
```
