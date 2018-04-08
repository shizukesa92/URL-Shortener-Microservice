module.exports = {
	parse: (req, res) => {
		let data = {
			"ipaddress": req.headers["x-forwarded-for"] ||
				req.connection.remoteAddress.replace(/^.*:/, '') ||
				req.socket.remoteAddress.replace(/^.*:/, '') ||
				req.connection.socket.remoteAddress,
			"language": req.headers["accept-language"].split(",")[0],
			"software": req.headers["user-agent"].split(") ")[0].split(" (")[1]
		}

		res.send(data);
	}
}
