# MeruDash

A mobile-first campus ordering experience for Meru University of Science and Technology. Customers can browse food and essentials, place custom requests, pin a collection or delivery point on an interactive map, and send a structured order to WhatsApp.

## Product scope

- Customer-facing storefront for MUST students.
- Product search, category filters, cart and quantity controls.
- Delivery location picker with current-location support and manual draggable pin.
- Landmark notes and direct map links in order messages.
- Separate collection and recipient pins for parcel requests.
- WhatsApp checkout with pay-on-delivery wording.
- Responsive desktop and mobile layouts.
- No required customer account.

## Technology

- React and TypeScript.
- Vite.
- MapLibre GL JS.
- OpenFreeMap map tiles with OpenStreetMap data.
- Lucide icons.
- Vercel deployment.

## Backend decision

This first release intentionally does not require a database or application backend. Product data is local configuration, the cart is stored in the customer's browser, location coordinates stay in the current browser session, and the order is handed to WhatsApp. No order history or live rider location is stored.

A backend becomes necessary for real-time rider tracking, shared order status, customer order history, online payment callbacks, or a staff dashboard. Those capabilities should be added only when they are required.

## Local setup

1. Install Node.js 20 or newer.
2. Install dependencies with npm install.
3. Copy .env.example to .env.local.
4. Set VITE_WHATSAPP_NUMBER to the business WhatsApp number in international format, digits only (for example, 2547XXXXXXXX).
5. Start the site with npm run dev.
6. Check production output with npm run build.

## Configuration before launch

- Replace the illustrative product catalogue and prices in src/data.ts with the confirmed menu and service details.
- Set VITE_WHATSAPP_NUMBER to the business's verified WhatsApp number.
- Confirm delivery coverage and the campus map pin with the owner.
- Review the wording and pay-on-delivery process with the owner.
- Test the map on HTTPS and on a real Android device.

If the WhatsApp number is not configured, the checkout opens WhatsApp's generic share flow so the reviewer can choose a chat. Set the number before sharing the live site with customers.

## Maps and location

The map uses MapLibre GL JS with the public OpenFreeMap style. OpenFreeMap allows commercial use and does not require an API key, but its public instance does not provide an uptime SLA or personalized support. Keep the map style URL in src/data.ts so a provider can be changed without rewriting the location flow.

The browser geolocation permission is optional. Students can always move the map pin manually. A landmark note is also available because a coordinate alone may not identify the best handoff point.

The map stores the selected coordinates in client-side state and includes Google Maps links in the WhatsApp message. It does not track a rider's live position. Real-time rider tracking requires a rider-side location source and a backend/realtime service.

## Important notes

Catalogue prices in the initial build are illustrative and must be confirmed before production use. Delivery fees are not invented by the interface; the final fee is confirmed with the customer on WhatsApp before dispatch.

Map data attribution is displayed in the location picker. The OpenFreeMap style includes attribution controls.

## Scripts

- npm run dev — local development.
- npm run typecheck — TypeScript checks.
- npm run build — typecheck and production build.
- npm run preview — serve the local production build.
