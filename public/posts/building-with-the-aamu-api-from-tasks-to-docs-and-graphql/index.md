# Building with the Aamu API: From Tasks to Docs and GraphQLA practical guide to the Aamu API for newsletters, tasks, docs, meetings, files, forms, database automations, GraphQL rows, and activity timelines.Published: 2026-05-22


<p><strong>Short answer:</strong> A practical guide to the Aamu API for newsletters, tasks, docs, meetings, files, forms, database automations, GraphQL rows, and activity timelines.</p>
<p>The Aamu API lets integrations work with project Tasks, Docs, meetings, Forms, Newsletters, Git, files, Helpdesk, Email and Databases. Database rows are available through GraphQL and REST; webhooks notify external systems of changes.</p><p>The API is described by an OpenAPI document at <code>/.well-known/openapi.json</code>. That document is useful both for humans and for AI tools that need to discover available operations.</p><h2>Authentication and project scope</h2><p>Every API request uses a Team API key in the <code>x-api-key</code> header. Project-scoped resources also use <code>x-project-id</code>. When an API key has access to multiple projects, the project header disambiguates which project the request should use.</p><pre><code class="language-plaintext">x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>API keys can be scoped by feature and permission. For example, one key can have read-only Docs access, while another can create tasks, upload files, submit forms, manage Git repositories and SSH keys, manage newsletters, and manage database automations in selected projects.</p><p>Database schema and row access use the <strong>Database</strong> scope. Automation definitions use a separate <strong>Automations</strong> scope, because permission to work with database data should not automatically grant permission to create workflows with side effects. Automation actions also require the scope of their destination: <strong>Tasks write</strong> for <code>create_task</code> and <strong>Emails write</strong> for <code>send_email</code>.</p><p>Team admins create keys from Team settings under <strong>API keys</strong>. The generated secret is shown only once, so copy it immediately. The stored key list later shows safe metadata such as name, creation time, last-used time, scopes, permissions, endpoints and required headers, but it never shows the secret again.</p><p>The API documentation links are also available from the same settings page: <code>/.well-known/openapi.json</code>, the alternative <code>/api/openapi.json</code>, and the AI plugin manifest at <code>/.well-known/ai-plugin.json</code>.</p><h2>API actor</h2><p>Write operations can set the acting user with <code>x-aamu-actor</code>. The value can be a username, such as <code>ai</code> or <code>badding</code>, or a user id. The actor must be a member of the scoped project.</p><p>When the header is omitted, Aamu uses the project <code>ai</code> user when available, otherwise the project owner. The same fallback applies across project item writes: tasks, docs, meetings, newsletters, form submissions, file upload registration, and database creation/schema operations.</p><pre><code class="language-plaintext">x-aamu-actor: ai</code></pre><h2>API key introspection</h2><p>Integrations can inspect the API key they are currently using with <code>GET /api/v1/key</code>. This is useful for setup checks, debugging missing permissions, and choosing the right project header when a key has multiple scopes.</p><p>The endpoint returns safe metadata only. It never returns the API key value, salt, hash, or any other secret used to validate the key.</p><h3>GET: inspect current API key</h3><pre><code class="language-plaintext">GET /api/v1/key
x-api-key: YOUR_API_KEY</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
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
}</code></pre><p>Use the returned <code>scopes</code> list to confirm which features the key can access. Project-scoped endpoints still use <code>x-project-id</code> when the project needs to be disambiguated.</p><h2>Team Brain</h2><p>Team Brain is the shared knowledge layer behind Aamu AI. It can be queried directly through the API when an integration needs grounded context before it writes a task, drafts a support reply, creates a doc, or decides what to do next.</p><p>The retrieve endpoint returns matching curated Team Brain entries and source chunks. It does not generate a final answer by itself; callers can use the results as context for their own model, or let Aamu use the same knowledge through a workflow such as Helpdesk reply-draft generation.</p><h3>POST: retrieve knowledge</h3><p><code>limit</code> controls the maximum number of matching results returned. Results are ranked by relevance score, so a smaller limit is useful when an AI prompt needs only the strongest few pieces of context, while a larger limit gives the caller more material to inspect or rerank.</p><pre><code class="language-plaintext">POST /api/v1/team-brain/retrieve
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "query": "How should we answer a billing cancellation question?",
  "limit": 8
}</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "results": [
    {
      "kind": "brain",
      "score": 0.82,
      "title": "Cancellation billing policy",
      "text": "Explain the policy clearly and ask for the account email if needed.",
      "urls": []
    }
  ]
}</code></pre><p>Use Team Brain read scope for the project. When Helpdesk draft generation is configured to use Team Brain, the same Team Brain read scope is required in addition to Helpdesk write scope.</p><h2>Users</h2><p>The Users API resolves project members for actor headers, task assignees and integrations that need stable Aamu user ids. It accepts any project read scope, such as Tasks, Docs, Git, Newsletters, Helpdesk or Emails.</p><h3>GET: list users</h3><pre><code class="language-plaintext">GET /api/v1/users/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>The older <code>?username=...</code> query filter is still supported for backwards compatibility, but one-user lookups should use the resource endpoint below.</p><h3>GET: get one user</h3><pre><code class="language-plaintext">GET /api/v1/users/badding
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>The path value can be a username or user id. Example response:</p><pre><code class="language-plaintext">{
  "user": {
    "id": "USER_ID",
    "username": "badding",
    "name": "Badding",
    "email": "badding@example.com"
  }
}</code></pre><h2>User activity reports</h2><p>The Reports API provides project-scoped user activity totals, day/week/month time series, and event timelines grouped by local calendar day. Use a Team API key with <strong>Reports</strong> read scope and the normal <code>x-project-id</code> header.</p><p>An active day includes every matching activity type rather than comments alone. The event stream can contain activity from Tasks, Docs, Git, Helpdesk, meetings, files, databases, comments, and other supported project features.</p><h3>GET: report all project users</h3><pre><code class="language-plaintext">GET /api/v1/reports/users/?from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;interval=week
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p><code>from</code> is inclusive, <code>to</code> is exclusive, and the maximum range is 366 days. The timezone controls calendar-day boundaries. Supported intervals are <code>day</code>, <code>week</code>, and <code>month</code>. Use <code>users</code> with comma-separated ids or usernames and <code>metrics</code> to select only the required values.</p><p>The first metrics include total events, active days, distinct touched items, comments, commits, created branches, and created, merged, closed, or reopened pull requests. Project totals, per-user values, and continuous intervals are returned together.</p><h3>GET: report one user</h3><pre><code class="language-plaintext">GET /api/v1/reports/users/ada?from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;interval=day</code></pre><p>The path accepts a username or user id.</p><h3>GET: list a user’s activity by day</h3><pre><code class="language-plaintext">GET /api/v1/reports/users/ada/activity?from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;categories=git,comments&amp;limit=100</code></pre><p>The activity endpoint returns safe event metadata grouped by date. Filter with broad <code>categories</code> or exact event <code>types</code>, and continue with the opaque <code>next_cursor</code>. Its summary covers the complete filtered range rather than only the current page.</p><p>Activity history begins when normalized event collection is enabled. Check the response’s <code>data_coverage</code> object before comparing older periods; the API does not infer a complete event history from the current state of tasks, tickets, documents, or repositories.</p><p>For complete examples and metric definitions, see <a target="_blank" rel="noopener noreferrer nofollow" href="/blog/posts/report-on-user-activity-with-the-aamu-api/">Report on user activity with the Aamu API</a>.</p><h2>Git</h2><p>The Git API manages repositories, files, branches, commits, diffs and pull requests, alongside repository settings, branch protection, push mirrors, CI and public SSH keys.</p><p>Use Git read scope for reads, Git write scope for code and pull request changes, and Git admin scope for repository creation, deletion and administrative settings. SSH key changes use Git write scope. Project-scoped requests use x-project-id when needed.</p><p>SSH key endpoints only work with public keys. Aamu never receives, stores, or returns private SSH keys. By default the key owner is the user who created the Team API key; <code>x-aamu-actor</code> is intentionally not used for Git SSH key management because SSH keys are persistent credentials.</p><h3>GET: list Git repositories</h3><pre><code class="language-plaintext">GET /api/v1/git/repos/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "repos": [
    {
      "id": "REPO_ID",
      "pid": "YOUR_PROJECT_ID",
      "name": "customer-portal",
      "status": "active",
      "default_branch": "main",
      "private": true,
      "ssh_url": "git@git.example.com:team/customer-portal.git",
      "html_url": "https://git.example.com/team/customer-portal"
    }
  ]
}</code></pre><h3>POST: create a Git repository</h3><pre><code class="language-plaintext">POST /api/v1/git/repos/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "customer-portal",
  "description": "Customer-facing portal code",
  "private": true,
  "auto_init": true
}</code></pre><p>The response returns the Aamu repository id together with Git clone URLs from the team Git service. Use that id for repo-specific task endpoints such as <code>/api/v1/repos/{repoId}/tasks/</code>.</p><h3>DELETE: delete a Git repository</h3><pre><code class="language-plaintext">DELETE /api/v1/git/repos/REPO_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>Deleting a repository removes it from the team Git service and marks the linked Aamu repository record deleted.</p><h3>GET: list Git SSH keys</h3><pre><code class="language-plaintext">GET /api/v1/git/keys/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "keys": [
    {
      "id": "KEY_ID",
      "title": "CI deploy key",
      "key": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA...",
      "fingerprint": "SHA256:...",
      "owner": "USER_ID"
    }
  ]
}</code></pre><h3>POST: add a Git SSH key</h3><pre><code class="language-plaintext">POST /api/v1/git/keys/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "title": "CI deploy key",
  "key": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... ci@example"
}</code></pre><h3>DELETE: remove a Git SSH key</h3><pre><code class="language-plaintext">DELETE /api/v1/git/keys/KEY_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><h2>Helpdesk</h2><p>The Helpdesk API is designed for human-in-the-loop support automation. Integrations can read new tickets, prepare reply drafts, and send a draft only through an explicit send command.</p><p>Reply drafts are stored in the same user-specific comment draft location the UI uses, and the ticket is marked with <code>hasDraft</code>. In practice this means the draft appears in the Helpdesk reply editor for the API actor, ready for a human to review and send.</p><h3>GET: list tickets</h3><pre><code class="language-plaintext">GET /api/v1/helpdesk/tickets/?status=open&amp;unanswered=true
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><h3>GET: resolve a Helpdesk actor</h3><p>Use this endpoint to check a Helpdesk actor and the project Helpdesk mailbox used for email tickets. The actor can be a username or user id. The response includes safe mailbox metadata only, never passwords or tokens.</p><pre><code class="language-plaintext">GET /api/v1/helpdesk/actors/ile
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
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
}</code></pre><h3>PUT: write a reply draft</h3><pre><code class="language-plaintext">PUT /api/v1/helpdesk/tickets/TICKET_ID/reply-draft
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai
Content-Type: application/json

