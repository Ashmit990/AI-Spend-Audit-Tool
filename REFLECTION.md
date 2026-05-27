# Developer Reflection

## 1. Hardest bug and how you debugged it
The most challenging issue was handling the hydration mismatch between the server-rendered Next.js page and the `localStorage` data in `SpendForm.tsx`. Because the form state is persisted to `localStorage`, the initial server render would produce a blank form or a default state, while the client side would then snap to the saved state, causing a "Hydration failed" error in the console and a visible layout shift. I debugged this using the React DevTools to inspect the difference between the server and client trees. I eventually implemented a `useHasMounted` hook/state pattern to ensure that any component relying on client-side state only renders its dynamic parts after the initial mount, successfully silencing the errors.

## 2. A decision you reversed mid-week
Initially, I planned to use the Anthropic API to perform the entire audit — essentially feeding the AI the user's spend and asking for recommendations. However, I realized mid-week that this led to inconsistent calculations and "hallucinated" pricing that didn't match real-world data. It was also slow. I reversed this decision on Day 3 and built a deterministic, rule-based "Audit Engine" in TypeScript (`src/lib/audit.ts`). This ensured that every "reason" and "saving" was mathematically sound and defensible to a finance professional, using the AI only for the personalized qualitative summary.

## 3. What you'd build in week 2
In the second week, I would focus on "Depth over Breadth." Specifically:
- **Historical Comparison:** Allowing users to upload CSVs of their Stripe/Quickbooks exports to see spend over time rather than just current month estimates.
- **SSO/SAML Detection:** Adding logic to identify potential savings by consolidating individual seats into a centralized Enterprise plan with SSO (Single Sign-On).
- **Interactive Shareables:** Enhancing the results page with interactive charts (using Recharts) to visualize spend distribution across categories (Coding, Chat, Image Gen, etc.).
- **Enhanced Lead Nurturing:** Integrating the Resend flow with a proper CRM (like HubSpot or Salesforce) to track lead conversion beyond just the initial email.

## 4. How you used AI tools
AI was integral to this project in two distinct ways:
- **Development Tooling:** I used GitHub Copilot and Claude to scaffold the initial React components and write the complex test cases for the audit engine. This significantly sped up the "boilerplate" parts of the project, allowing me to focus on the unique business logic.
- **Product Feature:** The Anthropic Claude-3.5-Sonnet API is the "finishing touch" on the audit results. While the numbers are hardcoded, the AI summary provides that "consultant-level" feel that makes the tool shareable and credible to founders.

## 5. Self-ratings (1-10)
- **Discipline:** 10/10 (Strictly followed the Day 1–6 commit plan and documentation requirements).
- **Code Quality:** 9/10 (High test coverage, strong types, and pure-function logic in the core engine).
- **Design Sense:** 8/10 (Modern glassmorphic Tailwind UI, though could be further refined with custom animations).
- **Problem-Solving:** 9/10 (The move from a black-box AI audit to a hybrid deterministic/AI model was a critical pivot).
- **Entrepreneurial Thinking:** 10/10 (Focus on lead-gen, prominent CTAs, and Viral/Shareable features to drive ROI for the business).
