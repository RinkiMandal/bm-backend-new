const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = new Admin({ email, password });
    await admin.save();
    res.status(201).json({ msg: 'Admin created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    // Validate password
    if (admin.password !== password) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Create and return JWT token
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET); // Replace 'your_jwt_secret' with your actual JWT secret
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
};
