var express = require("express");

var router = express.Router();

// Parse request body as JSON
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Import the model (news.js) to use its database functions.
var News = require("../model/news.js");


router.get("/", function (req, res) {
    res.send("Hola mundo");
});

router.post("/submit", function (req, res) {
    // Save a new Example using the data object
    console.log('logging req.body');
    console.log(req.body);

    var news = new News(req.body);
    //Applying custom methods
    news.coolifier();
    news.makeCool();

    News.create(news)
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


// Export routes for server.js to use.
module.exports = router;