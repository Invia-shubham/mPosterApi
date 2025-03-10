const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the UserBanner schema
const userBannerSchema = new Schema({
  BannerCode: {
    type: Number, // int type in SQL is mapped to Number in MongoDB
    required: false, // It's marked as nullable, so it can be optional
  },
  UserId: {
    type: Number, // int type in SQL is mapped to Number in MongoDB
    required: false, // It's marked as nullable, so it can be optional
  },
  Title: {
    type: String, // nvarchar type in SQL is mapped to String in MongoDB
    required: false, // It's nullable in SQL, so it's optional here
    maxlength: 150, // Limit the length to 150 characters
  },
  Description: {
    type: String, // nvarchar type in SQL is mapped to String in MongoDB
    required: false, // It's nullable in SQL, so it's optional here
    maxlength: 400, // Limit the length to 400 characters
  },
});

// Create a model from the schema
const UserBanner = mongoose.model("UserBanner", userBannerSchema);

// Export the model
module.exports = UserBanner;
