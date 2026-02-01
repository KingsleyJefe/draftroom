/* eslint-disable @typescript-eslint/no-explicit-any */
import App from "../src/app.js";

// We create a helper to handle the "new" keyword logic safely
const createHandler = async () => {
  const instance = new App();
  await instance.initialize();
  return instance.app;
};

// Start the creation process
const handlerPromise = createHandler();

export default async function (req: any, res: any) {
  try {
    const app = await handlerPromise;
    // We are calling the Express instance (a function), not the Class
    return app(req, res);
  } catch (err) {
    console.error("Vercel Bridge Error:", err);
    res.status(500).send("Internal Server Error");
  }
}
