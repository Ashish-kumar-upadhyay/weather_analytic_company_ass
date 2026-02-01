const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const { connectDB, sequelize } = require("./config/db");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { generalLimiter } = require("./middlewares/rateLimiter");
const appConfigService = require("./services/appConfigService");
const cacheService = require("./services/cacheService");
const { sendSuccess, sendError } = require("./utils/responseHandler");
const { STATUS_CODE } = require("./constants/application_constant");

// Import models to register them
require("./models");

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Middleware ---------------
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(generalLimiter);

// --------------- Routes ---------------
app.use("/api", routes);

// Root route
app.get("/", (req, res) => {
  return sendSuccess(res, STATUS_CODE.SUCCESS, 5059, {
    version: "1.0.0",
    docs: "/api/health",
  });
});

// 404 handler
app.use((req, res) => {
  return sendError(res, STATUS_CODE.NOT_FOUND, 2065, { route: req.originalUrl });
});

// --------------- Error Handler ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Sync models (creates tables if not exist)
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("✅ Database tables synced");

    // Seed app config defaults (reads from DB, creates if first run)
    await appConfigService.seedDefaults();
    const quota = appConfigService.getQuotaConfig();
    cacheService.updateTTL(appConfigService.getInt("CACHE_TTL_SECONDS"));
    console.log(`✅ App config loaded — Project cap: ${quota.PROJECT_CAP}, Assignable pool: ${quota.ASSIGNABLE_POOL}`);

    // Start listening
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log(`❤️  Health: http://localhost:${PORT}/api/health\n`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error("❌ Server error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

startServer();
