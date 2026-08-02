const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    roomType: { type: String, enum: ["single", "double", "triple"], default: "single" },
    capacity: { type: Number, required: true },
    occupiedBeds: { type: Number, default: 0 },
    rent: { type: Number, required: true },
    status: { type: String, enum: ["available", "occupied", "maintenance"], default: "available" },
    description: { type: String, default: "" },
    amenities: [{ type: String }],
    floor: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Virtual for available beds
roomSchema.virtual("availableBeds").get(function () {
  return this.capacity - this.occupiedBeds;
});

module.exports = mongoose.model("Room", roomSchema);
