"use strict";

const GraphQLSchema = require("graphql").GraphQLSchema;
const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLID = require("graphql").GraphQLID;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLInt = require("graphql").GraphQLInt;
const GraphQLDate = require("graphql-date");
const SyncActivity = require("../app/models/SyncActivity");

const syncType = new GraphQLObjectType({
  name: "syncActivity",
  fields: function() {
    return {
      _id: {
        type: GraphQLString
      },
      OrganisationID: {
        type: GraphQLString
      },
      Status: {
        type: GraphQLString
      },
      Type: {
        type: GraphQLString
      },
      Logs: {
        type: GraphQLObjectType
      },
      Author: {
        type: GraphQLString
      },
      SyncDate: {
        type: GraphQLString
      },
      SyncToolTimestamp: {
        type: GraphQLInt
      }
    };
  }
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: function() {
    return {
      activities: {
        type: new GraphQLList(syncType),
        resolve: function() {
          const logs = SyncActivity.find().exec();
          if (!logs) {
            throw new Error("Error");
          }
          return logs;
        }
      },
      activity: {
        type: syncType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString
          }
        },
        resolve: function(root, params) {
          const logDetails = SyncActivity.findById(params.id).exec();
          if (!logDetails) {
            throw new Error("Error");
          }
          return logDetails;
        }
      }
    };
  }
});

module.exports = new GraphQLSchema({ query: queryType });
