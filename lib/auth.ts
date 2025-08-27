import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    signIn: async ({ user, account, profile, email, credentials }) => {
      // For new users, they'll be created with pending status by default
      // For existing users, check their status
      if (user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        })
        
        if (existingUser) {
          // Check if user is approved
          if (existingUser.status === 'approved') {
            return true
          } else if (existingUser.status === 'rejected') {
            return '/register?error=rejected'
          } else {
            // Pending users can sign in but will be redirected
            return true
          }
        }
        // New users are allowed to sign in (will be created as pending)
        return true
      }
      return false
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub!
      }
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
}