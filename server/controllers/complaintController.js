const asyncHandler = require("express-async-handler");
const Complaint = require("../models/Complaint");
const Tenant = require("../models/Tenant");

// @desc  Get all complaints (admin)
// @route GET /api/complaints
// @access Admin
const getComplaints = asyncHandler(async (req, res) => {
  const { status, priority, page = 1, limit = 10 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const total = await Complaint.countDocuments(query);
  const complaints = await Complaint.find(query)
    .populate({ path: "tenant", select: "name phone email room", populate: { path: "room", select: "roomNumber" } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, complaints, total });
});

// @desc  Get my complaints (tenant)
// @route GET /api/complaints/my
// @access Tenant
const getMyComplaints = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findOne({ user: req.user._id });
  if (!tenant) {
    res.status(404);
    throw new Error("Tenant profile not found");
  }
  const complaints = await Complaint.find({ tenant: tenant._id }).sort({ createdAt: -1 });
  res.json({ success: true, complaints });
});

// @desc  Create complaint
// @route POST /api/complaints
// @access Tenant
const createComplaint = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findOne({ user: req.user._id });
  if (!tenant) {
    res.status(404);
    throw new Error("Tenant profile not found");
  }
  const { title, description, category, priority } = req.body;
  const complaint = await Complaint.create({
    tenant: tenant._id, title, description, category, priority,
  });
  res.status(201).json({ success: true, complaint });
});

// @desc  Update complaint status (admin)
// @route PUT /api/complaints/:id
// @access Admin
const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }
  const { status, priority, adminRemark } = req.body;
  if (status) complaint.status = status;
  if (priority) complaint.priority = priority;
  if (adminRemark !== undefined) complaint.adminRemark = adminRemark;
  if (status === "resolved") complaint.resolvedAt = new Date();
  const updated = await complaint.save();
  res.json({ success: true, complaint: updated });
});

// @desc  Delete complaint
// @route DELETE /api/complaints/:id
// @access Admin
const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }
  await complaint.deleteOne();
  res.json({ success: true, message: "Complaint deleted" });
});

module.exports = { getComplaints, getMyComplaints, createComplaint, updateComplaint, deleteComplaint };
