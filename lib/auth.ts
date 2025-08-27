import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import { isAuthorizedUser } from '@/lib/authorized-users'

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
    signIn: async ({ user, account, profile }) => {
      console.log('Sign-in attempt for email:', user.email)
      
      // Check if user is authorized
      const isAuthorized = isAuthorizedUser(user.email)
      console.log('Is authorized:', isAuthorized)
      
      if (!isAuthorized) {
        console.log('User not authorized:', user.email)
        // Return false to prevent sign-in
        return false
      }
      
      console.log('User authorized, allowing sign-in')
      return true
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