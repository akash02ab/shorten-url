const http = require("http");
const fs = require("fs");
const mongoose = require("mongoose");
const { shortenUrl, findActualUrl } = require("./controllers/urlController");

mongoose
	.connect(
		"mongodb+srv://akash:lBxxMSSeLtvImmbJ@cluster0.jjgzr.mongodb.net/urlshortner?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		}
	)
	.then(() => createAndRunServer());

function createAndRunServer() {
	let url = "";

	const server = http.createServer(async (req, res) => {
		try {
			let response = await findActualUrl(req.url);

			if (response) {
				res.writeHead(301, { Location: response });
				res.end();
			}
		} catch (err) {
			console.error(err);
		}

		res.setHeader("Content-type", "text/html");
		let path = "";
		res.statusCode = 200;

		switch (req.url) {
			case "/":
				path = "index.html";
				break;
			case "/shorten":
				path = "shortenlink.html";

				if (req.method == "POST") {
					let data = "";
					req.on("data", (chunk) => {
						data += chunk;
					}).on("end", () => {
						url = decodeURIComponent(data.toString());
					});
				}

				break;
			default:
				path = "error.html";
				res.statusCode = 404;
				break;
		}

		fs.readFile(`./views/${path}`, async (err, data) => {
			if (err) {
				console.error(err);
				res.write("Server Error");
				res.end();
			} else {
				url = url.replace("url=", "");
				let shortenURL = await shortenUrl(url);
				data = data.toString().replace("{{url}}", url);
				data = data.toString().replace(/{{shortenURL}}/g, shortenURL);
				res.write(data, "utf-8");
				res.end();
			}
		});
	});

	server.listen(8008, "localhost", () => {
		console.log("Server is listening on 8008");
	});
}
