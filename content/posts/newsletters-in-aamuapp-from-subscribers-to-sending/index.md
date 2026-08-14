---
author: "Ilkka Huotari"
authorPage: "/blog/authors/ilkka-huotari/"
authorTitle: "Founder"
authorBio: "Hey, dear reader!\n\nI created Aamu.app. \n\nWhy? A few reasons. The main reason was that there didn't seem to be a good option for this kind of app. The main one, Microsoft's offering, was (and is) a big mess. So, I thought it wouldn't be hard to create a better one. \n\nWell, it turned out to be a big job. Who would have known? Luckily AI came along and now the whole thing is about ready. \n\nI'm quite pleased to my creation. I have learned a lot, and still do. That has probably been the most rewarding thing from building this.\n\nThanks for reading!"
authorImage: "profile.png"
title: "Newsletters in Aamu.app: from subscribers to sending"
date: "2026-06-23T00:00:00.000Z"
modified: "2026-08-14T00:00:00.000Z"
description: "Create newsletters with a Database-backed audience, collect subscribers with an optional signup form, design reusable templates, send issues, and automate the workflow through the Aamu API."
cover:
  image: 2f8a174f63e318e3_newsletters.png
  relative: true

tags: ["newsletters", "email", "api", "automations"]
directAnswer: "Create newsletters with a Database-backed audience, manage subscriptions through the UI, Forms, CSV, or API, design reusable templates, and send issues from the same project workspace."
contentType: "how-to"
audience: "developers and technical teams"
faq: [{"question":"What is Newsletters in Aamu.app: from subscribers to sending?","answer":"Create newsletters with a Database-backed audience, manage subscriptions through the UI, Forms, CSV, or API, design reusable templates, and send issues from the same project workspace."},{"question":"Who is Newsletters in Aamu.app: from subscribers to sending for?","answer":"This guide is intended for developers and technical teams."},{"question":"What does this guide explain?","answer":"It explains the Database-backed audience model, optional signup form, templates, sending, and Newsletter API workflow in Aamu.app."}]

ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p><strong>Short answer:</strong> Create newsletters with a Database-backed audience, manage subscriptions through the UI, Forms, CSV, or API, design reusable templates, and send issues from the same project workspace.</p>

<p>Newsletters in Aamu.app bring the audience, reusable email design, individual issues, sending, and automation into the same project workspace. A team can prepare a publication without moving contacts to one service, designing the message in another, and reconnecting the workflow through a collection of integrations. A newsletter workflow is mostly about making sure the right people get the right message—and that nobody accidentally emails the entire planet.</p>

<p>Each Newsletter is project-scoped. Its Audience Database, issues, subscriber projection, template, sender settings, and API access follow the same team and project boundaries as the rest of the work in Aamu.</p>

<h2>One place for the whole publishing workflow</h2>

<p>A Newsletter has six practical areas: <strong>Issues</strong>, <strong>Subscribers</strong>, <strong>Signup form</strong>, <strong>Database</strong>, <strong>Template</strong>, and <strong>Settings</strong>. Issues are the messages you prepare and send. Subscribers shows the current delivery list. Signup form can create a public subscription form. Database opens the underlying audience and its subscription data. The template defines the reusable content structure and outer email design. Settings connect the Newsletter to a verified sending domain and mailbox.</p>

<p>The Newsletter name is edited directly where it is used. A new unnamed Newsletter opens the name field automatically, and an existing name can be clicked to edit it. Its Audience Database follows the Newsletter name. Sender details do not need to be duplicated: the visible sender name and email address come from the selected mailbox's <strong>Sender name</strong> and <strong>Address</strong>.</p>

<h2>The Audience Database is the source of truth</h2>

<p>Creating a Newsletter also creates its Audience Database, a Subscribers table, and managed subscribe and unsubscribe automations. You do not need to create a signup form before adding recipients. The <strong>Database</strong> tab opens the audience directly.</p>

<p>Recipients can be added individually, imported from CSV, collected with an Aamu Form, or written through the Database or Newsletter API. All of these routes converge on the same Database instead of maintaining separate lists. Each row has a clear <code>subscribed</code> or <code>unsubscribed</code> status, so an address can be removed from active delivery without losing its contact or consent history. The Newsletter's subscriber list is a derived delivery projection of these Database rows.</p>

<p>Because the audience belongs to the Newsletter's project, the same email address can have a different subscription choice in another team or audience. This is useful for SaaS products where marketing consent belongs to a particular service or organization rather than globally to an email address.</p>

<p>Every delivered message receives a subscriber-specific unsubscribe URL on the team's own hostname:</p>

<pre><code class="language-plaintext">https://{team}.aamu.app/newsletter/unsubscribe/{subscriberId}/{token}</code></pre>

<p>The public confirmation page keeps the result deliberately simple: the recipient sees that they have been unsubscribed and will no longer receive the Newsletter. The unsubscribe is also reflected in the Audience Database.</p>

<h2>Add an optional signup form with Aamu Forms</h2>

<p>The <strong>Signup form</strong> tab creates a public, editable Aamu Form for the Newsletter. The form starts with email and name fields, but it remains a normal Aamu Form: the team can edit its title, description, fields, visual theme, public URL, thank-you page, and custom CSS.</p>

<p>The form does not create or own a separate recipient Database. It writes each response to the Audience Database that was created with the Newsletter. The same managed automations update subscription state and the derived delivery list, so Form submissions, manual changes, CSV imports, and API writes stay consistent.</p>

<h2>A reusable template with deliberate placeholders</h2>

