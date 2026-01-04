const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @desc    Update user profile
// @route   PUT /api/user/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update allowed fields
    const allowedUpdates = ['name', 'phone', 'address', 'bio', 'avatarUrl', 'pincode'];
    Object.keys(updates).forEach(update => {
      if (allowedUpdates.includes(update)) {
        user[update] = updates[update];
      }
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        pincode: user.pincode,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Change password
// @route   PUT /api/user/change-password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update notification settings
// @route   PUT /api/user/notification-settings
router.put('/notification-settings', auth, async (req, res) => {
  try {
    const { emailNotifications, pushNotifications } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Create or update settings
    user.settings = user.settings || {};
    user.settings.notifications = {
      email: emailNotifications,
      push: pushNotifications
    };
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Notification settings updated',
      settings: user.settings.notifications
    });
  } catch (error) {
    console.error('Notification settings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update privacy settings
// @route   PUT /api/user/privacy-settings
router.put('/privacy-settings', auth, async (req, res) => {
  try {
    const { profileVisibility } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Create or update settings
    user.settings = user.settings || {};
    user.settings.privacy = {
      profileVisibility: profileVisibility
    };
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Privacy settings updated',
      settings: user.settings.privacy
    });
  } catch (error) {
    console.error('Privacy settings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get user by ID (for profile updates)
// @route   PUT /api/user/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if user is updating their own profile
    if (user._id.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    // Update allowed fields
    const allowedUpdates = ['name', 'phone', 'address', 'bio', 'avatarUrl', 'pincode'];
    Object.keys(updates).forEach(update => {
      if (allowedUpdates.includes(update)) {
        user[update] = updates[update];
      }
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        pincode: user.pincode,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;