{
  "html": "&lt;p&gt;Hei, kiitos viestistä. Tarkistin tilanteen ja...&lt;/p&gt;",
  "mode": "replace"
}</code></pre><h3>POST: generate a reply draft</h3><p>Aamu can also generate the draft with Team AI. By default this uses Team Brain retrieval as context, so the API key needs both Helpdesk write scope and Team Brain read scope for the project.</p><pre><code class="language-plaintext">POST /api/v1/helpdesk/tickets/TICKET_ID/reply-draft/generate
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai
Content-Type: application/json

{
  "instructions": "Answer in Finnish, friendly and concise.",
  "use_team_brain": true,
  "mode": "replace"
}</code></pre><p>The generated draft is saved as the API actor’s Helpdesk comment draft. It is not sent automatically.</p><h3>POST: send a reply draft</h3><p>Sending is deliberately separate from writing or generating a draft. The send endpoint takes the current draft for the API actor, sends it through the same Helpdesk comment/email path as the UI, clears the draft, and returns the sent comment plus the updated ticket.</p><p>Use Helpdesk comment permission for this endpoint. <code>x-aamu-actor</code> selects whose draft is sent, so integrations can safely keep AI-generated drafts under an <code>ai</code> actor or send as a specific user when that is intended.</p><pre><code class="language-plaintext">POST /api/v1/helpdesk/tickets/TICKET_ID/reply-draft/send
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
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
}</code></pre><h2>Emails</h2><p>The Email API follows the same human-in-the-loop model as Helpdesk: integrations can list email threads, write or generate a user-specific reply draft, and send that draft only through an explicit send command.</p><p>Drafts are stored in the same user-specific comment draft location the email UI uses and the email is marked with <code>hasDraft</code>. Use <code>x-aamu-actor</code> to select whose draft is written, generated or sent.</p><h3>GET: list emails</h3><p><code>limit</code> controls the maximum number of email threads returned. Use <code>status=unanswered</code> or <code>unanswered=true</code> when building an AI reply queue.</p><pre><code class="language-plaintext">GET /api/v1/emails/?status=unanswered&amp;limit=20
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><h3>GET: resolve an email actor</h3><p>Use this endpoint to check which project-specific email address an actor uses when sending email replies. The actor can be a username or user id. The response includes safe mailbox metadata only, never passwords or tokens.</p><pre><code class="language-plaintext">GET /api/v1/emails/actors/ile
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
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
}</code></pre><h3>GET: search email contacts</h3><p>Use contacts when selecting recipients for new drafts or sent emails. The API also auto-resolves address-only recipients to existing contacts by email address. Missing contacts are created only when <code>create_missing_contacts</code> is explicitly set to <code>true</code>.</p><pre><code class="language-plaintext">GET /api/v1/emails/contacts/?q=ilkkah&amp;limit=10
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ile</code></pre><h3>POST: create a new email draft</h3><p>Use this endpoint to create a new outbound email draft for the API actor without sending it. The draft appears in the same email draft list the UI uses. Use Emails write permission for this endpoint.</p><pre><code class="language-plaintext">POST /api/v1/emails/drafts/
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
}</code></pre><h3>POST: send a new email</h3><p>Use this endpoint to send a new outbound email, not a reply to an existing thread. It creates a draft for the API actor, sends it through the same project email path as the UI, and returns the sent email thread. Use Emails comment permission for this endpoint.</p><pre><code class="language-plaintext">POST /api/v1/emails/
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
}</code></pre><h3>PUT: write a reply draft</h3><p>The API chooses the original sender/contact as the default recipient when possible. You can pass <code>to</code> explicitly if the integration wants to override recipients.</p><pre><code class="language-plaintext">PUT /api/v1/emails/EMAIL_ID/reply-draft
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
}</code></pre><h3>POST: generate a reply draft</h3><p>Email draft generation supports optional <code>instructions</code> for tone, language or constraints. By default it uses Team Brain retrieval as context, so the API key needs both Emails write scope and Team Brain read scope for the project.</p><pre><code class="language-plaintext">POST /api/v1/emails/EMAIL_ID/reply-draft/generate
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai
Content-Type: application/json

