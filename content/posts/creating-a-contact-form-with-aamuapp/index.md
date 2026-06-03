---
author: "Ilkka Huotari"
title: "Creating a contact form with Aamu.app"
date: "2025-05-13T18:10:00.000Z"
modified: "2026-06-03T05:57:14.392Z"
description: "Using the Aamu.app database for contact forms"
cover:
  image: 45701b3de5a5b8c3_image.png
  relative: true
tags: ["database", "forms"]
ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p xmlns="http://www.w3.org/1999/xhtml">A contact form is one of the simplest useful ways to connect a public website to Aamu.app. A visitor fills in a form on your site, the submission is stored in an Aamu Database, and your team can handle the message inside the same workspace where the rest of the work happens.</p><p xmlns="http://www.w3.org/1999/xhtml">This article shows the simplest version: an HTML form that posts directly to an Aamu Forms endpoint. You do not need to expose a database API key in the browser for this. The Forms endpoint is designed for public form submissions; it can add rows to the selected table, but it is not a general database API key.</p><h2 xmlns="http://www.w3.org/1999/xhtml">What we are building</h2><p xmlns="http://www.w3.org/1999/xhtml">The flow is:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">Website form
  -&gt; Aamu Forms endpoint
  -&gt; Aamu Database row
  -&gt; optional automation, task, email, or follow-up workflow</code></pre><p xmlns="http://www.w3.org/1999/xhtml">For a contact form, the database usually has fields such as Name, Email, and Message. When someone submits the form, Aamu creates a new row with those values.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Ingredients</h2><p xmlns="http://www.w3.org/1999/xhtml">You need:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>an Aamu Database for storing contact form submissions,</p></li><li><p>Forms enabled for that database,</p></li><li><p>a table selected as the destination for submissions,</p></li><li><p>the Forms endpoint URL from the database settings, and</p></li><li><p>an HTML form on your website.</p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">You can use your own HTML or start from the example repository at <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/AamuApp/contact-form">https://github.com/AamuApp/contact-form</a>.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Create the database</h2><p xmlns="http://www.w3.org/1999/xhtml">Create a database in Aamu.app for the submissions. If the contact form template is available in your workspace, use it as a starting point. Otherwise, create a simple table yourself.</p><p xmlns="http://www.w3.org/1999/xhtml">For a basic contact form, the table can be as small as:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p><code>Name</code></p></li><li><p><code>Email</code></p></li><li><p><code>Message</code></p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">You can add more fields later, such as Company, Phone, Subject, Source page, or Consent, depending on what your site needs to collect.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Enable Forms</h2><p xmlns="http://www.w3.org/1999/xhtml">Open the database settings and enable Forms. Select the table where form submissions should be stored. Aamu will show a Forms endpoint for that table.</p><p xmlns="http://www.w3.org/1999/xhtml">Copy that endpoint and use it as the form's <code>action</code> URL. The endpoint is the public submission target. Do not put your database API key into the form HTML.</p><h2 xmlns="http://www.w3.org/1999/xhtml">The basic HTML form</h2><p xmlns="http://www.w3.org/1999/xhtml">Here is the important part of a simple no-JavaScript form:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-html">&lt;form action="FORMS_ENDPOINT_HERE" method="POST" enctype="multipart/form-data"&gt;
  &lt;input type="hidden" name="redirect-success" value="https://example.com/thank-you"&gt;
  &lt;input type="hidden" name="redirect-error" value="https://example.com/form-error"&gt;

  &lt;label&gt;
    Name
    &lt;input name="name" type="text" autocomplete="name" required&gt;
  &lt;/label&gt;

  &lt;label&gt;
    Email
    &lt;input name="email" type="email" autocomplete="email" required&gt;
  &lt;/label&gt;

  &lt;label&gt;
    Message
    &lt;textarea name="message" required&gt;&lt;/textarea&gt;
  &lt;/label&gt;

  &lt;button type="submit"&gt;Send&lt;/button&gt;
