const mongoose = require("mongoose");
const staffSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, required: true },
  name: { type: String, required: true },
  lastName: { type: String, required: false },
  address: { type: String, required: false },
  secondAddress: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  secondPhoneNumber: { type: String, required: false },
  birthDay: { type: Date, required: false },
  startDate: { type: Date, required: false },
  hiringDate: { type: Date, required: false },
  certificate: { type: String },
  schoolLevel: { type: String },
  particularSituation: { type: String },
  experience: { type: String },
  handicap: { type: String },
  note: { type: String },
  school: { type: Schema.Types.ObjectId, ref: "api/school" },
  class: { type: [Schema.Types.ObjectId], default: [], ref: "api/classes" },
  accessAdmin: { type: Boolean },
  picture: { type: [String] },
});

module.exports = mongoose.model("staff", staffSchema);
