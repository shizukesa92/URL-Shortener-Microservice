const mongo = require("mongodb");
const express = require("express");
const app = express();
const shortid = require("shortid");
const validUrl = require("valid-url");
const dotenv = require("dotenv");
dotenv.config({
	path: "./.env"
});
const uri = process.env.MONGOLAB_URI;


module.exports = {
	generate: (req, res) => {
		mongo.MongoClient.connect(uri, (err, db) => {

			if (err) {
				console.log("Unable to connect to server", err);
			} else {
				console.log("Connected to server");
				let database = db.db("url-shortener-microservice");
				let collection = database.collection("urls");
				let url = req.body.url;
				let host = req.get("host") + "/api/shorturl/";
				//function to generate short link 
				let generateLink = function(db, callback) {
					if (validUrl.isUri(url)) {
						collection.findOne({
							"url": url
						}, {
							"short": 1,
							"_id": 0
						}, (err, doc) => {
							if (doc != null) {
								res.json({
									"original_url": url,
									"short_url": host + doc.short
								});
							} else {
								//generate a short code
								let shortCode = shortid.generate();
								let newUrl = {
									url: url,
									short: shortCode
								};
								collection.insert([newUrl]);
								res.json({
									"original_url": url,
									"short_url": host + shortCode
								});
							}
						});
					} else {
						res.json({
							"error": "Invalid URL"
						})
					}
				};

				generateLink(db, function() {
					db.close();
				});

			}
		});




	},

	redirect: (req, res) => {
		mongo.MongoClient.connect(uri, (err, db) => {
			let database = db.db("url-shortener-microservice");
			let collection = database.collection('urls');
			let short = req.params.short;

			collection.findOne({
				"short": short
			}, {
				"url": 1,
				"_id": 0
			}, (err, doc) => {
				if (doc != null) {
					res.redirect(doc.url);
				} else {
					res.json({
						error: "Shortlink not found in the database."
					});
				}
			});

			db.close();
		});
	}
}
