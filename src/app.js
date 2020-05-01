const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const nconf = require("nconf");
const mongoose = require("mongoose");
const passport = require("passport");
const bluebird = require("bluebird");
const passportJwt = passport.authenticate("jwt", { session: false });
var cors = require("cors");
var validationUser = require("./middlewares/validationUser");
// const requestId = require("../../resources");
const fs = require("fs-extra");

require("./middlewares/requestId");
require("./middlewares/errorHandler");
// Middlewares
// const cors = require("./middlewares/cors");
const responseNormalizer = require("./middlewares/responseNormalizer");
const passportStrat = require("./middlewares/passport");

// Mongoose configuration
mongoose.Promise = bluebird;
mongoose.set("debug", false);
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// mongoose.set("useNewUrlParser", true);
// mongoose.set("useFindOneAndDelete", true);
// mongoose.set("useFindOneAndRemove", true);
// mongoose.set("useFindOneAndUpdate", true);

// mongoose.set("useCreateIndex", true);
// mongoose.set("useFindAndModify", true);
// console.log(
//   ' nconf.get("database: dev: url")   #######  ',
//   nconf.get("database:dev:url")
// );

mongoose.connect(nconf.get("database:dev:url"));
// mongoose.connect(nconf.get("database:dev:url"), {
//   useNewUrlParser: true
// });

mongoose.connect(nconf.get("database:dev:url"));

mongoose.connection.once("connected", () =>
  console.log("Successfully connected to the database")
);
mongoose.connection.once("error", (err) =>
  console.log("error connected to the database ", err)
);

const Users = require("./routes/users");
const Auth = require("./routes/auth");

// Creates and configures an ExpressJS web server.
const app = express();
try {
  const dir0 = `../resources/`;
  if (!fs.existsSync(dir0)) fs.mkdir(dir0);
} catch (error) {
  console.log("create folders ### ", error.message);
}

app.use(bodyParser.json());

app.use(bodyParser.text());
// app.use(bodyParser.raw({ type: "*/*" }));
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use("/users", passportJwt, Users);
app.use("/Auth", Auth);
// app.use("/startup_images", express.static("../."));
app.use(passport.initialize());

app.use(responseNormalizer);

app.use("/images", express.static("../resources/"));
module.exports = app;
