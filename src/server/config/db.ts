import mongoose from "mongoose"
import dns from 'dns';

// Force public DNS resolvers to handle Atlas SRV queries if the local DNS server is misconfigured/refuses SRV lookups
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  console.warn('⚠️ Failed to set public DNS servers for Node process:', e);
}

// Configure Mongoose options at module initialization time.
// Disabling bufferCommands ensures queries fail immediately with an error rather than hanging
// if the database connection failed or is not established.
mongoose.set('strictQuery', true);
mongoose.set('bufferCommands', false);

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
  admins: []
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
  if (!uri) {
    console.warn(
      '⚠️ MONGODB_URI is not set in environment variables. Falling back to robust in-memory transient data store for preview mode.'
    );
    hasAttempted = true;
    return false;
  }

  connectionPromise = (async () => {
    try {
      console.log('🔌 Initiating authentication sequence to MongoDB Atlas...');
      await mongoose.connect(uri, {
        dbName: process.env.MONGODB_DBNAME || 'default_db',
        connectTimeoutMS: 5000, // Shortened to fail fast and free up the event loop
        serverSelectionTimeoutMS: 5050,
      });
      isConnected = true;
      hasAttempted = true;
      console.log('✅ Connected to MongoDB Atlas successfully.');
      return true;
    } catch (err: any) {
      console.error('❌ Failed to connect to MongoDB Atlas:', err?.message || err);
      console.warn('⚠️ Falling back to robust in-memory transient data store.');
      hasAttempted = true;
      return false;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
}