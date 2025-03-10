const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userBannerSchema = new Schema({
  BannerCode: {
    type: Number,
    required: false,
  },
  UserId: {
    type: String,
    // ref: "UserMaster",
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
    maxlength: 400,
  },
});

const UserBanner = mongoose.model("UserBanner", userBannerSchema);

module.exports = UserBanner;
