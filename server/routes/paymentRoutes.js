const express = require("express");
const router = express.Router();
const { getPayments, getMyPayments, createPayment, markPaid, createOrder, verifyPayment, deletePayment } = require("../controllers/paymentController");
const { protect, adminOnly, tenantOnly } = require("../middleware/authMiddleware");

router.get("/my", protect, tenantOnly, getMyPayments);
router.post("/create-order", protect, tenantOnly, createOrder);
router.post("/verify", protect, tenantOnly, verifyPayment);
router.route("/").get(protect, adminOnly, getPayments).post(protect, adminOnly, createPayment);
router.put("/:id/mark-paid", protect, adminOnly, markPaid);
router.delete("/:id", protect, adminOnly, deletePayment);

module.exports = router;
