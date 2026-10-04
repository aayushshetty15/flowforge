import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'flowforge_secret_dev_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}
