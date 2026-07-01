import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ── Upload image from base64 or URL ──────────────────────────
export async function uploadImage(
  source: string,
  folder: string = "vogu-store/products"
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(source, {
    folder,
    transformation: [
      { width: 1200, height: 1600, crop: "fill", gravity: "center" },
      { quality: "auto:good" },
      { fetch_format: "auto" },
    ],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

// ── Delete image ──────────────────────────────────────────────
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

// ── Generate optimized image URL ─────────────────────────────
export function getOptimizedUrl(
  url: string,
  width: number = 600,
  height: number = 800
): string {
  return cloudinary.url(url, {
    width,
    height,
    crop: "fill",
    quality: "auto:good",
    fetch_format: "auto",
  });
}

export default cloudinary;