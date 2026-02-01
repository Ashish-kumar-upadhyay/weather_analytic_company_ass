const router = require("express").Router();
const settingsController = require("../controllers/settingsController");
const auth = require("../middlewares/auth");

router.get("/", auth, settingsController.getSettings);
router.put("/", auth, settingsController.updateSettings);

module.exports = router;
