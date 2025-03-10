const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PartyListSchema = new Schema(
  {
    PId: {
      type: Number, 
      required: true, 
      unique: true, 
    },
    PartyLogoUrl: {
      type: String, 
      required: false, 
    },
    Title: {
      type: String,
      required: false, 
      maxlength: 150, 
    },
    Description: {
      type: String,
      required: false, 
      maxlength: 600, 
    },
    PartyColor: {
      type: String,
      required: false, 
      maxlength: 10, 
    },
  },
  {
    timestamps: true, 
  }
);

const PartyList = mongoose.model("PartyList", PartyListSchema);

module.exports = PartyList;
