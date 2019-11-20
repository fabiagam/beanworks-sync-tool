/***
 * Xero SDK Service
 * @file: vendor/XeroService.js
 * @author: James Abiagam
 */
"use  strict";
require("dotenv").config();
const XeroClient = require("xero-node").AccountingAPIClient;
const path = require("path");

const getXeroClient = () => {
  let config = {};
  let PEM_FILE_PATH = path.resolve(__dirname, "../privatekey.pem");
  console.log(`Private Key pem file: ${PEM_FILE_PATH}`);
  try {
    config = require("../config/xero-config.json");
  } catch (ex) {
    if (process && process.env && process.env.APPTYPE) {
      //no config file found, so check the process.env.
      config.appType = process.env.APPTYPE.toLowerCase();
      // config.callbackUrl = process.env.CALLBACK_URL;
      config.consumerKey = process.env.CONSUMER_KEY;
      config.consumerSecret = process.env.CONSUMER_SECRET;
      config.privateKeyPath = PEM_FILE_PATH;
    } else {
      throw "Config not found";
    }
  }

  return new XeroClient(config);
};

module.exports = { getXeroClient };
