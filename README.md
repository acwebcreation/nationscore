# NationScore — MVP statique

Prototype de test pour GitHub Pages. Site 100 % statique (HTML/CSS/JS vanilla,
aucune dépendance, aucun build), en français uniquement pour ce MVP — ES et
EN à ajouter une fois le concept validé.

## Structure

```
nationscore/
├── index.html            → Accueil : hero + classement live (toggle Pays/Continent)
├── soutenir.html          → Formulaire : choix du pays + montant → paiement Stripe réel
├── merci.html             → Confirmation (vérifiée via Stripe) + bouton de partage
├── guide.html             → Guide utilisateur : comment jouer
├── faq.html               → Questions fréquentes
├── cgv.html               → Conditions générales de vente
├── mentions-legales.html  → Éditeur, hébergeur
├── confidentialite.html   → Politique de confidentialité RGPD
├── css/
│   └── style.css          → Design "scoreboard de stade" (tokens en haut du fichier)
├── js/
│   ├── data.js             → Données factices du classement (pays, scores, activité récente)
│   └── app.js              → Rendu du classement, toggle, bandeau ticker
├── netlify/functions/
│   ├── create-checkout-session.js  → crée la session de paiement Stripe
│   └── get-session.js               → vérifie le paiement pour la page merci.html
├── netlify.toml           → configuration de déploiement Netlify
├── package.json           → dépendance Stripe pour les fonctions
├── .env.example           → variables d'environnement nécessaires
└── README.md
```

## Tester le site (pages statiques uniquement, sans paiement)

1. Pousse ce dossier dans un repo GitHub.
2. Settings → Pages → Source : branche `main`, dossier `/root`.
3. Le site est accessible à `https://<ton-user>.github.io/<repo>/`.

Ça permet de voir le design et la navigation, mais **le bouton de paiement ne
fonctionnera pas** sur GitHub Pages seul — voir la section Paiement
ci-dessous pour tester le vrai flux de paiement via Netlify (même repo).

## Ce qui est mock (à connecter avant la prod)

- **`js/data.js`** : les scores du classement sont codés en dur. À remplacer
  par un appel à une vraie base de données (Supabase, Firebase…) mise à jour
  via un **webhook Stripe** (`checkout.session.completed`) — ne jamais mettre
  à jour le score directement depuis le navigateur, sinon n'importe qui peut
  tricher sans payer.
- **Bandeau ticker** (`RECENT_ACTIVITY` dans `data.js`) : à alimenter en
  temps réel via ce même webhook.

## Paiement — déjà branché (Stripe Checkout)

Le paiement carte / Apple Pay / Google Pay / Bizum (Espagne) est fonctionnel
via **Stripe Checkout**, choisi pour son coût le plus bas (~1,5&nbsp;% + 0,25&nbsp;€
sur les cartes UE, aucun abonnement) et sa simplicité (page de paiement
hébergée par Stripe, donc pas de conformité PCI à gérer soi-même).

GitHub Pages étant 100&nbsp;% statique, il ne peut pas exécuter le code serveur
qui crée la session de paiement en sécurité (la clé secrète Stripe ne doit
jamais être exposée au navigateur). Le projet utilise donc **Netlify** en plus
de GitHub, gratuit, et branché directement sur le même repo :

```
netlify/functions/
├── create-checkout-session.js   → crée la session de paiement (appelée par soutenir.html)
└── get-session.js                → vérifie le paiement et renvoie pays/montant/pseudo (appelée par merci.html)
```

### Pour tester

1. Crée un compte [Stripe](https://dashboard.stripe.com/register) (gratuit,
   mode test disponible immédiatement).
2. Récupère ta clé secrète de test (`sk_test_...`) dans le dashboard Stripe.
3. Sur [Netlify](https://app.netlify.com), clique **Add new site → Import
   from GitHub**, choisis ce repo.
4. Dans Netlify → Site settings → Environment variables, ajoute :
   - `STRIPE_SECRET_KEY` = ta clé `sk_test_...`
   - `SITE_URL` = l'URL Netlify générée (ex. `https://nationscore.netlify.app`)
5. Déploie. Le site est servi par Netlify (fonctions + pages statiques) au
   lieu de GitHub Pages — même repo, juste un hébergeur différent, plus
   adapté ici.
6. Teste un paiement avec une carte de test Stripe : `4242 4242 4242 4242`,
   n'importe quelle date future, n'importe quel CVC.

### Avant la vraie mise en production

- Remplacer la clé `sk_test_...` par la clé live (`sk_live_...`).
- Ajouter un **webhook Stripe** (`checkout.session.completed`) qui écrit le
  paiement dans une vraie base de données — c'est cette étape qui rend le
  classement infalsifiable, pas la page `merci.html`.
- Vérifier l'activation de Bizum dans le dashboard Stripe (Paramètres →
  Moyens de paiement) si le volume espagnol le justifie.

## Prochaines étapes suggérées

1. Ajouter le webhook Stripe → base de données (voir ci-dessus).
2. Compléter les champs `[à compléter]` dans `mentions-legales.html` et
   `cgv.html` avec la structure juridique choisie, puis faire relire par un
   professionnel.
3. Une fois le FR validé, dupliquer les pages sous `/es/` et `/en/` avec
   traduction complète (voir notes précédentes sur le SEO multilingue).
