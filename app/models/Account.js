/***
 * Account Model
 * @file: models/Account.js
 * @author: Ndidi James Abiagam
 */
"use strict";
const mongoose = require("mongoose");
let Schema = mongoose.Schema; //Define a schema
const Date = require("../middleware/DateHelper");
//let Schema = mongoose.Schema; //Define a schema

const AccountSchema = new Schema({
  OrganisationID: String,
  AccountID: String,
  Name: String,
  Status: String,
  Type: String,
  BankAccountNumber: String,
  BankAccountType: String,
  CurrencyCode: String,
  UpdatedDateUTC: String,
  SyncDate: String,
  SyncToolTimestamp: Number
});

AccountSchema.statics.getLastSyncTimestamp = async () => {
  return await Account.findOne(where);
};
AccountSchema.statics.getTotalRecords = async () => {
  return await Account.find();
};

AccountSchema.statics.create = async (OrgId, docs) => {
  let timestamp = Date.getCurrentTimestamp();
  let schema = {};
  docs.map(doc => {
    schema.OrganisationID = OrgId;
    schema.AccountID = doc.AccountID;
    schema.Name = doc.Name;
    schema.Status = doc.Status;
    schema.Type = doc.Type;
    schema.BankAccountNumber = doc.BankAccountNumber;
    schema.BankAccountType = doc.BankAccountType;
    schema.CurrencyCode = doc.CurrencyCode;
    schema.UpdatedDateUTC = doc.UpdatedDateUTC;
    schema.SyncDate = Date.setCoreDate(timestamp);
    schema.SyncToolTimestamp = Number(timestamp);
    // Save entry
    let Acc = new Account(schema);
    return Acc.save()
      .then(d => {})
      .catch(e => {
        console.log(e);
      });
  });
};

let Account = mongoose.model("accounts", AccountSchema);
module.exports = Account;
