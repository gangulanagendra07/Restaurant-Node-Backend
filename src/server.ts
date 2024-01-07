import * as mongoose from "mongoose";
import { getEnvironmentVariables } from "./environments/environment";
import express from "express";
const cors = require("cors");
import * as bodyParser from "body-parser";
import userRouter from "./routers/userRouter";

export class Server {
  public app = express();
  constructor() {
    this.allowCors();
    this.setConfigs();
    this.setRoute();
    this.error404Handlers();
    this.handleError();
  }

  setConfigs() {
    this.connectMongoDB();
    this.configureBodyParser();
  }
  configureBodyParser() {
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: "10mb",
      })
    );
    this.app.use(bodyParser.json());
  }
  allowCors() {
    this.app.use(cors());
  }

  connectMongoDB() {
    mongoose
      .connect(getEnvironmentVariables().db_uri)
      .then(() => {
        console.log("DB connection successfully");
      })
      .catch((err: any) => {
        console.log("DB connection failure", err);
      });
  }
  setRoute() {
    this.userRoutes();
  }
  userRoutes() {
    this.app.use("/api/user", userRouter);
  }
  error404Handlers() {
    this.app.use((req: any, res: any) => {
      res.status(404).json({
        message: "Not Found",
        status_code: 404,
      });
    });
  }
  handleError() {
    try {
      this.app.use((error: any, req: any, res: any, next: any) => {
        const errorStatus = req.errorStatus || 500;
        res.status(errorStatus).json({
          message: error.msg || "Something went wrong.!",
          status_code: errorStatus,
        });
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
