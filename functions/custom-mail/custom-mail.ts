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

  const { to = [] } = JSON.parse(event.body);
  const parsedTo = to.split(",");

  const msg = {
    to: "holvoetwim@hotmail.com",
    from: "info@trotkuurne.be", // Use your verified SendGrid email
    bcc: parsedTo,
    subject: `Trot 20-in-25`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 500px;">
        <h1 style="color: #4CAF50;">Beste trotvrienden van de eerste, of eerder de latere uurtjes,</h1>
        <p>De Vitamindjes en Snak & Bete presenteren jullie <strong>Trot20-in-25 op zaterdag 22 en zondag 23 maart</strong>. 
            De plannen zijn gesmeed voor een wonderbaarlijk weekend op zoek naar avontuur, de juiste weg en onbreekbaar vertrouwen in elkaar. Of twijfels en drank. Hoe dan ook, jullie zullen ons en jezelf opnieuw verbazen met sterke staaltjes van fysieke doorzetting en mentale weerbaarheid.</p>
        <p>De kapiteins kunnen hun groep inschrijven vanaf 20 november op http://www.trotkuurne.be. Geef meteen jullie voorkeur aan voor lang of kort wandelen en fietsen - we zullen er zoveel als mogelijk rekening mee houden. Groepen van drie tot zes deelnemers genieten onze voorkeur.</p>
        <p>Inschrijvingen zijn volledig wanneer ook de inschrijvingssom van €73,30 + €6,00 administratiekosten per persoon beland zijn op rekeningnummer BE75 0688 9166 5251, met vermelding Trot + groepsnaam. De extra euro’s maken het ons mogelijk om de grenzen te blijven opzoeken.</p>
        <p>Met Nieuwjaar sluiten we de inschrijvingen voor de deelnemers van vorige jaren af, en daarna kunnen zich ook nieuwe trotters aandienen, tot we de kaap van de 100 helden halen.</p>
        <p>Blokkeer alvast donderdagavond 20 maart 2025 in de agenda om uw stalen ros te deponeren. Carbon is ook toegelaten, elektrische aandrijfsystemen dan weer niet.</p>
        <p>Vragen, commentaartjes of duimpjes kunnen jullie kwijt via info@trotkuurne.be.</p>
        <p style="color: #555;">Uw dienstwillige dienaars,<br/>
        <span style="color: #4CAF50;">
        <div>Snak & Bete</div>
        De Vitamindjes
        </span></p>
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
    console.log("error", JSON.stringify(error));
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to send email",
        error: error.message,
      }),
    };
  }
};
