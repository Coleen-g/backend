const SibApiV3Sdk = require('@getbrevo/brevo');

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY not configured in .env');
  }

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  apiInstance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

  const senderEmail = process.env.EMAIL_SENDER || process.env.FROM_EMAIL || 'no-reply@irabiescare.com';
  const senderName = process.env.EMAIL_SENDER_NAME || process.env.FROM_NAME || 'iRabiesCare';

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { email: senderEmail, name: senderName };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Brevo email sent:', result);
    return result;
  } catch (error) {
    console.error('Brevo sendTransacEmail failed:', error?.response || error);
    throw new Error(`Brevo email error: ${error?.response?.body?.message || error.message || 'unknown'}`);
  }
};

module.exports = sendEmail;