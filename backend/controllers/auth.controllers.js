import sendMail from "../config/Mail.js";
import User from "../models/user.model.js";
import genToken from "../config/token.js";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const findByemail = await User.findOne({
      email,
    });

    if (findByemail) {
      return res.status(400).json({
        message: "Email already Exists!",
      });
    }

    const findByUserName = await User.findOne({ username });

    if (findByUserName) {
      return res.status(400).json({
        message: "Email already Exists!",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "password must be atleast 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const token = await genToken(user._id);

    if (!token) {
      return res.status(400).json({
        message: "Token is not genereated properly",
      });
    }

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: `Sign Up error ${error}`,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "Username not Found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password is Incorrect",
      });
    }

    const token = await genToken(user._id);

    if (!token) {
      return res.status(400).json({
        message: "Token is not genereated properly",
      });
    }

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 10,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: `Sign In error ${error}`,
    });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "SignOut successFully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Sign In error ${error}`,
    });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    //create OTP
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found with this email",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();

    await sendMail(email, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `OTP send error ${error}`,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "Invalid or Expired OTP",
      });
    }

    user.isOtpVerified = true;
    await user.save();

    return res.status(200).json({
      message: "OTP verified",
    });
  } catch (error) {
    return res.status(500).json({
      message: `verify OTP error ${error}`,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.isOtpVerified == false) {
      return res.status(400).json({
        message: "OTP verification Required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `RESET OTP ERROR ${error}`,
    });
  }
};
