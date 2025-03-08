import bcryptjs from "bcryptjs";
import Staff  from "../models/staffModel.js";
import crypto from "crypto";
import  User  from "../models/userModel.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";

/* ==========================
   🔹 USER SIGNUP (REGISTER)
   ========================== */
export const signup = async (req, res) => {
  const { email, name, password, role } = req.body;

  try {
    if (!email || !password || !name || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      role,
      isVerified: false,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    
    await Staff.create({ name, email, role });

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully! Please verify your email.",
      userId: user._id,
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Signup failed. Please try again." });
  }
};

/* ==========================
   🔹 EMAIL VERIFICATION
   ========================== */
export const verifyEmail = async (req, res) => {
  try {
    console.log("Received verification request:", req.body);
    const { email, verificationToken } = req.body;

    if (!email || !verificationToken) {
      return res.status(400).json({ success: false, message: "Verification code is required!" });
    }

    const user = await User.findOne({ email });

    if (!user || user.isVerified) {
      return res.status(400).json({ success: false, message: "Invalid request or already verified" });
    }

    if (user.verificationToken !== verificationToken) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    if (new Date() > user.verificationTokenExpiresAt) {
      return res.status(400).json({ success: false, message: "Verification code expired. Request a new one." });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;
    await user.save();

    // Now generate JWT token after successful verification
    const token = generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      token,
    });

  } catch (error) {
    console.error("Email Verification Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ==========================
   🔹 USER LOGIN
   ========================== */
   
   
   export const login = async (req, res) => {
     const { email, password } = req.body;
   
     try {
       const user = await User.findOne({ email });
       if (!user) {
         return res.status(400).json({ success: false, message: "Invalid Credentials" });
       }
   
       // Ensure user is verified before allowing login
       if (!user.isVerified) {
         return res.status(400).json({ success: false, message: "Email not verified. Please verify your email." });
       }
   
       const isPasswordValid = await bcryptjs.compare(password, user.password);
       if (!isPasswordValid) {
         return res.status(400).json({ success: false, message: "Invalid Credentials" });
       }
   
       // Generate JWT token
       const token = generateTokenAndSetCookie(res, user._id);

       console.log("Token Sent in Response:", token);
   
       // Update last login time
       user.lastLogin = new Date();
       await user.save();
   
       res.status(200).json({
         success: true,
         message: "Logged in successfully",
         token,
         user: {
           id: user._id,
           name: user.name,
           email: user.email,
           role: user.role,
         },
       });
     } catch (error) {
       console.error("Login Error:", error);
       res.status(500).json({ success: false, message: "Login failed. Please try again." });
     }
   };
   

/* ==========================
   🔹 USER LOGOUT
   ========================== */
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

/* ==========================
   🔹 FORGOT PASSWORD
   ========================== */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    await user.save();

    // Send reset email
    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    res.status(200).json({ success: true, message: "Password reset link sent to email" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Failed to send reset link. Please try again." });
  }
};

/* ==========================
   🔹 RESET PASSWORD
   ========================== */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = await bcryptjs.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);
    res.status(200).json({ success: true, message: "Password reset successful" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Failed to reset password. Please try again." });
  }
};

/* ==========================
   🔹 CHECK AUTH STATUS
   ========================== */

   export const checkAuth = async (req, res) => {
     try {
       if (!req.user) {
         return res.status(401).json({ success: false, message: "Unauthorized" });
       }
   
       const user = await User.findById(req.user.id).select("-password"); // Exclude password field
       if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
       }
   
       res.status(200).json({ success: true, user });
     } catch (error) {
       console.error("Check Auth Error:", error);
       res.status(500).json({ success: false, message: "Authentication check failed." });
     }
   };
   