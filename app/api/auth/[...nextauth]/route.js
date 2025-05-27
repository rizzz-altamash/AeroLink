// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };




























// app/api/auth/[...nextauth]/route.js
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import bcrypt from "bcryptjs";
// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/User";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Invalid credentials");
//         }

//         await connectDB();
        
//         const user = await User.findOne({ 
//           email: credentials.email.toLowerCase() 
//         }).populate('hospitalId');

//         if (!user || !user.password) {
//           throw new Error("Invalid credentials");
//         }

//         // Check if email is verified
//         if (!user.emailVerified) {
//           throw new Error("Please verify your email before signing in");
//         }

//         // Check if account is active (for pilots)
//         if (user.role === 'pilot' && !user.isActive) {
//           throw new Error("Your pilot account is pending verification");
//         }

//         const isPasswordValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isPasswordValid) {
//           throw new Error("Invalid credentials");
//         }

//         // Update login metadata
//         user.metadata.lastLogin = new Date();
//         user.metadata.loginCount += 1;
//         await user.save();

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//           role: user.role,
//           userType: user.userType,
//           hospitalId: user.hospitalId?._id.toString(),
//           hospitalName: user.hospitalId?.name,
//           phoneNumber: user.phoneNumber
//         };
//       }
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//       async profile(profile) {
//         await connectDB();
        
//         let user = await User.findOne({ email: profile.email.toLowerCase() });
        
//         if (!user) {
//           // Create new user from Google profile
//           user = await User.create({
//             email: profile.email.toLowerCase(),
//             name: profile.name,
//             role: 'customer',
//             userType: 'individual',
//             provider: 'google',
//             providerId: profile.sub,
//             profileImage: profile.picture,
//             emailVerified: profile.email_verified,
//             phoneNumber: '', // Will need to be updated later
//             metadata: {
//               loginCount: 1,
//               lastLogin: new Date()
//             }
//           });
//         } else {
//           // Update existing user
//           user.metadata.lastLogin = new Date();
//           user.metadata.loginCount += 1;
//           await user.save();
//         }
        
//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//           role: user.role,
//           userType: user.userType,
//           hospitalId: user.hospitalId?.toString(),
//           image: user.profileImage
//         };
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user, account }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//         token.userType = user.userType;
//         token.hospitalId = user.hospitalId;
//         token.hospitalName = user.hospitalName;
//         token.phoneNumber = user.phoneNumber;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session?.user) {
//         session.user.id = token.id;
//         session.user.role = token.role;
//         session.user.userType = token.userType;
//         session.user.hospitalId = token.hospitalId;
//         session.user.hospitalName = token.hospitalName;
//         session.user.phoneNumber = token.phoneNumber;
//       }
//       return session;
//     }
//   },
//   pages: {
//     signIn: '/auth/signin',
//     error: '/auth/error',
//     verifyRequest: '/auth/verify',
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };