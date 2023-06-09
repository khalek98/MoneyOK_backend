import passport from "passport";
import { RequestHandler } from "express";

const authMiddleware: RequestHandler = (req, res, next) => {
  // console.log(res);
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export default authMiddleware;
