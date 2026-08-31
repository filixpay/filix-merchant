import type { ActionTask, ActionTaskView } from "../shared/contracts";
import { mapActionTaskDto } from "../shared/mappers";
import type { ActionTaskDto } from "../shared/dto";
import { computeTaskPriority } from "@/lib/notifications/task-priority";

export function enrichTask(task: ActionTask): ActionTaskView {
    return {
        ...task,
        priority: computeTaskPriority(task.dueAt),
    };
}

export function enrichTaskDto(dto: ActionTaskDto): ActionTaskView {
    return enrichTask(mapActionTaskDto(dto));
}
