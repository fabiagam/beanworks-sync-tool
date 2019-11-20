"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const db = require("./config/database");
//const routes = require("./config/routes");
const graphqlHTTP = require("express-graphql");
const schema = require("./graphql/bookSchemas");

const {
  importInvoices,
  importOrganisationAccountingData
} = require("./app/api/graph");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// prevents cors headaches when the react app calls your api
app.use(cors());
app.use(helmet());
app.use(compression());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.get("api/syncOrganisation", importOrganisationAccountingData);

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

let sess = {
  secret: "LoxodontaE#:lephasMammuthusPalaeo@loxodo_nPrimelephas",
  cookie: { secure: true },
  resave: false,
  saveUninitialized: false
};
app.use(session(sess));
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = false; // serve secure cookies
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  "/graphql",
  cors(),
  graphqlHTTP({
    schema: schema,
    rootValue: global,
    graphiql: true
  })
);
//routes(app);
// ensures the proxy we set earlier is pointing to your express api
const port = process.env.PORT || process.env.APP_PORT;
app.listen(port, () => {
  console.log(` Beanworks Sync Tool API listening on port ${port}`);
});

module.exports = app;
