const express = require("express");

const apiController = require("../controllers/api");

const router = express.Router();

router.get("/search", apiController.search)

module.exports = router;
