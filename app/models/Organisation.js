/***
 *organisation Model
 * @file: models/Organisation.js
 * @author: Ndidi James Abiagam
 */
"use strict";
const mongoose = require("mongoose");
let Schema = mongoose.Schema; //Define a schema
const Date = require("../middleware/DateHelper");

const OrganisationSchema = new Schema(
  {
    OrganisationID: String,
    Name: String,
    Status: String,
    CountryCode: String,
    Address: Array,
    SyncDate: String,
    SyncToolTimestamp: Number
  },
  { typeKey: "$type" }
);

OrganisationSchema.statics.getLastSyncTimestamp = async () => {
  return await Organisation.findOne(where).select({
    email: 1,
    firstname: 1,
    phone: 1
  });
};

OrganisationSchema.statics.getById = async OrgId => {
  let where = { OrganisationID: OrgId };
  return await Organisation.findOne(where).select({
    Name: 1,
    Status: 1,
    OrganisationID: 1
  });
};

OrganisationSchema.statics.getTotalRecords = async () => {
  let where = { email: person.email, phone: person.phone };
  return await Organisation.findOne(where).select({
    email: 1,
    firstname: 1,
    phone: 1
  });
};

OrganisationSchema.statics.saveProfile = async doc => {
  let timestamp = Date.getCurrentTimestamp();
  let schema = {};
  schema.OrganisationID = doc.OrganisationID;
  schema.Name = doc.Name;
  schema.Status = doc.OrganisationStatus;
  schema.CountryCode = doc.CountryCode;
  schema.Address = doc.Addresses[0];
  schema.SyncDate = Date.setCoreDate(timestamp);
  schema.SyncToolTimestamp = Number(timestamp);
  // Save entry
  let Org = new Organisation(schema);
  return await Org.save()
    .then(d => {})
    .catch(e => {
      console.log(e);
    });
};

let Organisation = mongoose.model("organisations", OrganisationSchema);
module.exports = Organisation;
