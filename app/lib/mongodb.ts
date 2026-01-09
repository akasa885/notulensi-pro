import { MongoClient, Db, ServerApiVersion } from "mongodb";
import config from "../config";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

function getMongoDBUri(): string {
  let uri = config.database.mongodb.uri;

  // Replace placeholders with actual credentials if they exist
  const username = config.database.mongodb.username;
  const password = config.database.mongodb.password;

  if (username && password) {
    uri = uri.replace("UNAME", encodeURIComponent(username));
    uri = uri.replace("PASSWORD", encodeURIComponent(password));
  }

  return uri;
}

export async function connectToDatabase() {
  // Return cached connection if available
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Create new connection with constructed URI
  const uri = getMongoDBUri();
  const dbName = config.database.mongodb.dbName;

  const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    retryWrites: true,
    retryReads: true,
    maxPoolSize: 10,
    minPoolSize: 2,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  });

  await client.connect();
  const db = dbName ? client.db(dbName) : client.db();

  // Cache the connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}
