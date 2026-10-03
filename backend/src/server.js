import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './app.js'
import { connectDB } from './config/db.js'

// Load environment variables from backend/src/.env or backend/.env or root .env
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '.env') })
// Fallback if .env is at backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB()

    app.listen(PORT, () => {
      console.log(`[FlowForge] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
    })
  } catch (error) {
    console.error(`[FlowForge] Failed to start server: ${error.message}`)
    process.exit(1)
  }
}

startServer()