&lt;/form&gt;</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Replace <code>FORMS_ENDPOINT_HERE</code> with the endpoint from your Aamu database settings. Replace the redirect URLs with pages on your own site.</p><h2 xmlns="http://www.w3.org/1999/xhtml">How field names map to database fields</h2><p xmlns="http://www.w3.org/1999/xhtml">The form input names need to match the database field bindings. In the simple example above:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p><code>name</code> maps to <code>Name</code>,</p></li><li><p><code>email</code> maps to <code>Email</code>, and</p></li><li><p><code>message</code> maps to <code>Message</code>.</p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">Aamu shows the correct form field names in the database Forms settings. Use those generated names when you build your form. As a rule of thumb, field names are usually lowercase and spaces become underscores, but the settings screen is the source of truth.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Redirects and progressive enhancement</h2><p xmlns="http://www.w3.org/1999/xhtml">The hidden <code>redirect-success</code> and <code>redirect-error</code> fields let the form work without JavaScript. If the visitor's browser submits the form normally, Aamu can redirect the visitor to the right page after success or failure.</p><p xmlns="http://www.w3.org/1999/xhtml">You can also submit the form with JavaScript for a smoother experience, but it is still good to keep the plain HTML form working. That gives you a robust fallback and makes the form easier to test.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Submitting with JavaScript</h2><p xmlns="http://www.w3.org/1999/xhtml">If you want to avoid a full page reload, submit the form with <code>fetch</code> and <code>FormData</code>:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-javascript">const form = document.querySelector('form');

form.addEventListener('submit', async (event) =&gt; {
  event.preventDefault();

  const response = await fetch(form.action, {
    method: 'POST',
    body: new FormData(form)
  });

  if (!response.ok) {
    throw new Error('Form submission failed');
  }

  form.reset();
});</code></pre><p xmlns="http://www.w3.org/1999/xhtml">This still uses the Forms endpoint. It still does not expose a database API key.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Security notes</h2><p xmlns="http://www.w3.org/1999/xhtml">A public contact form receives public internet traffic, so treat it as an input surface.</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>Do not publish a database API key in your form or frontend JavaScript.</p></li><li><p>Collect only the information you actually need.</p></li><li><p>Use appropriate consent text if the form collects personal data.</p></li><li><p>Validate important fields in the browser for usability, but remember that server-side validation is what matters.</p></li><li><p>Consider anti-spam measures if the form is published on a high-traffic site.</p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">The Forms endpoint is safer than using the GraphQL database API from the browser because it is limited to accepting submissions for the configured form target.</p><h2 xmlns="http://www.w3.org/1999/xhtml">What happens after submission?</h2><p xmlns="http://www.w3.org/1999/xhtml">Once the row is in Aamu, the useful part begins. Because the submission is stored in a normal Aamu Database table, your team can work with it like other structured data.</p><p xmlns="http://www.w3.org/1999/xhtml">For example, you can:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>review submissions in the database,</p></li><li><p>create an automation that sends an email notification,</p></li><li><p>create a task for follow-up,</p></li><li><p>use the row as part of a customer workflow, or</p></li><li><p>connect later reporting or integrations through the database API.</p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">The follow-up article on database automations shows how to send an email when a new contact form row is inserted.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Testing</h2><p xmlns="http://www.w3.org/1999/xhtml">After the form is in place, submit a test message from the public page. Then open the Aamu database and confirm that a new row appears with the expected field values.</p><p xmlns="http://www.w3.org/1999/xhtml">If the row does not appear, check these first:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>the form <code>action</code> points to the current Forms endpoint,</p></li><li><p>Forms are enabled for the database,</p></li><li><p>the correct destination table is selected,</p></li><li><p>the input <code>name</code> attributes match the field bindings, and</p></li><li><p>required fields are actually included in the submitted form.</p></li></ul><h2 xmlns="http://www.w3.org/1999/xhtml">That's it</h2><p xmlns="http://www.w3.org/1999/xhtml">The simplest Aamu contact form is just an HTML form plus a Forms endpoint. Aamu stores the submission in a database row, and from there the message can become part of the team's normal workflow: email notifications, tasks, follow-up, reporting, or anything else you build around the data.</p>