{
  "instructions": "Answer in Finnish and keep it short.",
  "use_team_brain": true,
  "mode": "replace"
}</code></pre><h3>POST: send a reply draft</h3><p>Sending uses the same email-comment/send path as the UI. The endpoint sends the current draft for the API actor, clears it, and returns the sent comment plus the updated email thread. Use Emails comment permission for this endpoint.</p><pre><code class="language-plaintext">POST /api/v1/emails/EMAIL_ID/reply-draft/send
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai</code></pre><h2>Tasks</h2><p>The project-scoped Tasks API can list and filter work, create tasks, update task content and scheduling, assign project members, set tags and priority, manage custom fields and todo checklists, connect related tasks, and read or manage comments. Use a Team API key with the appropriate Tasks read, write or comment permission. Send <code>x-project-id</code> when a key can access more than one project, and use <code>x-aamu-actor</code> to attribute a write to a particular project member.</p><h3>GET: list and query tasks</h3><p>The default list contains non-repository tasks that are not drafts, archived or deleted; completed tasks are included. Use <code>view=active</code> for the current work queue. Other views are <code>overdue</code>, <code>running</code>, <code>starred</code>, <code>complete</code> and <code>archived</code>. Use either a shortcut view or an explicit <code>status</code> filter.</p><pre><code class="language-plaintext">GET /api/v1/tasks/?view=active&amp;assignee_id=USER_ID&amp;sort=end_at&amp;order=asc&amp;limit=50
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>List queries support comma-separated <code>status</code>, <code>tag</code> and <code>assignee_id</code> values, and literal text search with <code>q</code> in the title and HTML. Date boundaries accept ISO strings or millisecond timestamps and are exclusive: <code>start_after</code>, <code>start_before</code>, <code>due_after</code>, <code>due_before</code>, <code>created_after</code>, <code>created_before</code>, <code>updated_after</code> and <code>updated_before</code>.</p><pre><code class="language-plaintext">GET /api/v1/tasks/?q=customer+import&amp;status=active&amp;tag=support
GET /api/v1/tasks/?due_after=2026-11-01T00:00:00Z&amp;due_before=2026-11-08T00:00:00Z&amp;sort=end_at&amp;order=asc
GET /api/v1/tasks/?updated_after=2026-10-01T00:00:00Z&amp;sort=updated&amp;order=asc</code></pre><p>Supported sort fields are <code>created</code>, <code>updated</code>, <code>start_at</code>, <code>end_at</code>, <code>completed_at</code> and <code>priority</code>. Responses include <code>has_more</code> and <code>next_cursor</code>. Continue with the returned opaque cursor and the same filters, sort and order:</p><pre><code class="language-plaintext">GET /api/v1/tasks/?view=active&amp;sort=updated&amp;order=desc&amp;limit=50&amp;cursor=NEXT_CURSOR</code></pre><p>The task cursor is bound to the project, repository scope, sort and order. Store and resend it rather than constructing one.</p><p><strong>Comments in list responses:</strong> task lists return <code>comments: []</code> by default. Add <code>include_comments=true</code> to include embedded comments, or use the paginated comments endpoint below. A single-task GET still includes non-deleted comments.</p><h3>GET: repository tasks and project users</h3><p>Repository tasks use a separate resource path. The project list can also select one repository with <code>repo_id</code>, or include both normal and repository tasks with <code>include_repo_tasks=true</code>.</p><pre><code class="language-plaintext">GET /api/v1/repos/REPO_ID/tasks/?view=overdue&amp;sort=end_at&amp;order=asc
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>Resolve project members through <code>GET /api/v1/users/</code> before assigning work or filling a custom user field. Responses provide stable user ids and safe profile fields. A one-user lookup accepts a username or id at <code>GET /api/v1/users/USER_ID_OR_USERNAME</code>.</p><h3>GET: discover the project task workflow</h3><pre><code class="language-plaintext">GET /api/v1/tasks/metadata
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>This read-scoped endpoint returns a <code>metadata</code> object containing <code>project_id</code>, workflow <code>statuses</code>, <code>lifecycle_statuses</code>, <code>priorities</code> and active <code>custom_fields</code>. Status fields also expose their allowed values. Read these definitions before writing a custom field or choosing a project-specific workflow status.</p><h3>POST: create a task</h3><p>A task requires non-empty <code>title</code> and <code>html</code> strings. Dates accept milliseconds or ISO strings. Repetition can be <code>daily</code>, <code>weekly</code>, <code>monthly</code> or <code>yearly</code> and requires an end date. Reminder offsets are non-negative integers, expressed either as <code>minutes_before</code> or day/hour/minute fields <code>d</code>, <code>h</code> and <code>m</code>.</p><pre><code class="language-plaintext">POST /api/v1/tasks/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: USER_ID
Idempotency-Key: customer-import-review-001
Content-Type: application/json

{
  "title": "Review customer import",
  "html": "&lt;p&gt;Check the import logs and report the result.&lt;/p&gt;",
  "status": "active",
  "priority": 2,
  "tags": [
    "customer",
    "import"
  ],
  "start_at": "2026-11-03T09:00:00Z",
  "end_at": "2026-11-03T10:00:00Z",
  "users": [
    "USER_ID"
  ],
  "reminders": [
    {
      "minutes_before": 30
    }
  ],
  "todos": [
    {
      "label": "Check rejected rows"
    },
    {
      "label": "Confirm customer totals"
    }
  ],
  "comments": [
    {
      "html": "&lt;p&gt;Created from the support queue.&lt;/p&gt;"
    }
  ]
}</code></pre><p>Priority is <code>0</code> for Low, <code>1</code> for Normal and <code>2</code> for High; creation defaults to Normal. Tags are trimmed and deduplicated. A successful creation returns status 201 and a <code>task</code> object. If a non-essential post-creation operation fails, inspect the response’s <code>warnings</code> rather than assuming the task itself was not created.</p><h3>PATCH: update task properties</h3><p>PATCH accepts any combination of title, HTML, status, assignees, dates, repetition, reminders, tags, priority, custom fields and todos. Omitted properties stay unchanged. A tags array replaces the existing tags, and <code>[]</code> clears them. Send <code>null</code> for a date or repetition to clear it, and an empty reminders array to remove reminders.</p><pre><code class="language-plaintext">PATCH /api/v1/tasks/TASK_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: USER_ID
Content-Type: application/json

