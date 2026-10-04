import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

export const registerUserService = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim()

  const existingUser = await User.findOne({ email: normalizedEmail })
  if (existingUser) {
    const error = new Error('Email is already registered')
    error.statusCode = 409
    throw error
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
  })

  const token = generateToken(user._id)

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  }
}

export const loginUserService = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim()

  // Find user and explicitly select password
  const user = await User.findOne({ email: normalizedEmail }).select('+password')
  if (!user) {
    const error = new Error('Invalid email or password')
    error.statusCode = 401
    throw error
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    const error = new Error('Invalid email or password')
    error.statusCode = 401
    throw error
  }

  const token = generateToken(user._id)

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  }
}

export const getCurrentUserService = async (userId) => {
  const user = await User.findById(userId).select('-password')
  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}
