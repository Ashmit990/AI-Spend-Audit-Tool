import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendConfirmationEmail({
  email,
  totalMonthlySavings,
  auditUrl,
}: {
  email: string;
  totalMonthlySavings: number;
  auditUrl: string;
}) {
  if (!resend) {
    console.warn('Resend API key is missing. Skipping email send.');
    return { success: false, error: 'Resend API key not configured' };
  }

  try {
    const data = await resend.emails.send({
      from: 'Credex Audits <onboarding@resend.dev>', // Resend sandbox default sender
      to: email,
      subject: `Your Credex AI Spend Audit: Save $${totalMonthlySavings.toFixed(2)}/mo!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #4f46e5; margin-bottom: 20px;">Your AI Spend Audit Report is Ready!</h2>
          <p>Thank you for auditing your startup's AI spend with Credex.</p>
          <p>We found that you can optimize your usage and save up to <strong>$${totalMonthlySavings.toFixed(2)} per month</strong> ($${(totalMonthlySavings * 12).toFixed(2)} annually)!</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${auditUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
              View Full Interactive Audit Results
            </a>
          </div>

          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="font-size: 14px; color: #666;">
            <strong>Want to claim discounted AI credits?</strong><br />
            Credex helps early-stage startups get up to 50% off their API usage. Reply directly to this email or click the CTA in your dashboard to schedule a free credentials consolidation consult.
          </p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error sending email via Resend:', error);
    return { success: false, error: message };
  }
}
