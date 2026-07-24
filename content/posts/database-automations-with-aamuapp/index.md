---
author: "Ilkka Huotari"
title: "Database automations with Aamu.app"
date: "2025-06-02T14:00:00.000Z"
modified: "2026-07-24T23:08:46.654Z"
description: "How Aamu.app database automations and the Automations API turn inserted or updated rows into emails and follow-up tasks."
cover:
  image: 53a4abe3b615fc4f_automations.png
  relative: true

tags: ["database", "automations", "forms", "api"]
directAnswer: "How Aamu.app database automations and the Automations API turn inserted or updated rows into emails and follow-up tasks."
contentType: "how-to"
audience: "developers and technical teams"
faq: [{"question":"What is Database automations with Aamu.app?","answer":"How Aamu.app database automations and the Automations API turn inserted or updated rows into emails and follow-up tasks."},{"question":"Who is Database automations with Aamu.app for?","answer":"This guide is intended for developers and technical teams."},{"question":"What does this guide explain?","answer":"It explains the main concepts, setup, and practical workflow for database automations with aamu.app."}]


ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p><strong>Short answer:</strong> How Aamu.app database automations and the Automations API turn inserted or updated rows into emails and follow-up tasks.</p>
<p>Aamu.app database automations let a database row start follow-up work automatically. They are especially useful with forms: a public form collects the data, the response becomes a database row, and an automation can send an email or create a task when that row is inserted or later reaches a selected value.</p><p>This article uses the contact form idea as an example, but the same pattern works for survey responses, onboarding requests, bug reports, event registrations, lead forms, and internal request queues.</p><h2>The current automation model</h2><p>A database automation belongs to one Aamu database. Inside the automation you choose:</p><ul><li><p>the automation name,</p></li><li><p>the triggering type,</p></li><li><p>the triggering table,</p></li><li><p>one or more actions, and</p></li><li><p>whether the automation is draft or public.</p></li></ul><p>The current database triggers are:</p><ul><li><p><strong>Row inserted</strong> — runs when a new row is added to the selected table.</p></li><li><p><strong>Row updated</strong> — runs when a selected field changes to a configured value.</p></li></ul><p>A row can be inserted through a published Aamu form, the Forms API, a GraphQL database mutation, or a manual database entry. Row-updated automations are useful for stage transitions such as a deal changing to <code>won</code>, a request changing to <code>approved</code>, or a support item changing to <code>ready</code>.</p><p>The current actions are:</p><ul><li><p><strong>Send an email</strong></p></li><li><p><strong>Create a task</strong></p></li></ul><p>You can add more than one action to the same automation. Actions can be inserted before, between, or after existing actions, and removed when they are no longer needed. For example, one new contact-form submission can send a confirmation email and create a follow-up task for the sales team.</p><h2>Open automations from the database</h2><p>Open the database that contains the table you want to automate. From the database menu, open <strong>Automations</strong>, then create a new automation.</p><p>If you are coming from a form, remember that form responses are stored in a database table. The form's Responses view links back to that database. That is usually the easiest place to find the right database and table.</p><h2>Choose the trigger table</h2><p>Give the automation a descriptive name, such as:</p><pre><code class="language-plaintext">Notify us about new contact form submissions
Create follow-up task from onboarding requests
Send survey thank-you email</code></pre><p>Choose <strong>Row inserted</strong> when every new row should start the workflow. Choose <strong>Row updated</strong> when the workflow should wait for a specific field to change to a selected value. Then choose the table and, for an update trigger, the field and target value.</p><p>After you select the table, Aamu shows the available template bindings. These are placeholders based on the database fields. A field might be shown as something like:</p><pre><code class="language-plaintext">{{email}}
{{name}}
{{message}}</code></pre><p>You can use these bindings in email templates and, depending on the action, map database fields into task data.</p><h2>Action: send an email</h2><p>The email action sends through an Aamu email account configured for a project. That means email needs to be set up before this action can run.</p><p>When configuring the action, choose the email address to use for sending. Then create a new email template or select a previously created template. Existing templates can also be edited from the automation. The template can use database bindings in the recipient, subject, and body.</p><p>For a contact form, the template might use:</p><pre><code class="language-plaintext">To: support@example.com
Subject: New contact form message from {{name}}

