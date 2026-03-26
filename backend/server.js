require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const winston = require('winston');
const path = require('path');
const connectDB = require('./config/db');

// ── Logger (Winston) ──────────────────────────────────────────────────────────
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Morgan stream to Winston
const morganStream = {
  write: (message) => logger.http(message.trim())
};

// MongoDB connection will be called in startServer()

const app = express();

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 1000, // Increase limit to 1000
  message: { success: false, message: 'Too many requests' }
});
app.use(limiter);


// ── Logging ───────────────────────────────────────────────────────────────────
app.use(morgan('combined', { stream: morganStream }));

// ── Body Parser & CORS ───────────────────────────────────────────────────────
app.use(cors({ origin: '*' })); // Dev: all origins
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Swagger Docs ──────────────────────────────────────────────────────────────
const fs = require('fs');
const swaggerDocument = yaml.load(fs.readFileSync('swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve);
app.use('/api-docs', swaggerUi.setup(swaggerDocument));

// ── Middleware ────────────────────────────────────────────────────────────────
const { protect } = require('./middleware/authMiddleware');
const { roleCheck } = require('./middleware/roleMiddleware');
const errorHandler = require('./middleware/errorMiddleware');
const { singleDoc } = require('./middleware/upload');

// ── Routes (Public) ───────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));

// ── Protected Routes (Admin/Worker) ───────────────────────────────────────────
const adminRole = roleCheck('admin', 'worker');

app.use('/api/patients', protect, adminRole, require('./routes/patientRoutes'));
app.use('/api/labs', protect, adminRole, require('./routes/labRoutes'));
app.use('/api/medicines', protect, adminRole, require('./routes/medicineRoutes'));
app.use('/api/doctors', protect, adminRole, require('./routes/doctorRoutes'));
app.use('/api/sales', protect, adminRole, require('./routes/salesRoutes'));
app.use('/api/pharmacy', protect, adminRole, require('./routes/pharmacyRoutes'));
app.use('/api/debts', protect, adminRole, require('./routes/debtRoutes'));
app.use('/api/dashboard', protect, adminRole, require('./routes/dashboardRoutes'));
app.use('/api/prescriptions', protect, adminRole, require('./routes/prescriptionRoutes'));
app.use('/api/reports', protect, adminRole, require('./routes/reportRoutes'));
app.use('/api/appointments', protect, adminRole, require('./routes/appointmentRoutes'));
app.use('/api/billing', protect, adminRole, require('./routes/billingRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ Hospital System API is running!', time: new Date(), version: '1.0' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🏥 Hospital System API running on port ${PORT}`);
      logger.info(`📚 Swagger docs: http://127.0.0.1:${PORT}/api-docs`);
      logger.info('🗄️ MongoDB connected');
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();