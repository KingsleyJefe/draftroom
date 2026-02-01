import App from "../src/app.js";

// 1. Create the instance at the top level
const appInstance = new App();

// 2. Initialize it immediately (top-level await is supported in Node 18+)
// This runs once when the lambda boots up
await appInstance.initialize();

// 3. Export the Express app directly
// Vercel knows how to handle an Express Application object
export default appInstance.app;