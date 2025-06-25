// scripts/seedAdmin.js
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function createAdmin() {
  try {
    await connectDB();
    
    // Admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@skymed.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@SkyMed2024!';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';
    const adminPhone = process.env.ADMIN_PHONE || '+1234567890';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: adminEmail.toLowerCase() 
    });
    
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Create admin user
    const admin = await User.create({
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      name: adminName,
      role: 'admin',
      userType: 'individual',
      phoneNumber: adminPhone,
      emailVerified: true,
      isActive: true,
      metadata: {
        loginCount: 0,
        registrationIP: '127.0.0.1'
      }
    });
    
    console.log('✅ Admin created successfully');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('\n⚠️  Please change the default password after first login!');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the script
// createAdmin();