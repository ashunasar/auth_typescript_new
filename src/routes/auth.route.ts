import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import User from "../models/user.model";
import authSchema from "../validation/auth_schema";
import { signAccessToken } from "../helpers/jwt_helper";
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

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello from login route");
});
router.post(
  "/refresh-token",
  (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello from refresh-token route");
  }
);
router.delete("/logout", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello from logout route");
});
export default router;
