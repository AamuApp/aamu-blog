---
author: "Ilkka Huotari"
title: "Building with the Aamu API: From Tasks to Docs and GraphQL"
date: "2026-05-22T07:10:00.000Z"
modified: "2026-05-24T05:07:55.526Z"
description: ""
cover:
  image: 497a93a5ef0d67b4_ChatGPT Image May 22, 2026, 10_29_15 AM.png
  relative: true
tags: ["api", "ai", "graphql"]
ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p xmlns="http://www.w3.org/1999/xhtml">Aamu exposes a project API for teams and AI agents that need to create, read, and update real work inside Aamu. The API follows the same building blocks people use in the UI: tasks, docs, meetings, forms, files, databases, and database rows through GraphQL.</p><p xmlns="http://www.w3.org/1999/xhtml">The API is described by an OpenAPI document at <code>/.well-known/openapi.json</code>. That document is useful both for humans and for AI tools that need to discover available operations.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Authentication and project scope</h2><p xmlns="http://www.w3.org/1999/xhtml">Every API request uses a Team API key in the <code>x-api-key</code> header. Project-scoped resources also use <code>x-project-id</code>. When an API key has access to multiple projects, the project header disambiguates which project the request should use.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p xmlns="http://www.w3.org/1999/xhtml">API keys can be scoped by feature and permission. For example, one key can have read-only Docs access, while another can create tasks, upload files, and submit forms in selected projects.</p><h2 xmlns="http://www.w3.org/1999/xhtml">API actor</h2><p xmlns="http://www.w3.org/1999/xhtml">Write operations can set the acting user with <code>x-aamu-actor</code>. The value can be a username, such as <code>ai</code> or <code>badding</code>, or a user id. The actor must be a member of the scoped project.</p><p xmlns="http://www.w3.org/1999/xhtml">When the header is omitted, Aamu uses the project <code>ai</code> user when available, otherwise the project owner. The same fallback applies across project item writes: tasks, docs, meetings, form submissions, file upload registration, and database creation/schema operations.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">x-aamu-actor: ai</code></pre><h2 xmlns="http://www.w3.org/1999/xhtml">Team Brain</h2><p xmlns="http://www.w3.org/1999/xhtml">Team Brain is the shared knowledge layer behind Aamu AI. It can be queried directly through the API when an integration needs grounded context before it writes a task, drafts a support reply, creates a doc, or decides what to do next.</p><p xmlns="http://www.w3.org/1999/xhtml">The retrieve endpoint returns matching curated Team Brain entries and source chunks. It does not generate a final answer by itself; callers can use the results as context for their own model, or let Aamu use the same knowledge through a workflow such as Helpdesk reply-draft generation.</p><h3 xmlns="http://www.w3.org/1999/xhtml">POST: retrieve knowledge</h3><p xmlns="http://www.w3.org/1999/xhtml"><code>limit</code> controls the maximum number of matching results returned. Results are ranked by relevance score, so a smaller limit is useful when an AI prompt needs only the strongest few pieces of context, while a larger limit gives the caller more material to inspect or rerank.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/team-brain/retrieve
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
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Use Team Brain read scope for the project. When Helpdesk draft generation is configured to use Team Brain, the same Team Brain read scope is required in addition to Helpdesk write scope.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Helpdesk</h2><p xmlns="http://www.w3.org/1999/xhtml">The Helpdesk API is designed for human-in-the-loop support automation. Integrations can read new tickets and prepare reply drafts, but reply-draft endpoints do not send messages to customers.</p><p xmlns="http://www.w3.org/1999/xhtml">Reply drafts are stored in the same user-specific comment draft location the UI uses, and the ticket is marked with <code>hasDraft</code>. In practice this means the draft appears in the Helpdesk reply editor for the API actor, ready for a human to review and send.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: list tickets</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/helpdesk/tickets/?status=open&amp;unanswered=true
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">PUT: write a reply draft</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">PUT /api/v1/helpdesk/tickets/TICKET_ID/reply-draft
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
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">The generated draft is saved as the API actor’s Helpdesk comment draft. Sending the actual reply remains a separate human action.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Tasks</h2><p xmlns="http://www.w3.org/1999/xhtml">The Tasks API is useful for turning external events, AI plans, and support workflows into actionable work. Task create and update operations use the same internal task helpers as the UI for fields that have side effects, such as status, assigned users, dates, repetition, and reminders.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: list tasks</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/tasks/
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
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">The <code>browser_url</code> can be embedded in Docs or Tasks HTML. The old item-level <code>files</code> field is deprecated and is not returned by the current API.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Databases and GraphQL</h2><p xmlns="http://www.w3.org/1999/xhtml">The REST Database API creates databases and changes table schema. Row data is handled through the generated GraphQL API. In other words, schema setup uses REST, while row reads and writes use GraphQL.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: read row data with GraphQL</h3><p xmlns="http://www.w3.org/1999/xhtml">GraphQL reads are sent as HTTP POST requests to <code>/api/v1/graphql/</code>. This is normal GraphQL behavior: the operation is a read, even though the HTTP method is POST.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/graphql/
x-api-key: YOUR_API_KEY
x-db-id: DB_ID
Content-Type: application/json

