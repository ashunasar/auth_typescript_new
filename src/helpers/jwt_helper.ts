import Jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { token } from "morgan";
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

const signAccessToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    const payload: JwtPayload = { aud: userId, iss: "asim.com" };
    const secretKey: string = process.env.ACCESS_TOKEN_SECRET!;
    const options: SignOptions = {
      expiresIn: "1h",
    };

    Jwt.sign(payload, secretKey, options, (err, token) => {
      if (err) {
        console.log(err);
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  const secretKey: string = process.env.ACCESS_TOKEN_SECRET!;
  Jwt.verify(token!, secretKey, (err, payload: unknown) => {
    if (err) return next(createError.Unauthorized());
    console.log(`payload ${payload}`);
    // req.body.payload = payload.aud;
    next();
  });
};
export { signAccessToken, verifyAccessToken };
