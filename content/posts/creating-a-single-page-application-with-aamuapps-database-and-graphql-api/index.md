---
author: "Ilkka Huotari"
title: "Creating a single-page application with Aamu.app's database and GraphQL API"
date: "2025-05-15T05:05:00.000Z"
modified: "2026-06-05T09:02:49.755Z"
description: "How to build a single-page application on top of Aamu.app databases using the generated GraphQL API for structured row data."
cover:
  image: 4fce81ca007bb1b0_image.png
  relative: true
tags: ["api", "database", "graphql"]

ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p xmlns="http://www.w3.org/1999/xhtml">Aamu.app's Database and GraphQL API can be used as the data layer for a small web application. In this example, we will build a simple reservation calendar: the page lists existing reservations from an Aamu Database and lets visitors add a new reservation.</p><p xmlns="http://www.w3.org/1999/xhtml">The important update is security. A public single-page app should not contain a database API key in its JavaScript. Use the GraphQL API from a server-side endpoint, serverless function, or backend proxy. For public form submissions, use the Aamu Forms endpoint, which is designed for browser-side submissions and does not expose a general database API key.</p><h2 xmlns="http://www.w3.org/1999/xhtml">What we are building</h2><p xmlns="http://www.w3.org/1999/xhtml">The application has two jobs:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>read existing rows from an Aamu Database with GraphQL, and</p></li><li><p>add new rows through an Aamu Forms endpoint.</p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">The safe production flow looks like this:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">Browser SPA
  -&gt; your /api/reservations endpoint
  -&gt; Aamu GraphQL API
  -&gt; Aamu Database

Browser form
  -&gt; Aamu Forms endpoint
  -&gt; Aamu Database</code></pre><p xmlns="http://www.w3.org/1999/xhtml">The browser talks to your own public endpoint for reading data. Your endpoint keeps the Aamu API key private and forwards the GraphQL request to Aamu. For adding a row, the browser can post to the Forms endpoint because that endpoint is intentionally limited to form submissions.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Why split reads and writes?</h2><p xmlns="http://www.w3.org/1999/xhtml">GraphQL is the flexible database API. It can read rows and, depending on permissions, write or update data. That flexibility is useful, but it also means the API key should be treated as a server-side secret.</p><p xmlns="http://www.w3.org/1999/xhtml">The Forms endpoint is narrower. It is meant to accept public submissions into a configured table. That makes it a better fit for browser-side "add this form submission" actions.</p><p xmlns="http://www.w3.org/1999/xhtml">So the practical rule is:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>Use GraphQL from server-side code.</p></li><li><p>Use Forms endpoint from public HTML or frontend JavaScript.</p></li><li><p>Do not publish an Aamu database API key in browser code.</p></li></ul><h2 xmlns="http://www.w3.org/1999/xhtml">Create the database</h2><p xmlns="http://www.w3.org/1999/xhtml">Start by creating a database in Aamu.app. For this example, imagine a simple reservation table with fields like:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p><code>Title</code></p></li><li><p><code>Start time</code></p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">The exact table and field names affect the generated GraphQL type and field names. In the old example, the table was called <code>Sheet1</code>, which produced a collection named <code>Sheet1Collection</code>. In a real app, give the table a clearer name, such as <code>Reservation</code>.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Enable Forms for new reservations</h2><p xmlns="http://www.w3.org/1999/xhtml">Open the database settings and enable Forms. Select the reservation table as the destination table. Copy the Forms endpoint.</p><p xmlns="http://www.w3.org/1999/xhtml">Your form can then submit new rows without needing an API key in the browser:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-html">&lt;form action="FORMS_ENDPOINT_HERE" method="POST"&gt;
  &lt;label&gt;
    Title
    &lt;input name="title" required&gt;
  &lt;/label&gt;

  &lt;label&gt;
    Start time
    &lt;input name="start_time" type="datetime-local" required&gt;
  &lt;/label&gt;

  &lt;button type="submit"&gt;Reserve&lt;/button&gt;
