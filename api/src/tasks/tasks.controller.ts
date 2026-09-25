import { BadRequestException, Controller, Param, Post } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { TaskRunnerService, TASK_NAMES } from "./task-runner.service.js";

@Controller("tasks")
export class TasksController {
    constructor(private readonly taskRunnerService: TaskRunnerService) {}

    @Roles("moderator")
    @Post(":name/run")
    async run(@Param("name") name: string) {
        if (!TASK_NAMES.includes(name as typeof TASK_NAMES[number])) throw new BadRequestException(`Unknown task: ${name}`);
        return this.taskRunnerService.run(name);
    }
}