import { setCurrentSessionToken, getCurrentSessionToken } from '../common/utils.js';
import { handleToolRequest } from './index.js';

export const handleLiteTools = async (request: any) => {
    if (request.params.name !== "yunxiao_execute") {
        return null;
    }

    const { action, token, params } = request.params.arguments;
    if (!action) {
        throw new Error("Missing required parameter: action");
    }

    const previousToken = getCurrentSessionToken();
    try {
        if (token) {
            setCurrentSessionToken(token);
        }

        const delegatedRequest = {
            params: {
                name: action,
                arguments: params || {},
            },
        };

        return await handleToolRequest(delegatedRequest);
    } finally {
        if (token) {
            setCurrentSessionToken(previousToken);
        }
    }
};
