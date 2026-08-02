import api from './api'

export const fetchAdminStats = () => api.get('/dashboard/admin')
export const fetchTenantStats = () => api.get('/dashboard/tenant')
