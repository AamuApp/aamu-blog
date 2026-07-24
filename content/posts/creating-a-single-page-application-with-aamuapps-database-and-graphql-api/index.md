---
author: "Ilkka Huotari"
title: "Creating a single-page application with Aamu.app's database and GraphQL API"
date: "2025-05-15T05:05:00.000Z"
modified: "2026-07-24T23:08:48.040Z"
description: "How to build a single-page application on top of Aamu.app databases using the generated GraphQL API for structured row data."
cover:
  image: 4fce81ca007bb1b0_image.png
  relative: true

tags: ["api", "database", "graphql"]
directAnswer: "How to build a single-page application on top of Aamu.app databases using the generated GraphQL API for structured row data."
contentType: "how-to"
audience: "developers and technical teams"
faq: [{"question":"What is Creating a single-page application with Aamu.app's database and GraphQL API?","answer":"How to build a single-page application on top of Aamu.app databases using the generated GraphQL API for structured row data."},{"question":"Who is Creating a single-page application with Aamu.app's database and GraphQL API for?","answer":"This guide is intended for developers and technical teams."},{"question":"What does this guide explain?","answer":"It explains the main concepts, setup, and practical workflow for creating a single-page application with aamu.app's database and graphql api."}]


ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p><strong>Short answer:</strong> How to build a single-page application on top of Aamu.app databases using the generated GraphQL API for structured row data.</p>
<p>Aamu.app's Database and GraphQL API can be used as the data layer for a small web application. In this example, we will build a simple reservation calendar: the page lists existing reservations from an Aamu Database and lets visitors add a new reservation.</p><p>The important update is security. A public single-page app should not contain a database API key in its JavaScript. Use the GraphQL API from a server-side endpoint, serverless function, or backend proxy. For public form submissions, use the Aamu Forms endpoint, which is designed for browser-side submissions and does not expose a general database API key.</p><h2>What we are building</h2><p>The application has two jobs:</p><ul><li><p>read existing rows from an Aamu Database with GraphQL, and</p></li><li><p>add new rows through an Aamu Forms endpoint.</p></li></ul><p>The safe production flow looks like this:</p><pre><code class="language-plaintext">Browser SPA
  -&gt; your /api/reservations endpoint
  -&gt; Aamu GraphQL API
  -&gt; Aamu Database

Browser form
  -&gt; Aamu Forms endpoint
  -&gt; Aamu Database</code></pre><p>The browser talks to your own public endpoint for reading data. Your endpoint keeps the Aamu API key private and forwards the GraphQL request to Aamu. For adding a row, the browser can post to the Forms endpoint because that endpoint is intentionally limited to form submissions.</p><h2>Why split reads and writes?</h2><p>GraphQL is the flexible database API. It can read rows and, depending on permissions, write or update data. That flexibility is useful, but it also means the API key should be treated as a server-side secret.</p><p>The Forms endpoint is narrower. It is meant to accept public submissions into a configured table. That makes it a better fit for browser-side "add this form submission" actions.</p><p>So the practical rule is:</p><ul><li><p>Use GraphQL from server-side code.</p></li><li><p>Use Forms endpoint from public HTML or frontend JavaScript.</p></li><li><p>Do not publish an Aamu database API key in browser code.</p></li></ul><h2>Create the database</h2><p>Start by creating a database in Aamu.app. For this example, imagine a simple reservation table with fields like:</p><ul><li><p><code>Title</code></p></li><li><p><code>Start time</code></p></li></ul><p>The exact table and field names affect the generated GraphQL type and field names. In the old example, the table was called <code>Sheet1</code>, which produced a collection named <code>Sheet1Collection</code>. In a real app, give the table a clearer name, such as <code>Reservation</code>.</p><h2>Enable Forms for new reservations</h2><p>Open the database settings and enable Forms. Select the reservation table as the destination table. Copy the Forms endpoint.</p><p>Your form can then submit new rows without needing an API key in the browser:</p><pre><code class="language-html">&lt;form action="FORMS_ENDPOINT_HERE" method="POST"&gt;
  &lt;label&gt;
    Title
    &lt;input name="title" required&gt;
  &lt;/label&gt;

  &lt;label&gt;
    Start time
    &lt;input name="start_time" type="datetime-local" required&gt;
  &lt;/label&gt;

  &lt;button type="submit"&gt;Reserve&lt;/button&gt;