{
  "query": "query { feedbackRows { id customer message status sourceDocument } }"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "data": {
    "feedbackRows": [
      {
        "id": "ROW_ID",
        "customer": "Ada Lovelace",
        "message": "The onboarding flow was clear.",
        "status": "new",
        "sourceDocument": "DOC_ID"
      }
    ]
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: create a database</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/databases/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "Customer feedback"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "database": {
    "id": "DB_ID",
    "pid": "YOUR_PROJECT_ID",
    "name": "Customer feedback",
    "tables": ["TABLE_ID"],
    "table_id": "TABLE_ID"
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: add columns</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/databases/DB_ID/tables/TABLE_ID/columns
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "columns": [
    { "name": "Customer", "type": "text", "gtype": "customer" },
    { "name": "Message", "type": "longtext", "gtype": "message" },
    { "name": "Status", "type": "status", "gtype": "status" },
    { "name": "Source document", "type": "document", "gtype": "sourceDocument" }
  ]
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "columns": [
    { "id": "COLUMN_ID", "name": "Customer", "type": "text", "gtype": "customer" },
    { "id": "COLUMN_ID_2", "name": "Message", "type": "longtext", "gtype": "message" },
    { "id": "COLUMN_ID_3", "name": "Status", "type": "status", "gtype": "status" },
    { "id": "COLUMN_ID_4", "name": "Source document", "type": "document", "gtype": "sourceDocument" }
  ]
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: add row data with GraphQL</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/graphql/
x-api-key: YOUR_API_KEY
x-db-id: DB_ID
Content-Type: application/json

{
  "query": "mutation CreateFeedback($input: FeedbackInput!) { createFeedback(input: $input) { id customer message status sourceDocument } }",
  "variables": {
    "input": {
      "customer": "Ada Lovelace",
      "message": "The onboarding flow was clear.",
      "status": "new",
      "sourceDocument": "DOC_ID"
    }
  }
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "data": {
    "createFeedback": {
      "id": "ROW_ID",
      "customer": "Ada Lovelace",
      "message": "The onboarding flow was clear.",
      "status": "new",
      "sourceDocument": "DOC_ID"
    }
  }
}</code></pre><h3 xmlns="http://www.w3.org/1999/xhtml">POST: update row data with GraphQL</h3><p xmlns="http://www.w3.org/1999/xhtml">GraphQL updates are also sent to <code>/api/v1/graphql/</code> with HTTP POST. The mutation name depends on the generated schema, so use introspection to confirm the exact name and input type.</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/graphql/
x-api-key: YOUR_API_KEY
x-db-id: DB_ID
Content-Type: application/json

{
  "query": "mutation UpdateFeedback($id: ID!, $input: FeedbackInput!) { updateFeedback(id: $id, input: $input) { id customer message status sourceDocument } }",
  "variables": {
    "id": "ROW_ID",
    "input": {
      "customer": "Ada Lovelace",
      "message": "The onboarding flow was clear, and examples would help advanced users.",
      "status": "reviewed",
      "sourceDocument": "DOC_ID"
    }
  }
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Example response:</p><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">{
  "data": {
    "updateFeedback": {
      "id": "ROW_ID",
      "customer": "Ada Lovelace",
      "message": "The onboarding flow was clear, and examples would help advanced users.",
      "status": "reviewed",
      "sourceDocument": "DOC_ID"
    }
  }
}</code></pre><h2 xmlns="http://www.w3.org/1999/xhtml">Using Databases and Docs together</h2><p xmlns="http://www.w3.org/1999/xhtml">Docs and Databases work well together. A database can hold structured state, while Docs can hold rich long-form context. The bridge between the two is the <code>document</code> column type: its value is the id of a Docs document.</p><h3 xmlns="http://www.w3.org/1999/xhtml">GET: fetch a linked Doc after querying a row</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET /api/v1/docs/DOC_ID
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
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">New authenticated integrations should prefer <code>/api/v1/forms/{id}/submissions</code> for form submissions and <code>/api/v1/graphql/</code> for database row operations.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Update support summary</h2><p xmlns="http://www.w3.org/1999/xhtml">Update support is intentionally feature-specific. Tasks, Docs, and Meetings expose REST <code>PATCH</code> endpoints. Database rows are updated through GraphQL mutations. Forms submissions and public form posts create rows; they are not update endpoints. Files are currently uploaded and fetched through the Files API, while replacing or deleting files should be modeled explicitly by the feature that references them.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Why this works well for AI agents</h2><p xmlns="http://www.w3.org/1999/xhtml">The Aamu API is intentionally close to the product model. An AI agent can create a task, attach files, write a doc, schedule a meeting, submit a form response, or work with structured database rows without inventing a parallel workflow.</p><p xmlns="http://www.w3.org/1999/xhtml">The OpenAPI document gives the agent a map of the available operations, while scoped Team API keys keep access narrow. That combination makes the API useful for automation without making it too broad by default.</p><h2 xmlns="http://www.w3.org/1999/xhtml">A practical starting point</h2><p xmlns="http://www.w3.org/1999/xhtml">For most integrations, the best first step is to generate a Team API key with the smallest useful set of project and feature scopes. Then call the OpenAPI document, inspect the schemas, and start with one workflow: create a task, write a doc, or upload a file and reference it from editor HTML.</p><p xmlns="http://www.w3.org/1999/xhtml">From there, the same API surface can grow into richer workflows that use tasks for action, docs for knowledge, forms for input, files for context, meetings for coordination, and GraphQL databases for structured state.</p>