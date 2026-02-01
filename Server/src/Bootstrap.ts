import App from "./app.js";
import dotenv from "dotenv";
import { initCronJobs } from "./cron-jobs/index.js";
import connectDB from "./db/index.js";
dotenv.config();

async function bootstrap() {
  const app = new App();
  await app.initialize();
  const port = Number(process.env.PORT) || 8080;
  await connectDB();
  initCronJobs();
  app.listen(port);
}

bootstrap();
