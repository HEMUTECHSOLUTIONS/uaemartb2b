// API Route: Authentication - Register
// Path: /api/auth/register/route.js

import { userDb, companyDb } from '@/lib/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password, full_name, phone, user_type, company_name } = await request.json();
    
    // Validate input
    if (!email || !password || !full_name || !user_type) {
      return Response.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate password strength
    if (password.length < 8) {
      return Response.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await userDb.create({
      email,
      password_hash,
      full_name,
      phone,
      user_type,
    });

    // If registering a seller, create a company profile
    let company = null;
    if (user_type === 'seller') {
      // Require company_name for seller registration
      if (!company_name) {
        return Response.json(
          { success: false, error: 'Company name is required for sellers' },
          { status: 400 }
        );
      }
      company = await companyDb.create({
        user_id: user.id,
        company_name,
        email,
        phone,
        status: 'pending',
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        userType: user.user_type,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const { password_hash: _, ...userWithoutPassword } = user;
    
    return Response.json(
      {
        success: true,
        data: {
          user: userWithoutPassword,
          token,
          company,
        },
        message: 'Registration successful',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during registration:', error);
    
    // Handle duplicate email error
    if (error.code === '23505') {
      return Response.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