{
  "status": "complete",
  "tags": [
    "customer",
    "reviewed"
  ],
  "priority": 1,
  "end_at": null,
  "repeat": null,
  "reminders": []
}</code></pre><p>Repository task reads and updates use <code>GET</code> and <code>PATCH /api/v1/repos/REPO_ID/tasks/TASK_ID</code>, with the same update fields.</p><h3>Custom fields and todo checklists</h3><p>Use the actual field ids from <code>/api/v1/tasks/metadata</code>. The <code>fields</code> object merges supplied keys into the task’s current values; omitted keys remain, and <code>null</code> removes a value. The following example assumes that the selected project defines a numeric size field and a status field with the value <code>ready</code>:</p><pre><code class="language-plaintext">PATCH /api/v1/tasks/TASK_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "fields": {
    "SIZE_FIELD_ID": 3,
    "STAGE_FIELD_ID": "ready"
  },
  "todos": [
    {
      "id": "check-rows",
      "label": "Check rejected rows",
      "checked": true
    },
    {
      "label": "Confirm customer totals",
      "checked": false
    }
  ]
}</code></pre><p>Text and long-text fields take strings. Number fields take JSON numbers; their stored values are returned as decimal strings. Status fields take an allowed status value and are returned as definition objects. Date/time fields take milliseconds or an ISO string. User fields take arrays of project user ids. Location fields take an object with <code>description</code> and optional <code>place_id</code>, <code>tz</code> and numeric <code>lat</code>/<code>lng</code>/<code>lon</code> coordinates. Unknown or deleted field definitions and users outside the project are rejected.</p><p>The <code>todos</code> array replaces the task’s checklist. Each item has a label, an optional boolean <code>checked</code>, and an id. Keep an existing id when replacing the list; omit it for a new item and Aamu generates one. Duplicate ids are rejected, <code>[]</code> clears the list, and a task can have up to 500 items. Both <code>fields</code> and <code>todos</code> are also accepted when creating a task.</p><h3>Connect blocking and duplicate tasks</h3><p>Task responses include a <code>relations</code> object with <code>blocked_by</code>, <code>blocking</code> and <code>duplicate</code> arrays of related task ids within the same project. Add a relation with:</p><pre><code class="language-plaintext">POST /api/v1/tasks/TASK_ID/relations
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "type": "blocked_by",
  "task_id": "OTHER_TASK_ID"
}</code></pre><p>Aamu also updates the inverse relationship: a task that is blocked by another appears in that other task’s <code>blocking</code> list. Duplicate relationships are symmetric. Repeating an add does not duplicate the relationship. Remove one with:</p><pre><code class="language-plaintext">DELETE /api/v1/tasks/TASK_ID/relations/blocked_by/OTHER_TASK_ID</code></pre><p>Relation writes require Tasks write permission. The two tasks must be different, non-deleted tasks in the selected project. Repository tasks use the same suffixes under <code>/api/v1/repos/REPO_ID/tasks/TASK_ID</code>; the related task can be any non-deleted task in that project.</p><h3>Read, add, edit and delete comments</h3><p>Read comments with Tasks read permission. The endpoint returns non-deleted comments ordered by creation time and id, together with <code>limit</code>, <code>has_more</code> and <code>next_cursor</code>. The default page size is 50 and the maximum is 200; a cursor is bound to its task and project.</p><pre><code class="language-plaintext">GET /api/v1/tasks/TASK_ID/comments?limit=50
GET /api/v1/tasks/TASK_ID/comments?limit=50&amp;cursor=NEXT_CURSOR</code></pre><p>Adding a comment requires comment permission and returns the updated task. Use a fresh idempotency key for a new comment and reuse that same key only when retrying the identical request:</p><pre><code class="language-plaintext">POST /api/v1/tasks/TASK_ID/comments
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: USER_ID
Idempotency-Key: customer-import-comment-001
Content-Type: application/json

{
  "html": "&lt;p&gt;The import is ready for review.&lt;/p&gt;"
}</code></pre><pre><code class="language-plaintext">PATCH /api/v1/tasks/TASK_ID/comments/COMMENT_ID
Content-Type: application/json

{
  "html": "&lt;p&gt;The reviewed import is ready.&lt;/p&gt;"
}

DELETE /api/v1/tasks/TASK_ID/comments/COMMENT_ID</code></pre><p>Editing or deleting a comment requires comment access; changing another author’s comment additionally requires Tasks write permission. System comments cannot be changed. Deletion is soft, and deleted comments disappear from normal reads. These routes are also available for repository tasks below <code>/api/v1/repos/REPO_ID/tasks/TASK_ID/comments</code>.</p><h3>Retry mutations with Idempotency-Key</h3><p>All task, relation and comment mutations accept <code>Idempotency-Key</code>, a non-empty string of up to 200 characters. Aamu records the request and its response durably. Retrying the same request with the same key replays the original HTTP status, body and ETag for at least 24 hours, with <code>Idempotency-Replayed: true</code>. This makes a timeout recoverable without creating another task or comment.</p><p>Keys are scoped to the API key, project, method, route and path parameters. The body, actor and <code>If-Match</code> header must agree on retries. Reusing a key with different input returns 409 <code>IDEMPOTENCY_KEY_REUSED</code>. A request that is still processing, or whose outcome is not confirmed, returns 409 <code>IDEMPOTENCY_IN_PROGRESS</code> instead of running again. An interrupted request can remain in that state until its retention period expires. Completed error responses are replayed too; a deliberately revised request needs a new key.</p><h3>Protect changes with ETag and If-Match</h3><p>Read a single task with <code>GET /api/v1/tasks/TASK_ID</code> and retain its <code>ETag</code> response header. Send that exact value, including its quotation marks, in <code>If-Match</code> when updating the task, its comments or its relations:</p><pre><code class="language-plaintext">PATCH /api/v1/tasks/TASK_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
If-Match: "ETAG_FROM_TASK_GET"
Idempotency-Key: customer-import-update-001
Content-Type: application/json

