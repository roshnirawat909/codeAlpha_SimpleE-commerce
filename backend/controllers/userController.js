const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const user = await User.create({ email, password, name: name || '' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}

module.exports = { register, login };

