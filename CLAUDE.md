# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

```bash
npm run build        # Compile TypeScript to dist/
npm run watch        # Watch mode for development
npm start            # Run in stdio mode
npm run start:sse    # Run in SSE mode on port 3000
# Run with specific toolsets
npm start -- --toolsets=code-management,project-management
DEVOPS_TOOLSETS=code-management,project-management npm start
```

## Architecture Overview

This is an MCP (Model Context Protocol) server that provides AI assistants access to Alibaba Cloud DevOps (Yunxiao) APIs.

### Directory Structure

- `index.ts` - Entry point, initializes MCP server with stdio/SSE transport
- `operations/` - Core API functions organized by domain:
  - `codeup/` - Code repository operations (branches, files, change requests)
  - `flow/` - Pipeline operations (pipelines, jobs, deployments)
  - `projex/` - Project and work item management
  - `organization/` - Organization and member management
  - `packages/` - Artifact repository operations
  - `appstack/` - Application delivery operations
  - `testhub/` - Test management operations
- `tool-registry/` - Tool definitions with Zod schemas
- `tool-handlers/` - Tool request handlers
- `common/` - Shared utilities, error types, toolset configuration

### Toolsets

Tools are organized into toolsets that can be enabled/disabled:
- `base` - Always loaded (get_current_organization_info, get_user_organizations, get_current_user)
- `code-management` - Repository, branch, file, merge request operations
- `organization-management` - Organization, department, member, role operations
- `project-management` - Project, sprint, work item, effort tracking
- `pipeline-management` - Pipeline, job, service connection, deployment operations
- `packages-management` - Artifact repository operations
- `application-delivery` - Application, orchestration, change request, release workflow operations
- `test-management` - Test case, test plan, test result operations

### Request Flow

1. `ListTools` handler returns tools based on enabled toolsets via `getEnabledTools()`
2. `CallTool` handler routes requests via `handleEnabledToolRequest()`
3. Each toolset has a dedicated handler that validates input with Zod schemas and calls operation functions
4. Operations use `yunxiaoRequest()` for API calls with automatic error handling

### Environment Variables

- `YUNXIAO_ACCESS_TOKEN` - Yunxiao API authentication token
- `YUNXIAO_API_BASE_URL` - API base URL (default: https://openapi-rdc.aliyuncs.com)
- `MCP_TRANSPORT=sse` - Enable SSE mode
- `DEVOPS_TOOLSETS` - Comma-separated list of toolsets to enable
- `PORT` - SSE mode port (default: 3000)

### Error Handling

All Yunxiao API errors are wrapped in custom error classes (`YunxiaoError` and subclasses) that include request/response details. See `common/errors.ts` for error types and `common/utils.ts` for the `yunxiaoRequest()` helper.
