/***
 * SyncActivity  Model
 * @file: models/SyncActivity.js
 * @author: Ndidi James Abiagam
 */
"use strict";
import mongoose, { Schema } from "mongoose";

const SyncSchema = new Schema({
  OrganisationID: String,
  Status: String,
  Type: String,
  Logs: Array,
  Author: String,
  SyncDate: String,
  SyncToolTimestamp: Number
});

SyncSchema.statics.getLastSyncTimestamp = async orgId => {
  return await SyncActivity.findOne({ OrganisationID: orgId }).select({
    SyncToolTimestamp: 1
  });
};
SyncSchema.statics.saveRecords = async (OrgId, docs) => {
  let schema = {};
  docs.map(doc => {
    let schema = Object.assign({}, doc);
    schema.OrganisationID = OrgId;
    // Save entry
    let Sn = new SyncActivity(schema);
    return Sn.save()
      .then(d => {})
      .catch(e => {
        console.log(e);
      });
  });
};

let SyncActivity = mongoose.model("sync_activities", SyncSchema);
export default SyncActivity;
