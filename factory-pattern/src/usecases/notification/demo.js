const { EmailFactory, SmsFactory, PushFactory } = require('./abstractFactory');

async function runNotificationDemo() {
  const environment = process.env.NODE_ENV || 'dev';

  const emailFactory = new EmailFactory({ environment });
  const smsFactory = new SmsFactory({ environment });
  const pushFactory = new PushFactory({ environment });

  const email = emailFactory.createBuilder()
    .withSubject('Welcome!')
    .withBody('Thanks for joining. This is a rich email.')
    .addAttachment('guide.pdf', Buffer.from('PDF_BYTES'))
    .build();
  const emailSender = emailFactory.createSender();

  const sms = smsFactory.createBuilder().withText('Your OTP is 123456').build();
  const smsSender = smsFactory.createSender();

  const push = pushFactory.createBuilder().withTitle('Sale!').withBody('50% off today').withData({ coupon: 'HALFOFF' }).build();
  const pushSender = pushFactory.createSender();

  const e = await emailSender.send(email, 'user@example.com');
  const s = await smsSender.send(sms, '+123456789');
  const p = await pushSender.send(push, 'device-token-abc');

  console.log('Notification results:', { e, s, p });
}

module.exports = { runNotificationDemo };

if (require.main === module) {
  runNotificationDemo();
}