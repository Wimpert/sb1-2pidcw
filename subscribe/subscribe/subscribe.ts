import { Handler } from "@netlify/functions";
import sgMail from "@sendgrid/mail";
import { MongoClient } from "mongodb";

sgMail.setApiKey(process.env.NETLIFY_EMAILS_PROVIDER_API_KEY);

let cachedClient: MongoClient | null = null;

async function connectToDatabase(uri: string) {
  if (cachedClient) {
    console.log("=> using cached database connection");
    return cachedClient;
  }
  console.log("=> creating new database connection");
  console.log("we are using uri", uri);
  const client = await MongoClient.connect(uri, {});
  console.log("=> new database connection created");
  cachedClient = client;
  console.log("=> cachedClient", cachedClient);
  return client;
}

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
    participants = [],
    groupName = "",
    keuze = "",
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
    console.log('saving to database":');
    const db = await client.db("trot-subscriptions");
    console.log("got db");
    db.collection("subscription").insertOne({
      email,
      participants,
      groupName,
      keuze,
      phone,
      comments,
      created: new Date(),
    });
    console.log("saved to database");
  } catch (error) {
    console.log("error", error);
  }

  const msg = {
    to: email,
    from: "info@trotkuurne.be", // Use your verified SendGrid email
    cc: [],
    bcc: ["holvoetwim@gmail.com"],
    subject: `Welkom, Kameraaden van de ${groupName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #4CAF50;">Hallo, ${groupName}!</h1>
        <p>Bedankt voor je inschrijving voor de trot 2025, je koos voor ${keuze}, heel moedig. </p>
        <p>Je inschrijving is in goede orde ontvangen. De inschrijving is pas definitief na het overschrijven van €73,30 + €6 administrative kosten pp (voor jullie €${totalAmount}) op rekeningnummer BEXX XXXX XXXX XXXX.</p>
        <p>telefoonnummer: ${phone}
        <ul style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
          ${participantsList}
        </ul>
        <p>Opmerkingen:</p>
        <p>${comments}</p>
        <p style="color: #555;">Best regards,<br/><span style="color: #4CAF50;">De Vitamindjes en Snak en bete.</span></p>
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
