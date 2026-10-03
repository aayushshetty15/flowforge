import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }

  res.status(200).json({
    status: 'ok',
    service: 'FlowForge Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: `MongoDB (${dbStatusMap[dbState] || 'unknown'})`,
    databaseName: mongoose.connection.name || 'none',
  })
})

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  })
})

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  console.error(`[Error] ${err.message}`, err.stack)

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  })
})

export default app
