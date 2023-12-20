import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import admin from 'firebase-admin';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseApp';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email' },
        password: { label: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password,
          );
          if (userCredential.user) {
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName,
              photoURL: userCredential.user.photoURL,
            };
          }

          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  // Firebase와 동일하게 세팅
  session: {
    strategy: 'jwt',
    maxAge: 3600,
  },
  callbacks: {
    // jwt 생성할 때 실행 코드
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }

      return token;
    },
    // 세션 조회시마다 실행되는 코드
    session: async ({ session }) => {
      // session.user = token.user;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: FirestoreAdapter({
    credential: admin.credential.cert({
      projectId: process.env.ADMIN_PROJECT_ID,
      clientEmail: process.env.ADMIN_CLIENT_EMAIL,
      privateKey: process.env.ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  }),
  pages: {
    signIn: '/login',
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
