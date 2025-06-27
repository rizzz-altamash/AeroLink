// lib/authOptions.js 
// import CredentialsProviderImport from 'next-auth/providers/credentials';
// import GoogleProviderImport from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials.js';
import GoogleProvider from 'next-auth/providers/google.js';
import { connectDB } from './mongodb.js';
import User from '../models/User.js';

// const CredentialsProvider = CredentialsProviderImport.default ?? CredentialsProviderImport;
// const GoogleProvider = GoogleProviderImport.default ?? GoogleProviderImport;

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectDB();
          
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            throw new Error('No user found with this email');
          }

          if (!user.emailVerified) {
            throw new Error('Please verify your email before logging in');
          }

          if (!user.isActive) {
            throw new Error('Your account has been deactivated');
          }

          const isPasswordValid = await user.comparePassword(credentials.password);
          
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Update last login
          await User.findByIdAndUpdate(user._id, {
            'metadata.lastLogin': new Date(),
            $inc: { 'metadata.loginCount': 1 }
          });

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            userType: user.userType,
            hospitalId: user.hospitalId?.toString(),
            image: user.profileImage
          };
        } catch (error) {
          throw new Error(error.message);
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
    newUser: '/auth/new-user'
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          await connectDB();
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user from Google account
            await User.create({
              email: user.email,
              name: user.name,
              provider: 'google',
              providerId: account.providerAccountId,
              emailVerified: true,
              profileImage: user.image,
              role: 'customer',
              userType: 'individual',
              phoneNumber: '', // Will need to be updated later
              metadata: {
                lastLogin: new Date(),
                loginCount: 1
              }
            });
          } else {
            // Update existing user
            await User.findByIdAndUpdate(existingUser._id, {
              'metadata.lastLogin': new Date(),
              $inc: { 'metadata.loginCount': 1 }
            });
          }
          
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.userType = user.userType;
        token.hospitalId = user.hospitalId;
      }
      
      if (account) {
        token.provider = account.provider;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.userType = token.userType;
        session.user.hospitalId = token.hospitalId;
        session.user.provider = token.provider;
      }
      
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};