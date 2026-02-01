import App from "../src/app.js";

const appInstance = new App();
await appInstance.initialize();

export default appInstance.app;
