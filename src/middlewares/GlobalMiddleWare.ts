import { validationResult } from "express-validator";
import { JWT } from "../utils/jwt";

export class GlobalMiddleWare {
  static checkErrors(req: any, res: any, next: any) {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      // next(new Error(errors.array()[0].msg));
      return res.status(500).json({
        err: errors.array()[0].msg,
      });
    } else {
      next();
    }
  }

  static async auth(req: any, res: any, next: any) {
    const header_auth = req.headers.authorization;
    const token = header_auth ? header_auth.slice(7, header_auth.length) : null;
    // const token = header_auth ? header_auth.split(" ")[1] : null;

    try {
      req.errorStatus = 401;
      if (!token) next(new Error("User doesn't exists"));
      const decode = await JWT.jwtVerify(token);
      req.decode = decode;
      next();
    } catch (error) {
      // next(error);
      next(new Error("User doesn't exists"));
    }
  }
}
