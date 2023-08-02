import { Injectable } from '@nestjs/common';
import { MailerService as MS } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: MS) { }

  send(to: string[], subject: string, context: any, template: string) {
    this.mailerService.sendMail({
      to, // list of receivers
      from: 'upavnsmtp@gmail.com', // sender address
      subject: subject || 'Testing Nest MailerModule ✔', // Subject line
      context,
      template
    })
      .then((d) => { console.log(d) })
      .catch((e) => { console.log(e) });
  }
}