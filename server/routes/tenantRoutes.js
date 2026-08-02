const express = require("express");
const router = express.Router();
const { getTenants, getTenant, getMyProfile, createTenant, updateTenant, deleteTenant } = require("../controllers/tenantController");
const { protect, adminOnly, tenantOnly } = require("../middleware/authMiddleware");

router.get("/my-profile", protect, tenantOnly, getMyProfile);
router.route("/").get(protect, adminOnly, getTenants).post(protect, adminOnly, createTenant);
router.route("/:id").get(protect, adminOnly, getTenant).put(protect, adminOnly, updateTenant).delete(protect, adminOnly, deleteTenant);

module.exports = router;
