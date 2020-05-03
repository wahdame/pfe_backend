const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const {
  registerValidation,
  loginValidation,
} = require("../../middlewares/validateBody");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  // VALIDATE THE USER DATA FIRST
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // If the user is already in the database
  const emailExists = await User.findOne({
    email: req.body.email,
  });
  if (emailExists) return res.status(400).send("Email already registered!");

  // HASH THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  console.log(hashedPassword);
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ success: true, data: { user, token } });
  } catch (err) {
    res.status(400).send(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // VALIDATE THE USER DATA FIRST
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the user is already in the database
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).send("Email not registered!");
  // If Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password!");

  // create and  assing TOKENS
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.send({ success: true, data: { user, token } });
});
module.exports = router;
