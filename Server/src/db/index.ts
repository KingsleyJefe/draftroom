import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "../config";

dotenv.config();

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    logger.error("MONGO_URI is not defined in environment variables. Database not connected");
    return;
  }
  if (mongoose.connection.readyState !== 0) {
    logger.info("MongoDB already connected.");
    return;
  }
  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    logger.info("MongoDB connected successfully.");
  } catch (error) {
    logger.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
