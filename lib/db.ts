import { PrismaClient } from "@prisma/client";

// Serverless + Supabase pooler: `connection_limit=1` makes parallel queries
// (e.g. Promise.all on the homepage during build) queue up and hit Prisma's
// pool timeout. Raise a too-small limit and give the pool more time.
function datasourceUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    const limit = Number(url.searchParams.get("connection_limit") ?? "1");
    if (!(limit > 1)) url.searchParams.set("connection_limit", "5");
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "30");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

// Reuse a single PrismaClient across hot reloads in development to avoid
// exhausting the connection pool.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: datasourceUrl(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
