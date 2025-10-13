const path = require("path");

module.exports = {
	entry: "./index.js",
	output: {
		filename: "espresso-sc.js",
		path: path.resolve(__dirname, "dist"),
	},
	mode: "production"
};