const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Register a user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    console.log('\n📝 REGISTRATION REQUEST RECEIVED');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    try {
        const { name, email, password, phone, address, pincode } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields: name, email, and password are required' 
            });
        }

        console.log('🔍 Checking if user exists...');
        let user = await User.findOne({ email });
        if (user) {
            console.log(`❌ User already exists: ${email}`);
            return res.status(400).json({ 
                success: false,
                message: 'User already exists with this email' 
            });
        }

        console.log('👤 Creating new user...');
        user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password,
            phone: phone || '',
            address: address || '',
            pincode: pincode || '',
            role: 'user',
            sellerStatus: 'not_seller',
            avatarUrl: '',
            bio: ''
        });

        console.log('💾 Saving user to database...');
        await user.save();
        console.log(`✅ User saved successfully with ID: ${user._id}`);

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('🎫 JWT token generated');
        
        // Prepare user response
        const userResponse = {
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            pincode: user.pincode || '',
            role: user.role,
            sellerStatus: user.sellerStatus,
            avatarUrl: user.avatarUrl || '',
            bio: user.bio || '',
            createdAt: user.createdAt
        };

        console.log('📤 Sending successful response');
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('\n❌ REGISTRATION ERROR:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Handle specific errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        
        if (error.name === 'MongoServerError' && error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        res.status(500).json({ 
            success: false,
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    console.log('\n🔐 LOGIN REQUEST RECEIVED');
    console.log('Email:', req.body.email);
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide email and password' 
            });
        }

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('❌ Password mismatch for user:', email);
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log(`✅ Login successful for user: ${user.name}`);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
                pincode: user.pincode || '',
                role: user.role,
                sellerStatus: user.sellerStatus,
                avatarUrl: user.avatarUrl || '',
                bio: user.bio || '',
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during login'
        });
    }
});

// @desc    Get current user
// @route   GET /api/auth/me
router.get('/me', async (req, res) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token, authorization denied' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.json({ 
            success: true,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
                pincode: user.pincode || '',
                role: user.role,
                sellerStatus: user.sellerStatus,
                avatarUrl: user.avatarUrl || '',
                bio: user.bio || '',
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({ 
            success: false,
            message: 'Token is not valid' 
        });
    }
});

module.exports = router;