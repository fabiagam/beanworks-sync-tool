/***
 * Graph API  Controller
 * @file: app/api/graph.js
 * @author: James Abiagam
 */
"use  strict";
require("dotenv").config();
const { getXeroClient } = require("../../vendor/XeroService");
const Organisation = require("../models/Organisation");
const Vendor = require("../models/Vendor");
const Account = require("../models/Account");
const Invoice =  require("../models/Invoice");
const SyncActivity = require("../models/SyncActivity");
const Date = require("../middleware/DateHelper");

const importOrganisationAccountingData = async (req, res) => {
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
                            return res.status(200).send({
                              data: OrganisationSynced.Organisations[0]
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
        return res.status(200).send({ data: doc });
      }
    })
    .catch(e => {
      console.log(e);
    });
};

const importInvoices = async (req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");

  let OrgID = req.query.accountID;
  console.log(`OrganisationID - ${OrgID}`);
  // Fetch all ContactIDs from Vendor Model
  Vendor.getAllVendorIds(OrgID)
    .then(v => {
      let ContactIds = sortVendorIds(v);
      let condition = {'ContactIDs':ContactIds};
      // Make Xero API request with all ContactsID to get corresponding Invoices
          await xeroClient.invoices.get(condition).then(inv =>{
                        // Sync Invoice data
          console.log("List of Invoices:" + JSON.stringify(inv));
                Invoice.saveRecord(inv.Invoices).then(j =>{
                // Sort results based on proposed Algorithms on offer to build final import Object
                 let allLogs = syncManagerAlgorigthm(inv.Invoices);
                  // Add to Database (Sync Activities Collection)
                  SyncActivity.saveRecords(allLogs).then(f=>{
                          // Fetch and return all synced objects back to client
                            return res.status(200).send({ data:allLogs});
                  }).catch(err=>{console.log(err)});
                }).catch(er=>{console.log(er)});
         
          }).catch(e =>{ console.log(e)}) 
    })
    .catch(e => {
      console.log(e);
    });
  

};

const sortVendorIds = docs => {
  let result = [];
  docs.map(d => {
    result.push(d.ContactID);
  });
  return result;
};

const syncManagerAlgorigthm = docs =>{
 
     syncStack = [];
     if(docs){
     docs.map(doc  =>{
        let t = Date.getCurrentTimestamp();
          schema = {};
          schema.Status = '';
          schema.Type = '';
          schema.Author = 'Michael Scott';
          schema.SyncDate = Date.setPacificDate(t);
          schema.SyncToolTimestamp = Number(t);
          let _log = syncComments(doc);
          schema.Logs = _log.logs;
          if(_log.success >= 3){
                schema.Status = ' Full Sync';
                schema.Type = '<i  className="fa fa-check full-sync" aria-hidden="true"></i>';
          }else{
                schema.Status = ' Partial Sync';
                schema.Type = '<i className="fa fa-times partial-sync" aria-hidden="true"></i>';
          }
         syncStack.push(schema); 
     });
     }
     return syncStack;
};

const syncComments = doc =>{
  let logs = [];
  let success = 0;
  let failed = 0;
    
    let now = Date.getCurrentTimestamp();
  let msg = 'Starting import on '+ Date.setSyncDate(now);
       let obj = {};
       obj.syncToolTimestamp = new Date();
       obj.operation = 'SyncFromErp';
       obj.state =  'Start';
       obj.item = 'VendorRecord';
       obj.log = msg;
         logs.push(obj);
     if((doc.Status === 'AUTHORISED') && (doc.Status === 'PAID')){
             let l = Date.getCurrentTimestamp();
             let ss = 'Starting to export on '+  Date.setSyncDate(l);
             let ob = {};
            ob.syncToolTimestamp = new Date();
            ob.operation = 'SyncFromErp';
            ob.state =  'Start';
            ob.item = 'VendorRecord';
            ob.log = ss;
            logs.push(ob);
            success++;
     }else if((doc.Status === 'DRAFT') && (doc.Status === 'SUBMITTED')){
              let c = Date.getCurrentTimestamp();
             let dd = 'Starting to export on '+  Date.setSyncDate(c);
             let ab = {};
            ab.syncToolTimestamp = new Date();
            ab.operation = 'SyncFromErp';
            ab.state =  'Start';
            ab.item = 'VendorRecord';
            ab.log = dd;
            logs.push(ab);
            success++;
     }else if(doc.HasAttachments){
            let dt = Date.getCurrentTimestamp();
             let dmsg = 'Received 1 files  on '+  Date.setSyncDate(dt);
             let odt = {};
            odt.syncToolTimestamp = new Date();
            odt.operation = 'SyncFromErp';
            odt.state =  'Start';
            odt.item = 'VendorRecord';
            odt.log = dmsg;
            logs.push(odt);
            success++;
     }else if((doc.Type === 'ACCREC') && (doc.Type === 'ACCPAY')){
              let m = Date.getCurrentTimestamp();
             let cm = 'Starting to export on '+  Date.setSyncDate(m);
             let w = {};
            w.syncToolTimestamp = new Date();
            w.operation = 'SyncFromErp';
            w.state =  'Start';
            w.item = 'VendorRecord';
            w.log = cm;
            logs.push(w);
            success++;
     }else if(doc.AmountDue > 0){
               let p = Date.getCurrentTimestamp();
             let pmsg = 'Received 1 files  on '+  Date.setSyncDate(p);
             let f = {};
            f.syncToolTimestamp = new Date();
            f.operation = 'SyncFromErp';
            f.state =  'Start';
            f.item = 'VendorRecord';
            f.log = pmsg;
            logs.push(f);  
            success++;
     }
             let z = Date.getCurrentTimestamp();
             let mesg = 'Finished export on '+  Date.setSyncDate(z);
             let ebj = {};
            ebj.syncToolTimestamp = new Date();
            ebj.operation = 'SyncFromErp';
            ebj.state =  'End';
            ebj.item = 'Vendor';
            ebj.successfulRecords = Number(success);
            ebj.failedRecords = Number( 5 - success);
            ebj.totalRecords = 5;
            ebj.log = mesg;
            logs.push(ebj);
     
      return {logs:logs,success:ebj.successfulRecords,failed:ebj.failedRecords};
      
};

module.exports = { importInvoices, importOrganisationAccountingData };
