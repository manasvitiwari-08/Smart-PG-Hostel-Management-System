const express = require("express");
const router = express.Router();
const { getComplaints, getMyComplaints, createComplaint, updateComplaint, deleteComplaint } = require("../controllers/complaintController");
const { protect, adminOnly, tenantOnly } = require("../middleware/authMiddleware");

router.get("/my", protect, tenantOnly, getMyComplaints);
router.route("/").get(protect, adminOnly, getComplaints).post(protect, tenantOnly, createComplaint);
router.route("/:id").put(protect, adminOnly, updateComplaint).delete(protect, adminOnly, deleteComplaint);

module.exports = router;
