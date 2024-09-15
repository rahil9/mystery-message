import { resend } from "@/lib/resend";
import VerificationEmail from "../../email-template/VerificationEmail";
import { APIResponse } from "@/types/APIResponse"; 

export async function sendVerificationEmail(
    email: string,
    username: string,
    otp: string
): Promise<APIResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystery Message | Verification Code',
            react: VerificationEmail({ username, otp }),
        });
        return {success: true, message: 'Verification email sent successfully'}
    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return {success: false, message: 'Failed to send verification email'}
    }
}