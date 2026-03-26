const Brevo = require('@getbrevo/brevo');

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY not configured in .env');
  }

  const client = Brevo.ApiClient.instance;
  const apiKey = client.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  const tranEmailApi = new Brevo.TransactionalEmailsApi();

  const senderEmail = process.env.EMAIL_SENDER || process.env.FROM_EMAIL || 'no-reply@irabiescare.com';
  const senderName = process.env.EMAIL_SENDER_NAME || process.env.FROM_NAME || 'iRabiesCare';

  try {
    const result = await tranEmailApi.sendTransacEmail({
      sender: {
        email: senderEmail,
        name: senderName,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
    console.log('Brevo email sent response:', result);
    return result;
  } catch (error) {
    console.error('Brevo sendTransacEmail failed:', error?.response || error);
    throw new Error(`Brevo email error: ${error?.response?.body?.message || error.message || 'unknown'}`);
  }
};

module.exports = sendEmail;