import { Connection, Client } from "@temporalio/client";

const TASK_QUEUE = "scheduled-tasks";

const connection = await Connection.connect({
    address: "localhost:7233",
});

const client = new Client({ connection });

const workflows = [
    {
        workflowId: "cleanup-cron",
        workflowType: "cleanupWorkflow",
        cronSchedule: "0 0 * * *",
        message: "Cleanup Cron Workflow started: 03:00 Europe/Moscow",
    },
    {
        workflowId: "expire-listings-cron",
        workflowType: "expireListingsWorkflow",
        cronSchedule: "0 1 * * *",
        message: "Expire Listings Cron Workflow started: 04:00 Europe/Moscow",
    },
    {
        workflowId: "viewing-reminder-cron",
        workflowType: "viewingReminderWorkflow",
        cronSchedule: "0 * * * *",
        message: "Viewing Reminder Cron Workflow started: every hour",
    },
];

try {
    for (const workflow of workflows) {
        try {
            await client.workflow.start(workflow.workflowType, {
                taskQueue: TASK_QUEUE,
                workflowId: workflow.workflowId,
                cronSchedule: workflow.cronSchedule,
            });

            console.log(workflow.message);
        } catch (error) {
            if (error instanceof Error && error.name === "WorkflowExecutionAlreadyStartedError") {
                console.log(`${workflow.workflowType} is already running`);
            } else {
                throw error;
            }
        }
    }
} finally {
    await connection.close();
}