import nodemailer from 'nodemailer'
import config from './index'

const transporter = nodemailer.createTransport({
    host: config.SMTP_MAIL_HOST,
    port: config.SMTP_MAIL_PORT,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: config.SMTP_MAIL_USER,
      pass: config.SMTP_MAIL_PASS,
    },
  });

  export default transporter