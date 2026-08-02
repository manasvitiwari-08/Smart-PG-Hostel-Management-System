const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    college: {
      type: String,
      default: "",
    },

    profession: {
      type: String,
      default: "",
    },

    idProofType: {
      type: String,
      default: "Aadhar",
    },

    idProofNumber: {
      type: String,
      default: "",
    },

    idProofImage: {
      type: String,
      default: "",
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    leavingDate: {
      type: Date,
    },

    rentAmount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "partial"],
      default: "unpaid",
    },

    emergencyContact: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tenant", tenantSchema);