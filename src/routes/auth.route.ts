import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import User from "../models/user.model";
import authSchema from "../validation/auth_schema";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../helpers/jwt_helper";
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
      const refreshToken = await signRefreshToken(savedUser.id);
      res.send({ accessToken, refreshToken });
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
      const refreshToken = await signRefreshToken(user.id);
      res.send({ accessToken, refreshToken });
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
    try {
      const { refreshToken } = req.body;
      const userId: string = await verifyRefreshToken(refreshToken);

      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      res.send({ accessToken, refreshToken: refToken });
    } catch (error) {
      next(error);
    }
  }
);
router.delete(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    //TODO: handle logoout route
    try {
      //some fixes
    } catch (error) {
      next(error);
    }
  }
);
export default router;
