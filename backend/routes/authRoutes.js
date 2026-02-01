const router = require("express").Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");
const { authLimiter } = require("../middlewares/rateLimiter");

// Public routes
router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/google", authController.googleLogin);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Protected routes
router.get("/me", auth, authController.getMe);
router.post("/logout", auth, authController.logout);

module.exports = router;
