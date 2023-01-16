import * as dotenv from "dotenv";
import Connection from "./helpers/init_mongodb";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import createError from "http-errors";
import { request } from "http";
import AuthRouter from "./routes/auth.route";
const app = express();

dotenv.config();
new Connection().start();
app.use(morgan("dev"));
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});
app.use("/auth", AuthRouter);

app.use(async (req: Request, res: Response, next: NextFunction) => {
  next(createError.NotFound());
});

app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
  res.send({
    error: {
      statusCode: err.statusCode,
      message: err.message,
    },
  });
});
app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
