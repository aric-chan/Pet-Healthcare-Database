const express = require("express");
const router = express.Router();
const { getReport, divisionPool, divisionResult } = require("../controllers/reportController");

router.get("/division/pool", divisionPool);
router.get("/division/result", divisionResult);
router.get("/:type", getReport);


module.exports = router;