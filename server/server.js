require("dotenv").config();

const express = require("express");
const server = express();
const port = process.env.PORT;
const router = require("./router/routes");

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const passport = require("./passport/passport");

const cors = require("cors");

server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(
  session({
    store: new pgSession({}),
  }),
);

server.use(passport.initialize());
server.use(passport.session());

server.use("/", router);

function ifError(error) {
  if (error) {
    return console.log("big server whomp :(");
  }
  console.log("no server whomp!");
}
server.listen(port, ifError);
