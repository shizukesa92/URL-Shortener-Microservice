const express = require("express");
const router = express.Router();
const path = require("path");


router.get("/", (req, res) => {
	res.status(200).send(req.protocol + '://' + req.get("host"));
});
module.exports = router;
