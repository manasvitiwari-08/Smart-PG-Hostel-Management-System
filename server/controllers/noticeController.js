const asyncHandler = require("express-async-handler");
const Notice = require("../models/Notice");

// @desc  Get all notices
// @route GET /api/notices
// @access Private
const getNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find()
    .populate("createdBy", "name avatar")
    .sort({ createdAt: -1 });
  res.json({ success: true, notices });
});

// @desc  Create notice
// @route POST /api/notices
// @access Admin
const createNotice = asyncHandler(async (req, res) => {
  const { title, message, isImportant, expiresAt } = req.body;
  const notice = await Notice.create({
    title, message, isImportant, expiresAt,
    createdBy: req.user._id,
  });
  const populated = await notice.populate("createdBy", "name avatar");
  res.status(201).json({ success: true, notice: populated });
});

// @desc  Update notice
// @route PUT /api/notices/:id
// @access Admin
const updateNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    res.status(404);
    throw new Error("Notice not found");
  }
  const { title, message, isImportant, expiresAt } = req.body;
  if (title) notice.title = title;
  if (message) notice.message = message;
  if (isImportant !== undefined) notice.isImportant = isImportant;
  if (expiresAt) notice.expiresAt = expiresAt;
  const updated = await notice.save();
  res.json({ success: true, notice: updated });
});

// @desc  Delete notice
// @route DELETE /api/notices/:id
// @access Admin
const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    res.status(404);
    throw new Error("Notice not found");
  }
  await notice.deleteOne();
  res.json({ success: true, message: "Notice deleted" });
});

module.exports = { getNotices, createNotice, updateNotice, deleteNotice };
