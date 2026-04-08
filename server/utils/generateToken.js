import jwt from 'jsonwebtoken';

/**
 * Creates a signed JWT for a given user id.
 * @param {string} userId
 * @returns {string}
 */
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
