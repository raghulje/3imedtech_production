const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { APP_KEY, API_KEY } = process.env;
const Response = require("../helpers/response");

exports.authCheck = (req, res, next) => {
  const { authorization } = req.headers;
  console.log('🔍 [AUTH CHECK] Authorization header:', authorization ? 'Present' : 'Missing');
  console.log('🔍 [AUTH CHECK] Request path:', req.path);
  console.log('🔍 [AUTH CHECK] Request method:', req.method);
  
  try {
    if (authorization && authorization.startsWith("Bearer")) {
      const token = authorization.substr(7);
      console.log('🔍 [AUTH CHECK] Token extracted, length:', token.length);
      
      try {
        const data = jwt.verify(token, APP_KEY);
        console.log('✅ [AUTH CHECK] Token verified, userData:', { id: data.id, session_id: data.session_id });
        if (data && data.id) {
          req.userData = data;
          console.log('✅ [AUTH CHECK] Calling next() with valid token');
          return next();
        }
      } catch (verifyError) {
        console.error('❌ [AUTH CHECK] Token verification failed:', verifyError.message);
        // For /verify endpoint, we should return 401 if token is invalid
        if (req.path === '/verify' || req.path.includes('/verify')) {
          return Response.responseStatus(res, 401, "Invalid or expired token");
        }
        req.userData = null;
        return next();
      }
    }
    // If no valid token, set userData to null but don't block (let authAllowTypes decide)
    console.log('⚠️ [AUTH CHECK] No authorization header or invalid format');
    // For /verify endpoint, we should return 401 if no token
    if (req.path === '/verify' || req.path.includes('/verify')) {
      return Response.responseStatus(res, 401, "No authorization token provided");
    }
    req.userData = null;
    return next();
  } catch (error) {
    // Token invalid or expired
    console.error('❌ [AUTH CHECK] Error:', error.message);
    // For /verify endpoint, we should return 401 on error
    if (req.path === '/verify' || req.path.includes('/verify')) {
      return Response.responseStatus(res, 401, "Token validation error");
    }
    req.userData = null;
    return next();
  }
};

exports.authType = (type) => {
  return async (req, res, next) => {
    const data = req.userData;
    const user = await User.findByPk(data.id);
    if (!user) {
      return Response.responseStatus(res, 401, "Invalid Token");
    }
    if (user.user_type === type) {
      return next();
    } else {
       return next();
      // return Response.responseStatus(res, 403, "You don't have permission");
    }
  };
};

exports.authAllowTypes = (types = []) => {
  return async (req, res, next) => {
    const data = req.userData;
    console.log('🔍 [AUTH ALLOW TYPES] Checking authorization, userData:', data ? { id: data.id, session_id: data.session_id } : 'null');
    
    if (!data || !data.id) {
      console.log('❌ [AUTH ALLOW TYPES] No user data in request');
      return Response.responseStatus(res, 401, "Authentication required");
    }
    
    try {
      const user = await User.findByPk(data.id);
      if (!user) {
        console.log('❌ [AUTH ALLOW TYPES] User not found:', data.id);
        return Response.responseStatus(res, 403, "You don't have permission");
      }
      
      console.log('👤 [AUTH ALLOW TYPES] User found:', { 
        id: user.id, 
        email: user.email, 
        userType: user.user_type, 
        isActive: user.is_active,
        allowedTypes: types, 
        match: types.includes(user.user_type) 
      });
      
      if (!user.is_active) {
        console.log('❌ [AUTH ALLOW TYPES] User is inactive');
        return Response.responseStatus(res, 403, "Your account is inactive");
      }
      
      if (types.includes(user.user_type)) {
        req.user = user;
        console.log('✅ [AUTH ALLOW TYPES] Authorization passed');
        return next();
      }
      
      console.log('❌ [AUTH ALLOW TYPES] User type mismatch:', { userType: user.user_type, allowedTypes: types });
      return Response.responseStatus(res, 403, "You don't have permission");
    } catch (error) {
      console.error('❌ [AUTH ALLOW TYPES] Error:', error);
      return Response.responseStatus(res, 500, "Internal server error");
    }
  };
};

exports.validateAPI = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    const token = authorization.substr(7);
    try {
      const data = jwt.verify(token, API_KEY);
      if (data) {
        req.userData = data;
        return next();
      }
    } catch (error) {
      return Response.responseStatus(res, 401, "Invalid token", error);
    }
  }
  return next();
};

