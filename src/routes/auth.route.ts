import express, { NextFunction, Request, Response } from "express";
const router = express.Router();

router.post("/register", (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  res.send("Hello from register route");
});

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
