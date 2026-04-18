# Tripbozo Frontend

Tripbozo Frontend is the Next.js web client for Tripbozo. It provides the traveler-facing experience for exploring destination apps, viewing country essentials, managing user profile preferences, and sharing app bundles.

## Tech Stack

- Next.js (App Router + Pages integration)
- React
- Tailwind CSS
- Axios
- Deployed on Vercel

## Frontend Scope

This repository contains frontend-only code:

- Landing and marketing pages
- Country app discovery flows
- Essentials UI
- Login/register/profile/onboarding flows
- Bundle and QR-related user flows
- Client-side loading/error states and route UX
- SEO and static assets for frontend pages

Backend APIs, data models, and infrastructure are documented in the main backend repository README.

## Key User Flows

- Browse destination country content and app categories
- View app listings and app details per country
- Access essentials content for destination countries
- Sign in/register and maintain account session
- Set/update origin-country preference in onboarding/profile
- Open shared bundle links and view download options

## Project Structure (High Level)

```text
tripbozofrontend-main/
  src/
    app/
      page.js
      layout.js
      country/
      login/
      register/
      Onboarding/
      qr-bundle/
      About/
      contact/
      privacy/
      terms/
      not-found.js
      global-error.js
  components/
    homepage/
    countryapp/
    Onboarding/
    QRcode/
    Navbar.js
    Footer.js
  public/
  styles/
  package.json
```

## Local Development

```bash
git clone https://github.com/suryansh-it/tripbozofrontend.git
cd tripbozofrontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build and Production

```bash
npm run build
npm start
```

## Environment Notes

Set your API base URL in frontend environment config (if required by your deployment mode) so the client points to the deployed backend API.

Common setup pattern:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.onrender.com
```

## Deployment

- Hosting: Vercel
- Recommended: connect GitHub repo and use automatic deploys per push to main

## Quality and Checks

Useful commands:

```bash
npm run lint
npm run build
```

## License

MIT (same project family as backend repository).