{
  "priority": 2
}</code></pre><p>A stale ETag returns 412. Aamu checks for intervening changes again at the actual task write, so a concurrent user edit is preserved. Without an explicit precondition, an intervening change returns 409. Read the task again and reconcile the change before submitting a revised request. An idempotent retry is replayed before the old <code>If-Match</code> is evaluated, so retry the original request with its original headers.</p><h3>Validate inputs and handle partial failures</h3><p>Unknown fields, invalid types and empty PATCH requests return 400. Use JSON numbers for priority and numeric custom fields, booleans for checklist state, and a workflow status allowed by the selected project. A failed storage operation returns an error instead of a success response.</p><p>Multi-step changes are not rolled back automatically. When a failure occurs after some writes have committed, inspect <code>error.details.partial</code>, <code>committed_paths</code>, <code>related_commits</code> and the current <code>task</code> in the error details. If a task was created before a later creation failure, its details are returned for reconciliation. A 503 <code>TASK_RESULT_UNCONFIRMED</code> means the final result could not be confirmed; read the current state before deciding what to retry.</p><p>Task responses provide project and repository context, ownership, scheduling, assignees, tags, priority, custom fields, checklists, relations and completion state. Combined with explicit retries and conflict handling, these operations support task queues, synchronization and workflows connected to Docs or database rows. Consult the host’s <code>/.well-known/openapi.json</code> for the complete operation and error schemas.</p><h2>Docs</h2><p>The Docs API creates durable written material directly into Aamu. It is a good fit for AI-generated summaries, runbooks, meeting notes, release notes, customer handoff documents, and internal knowledge articles.</p><h3>GET: list docs</h3><pre><code class="language-plaintext">GET /api/v1/docs/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "docs": [
    {
      "id": "DOC_ID",
      "pid": "YOUR_PROJECT_ID",
      "title": "Weekly API Report",
      "status": "public",
      "html": ""
    }
  ]
}</code></pre><h3>POST: create a doc</h3><pre><code class="language-plaintext">POST /api/v1/docs/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "title": "Weekly API Report",
  "html": "&lt;h1&gt;Weekly API Report&lt;/h1&gt;&lt;p&gt;All checks passed.&lt;/p&gt;"
}</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "doc": {
    "id": "DOC_ID",
    "pid": "YOUR_PROJECT_ID",
    "title": "Weekly API Report",
    "status": "public",
    "html": "&lt;h1&gt;Weekly API Report&lt;/h1&gt;&lt;p&gt;All checks passed.&lt;/p&gt;"
  }
}</code></pre><h3>PATCH: update a doc</h3><pre><code class="language-plaintext">PATCH /api/v1/docs/DOC_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "title": "Weekly API Report, revised",
  "html": "&lt;h1&gt;Weekly API Report&lt;/h1&gt;&lt;p&gt;All checks passed after the retry.&lt;/p&gt;"
}</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "doc": {
    "id": "DOC_ID",
    "title": "Weekly API Report, revised",
    "html": "&lt;h1&gt;Weekly API Report&lt;/h1&gt;&lt;p&gt;All checks passed after the retry.&lt;/p&gt;"
  }
}</code></pre><h2>Meetings</h2><p>The Meetings API can create and update project meetings. It supports fields such as name, HTML description, start time, end time, and invitee emails.</p><h3>GET: list meetings</h3><pre><code class="language-plaintext">GET /api/v1/meetings/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
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
}</code></pre><h3>POST: create a meeting</h3><pre><code class="language-plaintext">POST /api/v1/meetings/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "API rollout review",
  "html": "&lt;p&gt;Review integration status and next steps.&lt;/p&gt;",
  "start_time": 1779458400000,
  "end_time": 1779462000000
}</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "meeting": {
    "id": "MEETING_ID",
    "pid": "YOUR_PROJECT_ID",
    "name": "API rollout review",
    "status": "public",
    "html": "&lt;p&gt;Review integration status and next steps.&lt;/p&gt;"
  }
}</code></pre><h3>PATCH: update a meeting</h3><pre><code class="language-plaintext">PATCH /api/v1/meetings/MEETING_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "API rollout review, updated",
  "html": "&lt;p&gt;Review production results and decide follow-up actions.&lt;/p&gt;",
  "start_time": 1779462000000,
  "end_time": 1779465600000
}</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "meeting": {
    "id": "MEETING_ID",
    "name": "API rollout review, updated",
    "html": "&lt;p&gt;Review production results and decide follow-up actions.&lt;/p&gt;",
    "start_time": 1779462000000,
    "end_time": 1779465600000
  }
}</code></pre><h2>Forms API</h2><p>The authenticated Forms API lets integrations create Forms, update their questions and settings, list and inspect Forms, and submit responses. Published Form responses become rows in the connected database table.</p><h3>POST: create a Form</h3><p>Use Forms write scope. With <code>publish: true</code>, Aamu creates the backing database and table, maps Form fields to database columns, and publishes the Form.</p><pre><code class="language-plaintext">POST /api/v1/forms/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: USER_ID_OR_USERNAME
Content-Type: application/json

{
  "name": "Contact Form",
  "description": "Send us a message.",
  "publish": true,
  "fields": [
    { "title": "Name", "type": "short_text", "required": true },
    { "title": "Email address", "type": "email", "required": true },
    { "title": "Message", "type": "long_text" }
  ]
}</code></pre><p>Supported field types include short and long text, email, number, date/time, choice fields, files, paragraphs, and page breaks. Email fields use a text-backed database column but render as HTML email inputs in the public Form.</p><h3>GET: list and inspect Forms</h3><pre><code class="language-plaintext">GET /api/v1/forms/
GET /api/v1/forms/FORM_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><h3>PATCH: update a Form</h3><p>Update metadata without changing questions, or supply <code>fields</code> to replace the question list. Stable <code>item_id</code> values preserve field identity across updates. Setting <code>publish: true</code> publishes a draft Form or publishes newly added fields into the backing table.</p><pre><code class="language-plaintext">PATCH /api/v1/forms/FORM_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "description": "Updated contact form.",
  "publish": true,
  "fields": [
    { "item_id": "name", "title": "Name", "type": "short_text", "required": true },
    { "item_id": "email-address", "title": "Email address", "type": "email", "required": true },
    { "item_id": "message", "title": "How can we help?", "type": "long_text", "required": true }
  ]
}</code></pre><h3>POST: submit a Form response</h3><pre><code class="language-plaintext">POST /api/v1/forms/FORM_ID/submissions
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "fields": {
    "name": "Ada Example",
    "email-address": "ada@example.com",
    "message": "I would like to hear more."
  }
}</code></pre><p>The response contains the created row id together with the Form, database, and table ids.</p><h2>Newsletters</h2><p>Use the Newsletters read or write scope with x-project-id to manage Newsletters, issues, subscribers, audience selection, reviews, scheduling, reports and public archive copies.</p><p>Before sending, configure a verified email domain and a sending mailbox. Email-domain and mailbox setup is available in the UI and through the corresponding API operations described in OpenAPI.</p><h3>Create a newsletter</h3><pre><code class="language-plaintext">POST /api/v1/newsletters/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "Product updates"
}</code></pre><p>List Newsletters with GET /api/v1/newsletters/. Read or update one with GET or PATCH /api/v1/newsletters/{id}. Creating a Newsletter also creates its Audience Database, Subscribers table and managed subscription automations.</p><h3>Create a public signup workflow</h3><pre><code class="language-plaintext">POST /api/v1/newsletters/NEWSLETTER_ID/signup-form
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai</code></pre><p>This idempotent endpoint creates a published signup Form connected to the Newsletter’s existing Audience Database and its subscription workflow. It returns the Form, database and table ids, automation and public URL. The Audience Database is the source of truth; the Subscribers view is derived from it.</p><h3>Create and update an issue</h3><pre><code class="language-plaintext">POST /api/v1/newsletters/NEWSLETTER_ID/issues
{
  "subject": "June product update",
  "html": "&lt;p&gt;What changed this month...&lt;/p&gt;"
}

PATCH /api/v1/newsletters/NEWSLETTER_ID/issues/ISSUE_ID
{
  "subject": "June product update — revised",
  "html": "&lt;p&gt;The reviewed version...&lt;/p&gt;"
}</code></pre><p>Issues are listed at <code>GET /api/v1/newsletters/{id}/issues</code> and read individually at <code>GET /api/v1/newsletters/{id}/issues/{issueId}</code>. Only draft issues can be updated or sent.</p><h3>Manage subscribers</h3><pre><code class="language-plaintext">POST /api/v1/newsletters/NEWSLETTER_ID/subscribers
{
  "email": "reader@example.com",
  "name": "Ada Lovelace",
  "tags": ["customer"]
}

PATCH /api/v1/newsletters/NEWSLETTER_ID/subscribers/SUBSCRIBER_ID
{
  "status": "unsubscribed"
}</code></pre><p>Use <code>GET /api/v1/newsletters/{id}/subscribers</code> to list subscribers. The optional <code>status</code> query filters the result. Subscriber updates can change the name, tags, or status between <code>subscribed</code> and <code>unsubscribed</code>. API responses never return the private unsubscribe token.</p><h3>Test and send explicitly</h3><pre><code class="language-plaintext">POST /api/v1/newsletters/NEWSLETTER_ID/issues/ISSUE_ID/send-test
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai

