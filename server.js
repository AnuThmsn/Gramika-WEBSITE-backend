const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables FIRST
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars);
    console.error('💡 Please check your .env file');
    process.exit(1);
}

console.log('✅ Environment variables loaded successfully');
console.log(`🌐 Server Port: ${process.env.PORT || 5000}`);
console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Missing'}`);
console.log(`🗄️  MongoDB URI: ${process.env.MONGO_URI ? 'Set (length: ' + process.env.MONGO_URI.length + ')' : 'Missing'}`);

// Connect to Database
connectDB();

const app = express();

/* =========================
   MIDDLEWARES
   ========================= */
app.use(cors({ 
    origin: "http://localhost:5173", 
    credentials: true 
}));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

/* =========================
   ROUTES
   ========================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/products", require("./routes/product"));
app.use("/api/shop", require("./routes/shop"));

/* =========================
   HEALTH CHECK & DB STATUS
   ========================= */
app.get("/", (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    res.json({
        message: "Gramika API Running",
        timestamp: new Date().toISOString(),
        database: statusMap[dbStatus] || 'unknown',
        uptime: process.uptime()
    });
});

// Test database connection endpoint
app.get("/api/health", (req, res) => {
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    
    res.json({
        status: dbState === 1 ? 'healthy' : 'unhealthy',
        database: dbState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

/* =========================
   ERROR HANDLING MIDDLEWARE
   ========================= */
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.url} not found` });
});

/* =========================
   SERVER START
   ========================= */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`👤 Auth endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});