const router = require("express").Router();
const weatherController = require("../controllers/weatherController");
const auth = require("../middlewares/auth");
const apiQuota = require("../middlewares/apiQuota");

// All weather routes require auth + quota check
router.get("/current", auth, apiQuota, weatherController.getCurrentWeather);
router.get("/forecast", auth, apiQuota, weatherController.getForecast);
router.get("/search", auth, apiQuota, weatherController.searchCity);
router.get("/quota", auth, weatherController.getQuotaStatus);

module.exports = router;
