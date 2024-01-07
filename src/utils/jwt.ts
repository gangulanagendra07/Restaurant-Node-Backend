import * as jwt from "jsonwebtoken";
import { devEnvironment } from "../environments/environment.dev";

export class JWT {
  static jwtVerify(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        devEnvironment.jwt_secret_key,
        (err: any, decode: any) => {
          if (err) reject(err);
          else if (!decode) reject(new Error("User is not Authorized.!"));
          else resolve(decode);
        }
      );
    });
  }
}
