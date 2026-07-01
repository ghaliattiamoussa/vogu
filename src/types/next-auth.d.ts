import NextAuth, { DefaultSession } from "next-auth";
import { Role as PrismaRole } from "@prisma/client";

// ✅ نمدد الـ Role ليشمل VENDOR
type ExtendedRole = PrismaRole | "VENDOR";

declare module "next-auth" {
  interface User {
    id: string;
    role: ExtendedRole;
    image?: string | null;
    storeName?: string; // ← اسم متجر التاجر (يُستخدم فقط إذا كان role = VENDOR)
  }
  interface Session {
    user: {
      id: string;
      role: ExtendedRole;
      storeName?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: ExtendedRole;
    storeName?: string;
  }
}