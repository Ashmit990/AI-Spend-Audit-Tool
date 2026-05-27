# User Interviews

## Interview 1: "The Sprawl Sufferer"
- **Name:** Mark T.
- **Role:** CTO & Co-founder
- **Company Stage:** Series A (25 employees)
- **Direct Quotes:**
  - "I have no idea how many people are actually using our Cursor Business subscription versus just using the free version on their own cards."
  - "We're paying for ChatGPT Team but I still see OpenAI API bills for $400 a month. Something doesn't add up."
  - "I just want a single number: how much am I wasting?"
- **Most Surprising Thing Said:** Mark mentioned that they often keep sub-optimal plans because they are afraid of losing "legacy data" or "organization-specific settings" when switching from individual to team plans.
- **Impact on Design:** Added the "Consolidation" logic in the audit engine to specifically flag when a company is double-paying for both a seat-based subscription and API-direct tokens for the same model.

## Interview 2: "The Sole Searcher"
- **Name:** Sarah L.
- **Role:** Founder
- **Company Stage:** Pre-seed (Bootstrap, 2 employees)
- **Direct Quotes:**
  - "Every $20/mo matters when you're self-funding. I'm on three different $20 plans because I can't decide which model is better."
  - "I didn't know Gemini had a Pro tier that was cheaper than my ChatGPT Plus sub."
  - "The layout needs to be mobile-friendly. I do my bookkeeping on my phone while I'm at the airport."
- **Most Surprising Thing Said:** Sarah didn't care about "Enterprise" features at all; she just wanted to know if there was a "Pro-sumer" tool that combined all models into one UI to save on multiple $20/mo fees.
- **Impact on Design:** Included comparative alternative suggestions (e.g., if you have Claude + ChatGPT, maybe switch to a single aggregator) and ensured the mobile lighthouse score was a priority.

## Interview 3: "The Finance Enforcer"
- **Name:** David K.
- **Role:** Head of Operations
- **Company Stage:** Series B (60 employees)
- **Direct Quotes:**
  - "I need a report I can show to the CEO that doesn't look like a sales brochure."
  - "We have 15 excess seats on Copilot because we don't offboard people from the GitHub org properly."
  - "If you can show me how to save $10,000 a year, I'll give you my email in a heartbeat."
- **Most Surprising Thing Said:** David was more interested in the "Seat Trimming" logic than the "Plan Downgrade" logic. He knew his team was on the right plans, but he suspected they were just paying for "ghost" seats.
- **Impact on Design:** Elevated the "Seats" input to be a primary field in the form and made the "excess seat detection" a prominent row in the final audit report.
