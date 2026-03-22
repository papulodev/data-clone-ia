import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

let cached: MongooseCache | undefined

const globalCache = global as unknown as { mongoose?: MongooseCache }

if (!globalCache.mongoose) {
  globalCache.mongoose = { conn: null, promise: null }
}

cached = globalCache.mongoose

export async function connectDB() {
  if (cached?.conn) {
    return cached.conn
  }

  if (!cached?.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI)
  }

  cached!.conn = await cached!.promise
  return cached!.conn
}