POST /api/v1/newsletters/NEWSLETTER_ID/issues/ISSUE_ID/review
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai

POST /api/v1/newsletters/NEWSLETTER_ID/issues/ISSUE_ID/send
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{ "review_token": "TOKEN_FROM_REVIEW" }</code></pre><p>The test endpoint sends to the API actor when that address is an eligible active subscriber. Before production sending, request POST /api/v1/newsletters/{id}/issues/{issueId}/review and pass the returned review.token as review_token to /send. The send endpoint returns 202 with queued: true. Delivery runs in persistent, automatically growing batches; it is not complete when the request returns.</p><p>Schedule with <code>POST /api/v1/newsletters/{id}/issues/{issueId}/schedule</code>, supplying <code>send_at</code>, <code>timezone</code> and <code>review_token</code>. Cancel through <code>/cancel-schedule</code>. Public archive publication is separate from email sending: preview through <code>/publication/preview</code>, then pass its token to <code>/publish</code>.</p><p>For the product workflow behind these endpoints, see <a target="_blank" rel="noopener noreferrer nofollow" href="/blog/posts/newsletters-in-aamuapp-from-subscribers-to-sending/">Newsletters in Aamu.app: from subscribers to sending</a>.</p><h2>Webhooks API</h2><p>The Webhooks API manages team-level outbound webhooks. A webhook can subscribe to selected Aamu event types, optionally filter project-scoped events to specific projects, and send signed HTTP requests to an external endpoint.</p><p>Webhook management uses a team-level Webhooks API-key scope. It does not use <code>x-project-id</code> to choose the webhook owner; project filtering is configured with <code>project_ids</code> in the webhook definition. An empty project list accepts matching events from all projects in the team.</p><h3>POST: create a webhook</h3><pre><code class="language-plaintext">POST /api/v1/webhooks/
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "name": "Form submissions",
  "url": "https://example.com/aamu/webhook",
  "events": [
    "form.created",
    "form.updated",
    "form.deleted",
    "form.submitted",
    "db.row.created",
    "db.row.updated"
  ],
  "project_ids": ["PROJECT_ID"],
  "enabled": true
}</code></pre><p>The create response contains the signing <code>secret</code>. Store it securely when the webhook is created: later list and get responses expose only <code>secret_last4</code>, not the full secret.</p><p>For Forms integrations, <code>form.created</code>, <code>form.updated</code>, and <code>form.deleted</code> describe the Form lifecycle. A response emits <code>form.submitted</code> and also creates the backing database row, producing <code>db.row.created</code>. A later edit to that response row emits <code>db.row.updated</code>.</p><h3>List, inspect, update, and delete webhooks</h3><pre><code class="language-plaintext">GET    /api/v1/webhooks/
GET    /api/v1/webhooks/WEBHOOK_ID
PATCH  /api/v1/webhooks/WEBHOOK_ID
DELETE /api/v1/webhooks/WEBHOOK_ID
x-api-key: YOUR_API_KEY</code></pre><p>Use Webhooks read scope to list and inspect definitions. Creating, updating, enabling, disabling, and deleting webhooks requires Webhooks write scope.</p><h3>GET: inspect delivery logs</h3><pre><code class="language-plaintext">GET /api/v1/webhooks/logs?limit=50
x-api-key: YOUR_API_KEY</code></pre><p>The logs response contains recent webhook events and delivery attempts. Use it to distinguish an event that was never emitted, an event that did not match a webhook, and a delivery that reached the receiver but returned an error.</p><p>Each delivery includes an HMAC SHA-256 signature in <code>x-aamu-signature</code>, together with event and delivery ids. Verify the signature against the raw request body before trusting the payload. For a fuller event overview and signature example, see <a target="_blank" rel="noopener noreferrer nofollow" href="/blog/posts/outbound-webhooks-in-aamuapp-real-time-events-tasks-helpdesk-email/">Outbound webhooks in Aamu.app</a>.</p><h2>Public forms</h2><p>Public browser forms use the same URL for viewing and submitting. They do not use a Team API key. This is separate from the authenticated Forms API.</p><h3>GET: render a public form</h3><pre><code class="language-plaintext">GET /shared/form/FORM_ID</code></pre><p>Example response is HTML:</p><pre><code class="language-plaintext">&lt;form action="https://your-team.aamu.app/shared/form/FORM_ID" method="post" enctype="multipart/form-data"&gt;
  &lt;input type="hidden" name="form_builder" value="1"&gt;
  ...
&lt;/form&gt;</code></pre><h3>POST: submit a public form</h3><pre><code class="language-plaintext">POST /shared/form/FORM_ID
Content-Type: multipart/form-data

