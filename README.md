# Your Wed Stories

Static wedding photography and film portfolio. Deploy the contents of `dist/` at the root of https://www.yourwedstories.com. There is no package install or build step.

## Preview

Run `python3 -m http.server 8080 --directory dist` and visit http://localhost:8080. Opening `dist/index.html` directly also works for basic UI checks. Preview with JavaScript disabled to verify direct WhatsApp and YouTube fallbacks.

## Inquiry delivery

The form validates details locally and prepares an explicit WhatsApp draft link. Nothing is submitted to a studio server. Visitors must open the draft and press Send in WhatsApp. The form is hidden until its JavaScript handler is installed, leaving the direct WhatsApp contact available when JavaScript fails. Update the studio number consistently in HTML and `dist/script.js` if it changes.

## Content and assets

Keep full-resolution photographs in `dist/images/`; `*-480.jpg` files are responsive alternatives. Gallery enlargement uses the full original. Films load an external player only after the visitor selects Play, with a direct YouTube fallback. Keep image alt text aligned with the real photograph.

Shared navigation and footer markup currently appears in each portfolio HTML page; update all four pages together. Global styling is in `dist/style.css`; menu, gallery and film behavior is in `dist/home.js`; inquiry handling is in `dist/script.js`. Update cache version strings when changing deployed CSS or JavaScript. Keep canonical URLs, social metadata and `sitemap.xml` aligned when adding pages.

## Checks before publishing

- Run `node --check dist/home.js` and `node --check dist/script.js`.
- Check local links and image sources, including the privacy and terms pages.
- Verify empty/invalid form errors, past-date rejection, valid WhatsApp draft content and explicit delivery instructions. Do not send test inquiries to the studio.
- Check mobile menu open, Tab, Escape and focus restoration; gallery open and close; film loading and direct fallback.
- Check 320px, 390px, tablet and desktop layouts, reduced motion and keyboard navigation.

## Remaining owner-supplied content

Additional weddings, genuine client testimonials, named team details and the studio's base location require real approved material. Add only confirmed services, delivery commitments and business policies. Current privacy information describes this static site's behavior; update it if hosting, analytics, forms or external services change. No newsletter subscription is offered until a service is connected.
