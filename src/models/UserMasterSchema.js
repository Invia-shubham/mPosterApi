const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserMasterSchema = new mongoose.Schema(
  {
    Name: { type: String, maxlength: 200, required: true },
    EmailId: {
      type: String,
      maxlength: 150,
      unique: true,
      required: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    Pwd: {
      type: String,
      maxlength: 100,
      minlength: 6,
      required: true,
    },
    MobileNumber: {
      type: String,
      maxlength: 15,
      required: true,
      match: [/^\d{10,15}$/, "Please enter a valid mobile number"],
    },
    PartyId: { type: Number, required: false },
    role: { type: String, default: "user" }, // user or admin
    profileImage: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

UserMasterSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const UserMaster = mongoose.model("UserMaster", UserMasterSchema);

module.exports = UserMaster;
