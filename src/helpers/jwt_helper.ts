import Jwt, {
  JwtPayload,
  SignOptions,
  TokenExpiredError,
  VerifyErrors,
} from "jsonwebtoken";
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
  Jwt.verify(
    token!,
    secretKey,
    (
      err: VerifyErrors | null,
      payload: string | JwtPayload | undefined
    ): void => {
      if (err) {
        console.log(err);
        if (err instanceof TokenExpiredError) {
          return next(createError.Unauthorized(err.message));
        }
        return next(createError.Unauthorized());
      }
      const data = payload as JwtPayload;
      req.body.payload = data.aud;
      next();
    }
  );
};

const signRefreshToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    const payload: JwtPayload = { aud: userId, iss: "asim.com" };
    const secretKey: string = process.env.REFRESH_TOKEN_SECRET!;
    const options: SignOptions = {
      expiresIn: "1y",
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

export { signAccessToken, verifyAccessToken, signRefreshToken };
