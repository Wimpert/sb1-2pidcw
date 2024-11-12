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

  console.log("event.body", event.body);

  const {
    email = "holvoetwim@gmail.com",
    name = "",
    participants = [],
    groupName = "",
    keuze = "",
  } = JSON.parse(event.body);

  const participantsList = participants
    .map((participant: string) => `<li>${participant}</li>`)
    .join("");

  const msg = {
    to: email,
    from: "info@trotkuurne.be", // Use your verified SendGrid email
    cc: [],
    bcc: ["holvoetwim@gmail.com"],
    subject: `Welcome, Kameraaden van de ${groupName}!`,
    // text: `Hallo, ${name}!\n\nHere is the list of participants:\n${participants.join(
    //   "\n"
    // )}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #4CAF50;">Hello, ${name}!</h1>
        <p>Bedankt voor je inschrijving voor de trot 2025, je koos voor ${keuze}, heel moedig. </p>
        <ul style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
          ${participantsList}
        </ul>
        <p style="color: #555;">Best regards,<br/><span style="color: #4CAF50;">De Vitamindjes</span></p>
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
