# beanworks-sync-tool
A user-friendly sync solution app for Beanworks AP Automation Solutions, that imports business accounting data such as (invoices,accounts etc) from Xero ERP Cloud using React, GraphQL, Apollo Client, NodeJS and MongoDB.

# Considerations to Deliverables
## Business Requirements
Having considered the requirements described in the Beanwork  project brief, emphasis was laid on the following key factors:
* 	Seamless Connectivity - The sync solution would be developed to connect with the appropriate application type that was listed by Xero.  In this case the private app option was the choice made. This meant that apps created on the Xero platform as ‘Private apps’ would only connect to one or two  company records on Xero and the resulting credentials (ie- secret key, pem file) can be stored in the Beanworks server. The benefit to the solution is that the beanworks sync solution could make requests to the Xero API without restrictions which accounts for the smooth synchronization of accounting data.
* 	Database –  The choice to adopt a NoSQL database  over SQL databases for this project was informed by the need to ensure :
   *	Faster read/write operations 
   *	Adding search indexes on specific fields to enhance overall  system performance by 5%
   *	The  Schemaless nature of NoSQL databases would  prevent  data redundancy  and promote expansive storage of data in a way that suites the nature of the application


# System Design Documents/Diagams
The choice of language stack for this project was React, NodeJS , MongoDB. This implies that JavaScript remains the single language used throughout the stack for this project. GraphQL which is the major requirement for this project is used to facilitate API requests.

# Design Considerations
## Frontend – 
 * React – The frontend library for the application
 * React Apollo - It allows you to fetch data from your GraphQL server and use it in building complex and reactive UIs using the React framework
 * Bootstrap – The UI library for this task
## Backend - 
  *  API – The backend language chosen for this task is – NodeJS . It comes with its own Graph QL module that would be used to process API request coming from the client.
 *  MongoDB – the database of choice for this task.

# Business Logic- 


# Deploying to Production (Heroku)

Instructions for running code in production server (Important)












