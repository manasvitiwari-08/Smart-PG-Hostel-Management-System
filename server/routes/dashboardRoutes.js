const express = require("express");
const router = express.Router();
const { getAdminStats, getTenantStats } = require("../controllers/dashboardController");
const { protect, adminOnly, tenantOnly } = require("../middleware/authMiddleware");

router.get("/admin", protect, adminOnly, getAdminStats);
router.get("/tenant", protect, tenantOnly, getTenantStats);

module.exports = router;
