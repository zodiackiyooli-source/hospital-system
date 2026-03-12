require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());  // Allow all origins (development mode)
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/labs', require('./routes/labRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/pharmacy', require('./routes/pharmacyRoutes'));

// Health check
app.get('/', (req, res) => {
    res.json({ message: '✅ Hospital System API is running!', time: new Date() });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🏥 Hospital System API`);
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`🗄️  MongoDB: connecting...`);
});
