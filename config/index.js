import dotenv from 'dotenv';

dotenv.config()

const config = {
    JWT_SECRET : process.env.JWT_SECRET,
    JWT_EXPIRY : process.env.JWT_EXPIRY || "30d",
    MONGODB_URL : process.env.MONGODB_URL,
    PORT : process.env.PORT,
    SMTP_MAIL_HOST : process.env.SMTP_MAIL_HOST,
    SMTP_MAIL_PORT : process.env.SMTP_MAIL_PORT,
    SMTP_MAIL_USER : process.env.SMTP_MAIL_USER,
    SMTP_MAIL_PASS : process.env.SMTP_MAIL_PASS,
    SMTP_MAIL_EMAIL :process.env.SMTP_MAIL_EMAIL 
}

export default config