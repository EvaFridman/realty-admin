import { TaskRunnerService } from "../../tasks/task-runner.service.js";

export type DailyDigestActivities = {
    dailyDigestActivity: () => Promise<number | undefined>;
};

export function createDailyDigestActivities(taskRunner: TaskRunnerService): DailyDigestActivities {
    return { dailyDigestActivity: () => taskRunner.runDailyDigest() };
}