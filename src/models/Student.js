const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    min: 6,
  },
  last_name: {
    type: String,
    required: true,
    min: 6,
  },
  sex: { type: String, required: true },
  address: { type: String, required: false },
  dateOfAdmission: { type: Date, required: false },
  dateOfEnd: { type: Date, required: false },
  startDate: { type: Date },
  class: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "api/classes",
  },
  school: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "api/school",
  },
  attendance: {
    type: [Object],
    required: false,
  },
  picture: { type: [String] },
  languages: { type: String, required: false },
  date_of_birth: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("student", studentSchema);
