import api from './api.js'

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async login(data) {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  async getMe() {
    const response = await api.get('/auth/me')
    return response.data
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // Proceed even if server-side logout fails
    } finally {
      localStorage.removeItem('flowforge_token')
    }
  },
}

export default authService
