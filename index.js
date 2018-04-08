const express = require("express");
const app = express();
const http = require("http");
const api = require("./server/routes/api");

app.use("/api/", api);
app.use(express.static("./dist/client"));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "./dist/client/index.html"));
});
app.listen(process.env.PORT || 3000);
