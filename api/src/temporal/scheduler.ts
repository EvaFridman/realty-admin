import { Connection, Client } from "@temporalio/client";

const TASK_QUEUE = "scheduled-tasks";
const WORKFLOW_ID = "cleanup-cron";

const connection = await Connection.connect({
    address: "localhost:7233",
});

const client = new Client({ connection });

try {
    await client.workflow.start("cleanupWorkflow", {
        taskQueue: TASK_QUEUE,
        workflowId: WORKFLOW_ID,
        cronSchedule: "0 0 * * *",
    });

    console.log("Cleanup Cron Workflow started: 03:00 Europe/Moscow");
} catch (error) {
    if (error instanceof Error && error.name === "WorkflowExecutionAlreadyStartedError") {
        console.log("Cleanup Cron Workflow is already running");
    } else {
        throw error;
    }
}

await connection.close();