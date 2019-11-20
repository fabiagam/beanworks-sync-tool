/***
 * Vendor Model
 * @file: models/Vendor.js
 * @author: Ndidi James Abiagam
 */
"use strict";
const mongoose = require("mongoose");
let Schema = mongoose.Schema; //Define a schema
const Date = require("../middleware/DateHelper");

const VendorSchema = new Schema({
  OrganisationID: String,
  ContactID: String,
  Name: String,
  Status: String,
  FirstName: String,
  LastName: String,
  EmailAddress: String,
  IsSupplier: Boolean,
  SyncStatus: String,
  UpdatedDateUTC: String,
  SyncDate: String,
  SyncToolTimestamp: Number
});

VendorSchema.statics.getLastSyncTimestamp = async () => {
  return await Vendor.findOne(where).select();
};

VendorSchema.statics.getAllVendorIds = async orgId => {
  let where = { OrganisationID: orgId };
  return await Vendor.find(where).select({ ContactID: 1 });
};

VendorSchema.statics.create = async (OrgId, docs) => {
  let timestamp = Date.getCurrentTimestamp();
  let schema = {};
  docs.map(doc => {
    schema.OrganisationID = OrgId;
    schema.ContactID = doc.ContactID;
    schema.Name = doc.Name;
    schema.Status = doc.ContactStatus;
    schema.FirstName = doc.hasOwnProperty("FirstName") ? doc.FirstName : "None";
    schema.LastName = doc.hasOwnProperty("LastName") ? doc.LastName : "None";
    schema.EmailAddress = doc.hasOwnProperty("EmailAddress")
      ? doc.EmailAddress
      : "None";
    schema.IsSupplier = doc.IsSupplier;
    schema.SyncStatus = "completed";
    schema.UpdatedDateUTC = doc.UpdatedDateUTC;
    schema.SyncDate = Date.setCoreDate(timestamp);
    schema.SyncToolTimestamp = Number(timestamp);
    // Save entry
    let Vend = new Vendor(schema);
    return Vend.save()
      .then(d => {})
      .catch(e => {
        console.log(e);
      });
  });
};

let Vendor = mongoose.model("vendors", VendorSchema);
module.exports = Vendor;
