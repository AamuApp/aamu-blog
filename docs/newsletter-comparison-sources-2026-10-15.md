# Newsletter comparison — source notes, 15 October 2026

Article: **Aamu Newsletters vs Mailchimp, Brevo and beehiiv: which workflow fits?**

Source text and CMS metadata are in [the publishing script](../scripts/upsert-newsletter-platform-comparison-blog-post.mjs). Running it without arguments validates the article locally; `--apply` creates its Doc and BlogPost row through the API. It refuses to overwrite an existing slug. No Hugo build is part of this script.

This is an assessment from Aamu's product perspective, based on implementation and vendor documentation. No comparative inbox-placement or throughput benchmark was conducted. Recommendations are editorial judgments about workflow fit.

## Aamu implementation checked

In `/home/ile/src/sc2/aamuapp`:

- `src/common/newsletter-warmup.ts`: mandatory batches; defaults of 50 recipients, 24-hour waits and 2× growth. Initial size is limited to 1–50, waits to 24–168 hours and growth to 1.1–2.
- `src/server/lib/newsletter-send-queue.ts`: persistent delivery queue, waits and health pauses.
- `src/server/lib/newsletter-domain-warmup.ts`: sender-domain limits shared between campaigns.
- `src/server/lib/newsletters.ts`: Audience Database creation, subscription automations, issue preparation, review and sending.
- `src/server/routes/api-newsletters.ts` and related newsletter modules: audience management, reporting, scheduling and separate public publication.
- Existing [Newsletters feature guide](https://aamu.app/blog/posts/newsletters-in-aamuapp-from-subscribers-to-sending/): current end-user workflow.

The current feature does not provide a native A/B test flow, visual multi-step lifecycle campaign builder, paid subscription checkout/paywall, advertising network or reader referral program. General Database automation and API integration should not be described as equivalent ready-made marketing features.

## Vendor sources checked

| Claim | Primary source |
|---|---|
| Mailchimp segmentation, marketing flows and integrations | [Feature overview](https://mailchimp.com/features/) |
| Mailchimp test variables, winner selection and plan restrictions | [About A/B Tests](https://mailchimp.com/help/about-ab-tests/) |
| Mailchimp contact/plan pricing, send limits and overages | [Marketing pricing](https://mailchimp.com/pricing/marketing/) |
| Brevo marketing, CRM and communication channels | [Platform overview](https://help.brevo.com/hc/en-us/articles/33456241984914-Overview-of-the-Brevo-platform) |
| Brevo promotional versus transactional email and SMTP/API sending | [Message types](https://help.brevo.com/hc/en-us/articles/360021196220-What-are-the-differences-between-marketing-transactional-and-automation-emails) |
| Brevo email-volume tiers also set contact-storage limits | [Pricing-plan explanation](https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans) |
| beehiiv subscriptions, paywalls and advertising | [Monetization](https://www.beehiiv.com/features/monetization) |
| beehiiv recommendations versus reader referrals | [How free recommendations work](https://www.beehiiv.com/support/article/43027088988311-how-free-recommendations-work) |
| beehiiv subscriber/team limits and unlimited sends | [Pricing](https://www.beehiiv.com/pricing) |
| Aamu base/resource model and delivery charge | [Public pricing](https://aamu.app/) |

The article avoids competitor starting-price figures because contact counts, volumes, billing periods, promotions and feature tiers must be matched for a useful quote. Aamu's explicitly dated public charge is included alongside a recommendation to calculate the same workload for each service.

## Verification

- Syntax and local article validation, including the four-row comparison table, absolute source URLs and structured FAQ/related-post JSON.
- Related slugs checked against published CMS rows before creation.
- Doc HTML read back and compared with the submitted article, allowing editor whitespace, standard link attributes and table layout markup. Table cell text and structure were preserved.
- BlogPost metadata read back and compared, including Doc link, author, publication date, tags, FAQ and related posts.
- No site build or deployment; the user handles the build.

Created and verified through the API:

- Doc: `bffda5a9-aadb-48e6-b923-770622e72c4b`
- BlogPost: `32f9ff38-8c14-454d-aab6-caec7c06f814`
- Slug: `aamu-newsletters-vs-mailchimp-brevo-beehiiv`
