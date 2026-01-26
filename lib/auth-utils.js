// Get Current User from Request
// Path: lib/auth-utils.js

import jwt from 'jsonwebtoken';

export function getCurrentUser(request) {
  try {
    const userId = request.headers.get('x-user-id');
    const email = request.headers.get('x-user-email');
    const userType = request.headers.get('x-user-type');

    if (!userId) return null;

    return {
      id: userId,
      email,
      userType,
    };
  } catch {
    return null;
  }
}

export function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

export function generateToken(payload, secret, expiresIn = '7d') {
  return jwt.sign(payload, secret, { expiresIn });
}
