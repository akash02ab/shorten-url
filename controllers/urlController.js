const URLModel = require("../models/url");
const { nanoid } = require("nanoid");

function getShortenUrl() {
	let tld = nanoid(5);
	return `/${tld}`;
}

async function shortenUrl(url) {
	try {
		let thisURL = await URLModel.find({ url: url });

		if (thisURL.length) {
			return thisURL[0].shortenUrl;
		} else {
			const shortenUrl = getShortenUrl();
			const newURL = new URLModel({ url: url, shortenUrl: shortenUrl });
			await newURL.save();
			return shortenUrl;
		}
	} catch (err) {
		console.error(err);
	}
}

async function findActualUrl(path) {
	try {
		let thisUrl = await URLModel.findOne({ shortenUrl: path });

		if (thisUrl !== null) {
			return thisUrl.url;
		} else {
			return null;
		}
	} catch (err) {
		console.error(err);
	}
}

const urlController = {
	shortenUrl,
	findActualUrl,
};

module.exports = urlController;
