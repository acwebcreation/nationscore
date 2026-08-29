// netlify/functions/create-checkout-session.js
//
// Crée une session Stripe Checkout pour un pays + montant + pseudo optionnel.
// "automatic_payment_methods" laisse Stripe choisir automatiquement les
// moyens de paiement les moins coûteux et les plus adaptés selon le pays de
// l'acheteur : carte bancaire, Apple Pay, Google Pay, et Bizum en Espagne —
// sans avoir à les lister ni les configurer un par un.

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { countryCode, countryName, amount, pseudo } = JSON.parse(event.body);

    // Sécurité minimale : on revalide le montant côté serveur, on ne fait
    // jamais confiance à une valeur envoyée par le navigateur.
    const allowedAmounts = [5, 10, 20, 50];
    const safeAmount = allowedAmounts.includes(Number(amount)) ? Number(amount) : 5;

    const siteUrl = process.env.SITE_URL || "http://localhost:8888";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      automatic_payment_methods: { enabled: true },
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Soutien à ${countryName} — NationScore`,
            },
            unit_amount: safeAmount * 100, // Stripe attend des centimes
          },
          quantity: 1,
        },
      ],
      // Ces métadonnées permettent de retrouver pays/pseudo après paiement,
      // et d'alimenter la vraie base de données via un webhook Stripe
      // (voir README) plutôt que de faire confiance à l'URL de retour.
      metadata: {
        countryCode,
        countryName,
        pseudo: pseudo || "",
      },
      success_url: `${siteUrl}/merci.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/soutenir.html`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
