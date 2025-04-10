import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: ".env.local" });

// Ensure URI is available
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("❌ MONGODB_URI is not defined in .env.local");
}

// Read data from JSON file and import to MongoDB
const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(); // use default database from URI
  const carsCollection = db.collection("cars");

  const filePath = path.join(__dirname, "../data/cars.json");
  const carsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (carsData.length > 0) {
    const result = await carsCollection.insertMany(carsData);
    console.log(`✅ Successfully imported ${result.insertedCount} cars into the database`);
  } else {
    console.log("❌ No cars to import");
  }
} catch (err) {
  console.error("❌ Error importing cars:", err);
} finally {
  await client.close();
}