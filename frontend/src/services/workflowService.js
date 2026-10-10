import api from './api.js'

export const workflowService = {
  async createWorkflow(data) {
    const response = await api.post('/workflows', data)
    return response.data
  },

  async getWorkflows(params = {}) {
    const response = await api.get('/workflows', { params })
    return response.data
  },

  async getWorkflowById(id) {
    const response = await api.get(`/workflows/${id}`)
    return response.data
  },

  async updateWorkflow(id, data) {
    const response = await api.patch(`/workflows/${id}`, data)
    return response.data
  },

  async deleteWorkflow(id) {
    const response = await api.delete(`/workflows/${id}`)
    return response.data
  },

  async activateWorkflow(id) {
    const response = await api.post(`/workflows/${id}/activate`)
    return response.data
  },

  async deactivateWorkflow(id) {
    const response = await api.post(`/workflows/${id}/deactivate`)
    return response.data
  },

  async getStats() {
    const response = await api.get('/workflows/metrics/stats')
    return response.data
  },

  async runWorkflow(id, triggerData = {}) {
    const response = await api.post(`/workflows/${id}/run`, triggerData)
    return response.data
  },
}

export default workflowService
