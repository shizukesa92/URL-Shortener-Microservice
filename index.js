const express = require("express");
const app = express();
const path = require("path");
const api = require("./server/routes/api");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use("/api", api);
app.use("/api/shorturl", api);

app.use(express.static("./dist/client"));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "./dist/client/index.html"));
});
app.listen(process.env.PORT || 3000);

//heroku config:set MONGOLAB_URI=mongodb://<dbuser>:<dbpassword>@ds237989.mlab.com:37989/url-shortener-microservice
