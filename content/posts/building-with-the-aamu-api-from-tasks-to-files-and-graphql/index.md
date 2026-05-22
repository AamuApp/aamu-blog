---
author: "Ilkka Huotari"
title: "Building with the Aamu API: From Tasks to Files and GraphQL"
date: "2026-05-22T07:00:00.000Z"
modified: "2026-05-22T08:35:32.029Z"
description: ""
cover:
  image: 8572722314106475_ChatGPT Image May 22, 2026, 10_29_15 AM.png
  relative: true
tags: ["api", "ai", "graphql"]
ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<h1>Building with the Aamu API: From Tasks to Files and GraphQL</h1>
<p>Aamu now exposes a broad project API for teams and AI agents that need to create, read, and update real work inside Aamu. The API is designed around the same building blocks people use in the UI: tasks, docs, meetings, forms, files, databases, and database rows through GraphQL.</p>
<p>The API is described by an OpenAPI document at <code>/.well-known/openapi.json</code>. That makes it easy for humans to inspect the available endpoints, and easy for AI tools to discover how to call them.</p>

<h2>Authentication and project scope</h2>
<p>Every request uses a Team API key in the <code>x-api-key</code> header. Most resources are project-scoped, so requests commonly include <code>x-project-id</code> as well. When an API key only has one project scope, the project can often be inferred, but including the header keeps integrations explicit and predictable.</p>
<pre><code>GET /api/v1/tasks/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre>
<p>API keys can be limited by feature and permission. For example, a key can be allowed to read docs, create tasks, submit forms, or upload files only inside selected projects.</p>

<h2>Tasks and comments</h2>
<p>The Tasks API is useful for turning external events, AI plans, or support workflows into actionable project work. You can list tasks, create tasks, update task content, and add comments.</p>
<pre><code>POST /api/v1/tasks/
Content-Type: application/json

{
  "title": "Review API integration",
  "html": "&lt;p&gt;Check the integration logs and update the rollout note.&lt;/p&gt;"
}</code></pre>
<p>Task comments use the same HTML-oriented content model:</p>
<pre><code>POST /api/v1/tasks/{id}/comments

{
  "html": "&lt;p&gt;The first test upload completed successfully.&lt;/p&gt;"
}</code></pre>

<h2>Docs as API-created knowledge</h2>
<p>The Docs API lets integrations create durable written material directly into Aamu. This is a natural fit for AI-generated summaries, runbooks, meeting notes, release notes, customer handoff documents, and internal knowledge articles.</p>
<pre><code>POST /api/v1/docs/

{
  "title": "Weekly API Report",
  "html": "&lt;h1&gt;Weekly API Report&lt;/h1&gt;&lt;p&gt;All checks passed.&lt;/p&gt;"
}</code></pre>
<p>Docs can also be fetched and updated later. The API accepts HTML, which maps cleanly to Aamu’s editor content.</p>

<h2>Meetings</h2>
<p>The Meetings API can create and update project meetings. It supports common fields such as name, HTML description, start time, end time, and invitee emails. That makes it possible for an agent to schedule a follow-up discussion after preparing the context in tasks or docs.</p>
<pre><code>POST /api/v1/meetings/

{
  "name": "API rollout review",
  "html": "&lt;p&gt;Review integration status and next steps.&lt;/p&gt;",
  "start_time": 1779458400000,
  "end_time": 1779462000000
}</code></pre>

<h2>Forms and submissions</h2>
<p>The Forms API separates public browser form submissions from authenticated API use. Integrations can list forms, read a form’s database-backed fields, and submit a new response.</p>
<pre><code>GET /api/v1/forms/{id}</code></pre>
<p>A form submission creates a database row through the form’s table mapping:</p>
<pre><code>POST /api/v1/forms/{id}/submissions

{
  "fields": {
    "email": "person@example.com",
    "message": "I would like to hear more."
  }
}</code></pre>
<p>Field values can be sent using the field’s GraphQL name, database column id, or display name when available.</p>

<h2>Files for editor content</h2>
<p>Aamu’s UI editor uses relative file URLs such as <code>/file/browser/{filepointer_id}/{file_version_id}/{name}</code>. The Files API follows the same pattern, which keeps API-created content compatible with the editor.</p>
<p>The upload flow has three steps:</p>
<ol>
  <li>Call <code>POST /api/v1/files/prepare-upload</code> with the file name, MIME type, and size.</li>
  <li>Upload the bytes to the returned signed <code>PUT</code> URL.</li>
  <li>Call <code>POST /api/v1/files/complete-upload</code> with the returned completion payload.</li>
</ol>
<p>The completed response includes both <code>browser_url</code> and <code>download_url</code>. The browser URL can be inserted into document or task HTML:</p>
<pre><code>&lt;img src="/file/browser/FILEPOINTER_ID/FILE_VERSION_ID/image.png"&gt;</code></pre>
<p>Tasks, docs, and comments can also include a <code>files</code> array so the uploaded files are tracked as attachments alongside the HTML content.</p>

<h2>Databases and GraphQL</h2>
<p>The REST Database API creates databases and table schema. Row data is then handled through the GraphQL endpoint. This gives AI tools a discoverable schema for each database while keeping structured data access flexible.</p>
<pre><code>POST /api/v1/databases/

{
  "name": "Customer feedback"
}</code></pre>
<p>Columns can be added through REST:</p>
<pre><code>POST /api/v1/databases/{dbId}/tables/{tableId}/columns

{
  "columns": [
    { "name": "Customer", "type": "text" },
    { "name": "Status", "type": "status" }
  ]
}</code></pre>
<p>After that, clients can query and mutate rows through <code>/api/v1/graphql/</code>, using <code>x-db-id</code> to select the database.</p>

<h2>Why this works well for AI agents</h2>
<p>The Aamu API is intentionally close to the product model. An AI agent can create a task, attach files, write a doc, schedule a meeting, submit a form response, or work with structured database rows without inventing a parallel workflow.</p>
<p>The OpenAPI document gives the agent a map of the available operations, while scoped Team API keys keep access narrow. That combination makes the API useful for automation without making it too broad by default.</p>

<h2>A practical starting point</h2>
<p>For most integrations, the best first step is to generate a Team API key with the smallest useful set of project and feature scopes. Then call the OpenAPI document, inspect the schemas, and start with one workflow: create a task, write a doc, or upload a file and reference it from editor HTML.</p>
<p>From there, the same API surface can grow into richer workflows that use tasks for action, docs for knowledge, forms for input, files for context, meetings for coordination, and GraphQL databases for structured state.</p>