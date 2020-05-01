const express = require("express");
var users = express.Router();
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
var services = require("./services");
const cors = require("cors");
users.use(cors());
var User = require("../../models/User");
users.use(bodyParser.urlencoded({ extended: true }));

const cleanUserObjectBeforResponse = (user) => {
  return {
    _id: user._id,
    ...user.users,
    email: user.users.email || "",
    firstName: user.users.firstName || "",
    lastNamae: user.users.lastNamae || "",
    tel: user.users.tel || "",
    location: user.users.location || "",
    gender: user.users.gender || "",
    image: user.users.image || "",
    baseJobRole: user.users.baseJobRole || "ENTREPRENEUR",
    socialLinks: user.users.socialLinks || [
      { facebook: "" },
      { linkedIn: "" },
      { twitter: "" },
    ],
  };
};

addUser = async (req, res, next) => {
  try {
    const {
      email,
      lastName,
      firstName,
      tel,
      gender,
      baseJobRole,
      location,
      image,
      socialLinks,
    } = req.body;
    const foundUser = await User.findOne({ "users.email": email });
    if (foundUser) {
      return res
        .status(403)
        .json({ success: false, message: "User already exist" });
    }

    const newUser = new User({
      method: "users",
      users: {
        email,
        lastName,
        firstName,
        tel,
        gender,
        location,
        image,
        baseJobRole,
        socialLinks,
      },
    });

    const _newUser = await newUser.save();
    res.status(200).json({
      success: true,
      data: cleanUserObjectBeforResponse(_newUser),
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

users.get("/", (req, res, user) => {
  User.find({ method: "users" }, { users: 1 })
    .lean()
    .then((user) => {
      if (user) {
        res.json({
          success: true,
          data: user.map((u) => {
            return cleanUserObjectBeforResponse(u);
          }),
          // data: user
        });
      } else {
        res.json({
          success: false,
          message: "User does not exist",
        });
      }
    })
    .catch((err) => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

getUserbyId = async (req, res, next) => {
  const id = req.params.id;
  await User.findById(id)
    .lean()
    .then((user) => {
      res.json({
        success: true,
        data: cleanUserObjectBeforResponse(user),
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: err.message,
      });
    });
};

users.delete("/:id", function (req, res) {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "user deleted successfully!",
    });
  });
});

users.put("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).lean();
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "No user found",
      });
    }

    let updatedUser = { ...user };
    updatedUser.users = { ...user.users, ...req.body };

    User.findByIdAndUpdate(id, updatedUser, { new: true }, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
      res.status(200).json({
        success: true,
        data: cleanUserObjectBeforResponse(user),
      });
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
});

// users.get("/", getUsers);
users.post("/", addUser);
users.get("/:id", getUserbyId);

module.exports = users;
