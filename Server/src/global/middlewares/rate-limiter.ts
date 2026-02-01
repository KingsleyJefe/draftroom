import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 50,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});

export default limiter;
