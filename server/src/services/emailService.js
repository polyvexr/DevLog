import { Resend } from 'resend';
import logger from "../utils/logger.js";

// Initialize Resend lazily to avoid crashing if API key is missing during startup
let resend = null;
try {
    if (process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
    } else {
        logger.warn("RESEND_API_KEY is missing. Email service will be disabled.");
    }
} catch (error) {
    logger.error("Failed to initialize Resend client", { error: error.message });
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "delivered@resend.dev";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} token - Reset token
 */
export const sendResetPasswordEmail = async (email, token) => {
    if (!resend) {
        logger.error("Cannot send email: Resend client not initialized (missing API key)");
        return { success: false, error: "Email service disabled" };
    }

    const resetUrl = `${CLIENT_URL}/reset-password/${token}`;

    try {
        const data = await resend.emails.send({
            from: `DevLog <${FROM_EMAIL}>`,
            to: [email],
            subject: "Password Reset Protocol - DevLog",
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #05070a; color: #ffffff; padding: 40px; border-radius: 15px; max-width: 600px; margin: auto; border: 1px solid #1a1c20;">
          <h2 style="color: #60a5fa; font-style: italic; font-weight: 900; letter-spacing: -1px;">DevLog Identity Recovery</h2>
          <p style="color: #9ca3af; font-weight: 500; font-size: 16px;">A password reset request has been initiated for your account.</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Authorize Reset Protocol</a>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">If you did not request this, please ignore this transmission. This link will expire in 1 hour.</p>
          <hr style="border: 0; border-top: 1px solid #1a1c20; margin: 30px 0;" />
          <p style="color: #4b5563; font-size: 10px; text-align: center; letter-spacing: 2px;">NEURAL INTERFACE | DEVLOG V2</p>
        </div>
      `,
        });

        return { success: true, data };
    } catch (error) {
        logger.error("Failed to send reset email via Resend", { error: error.message });
        return { success: false, error };
    }
};
