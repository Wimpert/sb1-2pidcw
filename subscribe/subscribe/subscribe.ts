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

  const {
    email = "holvoetwim@gmail.com",
    name = "stranger",
    participants = [],
  } = JSON.parse(event.body);

  const participantsList = participants
    .map((participant: string) => `<li>${participant}</li>`)
    .join("");

  const msg = {
    to: email,
    from: "info@trotkuurne.be", // Use your verified SendGrid email
    subject: "Welcome!",
    text: `Hello, ${name}!\n\nHere is the list of participants:\n${participants.join(
      "\n"
    )}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #333;">Hello, ${name}!</h1>
        <p>We are excited to have you with us. Here is the list of participants:</p>
        <ul style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
          ${participantsList}
        </ul>
        <p>Best regards,<br/>The Trot Kuurne Team</p>
      </div>
    `,
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
