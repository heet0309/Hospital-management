const mongoose = require("mongoose");

// usl for connect database
const mongoURI =
  "mongodb+srv://heet:heet@cluster0.9xj9lrw.mongodb.net/Booking?retryWrites=true&w=majority";

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongo Successfully");
  });
};

module.exports = connectToMongo;
