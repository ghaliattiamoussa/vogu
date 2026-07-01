// src/app/api/upload/route.ts
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { verifyVendorRequest } from "@/lib/vendorAuth";

// POST /api/upload — رفع صورة (تصاميم العملاء / تجار / أدمن)
export async function POST(req: NextRequest) {
  const isDesign = req.nextUrl.searchParams.get("type") === "design";

  if (!isDesign) {
    const vendor = await verifyVendorRequest(req);
    if (!vendor) {
      const session = await getServerSession(authOptions);
      if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
      }
    }
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "لم يتم اختيار ملف" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "يجب أن يكون الملف صورة" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "الحجم الأقصى 5 ميجابايت" }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: isDesign ? "vogu/designs" : "vogu/products",
      transformation: isDesign
        ? [{ quality: "auto" }]
        : [{ width: 800, height: 1067, crop: "fill", quality: "auto" }],
    });

    return NextResponse.json({
      url: result.secure_url,
      secure_url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("[upload POST]", error);
    return NextResponse.json({ error: "فشل رفع الصورة" }, { status: 500 });
  }
}