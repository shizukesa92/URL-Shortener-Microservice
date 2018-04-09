const express = require("express");
const router = express.Router();
const path = require("path");
const parser = require("./parser");
router.route("/new/:url*").get(parser.generate);
router.route("/:short").get(parser.redirect);

router.get("/", (req, res) => {
	res.status(200).send(req.protocol + '://' + req.get("host"));
});
module.exports = router;
