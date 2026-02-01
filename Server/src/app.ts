import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import logger from "./config.js";
import Routes from "./Routes.js";
import compression from "compression";
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import limiter from "./global/middlewares/rate-limiter.js";
import corsOptions from "./global/constants/cors-options.js";
import requestLogger from "./global/middlewares/request-logger.js";
import { notFoundHandler } from "./global/middlewares/not-found.js";
import { errorHandler } from "./global/middlewares/error-handler.js";
import { HTTP_STATUS } from "./global/constants/http-status-codes.js";

export default class App {
  public app: Application;
  constructor() {
    this.app = express();
  }

  async initialize() {
    this.app.set("trust proxy", 1);
    // security middlewares
    this.app.use(helmet({ contentSecurityPolicy: false }));
    this.app.use(cors(corsOptions));
    this.app.use(compression());
    this.app.use(hpp());
    this.app.use(cookieParser());
    this.app.use(express.json({ limit: "1mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "1mb" }));
    this.app.use(requestLogger);
    this.app.use(limiter);
    this.app.use(express.static("public"));

    // health check, 
    this.app.get("/", (req, res) => {
      res.status(HTTP_STATUS.OK).json({
        server: "SERVER_01_APP",
      });
    });

    // routes
    this.app.use("/v1", Routes);

    // 404 and error handler
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  listen(port: number) {
    this.app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  }
}
