const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
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
}, {
  timestamps: true
});

// ============================================
// FIX 1: SIMPLIFIED PASSWORD HASHING
// ============================================

// Option A: Using async/await CORRECTLY
userSchema.pre("save", async function() {
  // Only hash the password if it has been modified
  if (!this.isModified("password")) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// ============================================
// OR Option B: Using callbacks (if async fails)
// ============================================
/*
userSchema.pre("save", function(next) {
  const user = this;
  
  // Only hash the password if it has been modified
  if (!user.isModified("password")) return next();
  
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});
*/

// ============================================
// OR Option C: Minimal working version
// ============================================
/*
userSchema.pre("save", async function() {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
*/

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;