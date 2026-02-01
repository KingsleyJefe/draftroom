import App from "../src/app.js";
import connectDB from "../src/db/index.js";

const appInstance = new App();
await appInstance.initialize();
await connectDB();

export default appInstance.app;
