const mongoose = require("mongoose");
const schoolSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, required: true },
  name: { type: String, required: true },
  childcareProvider: { type: String, required: false },
  address: { type: String, required: true },
  secondAddress: { type: String, required: false },
  city: { type: String, required: false },
  province: { type: String, required: false },
  country: { type: String, required: false },
  addressWeb: { type: String, required: false },
  studentNumber: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  coordinatingOffice: { type: String, required: false },
  secondPhoneNumber: { type: String, required: false },
  zipCode: { type: String, required: false },
  userId: { type: [Schema.Types.ObjectId], ref: "api/users" },
  workingDays: { type: [String] },
});

module.exports = mongoose.model("school", schoolSchema);
