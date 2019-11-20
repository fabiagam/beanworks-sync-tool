"use strict";

const {
  importInvoices,
  importOrganisationAccountingData
} = require("../app/api/graph");

module.exports = app => {
  // GraphQL Server API routes
  app.get("api/syncOrganisation", importOrganisationAccountingData);
  app.get("/api/invoices", importInvoices);
};
