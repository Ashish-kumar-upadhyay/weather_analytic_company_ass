const router = require("express").Router();
const { sendSuccess } = require("../utils/responseHandler");

const authRoutes = require("./authRoutes");
const weatherRoutes = require("./weatherRoutes");
const favoriteRoutes = require("./favoriteRoutes");
const settingsRoutes = require("./settingsRoutes");
const adminRoutes = require("./adminRoutes");

router.use("/auth", authRoutes);
router.use("/weather", weatherRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/settings", settingsRoutes);
router.use("/admin", adminRoutes);

// Health check
router.get("/health", (req, res) => {
  return sendSuccess(res, "5059", {
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
