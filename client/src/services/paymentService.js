import api from './api'

export const fetchPayments = (params) => api.get('/payments', { params })
export const fetchMyPayments = () => api.get('/payments/my')
export const createPayment = (data) => api.post('/payments', data)
export const markPaid = (id, data) => api.put(`/payments/${id}/mark-paid`, data)
export const createOrder = (data) => api.post('/payments/create-order', data)
export const verifyPayment = (data) => api.post('/payments/verify', data)
export const deletePayment = (id) => api.delete(`/payments/${id}`)
