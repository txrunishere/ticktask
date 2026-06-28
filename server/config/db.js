import mongoose from "mongoose";
import { env } from "./env.config.js";

export const connectDB = async () => {
  const uri = env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(
      `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`,
    );
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};
