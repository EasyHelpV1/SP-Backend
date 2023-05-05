# SP-Backend
This Reposository hosts the backend of [Easy Help](https://sp-backend-b70z.onrender.com/api/v1) web app. It is done using NodeJs and ExpressJs. It is tested using [Mocha](https://mochajs.org), [Chai](https://www.chaijs.com) and [Jest](https://jestjs.io) with nearly 82% coverage. This project uses [MongoDB](https://www.mongodb.com) for database management. Bellow is a detailed file structure description as well as explanation of app and API flow.
## Run application on your machine
To run the application on your machine, follow the steps below:
- Clone this repository using ```git clone https://github.com/EasyHelpV1/SP-Backend.git```
- Install packages by running ```npm install```
- Create .env file and supply it with the following variables:
  - ```JWT_SECRET```: This token is used to verify authentication of users and admins.
  - ```JWT_LIFETIME```: JWT token expiration period. I set it up for ```2d``` but [other values](https://jwt.io/introduction) are possible. 
  - ```MONGO_URL```: URL for your database on MongoDB
    - Example: ```mongodb+srv://<yourUsername>:<yourPassword>@nodeexpressproject.eiqifly.mongodb.net/<yourDBName>?retryWrites=true&w=majority```
  - ```MONGO_URL_TEST```: Similar to MONGO_URL but is a new database built specifcally for testing.
  - ```LINK_ADDRESS```: API address after hosting, currently is https://sp-backend-b70z.onrender.com/api/v1
  - ```LINK_ADDRESS_FRONT``` Frontend address after hosting, currently is https://sp-frontend-6181.onrender.com
  - ```APP_EMAIL```: easyhelp.com@gmail.com
  - ```APP_PASS```: password for email account app that is used to automatically send emails to users after registration.
  - ```VALID_PASS```: a user account password, used for testing.
- Start the app using ```npm start```
- Run tests using ```npm test```
- run tests with coverage using ```npm run coverage```
## File Structure
This application uses the MVC model for program organization, which results in having controllers folder for the functionality of the app, models for the database structure and components, and views which revolves around the user interaction with the app.
### controllers
- **adminActions**: functions that work on the admin interaction with the database and user accounts, it includes reseting a user password, editing a user, changing admin previlages of users, and deleting posts.
- **auth**: controls a user and an admin authentication, including registration, logging in, and confirmation.
- **comment**: comment adding and retrieving functions, and connections to appropriate posts.
- **imgs**: images addition, editing, and retrival.
- **posts**: post creating, editing, retrival, and deletion functionalities. 
- **reply**: replies addition and retrival, and connection to comment.
- **users**: users creation, editing, retrival, and deletion, this also contains reseting passwords. 
### db
Database connection, and configuration.
### errors
Error handling setup, including a custom error, with children of Not Found error, Bad Request, and Unauthenticated. 
### middleware
Middlewares used throught the application routes:
- adminAuth is used for admin authentication, including checking for the admin roles in the jwt.
- auth is for basic user authentication. 
- error-handler overlooks the variuable errors from the database, and converts them to tradable errors. 
- not-found contains specific handling for non existing routes.
### models
The database model for each of the elements in the project according to MongoDB collection and document structure. The collections for this project are: User, Post, Comment, Reply, and Img.
### routes
Application routes, each file has the routes corresponding to their specific controllers with similar naming covention. Routes categories include: admin, auth, user, posts, comments, replies, and images. Note that all routes are preceded with a common configuration "api/v1", and that is set up in the app.js file.
### services
Includes the functionalities of the app that include interaction with external sources to provide convenience and security for the app. This currently includes email verification using Google emails. 
### tests
This folder contains tests for routes and controllers of the application, as well as test configuration. To run the tests, use the commands provided above.
### app.js
This is the entry point for the application, it has most of the imports, and the setup for all middleware, routes, and db connection start. 
### package.json
This file includes the configuration for the Node and Express project as well as the packages names, and versions and some of their configuration.
## Frontend
- [Frontend Repository](https://github.com/EasyHelpV1/SP-Frontend.git)
- [Frontend link](https://sp-frontend-6181.onrender.com)
## Contact
- [Easy Help Facebook](https://www.facebook.com/profile.php?id=100092154781925)
- [Easy Help Instagram](https://www.instagram.com/easyhelpv1)
- Email: easyhelp.com@gmail.com



