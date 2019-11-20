"use strict";
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

console.log(`env : ${process.env.NODE_ENV}`);

switch (process.env.NODE_ENV) {
  case "production":
    const opts = {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      auth: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      }
    };
    mongoose.connect(process.env.DB_HOST, opts);

    break;
  case "development":
    mongoose.connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    break;
}

var db = mongoose.connection;

db.on("error", error => {
  console.error(error);
});

db.once("open", () => {
  console.log("Beanworks Sync Database connection is now open!");
});

module.exports = db;
