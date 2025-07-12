const httpStatusCode = require("../constant/httpStatusCode");
const {
  getToken,
  getTokenForgotPassword,
} = require("../middleware/authMiddleware");
const adminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinaryConfig");
const {
  SendRegistrationEmail,
  SendForgotPasswordEmail,
} = require("../services/emailServices");
const { getRandomDigitNumber } = require("../utils/getRandom");

const {
  logActivity,
  ActivityTypes,
} = require("../services/activityLogService");
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Email or Pasword is empty",
      });
    }
    const User =
      (await UserModel.findOne({ email })) ||
      (await adminModel.findOne({ email }));
    if (!User) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "User not found with this email",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, User.password);
    if (!isPasswordCorrect) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const token = await getToken(User);

    // Log successful login
    await logActivity(
      ActivityTypes.USER.LOGIN,
      `User ${User.username} logged in successfully`,
      User.role,
      User._id
    );

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Login Successfully",
      data: { User, token },
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!!",
      error: error.message,
    });
  }
};
const Register = async (req, res) => {
  try {
    const { email, password, username, role, mobile } = req.body;
    console.log(email, password, username, role);
    if (!email || !password || !username || !role) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "email or password or username is empty",
      });
    }
    let isExistingUser;
    if (role === "user") {
      isExistingUser = await UserModel.findOne({ email });
    } else if (role === "admin") {
      isExistingUser = await adminModel.findOne({ email });
    }
    if (isExistingUser) {
      return res.status(httpStatusCode.CONFLICT).json({
        success: false,
        message: "User already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let User;
    if (role === "user") {
     
      User = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        role,
        mobile,
       
      });
    } else if (role === "admin") {
      User = await adminModel.create({
        username,
        email,
        password: hashedPassword,
        role,
      });
    }

    if (!User) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create user",
      });
    }

    // Log successful registration
    await logActivity(
      ActivityTypes.USER.REGISTER,
      `New ${role} registered: ${username}`,
      role,
      User._id
    );

    await SendRegistrationEmail(User?.email, User?.username);

    return res.status(httpStatusCode.CREATED).json({
      success: true,
      message: "Registered Successfully",
      data: User,
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!!",
      error: error.message,
    });
  }
};

//view all user
const ViewAllUser = async (req, res) => {
  try {
    const AllUser = await UserModel.find();
    if (!AllUser) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "No user found",
      });
    }

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "User found",
      data: AllUser,
    });
  } catch (error) {
    console.log("error:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!!",
      error: error.message,
    });
  }
};

const RegisterGoogle = async (req, res) => {
  try {
    const { data } = req.body;
    console.log("data come from body while google:", req.body);

    if (!data) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Please provide user data",
      });
    }
    // Check if user already exists by email
    const existingUser = await UserModel.findOne({ email: data?.user?.email });

    if (existingUser) {
      const token = await getToken(existingUser);
      // User exists - return user data (without password)
      const userObj = existingUser.toObject();
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Login successful",
        user: userObj,
        token: token,
      });
    }

    // Generate a username from Google name (replace spaces and make lowercase)
    const generatedUsername = data.user.name.replace(/\s+/g, "").toLowerCase();

    // Create new user with your schema structure
    const newUser = new UserModel({
      username: generatedUsername,
      email: data.user.email,
      password: "1234",
      role: "user",
    });

    await newUser.save();

    const userObj = newUser.toObject();
    const token = await getToken(newUser);
    await logActivity(
      ActivityTypes.USER.REGISTER,
      `New consumer registered: ${generatedUsername}`,
      "consumer",
      newUser?._id
    );

    return res.status(httpStatusCode.CREATED).json({
      success: true,
      message: "Registration successful",
      user: userObj,
      token: token,
    });
  } catch (error) {
    console.log("error while google registered:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!!",
      error: error?.message,
    });
  }
};

const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Email is required",
      });
    }

    let user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "User not registered with this email",
      });
    }
    const otp = getRandomDigitNumber(6);
    user.forgotOTP = otp;
    await user.save();
    const token = await getTokenForgotPassword(user);
    const redirectUrl = `https://www.bharatiyacare.com/resetpassword?token=${token}`;
    const emailSend = await SendForgotPasswordEmail(
      user?.email,
      user?.username,
      redirectUrl,
      otp
    );
    await logActivity(
      ActivityTypes.USER.FORGOT_PASSWORD,
      `Forgot password email sent to ${user.username}`,
      "user",
      user?._id
    );

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Email sent successfully to " + email,
    });
  } catch (error) {
    console.log("error while forgot password:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!!",
      error: error?.message,
    });
  }
};

const ResetPasswordViaLink = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "password is required",
      });
    }
    const userId = req.user._id;
    if (!userId) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    let user = await UserModel.findById(userId);
    if (!user) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    await logActivity(
      ActivityTypes.USER.RESET_PASSWORD,
      `Password reset successfully for user ${user.username}`,
      "user",
      user?._id
    );
    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("error while verifyPassword:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!!",
      error: error?.message,
    });
  }
};

const UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Log profile update
    await logActivity(
      ActivityTypes.USER.UPDATE_PROFILE,
      `User ${updatedUser.username} updated their profile`,
      updatedUser.role,
      updatedUser._id
    );

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!!",
      error: error.message,
    });
  }
};

const GetUserById = async (req, res) => {
  try {
    // Get user ID from params or authenticated user
    const userId = req.params.userId || req.user?._id;

    if (!userId) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find user by ID and exclude password from the result
    const user = await UserModel.findById(userId)
      .select("-password")
      

    if (!user) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }
    
    await user.save();

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "User details retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error while getting user details:", error);

    // Handle invalid ObjectId format error
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while retrieving user details",
      error: error?.message,
    });
  }
};

module.exports = {
  Login,
  Register,
  ViewAllUser,
  RegisterGoogle,
  ForgotPassword,
  ResetPasswordViaLink,
  UpdateUser,
  GetUserById,
};
