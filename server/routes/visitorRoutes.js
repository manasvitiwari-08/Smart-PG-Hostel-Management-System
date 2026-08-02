const express = require("express");
const router = express.Router();
const { getVisitors, getMyVisitors, addVisitor, markExit, deleteVisitor } = require("../controllers/visitorController");
const { protect, adminOnly, tenantOnly } = require("../middleware/authMiddleware");

router.get("/my", protect, tenantOnly, getMyVisitors);
router.route("/").get(protect, adminOnly, getVisitors).post(protect, adminOnly, addVisitor);
router.put("/:id/exit", protect, adminOnly, markExit);
router.delete("/:id", protect, adminOnly, deleteVisitor);

module.exports = router;
