import api from './api'

export const fetchVisitors = (params) => api.get('/visitors', { params })
export const fetchMyVisitors = () => api.get('/visitors/my')
export const addVisitor = (data) => api.post('/visitors', data)
export const markExit = (id) => api.put(`/visitors/${id}/exit`)
export const deleteVisitor = (id) => api.delete(`/visitors/${id}`)
