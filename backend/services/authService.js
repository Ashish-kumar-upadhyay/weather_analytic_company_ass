const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/constants");
const { User, UserLimit } = require("../models");
const { supabaseAdmin } = require("../config/supabase");
const appConfigService = require("./appConfigService");

/**
 * Hash password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare password
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Create user in our DB + assign default quota
 */
const createUserInDB = async ({ email, name, password, google_id, avatar_url, supabase_uid }) => {
  let password_hash = null;
  if (password) {
    password_hash = await hashPassword(password);
  }

  const user = await User.create({
    email,
    name,
    password_hash,
    google_id: google_id || null,
    avatar_url: avatar_url || null,
    supabase_uid: supabase_uid || null,
    role: "user",
    unit_pref: "celsius",
  });

  // Create default user limit (read from DB config)
  const defaultLimit = appConfigService.getInt("DEFAULT_USER_LIMIT");
  await UserLimit.create({
    user_id: user.id,
    daily_limit: defaultLimit,
  });

  return user;
};

/**
 * Find user by email
 */
const findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

/**
 * Find user by Google ID
 */
const findByGoogleId = async (googleId) => {
  return await User.findOne({ where: { google_id: googleId } });
};

/**
 * Verify Supabase token and get user info
 */
const verifySupabaseToken = async (accessToken) => {
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error) {
    throw new Error("Invalid Supabase token: " + error.message);
  }
  return data.user;
};

/**
 * Format user for response (exclude sensitive fields)
 */
const formatUserResponse = (user) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    unit_pref: user.unit_pref,
    avatar_url: user.avatar_url,
    is_active: user.is_active,
    created_at: user.created_at,
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  createUserInDB,
  findByEmail,
  findByGoogleId,
  verifySupabaseToken,
  formatUserResponse,
};
