# MeruDash

A compact, mobile-first ordering experience for students around Meru University of Science and Technology (MUST).

## Customer experience

- Short home screen with campus selector, campus image, direct search and four quick actions.
- Four popular products shown immediately, with the remaining catalogue in a horizontal swipe row.
- Food and essentials catalogue, search, quantity controls and review-order sheet.
- Quick errand and parcel request flows with map pins.
- MapLibre location selection, optional current-location detection and landmark notes.
- WhatsApp handoff with an order reference and a clear customer commitment.
- Home, Orders, Location and More navigation.
- Local order history on the same device; no sign-up required.

## Technology

- React, TypeScript and Vite.
- MapLibre GL JS with OpenFreeMap tiles and OpenStreetMap data.
- Vercel production hosting.
- WhatsApp click-to-chat handoff.

## Current backend boundary

This release does not yet use an application database. The cart, saved location, customer details and order/request history are stored in the customer's browser. The Orders screen is a local history and request handoff screen; it does not receive live staff status or rider GPS updates.

Real shared order tracking requires a small backend with an order table and staff status updates. Live rider tracking additionally requires a rider-side location source and a realtime channel.

## Payments and order commitment

The current customer-facing payment method is pay on delivery. Checkout requires a valid Kenyan mobile number, a pinned delivery location and an explicit confirmation that the customer can receive the order and pay the agreed total. The WhatsApp message asks the team to confirm availability and the delivery fee before dispatch.

Automated M-PESA STK Push is not enabled. A production STK integration requires the business's own Safaricom Daraja application credentials, a valid Till/Paybill and an HTTPS callback endpoint. Credentials must be held by a server-side function, never in browser code. A confirmed callback is required before the app can display a payment as successful.

## Configuration before customer launch

1. Set VITE_WHATSAPP_NUMBER in Vercel to the business's WhatsApp number in international digits-only format (for example, 2547XXXXXXXX).
2. Confirm every product, photo, availability label and price in src/data.ts with the owner. The seeded catalogue is illustrative.
3. Confirm delivery coverage and the MUST campus starting map centre.
4. Test checkout, the map and WhatsApp handoff on a real Android phone.
5. Agree how the team will confirm delivery fees and customer orders.

## Local setup

1. Install Node.js 22 or newer.
2. Run npm install.
3. Copy .env.example to .env.local.
4. Set VITE_WHATSAPP_NUMBER.
5. Run npm run dev.
6. Run npm run build before deployment.

## Scripts

- npm run dev — local development.
- npm run typecheck — TypeScript check.
- npm run build — typecheck and production build.
- npm run preview — serve the local production build.
