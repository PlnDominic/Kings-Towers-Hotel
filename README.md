# Kings Towers Hotel — website

Production build of the Kings Towers Hotel & Conference Centre site (Next.js App Router + Tailwind CSS), implemented from the Claude Design handoff in `../project/Kings Towers Hotel.dc.html`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Reservations, email, and ExpressPay

The reservation flow now starts an ExpressPay hosted checkout and only emails the hotel after the payment is successfully verified. The footer newsletter form still sends mail directly via [Nodemailer](https://nodemailer.com) (`lib/mailer.js`).

Copy `.env.example` to `.env.local` and fill in real SMTP credentials:

```bash
cp .env.example .env.local
```

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@example.com
SMTP_PASS=your-smtp-password-or-app-password
# MAIL_FROM defaults to SMTP_USER; MAIL_TO defaults to kingsthl@yahoo.com

EXPRESSPAY_MERCHANT_ID=your-expresspay-merchant-id
EXPRESSPAY_API_KEY=your-expresspay-api-key
EXPRESSPAY_ENVIRONMENT=sandbox
# Required for hosted checkout redirects/webhooks in production:
# APP_BASE_URL=https://your-public-https-domain.com
```

Without valid SMTP credentials, both forms will show an error instead of silently succeeding — there's no fake "success" state, so submissions never look like they went through when no mail was actually sent.

Without valid ExpressPay credentials, the reservation page will show an error when the guest tries to begin payment.

## Content notes

- **Room photos**: the Standard Room and Twin Room cards intentionally show the same photo (a twin-bed room), and the gallery's "Twin Room" caption points at a bathroom photo — these mismatches exist in the original design handoff and were kept as-is per the client's instruction, not fixed.
- **Mini Suite photo**: no photo was ever supplied for the Mini Suite card in the original design session. It currently renders a neutral "Photo coming soon" placeholder (`app/components/Rooms.js`). Once a real photo is available, drop it in `public/images/` and set `img` on the `mini-suite` entry in `app/data.js`.

## Structure

- `app/page.js` — assembles the page from `app/components/*`.
- `app/data.js` — room, amenity, gallery, and contact content.
- `app/api/*/route.js` — form submission handlers (Nodemailer).
- `lib/mailer.js` — SMTP transport, env-configured.
- `public/images/` — property photos (sourced from `../project/uploads`).
