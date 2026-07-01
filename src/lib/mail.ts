// src/lib/mail.ts
// إرسال الإيميلات عبر Resend

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM    = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
const APP_URL = process.env.NEXTAUTH_URL      ?? 'http://localhost:3000';

// ══════════════════════════════════════════════════════════
// إرسال إيميل التحقق من الحساب
// ══════════════════════════════════════════════════════════
export async function sendVerificationEmail(
  email: string,
  name:  string,
  token: string,
) {
const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from:    `VŌGU Store <${FROM}>`,
    to:      email,
    subject: 'تأكيد حسابك في VŌGU ✦',
    html:    buildVerificationEmail(name, verifyUrl),
  });
}

// ══════════════════════════════════════════════════════════
// إرسال إيميل إعادة تعيين كلمة المرور
// ══════════════════════════════════════════════════════════
export async function sendPasswordResetEmail(
  email: string,
  name:  string,
  token: string,
) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from:    `VŌGU Store <${FROM}>`,
    to:      email,
    subject: 'إعادة تعيين كلمة المرور — VŌGU',
    html:    buildPasswordResetEmail(name, resetUrl),
  });
}

// ══════════════════════════════════════════════════════════
// قالب إيميل التحقق
// ══════════════════════════════════════════════════════════
function buildVerificationEmail(name: string, url: string): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>تأكيد الحساب — VŌGU</title>
</head>
<body style="
  margin:0; padding:0;
  background:#070707;
  font-family:'Tajawal', Arial, sans-serif;
  direction:rtl;
">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 48px 16px;">

        <table width="560" cellpadding="0" cellspacing="0" style="
          background:#0D0D0D;
          border:1px solid #1A1A1A;
          border-radius:16px;
          overflow:hidden;
          max-width:100%;
        ">
          <!-- Header -->
          <tr>
            <td style="
              background:linear-gradient(135deg,#0D0D0D 0%,#1A1000 100%);
              padding:40px 32px;
              text-align:center;
              border-bottom:1px solid #1A1A1A;
            ">
              <div style="
                font-size:36px;
                font-weight:300;
                color:#EDE8DF;
                letter-spacing:0.2em;
                margin-bottom:6px;
              ">VŌGU</div>
              <div style="
                width:50px;
                height:1px;
                background:linear-gradient(90deg,transparent,#C9A86E,transparent);
                margin:0 auto;
              "></div>
              <div style="
                font-size:10px;
                color:#484542;
                letter-spacing:0.3em;
                margin-top:6px;
              ">أزياء فاخرة</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px; text-align:right;">
              <h1 style="
                font-size:22px;
                font-weight:700;
                color:#EDE8DF;
                margin:0 0 8px;
              ">أهلاً بك ${name}! 👋</h1>

              <p style="
                font-size:14px;
                color:#8A8480;
                line-height:1.8;
                margin:0 0 32px;
              ">
                شكراً لانضمامك إلى عائلة VŌGU. 
                لتفعيل حسابك والوصول إلى تشكيلاتنا الفاخرة،
                يرجى تأكيد بريدك الإلكتروني بالضغط على الزر أدناه.
              </p>

              <!-- CTA Button -->
              <div style="text-align:center; margin-bottom:32px;">
                <a
                  href="${url}"
                  style="
                    display:inline-block;
                    background:linear-gradient(135deg,#C9A86E,#9A7848);
                    color:#060606;
                    text-decoration:none;
                    font-size:14px;
                    font-weight:700;
                    padding:14px 40px;
                    border-radius:10px;
                    letter-spacing:0.03em;
                  "
                >
                  ✦ تأكيد الحساب
                </a>
              </div>

              <!-- Info -->
              <div style="
                background:#121212;
                border:1px solid #1A1A1A;
                border-radius:10px;
                padding:16px 20px;
                margin-bottom:24px;
              ">
                <p style="font-size:12px; color:#484542; margin:0 0 6px;">
                  ⏱ هذا الرابط صالح لمدة <strong style="color:#8A8480;">24 ساعة</strong>
                </p>
                <p style="font-size:12px; color:#484542; margin:0;">
                  🔒 إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذا الإيميل بأمان.
                </p>
              </div>

              <!-- Link fallback -->
              <p style="font-size:11px; color:#484542; line-height:1.6;">
                إذا لم يعمل الزر، انسخ هذا الرابط في المتصفح:
                <br/>
                <a href="${url}" style="color:#C9A86E; word-break:break-all;">
                  ${url}
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              padding:20px 32px;
              border-top:1px solid #1A1A1A;
              text-align:center;
            ">
              <p style="font-size:10px; color:#484542; margin:0;">
                © 2025 VŌGU Store. جميع الحقوق محفوظة.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════
// قالب إيميل إعادة تعيين كلمة المرور
// ══════════════════════════════════════════════════════════
function buildPasswordResetEmail(name: string, url: string): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#070707;font-family:Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" style="
          background:#0D0D0D;border:1px solid #1A1A1A;
          border-radius:16px;overflow:hidden;max-width:100%;
        ">
          <tr>
            <td style="
              background:linear-gradient(135deg,#0D0D0D,#1A1000);
              padding:40px 32px;text-align:center;
              border-bottom:1px solid #1A1A1A;
            ">
              <div style="font-size:36px;font-weight:300;color:#EDE8DF;letter-spacing:0.2em;">VŌGU</div>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 32px;text-align:right;">
              <h1 style="font-size:20px;color:#EDE8DF;margin:0 0 8px;">
                إعادة تعيين كلمة المرور
              </h1>
              <p style="font-size:14px;color:#8A8480;line-height:1.8;margin:0 0 32px;">
                مرحباً ${name}، تلقينا طلباً لإعادة تعيين كلمة مرور حسابك.
                اضغط على الزر أدناه لتعيين كلمة مرور جديدة.
              </p>
              <div style="text-align:center;margin-bottom:32px;">
                <a href="${url}" style="
                  display:inline-block;
                  background:linear-gradient(135deg,#C9A86E,#9A7848);
                  color:#060606;text-decoration:none;
                  font-size:14px;font-weight:700;
                  padding:14px 40px;border-radius:10px;
                ">
                  تعيين كلمة مرور جديدة
                </a>
              </div>
              <p style="font-size:12px;color:#484542;">
                ⏱ هذا الرابط صالح لمدة <strong>1 ساعة</strong> فقط.
                <br/>إذا لم تطلب إعادة التعيين، تجاهل هذا الإيميل.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #1A1A1A;text-align:center;">
              <p style="font-size:10px;color:#484542;margin:0;">© 2025 VŌGU Store</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}