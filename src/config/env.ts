import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform(Number).default(3000),
  JWT_SECRET: z.string().min(5).default("SecretKey"),
});

export const env = envSchema.parse(process.env);