&lt;/form&gt;</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Use the field names shown in the Aamu Forms settings. They are the source of truth for the input <code>name</code> attributes.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Read rows with a backend endpoint</h2><p xmlns="http://www.w3.org/1999/xhtml">For reading existing reservations, create a small server-side endpoint. It can be a Node server, a serverless function, a Cloudflare Worker, a Vercel function, a Netlify function, or any backend you already use.</p><p xmlns="http://www.w3.org/1999/xhtml">The backend stores these values privately:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">AAMU_API_KEY=your_private_api_key
AAMU_DB_ID=your_database_id
AAMU_GRAPHQL_ENDPOINT=https://api.aamu.app/api/v1/graphql/</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Then it sends the GraphQL request to Aamu:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-javascript">export async function listReservations() {
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
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Adjust the collection name and fields to match your database schema. If your table is still named <code>Sheet1</code>, the collection may be <code>Sheet1Collection</code>. If your table is named <code>Reservation</code>, the generated collection name is easier to understand.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Call your backend from the SPA</h2><p xmlns="http://www.w3.org/1999/xhtml">Now the browser can fetch reservations from your own endpoint:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-javascript">async function getReservations() {
  const response = await fetch('/api/reservations');

  if (!response.ok) {
    throw new Error('Failed to load reservations: ' + response.status);
  }

  const reservations = await response.json();
  renderReservations(reservations);
}

getReservations();</code></pre><p xmlns="http://www.w3.org/1999/xhtml">The frontend never sees the Aamu API key. It only sees the data your endpoint returns.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Submit new rows with Forms</h2><p xmlns="http://www.w3.org/1999/xhtml">For a smoother user experience, the SPA can submit the form with JavaScript while still using the Forms endpoint:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-javascript">const form = document.querySelector('form');

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
});</code></pre><p xmlns="http://www.w3.org/1999/xhtml">This keeps writes simple. The Forms endpoint accepts the submission, Aamu stores a new row, and the app reloads the visible list from your backend endpoint.</p><h2 xmlns="http://www.w3.org/1999/xhtml">What about a pure HTML demo?</h2><p xmlns="http://www.w3.org/1999/xhtml">For a local demo or learning exercise, you may see examples where the API key is placed directly in the HTML file. That can be useful to understand the moving parts, but it is not appropriate for a public website.</p><p xmlns="http://www.w3.org/1999/xhtml">Once the page is public, everything in the HTML and JavaScript is public too. If a database API key is there, visitors can read it. Treat that as a hard line: use a backend for GraphQL.</p><h2 xmlns="http://www.w3.org/1999/xhtml">What this gives you</h2><p xmlns="http://www.w3.org/1999/xhtml">This small architecture is already useful:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>Aamu Database stores the structured data.</p></li><li><p>GraphQL gives the app flexible read access from server-side code.</p></li><li><p>Forms endpoint lets the browser add rows safely.</p></li><li><p>The frontend stays a normal single-page app.</p></li><li><p>The team can still open Aamu and work with the rows directly.</p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">That last point is the quiet advantage. You are not only building an app around a database. You are building an app around a database that your team can also use inside the same workspace as docs, tasks, automations, and customer work.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Testing checklist</h2><p xmlns="http://www.w3.org/1999/xhtml">If the app does not work, check these first:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>The backend has <code>AAMU_API_KEY</code> and <code>AAMU_DB_ID</code> set.</p></li><li><p>The GraphQL query uses the generated collection and field names for your database.</p></li><li><p>The browser calls your backend endpoint, not Aamu GraphQL directly.</p></li><li><p>The form action points to the current Forms endpoint.</p></li><li><p>The input <code>name</code> attributes match the Forms field bindings.</p></li><li><p>After submitting, a new row appears in the Aamu Database.</p></li></ul><h2 xmlns="http://www.w3.org/1999/xhtml">That's it</h2><p xmlns="http://www.w3.org/1999/xhtml">The safe version of this app is still small: a single-page frontend, a tiny backend endpoint for GraphQL reads, and a Forms endpoint for browser-side submissions. That is enough to build many useful public-facing tools without exposing your database API key.</p>