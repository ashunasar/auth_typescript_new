import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import createError from "http-errors";
import { request } from "http";
import AuthRouter from "./routes/auth.route";
import { verifyAccessToken } from "./helpers/jwt_helper";
const app = express();

dotenv.config();
require("./helpers/init_mongodb");
require("./helpers/init_redis");
app.use(morgan("dev"));
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.get(
  "/",
  verifyAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body.payload);
    res.send("Hello world");
  }
);
app.use("/auth", AuthRouter);

app.use(async (req: Request, res: Response, next: NextFunction) => {
  next(createError.NotFound());
});

app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500);
  res.send({
    error: {
      statusCode: err.statusCode || 500,
      message: err.message,
    },
  });
});
app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
