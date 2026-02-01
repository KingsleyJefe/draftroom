/* eslint-disable @typescript-eslint/no-explicit-any */
import App from "../src/app.js";

const appInstance = new App();
// Start the async initialization immediately
const initPromise = appInstance.initialize();

export default async function handler(req: any, res: any) {
  // Ensure the app is fully initialized (middlewares, routes) before handling the request
  await initPromise;
  
  // Pass the request to the Express application instance
  return appInstance.app(req, res);
}