// import mongoose from 'mongoose';

import mongoose from "mongoose";

// // Configure Mongoose options at module initialization time.
// // Disabling bufferCommands ensures queries fail immediately with an error rather than hanging
// // if the database connection failed or is not established.
mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

let isConnected = false;
let hasAttempted = false;
let connectionPromise: Promise<boolean> | null = null;

let fallbackStore: {
  visitors: any[];
  sessions: any[];
  messages: any[];
  feedback: any[];
  admins: any[];
} = {
  visitors: [],
  sessions: [],
  messages: [],
  feedback: [],
  admins: [],
};

export function getFallbackStore() {
  return fallbackStore;
}

export async function connectDB() {
  // 1. If connection was successfully established, proceed.
  if (isConnected) {
    return true;
  }

  // 2. If we have a pending connection attempt, wait for it.
  if (connectionPromise) {
    return connectionPromise;
  }

  // 3. Fallback quickly if we already know connection failed and have no active attempt.
  // This avoids repeatedly locking the Express thread with long, failing TCP sync handshakes on each request.
  if (hasAttempted) {
    return false;
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DBNAME || "";
  if (!uri) {
    console.warn(
      "⚠️ MONGODB_URI is not set in environment variables. Falling back to robust in-memory transient data store for preview mode.",
    );
    hasAttempted = true;
    return false;
  }

  connectionPromise = (async () => {
    try {
      const connectionString = dbName ? `${uri}/${dbName}` : uri;
      const connectionInstance = await mongoose.connect(connectionString, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      });

      isConnected = true;
      hasAttempted = true;
      console.log(
        "✅ MongoDB connected successfully:",
        connectionInstance.connection.host,
      );
      return true;
    } catch (error: any) {
      console.error("❌ MongoDB connection error:", error?.message || error);
      console.warn(
        "⚠️ Falling back to in-memory transient data store for preview mode.",
      );
      hasAttempted = true;
      return false;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
}

// connectionPromise = (async () => {
//     try {
//       console.log('🔌 Initiating authentication sequence to MongoDB Atlas...');
//       await mongoose.connect(uri, {
//         dbName: process.env.MONGODB_DBNAME || 'default_db',
//         connectTimeoutMS: 5000, // Shortened to fail fast and free up the event loop
//         serverSelectionTimeoutMS: 5000,
//       });
//       isConnected = true;
//       hasAttempted = true;
//       console.log('✅ Connected to MongoDB Atlas successfully.');
//       return true;
//     } catch (err: any) {
//       console.error('❌ Failed to connect to MongoDB Atlas:', err?.message || err);
//       console.warn('⚠️ Falling back to robust in-memory transient data store.');
//       hasAttempted = true;
//       return false;
//     } finally {
//       connectionPromise = null;
//     }
//   })();

//   return connectionPromise;
