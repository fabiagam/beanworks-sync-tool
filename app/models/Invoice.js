/***
 * Invoice Model
 * @file: models/Invoice.js
 * @author: Ndidi James Abiagam
 */
"use strict";
import mongoose, { Schema } from "mongoose";

const InvoiceSchema = new Schema(
  {
    OrganisationID: String,
    ContactID: String,
    Name: String,
    Status: String,
    Reference: String,
    InvoiceID: String,
    InvoiceNumber: String,
    LineItems: Array,
    SubTotal: String,
    TotalTax: String,
    Total: String,
    CurrencyCode: String,
    AmountDue: String,
    AmountPaid: String,
    AmountCredited: String,
    Date: String,
    DateString: String,
    DueDate: String,
    DueDatString: String,
    UpdatedDateUTC: String,
    SyncDate: String,
    SyncToolTimestamp: Number
  },
  { typeKey: "$type" }
);

InvoiceSchema.statics.getLastSyncTimestamp = async () => {
  return await Invoice.findOne()
    .select({ SyncToolTimestamp: 1 })
    .limit(1);
};
InvoiceSchema.statics.saveRecord = async (OrgId, docs) => {
  let timestamp = Date.getCurrentTimestamp();
  let schema = {};
  docs.map(doc => {
    schema.OrganisationID = OrgId;
    schema.ContactID = doc.Contact.ContactID;
    schema.Name = doc.Contact.Name;
    schema.Reference = doc.Reference;
    schema.Status = doc.Status;
    schema.Type = doc.Type;
    schema.InvoiceID = doc.InvoiceID;
    schema.InvoiceNumber = doc.InvoiceNumber;
    schema.LineItems = doc.LineItems;
    schema.SubTotal = doc.SubTotal;
    schema.TotalTax = doc.TotalTax;
    schema.Total = doc.Total;
    schema.AmountDue = doc.AmountDue;
    schema.AmountPaid = doc.AmountPaid;
    schema.AmountCredited = doc.AmountCredited;
    schema.Date = doc.Date;
    schema.DateString = doc.DateString;
    schema.DueDate = doc.DueDate;
    schema.DueDateString = doc.DueDateString;
    schema.CurrencyCode = doc.CurrencyCode;
    schema.UpdatedDateUTC = doc.UpdatedDateUTC;
    schema.SyncDate = Date.setCoreDate(timestamp);
    schema.SyncToolTimestamp = Number(timestamp);
    // Save entry
    let Inv = new Invoice(schema);
    return Inv.save()
      .then(d => {})
      .catch(e => {
        console.log(e);
      });
  });
};

let Invoice = mongoose.model("invoices", InvoiceSchema);
export default Invoice;
