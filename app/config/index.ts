// Laravel-style configuration file
// Centralized configuration management

export const config = {
  app: {
    name: process.env.APP_NAME || "Notulensi Pro",
    url: process.env.APP_URL || "http://localhost:3000",
  },
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || "mongodb://localhost:27017/notulensi_pro",
      username: process.env.MONGODB_UNAME,
      password: process.env.MONGODB_PASSWORD,
      dbName: process.env.MONGODB_DB_NAME || "notulensi_pro",
    },
  },
  session: {
    secret: process.env.SESSION_SECRET || "default-secret-change-in-production",
  },
  storage: {
    mode: (process.env.STORAGE_MODE || "both") as "mongodb" | "json" | "both",
  },
} as const;

export default config;
