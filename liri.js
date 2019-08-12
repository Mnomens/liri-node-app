require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

const command = process.argv[2];
const search = process.argv.slice(3);