const asyncHandler = require("express-async-handler");
const Tenant = require("../models/Tenant");
const User = require("../models/User");
const Room = require("../models/Room");
const Payment = require("../models/Payment");

// @desc  Get all tenants
// @route GET /api/tenants
// @access Admin
const getTenants = asyncHandler(async (req, res) => {
  const { search, status, room, page = 1, limit = 10 } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }
  if (status) query.paymentStatus = status;
  if (room) query.room = room;

  const total = await Tenant.countDocuments(query);
  const tenants = await Tenant.find(query)
    .populate("room", "roomNumber roomType rent")
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, tenants, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc  Get single tenant
// @route GET /api/tenants/:id
// @access Admin
const getTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id)
    .populate("room")
    .populate("user", "-password");
  if (!tenant) {
    res.status(404);
    throw new Error("Tenant not found");
  }
  res.json({ success: true, tenant });
});

// @desc  Get tenant by logged-in user
// @route GET /api/tenants/my-profile
// @access Tenant
const getMyProfile = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findOne({ user: req.user._id })
    .populate("room")
    .populate("user", "-password");
  if (!tenant) {
    res.status(404);
    throw new Error("Tenant profile not found");
  }
  res.json({ success: true, tenant });
});

// @desc  Create tenant
// @route POST /api/tenants
// @access Admin
const createTenant = asyncHandler(async (req, res) => {
  const { name, phone, email, gender, college, profession, idProofType, idProofNumber,
    roomId, joiningDate, rentAmount, emergencyContact, address, password } = req.body;

  // Create user account for tenant
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, password: password || "tenant123", role: "tenant", phone });
  }

  // Check if tenant profile already exists
  const existingTenant = await Tenant.findOne({ user: user._id });
  if (existingTenant) {
    res.status(400);
    throw new Error("Tenant profile already exists for this user");
  }

  // Update room occupancy
  if (roomId) {
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }
    if (room.occupiedBeds >= room.capacity) {
      res.status(400);
      throw new Error("Room is at full capacity");
    }
    room.occupiedBeds += 1;
    if (room.occupiedBeds >= room.capacity) room.status = "occupied";
    await room.save();
  }

  const tenant = await Tenant.create({
    user: user._id, name, phone, email, gender, college, profession,
    idProofType, idProofNumber, room: roomId || null,
    joiningDate: joiningDate || Date.now(), rentAmount, emergencyContact, address,
  });

  const populated = await tenant.populate(["room", { path: "user", select: "-password" }]);
  res.status(201).json({ success: true, tenant: populated });
});

// @desc  Update tenant
// @route PUT /api/tenants/:id
// @access Admin
const updateTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);
  if (!tenant) {
    res.status(404);
    throw new Error("Tenant not found");
  }

  // Handle room change
  if (req.body.roomId && req.body.roomId !== String(tenant.room)) {
    // Free old room
    if (tenant.room) {
      const oldRoom = await Room.findById(tenant.room);
      if (oldRoom) {
        oldRoom.occupiedBeds = Math.max(0, oldRoom.occupiedBeds - 1);
        if (oldRoom.occupiedBeds < oldRoom.capacity) oldRoom.status = "available";
        await oldRoom.save();
      }
    }
    // Occupy new room
    const newRoom = await Room.findById(req.body.roomId);
    if (newRoom) {
      if (newRoom.occupiedBeds >= newRoom.capacity) {
        res.status(400);
        throw new Error("New room is at full capacity");
      }
      newRoom.occupiedBeds += 1;
      if (newRoom.occupiedBeds >= newRoom.capacity) newRoom.status = "occupied";
      await newRoom.save();
    }
    tenant.room = req.body.roomId;
  }

  const fields = ["name", "phone", "email", "gender", "college", "profession",
    "idProofType", "idProofNumber", "idProofImage", "rentAmount", "paymentStatus",
    "emergencyContact", "address", "isActive"];
  fields.forEach((f) => { if (req.body[f] !== undefined) tenant[f] = req.body[f]; });

  const updated = await tenant.save();
  await updated.populate(["room", { path: "user", select: "-password" }]);
  res.json({ success: true, tenant: updated });
});

// @desc  Delete tenant
// @route DELETE /api/tenants/:id
// @access Admin
const deleteTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);
  if (!tenant) {
    res.status(404);
    throw new Error("Tenant not found");
  }
  // Free room
  if (tenant.room) {
    const room = await Room.findById(tenant.room);
    if (room) {
      room.occupiedBeds = Math.max(0, room.occupiedBeds - 1);
      if (room.occupiedBeds < room.capacity) room.status = "available";
      await room.save();
    }
  }
  await tenant.deleteOne();
  res.json({ success: true, message: "Tenant removed" });
});

module.exports = { getTenants, getTenant, getMyProfile, createTenant, updateTenant, deleteTenant };
