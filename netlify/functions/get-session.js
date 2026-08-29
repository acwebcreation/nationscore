// netlify/functions/get-session.js
//
// Récupère les détails d'une session Stripe déjà payée (pays, montant,
// pseudo) pour les afficher sur merci.html — plus fiable que de faire
// confiance aux paramètres de l'URL, puisque ces infos viennent directement
// de Stripe et non du navigateur.

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const sessionId = event.queryStringParameters?.session_id;
  if (!sessionId) {
    return { statusCode: 400, body: JSON.stringify({ error: "session_id manquant" }) };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return { statusCode: 402, body: JSON.stringify({ error: "Paiement non confirmé" }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        countryCode: session.metadata.countryCode,
        countryName: session.metadata.countryName,
        pseudo: session.metadata.pseudo || null,
        amount: session.amount_total / 100,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
