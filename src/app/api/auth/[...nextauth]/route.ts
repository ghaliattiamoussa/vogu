// src/app/api/auth/[...nextauth]/route.ts
// ✅ المصدر الوحيد لـ authOptions الآن هو "@/lib/auth".
//    هذا الملف فقط يُشغّل الـ handler ولا يُعرّف authOptions مستقلة،
//    حتى يضمن أن كل المسارات تقرأ الجلسة بنفس شكل الـ token.
//    ملاحظة: لا تُصدِّر authOptions من ملف route — Next.js لا يسمح إلا
//    بتصدير دوال HTTP (GET/POST/...). استوردها دائماً من "@/lib/auth".
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
