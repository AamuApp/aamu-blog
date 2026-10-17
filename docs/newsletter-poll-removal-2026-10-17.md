# Remove unavailable Newsletter polls from blog Docs — 17 October 2026

Updated the current Doc sources through `PATCH /api/v1/docs/:id` with `html`
only, following the temporary removal of Poll functionality:

- Comparison: `bffda5a9-aadb-48e6-b923-770622e72c4b`
  (`aamu-newsletters-vs-mailchimp-brevo-beehiiv`).
- Feature guide: `5c96f65a-4897-4604-ad73-a27b222bec0e`
  (`newsletters-in-aamuapp-from-subscribers-to-sending`).

Removed Poll availability claims, setup and voting instructions, results/history
references, answer-driven audience examples, Poll API examples and references in
HTML-size and review-token explanations. The comparison section now describes
subscriber history and acquisition reporting. Preview, attribution, subscriber
history, other API operations and competitor comparisons remain unchanged.

The general API article (`252fb285-ecc8-43f2-889f-0671a7637bca`) was also checked.
Its only polling reference describes fetching new Chat messages, so it needed no
change.

Procedure: `scripts/update-newsletter-poll-removal-docs.mjs` prepares a plan from
current CMS Docs. `--apply` verifies BlogPost-to-Doc links, checks for concurrent
source changes, patches only HTML, and verifies both saved Docs by reading them
back. Article links, titles, IDs and the comparison table/evidence date were
preserved. Validation confirms there are no remaining Poll feature claims or
instructions and that other feature coverage remains present. Historical creation
and update scripts are retained as historical records; current CMS Docs remain
authoritative.

Before/after sources, the private plan and verified readbacks are in
`/tmp/aamu-blog-newsletter-poll-removal/`. No build, generated content edit,
BlogPost metadata update, commit, push or deployment was performed. The source
changes will appear on the static blog during its next normal build.
