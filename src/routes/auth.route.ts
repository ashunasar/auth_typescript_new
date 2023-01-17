import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import User from "../models/user.model";
import authSchema from "../validation/auth_schema";
import { signAccessToken } from "../helpers/jwt_helper";
import { SignatureKind } from "typescript";
const router = express.Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const doesExist = await User.findOne({ email: result.email });
      if (doesExist)
        throw createError.Conflict(
          `${result.email} is already been registered`
        );
      const user = new User(result);

      const savedUser = await user.save();
      const accessToken = await signAccessToken(savedUser.id);
      console.log(accessToken);
      res.send(savedUser);
    } catch (err: any) {
      if (err.isJoi) err.statusCode = 422;
      next(err);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const user = await User.findOne({ email: result.email });
      if (!user) throw createError.NotFound("User not registered");
      const isMatch: boolean = await user.isValidPassword(result.password);

      if (!isMatch) throw createError.Unauthorized("email/password not valid");
      const accessToken = await signAccessToken(user.id);
      res.send({ accessToken });
    } catch (err: any) {
      if (err.isJoi)
        return next(createError.BadRequest("Invalid email/password"));
      next(err);
    }
  }
);
router.post(
  "/refresh-token",
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello from refresh-token route");
  }
);
router.delete(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello from logout route");
  }
);
export default router;
