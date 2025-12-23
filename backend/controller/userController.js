import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import HandleError from "../utils/handleError.js";
import userModel from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

export const registerUser = handleAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  let avatarUrl = "";
    let publicId = "";

  if (req.files && req.files.avatar) {
    const file = req.files.avatar;
    console.log(req.files);
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    avatarUrl = result.secure_url;
    publicId = result.public_id;
    console.log("Cloudinary upload success:", result.secure_url);
  }

 try {
  const user = await User.create({
    name,
    email,
    password,
    avatar: { url: avatarUrl, public_id: publicId },
  });
  sendToken(user, 201, res);
} catch (err) {
  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: "Email already exists" });
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    return res.status(400).json({ success: false, message });
  }
  return res.status(500).json({ success: false, message: err.message });
}

});

//Login
export const loginUser = handleAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new HandleError("Email or password cannot be empty", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new HandleError("Inavlid email or password", 401));
  }

  const isPasswordValid = await user.verifyPassword(password);
  if (!isPasswordValid) {
    return next(new HandleError("Inavlid email or password", 401));
  }

  sendToken(user, 200, res);
});

//Logout
export const logout = handleAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "successfully Logged out",
  });
});

//Forgot Password
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new HandleError("User doesn't exist", 400));
  }
  let resetToken;
  try {
    resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    return next(
      new HandleError("Could not save reset token please try again later", 500)
    );
  }
  const resetPasswordURL = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;
  const message = `Use the following link to reset your password: ${resetPasswordURL}. \n\n This link will expire in 30 minutes. \n\n If you didn't request a password reset,please ignore this message`;
  try {
    //Send Email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: message,
    });
    res.status(200).json({
      success: true,
      message: `Email is sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new HandleError("Email could not be send please try again later", 500)
    );
  }
});

//Reset Password
export const resetPassword = handleAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new HandleError(
        "Reset Password token is invalid or has been expired",
        400
      )
    );
  }
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(new HandleError("Password doesn't match", 400));
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

//Get user details
export const getUserDetails = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//update password
export const updatePassword = handleAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");
  const ckeckPasswordMatch = await user.verifyPassword(oldPassword);
  if (!ckeckPasswordMatch) {
    return next(new HandleError("Old Password is incorrect", 400));
  }
  if (newPassword !== confirmPassword) {
    return next(new HandleError("New Password doesn't match", 400));
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//Updating user profile
export const updateProfile = handleAsyncError(async (req, res, next) => {
  const { name, email } = req.body;

  /* ===============================
     1️⃣ CHECK EMAIL EXISTS
  =============================== */
  const emailExists = await User.findOne({
    email,
    _id: { $ne: req.user.id },
  });

  if (emailExists) {
    return res.status(400).json({
      success: false,
      message: "Email already exists. Please use another email.",
    });
  }

  const updateUserDetails = {
    name,
    email,
  };

  /* ===============================
     2️⃣ UPDATE AVATAR (IF PROVIDED)
  =============================== */
  if (req.files && req.files.avatar) {
    const user = await User.findById(req.user.id);

    // remove old avatar from cloudinary
    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    const result = await cloudinary.uploader.upload(
      req.files.avatar.tempFilePath,
      {
        folder: "avatars",
        width: 150,
        crop: "scale",
      }
    );

    updateUserDetails.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  /* ===============================
     3️⃣ UPDATE USER
  =============================== */
  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateUserDetails,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user,
  });
});


//Admin-Gettin user Information
export const getUserList = handleAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//Admin-Getting Single user information
export const getSingleUser = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new HandleError(`User doesn't exist with this id:${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//Admin- Changing user role
export const updateUserRole = handleAsyncError(async (req, res, next) => {
  const { role } = req.body;
  const newUserData = {
    role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new HandleError("User doesn't exist", 400));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//Admin- Delete User Profile
export const deleteUser = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new HandleError("User doesn't exist", 400));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
