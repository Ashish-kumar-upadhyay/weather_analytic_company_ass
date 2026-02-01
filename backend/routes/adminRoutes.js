const router = require("express").Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth");
const { adminOnly } = require("../middlewares/roleCheck");

// All admin routes require auth + admin role
router.get("/users", auth, adminOnly, adminController.getAllUsers);
router.get("/users/:id/quota", auth, adminOnly, adminController.getUserQuota);
router.put("/users/:id/limit", auth, adminOnly, adminController.updateUserLimit);
router.get("/quota-stats", auth, adminOnly, adminController.getQuotaStats);
router.get("/quota-pool", auth, adminOnly, adminController.getQuotaPool);
router.get("/config", auth, adminOnly, adminController.getConfig);
router.put("/config", auth, adminOnly, adminController.updateConfig);

module.exports = router;