form_builder=1
email=person@example.com
message=I would like to hear more.</code></pre><p>Example response is usually a redirect to the form thank-you page. For AJAX-style multipart submissions, the response can be JSON:</p><pre><code class="language-plaintext">{
  "success": true,
  "id": "ROW_ID"
}</code></pre><h2>Files</h2><p>Aamu files have two related identifiers: <code>pointer</code> identifies the logical file and <code>fid</code> identifies one stored file version. Database GraphQL media fields require both values. Obtain them from a successful Files API response; do not invent ids or store raw base64 data in a file column.</p><h3>POST: upload a small file in one request</h3><p>For small files, send one <code>multipart/form-data</code> request. Aamu receives the bytes, stores the object, creates the file and filepointer records, and returns a media object ready for GraphQL. The default limit is 10 MiB and can be configured by the server.</p><pre><code class="language-plaintext">curl -X POST https://YOUR_AAMU_HOST/api/v1/files/ \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-project-id: YOUR_PROJECT_ID" \
  -F "file=@example.png;type=image/png"</code></pre><p>The API key needs the project Files write scope.</p><h3>POST: prepare a direct upload</h3><p>For larger files, upload directly to object storage through a signed URL. Aamu keeps the bucket, object key, project, actor, file ids, and metadata in a short-lived server-side upload session. The client receives only an opaque <code>uploadId</code> plus the signed PUT request.</p><pre><code class="language-plaintext">POST /api/v1/files/prepare-upload
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "example.png",
  "type": "image/png",
  "size": 12345
}</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "uploadId": "upl_OPAQUE_ID",
  "expiresAt": "2026-07-11T10:00:00.000Z",
  "upload": {
    "method": "PUT",
    "url": "SIGNED_UPLOAD_URL",
    "headers": { "Content-Type": "image/png" }
  },
  "file": {
    "file_id": "FILE_VERSION_ID",
    "file_version_id": "FILE_VERSION_ID",
    "name": "example.png",
    "type": "image/png",
    "size": 12345
  }
}</code></pre><p>Send the bytes to <code>upload.url</code> with the returned method and headers. The signed URL contains the storage authorization; the client does not receive or send separate bucket or object-key fields.</p><h3>POST: complete a direct upload</h3><pre><code class="language-plaintext">POST /api/v1/files/complete-upload
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "uploadId": "upl_OPAQUE_ID"
}</code></pre><p>The upload session is project- and actor-bound, expires after a short time, and can be completed idempotently while the session remains available.</p><h3>GET: read file metadata</h3><pre><code class="language-plaintext">GET /api/v1/files/FILEPOINTER_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>All three successful file operations return the same shape:</p><pre><code class="language-json">{
  "file": {
    "id": "FILEPOINTER_ID",
    "fid": "FILE_VERSION_ID",
    "pointer": "FILEPOINTER_ID",
    "filepointer_id": "FILEPOINTER_ID",
    "file_id": "FILE_VERSION_ID",
    "file_version_id": "FILE_VERSION_ID",
    "name": "example.png",
    "type": "image/png",
    "size": 12345,
    "browser_url": "/file/browser/FILEPOINTER_ID/FILE_VERSION_ID/example.png",
    "download_url": "/file/dl/FILEPOINTER_ID/FILE_VERSION_ID/example.png"
  }
}</code></pre><h3>Use a file in a GraphQL database mutation</h3><p>Pass only the registered media identity to a generated GraphQL <code>file</code> or <code>files</code> field:</p><pre><code class="language-json">{
  "heroImage": {
    "fid": "FILE_VERSION_ID",
    "pointer": "FILEPOINTER_ID"
  }
}</code></pre><p>Before inserting or updating the row, Aamu checks that both records exist, the file version belongs to the pointer, neither record is deleted, and the pointer belongs to the same company and project as the database table. A URL-only, base64-only, missing, cross-project, or mismatched media value is rejected.</p><p>The <code>browser_url</code> can also be embedded in Docs, Tasks, or other editor HTML. The old item-level <code>files</code> field is deprecated and is not returned by the current API.</p><h2>Databases and GraphQL</h2><p>Database rows can be read and written through GraphQL or the REST Database API. REST also manages databases, tables, columns, views, transfers and related operations.</p><p>Use GraphQL for queries and mutations against the generated typed schema. REST provides resource endpoints, including row listing, individual writes and batches.</p><p>REST row endpoints live under <code>/api/v1/databases/{dbId}/tables/{tableId}/rows</code>: GET lists rows, POST creates one, and GET, PATCH or DELETE with <code>/{rowId}</code> operates on one row. <code>POST /rows/batch</code> supports batch operations. Inspect OpenAPI for filters, cursors, idempotency and atomic batch options.</p><h3>POST: create a database</h3><p>Creating a database also creates its first table. The response returns both the database id and the initial table id.</p><pre><code class="language-plaintext">POST /api/v1/databases/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "Small-team CRM"
}</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "database": {
    "id": "DB_ID",
    "pid": "YOUR_PROJECT_ID",
    "name": "Small-team CRM",
    "tables": ["DEALS_TABLE_ID"],
    "table_id": "DEALS_TABLE_ID"
  }
}</code></pre><h3>POST: add a table</h3><p>Use the table endpoint when the integration needs a related table, for example companies next to deals, contacts next to accounts, or products next to orders.</p><pre><code class="language-plaintext">POST /api/v1/databases/DB_ID/tables
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "name": "Companies",
  "gtype": "Companies"
}</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
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
}</code></pre><h3>POST: add columns</h3><p>Columns are added to one table at a time. A reference column links rows within the same Database, including rows in the same table.</p><p>The public column types are <code>text</code>, <code>longtext</code>, <code>link</code>, <code>document</code>, <code>documents</code>, <code>number</code>, <code>status</code>, <code>checkbox</code>, <code>timedate</code>, <code>timeline</code>, <code>tags</code>, <code>file</code>, <code>files</code>, <code>reference</code>, <code>contact</code>, <code>user</code>, <code>task</code>, <code>tasks</code>, <code>email</code>, <code>emails</code>, <code>meeting</code>, and <code>meetings</code>. List-like fields such as <code>documents</code>, <code>tags</code>, <code>tasks</code>, <code>emails</code>, and <code>meetings</code> are written as arrays in GraphQL.</p><pre><code class="language-plaintext">POST /api/v1/databases/DB_ID/tables/COMPANIES_TABLE_ID/columns
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "columns": [
    { "name": "Company name", "type": "text", "gtype": "companyName" },
    { "name": "Website", "type": "link", "gtype": "website" },
    { "name": "Customer docs", "type": "documents", "gtype": "customerDocs" }
  ]
}</code></pre><p>Then add fields to the first table and link each deal to a company:</p><pre><code class="language-plaintext">POST /api/v1/databases/DB_ID/tables/DEALS_TABLE_ID/columns
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
}</code></pre><p><code>options.type</code> can be <code>one_to_one</code> or <code>one_to_many</code>. <code>options.table</code> points to the target table, and <code>options.column_show</code> points to the target column shown as the reference label. The target can be either the column id or its <code>gtype</code>.</p><p><code>document</code> receives one existing Aamu Doc id. <code>documents</code> receives an array of existing Doc ids. The API links those Doc cells back to the database row, so create or resolve the Docs first instead of sending placeholder ids.</p><p>References can target the same table, and the generated GraphQL schema supports cycles between tables. automatic_reference is not a public writable column type.</p><h3>POST: inspect the generated GraphQL schema</h3><p>The exact query and mutation names come from the generated schema. Use introspection after creating or changing schema, especially when an integration creates its own table <code>gtype</code> values.</p><pre><code class="language-plaintext">POST /api/v1/graphql/
x-api-key: YOUR_API_KEY
x-db-id: DB_ID
Content-Type: application/json

{
  "query": "{ __schema { mutationType { fields { name } } queryType { fields { name } } } }"
}</code></pre><h3>POST: add row data with GraphQL</h3><p>Create target rows first, then store the referenced row id in the reference field. A <code>one_to_one</code> reference receives one row id. A <code>one_to_many</code> reference receives an array of row ids.</p><p>A GraphQL insert uses the same row-inserted automation path as Forms API and UI-created rows. If the table has a public <code>row_inserted</code> automation, its task or email actions run after the row is stored.</p><pre><code class="language-plaintext">POST /api/v1/graphql/
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
}</code></pre><p>Then create a deal and pass the company row id to the reference column:</p><pre><code class="language-plaintext">POST /api/v1/graphql/
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
}</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
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
}</code></pre><h3>GET: read row data with GraphQL</h3><p>GraphQL reads are sent as HTTP POST requests to <code>/api/v1/graphql/</code>. This is normal GraphQL behavior: the operation is a read, even though the HTTP method is POST.</p><pre><code class="language-plaintext">POST /api/v1/graphql/
x-api-key: YOUR_API_KEY
x-db-id: DB_ID
Content-Type: application/json

