import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),
  ORIGIN_URL: z.string(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  MONGO_URI: z.string(),
});

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
  console.error(error.message);
  process.exit(1);
}

export const env = data;
