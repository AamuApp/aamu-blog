# Newsletter Doc source updates — 16 October 2026

Updated the two existing Docs through `PATCH /api/v1/docs/:id` with `html` only:

- Comparison: `bffda5a9-aadb-48e6-b923-770622e72c4b`
  (`aamu-newsletters-vs-mailchimp-brevo-beehiiv`).
- Feature guide: `5c96f65a-4897-4604-ad73-a27b222bec0e`
  (`newsletters-in-aamuapp-from-subscribers-to-sending`).

The comparison now covers desktop/mobile and recipient previews, early HTML-size
feedback, subscriber history, acquisition attribution/reporting, and polls whose
answers can drive Database audience conditions. Competitor statements, external
references, their 15 October evidence date, pricing, delivery-window limits and
remaining A/B-testing/lifecycle/monetization gaps were preserved.

The guide adds the corresponding UI workflows, the 85,000-byte warning versus
the final 100,000-byte check, history limits, first signup attribution, one-question
polls with 2–10 choices, web confirmation, Database answer fields and current
results. New preview/history/poll API examples use the actual implemented routes.
The review-token description also includes poll configuration.

Both articles identify the additions as the 16 October implementation update,
available in a workspace once that version is deployed. No production rollout
was inferred from local implementation tests.

Procedure: `scripts/update-newsletter-reader-features-docs.mjs` prepares changes
from current live Docs without mutation. `--apply` uses the prepared plan,
checks the BlogPost → Doc relationships, refuses an unexpected concurrent Doc
change, patches only HTML, and reads both Docs back. It supports retry after a
partial success without sending the same write again. Historical creation scripts
are not the source for these edits; current CMS Docs are authoritative.

Verified both saved HTML bodies against the prepared content, allowing standard
editor link attributes/whitespace. Existing links, titles, IDs, statuses and
project/owner metadata were preserved. Preparation checked headings, article
markup, required feature coverage and the existing comparison table. Syntax and
`git diff --check` pass.

The private before/after plan and verified readbacks are in
`/tmp/aamu-blog-newsletter-update/`. No BlogPost metadata mutation, Hugo/content
build, generated site edit, commit, push or deployment was performed. The static
blog will incorporate these source changes during its next normal build.
