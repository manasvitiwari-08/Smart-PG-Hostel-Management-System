const asyncHandler = require("express-async-handler");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Tenant = require("../models/Tenant");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

// @desc  Get all payments
// @route GET /api/payments
// @access Admin
const getPayments = asyncHandler(async (req, res) => {
  const { status, tenant, month, page = 1, limit = 10 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (tenant) query.tenant = tenant;
  if (month) query.month = { $regex: month, $options: "i" };

  const total = await Payment.countDocuments(query);
  const payments = await Payment.find(query)
    .populate({ path: "tenant", select: "name phone email room", populate: { path: "room", select: "roomNumber" } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, payments, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc  Get my payments (tenant)
// @route GET /api/payments/my
// @access Tenant
const getMyPayments = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findOne({ user: req.user._id });
  if (!tenant) {
    res.status(404);
    throw new Error("Tenant profile not found");
  }
  const payments = await Payment.find({ tenant: tenant._id }).sort({ createdAt: -1 });
  res.json({ success: true, payments });
});

// @desc  Create payment record
// @route POST /api/payments
// @access Admin
const createPayment = asyncHandler(async (req, res) => {
  const { tenantId, amount, month, dueDate, notes } = req.body;
  const payment = await Payment.create({
    tenant: tenantId, amount, month, dueDate, notes,
  });
  res.status(201).json({ success: true, payment });
});

// @desc  Mark payment as paid (cash)
// @route PUT /api/payments/:id/mark-paid
// @access Admin
const markPaid = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }
  payment.status = "paid";
  payment.paymentMethod = req.body.paymentMethod || "cash";
  payment.paidAt = new Date();
  payment.transactionId = req.body.transactionId || "";
  await payment.save();

  // Update tenant payment status
  await Tenant.findByIdAndUpdate(payment.tenant, { paymentStatus: "paid" });
  res.json({ success: true, payment });
});

// @desc  Create Razorpay order
// @route POST /api/payments/create-order
// @access Tenant
const createOrder = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  const options = {
    amount: payment.amount * 100, // paise
    currency: "INR",
    receipt: `receipt_${payment._id}`,
  };

  const order = await razorpay.orders.create(options);
  payment.razorpayOrderId = order.id;
  await payment.save();

  res.json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// @desc  Verify Razorpay payment
// @route POST /api/payments/verify
// @access Tenant
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "placeholder_secret")
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error("Payment verification failed");
  }

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  payment.status = "paid";
  payment.paymentMethod = "online";
  payment.razorpayPaymentId = razorpay_payment_id;
  payment.transactionId = razorpay_payment_id;
  payment.paidAt = new Date();
  await payment.save();

  await Tenant.findByIdAndUpdate(payment.tenant, { paymentStatus: "paid" });
  res.json({ success: true, message: "Payment verified successfully", payment });
});

// @desc  Delete payment
// @route DELETE /api/payments/:id
// @access Admin
const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }
  await payment.deleteOne();
  res.json({ success: true, message: "Payment deleted" });
});

module.exports = { getPayments, getMyPayments, createPayment, markPaid, createOrder, verifyPayment, deletePayment };
