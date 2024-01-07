import { body } from "express-validator";
import { User } from "../models/userModel";
import { query } from "express-validator";

export class UserValidators {
  static signup() {
    return [
      body("name", "Name is required").isString(),
      body("email", "email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
          })
            .then((user) => {
              if (user) {
                throw new Error("User Already Exists");
              } else {
                return true;
              }
            })
            .catch((err) => {
              console.log(err);
              throw new Error(err);
            });
        }),
      body("phone", "phone is required").isString(),
      body("password", "password is required")
        .isAlphanumeric()
        .isLength({ min: 8, max: 25 })
        .withMessage("Password must be between 8 to 25 characters"),
      body("type", "User type role is required").isString(),
      body("status", "User status is required").isString(),
    ];
  }

  static login() {
    return [
      query("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
          })
            .then((user) => {
              if (user) {
                req.user = user;
                return true;
              } else {
                // throw new Error('No User Registered with such Email');
                throw "No User Registered with such Email";
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      query("password", "Password is required").isAlphanumeric(),
    ];
  }
  static verifyUserEmailToken() {
    return [
      body(
        "verification_token",
        "Email token verification is required"
      ).isNumeric(),
      // body("email", "email is required").isEmail(),
    ];
  }
  static verifyUserForResendEmail(): any {
    return [query("email", "email is required").isEmail()];
  }
  static checkResetPasswordEmail() {
    return [
      query("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
          })
            .then((user) => {
              if (user) {
                return true;
              } else {
                // throw new Error('No User Registered with such Email');
                throw "No User Registered with such Email";
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
    ];
  }
  static verifyResetPasswordToken() {
    return [
      query("email", "Email is required").isEmail(),
      query("reset_password_token", "Reset password token is required")
        .isNumeric()
        .custom((reset_password_token, { req }) => {
          return User.findOne({
            email: req.query?.email,
            reset_password_token: reset_password_token,
            reset_password_token_time: { $gt: Date.now() },
          })
            .then((user) => {
              if (user) {
                return true;
              } else {
                // throw new Error('Reset password token doesn\'t exist. Please regenerate a new token.');
                throw "Reset password token doesn't exist. Please regenerate a new token.";
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
    ];
  }
  static resetPassword() {
    return [
      body("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
          })
            .then((user) => {
              if (user) {
                req.user = user;
                return true;
              } else {
                // throw new Error('Reset password token doesn\'t exist. Please regenerate a new token.');
                throw "Reset password token doesn't exist. Please regenerate a new token.";
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      body("new_password", "New Password is required").isAlphanumeric(),
      body("otp", "Reset password token is required")
        .isNumeric()
        .custom((otp, { req }) => {
          if (req.user.reset_password_token == otp) {
            return true;
          } else {
            req.errorStatus = 422;
            // throw new Error('Reset password token invalid. Please regenerate a new token');
            throw "Reset password token invalid. Please regenerate a new token.";
          }
        }),
    ];
  }
}
