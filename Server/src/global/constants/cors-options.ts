import { CorsOptions } from "cors";
import logger from "../../config.js";
const whitelists: string[] = ["http://192.168.42.215:5173"];

const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    const localhostSubdomainRegex =
      /^http?:\/\/([a-z0-9-]+\.)*localhost:517[3-8]$/;
    if (
      !origin ||
      whitelists.includes(origin) ||
      localhostSubdomainRegex.test(origin)
    ) {
      callback(null, true);
    } else {
      logger.error(`CORS blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,PATCH",
  credentials: true,
};

export default corsOptions;
