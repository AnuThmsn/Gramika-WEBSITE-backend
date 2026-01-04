const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    pincode: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user"
    },
    sellerStatus: {
      type: String,
      enum: ["not_seller", "pending", "approved", "rejected"],
      default: "not_seller"
    },
    avatarUrl: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

/* Hash password */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* Compare password */
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/* Prevent OverwriteModelError */
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
