import mongoose from "mongoose";

const connectDb = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    console.log("URI:", process.env.MONGODB_URL);

    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4
    });

    console.log("✅ MongoDB Connected");

    // 👇👇 YAHAN LIKHNI HAI YE LINE
    console.log("📦 Connected DB Name:", mongoose.connection.name);

  } catch (error) {
    console.error("❌ DB error:", error.message);

    if (
      error.message.includes("querySrv ECONNREFUSED") ||
      error.message.includes("ENOTFOUND")
    ) {
      console.log("🔄 DNS resolution failed. This might be a network issue.");
      return;
    }

    process.exit(1);
  }
};

export default connectDb;
