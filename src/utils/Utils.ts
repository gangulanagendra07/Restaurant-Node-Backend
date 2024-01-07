import * as bcrypt from "bcryptjs";

export class Utils {
  public MAX_TOKEN_TIME = 5 * 60 * 1000;
  static generateVerificationToken(digit: number = 6) {
    // const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < digit; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    // return parseInt(otp);
    return otp;
  }
  static encryptPassword(password: any) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(hash);
        }
      });
    });
  }
  static comparePassword(loginPassword: any, dbPassword: any): Promise<any> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(loginPassword, dbPassword, (err, same) => {
        if (err) {
          reject(err);
        } else if (!same) {
          reject(new Error("User & Password Doesn't Match"));
        } else {
          resolve(true);
        }
      });
    });
  }
}
