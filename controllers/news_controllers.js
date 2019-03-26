var express = require("express");
var path = require("path");

var path = require("path");

// Routes
// =============================================================
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var router = express.Router();

// Parse request body as JSON
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Import the model (news.js) to use its database functions.
var db = require("../model/index.js");

// Route that takes you to the homepage
router.get("/"), function(req, res){
    res.sendFile(path.join(__dirname, "../public/index.html"));
}
// A GET route for scraping the CNN website
router.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.cnn.com/world").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every 'text and link' whose parent tag has a class of '.cd__headline', and do the following:
        $(".cd__headline").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.headline = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");
            //imgURL = $(this).children("a").attr("href");

            // Create a new Article using the `result` object built from scraping
            db.News.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        // Send a message to the client
        //res.send("Scrape Complete");
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });
});

// Clear the DB
router.get("/clearAll", function (req, res) {
    // Remove every note from the notes collection
    db.News.remove({}, function (error, response) {
        // Log any errors to the console
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            // Otherwise, send the mongojs response to the browser
            // This will fire off the success function of the ajax request
            console.log(response);
            //res.send(response);
            res.sendFile(path.join(__dirname, "../public/index.html"));
        }
    });
});

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.News.find({})
        .then(function (dbNews) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbNews);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for retrieving all Notes from the db
router.get("/notes", function (req, res) {
    // Find all Notes
    db.Note.find({})
        .then(function (dbNote) {
            // If all Notes are successfully found, send them back to the client
            res.json(dbNote);
        })
        .catch(function (err) {
            // If an error occurs, send the error back to the client
            res.json(err);
        });
});

// Route for retrieving all Populated Articles from the db
router.get("/populatedArticle", function (req, res) {
    //find all articles
    db.News.find({})
        // Specify that we want to populate the retrieved article with any associated note
        .populate("note")
        .then(function (dbArticle) {
            // If able to successfully find and associate all Articles and Notes, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            //If an error occurs, send it back to the client
            res.json(err);
        })
})

// Route for saving a new Note to the db and associating it with a User
router.post("/submit", function (req, res) {
    // Create a new Note in the db
    db.Note.create(req.body)
        .then(function (dbNote) {
            res.json(dbNote);
            // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query

            /*
            return db.News.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
            return db.News.update({""}, { $push: { notes: dbNote._id } }, { new: true });
            db.places.update({"country": "Morocco"}, {$set: {"continent": "Antarctica"}})
            */
        })
        //.then(function (dbUser) {
            // If the User was updated successfully, send it back to the client
            //res.json(dbUser);
        //})
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});

/*
router.post("/submit", function (req, res) {
    // Save a new Example using the data object
    console.log('logging req.body');
    console.log(req.body);

    var news = new News(req.body);
    //Applying custom methods
    news.coolifier();
    news.makeCool();

    db.News.create(news)
        .then(function (data) {
            // If saved successfully, print the 'data' to the console
            console.log('logging data');
            console.log(data);
            res.json(data);
        })
        .catch(function (err) {
            // If an error occurs, log the error message
            console.log(err.message);
        });

});
*/


// Export routes for server.js to use.
module.exports = router;