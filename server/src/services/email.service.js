import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, code) => {
    await resend.emails.send({
        from: 'ChatApp <onboarding@resend.dev>',
        to: email,
        subject: 'Подтвердите ваш email',
        html: `
            <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 32px;">
                <h2 style="color: #111;">Подтверждение email</h2>
                <p style="color: #555;">Ваш код подтверждения:</p>
                <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #5b6af0; margin: 24px 0;">
                    ${code}
                </div>
                <p style="color: #888; font-size: 13px;">Код действителен 10 минут.</p>
            </div>
        `,
    });
};