require("dotenv").config();

const express = require("express");
const server = express();
const port = process.env.PORT;

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const routes = require("./router/routes");
const cors = require("cors");

server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