&lt;/form&gt;</code></pre><p>Use the field names shown in the Aamu Forms settings. They are the source of truth for the input <code>name</code> attributes.</p><h2>Read rows with a backend endpoint</h2><p>For reading existing reservations, create a small server-side endpoint. It can be a Node server, a serverless function, a Cloudflare Worker, a Vercel function, a Netlify function, or any backend you already use.</p><p>The backend stores these values privately:</p><pre><code class="language-plaintext">AAMU_API_KEY=your_private_api_key
AAMU_DB_ID=your_database_id
AAMU_GRAPHQL_ENDPOINT=https://api.aamu.app/api/v1/graphql/</code></pre><p>Then it sends the GraphQL request to Aamu:</p><pre><code class="language-javascript">export async function listReservations() {
  const response = await fetch(process.env.AAMU_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': process.env.AAMU_API_KEY,
      'x-db-id': process.env.AAMU_DB_ID
    },
    body: JSON.stringify({
      query: [
        '{',
        '  ReservationCollection(sort: { startTime: ASC }) {',
        '    id',
        '    title',
        '    startTime',
        '  }',
        '}'
      ].join('\n')
    })
  });

  if (!response.ok) {
    throw new Error('Aamu GraphQL error: ' + response.status);
  }

  const data = await response.json();

  if (data.errors?.length) {
    throw new Error(data.errors.map((error) =&gt; error.message).join('; '));
  }

  return data.data.ReservationCollection;
}</code></pre><p>Adjust the collection name and fields to match your database schema. If your table is still named <code>Sheet1</code>, the collection may be <code>Sheet1Collection</code>. If your table is named <code>Reservation</code>, the generated collection name is easier to understand.</p><h2>Call your backend from the SPA</h2><p>Now the browser can fetch reservations from your own endpoint:</p><pre><code class="language-javascript">async function getReservations() {
  const response = await fetch('/api/reservations');

  if (!response.ok) {
    throw new Error('Failed to load reservations: ' + response.status);
  }

  const reservations = await response.json();
  renderReservations(reservations);
}

getReservations();</code></pre><p>The frontend never sees the Aamu API key. It only sees the data your endpoint returns.</p><h2>Submit new rows with Forms</h2><p>For a smoother user experience, the SPA can submit the form with JavaScript while still using the Forms endpoint:</p><pre><code class="language-javascript">const form = document.querySelector('form');

form.addEventListener('submit', async (event) =&gt; {
  event.preventDefault();

  const response = await fetch(form.action, {
    method: 'POST',
    body: new FormData(form)
  });

  if (!response.ok) {
    throw new Error('Reservation failed: ' + response.status);
  }

  form.reset();
  await getReservations();
});</code></pre><p>This keeps writes simple. The Forms endpoint accepts the submission, Aamu stores a new row, and the app reloads the visible list from your backend endpoint.</p><h2>What about a pure HTML demo?</h2><p>For a local demo or learning exercise, you may see examples where the API key is placed directly in the HTML file. That can be useful to understand the moving parts, but it is not appropriate for a public website.</p><p>Once the page is public, everything in the HTML and JavaScript is public too. If a database API key is there, visitors can read it. Treat that as a hard line: use a backend for GraphQL.</p><h2>What this gives you</h2><p>This small architecture is already useful:</p><ul><li><p>Aamu Database stores the structured data.</p></li><li><p>GraphQL gives the app flexible read access from server-side code.</p></li><li><p>Forms endpoint lets the browser add rows safely.</p></li><li><p>The frontend stays a normal single-page app.</p></li><li><p>The team can still open Aamu and work with the rows directly.</p></li></ul><p>That last point is the quiet advantage. You are not only building an app around a database. You are building an app around a database that your team can also use inside the same workspace as docs, tasks, automations, and customer work.</p><h2>Testing checklist</h2><p>If the app does not work, check these first:</p><ul><li><p>The backend has <code>AAMU_API_KEY</code> and <code>AAMU_DB_ID</code> set.</p></li><li><p>The GraphQL query uses the generated collection and field names for your database.</p></li><li><p>The browser calls your backend endpoint, not Aamu GraphQL directly.</p></li><li><p>The form action points to the current Forms endpoint.</p></li><li><p>The input <code>name</code> attributes match the Forms field bindings.</p></li><li><p>After submitting, a new row appears in the Aamu Database.</p></li></ul><h2>That's it</h2><p>The safe version of this app is still small: a single-page frontend, a tiny backend endpoint for GraphQL reads, and a Forms endpoint for browser-side submissions. That is enough to build many useful public-facing tools without exposing your database API key.</p><h2>Frequently asked questions</h2><h3>What is Creating a single-page application with Aamu.app's database and GraphQL API?</h3><p>How to build a single-page application on top of Aamu.app databases using the generated GraphQL API for structured row data.</p><h3>Who is Creating a single-page application with Aamu.app's database and GraphQL API for?</h3><p>This guide is intended for developers and technical teams.</p><h3>What does this guide explain?</h3><p>It explains the main concepts, setup, and practical workflow for creating a single-page application with aamu.app's database and graphql api.</p><h2>Related articles</h2><ul><li><a href="/blog/posts/creating-a-blog-with-aamuapp/">Creating a blog with Aamu.app</a></li><li><a href="/blog/posts/aamuapp-databases-practical-feature-guide/">Aamu.app Databases: a practical feature guide</a></li><li><a href="/blog/posts/building-with-the-aamu-api-from-tasks-to-docs-and-graphql/">Building with the Aamu API: From Tasks to Docs and GraphQL</a></li><li><a href="/blog/posts/database-automations-with-aamuapp/">Database automations with Aamu.app</a></li><li><a href="/blog/posts/from-form-submission-to-follow-up-workflows-with-aamuapp/">From form submission to follow-up: workflows with Aamu.app</a></li></ul>