const { User } = require("../models");
const bcrypt = require("bcryptjs");
const Response = require("../helpers/response");
const { validationResult } = require("express-validator");
const saltRounds = 10;

const userManagementController = {
  // Get all users (excluding soft deleted)
  list: async (req, res) => {
    try {
      const users = await User.findAll({
        where: { deleted_at: null },
        attributes: { exclude: ['password'] },
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            required: false
          },
          {
            model: User,
            as: 'modifier',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            required: false
          }
        ]
      });
      return Response.responseStatus(res, 200, "Users retrieved successfully", users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  // Get single user by ID
  get: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            required: false
          },
          {
            model: User,
            as: 'modifier',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            required: false
          }
        ]
      });
      
      if (!user || user.deleted_at) {
        return Response.responseStatus(res, 404, "User not found");
      }
      
      return Response.responseStatus(res, 200, "User retrieved successfully", user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  // Create new user
  create: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return Response.responseStatus(res, 400, "Validation Failed", errors.array());
      }

      // Accept both camelCase and snake_case
      const first_name = req.body.first_name || req.body.firstName;
      const last_name = req.body.last_name || req.body.lastName;
      const email = req.body.email;
      const password = req.body.password;
      const user_type = req.body.user_type || req.body.userType;
      const mobile_number = req.body.mobile_number || req.body.mobileNumber;
      const is_active = req.body.is_active !== undefined ? req.body.is_active : (req.body.isActive !== undefined ? req.body.isActive : true);
      const allowed_cms_pages = req.body.allowed_cms_pages || req.body.allowedCmsPages;
      const currentUser = req.user;

      // Check if user already exists
      const existingUser = await User.findOne({ 
        where: { email, deleted_at: null } 
      });
      
      if (existingUser) {
        return Response.responseStatus(res, 400, "User with this email already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password || 'DefaultPassword123!', saltRounds);

      // Create user
      const newUser = await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        user_type: user_type || 'Regular User',
        mobile_number: mobile_number || null,
        is_active: is_active !== undefined ? is_active : true,
        allowed_cms_pages: allowed_cms_pages ? (typeof allowed_cms_pages === 'string' ? allowed_cms_pages : JSON.stringify(allowed_cms_pages)) : null,
        created_by: currentUser?.id || null,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser.toJSON();
      
      return Response.responseStatus(res, 201, "User created successfully", userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  // Update user
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { first_name, last_name, email, password, user_type, mobile_number, is_active, allowed_cms_pages, allowedCmsPages } = req.body;
      const currentUser = req.user;

      const user = await User.findByPk(id);
      
      if (!user || user.deleted_at) {
        return Response.responseStatus(res, 404, "User not found");
      }

      // Check if email is being changed and if it already exists
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ 
          where: { email, deleted_at: null } 
        });
        if (existingUser) {
          return Response.responseStatus(res, 400, "User with this email already exists");
        }
      }

      // Prepare update data
      const allowedPages = allowed_cms_pages !== undefined ? allowed_cms_pages : (allowedCmsPages !== undefined ? allowedCmsPages : user.allowed_cms_pages);
      const updateData = {
        first_name: first_name !== undefined ? first_name : user.first_name,
        last_name: last_name !== undefined ? last_name : user.last_name,
        email: email !== undefined ? email : user.email,
        user_type: user_type !== undefined ? user_type : user.user_type,
        mobile_number: mobile_number !== undefined ? mobile_number : user.mobile_number,
        is_active: is_active !== undefined ? is_active : user.is_active,
        allowed_cms_pages: allowedPages !== undefined ? (typeof allowedPages === 'string' ? allowedPages : JSON.stringify(allowedPages)) : user.allowed_cms_pages,
        modified_by: currentUser?.id || null,
      };

      // Hash password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, saltRounds);
      }

      await User.update(updateData, { where: { id } });

      // Fetch updated user
      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      return Response.responseStatus(res, 200, "User updated successfully", updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  // Soft delete user
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      const user = await User.findByPk(id);
      
      if (!user || user.deleted_at) {
        return Response.responseStatus(res, 404, "User not found");
      }

      // Prevent self-deletion
      if (user.id === currentUser?.id) {
        return Response.responseStatus(res, 400, "You cannot delete your own account");
      }

      await User.update(
        { 
          deleted_by: currentUser?.id || null,
          deleted_at: new Date()
        },
        { where: { id } }
      );

      return Response.responseStatus(res, 200, "User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  // Toggle user active status
  toggleActive: async (req, res) => {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      const user = await User.findByPk(id);
      
      if (!user || user.deleted_at) {
        return Response.responseStatus(res, 404, "User not found");
      }

      // Prevent self-deactivation
      if (user.id === currentUser?.id) {
        return Response.responseStatus(res, 400, "You cannot deactivate your own account");
      }

      const newActiveStatus = !user.is_active;

      await User.update(
        { 
          is_active: newActiveStatus,
          modified_by: currentUser?.id || null
        },
        { where: { id } }
      );

      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      return Response.responseStatus(res, 200, `User ${newActiveStatus ? 'activated' : 'deactivated'} successfully`, updatedUser);
    } catch (error) {
      console.error("Error toggling user status:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
};

module.exports = userManagementController;

