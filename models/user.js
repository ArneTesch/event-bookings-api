const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // Store ID's > Elements will simply be ID's
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      // Connect to Event Model > Connection between Event and User > ObjectId's from Event model
      ref: "Event"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
