// Test MongoDB Atlas connection
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Manually load .env.local
const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const lines = envContent.split("\n");

console.log("Loading environment variables...\n");

lines.forEach((line) => {
  // Skip empty lines and comments
  if (!line.trim() || line.trim().startsWith("#")) return;

  const eqIndex = line.indexOf("=");
  if (eqIndex > 0) {
    const key = line.substring(0, eqIndex).trim();
    const value = line.substring(eqIndex + 1).trim();
    process.env[key] = value;
    console.log(`Loaded: ${key}`);
  }
});

async function testConnection() {
  const username = process.env.MONGODB_UNAME;
  const password = process.env.MONGODB_PASSWORD;
  const dbName = process.env.MONGODB_DB_NAME;
  let uri = process.env.MONGODB_URI;

  console.log("Environment variables loaded:");
  console.log("Username:", username);
  console.log("Password:", password ? "***" : "NOT SET");
  console.log("Database:", dbName);
  console.log("URI template:", uri ? "SET" : "NOT SET");
  console.log("");

  if (!uri) {
    console.error("✗ MONGODB_URI not found in .env.local");
    return;
  }

  // Construct URI with credentials
  uri = uri.replace("UNAME", encodeURIComponent(username));
  uri = uri.replace("PASSWORD", encodeURIComponent(password));

  console.log("Testing MongoDB Atlas connection...");
  console.log("Username:", username);
  console.log("Database:", dbName);
  console.log("Connecting...\n");

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    // Test the connection by listing collections
    const collections = await db.listCollections().toArray();

    console.log("✓ Connection successful!");
    console.log("Database:", db.databaseName);
    console.log(
      "Collections:",
      collections.length > 0
        ? collections.map((c) => c.name).join(", ")
        : "No collections yet"
    );

    await client.close();
    console.log("\n✓ Connection closed");
  } catch (error) {
    console.error("✗ Connection failed:");
    console.error(error.message);

    if (error.message.includes("Authentication failed")) {
      console.error(
        "\nTip: Check your username and password in MongoDB Atlas > Database Access"
      );
    } else if (error.message.includes("Could not connect")) {
      console.error(
        "\nTip: Check Network Access in MongoDB Atlas and whitelist your IP address"
      );
    }
  }
}

testConnection();
