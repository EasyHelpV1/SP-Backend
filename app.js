/* jshint esversion: 8 */
/* jshint node: true */

// docs imports
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocs = YAML.load("./swagger.yaml");

// imports
require("dotenv").config({ path: `.env` });
require("express-async-errors");
const cors = require("cors");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
var bodyParser = require("body-parser");

// start express app
const app = express();

// wrap with http server
const server = http.createServer(app);

//connect to db
const db = require("./db/connect");

//auth
const authUser = require("./middleware/auth");
const authAdmin = require("./middleware/adminAuth");

//routers
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const imgsRouter = require("./routes/imgs");
const commentRouter = require("./routes/comment");
const replyRouter = require("./routes/reply");
const adminRouter = require("./routes/admin");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//docs
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//routes
app.get("/api/v1", (req, res) => {
  // return res.send("Welcome home :)");
  return res.send(
    '<h1>Welcome to Easy Help API</h1><p><a href="/api-docs">Explore API Documentation</p></a>'
  );
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authUser, usersRouter);
app.use("/api/v1/imgs", authUser, imgsRouter);
app.use("/api/v1/posts", authUser, postsRouter);
app.use("/api/v1/comment", authUser, commentRouter);
app.use("/api/v1/reply", authUser, replyRouter);
app.use("/api/v1/admin", authAdmin, adminRouter);

//errors
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

//start
const start = async () => {
  const env = process.env.NODE_ENV || "development";
  let db_URI;
  try {
    // connectDB
    // await db(process.env.MONGO_URL);
    if (env === "test") {
      db_URI = process.env.MONGO_URL_TEST;
    } else {
      db_URI = process.env.MONGO_URL;
    }
    //
    await db(db_URI);
    //launch
    server.listen(port, () =>
      console.log(`Server is listening port ${port}...`)
    );
    // using server to work with socket io, uncomment below if we using only express app
    // app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;
