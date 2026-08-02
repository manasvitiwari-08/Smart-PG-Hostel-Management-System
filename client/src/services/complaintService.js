import api from './api'

export const fetchComplaints = (params) => api.get('/complaints', { params })
export const fetchMyComplaints = () => api.get('/complaints/my')
export const createComplaint = (data) => api.post('/complaints', data)
export const updateComplaint = (id, data) => api.put(`/complaints/${id}`, data)
export const deleteComplaint = (id) => api.delete(`/complaints/${id}`)
