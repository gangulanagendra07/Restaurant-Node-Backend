import { User } from "../models/userModel";
import { Utils } from "../utils/Utils";
import * as jwt from "jsonwebtoken";
import { devEnvironment } from "../environments/environment.dev";

export class UserController {
  async signUp(req: any, res: any, next: any) {
    try {
      const hashPassword = await Utils.encryptPassword(req.body.password);
      let data = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        verification_token: Utils.generateVerificationToken(6),
        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        password: hashPassword,
        type: req.body.type,
        status: req.body.status,
      };
      // console.log(data);
      try {
        let user = await new User(data).save();
        const tokenData = {
          userId: user._id,
          email: user.email,
          type: user.type,
        };
        const token = jwt.sign(tokenData, devEnvironment.jwt_secret_key, {
          expiresIn: "1h",
        });
        // send email to user for verification
        // await NodeMailer.mailSender({
        //   to: req.body.email,
        //   subject: undefined,
        //   html: `verification token ${data.verification_token}`,
        // });

        res.status(200).json({
          message: "signup has been successful",
          user: user,
          token: token,
        });
      } catch (err) {
        console.log(err);
        res.status(404).json({
          error: err,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async login(req: any, res: any, next: any) {
    const dbPassword = req?.user?.password;
    const email = req.query.email;
    const password = req.query.password;
    try {
      await Utils.comparePassword(password, dbPassword);
      const tokenData = {
        userId: req.user._id,
        email: email,
        type: req.user.type,
      };
      const token = jwt.sign(tokenData, devEnvironment.jwt_secret_key, {
        expiresIn: "1h",
      });
      res.status(200).json({
        status: true,
        message: "User Logged In Successfully",
        token: token,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyUserEmailToken(req: any, res: any, next: any) {
    try {
      const verification_token = req.body.verification_token;
      const email = req.decode.email;
      const user = await User.findByIdAndUpdate(
        {
          email: email,
          verification_token: verification_token,
          verification_token_time: { $gt: Date.now() },
        },
        {
          email_verified: true,
        },
        {
          new: true,
        }
      );
      if (user) {
        res.send(user);
      } else {
        throw new Error(
          "Wrong OTP or Email verification token has expired, please try again.!"
        );
      }
    } catch (error) {
      next(error);
    }
  }

  static async resendVerificationEmail(req: any, res: any, next: any) {
    console.log(req.decode);
    const email = req.decode.email;
    try {
      const verification_token = Utils.generateVerificationToken(6);
      // const email = req.query.email;
      const user = await User.findByIdAndUpdate(
        {
          email: email,
        },
        {
          verification_token: verification_token,
          verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        }
      );
      console.log(user);
      if (user) {
        // await NodeMailer.mailSender(
        //     {
        //         to: '',
        //         subject: '',
        //         html: ''
        //   }
        // );
        res.status(200).json({
          success: true,
        });
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async sendResetPasswordOtp(req: any, res: any, next: any) {
    const email = req.query.email;
    console.log("console", email);
    const reset_password_token = Utils.generateVerificationToken();
    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          updated_at: new Date(),
          reset_password_token: reset_password_token,
          reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        }
      );
      if (user) {
        res.status(201).json({
          success: true,
          message: "OTP sent successfully",
        });
        // send email to user for verification
        // await NodeMailer.mailSender({
        //   to: req.query.email,
        //   subject: "Reset Password Email Verification OTP",
        //   html: `verification OTP ${reset_password_token}`,
        // });
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (error) {
      next(error);
    }
  }
  static async verifyResetPasswordToken(req: any, res: any, next: any) {
    try {
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }
  async resetPassword(req: any, res: any, next: any) {
    const user = req.user;
    const new_password = await Utils.encryptPassword(req.body.new_password);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { email: req.body.email },
        {
          updated_at: new Date(),
          password: new_password,
        },
        {
          new: true,
        }
      );
      if (updatedUser) {
        res.status(204).json({
          success: true,
          message: "Password Updated Successfully ",
        });
      } else {
        throw new Error("Password Not Updated");
      }
    } catch (error) {
      next(error);
    }
  }
  static async profile(req: any, res: any, next: any) {
    const user = req.user;
    try {
      const profile = await User.findById(user.aud);
      if (profile) {
        res.status(204).json({
          success: true,
          message: "Profile Info Retrieved Successfully",
        });
      } else {
        throw new Error("Not Retrieved Profile Info");
      }
    } catch (error) {
      next(error);
    }
  }
}
