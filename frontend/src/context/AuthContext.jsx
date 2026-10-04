import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/authService.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('flowforge_token'))
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  // Verify and fetch current user on mount if token exists
  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('flowforge_token')
      if (!storedToken) {
        if (isMounted) {
          setUser(null)
          setLoading(false)
        }
        return
      }

      try {
        const response = await authService.getMe()
        if (isMounted && response?.data?.user) {
          setUser(response.data.user)
          setToken(storedToken)
        }
      } catch (err) {
        console.warn('[AuthContext] Session expired or invalid:', err.message)
        localStorage.removeItem('flowforge_token')
        if (isMounted) {
          setUser(null)
          setToken(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      isMounted = false
    }
  }, [])

  const register = useCallback(async ({ name, email, password }) => {
    setAuthError(null)
    try {
      const response = await authService.register({ name, email, password })
      const { user: registeredUser, token: receivedToken } = response.data

      localStorage.setItem('flowforge_token', receivedToken)
      setToken(receivedToken)
      setUser(registeredUser)
      return { success: true, user: registeredUser }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Registration failed'
      setAuthError(message)
      throw new Error(message)
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setAuthError(null)
    try {
      const response = await authService.login({ email, password })
      const { user: loggedInUser, token: receivedToken } = response.data

      localStorage.setItem('flowforge_token', receivedToken)
      setToken(receivedToken)
      setUser(loggedInUser)
      return { success: true, user: loggedInUser }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Invalid email or password'
      setAuthError(message)
      throw new Error(message)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      localStorage.removeItem('flowforge_token')
      setUser(null)
      setToken(null)
      setAuthError(null)
    }
  }, [])

  const value = {
    user,
    token,
    loading,
    authError,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
