import { PrismaPg } from "@prisma/adapter-pg";
// @ts-ignore
import { PrismaClient, OrderStatus } from "../../generated/prisma/client.js";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString: DATABASE_URL,
});

export const prismaClient = new PrismaClient({ adapter });
export { OrderStatus };
