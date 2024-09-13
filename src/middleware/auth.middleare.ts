import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import User, { UserType } from "../models/user.model";
import { sendVerificationOTP } from "../utils/authHelpers";

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}

export const verificationCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.isVerified) {
    return next();
  }

  // User is not verified, send OTP
  await sendVerificationOTP(
    req,
    res,
    next,
    "Your account is not verified. OTP sent to your email.",
    401
  );
};
