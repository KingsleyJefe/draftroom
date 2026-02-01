import cron from "node-cron";

export const initCronJobs = () => {
  // add jobs

  // Schedule for every 1 hour thereafter
  cron.schedule("0 */1 * * *", async () => {});
};
