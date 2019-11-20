/***
 * Home Controller
 * @file: app/controllers/home.js
 * @author: James Abiagam
 */
"use  strict";
require("dotenv").config();
const { getXeroClient } = require("../../vendor/XeroService");
const Organisation = require("../models/Organisation");
const Vendor = require("../models/Vendor");
const Account = require("../models/Account");
const Date = require("../middleware/DateHelper");

const index = (req, res, next) => {
  res.render("../views/landing", {});
};

const Authorize = async (req, res, next) => {
  console.log("All ression" + JSON.stringify(req.session));
  let xeroClient = getXeroClient();
  let OrganisationSynced = await xeroClient.organisations.get(); // Sync Organisation data
  //console.log("Organisation:" + JSON.stringify(OrganisationSynced));
  let OrgId = OrganisationSynced.Organisations[0].OrganisationID;
  Organisation.getById(OrgId)
    .then(doc => {
      console.log(`fetched Organisation - ${doc} `);
      if (!doc) {
        // Null meaning no existing synced records for this Organisation
        Organisation.saveProfile(OrganisationSynced.Organisations[0])
          .then(d => {
            // Fetch and sync Vendors from Xero Contacts
            let condition = { isSupplier: true };
            xeroClient.contacts
              .get(condition)
              .then(vendor => {
                //console.log("All Vendors" + JSON.stringify(vendor.Contacts));
                console.log("Total Vendors - " + vendor.Contacts.length);
                // Save Vendor Records to Local Database
                Vendor.create(OrgId, vendor.Contacts)
                  .then(v => {
                    // Fetch Accounts and sync to Local DB
                    xeroClient.accounts
                      .get()
                      .then(acc => {
                        console.log("Total Accounts - " + acc.Accounts.length);
                        // Saving Accounts
                        Account.create(OrgId, acc.Accounts)
                          .then(a => {
                            res.render("../views/connected", {
                              doc: OrganisationSynced.Organisations[0]
                            });
                          })
                          .catch(err => {
                            console.log(err);
                          });
                      })
                      .catch(e => {
                        console.log(e);
                      });
                  })
                  .catch(_e => {
                    console.log(_e);
                  });
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        console.log(`fetched Organisation - ${doc} `);
        // Organisation records exists
        res.render("../views/connected", { doc: doc });
      }
    })
    .catch(e => {
      console.log(e);
    });
};

const connected = (req, res, next) => {
  console.log("All ression" + JSON.stringify(req.session));

  res.render("../views/connected", {});
};

module.exports = {
  index,
  connected,
  Authorize
};
