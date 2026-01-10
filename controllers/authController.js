const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// USER SIGN IN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT token
    const token = generateToken(user._id);

    // 4. Send response with ALL user data
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        pincode: user.pincode || "",
        role: user.role,
        sellerStatus: user.sellerStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

// USER SIGN UP
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address, pincode } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      address: address || "",
      pincode: pincode || "",
      role: "user",
      sellerStatus: "not_seller"
    });

    // 4. Save user
    await user.save();

    // 5. Generate token
    const token = generateToken(user._id);

    // 6. Send response with ALL user data
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        pincode: user.pincode || "",
        role: user.role,
        sellerStatus: user.sellerStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};