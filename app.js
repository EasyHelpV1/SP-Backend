/* jshint esversion: 8 */
/* jshint node: true */

require("dotenv").config({ path: `.env` });
require("express-async-errors");
const cors = require("cors");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
var bodyParser = require("body-parser");

// for io

// start express app
const app = express();

// wrap with http server
const server = http.createServer(app);

// initialize socketio
const io = new socketio.Server(server, {
  pingTimeout: 60000,
  cors: cors({
    origin: "*",
  }),
});

//connect to db
const db = require("./db/connect");

//auth
const authUser = require("./middleware/auth");

//routers
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const imgsRouter = require("./routes/imgs");
const commentRouter = require("./routes/comment");
const replyRouter = require("./routes/reply");

//middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//docs?

//routes
app.get("/api/v1", (req, res) => {
  return res.send("Welcome home :)");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authUser, usersRouter);
app.use("/api/v1/imgs", authUser, imgsRouter);
app.use("/api/v1/posts", authUser, postsRouter);
app.use("/api/v1/comment", authUser, commentRouter);
app.use("/api/v1/reply", authUser, replyRouter);

//errors
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

//start
const start = async () => {
  try {
    // connectDB
    await db(process.env.MONGO_URL);
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
