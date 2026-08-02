import api from './api'

export const fetchNotices = () => api.get('/notices')
export const createNotice = (data) => api.post('/notices', data)
export const updateNotice = (id, data) => api.put(`/notices/${id}`, data)
export const deleteNotice = (id) => api.delete(`/notices/${id}`)