{
  "query": "query { Sheet1Rows { id dealName stage company { id companyName website } } }"
}</code></pre><h3>POST: update row data with GraphQL</h3><p>GraphQL updates are also sent to <code>/api/v1/graphql/</code> with HTTP POST. The mutation name depends on the generated schema, so use introspection to confirm the exact name and input type.</p><pre><code class="language-plaintext">POST /api/v1/graphql/
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
}</code></pre><h3>GET: read database activity</h3><p>Database activity records describe cell-level row changes. They are useful for row detail timelines, audit views, CRM history, and integrations that need to react to field changes after data has been written through the UI or API.</p><pre><code class="language-plaintext">GET /api/v1/databases/DB_ID/activity?table_id=DEALS_TABLE_ID&amp;row_id=DEAL_ROW_ID&amp;limit=20
x-api-key: YOUR_API_KEY</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
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
}</code></pre><p><code>op</code> is <code>insert</code>, <code>update</code> or <code>delete</code>. <code>oldvalue</code> and <code>newvalue</code> keep the stored value shape for the column: strings for text/status/reference values, arrays for list-like columns, and objects for structured columns such as timeline and file. The optional <code>render</code> object is a convenience summary for display.</p><h2>Database Automations API</h2><p>The Automations API manages workflow definitions attached to a database. It supports listing and creating automations under a database, then reading, updating, or deleting an individual automation by id.</p><pre><code class="language-plaintext">GET    /api/v1/databases/DB_ID/automations
POST   /api/v1/databases/DB_ID/automations
GET    /api/v1/automations/AUTOMATION_ID
PATCH  /api/v1/automations/AUTOMATION_ID
DELETE /api/v1/automations/AUTOMATION_ID</code></pre><p>These endpoints use <code>x-api-key</code>. They resolve the project from the database, so they do not need <code>x-project-id</code>. Use Automations read permission for list/get and Automations write permission for create/update/delete.</p><h3>POST: create an automation</h3><pre><code class="language-plaintext">POST /api/v1/databases/DB_ID/automations
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
}</code></pre><p>Supported trigger types are <code>row_inserted</code> and <code>row_updated</code>. A row-updated trigger also specifies <code>columnId</code> and the target <code>value</code>:</p><pre><code class="language-plaintext">{
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
}</code></pre><p>A row-updated trigger runs when the selected field changes to the configured value. Actions include create_task, send_email, create_row, update_row, subscribe_to_newsletter and unsubscribe_from_newsletter. Each action requires the appropriate destination permissions; see OpenAPI for its configuration.</p><h3>GET and PATCH an automation</h3><pre><code class="language-plaintext">GET /api/v1/automations/AUTOMATION_ID
x-api-key: YOUR_API_KEY

PATCH /api/v1/automations/AUTOMATION_ID
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "status": "draft",
  "name": "Paused follow-up task"
}</code></pre><p>A partial PATCH keeps fields that are not included. Switching the status to <code>draft</code> pauses execution without deleting the definition. <code>DELETE</code> removes the automation from API and UI listings.</p><h3>Forms, GraphQL, automations, and Tasks together</h3><p>These APIs can form one end-to-end workflow:</p><ol><li><p>Create a database and columns with the Database REST API.</p></li><li><p>Create a public automation with Automations write scope.</p></li><li><p>Submit a form through <code>/api/v1/forms/{id}/submissions</code> or insert a row through GraphQL.</p></li><li><p>The row is stored in the database and the matching automation runs.</p></li><li><p>A task is created in its configured project or an email action runs.</p></li></ol><h2>Using Databases and Docs together</h2><p>Docs and Databases work well together. A database can hold structured state, while Docs can hold rich long-form context. The bridge between the two is the <code>document</code> column type: its value is the id of a Docs document.</p><h3>GET: fetch a linked Doc after querying a row</h3><pre><code class="language-plaintext">GET /api/v1/docs/DOC_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "doc": {
    "id": "DOC_ID",
    "title": "Interview notes: Ada Lovelace",
    "html": "&lt;h1&gt;Interview notes&lt;/h1&gt;&lt;p&gt;Ada liked the onboarding flow.&lt;/p&gt;"
  }
}</code></pre><h3>POST: create a Doc and store its id in a row</h3><p>First create the document:</p><pre><code class="language-plaintext">POST /api/v1/docs/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "title": "Interview notes: Ada Lovelace",
  "html": "&lt;h1&gt;Interview notes&lt;/h1&gt;&lt;p&gt;Ada liked the onboarding flow and asked for more examples.&lt;/p&gt;"
}</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "doc": {
    "id": "DOC_ID",
    "title": "Interview notes: Ada Lovelace"
  }
}</code></pre><p>Then use that <code>DOC_ID</code> in a database row whose column type is <code>document</code>:</p><pre><code class="language-plaintext">POST /api/v1/graphql/
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
}</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "data": {
    "createFeedback": {
      "id": "ROW_ID",
      "customer": "Ada Lovelace",
      "sourceDocument": "DOC_ID"
    }
  }
}</code></pre><h2>Legacy direct table submit</h2><p>Older generated database form snippets can submit directly to a table endpoint. This creates database rows, but it is best treated as a legacy/browser form integration.</p><h3>GET: no row listing endpoint here</h3><p>This legacy submit path does not list rows. Use GraphQL or GET /api/v1/databases/{dbId}/tables/{tableId}/rows instead.</p><pre><code class="language-plaintext">POST /api/v1/graphql/
x-api-key: YOUR_API_KEY
x-db-id: DB_ID
Content-Type: application/json

{
  "query": "query { feedbackRows { id customer message } }"
}</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "data": {
    "feedbackRows": [
      { "id": "ROW_ID", "customer": "Ada Lovelace", "message": "The onboarding flow was clear." }
    ]
  }
}</code></pre><h3>POST: legacy table submit</h3><pre><code class="language-plaintext">POST /api/v1/db/TABLE_ID
Content-Type: application/x-www-form-urlencoded

customer=Ada%20Lovelace&amp;message=The%20onboarding%20flow%20was%20clear.</code></pre><p>Example response:</p><pre><code class="language-plaintext">{
  "success": true,
  "id": "ROW_ID"
}</code></pre><p>New integrations should use the authenticated Forms API for Form submissions and GraphQL or REST row endpoints for direct database operations.</p><h2>Update support summary</h2><p>Tasks, Docs, Meetings, Forms, Newsletters, issues, subscribers and Database resources have REST update operations. Rows also support GraphQL mutations. Public Form posts and authenticated Form submissions create rows. The Files API uploads and reads files; replacing content must follow the lifecycle of the feature that references it.</p><h2>A practical starting point</h2><p>Create a Team API key with the project and feature scopes your integration needs. Read the host’s OpenAPI description and start with one workflow. See <a target="_blank" rel="noopener noreferrer nofollow" href="https://aamu.app/blog/posts/database-automations-with-aamuapp/">Database automations with Aamu.app</a> for an example of turning row events into follow-up work.</p><h2>How the API operation surface guides Aamu's internal AI</h2><p>The public API remains the integration surface for external systems, API keys, and project-scoped automation. Aamu's internal AI can now work with the same described operation set when a user asks it to act inside the workspace.</p><p>The OpenAPI operation names and request schemas help the AI select an operation and prepare its path, query, and body arguments. The internal action does not need an API key and does not have to call Aamu over HTTP: it reuses the existing server-side handlers and product functions with the signed-in user's session and accessible projects.</p><p>This keeps the public API and internal AI capabilities aligned across areas such as Forms, databases, GraphQL rows, database automations, files, users, Helpdesk, Email, Newsletters, Docs, Tasks, and Meetings. External integrations still use API key scopes; internal AI follows the current user's workspace permissions. Higher-risk actions retain explicit confirmation boundaries.</p><h2>Related articles</h2><ul><li><a href="/blog/posts/from-form-submission-to-follow-up-workflows-with-aamuapp/">From form submission to follow-up: workflows with Aamu.app</a></li><li><a href="/blog/posts/aamuapp-databases-practical-feature-guide/">Aamu.app Databases: a practical feature guide</a></li><li><a href="/blog/posts/how-to-use-aamuapp-as-a-small-team-crm/">How to use Aamu.app as a small-team CRM</a></li><li><a href="/blog/posts/newsletters-in-aamuapp-from-subscribers-to-sending/">Newsletters in Aamu.app: from subscribers to sending</a></li><li><a href="/blog/posts/using-third-party-apis-through-aamuapp-ai/">Using third-party APIs through Aamu.app AI</a></li></ul>
