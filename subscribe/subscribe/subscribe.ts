import { Handler } from "@netlify/functions";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.NETLIFY_EMAILS_PROVIDER_API_KEY);

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
    from: "info@trotkuurne.be", // Use your verified SendGrid email
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
    console.log("apikey", process.env.NETLIFY_EMAILS_PROVIDER_API_KEY);
    console.log("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to send email",
        error: error.message,
      }),
    };
  }
};
