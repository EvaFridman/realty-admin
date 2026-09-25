import { TaskRunnerService } from "../../tasks/task-runner.service.js";

export type ExpireListingsActivities = {
    expireListingsActivity: () => Promise<number | undefined>;
};

export function createExpireListingsActivities(taskRunner: TaskRunnerService): ExpireListingsActivities {
    return { expireListingsActivity: () => taskRunner.runExpireListings() };
}