<p>The content template defines the repeatable structure editors see when they create an issue. It contains one issue-content area and one unsubscribe element. This prevents an essential compliance link from becoming an afterthought in each new message.</p>

<p>The wrapper controls the surrounding email HTML. It contains exactly one <code>{{CONTENT}}</code> placeholder for the rendered issue and can use <code>{{SUBJECT}}</code> where the subject belongs. Keeping content and wrapper separate makes it possible to adjust the publication's shared visual frame without rewriting every issue.</p>

<h2>Test the real message before sending</h2>

<p>An issue starts as a draft with a subject and HTML content. The preview combines the issue with the current Newsletter template and wrapper, so the editor can inspect the actual message structure before delivery.</p>

<p><strong>Send test</strong> uses the signed-in user's email when that address is an active subscriber. This is intentional: the test message gets the same subscriber-specific unsubscribe link as a production message. Testing therefore covers the link that recipients will really use, not a special placeholder URL that behaves differently.</p>

<p>Sending is explicit. <strong>Send test</strong> sends one test message; <strong>Send</strong> delivers a draft issue to active subscribers and marks it sent. While either operation is running, its button is disabled and shows <strong>Sending...</strong>, preventing accidental duplicate clicks.</p>

<h2>Mailbox configuration stays in the UI</h2>

<p>Before messages can be sent, the Newsletter needs a mailbox based on a verified email domain. Choose the domain, set the mailbox address, and set the sender name in Aamu. The Newsletter then uses that mailbox consistently for test and production delivery.</p>

<p>Mailbox provisioning is intentionally not part of the Newsletter API. Domain verification and sender configuration remain an administrative UI step, while routine publication work can be automated after the mailbox is ready.</p>

<h2>Automate newsletters through the API</h2>

<p>The project-scoped Newsletter API can list, create, and update Newsletters; create an optional signup form connected to the existing Audience Database; create and edit draft issues; manage subscribers; send a test; and explicitly send a production issue. Requests use a Team API key with the Newsletters scope and the project header.</p>

<pre><code class="language-plaintext">x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre>

<p>Creating a Newsletter through the API also creates its Audience Database and managed subscription automations. A simple automated flow can then add or synchronize recipients, create a Newsletter issue from approved content, send a test to the API actor, and leave production sending as a separate action. Subscriber API responses never expose unsubscribe tokens.</p>

<pre><code class="language-plaintext">POST /api/v1/newsletters/{newsletterId}/issues
{
  "subject": "June product update",
  "html": "&lt;p&gt;What changed this month...&lt;/p&gt;"
}

POST /api/v1/newsletters/{newsletterId}/issues/{issueId}/send-test
POST /api/v1/newsletters/{newsletterId}/issues/{issueId}/send</code></pre>

<p>Signup form creation is idempotent. The first request creates a Form connected to the Newsletter's existing Audience Database; later requests return the same connected form and automation:</p>

<pre><code class="language-plaintext">POST /api/v1/newsletters/{newsletterId}/signup-form</code></pre>

<p>The Database API offers another route for integrations that maintain audiences directly. Updating the Audience Database triggers the same subscription automations as manual changes and Form submissions. The Newsletter API remains the convenient interface for Newsletter-specific subscriber operations.</p>

<p>The separate send endpoints matter for AI and other automations. Creating or revising a draft is reversible; delivering email to a list is an external side effect. Aamu keeps that boundary visible instead of treating every content update as permission to publish.</p>

<p>For the complete endpoint overview, authentication model, and examples alongside the rest of the platform, see <a target="_blank" rel="noopener noreferrer nofollow" href="/blog/posts/building-with-the-aamu-api-from-tasks-to-docs-and-graphql/">Building with the Aamu API</a>.</p>

<h2>A Newsletter that belongs to the workspace</h2>

<p>The useful part of Newsletters in Aamu is not merely sending an HTML email. It is keeping the publication close to the project that produces it: the Docs that contain source material, the tasks that coordinate a release, the Audience Database and Forms that collect recipients, and the people responsible for reviewing the final message.</p>

<p>The result is a compact publishing workflow with one Database-backed audience, explicit subscription state, reusable design, realistic testing, safe unsubscribe links, and an API that can automate the repetitive parts without hiding the moment when a message is actually sent.</p>

<h2>Frequently asked questions</h2>

<h3>What is Newsletters in Aamu.app: from subscribers to sending?</h3>
<p>Create Newsletters with a Database-backed audience, manage subscriptions through the UI, Forms, CSV, or API, design reusable templates, and send issues from the same project workspace.</p>

<h3>Who is Newsletters in Aamu.app: from subscribers to sending for?</h3>
<p>This guide is intended for developers and technical teams.</p>

<h3>What does this guide explain?</h3>
<p>It explains the Database-backed audience model, optional signup form, templates, sending, and Newsletter API workflow in Aamu.app.</p>

<h2>Related articles</h2>
<ul><li><a href="/blog/posts/building-with-the-aamu-api-from-tasks-to-docs-and-graphql/">Building with the Aamu API: From Tasks to Docs and GraphQL</a></li><li><a href="/blog/posts/aamuapp-databases-practical-feature-guide/">Aamu.app Databases: a practical feature guide</a></li><li><a href="/blog/posts/ai-commands-in-aamuapp-turning-comments-into-workspace-actions/">AI commands in Aamu.app: turning comments into workspace actions</a></li><li><a href="/blog/posts/database-automations-with-aamuapp/">Database automations with Aamu.app</a></li><li><a href="/blog/posts/from-form-submission-to-follow-up-workflows-with-aamuapp/">From form submission to follow-up: workflows with Aamu.app</a></li></ul>
