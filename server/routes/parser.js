const dotenv = require("dotenv");
const mongo = require("mongodb");
const uri = "mongodb://user:123456@ds237989.mlab.com:37989/url-shortener-microservice";
const shortid = require('shortid');
var validUrl = require('valid-url');
dotenv.config(); // Good for development only

module.exports = {
	generate: (req, res) => {
		mongo.MongoClient.connect(uri, (err, db) => {

			if (err) {
				console.log("Unable to connect to server", err);
			} else {
				console.log("Connected to server");
				let database = db.db("url-shortener-microservice");
				let collection = database.collection('urls');
				let url = req.params.url;
				let host = req.get('host') + "/"

				//function to generate short link 
				let generateLink = function(db, callback) {
					//check if url is valid
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
							"error": "Invalid url"
						})
					}
				};

				generateLink(db, function() {
					db.close();
				});

				function validateURL(url) {
					var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
					return regex.test(url);
				}
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
