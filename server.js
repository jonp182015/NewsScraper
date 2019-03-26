//must use: 
//express
//mongoose

//express-handlebars
//cheerio
//anxios

// Dependencies
var mongoose = require("mongoose");
var express = require("express");

// Initialize Express
var app = express();

// Port
var PORT = process.env.PORT || 3003;

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


// Import routes and give the server access to them.
var routes = require("./controllers/news_controllers.js");
app.use(routes);

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
