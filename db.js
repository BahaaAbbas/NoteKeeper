import mongoose from "mongoose";
import dotenv from "@dotenvx/dotenvx";

dotenv.config();

async function connectMDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB has been connected..");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export default connectMDB;
