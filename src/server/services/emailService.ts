import nodemailer from 'nodemailer';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

let transporterInstance: any = null;

function getTransporter() {
  if (transporterInstance) {
    return transporterInstance;
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn(
      '⚠️ Nodemailer: SMTP credentials (EMAIL_USER / EMAIL_PASS) are not set. Emails will be logged to console in Sandbox Mode.'
    );
    return null;
  }

  try {
    transporterInstance = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
    return transporterInstance;
  } catch (error) {
    console.error('❌ Failed to initialize Nodemailer SMTP transporter:', error);
    return null;
  }
}

/**
 * Sends structured HTML email with graceful logs fallback
 */
export async function sendEmail({ to, subject, html }: EmailPayload): Promise<boolean> {
  const trans = getTransporter();

  if (!trans) {
    console.log(`✉️ [SMTP Sandbox Mode] Simulated email transmission:`);
    console.log(`   To:      ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Content: ${html.substring(0, 300)}...`);
    return true;
  }

  try {
    const info = await trans.sendMail({
      from: `"Portfolio Contact Core" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return true;
  } catch (err: any) {
    console.error(`❌ SMTP execution error:`, err?.message || err);
    return false;
  }
}

/**
 * Orchestrate Contact Form Emails (Admin Alert + Visitor Auto-Response)
 */
export async function handleContactFormEmails(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  // 1. Owner Admin Alert Email
  const adminEmail = process.env.EMAIL_USER || 'portfolio-admin@gmail.com';
  const adminHtml = `
    <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; color: #1e293b; background: #fafafa;">
      <h2 style="color: #6d28d9; margin-top: 0;">New Inquiry Transmission Received</h2>
      <p style="font-size: 14px; margin-bottom: 20px; color: #64748b;">A visitor submitted a message on your animated portfolio website.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 30%;">Name:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #334155;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Visitor Email:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #334155;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Subject:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #334155;">${subject}</td>
        </tr>
      </table>
      
      <div style="background: white; border: 1px solid #f1f5f9; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
        <p style="font-weight: bold; font-size: 13px; margin-top: 0; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">Message Body:</p>
        <p style="font-size: 14px; line-height: 1.6; color: #0f172a; margin: 0; white-space: pre-wrap;">${message}</p>
      </div>

      <div style="font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 15px;">
        Received from Port 3000 Portfolio API Engine.
      </div>
    </div>
  `;

  // 2. Visitor Automated Confirmation Email
  const visitorHtml = `
    <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #ddd; border-radius: 12px; padding: 24px; background: #ffffff; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #6d28d9; margin: 0; font-size: 24px;">Message Received!</h1>
        <p style="color: #666; margin: 5px 0 0 0;">Krishna Singh's Portfolio Portal</p>
      </div>
      
      <p style="font-size: 15px; line-height: 1.5;">Hi <strong>${name}</strong>,</p>
      <p style="font-size: 15px; line-height: 1.5;">Thank you for getting in touch! I have successfully received your inquiry regarding <strong>"${subject}"</strong>.</p>
      <p style="font-size: 15px; line-height: 1.5;">This is an automated confirmation to let you know your query is in my delivery log. I will review the message parameters and get back to you shortly.</p>
      
      <blockquote style="background: #f8fafc; border-left: 4px solid #6d28d9; padding: 12px 16px; margin: 20px 0; color: #555; font-style: italic; font-size: 14px; border-radius: 0 8px 8px 0;">
        "${message.length > 100 ? message.substring(0, 100) + '...' : message}"
      </blockquote>

      <p style="font-size: 14px; color: #777;">Best regards,<br/><strong>Krishna Singh</strong><br/>BCA student, Systems Developer</p>
      
      <div style="font-size: 10px; color: #aaa; text-align: center; border-top: 1px solid #eee; margin-top: 25px; padding-top: 15px;">
        This automated response was transmitted from the animated portfolio contact node. Please do not reply directly to this mail.
      </div>
    </div>
  `;

  // Trigger outbound concurrently
  await Promise.all([
    sendEmail({ to: adminEmail, subject: `📬 Portfolio: Message from ${name} - ${subject}`, html: adminHtml }),
    sendEmail({ to: email, subject: `🤖 Confirmation: Your Portfolio message was logged!`, html: visitorHtml })
  ]).catch(err => {
    console.error('⚠️ outbound concurrent email execution warning:', err);
  });
}
