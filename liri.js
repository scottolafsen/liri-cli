// Requiring the NPM packages
require("dotenv").config();
var axios = require("Axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var fs = require("fs");

// Importing keys.js file
var keys = require("./keys.js");

// API keys
var spotify = new Spotify(keys.spotify);
var omdb = keys.omdb.key;
var bandskey = keys.bit.key

// Captures command line arguments
var operation = process.argv[2];
var content = process.argv[3];

// Takes the operation argument and runs corresponding function
switch (operation) {
  case "concert-this":
    bandsInTown();
    break;
  case "spotify-this-song":
    spotifySong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default: console.log("wrong command");
}

// Bands in Town API function
function bandsInTown() {
  axios.get("https://rest.bandsintown.com/artists/" + content + "/events?app_id=" + bandskey).then(function (response) {
    concerts = response.data;
    for (var i = 0; i < concerts.length; i++) {
      var momentDate = moment(concerts[i].datetime).format("MM/DD/YYYY");
      var text= "Venue: " + concerts[i].venue.name + "\nLocation: " + concerts[i].venue.city + "\nDate: " + momentDate + "\n___________________\n"
      // prints response to console
      console.log(text);
      // Takes Response and logs to log.txt file
      fs.appendFile("log.txt", text, function(err) {
        if (err) {
          return console.log(err);
        }
      });
    }
  })
    .catch(function (error) {
      console.log(error);
    });
}

// Spotify API function
function spotifySong() {
  if (content) {
    spotify.search({ type: 'track', query: content }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      results = data.tracks.items
      var text = "Artist: " + results[0].artists[0].name + "\nSong: " + results[0].name + "\nPreview: " + results[0].preview_url + "\nAlbum: " + results[0].album.name + "\n___________________\n"
      // Prints response to console
      console.log(text);
      // Takes response and logs to log.txt
      fs.appendFile("log.txt", text, function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });
  } else {
    spotify.search({ type: 'track', query: "ace of base the sign" }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      results = data.tracks.items
      var text = "Artist: " + results[0].artists[0].name + "\nSong: " + results[0].name + "\nPreview: " + results[0].preview_url + "\nAlbum: " + results[0].album.name + "\n___________________\n"
      console.log(text);
      fs.appendFile("log.txt", text, function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });
  }
}

// OMBD API function
function movieThis() {
  if (content) {
    axios.get("http://www.omdbapi.com/?t=" + content + "&y=&plot=short&apikey=" + omdb).then(
      function (response) {
        var movie = response.data;
        var text = "Title: " + movie.Title + "\nYear: " + movie.Year + "\nImdb Rating: " + movie.imdbRating + "\nRotten Tomatoes Rating: " + movie.Ratings[1] + "\nCountry: " +
        movie.Country + "\nLanguage: " + movie.Language + "\nPlot: " + movie.plot + "\nActors: " + movie.Actors + "\n___________________\n"
        // Prints response to console
        console.log(text)
        // Logs Response to log.txt file
          fs.appendFile("log.txt", text, function(err) {
            if (err) {
              return console.log(err);
            }
          });
      });
  } else {
    axios.get("http://www.omdbapi.com/?t=" + "Mr. Nobody" + "&y=&plot=short&apikey=" + omdb).then(
      function (response) {
        var movie = response.data;
        var text = "Title: " + movie.Title + "\nYear: " + movie.Year + "\nImdb Rating: " + movie.imdbRating + "\nRotten Tomatoes Rating: " + movie.Ratings[1] + "\nCountry: " +
        movie.Country + "\nLanguage: " + movie.Language + "\nPlot: " + movie.plot + "\nActors: " + movie.Actors + "\n___________________\n"
        console.log(text)
          fs.appendFile("log.txt", text, function(err) {
            if (err) {
              return console.log(err);
            }
          });
      });
  }
}

// Function that reads random.txt and decides which operation function to run
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    content = dataArr[1]
    operation = dataArr[0]
    if (operation === "spotify-this-song") {
      spotifySong();
    }
    else if (operation === "concert-this") {
      bandsInTown();
    }
    else if (operation === "movie-this") {
      movieThis();
    }
  });

}
