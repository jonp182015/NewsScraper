// Require mongoose
var mongoose = require("mongoose");

// Get a reference to the mongoose Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ExampleSchema object
// This is similar to a Sequelize model
var NewsSchema = new Schema({
    // `string` must be of type String. We "trim" it to remove any trailing white space
    // `string` is a required field, and a custom error message is thrown if it is not supplied

    headline: {
        type: String,
        trim: true,
        required: "Headline is Required"
    },
    articleText: {
        type: String,
        validate: [
            // Function takes in the new `longstring` value to be saved as an argument
            function (input) {
                // If this returns true, proceed. If not, return the error message below
                return input.length >= 6;
            },
            // Error Message
            "Longstring should be longer."
        ]
    },
    link: {
        type: String,
        trim: true,
        required: "Link is Required"
    },
    imgURL: {
        type: String,
        trim: true,
        //required: "imgURL Required"
    },
    read: false,
    dateCreated: {
        type: Date,
        default: Date.now
    },
});

// Custom Instance Methods

// Custom method `coolifier`
NewsSchema.methods.coolifier = function () {
    // Adds "...theCoolest" to the end of the current user's username
    this.headline = this.headline + "...this is the best place to go!";
    // Return the new username
    return this.headline;
};

// Custom method `makeCool`
NewsSchema.methods.makeCool = function () {
    // Make the "isCool" property of the current user equal to the boolean "true"
    this.read = true;
    // Return the new boolean value
    return this.read;
};

// This creates our model from the above schema, using mongoose's model method
var News = mongoose.model("news", NewsSchema);

// Export the Example model
module.exports = News;
