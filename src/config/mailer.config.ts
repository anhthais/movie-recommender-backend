import { MailerOptions } from '@nestjs-modules/mailer';

export const mailerOptions: MailerOptions = {
  transport: {
    host: process.env.MAIL_HOST,
    secure: true,
    port: Number(process.env.MAIL_PORT ?? 456),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  },
  defaults: {
    from: process.env.MAIL_FROM,
  },
};