Message:
{{message}}

Reply to:
{{email}}</code></pre><p>If a field may be empty, templates can use a default value form for bindings:</p><pre><code class="language-plaintext">{{company|No company provided}}</code></pre><p>Use the email action for notifications, confirmations, and lightweight handoffs. For real work that needs ownership and status, create a task too.</p><h2>Action: create a task</h2><p>The task action creates an Aamu task when the automation trigger matches. Choose the project where the task should be created, then choose the user who should be assigned.</p><p>You can map database fields into the task:</p><ul><li><p>a database field for the task title,</p></li><li><p>a database field for the task body, and</p></li><li><p>database fields for custom task fields when the target project has them.</p></li></ul><p>This is useful when a submitted form needs a real workflow. For example:</p><ul><li><p>a demo request creates a sales task,</p></li><li><p>a bug report creates a triage task,</p></li><li><p>a job application creates a recruiting task, or</p></li><li><p>an onboarding request creates an implementation task.</p></li></ul><p>The database row remains the source data. The task is the follow-up work.</p><h2>Draft vs public</h2><p>New automations start as draft. A draft automation does not run. This is deliberate: you can configure the trigger, actions, templates, and mappings without affecting live data.</p><p>Set the automation to <strong>Public</strong> when it is ready. Only public automations run when matching rows are inserted or updated.</p><p>If you need to pause the workflow, switch the automation back to draft. This is a simple way to turn the automation off without deleting its configuration.</p><p>The user who creates the automation owns its configuration. Other users can view the automation, but editing controls are available to the owner.</p><h2>Test the automation</h2><p>When an automation is public and has actions, Aamu shows a test action control. Use it before relying on the workflow.</p><p>For a form-based workflow, also test the real path:</p><ol><li><p>Open the public form.</p></li><li><p>Submit a realistic test response.</p></li><li><p>Confirm that a new row appears in the database table.</p></li><li><p>Confirm that the email was sent, if the automation sends email.</p></li><li><p>Confirm that the task was created in the correct project, if the automation creates a task.</p></li><li><p>Check that the field bindings produced readable text.</p></li></ol><p>Testing with a real submission catches the full chain: public form, database row creation, automation trigger, email configuration, and task mapping.</p><h2>Troubleshooting checklist</h2><p>If the automation does not run, check these:</p><ul><li><p>The automation status is Public, not Draft.</p></li><li><p>The trigger table is the same table receiving the new row.</p></li><li><p>The operation matches the trigger: a new row for Row inserted, or a real field transition to the configured value for Row updated.</p></li><li><p>The action has all required settings.</p></li><li><p>The sending email account is configured for the selected project.</p></li><li><p>The email domain is attached to the project if email sending depends on it.</p></li><li><p>The task action points to the right project.</p></li><li><p>The selected assignee still has access to that project.</p></li><li><p>The template bindings match the fields in the triggering table.</p></li></ul><h2>Manage automations through the API</h2><p>Automations can also be listed, created, read, updated, and deleted through the Aamu API. This is useful when an integration provisions a complete workflow: create a database, add its columns, add an automation, and then write rows through GraphQL or the Forms API.</p><p>Automation management uses a separate project-level <strong>Automations</strong> scope. It does not come implicitly with Database access. Use read permission for listing and fetching automations, and write permission for creating, changing, or deleting them.</p><pre><code class="language-plaintext">GET    /api/v1/databases/DB_ID/automations
POST   /api/v1/databases/DB_ID/automations
GET    /api/v1/automations/AUTOMATION_ID
PATCH  /api/v1/automations/AUTOMATION_ID
DELETE /api/v1/automations/AUTOMATION_ID</code></pre><p>All requests send the Team API key in <code>x-api-key</code>. The database identifies its project, so these routes do not require <code>x-project-id</code>.</p><h3>Create a row-inserted task automation</h3><pre><code class="language-plaintext">POST /api/v1/databases/DB_ID/automations
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "name": "Create onboarding task",
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
      "dbFieldBody": "DETAILS_COLUMN_ID"
    }
  ]
}</code></pre><p>The key needs Automations write scope for the database project and Tasks write scope for the target task project. A <code>send_email</code> action similarly requires Emails write scope for its target project.</p><h3>Create a row-updated automation</h3><pre><code class="language-plaintext">POST /api/v1/databases/DB_ID/automations
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "name": "Create handoff task when deal is won",
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
}</code></pre><p>The update trigger runs only when the selected field actually changes and its new value equals the configured value. Rewriting the same value does not run the automation again.</p><h3>A complete API workflow</h3><ol><li><p>Create a database and columns with the Database REST API.</p></li><li><p>Create a public automation with the Automations API.</p></li><li><p>Insert a row through GraphQL or submit an Aamu form through the Forms API.</p></li><li><p>Aamu stores the row and runs the matching automation.</p></li><li><p>The action creates the task or sends the email through the same internal workflow used by Aamu.</p></li></ol><p>For the broader authentication, database, Forms, GraphQL, and Tasks examples, see <a target="_blank" rel="noopener noreferrer nofollow" href="https://aamu.app/blog/posts/building-with-the-aamu-api-from-tasks-to-docs-and-graphql/">Building with the Aamu API</a>.</p><h2>Database automations and outbound webhooks</h2><p>Database automations are designed for internal follow-up after a row is inserted: send an email, create a task, or do both. If another system needs to react to Aamu events, use <a target="_blank" rel="noopener noreferrer nofollow" href="https://aamu.app/blog/posts/outbound-webhooks-in-aamuapp-real-time-events-tasks-helpdesk-email/">outbound webhooks</a>. Webhooks cover a broader range of workspace events and send signed event data to an external HTTPS endpoint.</p><p>A simple rule of thumb is: use a database automation when the next action should happen inside Aamu, and use an outbound webhook when the next action belongs in another system.</p><h2>A practical pattern</h2><p>A good Aamu automation usually has this shape:</p><ol><li><p>A form or API call creates a database row.</p></li><li><p>The database row stores the structured data.</p></li><li><p>A database automation sends a notification or creates a task.</p></li><li><p>The team handles the actual work in Tasks, Emails, Helpdesk, or the database.</p></li></ol><p>That is the strength of keeping forms, databases, email, and tasks in the same workspace. The submitted data does not disappear into a notification. It stays available as a row, and the automation turns it into the next action.</p><h2>Frequently asked questions</h2><h3>What is Database automations with Aamu.app?</h3><p>How Aamu.app database automations and the Automations API turn inserted or updated rows into emails and follow-up tasks.</p><h3>Who is Database automations with Aamu.app for?</h3><p>This guide is intended for developers and technical teams.</p><h3>What does this guide explain?</h3><p>It explains the main concepts, setup, and practical workflow for database automations with aamu.app.</p><h2>Related articles</h2><ul><li><a href="/blog/posts/from-form-submission-to-follow-up-workflows-with-aamuapp/">From form submission to follow-up: workflows with Aamu.app</a></li><li><a href="/blog/posts/aamuapp-databases-practical-feature-guide/">Aamu.app Databases: a practical feature guide</a></li><li><a href="/blog/posts/how-to-use-aamuapp-as-a-small-team-crm/">How to use Aamu.app as a small-team CRM</a></li><li><a href="/blog/posts/building-with-the-aamu-api-from-tasks-to-docs-and-graphql/">Building with the Aamu API: From Tasks to Docs and GraphQL</a></li><li><a href="/blog/posts/ai-commands-in-aamuapp-turning-comments-into-workspace-actions/">AI commands in Aamu.app: turning comments into workspace actions</a></li></ul>