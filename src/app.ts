/**
 * Module Dependencies
 */
import * as express from "express";
import * as compression from "compression";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as lusca from "lusca";
import * as dotenv from "dotenv";
import * as mongo from "connect-mongo";
import * as path from "path";
import * as mongoose from "mongoose";
import expressValidator = require("express-validator");

const MongoStore = mongo(session);
/**
 * Load Env Variables
 */
dotenv.config({ path: ".env" });
/**
 * Controllers (route handlers)
 */
import * as homeController from "./controllers/home";
/**
 * Create Express server
 */
const app = express();
/**
 * Connect to Mongo
 */
mongoose.connect(process.env.MONGO_URI || process.env.MONGOLAB_URI);
mongoose.connection.on("error", () => {
  console.log("MongoDB connection error. Please make sure MongoDB is running.");
  process.exit();
});

/**
 * Express configuration
 */

app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      url: process.env.MONGO_URI || process.env.MONGOLAB_URI,
      autoReconnect: true
    })
  })
);
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

/**
 * Primary routes
 */
app.get("/", homeController.index);

/**
 * Start Server
 */
app.listen(app.get("port"), () => {
  app.get("port"), app.get("env");
  console.log("App is listening\n");
});

module.exports = app;
