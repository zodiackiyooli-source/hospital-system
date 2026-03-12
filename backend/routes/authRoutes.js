const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: Token samee ───────────────────────────────────────────────────────
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ── POST /api/auth/register ───────────────────────────────────────────────────
// Diiwaan galinta user cusub (Worker / Admin / Owner)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Fadlan buuxi dhammaan goobaha.' });
        }

        // Hubi in email horay loo isticmaalay
        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.status(400).json({ message: 'Email-kaan horay ayaa loo diiwaan geliyay.' });
        }

        // Normalize role si uu ula ekaado schema-ga (lowercase)
        const normalizedRole = role.toLowerCase();

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: normalizedRole
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
            joinedAt: user.createdAt
        });

    } catch (err) {
        console.error('Register Error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
// Login-ka
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email iyo password geli.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Email ama password-ka waa khalad.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ama password-ka waa khalad.' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
            joinedAt: user.createdAt
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
// User-ka hadda logged-in ah
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Token ma jiro.' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User-ka lama helin.' });

        res.json(user);
    } catch (err) {
        res.status(401).json({ message: 'Token-ka waa khalad ama waaa dumay.' });
    }
});

module.exports = router;
