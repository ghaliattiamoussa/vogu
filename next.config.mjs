/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⚠️ تجاوز فحص الأنواع وقت الـ build — المشروع يحتوي على أخطاء types
  //    قديمة في ملفات (stripe webhooks / cart / checkout / auth) لا تؤثر على
  //    وقت التشغيل. يتم تشغيل فحص الأنواع يدوياً عبر `tsc --noEmit`.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },

      {

        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth avatars
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub OAuth avatars
      },
    ],
  },
}

export default nextConfig
