import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
export class NodeMailer {
  //   static initiateTransport() {
  //     return nodeMailer.createTransport(
  //       sendGrid({
  //         auth: {
  //           api_key: "SENDGRID_PASSWORD",
  //         },
  //       })
  //     );
  //   }

  //   static sendMail(data: {
  //     to: [string];
  //     subject: string;
  //     html: string;
  //   }): Promise<any> {
  //     return this.initiateTransport().sendMail({
  //       from: "nagendra@mail.com",
  //       to: data.to,
  //       subject: data.subject,
  //       html: data.html,
  //     });
  //   }
  static initiateTransport() {
    return new MailerSend({
      apiKey: "mailerSend_Password",
    });
  }
  static async mailSender(data: { to: any; subject: any; html: any }) {
    const sentFrom = new Sender("you@yourdomain.com");

    const recipients = [new Recipient(data.to)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("This is a Subject")
      .setHtml("<strong>This is the HTML content</strong>")
      .setText("This is the text content");

    return await this.initiateTransport().email.send(emailParams);
  }
}
