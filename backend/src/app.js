import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'

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

// API Routes
app.use('/api/auth', authRoutes)

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  })
})

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue || {})[0] || 'Field'
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} is already in use`
  }

  // Handle Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid resource identifier: ${err.value}`
  }

  // Handle JWT invalid or expired error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid authentication token'
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Authentication token expired'
  }

  if (statusCode === 500) {
    console.error(`[Internal Server Error]`, err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.errors ? { errors: err.errors } : {}),
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 ? { stack: err.stack } : {}),
  })
})

export default app
