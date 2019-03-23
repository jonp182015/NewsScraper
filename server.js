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

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsReport", { useNewUrlParser: true });

// Import routes and give the server access to them.
var routes = require("./controllers/news_controllers.js");
app.use(routes);

// Set the app to listen on port 3000
app.listen(3003, function () {
    console.log("App running on port 3003!");
});
