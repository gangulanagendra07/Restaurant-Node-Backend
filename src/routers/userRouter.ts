import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserValidators } from "../validators/userValidators";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";

export class UserRouter {
  public router: Router;
  public userController = new UserController();
  constructor() {
    this.router = Router();
    this.getUserRoutes();
    this.postUserRoutes();
    this.putUserRoutes();
    this.fetchUserRoutes();
    this.deleteUserRoutes();
  }
  getUserRoutes() {
    this.router.get(
      "/send/verification/email",
      // UserValidators.verifyUserForResendEmail(),
      GlobalMiddleWare.auth,
      UserController.resendVerificationEmail
    );
    this.router.get(
      "/login",
      UserValidators.login(),
      GlobalMiddleWare.checkErrors,
      this.userController.login
    );
    this.router.get(
      "/send/reset/password/token",
      UserValidators.checkResetPasswordEmail(),
      GlobalMiddleWare.checkErrors,
      this.userController.sendResetPasswordOtp
    );
    this.router.get(
      "/verify/resetPasswordToken",
      UserValidators.verifyResetPasswordToken(),
      GlobalMiddleWare.checkErrors,
      UserController.verifyResetPasswordToken
    );
    this.router.get(
      "/profile",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.checkErrors,
      UserController.profile
    );
  }
  postUserRoutes() {
    this.router.post(
      "/signup",
      UserValidators.signup(),
      GlobalMiddleWare.checkErrors,
      this.userController.signUp
    );
  }
  putUserRoutes() {}
  fetchUserRoutes() {
    this.router.patch(
      "/resetpassword",
      UserValidators.resetPassword(),
      GlobalMiddleWare.checkErrors,
      this.userController.resetPassword
    );
    this.router.patch(
      "/verify/emailOtp",
      UserValidators.verifyUserEmailToken(),
      GlobalMiddleWare.checkErrors,
      GlobalMiddleWare.auth,
      this.userController.verifyUserEmailToken
    );
  }
  deleteUserRoutes() {}
}

export default new UserRouter().router;
