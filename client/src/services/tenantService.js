import api from './api'

export const fetchTenants = (params) => api.get('/tenants', { params })
export const fetchTenant = (id) => api.get(`/tenants/${id}`)
export const fetchMyProfile = () => api.get('/tenants/my-profile')
export const createTenant = (data) => api.post('/tenants', data)
export const updateTenant = (id, data) => api.put(`/tenants/${id}`, data)
export const deleteTenant = (id) => api.delete(`/tenants/${id}`)
