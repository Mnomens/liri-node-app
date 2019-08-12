require("dotenv").config();

const keys = require("./keys.js");
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);

let command = process.argv[2];
let args = process.argv;
let search = "";

for (let i = 3; i < args.length; i++) {
    if (i > 3 && i < args.length) {
        search = search + "+" + args[i];
    }
    else {
        search += args[i];
    }
}

function liri() {
    if (command === "concert-this") {
    concert(search);    
    }
    else if (command === "spotify-this-song") {
        if (search === "") {
            search = "the+sign";
            spot();
        }
        else {
        spot();
        }
    }
    else if (command === "movie-this") {
        if (search === "") {
            search = "mr+nobody";
            movie();
        }
        else {
            movie();
        }
    }
    else if (command === "do-what-it-says") {
        random();
    }
    else {
        console.log("Liri is unable to do that");
    }

}

function concert() {
    console.log("Checking for concerts for this group....");
    let queryURL = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(function(response) {
        for(let j = 0; j < 3; j++) {
            console.log("-------------------");
            console.log("Venue: " + response.data[j].venue.name);
            console.log("Venue location: " + response.data[j].venue.city + ", " + response.data[j].venue.country);
            console.log("Event date: " + moment(response.data[j].datetime).format("MM/DD/YYYY"));
        }
    }).catch(function(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
    })
}

function spot() {
    console.log("Checking for this song.....");
    spotify.search({type: "track", query: search}, function(err, data) {
        if(err) {
            return console.log("Error occured: " + err);
        }
        for(k=0; k < 3; k ++) {
            console.log("----------------");
            console.log("Artist: " + data.tracks.items[k].artists[0].name);
            console.log("Song Name: " + data.tracks.items[k].name);
            console.log("Preview url: " + data.tracks.items[k].preview_url);
            console.log("Album Name: " + data.tracks.items[k].album.name)
        }
    });
    
}

function movie() {
    console.log("Checking for this movie....");
    let queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + search;

    axios.get(queryURL).then(function(response) {
        console.log("Movie Title: " + response.data.Title);
        console.log("Release Date: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Production Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
    }).catch(function(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
    });
}

function random() {
    console.log("Checking the file.....")
    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error) {
            return console.log(error);
        }
        let dataArr = data.split(",");
        command = dataArr[0];
        search = dataArr[1].replace('"', "");
        search = search.replace('"', "");
        search = search.trim();
        liri(command);
    })
}

liri();