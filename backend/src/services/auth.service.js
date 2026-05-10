const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const { ApiError } = require('../middlewares/error.middleware');
const { env } = require('../config/env');
const { UserSession } = require('../models');

class AuthService {
  async register(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new ApiError(400, 'Email already exists');
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({
      FullName: data.name,
      Email: data.email,
      PasswordHash: hashedPassword
    });
    
    return this._generateTokens(user.UserId);
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new ApiError(401, 'Invalid credentials');
    
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');
    
    return this._generateTokens(user.UserId);
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    
    const { PasswordHash, ...userData } = user.toJSON();
    return userData;
  }

  async updateProfile(userId, data) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    
    // Map frontend fields to backend model fields
    const updateData = {};
    if (data.fullName) updateData.FullName = data.fullName;
    if (data.email) updateData.Email = data.email;
    if (data.profileImageUrl) updateData.ProfileImageUrl = data.profileImageUrl;
    if (data.bio) updateData.Bio = data.bio;
    if (data.location) updateData.Location = data.location;
    if (data.language) updateData.Language = data.language;

    await userRepository.update(userId, updateData);
    return this.getProfile(userId);
  }

  async deleteAccount(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    return await userRepository.delete(userId);
  }

  async _generateTokens(userId) {
    const token = jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
    return { token, refreshToken, user: { id: userId } };
  }
}
module.exports = new AuthService();
