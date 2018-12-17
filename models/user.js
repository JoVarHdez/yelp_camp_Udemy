var mongoose = require("mongoose");
var passportMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: String,
  avatar: String,
  firstName: String,
  lastName: String,
  email: {type: String, unique: true, required: true},
  isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportMongoose);

module.exports = mongoose.model("User", UserSchema);
