import "dotenv/config";
import fs from "fs";
import path from "path";

const resolveKey = (keyPath: string): string => {
  if (!keyPath) return "";
  const resolved = path.isAbsolute(keyPath) ? keyPath : path.resolve(process.cwd(), keyPath);
  return fs.readFileSync(resolved, "utf8");
};

const PORT = Number(process.env.PORT ?? 3000);
const NODE_ENV = process.env.NODE_ENV ?? "development";

const DATABSE_URL = process.env.DATABASE_URL ?? "";
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_HOST = process.env.DATABASE_HOST ?? "";

const JWT_PRIVATE_KEY_PATH = process.env.JWT_PRIVATE_KEY_PATH ?? "";
const JWT_PUBLIC_KEY_PATH = process.env.JWT_PUBLIC_KEY_PATH ?? "";
const JWT_ISSUER = process.env.JWT_ISSUER;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE;
const JWT_ALGORITHM = process.env.JWT_ALGORITHM;
const JWT_EXPIRY = process.env.JWT_EXPIRY;

if (!DATABSE_URL) {
  // eslint-disable-next-line no-console
  console.warn("DATABASE_URL is not set. Prisma client will fail to connect.");
}

if (!JWT_PRIVATE_KEY_PATH || !JWT_PUBLIC_KEY_PATH) {
  console.warn("JWT_PRIVATE_KEY_PATH or JWT_PUBLIC_KEY_PATH is not set.");
}

const JWT_PRIVATE_KEY = resolveKey(JWT_PRIVATE_KEY_PATH);
const JWT_PUBLIC_KEY = resolveKey(JWT_PUBLIC_KEY_PATH);

export const env = {
  PORT,
  NODE_ENV,
  DATABSE_URL,

  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_HOST,

  JWT_PRIVATE_KEY_PATH,
  JWT_PUBLIC_KEY_PATH,
  JWT_PRIVATE_KEY,
  JWT_PUBLIC_KEY,
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_EXPIRY,
  JWT_ALGORITHM,
};
