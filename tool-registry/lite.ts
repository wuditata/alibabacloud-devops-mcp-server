import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const YunxiaoExecuteSchema = z.object({
    action: z.string().describe(
        "The tool action to execute. Available actions include: " +
        "get_current_organization_info, get_user_organizations, get_current_user, " +
        "search_workitems, get_work_item, create_work_item, update_work_item, " +
        "list_work_item_types, get_work_item_type, get_work_item_type_field_config, get_work_item_workflow, " +
        "list_work_item_comments, create_work_item_comment, get_work_item_file, " +
        "list_current_user_effort_records, list_effort_records, create_effort_record, " +
        "list_estimated_efforts, create_estimated_effort, update_effort_record, update_estimated_effort, " +
        "search_projects, get_project, list_sprints, get_sprint, create_sprint, update_sprint, " +
        "list_repositories, get_repository, list_branches, get_branch, create_branch, delete_branch, " +
        "list_files, get_file_blobs, create_file, update_file, delete_file, " +
        "list_commits, get_commit, create_commit_comment, compare, " +
        "list_change_requests, get_change_request, create_change_request, " +
        "list_change_request_comments, create_change_request_comment, update_change_request_comment, " +
        "list_change_request_patch_sets"
    ),
    token: z.string().optional().describe(
        "Yunxiao access token. If provided, overrides the default token for this request. " +
        "Useful for multi-organization scenarios."
    ),
    params: z.record(z.any()).optional().describe(
        "Parameters for the action, matching the original tool's input schema."
    ),
});

export const getLiteTools = () => [
    {
        name: "yunxiao_execute",
        description:
            "Unified entry point for all Yunxiao DevOps operations. " +
            "Specify the action name and its parameters. " +
            "Supports dynamic token injection for multi-organization scenarios. " +
            "Refer to the yunxiao-devops skill documentation for action details and parameter schemas.",
        inputSchema: zodToJsonSchema(YunxiaoExecuteSchema),
    },
];
