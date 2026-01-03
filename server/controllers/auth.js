const { User, LoginHistory } = require("../models");
const bcrypt = require("bcryptjs");
const { FRONT_END_URL, APP_KEY, API_KEY, DEFAULT_PASSWORD } = process.env;
// const sendMail = require("../helpers/sendMail");
const jwt = require("jsonwebtoken");
const Response = require("../helpers/response");
const { validationResult } = require("express-validator");
const saltRounds = 10;

const authController = {
  login: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return Response.responseStatus(res, 400, "Validation Failed", errors);
      }
      const { email, password } = req.body;
      const existingUser = await User.findOne({ where: { email } });
      if (!existingUser) {
        return Response.responseStatus(res, 401, "Incorrect email");
      }
      if (!Boolean(existingUser.is_active)) {
        return Response.responseStatus(res, 401, "Inactive user");
      }
      const compare = await bcrypt.compare(password, existingUser.password);
      if (!compare) {
        return Response.responseStatus(res, 401, "Incorrect password");
      }
      const { id } = existingUser;
      const history = await LoginHistory.create({
        user_id: id,
        status: "Logged-In",
      });
      const token = jwt.sign({ id, session_id: history.id }, APP_KEY);
      return res.status(200).json({
        status: true,
        message: "Login successfully",
        session_id: history.id,
        token,
        user_data: existingUser,
      });
    } catch (error) {
      console.log(error.message);
      return Response.responseStatus(res, 400, "Bad request", {
        error: error.message,
      });
    }
  },
  logout: async (req, res) => {
    try {
      const data = req.userData;
      const result = await LoginHistory.update(
        { status: "Logged-Out" },
        { where: { id: data.session_id } }
      );
      if (!result) {
        return Response.responseStatus(res, 401, "Logout unsuccessfull");
      }
      return Response.responseStatus(res, 200, "Logout successfully");
    } catch (error) {
      console.error("Error during logout:", error.message);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  createAPIKeyForUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      // console.log(user);
      if (!user) {
        return Response.responseStatus(res, 404, "User doesn't exist");
      }

      const token = jwt.sign({ id: user.id }, API_KEY);
      const updatedUser = await User.update(
        {
          api_key: token,
        },
        { where: { id } }
      );
      if (!updatedUser)
        return Response.responseStatus(res, 400, "Failed to create API Key");
      return Response.responseStatus(
        res,
        201,
        `API Key created successfully for the user(${user.email})`
      );
    } catch (error) {
      console.log(error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return Response.responseStatus(res, 404, "Email doesn't exists");
      }

      const token = jwt.sign(user, APP_KEY, { expiresIn: "30m" });
      const resetLink = `${FRONT_END_URL}/reset_password/${token}`;

      const mailSubject = "Password Reset Request - Refex Contacts";
      const mailContent = `
      <p>Dear ${user.first_name},</p>
      <p>We have received a request to reset your password for Refex Contacts. To proceed, please click the following link:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>If you did not initiate this password reset, kindly disregard this email.</p>
      <p>Thank you for using Refex Contacts.</p>
      <div style="text-align: center;">
  <a href="#">
      <img src="http:localhost:3001/assets/Refex-Logo.png" alt="Refex Contacts" style="max-width: 100px;">
  </a>
</div>
  `;

      // sendMail(email, mailSubject, mailContent, null, (error, info) => {
      //   if (error) {
      //     return Response.responseStatus(
      //       res,
      //       400,
      //       "Password reset link mail failed to send",
      //       error
      //     );
      //   } else {
      //     return Response.responseStatus(
      //       res,
      //       200,
      //       "Password reset link mail sent successfully",
      //       info
      //     );
      //   }
      // });
    } catch (error) {
      console.log(error.message);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { password, confirm_password } = req.body;
      if (password !== confirm_password) {
        return Response.responseStatus(
          res,
          400,
          "Password and confirm password doesn't match"
        );
      }
      const hashedPassword = bcrypt.hashSync(confirm_password, saltRounds);
      // Verify token
      const decoded = jwt.verify(token, APP_KEY);
      const result = await User.update(
        {
          password: hashedPassword,
        },
        { where: { id: decoded.user.id } }
      );
      if (!result) {
        return Response.responseStatus(res, 400, "Password reset failed");
      }
      return Response.responseStatus(res, 200, "Password reseted successfully");
    } catch (error) {
      console.log(error.message);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  verifyToken: async (req, res) => {
    try {
      const { token } = req.params;
      // Verify token
      const decoded = jwt.verify(token, APP_KEY);
      return Response.responseStatus(res, 200, "Valid Token", decoded);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return Response.responseStatus(res, 401, "Token has expired!");
      } else {
        return Response.responseStatus(res, 401, "Invalid token!");
      }
    }
  },
};

module.exports = authController;

