import {
  registerUserService,
  loginUserService,
  getCurrentUserService,
} from '../services/authService.js'

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const result = await registerUserService({ name, email, password })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const result = await loginUserService({ email, password })

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await getCurrentUserService(req.user._id)

    res.status(200).json({
      success: true,
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
}
