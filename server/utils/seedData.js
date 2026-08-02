/**
 * Seed script — run with: node utils/seedData.js
 * Creates demo admin, rooms, tenants, payments, complaints, notices
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Room = require('../models/Room')
const Tenant = require('../models/Tenant')
const Payment = require('../models/Payment')
const Complaint = require('../models/Complaint')
const Notice = require('../models/Notice')

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // Clear existing
  await Promise.all([User.deleteMany(), Room.deleteMany(), Tenant.deleteMany(), Payment.deleteMany(), Complaint.deleteMany(), Notice.deleteMany()])
  console.log('Cleared existing data')

  // Admin
  const admin = await User.create({ name: 'Admin Owner', email: 'admin@smartpg.com', password: 'admin123', role: 'admin', phone: '9876543210' })

  // Rooms
  const rooms = await Room.insertMany([
    { roomNumber: '101', roomType: 'single', capacity: 1, rent: 8000, status: 'available', floor: 1, amenities: ['WiFi', 'AC'] },
    { roomNumber: '102', roomType: 'double', capacity: 2, rent: 6000, status: 'available', floor: 1, amenities: ['WiFi', 'Fan'] },
    { roomNumber: '201', roomType: 'triple', capacity: 3, rent: 5000, status: 'available', floor: 2, amenities: ['WiFi', 'Geyser'] },
    { roomNumber: '202', roomType: 'single', capacity: 1, rent: 9000, status: 'available', floor: 2, amenities: ['WiFi', 'AC', 'Attached Bathroom'] },
    { roomNumber: '301', roomType: 'double', capacity: 2, rent: 7000, status: 'maintenance', floor: 3 },
  ])

  // Tenant users
  const t1User = await User.create({ name: 'Rahul Sharma', email: 'rahul@example.com', password: 'tenant123', role: 'tenant', phone: '9111111111' })
  const t2User = await User.create({ name: 'Priya Mehta', email: 'priya@example.com', password: 'tenant123', role: 'tenant', phone: '9222222222' })
  const t3User = await User.create({ name: 'Amit Kumar', email: 'amit@example.com', password: 'tenant123', role: 'tenant', phone: '9333333333' })

  // Assign rooms
  rooms[0].occupiedBeds = 1; rooms[0].status = 'occupied'; await rooms[0].save()
  rooms[1].occupiedBeds = 1; await rooms[1].save()

  const tenants = await Tenant.insertMany([
    { user: t1User._id, name: 'Rahul Sharma', phone: '9111111111', email: 'rahul@example.com', gender: 'male', college: 'IIT Bombay', room: rooms[0]._id, joiningDate: new Date('2024-06-01'), rentAmount: 8000, paymentStatus: 'paid', idProofType: 'Aadhar', idProofNumber: '1234-5678-9012' },
    { user: t2User._id, name: 'Priya Mehta', phone: '9222222222', email: 'priya@example.com', gender: 'female', college: 'BITS Pilani', room: rooms[1]._id, joiningDate: new Date('2024-07-01'), rentAmount: 6000, paymentStatus: 'unpaid', idProofType: 'PAN', idProofNumber: 'ABCDE1234F' },
    { user: t3User._id, name: 'Amit Kumar', phone: '9333333333', email: 'amit@example.com', gender: 'male', profession: 'Software Engineer', room: rooms[1]._id, joiningDate: new Date('2024-08-01'), rentAmount: 6000, paymentStatus: 'unpaid' },
  ])

  // Payments
  const now = new Date()
  await Payment.insertMany([
    { tenant: tenants[0]._id, amount: 8000, month: 'December 2024', dueDate: new Date('2024-12-05'), status: 'paid', paymentMethod: 'upi', paidAt: new Date('2024-12-03') },
    { tenant: tenants[0]._id, amount: 8000, month: 'January 2025', dueDate: new Date('2025-01-05'), status: 'paid', paymentMethod: 'online', paidAt: new Date('2025-01-04') },
    { tenant: tenants[1]._id, amount: 6000, month: 'January 2025', dueDate: new Date('2025-01-05'), status: 'unpaid' },
    { tenant: tenants[2]._id, amount: 6000, month: 'January 2025', dueDate: new Date('2025-01-05'), status: 'overdue' },
  ])

  // Complaints
  await Complaint.insertMany([
    { tenant: tenants[0]._id, title: 'AC not working', description: 'The AC in my room has stopped working since yesterday.', category: 'maintenance', status: 'in_progress', priority: 'high', adminRemark: 'Technician scheduled for tomorrow.' },
    { tenant: tenants[1]._id, title: 'Noisy neighbors', description: 'Room 201 is very noisy at night, affecting my sleep.', category: 'noise', status: 'pending', priority: 'medium' },
    { tenant: tenants[2]._id, title: 'WiFi slow', description: 'Internet speed is very slow in my room.', category: 'maintenance', status: 'resolved', priority: 'low', adminRemark: 'Router upgraded. Issue resolved.', resolvedAt: new Date() },
  ])

  // Notices
  await Notice.insertMany([
    { title: 'Water Supply Interruption', message: 'Water supply will be interrupted on 15th Jan from 10 AM to 2 PM for maintenance work.', createdBy: admin._id, isImportant: true },
    { title: 'Rent Due Reminder', message: 'Please ensure your January rent is paid by 5th January to avoid late fees.', createdBy: admin._id, isImportant: false },
    { title: 'New WiFi Password', message: 'The WiFi password has been updated. Please contact the admin for the new password.', createdBy: admin._id, isImportant: false },
  ])

  console.log('\n✅ Seed data created successfully!')
  console.log('Admin: admin@smartpg.com / admin123')
  console.log('Tenant 1: rahul@example.com / tenant123')
  console.log('Tenant 2: priya@example.com / tenant123')
  console.log('Tenant 3: amit@example.com / tenant123')
  process.exit(0)
}

seed().catch((err) => { console.error(err); process.exit(1) })
