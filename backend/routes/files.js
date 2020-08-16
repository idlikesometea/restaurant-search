const express = require("express");

const filesController = require("../controllers/files");

const router = express.Router();

router.post("/json", filesController.json);

router.post("/pdf", filesController.pdf);

module.exports = router;
