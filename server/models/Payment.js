const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true }, // e.g. "January 2025"
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["paid", "unpaid", "overdue"], default: "unpaid" },
    paymentMethod: { type: String, enum: ["cash", "online", "upi", "bank_transfer"], default: "cash" },
    transactionId: { type: String, default: "" },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    paidAt: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
