import "dotenv/config";

const PORT = Number(process.env.PORT ?? 3000);
const NODE_ENV = process.env.NODE_ENV ?? "development";

const DATABSE_URL = process.env.DATABASE_URL ?? "";
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_HOST = process.env.DATABASE_HOST ?? "";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

if (!DATABSE_URL) {
  // eslint-disable-next-line no-console
  console.warn("DATABASE_URL is not set. Prisma client will fail to connect.");
}

if (!JWT_SECRET) {
  console.warn("JWT_SECRET is not set.");
}

export const env = {
  PORT,
  NODE_ENV,
  DATABSE_URL,

  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_HOST,

  JWT_SECRET,
};
