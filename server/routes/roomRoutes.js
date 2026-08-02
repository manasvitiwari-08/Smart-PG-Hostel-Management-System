const express = require("express");
const router = express.Router();
const { getRooms, getRoom, createRoom, updateRoom, deleteRoom } = require("../controllers/roomController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.route("/").get(protect, getRooms).post(protect, adminOnly, createRoom);
router.route("/:id").get(protect, getRoom).put(protect, adminOnly, updateRoom).delete(protect, adminOnly, deleteRoom);

module.exports = router;
