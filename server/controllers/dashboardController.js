const asyncHandler = require("express-async-handler");
const Tenant = require("../models/Tenant");
const Room = require("../models/Room");
const Payment = require("../models/Payment");
const Complaint = require("../models/Complaint");
const Visitor = require("../models/Visitor");

// @desc  Get admin dashboard stats
// @route GET /api/dashboard/admin
// @access Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const totalTenants = await Tenant.countDocuments({ isActive: true });
  const totalRooms = await Room.countDocuments();
  const occupiedRooms = await Room.countDocuments({ status: "occupied" });
  const availableRooms = await Room.countDocuments({ status: "available" });

  // Rent stats for current month
  const now = new Date();
  const monthName = now.toLocaleString("default", { month: "long", year: "numeric" });
  const paidPayments = await Payment.find({ status: "paid" });
  const unpaidPayments = await Payment.find({ status: "unpaid" });
  const overduePayments = await Payment.find({ status: "overdue" });

  const totalCollected = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = unpaidPayments.reduce((sum, p) => sum + p.amount, 0);

  const pendingComplaints = await Complaint.countDocuments({ status: "pending" });
  const inProgressComplaints = await Complaint.countDocuments({ status: "in_progress" });

  // Today's visitors
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const visitorsToday = await Visitor.countDocuments({ entryTime: { $gte: today } });

  // Monthly rent collection chart (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleString("default", { month: "short", year: "numeric" });
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const collected = await Payment.aggregate([
      { $match: { status: "paid", paidAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    monthlyData.push({ month: label, amount: collected[0]?.total || 0 });
  }

  // Room occupancy breakdown
  const roomStats = await Room.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    stats: {
      totalTenants, totalRooms, occupiedRooms, availableRooms,
      totalCollected, totalPending,
      pendingComplaints, inProgressComplaints,
      visitorsToday,
      paidCount: paidPayments.length,
      unpaidCount: unpaidPayments.length,
      overdueCount: overduePayments.length,
    },
    monthlyData,
    roomStats,
  });
});

// @desc  Get tenant dashboard stats
// @route GET /api/dashboard/tenant
// @access Tenant
const getTenantStats = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findOne({ user: req.user._id }).populate("room");
  if (!tenant) {
    res.status(404);
    throw new Error("Tenant profile not found");
  }

  const payments = await Payment.find({ tenant: tenant._id }).sort({ createdAt: -1 }).limit(5);
  const pendingPayment = await Payment.findOne({ tenant: tenant._id, status: { $in: ["unpaid", "overdue"] } });
  const activeComplaints = await Complaint.countDocuments({ tenant: tenant._id, status: { $ne: "resolved" } });

  res.json({
    success: true,
    tenant,
    recentPayments: payments,
    pendingPayment,
    activeComplaints,
  });
});

module.exports = { getAdminStats, getTenantStats };
