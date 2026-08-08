const nodemailer = require('nodemailer');

const createTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: {
            user,
            pass,
        },
    });
};

module.exports.sendPasswordResetEmail = async ({ to, otp, userName }) => {
    const transporter = createTransporter();

    const subject = 'Uber Clone - Password Reset OTP';
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 12px;">
            <h2 style="color: #000000; margin-bottom: 10px;">Uber Clone</h2>
            <p style="color: #555555;">Hello ${userName || 'User'},</p>
            <p style="color: #555555;">You requested to reset your password. Use the following 6-digit OTP code to complete your password reset:</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #000000;">${otp}</span>
            </div>
            <p style="color: #777777; font-size: 12px;">This OTP is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
        </div>
    `;

    if (!transporter) {
        console.log(`\n========================================`);
        console.log(`[SMTP SIMULATION] Password Reset OTP for ${to}: ${otp}`);
        console.log(`Configure SMTP_HOST, SMTP_USER, SMTP_PASS in Backend/.env to send real emails.`);
        console.log(`========================================\n`);
        return { success: true, simulated: true };
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Uber Clone Support" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html: htmlContent,
        });
        return { success: true, simulated: false };
    } catch (err) {
        console.error('Error sending password reset email via Nodemailer:', err);
        throw new Error('Failed to send password reset email. Please try again later.');
    }
};
