const express = require('express');
const { writeSource, getSources } = require("../mongoose")

const router = express.Router();

router.post("/post", writeSource)
router.get("/get", getSources)

module.exports = router
