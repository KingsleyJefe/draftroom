import App from "../src/app.js";

const appInstance = new App();

// Since initialize is async, we handle it before exporting
// Top-level await is supported in Node.js 18+ on Vercel
await appInstance.initialize();

const app = appInstance.app;

// Export the express instance directly
export default app;