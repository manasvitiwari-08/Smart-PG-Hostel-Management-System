const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    visitorName: { type: String, required: true },
    phone: { type: String, required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    purpose: { type: String, default: "Personal Visit" },
    entryTime: { type: Date, default: Date.now },
    exitTime: { type: Date },
    idProof: { type: String, default: "" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
