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

## Business Logic- 


# Step to deploy Beanworks app to Heroku (Production)
### Clone the repository to your machine.

### Folder structure
The folder structure after cloning is as shown

### Contents of .gitignore (In the root repository)
The gitignore file is set to checkout env file. However for the purpose o this project a copy to be used in production has been manually added for deployment

### Removing .git from React App (client) repository
* Navigate to client repository by running the command cd client
* Run the command sudo rm -rf .git (Notice the dot before git as it is important)
* Run the command ls -a and make sure that the .git repository (hidden) is deleted inside the /client repository
* Navigate back to the root repository

### MongoDB Cloud Atlas Account and Configuration Setup
This has already been done. The conenction credentials have been set in the .env file for production

### Heroku Setup
* First create a Heroku Account
* Read Heroku's documentation thoroughly. Check it out  [here] https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up
* Setup Heroku CLI as instructed in the above link

### PORT and Path Configuration
* Open server.js in the server and change the port configuration as follows:
``` const port = process.env.PORT || 3000; ```

### package.json setup
Open package.json in the server folder and add the following configuration to the existing ones
``` "scripts": {
    "start": "node server.js", "heroku-postbuild": "cd client && npm install && npm run build" 
}, 
"engines": {
    "node": "^10.3.0", 
    "npm": "^6.8.0" 
}
```

### Build
* Go back to the client folder of your application from command prompt and type following: npm run build (under client folder)
* Whenever we make changes in the code, we run npm run build in the root directory

### Deploy
* Go to App/server from cmd and type following: heroku login
* If you're configurating git for the first time, run the command git init
* Go back to server folder
   *  Run heroku create <appname>
   * ```git remote -v (to check heroku source)```
* Run these commands everytime you make changes to your code
    * git add .
    * git commit -m "Initial Commit"
    * git push heroku master
  
* The app will be now deployed and and URL will be provided by Heroku










