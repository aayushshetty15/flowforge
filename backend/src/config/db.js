import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`[FlowForge] MongoDB Connected: ${conn.connection.host}, Database: ${conn.connection.name}`)
    return conn
  } catch (error) {
    console.error(`[FlowForge] MongoDB Connection Error: ${error.message}`)
    process.exit(1)
  }
}
