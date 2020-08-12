const express = require("express");

const filesController = require("../controllers/files");

const router = express.Router();

router.post("/json", filesController.json);

module.exports = router;
