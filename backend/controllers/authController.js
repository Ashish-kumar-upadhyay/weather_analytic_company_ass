const Joi = require("joi");
const jwt = require("jsonwebtoken");
const authService = require("../services/authService");
const { sendError, sendSuccess } = require("../utils/responseHandler");
const { STATUS_CODE } = require("../constants/application_constant");
const { JWT_SECRET } = require("../config/constants");
const { sendResetEmail } = require("../services/emailService");

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).max(128).required(),
});

/**
 * POST /api/auth/register — Email + Password signup
 */
const register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2000");
    }

    const { name, password } = value;
    const email = value.email.toLowerCase().trim(); // Convert to lowercase and trim

    // Check if user exists
    const existingUser = await authService.findByEmail(email);
    if (existingUser) {
      return sendError(res, STATUS_CODE.CONFLICT, "2003");
    }

    // Create user
    const user = await authService.createUserInDB({
      email,
      name,
      password,
    });

    const token = authService.generateToken(user);
    const userData = authService.formatUserResponse(user);

    return sendSuccess(res, "5002", {
      user: userData,
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login — Email + Password login
 */
const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2000");
    }

    const { password } = value;
    const email = value.email.toLowerCase().trim(); // Convert to lowercase and trim

    const user = await authService.findByEmail(email);
    if (!user) {
      return sendError(res, STATUS_CODE.UNAUTHORIZED, "2002");
    }

    if (!user.password_hash) {
      return sendError(res, STATUS_CODE.UNAUTHORIZED, "2051");
    }

    const isMatch = await authService.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return sendError(res, STATUS_CODE.UNAUTHORIZED, "2002");
    }

    if (!user.is_active) {
      return sendError(res, STATUS_CODE.FORBIDDEN, "2056");
    }

    const token = authService.generateToken(user);
    const userData = authService.formatUserResponse(user);

    return sendSuccess(res, "5003", {
      user: userData,
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/google — Google OAuth login/signup
 * Frontend sends Supabase access_token after Google OAuth
 */
const googleLogin = async (req, res, next) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2054");
    }

    // Verify with Supabase
    const supabaseUser = await authService.verifySupabaseToken(access_token);

    if (!supabaseUser || !supabaseUser.email) {
      return sendError(res, STATUS_CODE.UNAUTHORIZED, "2038");
    }

    // Check if user exists in our DB
    let user = await authService.findByEmail(supabaseUser.email);

    if (!user) {
      // Create new user
      user = await authService.createUserInDB({
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email.split("@")[0],
        google_id: supabaseUser.id,
        avatar_url: supabaseUser.user_metadata?.avatar_url || null,
        supabase_uid: supabaseUser.id,
      });
    } else if (!user.google_id) {
      // Link Google account to existing email user
      user.google_id = supabaseUser.id;
      user.supabase_uid = supabaseUser.id;
      if (supabaseUser.user_metadata?.avatar_url) {
        user.avatar_url = supabaseUser.user_metadata.avatar_url;
      }
      await user.save();
    }

    if (!user.is_active) {
      return sendError(res, STATUS_CODE.FORBIDDEN, "2056");
    }

    const token = authService.generateToken(user);
    const userData = authService.formatUserResponse(user);

    return sendSuccess(res, "5003", {
      user: userData,
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me — Get current user
 */
const getMe = async (req, res, next) => {
  try {
    const userData = authService.formatUserResponse(req.user);
    return sendSuccess(res, "5060", { user: userData });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/forgot-password — Send reset email
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2000");
    }

    const email = value.email.toLowerCase().trim(); // Convert to lowercase and trim
    const user = await authService.findByEmail(email);

    if (!user) {
      return sendError(res, STATUS_CODE.NOT_FOUND, "2001");
    }

    // Generate reset token (expires in 1 hour)
    // This works for both email/password and Google accounts
    // Google users can set a password to enable email/password login
    const resetToken = jwt.sign({ id: user.id, purpose: "reset" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    await sendResetEmail(email, resetToken);

    return sendSuccess(res, "5005");
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/reset-password — Reset password with token
 */
const resetPassword = async (req, res, next) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2000");
    }

    const { token, password } = value;

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2004");
    }

    if (decoded.purpose !== "reset") {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2004");
    }

    const { User } = require("../models");
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return sendError(res, STATUS_CODE.NOT_FOUND, "2001");
    }

    user.password_hash = await authService.hashPassword(password);
    await user.save();

    return sendSuccess(res, "5006");
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    // JWT is stateless — client just removes the token
    // We can add token blacklisting later if needed
    return sendSuccess(res, "5004");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
};
