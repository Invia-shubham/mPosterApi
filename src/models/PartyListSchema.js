const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PartyListSchema = new Schema(
  {
    PId: {
      type: Number, // Assuming PId is an integer like in SQL
      required: true, // If PId is required
      unique: true, // If PId is unique
    },
    PartyLogoUrl: {
      type: String, // The PartyLogoUrl would be a URL string
      required: false, // Assuming it's optional
    },
    Title: {
      type: String,
      required: false, // Assuming it's optional, but you can make it required if needed
      maxlength: 150, // The max length is 150 as per your SQL definition
    },
    Description: {
      type: String,
      required: false, // Assuming it's optional, but you can make it required if needed
      maxlength: 600, // Max length of 600 for Description
    },
    PartyColor: {
      type: String,
      required: false, // Assuming it's optional
      maxlength: 10, // Max length of 10 for PartyColor
    },
  },
  {
    timestamps: true, // Optionally add timestamps for createdAt and updatedAt
  }
);

const PartyList = mongoose.model("PartyList", PartyListSchema);

module.exports = PartyList;
