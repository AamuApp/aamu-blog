# Blog post metadata

Aamu.app's Database stores each blog post's structured metadata, while the
article body lives in an Aamu Doc. `build-with-graphql.js` combines both into a
Hugo page.

The metadata fields help readers, site templates, search engines, and
answer-oriented tools understand the article. They must describe information
that the article actually contains. Do not add unsupported claims or
keyword-only text.

## Core fields

### `title`

The page heading and article name. State the subject clearly and keep it
specific enough to distinguish the article from other posts.

### `slug`

The stable URL segment below `/blog/posts/`. Use lowercase words separated by
hyphens. Avoid changing a published slug; if it must change, put the previous
path in `aliases`.

### `description`

A concise summary for article listings, metadata, social previews, and
BlogPosting structured data. Use one or two complete sentences that explain
what the article covers.

### `tags`

A short list of established topic labels. Prefer existing tags over minor
spelling variants.

## Answer and classification fields

### `directAnswer`

A standalone, factual answer to the main question or subject of the article.
Use one or two sentences. Name the product or concept explicitly and include
the article's essential distinction without sales language.

The Hugo content generator displays this at the beginning of the article as
**Short answer**. It therefore needs to read naturally as visible content, not
as hidden metadata.

Example:

> Aamu Slides is a project-scoped presentation editor built into Aamu.app. It
> uses the team's existing Aamu identity and project access.

### `contentType`

A controlled label describing the article's purpose. Use one of the values
already established in the database:

- `how-to` — instructions for completing a task
- `overview` — an introduction to a product, feature, or subject
- `comparison` — a comparison between products or approaches
- `reference` — factual documentation intended for lookup
- `feature-guide` — a broader guide to the behavior and uses of one feature

The generator writes this value to Hugo front matter. Keeping the vocabulary
small makes it useful for later filtering and presentation.

### `audience`

A brief noun phrase naming the primary reader group. Use an existing audience
when it fits:

- `developers and technical teams`
- `small and growing teams evaluating productivity software`
- `small and growing support teams`
- `small and growing teams evaluating customer support software`
- `small and growing teams evaluating documentation and knowledge-management tools`

Introduce a new value only when none of these accurately describes the intended
reader.

## Structured supporting fields

### `faq`

A JSON-encoded array of question and answer objects:

```json
[
  {
    "question": "What is Aamu Slides?",
    "answer": "Aamu Slides is a presentation editor integrated into Aamu.app."
  }
]
```

Use natural questions a reader could reasonably ask after finding the article.
Answers should be short, self-contained, factually supported by the article,
and free of HTML.

The generator appends the FAQ visibly to the article and the Hugo template
publishes the same entries as `FAQPage` JSON-LD. Invalid JSON is ignored by the
generator.

### `relatedPosts`

A JSON-encoded array of published post slugs:

```json
[
  "introduction-to-aamu-app",
  "penpot-design-tool-feature-overview"
]
```

Choose a small number of genuinely relevant next reads. The generator resolves
the titles and appends a **Related articles** list. Use slugs, not full URLs.

### `aliases`

Previous paths that Hugo should redirect to the current post. The database
field is a string; separate multiple paths with commas or newlines. Each path
should begin with `/`.

Leave this empty for a new post that has never had another public URL.

## Publishing checklist

Before publishing:

1. Confirm that the Direct Answer and every FAQ answer are supported by the
   article body.
2. Validate `faq` and `relatedPosts` as JSON.
3. Use an established `contentType` and, when accurate, an established
   `audience`.
4. Confirm that every related-post slug exists and is published.
5. Keep old public URLs in `aliases` when changing a slug.
6. Build the site and inspect the visible Short answer, FAQ, related links, and
   page source's JSON-LD.
