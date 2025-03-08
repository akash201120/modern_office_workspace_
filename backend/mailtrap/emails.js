import { mailtrapClient, sender } from "./mailtrap.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async(email,verficationToken) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verficationToken),
            category: "Email Verification"
        })

        console.log("Email Sent Successfully",response);
        
    } catch (error) {
        console.log(`Error Sending Verification`,error);
        throw new Error(`Error Sending Verification Email: ${error}`)
        
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient =[{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category:"Password Reset",
        })
        
    } catch (error) {

        console.error('error',error);
        throw new Error(`Error sending password reset mail: ${error}`);
        
    }
}

export const sendResetSuccessEmail = async(email) =>{
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject:"Password Reset Successfull",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password Reset",
        });

        console.log("Password reset email sent successfully", response);
        
        
    } catch (error) {
        console.error("error",error);
        throw new Error(`error sending password reset mail: ${error}`);

        
    }
}