import { Handler } from "@netlify/functions";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  const { email = "holvoetwim@gmail.com", name = "stranger" } = JSON.parse(
    event.body
  );

  const msg = {
    to: email,
    from: "your-email@example.com", // Use your verified SendGrid email
    subject: "Welcome!",
    text: `Hello, ${name}!`,
    html: `<strong>Hello, ${name}!</strong>`,
  };

  try {
    await sgMail.send(msg);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to send email",
        error: error.message,
      }),
    };
  }
};
