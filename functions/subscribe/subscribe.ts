import { Handler } from "@netlify/functions";
import sgMail from "@sendgrid/mail";
import { MongoClient } from "mongodb";

sgMail.setApiKey(process.env.NETLIFY_EMAILS_PROVIDER_API_KEY);

let cachedClient: MongoClient | null = null;

async function connectToDatabase(uri: string) {
  if (cachedClient) {
    return cachedClient;
  }
  const client = await MongoClient.connect(uri, {});
  cachedClient = client;
  return client;
}

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  const {
    email = "",
    participants = [],
    groupName = "",
    option = "",
    phone = "",
    comments = "",
  } = JSON.parse(event.body);

  const participantsList = participants
    .map((participant: string) => `<li>${participant}</li>`)
    .join("");

  const totalAmount = (73.3 + 6) * participants.length;

  try {
    const client = await connectToDatabase(
      process.env.MONGODB_CONNECTION_STRING as string
    );
    const db = await client.db("trot-subscriptions");
    db.collection("subscription").insertOne({
      email,
      participants,
      groupName,
      option,
      phone,
      comments,
      created: new Date(),
    });
  } catch (error) {
    console.log("error", error);
  }

  const msg = {
    to: email,
    from: "info@trotkuurne.be", // Use your verified SendGrid email
    bcc: ["arne.quartier@hotmail.com", "holvoetwim@gmail.com"],
    subject: `Welkom, Kameraden van de ${groupName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #4CAF50;">Hallo, ${groupName}!</h1>
        <p>Bedankt voor je inschrijving voor de trot 2025, je koos voor ${option}, heel moedig. </p>
        <p>Je inschrijving is in goede orde ontvangen. De inschrijving is pas definitief na het overschrijven van €73,30 + €6 administrative kosten pp (voor jullie €${totalAmount}) op rekeningnummer  BE75 0688 9166 5251.</p>
        <p>telefoonnummer: ${phone}
        <ul style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
          ${participantsList}
        </ul>
        <p>Opmerkingen:</p>
        <p>${comments}</p>
        <p>Wij kijken er alvast naar uit om jullie te mogen verwelkomen op de trot! Verdere info volgt.</p>
        <p style="color: #555;">Met trotterige groeten,<br/><span style="color: #4CAF50;">De Vitamindjes en Snak en bete.</span></p>
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
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to send email",
        error: error.message,
      }),
    };
  }
};
