const asyncHandler = require("express-async-handler");
const Room = require("../models/Room");
const Tenant = require("../models/Tenant");

// @desc  Get all rooms
// @route GET /api/rooms
// @access Private
const getRooms = asyncHandler(async (req, res) => {
  const { status, type, search } = req.query;
  const query = {};
  if (status) query.status = status;
  if (type) query.roomType = type;
  if (search) query.roomNumber = { $regex: search, $options: "i" };

  const rooms = await Room.find(query).sort({ roomNumber: 1 });
  res.json({ success: true, rooms });
});

// @desc  Get single room
// @route GET /api/rooms/:id
// @access Private
const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }
  const tenants = await Tenant.find({ room: room._id, isActive: true }).select("name phone email");
  res.json({ success: true, room, tenants });
});

// @desc  Create room
// @route POST /api/rooms
// @access Admin
const createRoom = asyncHandler(async (req, res) => {
  const { roomNumber, roomType, capacity, rent, description, amenities, floor } = req.body;

  const exists = await Room.findOne({ roomNumber });
  if (exists) {
    res.status(400);
    throw new Error("Room number already exists");
  }

  const room = await Room.create({ roomNumber, roomType, capacity, rent, description, amenities, floor });
  res.status(201).json({ success: true, room });
});

// @desc  Update room
// @route PUT /api/rooms/:id
// @access Admin
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }
  const fields = ["roomNumber", "roomType", "capacity", "rent", "status", "description", "amenities", "floor"];
  fields.forEach((f) => { if (req.body[f] !== undefined) room[f] = req.body[f]; });
  const updated = await room.save();
  res.json({ success: true, room: updated });
});

// @desc  Delete room
// @route DELETE /api/rooms/:id
// @access Admin
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }
  const activeTenants = await Tenant.countDocuments({ room: room._id, isActive: true });
  if (activeTenants > 0) {
    res.status(400);
    throw new Error("Cannot delete room with active tenants");
  }
  await room.deleteOne();
  res.json({ success: true, message: "Room deleted" });
});

module.exports = { getRooms, getRoom, createRoom, updateRoom, deleteRoom };
