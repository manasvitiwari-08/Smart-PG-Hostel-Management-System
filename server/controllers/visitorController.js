const asyncHandler = require("express-async-handler");
const Visitor = require("../models/Visitor");
const Tenant = require("../models/Tenant");

// @desc  Get all visitors
// @route GET /api/visitors
// @access Admin
const getVisitors = asyncHandler(async (req, res) => {
  const { search, tenant, page = 1, limit = 10 } = req.query;
  const query = {};
  if (tenant) query.tenant = tenant;
  if (search) {
    query.$or = [
      { visitorName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }
  const total = await Visitor.countDocuments(query);
  const visitors = await Visitor.find(query)
    .populate({ path: "tenant", select: "name phone room", populate: { path: "room", select: "roomNumber" } })
    .sort({ entryTime: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, visitors, total });
});

// @desc  Get my visitors (tenant)
// @route GET /api/visitors/my
// @access Tenant
const getMyVisitors = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findOne({ user: req.user._id });
  if (!tenant) {
    res.status(404);
    throw new Error("Tenant profile not found");
  }
  const visitors = await Visitor.find({ tenant: tenant._id }).sort({ entryTime: -1 });
  res.json({ success: true, visitors });
});

// @desc  Add visitor
// @route POST /api/visitors
// @access Admin
const addVisitor = asyncHandler(async (req, res) => {
  const { visitorName, phone, tenantId, purpose, idProof } = req.body;
  const visitor = await Visitor.create({
    visitorName, phone, tenant: tenantId, purpose, idProof,
    approvedBy: req.user._id,
  });
  const populated = await visitor.populate({ path: "tenant", select: "name room", populate: { path: "room", select: "roomNumber" } });
  res.status(201).json({ success: true, visitor: populated });
});

// @desc  Update visitor exit time
// @route PUT /api/visitors/:id/exit
// @access Admin
const markExit = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) {
    res.status(404);
    throw new Error("Visitor not found");
  }
  visitor.exitTime = new Date();
  await visitor.save();
  res.json({ success: true, visitor });
});

// @desc  Delete visitor
// @route DELETE /api/visitors/:id
// @access Admin
const deleteVisitor = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) {
    res.status(404);
    throw new Error("Visitor not found");
  }
  await visitor.deleteOne();
  res.json({ success: true, message: "Visitor record deleted" });
});

module.exports = { getVisitors, getMyVisitors, addVisitor, markExit, deleteVisitor };
