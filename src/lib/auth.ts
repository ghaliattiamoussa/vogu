// src/lib/auth.ts
// ✅ المصدر الوحيد للحقيقة (single source of truth) لـ authOptions
// كل المسارات (route handlers, API, pages) لازم تستورد من هنا.
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  // ✅ استخدام نفس الـ adapter الحديث في كل مكان (توحيد شكل الـ token)
  adapter: PrismaAdapter(db) as any,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان");
        }

        const email = credentials.email;

        // 1) البحث عن مستخدم عادي (العملاء والأدمن)
        const user = await db.user.findUnique({
          where: { email },
        });

        if (user && user.password) {
          const valid = await bcrypt.compare(credentials.password, user.password);
          if (valid) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role,
            } as any;
          }
        }

        // 2) البحث عن تاجر
        //    ⚠️ مهم: التاجر موجود في جدول vendors وليس users،
        //    لذلك نستخدم id التاجر ولكن مع role=VENDOR حتى نعرف ذلك لاحقاً
        //    ولا نسمح له بإنشاء عناوين/طلبات (لأن FK يشير لجدول users).
        const vendor = await db.vendor.findUnique({
          where: { email },
        });

        if (vendor && vendor.password) {
          const valid = await bcrypt.compare(credentials.password, vendor.password);
          if (valid) {
            return {
              id: vendor.id,
              email: vendor.email,
              name: vendor.contactName,
              storeName: vendor.storeName,
              role: "VENDOR",
              image: null,
            } as any;
          }
        }

        throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "CUSTOMER";
        token.storeName = (user as any).storeName;
      }

      // استرجاع id من DB لو الجلسة قديمة أو Google OAuth
      if (!token.id && token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email as string },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // ✅ نمرّر id + role من الـ token إلى الـ session دائماً
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        (session.user as any).storeName = token.storeName;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};
