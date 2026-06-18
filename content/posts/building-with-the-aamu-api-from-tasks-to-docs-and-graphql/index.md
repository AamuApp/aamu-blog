---
author: "Ilkka Huotari"
title: "Building with the Aamu API: From Tasks to Docs and GraphQL"
date: "2026-05-22T07:10:00.000Z"
modified: "2026-06-18T23:52:19.609Z"
description: "A practical guide to the Aamu API for tasks, docs, meetings, files, forms, database automations, GraphQL rows, and activity timelines."
cover:
  image: afbb9a1096f82be0_aamuapp-api.png
  relative: true

tags: ["api", "docs", "tasks", "graphql", "databases", "automations"]

ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p xmlns="http://www.w3.org/1999/xhtml">Aamu exposes a project API for teams and AI agents that need to create, read, and update real work inside Aamu. The API follows the same building blocks people use in the UI: tasks, docs, meetings, forms, files, databases, database automations, and database rows through GraphQL.</p><p xmlns="http://www.w3.org/1999/xhtml">The API is described by an OpenAPI document at <code>/.well-known/openapi.json</code>. That document is useful both for humans and for AI tools that need to discover available operations.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Authentication and project scope</h2><p xmlns="http://www.w3.org/1999/xhtml">Every API request uses a Team API key in the <code>x-api-key</code> header. Project-scoped resources also use <code>x-project-id</code>. When an API key has access to multiple projects, the project header disambiguates which project the request should use.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">API keys can be scoped by feature and permission. For example, one key can have read-only Docs access, while another can create tasks, upload files, submit forms, and manage database automations in selected projects.</p><p xmlns="http://www.w3.org/1999/xhtml">Database schema and row access use the <strong>Database</strong> scope. Automation definitions use a separate <strong>Automations</strong> scope, because permission to work with database data should not automatically grant permission to create workflows with side effects. Automation actions also require the scope of their destination: <strong>Tasks write</strong> for <code>create_task</code> and <strong>Emails write</strong> for <code>send_email</code>.</p><p xmlns="http://www.w3.org/1999/xhtml">Team admins create keys from Team settings under <strong>API keys</strong>. The generated secret is shown only once, so copy it immediately. The stored key list later shows safe metadata such as name, creation time, last-used time, scopes, permissions, endpoints and required headers, but it never shows the secret again.</p><p xmlns="http://www.w3.org/1999/xhtml">The API documentation links are also available from the same settings page: <code>/.well-known/openapi.json</code>, the alternative <code>/api/openapi.json</code>, and the AI plugin manifest at <code>/.well-known/ai-plugin.json</code>.</p><h2 xmlns="http://www.w3.org/1999/xhtml">API actor</h2><p xmlns="http://www.w3.org/1999/xhtml">Write operations can set the acting user with <code>x-aamu-actor</code>. The value can be a username, such as <code>ai</code> or <code>badding</code>, or a user id. The actor must be a member of the scoped project.</p><p xmlns="http://www.w3.org/1999/xhtml">When the header is omitted, Aamu uses the project <code>ai</code> user when available, otherwise the project owner. The same fallback applies across project item writes: tasks, docs, meetings, form submissions, file upload registration, and database creation/schema operations.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">x-aamu-actor: ai</code></pre><h2 xmlns="http://www.w3.org/1999/xhtml">API key introspection</h2><p xmlns="http://www.w3.org/1999/xhtml">Integrations can inspect the API key they are currently using with <code>GET /api/v1/key</code>. This is useful for setup checks, debugging missing permissions, and choosing the right project header when a key has multiple scopes.</p><p xmlns="http://www.w3.org/1999/xhtml">The endpoint returns safe metadata only. It never returns the API key value, salt, hash, or any other secret used to validate the key.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: inspect current API key</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/key
x-api-key: YOUR_API_KEY</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "key": {
    "id": "API_KEY_ID",
    "name": "Support automation",
    "permissions": ["read", "write", "comment"],
    "scopes": [
      {
        "feature": "helpdesk",
        "resource_id": "PROJECT_ID",
        "permissions": ["read", "write", "comment"]
      },
      {
        "feature": "team-brain",
        "resource_id": "PROJECT_ID",
        "permissions": ["read", "write", "comment"]
      }
    ],
    "created": 1780000000000,
    "created_by": "USER_ID",
    "last_used_at": 1780000000000,
    "expires_at": null
  }
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Use the returned <code>scopes</code> list to confirm which features the key can access. Project-scoped endpoints still use <code>x-project-id</code> when the project needs to be disambiguated.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Team Brain</h2><p xmlns="http://www.w3.org/1999/xhtml">Team Brain is the shared knowledge layer behind Aamu AI. It can be queried directly through the API when an integration needs grounded context before it writes a task, drafts a support reply, creates a doc, or decides what to do next.</p><p xmlns="http://www.w3.org/1999/xhtml">The retrieve endpoint returns matching curated Team Brain entries and source chunks. It does not generate a final answer by itself; callers can use the results as context for their own model, or let Aamu use the same knowledge through a workflow such as Helpdesk reply-draft generation.</p><h3 xmlns="http://www.w3.org/1999/xhtml">POST: retrieve knowledge</h3><p xmlns="http://www.w3.org/1999/xhtml"><code>limit</code> controls the maximum number of matching results returned. Results are ranked by relevance score, so a smaller limit is useful when an AI prompt needs only the strongest few pieces of context, while a larger limit gives the caller more material to inspect or rerank.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/team-brain/retrieve
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "query": "How should we answer a billing cancellation question?",
  "limit": 8
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "results": [
    {
      "kind": "brain",
      "score": 0.82,
      "title": "Cancellation billing policy",
      "text": "Explain the policy clearly and ask for the account email if needed.",
      "urls": []
    }
  ]
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Use Team Brain read scope for the project. When Helpdesk draft generation is configured to use Team Brain, the same Team Brain read scope is required in addition to Helpdesk write scope.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Users</h2><p xmlns="http://www.w3.org/1999/xhtml">The Users API resolves project members for actor headers, task assignees and integrations that need stable Aamu user ids. It accepts any project read scope, such as Tasks, Docs, Helpdesk or Emails.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: list users</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/users/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">The older <code>?username=...</code> query filter is still supported for backwards compatibility, but one-user lookups should use the resource endpoint below.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: get one user</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/users/badding
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">The path value can be a username or user id. Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "user": {
    "id": "USER_ID",
    "username": "badding",
    "name": "Badding",
    "email": "badding@example.com"
  }
}</code></pre><h2 xmlns="http://www.w3.org/1999/xhtml">Helpdesk</h2><p xmlns="http://www.w3.org/1999/xhtml">The Helpdesk API is designed for human-in-the-loop support automation. Integrations can read new tickets, prepare reply drafts, and send a draft only through an explicit send command.</p><p xmlns="http://www.w3.org/1999/xhtml">Reply drafts are stored in the same user-specific comment draft location the UI uses, and the ticket is marked with <code>hasDraft</code>. In practice this means the draft appears in the Helpdesk reply editor for the API actor, ready for a human to review and send.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: list tickets</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/helpdesk/tickets/?status=open&amp;unanswered=true
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">GET: resolve a Helpdesk actor</h3><p xmlns="http://www.w3.org/1999/xhtml">Use this endpoint to check a Helpdesk actor and the project Helpdesk mailbox used for email tickets. The actor can be a username or user id. The response includes safe mailbox metadata only, never passwords or tokens.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/helpdesk/actors/ile
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "actor": {
    "id": "USER_ID",
    "username": "ile",
    "name": "Ilkka Huotari",
    "email": "user-account@example.com",
    "helpdesk_name": "Ilkka",
    "mailbox": {
      "email": "support@example.com",
      "name": "Support",
      "configured": true
    }
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">PUT: write a reply draft</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">PUT /api/v1/helpdesk/tickets/TICKET_ID/reply-draft
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai
Content-Type: application/json

{
  "html": "&lt;p&gt;Hei, kiitos viestistä. Tarkistin tilanteen ja...&lt;/p&gt;",
  "mode": "replace"
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: generate a reply draft</h3><p xmlns="http://www.w3.org/1999/xhtml">Aamu can also generate the draft with Team AI. By default this uses Team Brain retrieval as context, so the API key needs both Helpdesk write scope and Team Brain read scope for the project.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/helpdesk/tickets/TICKET_ID/reply-draft/generate
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai
Content-Type: application/json

{
  "instructions": "Answer in Finnish, friendly and concise.",
  "use_team_brain": true,
  "mode": "replace"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">The generated draft is saved as the API actor’s Helpdesk comment draft. It is not sent automatically.</p><h3 xmlns="http://www.w3.org/1999/xhtml">POST: send a reply draft</h3><p xmlns="http://www.w3.org/1999/xhtml">Sending is deliberately separate from writing or generating a draft. The send endpoint takes the current draft for the API actor, sends it through the same Helpdesk comment/email path as the UI, clears the draft, and returns the sent comment plus the updated ticket.</p><p xmlns="http://www.w3.org/1999/xhtml">Use Helpdesk comment permission for this endpoint. <code>x-aamu-actor</code> selects whose draft is sent, so integrations can safely keep AI-generated drafts under an <code>ai</code> actor or send as a specific user when that is intended.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/helpdesk/tickets/TICKET_ID/reply-draft/send
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "comment_path": "comments.3",
  "comment": {
    "id": "COMMENT_ID",
    "html": "&lt;p&gt;Hei, kiitos viestistä...&lt;/p&gt;",
    "from": "ai"
  },
  "ticket": {
    "id": "TICKET_ID",
    "has_draft": false
  }
}</code></pre><h2 xmlns="http://www.w3.org/1999/xhtml">Emails</h2><p xmlns="http://www.w3.org/1999/xhtml">The Email API follows the same human-in-the-loop model as Helpdesk: integrations can list email threads, write or generate a user-specific reply draft, and send that draft only through an explicit send command.</p><p xmlns="http://www.w3.org/1999/xhtml">Drafts are stored in the same user-specific comment draft location the email UI uses and the email is marked with <code>hasDraft</code>. Use <code>x-aamu-actor</code> to select whose draft is written, generated or sent.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: list emails</h3><p xmlns="http://www.w3.org/1999/xhtml"><code>limit</code> controls the maximum number of email threads returned. Use <code>status=unanswered</code> or <code>unanswered=true</code> when building an AI reply queue.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/emails/?status=unanswered&amp;limit=20
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">GET: resolve an email actor</h3><p xmlns="http://www.w3.org/1999/xhtml">Use this endpoint to check which project-specific email address an actor uses when sending email replies. The actor can be a username or user id. The response includes safe mailbox metadata only, never passwords or tokens.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/emails/actors/ile
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "actor": {
    "id": "USER_ID",
    "username": "ile",
    "name": "Ilkka Huotari",
    "email": "user-account@example.com",
    "mailbox": {
      "email": "project-mailbox@example.com",
      "name": "Kansalaiskeskustelu",
      "configured": true
    }
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">GET: search email contacts</h3><p xmlns="http://www.w3.org/1999/xhtml">Use contacts when selecting recipients for new drafts or sent emails. The API also auto-resolves address-only recipients to existing contacts by email address. Missing contacts are created only when <code>create_missing_contacts</code> is explicitly set to <code>true</code>.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/emails/contacts/?q=ilkkah&amp;limit=10
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ile</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: create a new email draft</h3><p xmlns="http://www.w3.org/1999/xhtml">Use this endpoint to create a new outbound email draft for the API actor without sending it. The draft appears in the same email draft list the UI uses. Use Emails write permission for this endpoint.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/emails/drafts/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ile
Content-Type: application/json

{
  "subject": "Draft from Aamu API",
  "html": "&lt;p&gt;This draft has not been sent.&lt;/p&gt;",
  "to": [
    { "address": "ilkkah@gmail.com", "name": "Ilkka" }
  ],
  "create_missing_contacts": true
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: send a new email</h3><p xmlns="http://www.w3.org/1999/xhtml">Use this endpoint to send a new outbound email, not a reply to an existing thread. It creates a draft for the API actor, sends it through the same project email path as the UI, and returns the sent email thread. Use Emails comment permission for this endpoint.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/emails/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ile
Content-Type: application/json

{
  "subject": "Test email from Aamu API",
  "html": "&lt;p&gt;Hello from the Aamu Email API.&lt;/p&gt;",
  "to": [
    { "address": "ilkkah@gmail.com", "name": "Ilkka" }
  ]
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">PUT: write a reply draft</h3><p xmlns="http://www.w3.org/1999/xhtml">The API chooses the original sender/contact as the default recipient when possible. You can pass <code>to</code> explicitly if the integration wants to override recipients.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">PUT /api/v1/emails/EMAIL_ID/reply-draft
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai
Content-Type: application/json

{
  "html": "&lt;p&gt;Hei, kiitos viestistä. Palaamme tähän pian.&lt;/p&gt;",
  "mode": "replace",
  "to": [
    { "address": "customer@example.com", "name": "Customer" }
  ]
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: generate a reply draft</h3><p xmlns="http://www.w3.org/1999/xhtml">Email draft generation supports optional <code>instructions</code> for tone, language or constraints. By default it uses Team Brain retrieval as context, so the API key needs both Emails write scope and Team Brain read scope for the project.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/emails/EMAIL_ID/reply-draft/generate
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai
Content-Type: application/json

{
  "instructions": "Answer in Finnish and keep it short.",
  "use_team_brain": true,
  "mode": "replace"
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: send a reply draft</h3><p xmlns="http://www.w3.org/1999/xhtml">Sending uses the same email-comment/send path as the UI. The endpoint sends the current draft for the API actor, clears it, and returns the sent comment plus the updated email thread. Use Emails comment permission for this endpoint.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/emails/EMAIL_ID/reply-draft/send
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai</code></pre><h2 xmlns="http://www.w3.org/1999/xhtml">Tasks</h2><p xmlns="http://www.w3.org/1999/xhtml">The Tasks API is useful for turning external events, AI plans, and support workflows into actionable work. Task create and update operations use the same internal task helpers as the UI for fields that have side effects, such as status, assigned users, dates, repetition, and reminders.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: list tasks</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/tasks/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "tasks": [
    {
      "id": "TASK_ID",
      "pid": "YOUR_PROJECT_ID",
      "title": "Review API integration",
      "html": "&lt;p&gt;Check the rollout notes.&lt;/p&gt;",
      "status": "active",
      "start_at": 1779872400000,
      "end_at": 1779876000000,
      "repeat": "weekly",
      "reminders": [
        { "d": 0, "h": 0, "m": 15 }
      ],
      "users": ["USER_ID"],
      "comments": []
    }
  ]
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">GET: list project users</h3><p xmlns="http://www.w3.org/1999/xhtml">Use the Users endpoint to resolve usernames to user ids before assigning task users or choosing an API actor.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/users/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">You can also filter by exact username:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/users/?username=badding
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "users": [
    {
      "id": "USER_ID",
      "username": "badding",
      "name": "badding",
      "email": "person@example.com"
    }
  ]
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: create a task</h3><p xmlns="http://www.w3.org/1999/xhtml">Create accepts the same task workflow fields as update. If <code>users</code> is provided, the API applies the assignment changes through the same task user helpers as the UI. Dates, repetition, and reminders go through the task date-change helper.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/tasks/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai
Content-Type: application/json

{
  "title": "Prepare customer summary",
  "html": "&lt;p&gt;Summarize the latest feedback and add next steps.&lt;/p&gt;",
  "status": "active",
  "users": ["USER_ID_1", "USER_ID_2"],
  "start_at": "2026-05-27T09:00:00.000Z",
  "end_at": "2026-05-27T10:00:00.000Z",
  "reminders": [
    { "minutes_before": 15 },
    { "d": 0, "h": 1, "m": 0 }
  ],
  "comments": [
    { "html": "&lt;p&gt;Created from the external workflow.&lt;/p&gt;" }
  ]
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">For repeating tasks, set <code>repeat</code> or <code>repetition</code> to <code>daily</code>, <code>weekly</code>, <code>monthly</code>, or <code>yearly</code>. Leave it out for a one-time task.</p><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "task": {
    "id": "TASK_ID",
    "pid": "YOUR_PROJECT_ID",
    "title": "Prepare customer summary",
    "html": "&lt;p&gt;Summarize the latest feedback and add next steps.&lt;/p&gt;",
    "status": "active",
    "start_at": 1779872400000,
    "end_at": 1779876000000,
    "reminders": [
      { "d": 0, "h": 0, "m": 15 },
      { "d": 0, "h": 1, "m": 0 }
    ],
    "users": ["USER_ID_1", "USER_ID_2"],
    "comments": []
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">PATCH: update a task</h3><p xmlns="http://www.w3.org/1999/xhtml">Update supports title, HTML, status, assigned users, start and end dates, repetition, and reminders. Fields with side effects are routed through the same internal helpers as UI operations.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">PATCH /api/v1/tasks/TASK_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai
Content-Type: application/json

{
  "title": "Prepare customer summary and next steps",
  "html": "&lt;p&gt;Summarize feedback, risks, and next actions.&lt;/p&gt;",
  "status": "complete",
  "users": ["USER_ID_1", "USER_ID_2"],
  "start_at": 1779872400000,
  "end_at": 1779876000000,
  "repeat": "weekly",
  "reminders": [
    { "minutes_before": 15 }
  ]
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Use <code>null</code> to clear <code>start_at</code>, <code>end_at</code>, <code>repeat</code>, or <code>reminders</code>. Use an empty reminder array to remove all reminders.</p><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "task": {
    "id": "TASK_ID",
    "title": "Prepare customer summary and next steps",
    "html": "&lt;p&gt;Summarize feedback, risks, and next actions.&lt;/p&gt;",
    "status": "complete",
    "start_at": 1779872400000,
    "end_at": 1779876000000,
    "repeat": "weekly",
    "reminders": [
      { "d": 0, "h": 0, "m": 15 }
    ],
    "users": ["USER_ID_1", "USER_ID_2"]
  }
}</code></pre><h2 xmlns="http://www.w3.org/1999/xhtml">Task comments</h2><p xmlns="http://www.w3.org/1999/xhtml">Task comments use the same HTML-oriented content model as tasks. Comments are returned as part of the task response.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: read a task with comments</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/tasks/TASK_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "task": {
    "id": "TASK_ID",
    "title": "Prepare customer summary",
    "html": "&lt;p&gt;Summarize the latest feedback.&lt;/p&gt;",
    "comments": [
      {
        "id": "COMMENT_ID",
        "html": "&lt;p&gt;Draft summary added.&lt;/p&gt;"
      }
    ]
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: add a comment</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/tasks/TASK_ID/comments
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "html": "&lt;p&gt;I reviewed the customer notes and added follow-up actions.&lt;/p&gt;"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "task": {
    "id": "TASK_ID",
    "comments": [
      {
        "id": "COMMENT_ID",
        "html": "&lt;p&gt;I reviewed the customer notes and added follow-up actions.&lt;/p&gt;"
      }
    ]
  }
}</code></pre><h2 xmlns="http://www.w3.org/1999/xhtml">Docs</h2><p xmlns="http://www.w3.org/1999/xhtml">The Docs API creates durable written material directly into Aamu. It is a good fit for AI-generated summaries, runbooks, meeting notes, release notes, customer handoff documents, and internal knowledge articles.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: list docs</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/docs/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "docs": [
    {
      "id": "DOC_ID",
      "pid": "YOUR_PROJECT_ID",
      "title": "Weekly API Report",
      "status": "public",
      "html": ""
    }
  ]
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: create a doc</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/docs/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "title": "Weekly API Report",
  "html": "&lt;h1&gt;Weekly API Report&lt;/h1&gt;&lt;p&gt;All checks passed.&lt;/p&gt;"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "doc": {
    "id": "DOC_ID",
    "pid": "YOUR_PROJECT_ID",
    "title": "Weekly API Report",
    "status": "public",
    "html": "&lt;h1&gt;Weekly API Report&lt;/h1&gt;&lt;p&gt;All checks passed.&lt;/p&gt;"
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">PATCH: update a doc</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">PATCH /api/v1/docs/DOC_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "title": "Weekly API Report, revised",
  "html": "&lt;h1&gt;Weekly API Report&lt;/h1&gt;&lt;p&gt;All checks passed after the retry.&lt;/p&gt;"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "doc": {
    "id": "DOC_ID",
    "title": "Weekly API Report, revised",
    "html": "&lt;h1&gt;Weekly API Report&lt;/h1&gt;&lt;p&gt;All checks passed after the retry.&lt;/p&gt;"
  }
}</code></pre><h2 xmlns="http://www.w3.org/1999/xhtml">Meetings</h2><p xmlns="http://www.w3.org/1999/xhtml">The Meetings API can create and update project meetings. It supports fields such as name, HTML description, start time, end time, and invitee emails.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: list meetings</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/meetings/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "meetings": [
    {
      "id": "MEETING_ID",
      "pid": "YOUR_PROJECT_ID",
      "name": "API rollout review",
      "status": "public",
      "html": "&lt;p&gt;Review integration status.&lt;/p&gt;",
      "start_time": 1779458400000,
      "end_time": 1779462000000
    }
  ]
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: create a meeting</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/meetings/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "API rollout review",
  "html": "&lt;p&gt;Review integration status and next steps.&lt;/p&gt;",
  "start_time": 1779458400000,
  "end_time": 1779462000000
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "meeting": {
    "id": "MEETING_ID",
    "pid": "YOUR_PROJECT_ID",
    "name": "API rollout review",
    "status": "public",
    "html": "&lt;p&gt;Review integration status and next steps.&lt;/p&gt;"
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">PATCH: update a meeting</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">PATCH /api/v1/meetings/MEETING_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "API rollout review, updated",
  "html": "&lt;p&gt;Review production results and decide follow-up actions.&lt;/p&gt;",
  "start_time": 1779462000000,
  "end_time": 1779465600000
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "meeting": {
    "id": "MEETING_ID",
    "name": "API rollout review, updated",
    "html": "&lt;p&gt;Review production results and decide follow-up actions.&lt;/p&gt;",
    "start_time": 1779462000000,
    "end_time": 1779465600000
  }
}</code></pre><h2 xmlns="http://www.w3.org/1999/xhtml">Forms API</h2><p xmlns="http://www.w3.org/1999/xhtml">The authenticated Forms API lets integrations list forms, inspect fields, and submit responses. A submitted response creates a row in the database table connected to the form.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: list forms</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/forms/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "forms": [
    {
      "id": "FORM_ID",
      "pid": "YOUR_PROJECT_ID",
      "name": "Feedback form",
      "status": "public",
      "table_id": "TABLE_ID",
      "fields": [
        { "id": "COLUMN_ID", "name": "Email", "type": "text", "gtype": "email" },
        { "id": "COLUMN_ID_2", "name": "Message", "type": "longtext", "gtype": "message" }
      ]
    }
  ]
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: submit a form response</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/forms/FORM_ID/submissions
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "fields": {
    "email": "person@example.com",
    "message": "I would like to hear more."
  }
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "submission": {
    "id": "ROW_ID",
    "form_id": "FORM_ID",
    "db_id": "DB_ID",
    "table_id": "TABLE_ID"
  }
}</code></pre><h2 xmlns="http://www.w3.org/1999/xhtml">Public forms</h2><p xmlns="http://www.w3.org/1999/xhtml">Public browser forms use the same URL for viewing and submitting. They do not use a Team API key. This is separate from the authenticated Forms API.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: render a public form</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /shared/form/FORM_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response is HTML:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">&lt;form action="https://your-team.aamu.app/shared/form/FORM_ID" method="post" enctype="multipart/form-data"&gt;
  &lt;input type="hidden" name="form_builder" value="1"&gt;
  ...
&lt;/form&gt;</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: submit a public form</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /shared/form/FORM_ID
Content-Type: multipart/form-data

form_builder=1
email=person@example.com
message=I would like to hear more.</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response is usually a redirect to the form thank-you page. For AJAX-style multipart submissions, the response can be JSON:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "success": true,
  "id": "ROW_ID"
}</code></pre><h2 xmlns="http://www.w3.org/1999/xhtml">Files</h2><p xmlns="http://www.w3.org/1999/xhtml">Aamu’s editor uses relative file URLs such as <code>/file/browser/{filepointer_id}/{file_version_id}/{name}</code>. The Files API follows the same pattern, so API-created content works with the UI editor.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: read file metadata</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/files/FILEPOINTER_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "file": {
    "id": "FILEPOINTER_ID",
    "filepointer_id": "FILEPOINTER_ID",
    "file_id": "FILE_VERSION_ID",
    "file_version_id": "FILE_VERSION_ID",
    "name": "example.png",
    "type": "image/png",
    "size": 12345,
    "browser_url": "/file/browser/FILEPOINTER_ID/FILE_VERSION_ID/example.png",
    "download_url": "/file/dl/FILEPOINTER_ID/FILE_VERSION_ID/example.png"
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: upload a file</h3><p xmlns="http://www.w3.org/1999/xhtml">Uploading uses two API POSTs and one signed PUT. First prepare the upload:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/files/prepare-upload
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "example.png",
  "type": "image/png",
  "size": 12345
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "upload": {
    "method": "PUT",
    "url": "SIGNED_UPLOAD_URL",
    "headers": { "Content-Type": "image/png" }
  },
  "complete": {
    "file_id": "FILE_VERSION_ID",
    "bucket": "files",
    "key": "UPLOAD_KEY",
    "name": "example.png",
    "type": "image/png",
    "size": 12345
  }
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">After uploading the bytes to <code>SIGNED_UPLOAD_URL</code>, complete the upload:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/files/complete-upload
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "file_id": "FILE_VERSION_ID",
  "bucket": "files",
  "key": "UPLOAD_KEY",
  "name": "example.png",
  "type": "image/png",
  "size": 12345
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "file": {
    "id": "FILEPOINTER_ID",
    "file_id": "FILE_VERSION_ID",
    "browser_url": "/file/browser/FILEPOINTER_ID/FILE_VERSION_ID/example.png",
    "download_url": "/file/dl/FILEPOINTER_ID/FILE_VERSION_ID/example.png"
  }
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">The <code>browser_url</code> can be embedded in Docs or Tasks HTML. The old item-level <code>files</code> field is deprecated and is not returned by the current API.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Databases and GraphQL</h2><p xmlns="http://www.w3.org/1999/xhtml">GraphQL is the main database row API. The REST Database API creates databases, adds tables, and changes table schema. Row reads and writes then use the generated GraphQL schema for that database.</p><p xmlns="http://www.w3.org/1999/xhtml">A useful mental model is: use REST to shape the database, and use GraphQL to work with the rows inside it. This keeps schema setup explicit while giving integrations a typed query and mutation surface for actual data.</p><h3 xmlns="http://www.w3.org/1999/xhtml">POST: create a database</h3><p xmlns="http://www.w3.org/1999/xhtml">Creating a database also creates its first table. The response returns both the database id and the initial table id.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/databases/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "Small-team CRM"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "database": {
    "id": "DB_ID",
    "pid": "YOUR_PROJECT_ID",
    "name": "Small-team CRM",
    "tables": ["DEALS_TABLE_ID"],
    "table_id": "DEALS_TABLE_ID"
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: add a table</h3><p xmlns="http://www.w3.org/1999/xhtml">Use the table endpoint when the integration needs a related table, for example companies next to deals, contacts next to accounts, or products next to orders.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/databases/DB_ID/tables
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "name": "Companies",
  "gtype": "Companies"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "table": {
    "id": "COMPANIES_TABLE_ID",
    "name": "Companies",
    "gtype": "Companies",
    "columns": []
  },
  "database": {
    "id": "DB_ID",
    "tables": ["DEALS_TABLE_ID", "COMPANIES_TABLE_ID"]
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: add columns</h3><p xmlns="http://www.w3.org/1999/xhtml">Columns are added to one table at a time. A reference column links rows in the current table to rows in another table in the same database.</p><p xmlns="http://www.w3.org/1999/xhtml">The public column types are <code>text</code>, <code>longtext</code>, <code>link</code>, <code>document</code>, <code>documents</code>, <code>number</code>, <code>status</code>, <code>checkbox</code>, <code>timedate</code>, <code>timeline</code>, <code>tags</code>, <code>file</code>, <code>files</code>, <code>reference</code>, <code>contact</code>, <code>user</code>, <code>task</code>, <code>tasks</code>, <code>email</code>, <code>emails</code>, <code>meeting</code>, and <code>meetings</code>. List-like fields such as <code>documents</code>, <code>tags</code>, <code>tasks</code>, <code>emails</code>, and <code>meetings</code> are written as arrays in GraphQL.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/databases/DB_ID/tables/COMPANIES_TABLE_ID/columns
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "columns": [
    { "name": "Company name", "type": "text", "gtype": "companyName" },
    { "name": "Website", "type": "link", "gtype": "website" },
    { "name": "Customer docs", "type": "documents", "gtype": "customerDocs" }
  ]
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Then add fields to the first table and link each deal to a company:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/databases/DB_ID/tables/DEALS_TABLE_ID/columns
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "columns": [
    { "name": "Deal name", "type": "text", "gtype": "dealName" },
    { "name": "Stage", "type": "status", "gtype": "stage" },
    {
      "name": "Company",
      "type": "reference",
      "gtype": "company",
      "options": {
        "type": "one_to_one",
        "table": "COMPANIES_TABLE_ID",
        "column_show": "companyName"
      }
    }
  ]
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml"><code>options.type</code> can be <code>one_to_one</code> or <code>one_to_many</code>. <code>options.table</code> points to the target table, and <code>options.column_show</code> points to the target column shown as the reference label. The target can be either the column id or its <code>gtype</code>.</p><p xmlns="http://www.w3.org/1999/xhtml"><code>document</code> receives one existing Aamu Doc id. <code>documents</code> receives an array of existing Doc ids. The API links those Doc cells back to the database row, so create or resolve the Docs first instead of sending placeholder ids.</p><p xmlns="http://www.w3.org/1999/xhtml">Reference columns currently target another table. Same-table references are rejected because the generated database GraphQL schema does not support circular references yet. <code>automatic_reference</code> is also not part of the public API yet.</p><h3 xmlns="http://www.w3.org/1999/xhtml">POST: inspect the generated GraphQL schema</h3><p xmlns="http://www.w3.org/1999/xhtml">The exact query and mutation names come from the generated schema. Use introspection after creating or changing schema, especially when an integration creates its own table <code>gtype</code> values.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/graphql/
x-api-key: YOUR_API_KEY
x-db-id: DB_ID
Content-Type: application/json

{
  "query": "{ __schema { mutationType { fields { name } } queryType { fields { name } } } }"
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: add row data with GraphQL</h3><p xmlns="http://www.w3.org/1999/xhtml">Create target rows first, then store the referenced row id in the reference field. A <code>one_to_one</code> reference receives one row id. A <code>one_to_many</code> reference receives an array of row ids.</p><p xmlns="http://www.w3.org/1999/xhtml">A GraphQL insert uses the same row-inserted automation path as Forms API and UI-created rows. If the table has a public <code>row_inserted</code> automation, its task or email actions run after the row is stored.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/graphql/
x-api-key: YOUR_API_KEY
x-db-id: DB_ID
Content-Type: application/json

{
  "query": "mutation CreateCompany($companyName: String, $website: String, $customerDocs: [String]) { Companies(companyName: $companyName, website: $website, customerDocs: $customerDocs) { id companyName website customerDocs } }",
  "variables": {
    "companyName": "Acme Ltd",
    "website": "https://example.com",
    "customerDocs": ["DOC_ID_1", "DOC_ID_2"]
  }
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Then create a deal and pass the company row id to the reference column:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/graphql/
x-api-key: YOUR_API_KEY
x-db-id: DB_ID
Content-Type: application/json

{
  "query": "mutation CreateDeal($dealName: String, $stage: String, $company: String) { Sheet1(dealName: $dealName, stage: $stage, company: $company) { id dealName stage company { id companyName website } } }",
  "variables": {
    "dealName": "Website redesign",
    "stage": "new",
    "company": "COMPANY_ROW_ID"
  }
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "data": {
    "Sheet1": {
      "id": "DEAL_ROW_ID",
      "dealName": "Website redesign",
      "stage": "new",
      "company": {
        "id": "COMPANY_ROW_ID",
        "companyName": "Acme Ltd",
        "website": "https://example.com",
        "customerDocs": ["DOC_ID_1", "DOC_ID_2"]
      }
    }
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">GET: read row data with GraphQL</h3><p xmlns="http://www.w3.org/1999/xhtml">GraphQL reads are sent as HTTP POST requests to <code>/api/v1/graphql/</code>. This is normal GraphQL behavior: the operation is a read, even though the HTTP method is POST.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/graphql/
x-api-key: YOUR_API_KEY
x-db-id: DB_ID
Content-Type: application/json

{
  "query": "query { Sheet1Rows { id dealName stage company { id companyName website } } }"
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: update row data with GraphQL</h3><p xmlns="http://www.w3.org/1999/xhtml">GraphQL updates are also sent to <code>/api/v1/graphql/</code> with HTTP POST. The mutation name depends on the generated schema, so use introspection to confirm the exact name and input type.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/graphql/
x-api-key: YOUR_API_KEY
x-db-id: DB_ID
Content-Type: application/json

{
  "query": "mutation UpdateDeal($id: ID!, $dealName: String, $stage: String, $company: String) { updateSheet1(id: $id, dealName: $dealName, stage: $stage, company: $company) { id dealName stage company { id companyName } } }",
  "variables": {
    "id": "DEAL_ROW_ID",
    "dealName": "Website redesign",
    "stage": "won",
    "company": "COMPANY_ROW_ID"
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">GET: read database activity</h3><p xmlns="http://www.w3.org/1999/xhtml">Database activity records describe cell-level row changes. They are useful for row detail timelines, audit views, CRM history, and integrations that need to react to field changes after data has been written through the UI or API.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/databases/DB_ID/activity?table_id=DEALS_TABLE_ID&amp;row_id=DEAL_ROW_ID&amp;limit=20
x-api-key: YOUR_API_KEY</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "activity": [
    {
      "id": "ACTIVITY_ID",
      "dbid": "DB_ID",
      "tableid": "DEALS_TABLE_ID",
      "rowid": "DEAL_ROW_ID",
      "dataid": "CELL_DATA_ID",
      "colid": "stage",
      "op": "update",
      "oldvalue": "new",
      "newvalue": "won",
      "userId": "USER_ID",
      "created": 1780000000000,
      "render": {
        "field": { "id": "stage", "name": "Stage", "type": "status" },
        "old_display": "New",
        "new_display": "Won",
        "summary": "Stage changed from New to Won"
      }
    }
  ]
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml"><code>op</code> is <code>insert</code>, <code>update</code> or <code>delete</code>. <code>oldvalue</code> and <code>newvalue</code> keep the stored value shape for the column: strings for text/status/reference values, arrays for list-like columns, and objects for structured columns such as timeline and file. The optional <code>render</code> object is a convenience summary for display.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Database Automations API</h2><p xmlns="http://www.w3.org/1999/xhtml">The Automations API manages workflow definitions attached to a database. It supports listing and creating automations under a database, then reading, updating, or deleting an individual automation by id.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET    /api/v1/databases/DB_ID/automations
POST   /api/v1/databases/DB_ID/automations
GET    /api/v1/automations/AUTOMATION_ID
PATCH  /api/v1/automations/AUTOMATION_ID
DELETE /api/v1/automations/AUTOMATION_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">These endpoints use <code>x-api-key</code>. They resolve the project from the database, so they do not need <code>x-project-id</code>. Use Automations read permission for list/get and Automations write permission for create/update/delete.</p><h3 xmlns="http://www.w3.org/1999/xhtml">POST: create an automation</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/databases/DB_ID/automations
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "name": "Create follow-up task",
  "status": "public",
  "trigger": {
    "type": "row_inserted",
    "tableId": "TABLE_ID"
  },
  "actions": [
    {
      "type": "create_task",
      "pid": "PROJECT_ID",
      "users": ["USER_ID"],
      "dbFieldTitle": "TITLE_COLUMN_ID",
      "dbFieldBody": "BODY_COLUMN_ID"
    }
  ]
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Supported trigger types are <code>row_inserted</code> and <code>row_updated</code>. A row-updated trigger also specifies <code>columnId</code> and the target <code>value</code>:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "name": "Start delivery when deal is won",
  "status": "public",
  "trigger": {
    "type": "row_updated",
    "tableId": "DEALS_TABLE_ID",
    "columnId": "STAGE_COLUMN_ID",
    "value": "won"
  },
  "actions": [
    {
      "type": "create_task",
      "pid": "DELIVERY_PROJECT_ID",
      "dbFieldTitle": "DEAL_NAME_COLUMN_ID"
    }
  ]
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">The update automation runs only when the selected field changes to the configured value. The supported actions are <code>create_task</code> and <code>send_email</code>. Action projects are validated separately, so the key needs Tasks write or Emails write scope for each target project.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET and PATCH an automation</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/automations/AUTOMATION_ID
x-api-key: YOUR_API_KEY

PATCH /api/v1/automations/AUTOMATION_ID
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "status": "draft",
  "name": "Paused follow-up task"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">A partial PATCH keeps fields that are not included. Switching the status to <code>draft</code> pauses execution without deleting the definition. <code>DELETE</code> removes the automation from API and UI listings.</p><h3 xmlns="http://www.w3.org/1999/xhtml">Forms, GraphQL, automations, and Tasks together</h3><p xmlns="http://www.w3.org/1999/xhtml">These APIs can form one end-to-end workflow:</p><ol xmlns="http://www.w3.org/1999/xhtml"><li><p>Create a database and columns with the Database REST API.</p></li><li><p>Create a public automation with Automations write scope.</p></li><li><p>Submit a form through <code>/api/v1/forms/{id}/submissions</code> or insert a row through GraphQL.</p></li><li><p>The row is stored in the database and the matching automation runs.</p></li><li><p>A task is created in its configured project or an email action runs.</p></li></ol><p xmlns="http://www.w3.org/1999/xhtml">This lets an integration keep structured input in a database while turning relevant events into visible work for the team. See <a target="_blank" rel="noopener noreferrer nofollow" href="https://aamu.app/blog/posts/database-automations-with-aamuapp/">Database automations with Aamu.app</a> for the product-side walkthrough.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Using Databases and Docs together</h2><p xmlns="http://www.w3.org/1999/xhtml">Docs and Databases work well together. A database can hold structured state, while Docs can hold rich long-form context. The bridge between the two is the <code>document</code> column type: its value is the id of a Docs document.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: fetch a linked Doc after querying a row</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/docs/DOC_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "doc": {
    "id": "DOC_ID",
    "title": "Interview notes: Ada Lovelace",
    "html": "&lt;h1&gt;Interview notes&lt;/h1&gt;&lt;p&gt;Ada liked the onboarding flow.&lt;/p&gt;"
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: create a Doc and store its id in a row</h3><p xmlns="http://www.w3.org/1999/xhtml">First create the document:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/docs/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "title": "Interview notes: Ada Lovelace",
  "html": "&lt;h1&gt;Interview notes&lt;/h1&gt;&lt;p&gt;Ada liked the onboarding flow and asked for more examples.&lt;/p&gt;"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "doc": {
    "id": "DOC_ID",
    "title": "Interview notes: Ada Lovelace"
  }
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Then use that <code>DOC_ID</code> in a database row whose column type is <code>document</code>:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/graphql/
x-api-key: YOUR_API_KEY
x-db-id: DB_ID
Content-Type: application/json

{
  "query": "mutation CreateFeedback($input: FeedbackInput!) { createFeedback(input: $input) { id customer sourceDocument } }",
  "variables": {
    "input": {
      "customer": "Ada Lovelace",
      "sourceDocument": "DOC_ID"
    }
  }
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "data": {
    "createFeedback": {
      "id": "ROW_ID",
      "customer": "Ada Lovelace",
      "sourceDocument": "DOC_ID"
    }
  }
}</code></pre><h2 xmlns="http://www.w3.org/1999/xhtml">Legacy direct table submit</h2><p xmlns="http://www.w3.org/1999/xhtml">Older generated database form snippets can submit directly to a table endpoint. This creates database rows, but it is best treated as a legacy/browser form integration.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: no row listing endpoint here</h3><p xmlns="http://www.w3.org/1999/xhtml">There is no recommended <code>GET</code> endpoint for this legacy table-submit surface. To read rows, use GraphQL instead.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/graphql/
x-api-key: YOUR_API_KEY
x-db-id: DB_ID
Content-Type: application/json

{
  "query": "query { feedbackRows { id customer message } }"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "data": {
    "feedbackRows": [
      { "id": "ROW_ID", "customer": "Ada Lovelace", "message": "The onboarding flow was clear." }
    ]
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: legacy table submit</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/db/TABLE_ID
Content-Type: application/x-www-form-urlencoded

customer=Ada%20Lovelace&amp;message=The%20onboarding%20flow%20was%20clear.</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "success": true,
  "id": "ROW_ID"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">New authenticated integrations should prefer <code>/api/v1/forms/{id}/submissions</code> for form submissions and <code>/api/v1/graphql/</code> for database row operations.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Update support summary</h2><p xmlns="http://www.w3.org/1999/xhtml">Update support is intentionally feature-specific. Tasks, Docs, and Meetings expose REST <code>PATCH</code> endpoints. Database rows are updated through GraphQL mutations. Forms submissions and public form posts create rows; they are not update endpoints. Files are currently uploaded and fetched through the Files API, while replacing or deleting files should be modeled explicitly by the feature that references them.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Why this works well for AI agents</h2><p xmlns="http://www.w3.org/1999/xhtml">The Aamu API is intentionally close to the product model. An AI agent can create a task, attach files, write a doc, schedule a meeting, submit a form response, manage a database automation, or work with structured database rows without inventing a parallel workflow.</p><p xmlns="http://www.w3.org/1999/xhtml">The OpenAPI document gives the agent a map of the available operations, while scoped Team API keys keep access narrow. That combination makes the API useful for automation without making it too broad by default.</p><h2 xmlns="http://www.w3.org/1999/xhtml">A practical starting point</h2><p xmlns="http://www.w3.org/1999/xhtml">For most integrations, the best first step is to generate a Team API key with the smallest useful set of project and feature scopes. Then call the OpenAPI document, inspect the schemas, and start with one workflow: create a task, write a doc, or upload a file and reference it from editor HTML.</p><p xmlns="http://www.w3.org/1999/xhtml">From there, the same API surface can grow into richer workflows that use tasks for action, docs for knowledge, forms for input, files for context, meetings for coordination, GraphQL databases for structured state, and automations for the handoff between data and action.</p><h2 xmlns="http://www.w3.org/1999/xhtml">How the API operation surface guides Aamu's internal AI</h2><p xmlns="http://www.w3.org/1999/xhtml">The public API remains the integration surface for external systems, API keys, and project-scoped automation. Aamu's internal AI can now work with the same described operation set when a user asks it to act inside the workspace.</p><p xmlns="http://www.w3.org/1999/xhtml">The OpenAPI operation names and request schemas help the AI select an operation and prepare its path, query, and body arguments. The internal action does not need an API key and does not have to call Aamu over HTTP: it reuses the existing server-side handlers and product functions with the signed-in user's session and accessible projects.</p><p xmlns="http://www.w3.org/1999/xhtml">This keeps the public API and internal AI capabilities aligned across areas such as Forms, databases, GraphQL rows, database automations, files, users, Helpdesk, Email, Docs, Tasks, and Meetings. External integrations still use API key scopes; internal AI follows the current user's workspace permissions. Higher-risk actions retain explicit confirmation boundaries.</p>