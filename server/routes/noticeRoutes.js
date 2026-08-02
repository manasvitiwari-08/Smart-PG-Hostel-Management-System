const express = require("express");
const router = express.Router();
const { getNotices, createNotice, updateNotice, deleteNotice } = require("../controllers/noticeController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.route("/").get(protect, getNotices).post(protect, adminOnly, createNotice);
router.route("/:id").put(protect, adminOnly, updateNotice).delete(protect, adminOnly, deleteNotice);

module.exports = router;
