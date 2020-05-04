const mongoose = require("mongoose");
const classesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentNumber: { type: Number, required: false },
  presentStudentNumber: { type: Number, required: false },
  employeeNumber: { type: Number, required: false },
  presentEmployeeNumber: { type: Number, required: false },
  school: { type: Schema.Types.ObjectId, required: true, ref: "api/school" },
  student: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "api/student",
  },
  staff: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "api/employees",
  },
});

module.exports = mongoose.model("classes", classesSchema);
