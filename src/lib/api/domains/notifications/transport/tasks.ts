import { ENDPOINTS } from "@/lib/api-config";
import { pagedGet } from "@/lib/api/query";
import { normalizePagedResponse } from "@/lib/dashboard/normalize-paged-response";
import type { ActionTaskView, TaskListQuery } from "../shared/contracts";
import type { ActionTaskDto } from "../shared/dto";
import { enrichTaskDto } from "../enrich/enrich-task";

function buildTaskParams(query: TaskListQuery): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: query.page,
        size: query.size,
    };
    if (query.status) {
        params.status = query.status;
    }
    return params;
}

export async function fetchTasks(token: string, query: TaskListQuery) {
    const response = await pagedGet<ActionTaskDto>(
        ENDPOINTS.PORTAL.NOTIFICATION_TASKS,
        buildTaskParams(query),
        token,
    );
    const { items, total } = normalizePagedResponse(response);
    return {
        items: items.map(enrichTaskDto) satisfies ActionTaskView[],
        total,
    };
}
