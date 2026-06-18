import { supabase } from "./supabase";

/**
 * Deployment steps for email notifications:
 *
 * 1. Install Supabase CLI: https://supabase.com/docs/guides/cli
 * 2. Login: supabase login
 * 3. Link project: supabase link --project-ref YOUR_PROJECT_REF
 * 4. Deploy function: supabase functions deploy send-email
 * 5. Set secret: supabase secrets set RESEND_API_KEY=re_YOUR_KEY
 * 6. Get a free Resend API key at: https://resend.com
 * 7. Update "from" address in supabase/functions/send-email/index.ts
 *    to use your verified Resend domain.
 */
export async function sendNotificationEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { data, error } = await supabase().functions.invoke("send-email", {
    body: { to, subject, html: body },
  });

  if (error) {
    const msg = error.message ?? String(error);
    if (msg.includes("not found") || msg.includes("404")) {
      throw new Error(
        "Edge Function غير مُنشأة بعد. اتبع الخطوات: supabase functions deploy send-email ثم supabase secrets set RESEND_API_KEY=re_xxxx",
      );
    }
    throw error;
  }

  return data;
}

/**
 * Send a test notification email to verify the email setup works.
 */
export async function sendTestEmail(to: string) {
  return sendNotificationEmail({
    to,
    subject: "اختبار إشعارات نظام إدارة الأيتام",
    body: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #3b7e5c; margin-bottom: 16px;">✅ تم إرسال الإشعار بنجاح</h2>
        <p style="color: #374151; line-height: 1.8;">
          هذه رسالة اختبارية من <strong>نظام إدارة الأيتام</strong> للتأكد من أن إشعارات البريد الإلكتروني تعمل بشكل صحيح.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          تم الإرسال في ${new Date().toLocaleString("ar-EG")}
        </p>
      </div>
    `,
  });
}

/**
 * Notify admin about a new sponsorship.
 */
export async function notifyNewSponsorship(
  adminEmail: string,
  sponsorName: string,
  orphanName: string,
) {
  return sendNotificationEmail({
    to: adminEmail,
    subject: `كفالة جديدة: ${sponsorName} → ${orphanName}`,
    body: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #3b7e5c;">🤝 كفالة جديدة</h2>
        <p style="color: #374151; line-height: 1.8;">
          تم إنشاء كفالة جديدة بين الكفيل <strong>${sponsorName}</strong> واليتيم <strong>${orphanName}</strong>.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          نظام إدارة الأيتام - ${new Date().toLocaleString("ar-EG")}
        </p>
      </div>
    `,
  });
}

/**
 * Notify admin about an urgent case.
 */
export async function notifyUrgentCase(
  adminEmail: string,
  orphanName: string,
  priority: number,
) {
  return sendNotificationEmail({
    to: adminEmail,
    subject: `⚠️ حالة عاجلة: ${orphanName} (أولوية ${priority})`,
    body: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #dc2626;">⚠️ حالة عاجلة</h2>
        <p style="color: #374151; line-height: 1.8;">
          اليتيم <strong>${orphanName}</strong> لديه أولوية <strong>${priority}</strong> ويحتاج اهتماماً عاجلاً.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          نظام إدارة الأيتام - ${new Date().toLocaleString("ar-EG")}
        </p>
      </div>
    `,
  });
}
