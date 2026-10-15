---
author: "Ilkka Huotari"
authorPage: "/blog/authors/ilkka-huotari/"
authorTitle: "Founder"
authorBio: "Hey, dear reader!\n\nI created Aamu.app. \n\nWhy? A few reasons. The main reason was that there didn't seem to be a good option for this kind of an app. The main one, Microsoft's offering, was (and is) a big mess. So, I thought it wouldn't be very difficult to create a better one. \n\nWell, it turned out to be a big job. Who would have known? Luckily AI came along and now the whole thing is about ready. \n\nI'm quite pleased with my creation. I have learned a lot, and still do. That has probably been the most rewarding thing from building this.\n\nThanks for reading!"
authorImage: "profile.png"
title: "How to use Aamu.app as a small-team CRM"
date: "2026-06-15T08:00:00.000Z"
modified: "2026-10-15T09:53:50.205Z"
description: "How to use the Aamu.app CRM template to track companies, contacts, deals, related work, activity, and API-driven database automations."
cover:
  image: 0accb36cb28ec3f0_crm.png
  relative: true

tags: ["database", "crm", "tasks", "emails", "api", "automations"]
directAnswer: "How to use the Aamu.app CRM template to track companies, contacts, deals, related work, activity, and API-driven database automations."
contentType: "how-to"
audience: "developers and technical teams"



ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p><strong>Short answer:</strong> How to use the Aamu.app CRM template to track companies, contacts, deals, related work, activity, and API-driven database automations.</p>
<p>A small-team CRM needs to show who you are talking to, what was promised and who owns the next follow-up.</p><p>Aamu’s CRM template connects companies, contacts and deals to tasks, emails, meetings and Docs.</p><p>Use it as a starting point for a CRM you can adapt in Aamu Databases.</p><h2>What the CRM template contains</h2><p>The template starts with three connected tables:</p><ul><li><p><strong>Companies</strong>: accounts or organizations the team is talking to.</p></li><li><p><strong>Contacts</strong>: people at those companies.</p></li><li><p><strong>Deals</strong>: sales opportunities, renewals, pilots, or commercial conversations.</p></li></ul><p>Those tables are connected with reference fields. A deal can point to a company and a primary contact. A contact can point to a company. That gives the CRM its basic structure without forcing everything into one huge table.</p><p>The template includes stage, value, probability, expected close date, next action, owner, tasks, emails, meetings, Docs and notes. You can change these fields to fit your process.</p><h2>Why three tables instead of one</h2><p>A one-table CRM is tempting because it feels easy at first. Every row is a lead. Put the company, contact, deal status, email, value, and notes into one place and keep moving.</p><p>That breaks down when the same company has multiple contacts, or one contact is involved in more than one opportunity, or a company has a current deal and a later renewal. Copying the same company and contact details across many rows creates stale data.</p><p>The Aamu template keeps the CRM normalized enough to be useful:</p><ul><li><p>A company can have many contacts.</p></li><li><p>A company can have many deals.</p></li><li><p>A deal can have its own stage, value, owner, and follow-up work.</p></li><li><p>Contacts can stay attached to the company even when a specific deal is closed.</p></li></ul><h2>Start from companies, contacts, or deals</h2><p>Different teams think about customer work from different angles. A sales team may start from deals. A founder-led team may start from companies. A support-heavy team may start from contacts and conversations.</p><p>Open a company and you can see the contacts and deals that reference it. Open a deal and you can see the company, the primary contact, and the related work. Open a contact and you can connect them back to the company and the sales conversation they belong to.</p><h2>Related items make rows feel less flat</h2><p>A database row is useful for structured fields, but a customer relationship is more than fields. It has emails, tasks, meetings, docs, and history.</p><p>In the CRM template, deal rows can connect to related Aamu items:</p><ul><li><p><strong>Tasks</strong> for follow-ups, reminders, research, proposals, and handoffs.</p></li><li><p><strong>Emails</strong> for real customer conversations.</p></li><li><p><strong>Meetings</strong> for calls, demos, onboarding sessions, and check-ins.</p></li><li><p><strong>Docs</strong> for proposals, notes, account plans, onboarding docs, or implementation details.</p></li></ul><h2>Activity timeline gives the CRM memory</h2><p>Small CRMs often fail quietly because nobody trusts whether the row is current. A stage might say "Proposal", but was that changed today, last month, or before the last customer call?</p><p>Aamu database rows now have an activity timeline. When a field changes, Aamu records what changed, who changed it, and when. That can be shown as a readable timeline from the row details.</p><p>For CRM use, this is especially useful for:</p><ul><li><p>stage changes, such as "Qualified" to "Proposal";</p></li><li><p>owner changes when responsibility moves to another teammate;</p></li><li><p>task, email, meeting, and doc links being added;</p></li><li><p>reference changes, such as choosing a different company or primary contact;</p></li><li><p>value, probability, and expected close date updates.</p></li></ul><p>The timeline records field changes without requiring a manually written changelog.</p><h2>Last activity helps with follow-up</h2><p>A CRM is only useful if it helps the team avoid losing momentum. One practical field is "last activity": when this company, contact, or deal was last touched.</p><p>In Aamu, this can be shown from database activity. Instead of maintaining a manual "last updated" note, the row can show the latest meaningful activity, such as a stage change, a linked task, or a related email being added.</p><p>That gives the team a simple review habit: sort or scan by last activity and look for deals that have gone quiet. For a small team, that can be more useful than a large sales dashboard.</p><h2>Next action is still a human decision</h2><p>CRM software often promises to tell the team what to do next. In practice, "next" is not always obvious from data alone. The right next action may depend on a customer promise, a product constraint, a pricing discussion, or a meeting that has not happened yet.</p><p>The Aamu template treats next action as something the team defines. A deal can have a next action field and a due date, but the strongest follow-up mechanism is usually a real task linked to the deal.</p><p>There is also a lighter database-level option. A timedate column can be configured with Column options set to <strong>Treat as <em>due date</em></strong>, and a User column can be configured as <strong>Treat as <em>assigned to</em></strong>. With those settings, the row itself can behave more like an actionable work item: it can appear for the assigned user as an upcoming or overdue infobox on the main page, and Aamu can create the related notifications.</p><p>That means a CRM row does not always need a separate task just to become visible in someone's daily flow. For lightweight follow-up, the deal row can carry its own owner and due date. For richer work, a linked task is still useful because it can have comments, attachments, reminders, and a more detailed workflow.</p><h2>A simple workflow</h2><p>A small team can use the template like this:</p><ol><li><p>Create or select the company.</p></li><li><p>Add the main contact and reference the company.</p></li><li><p>Create a deal and connect it to the company and primary contact.</p></li><li><p>Set the stage, owner, value, probability, and expected close date.</p></li><li><p>Use the row's assigned-to and due-date fields when the deal itself should show up as upcoming or overdue work.</p></li><li><p>Add the next follow-up as a task.</p></li><li><p>Attach relevant emails, meetings, or docs as the relationship develops.</p></li><li><p>Use the row details and activity timeline to understand what has happened recently.</p></li></ol><h2>Automate CRM updates through the API</h2><p>The CRM can also react to database changes. Aamu's Database automations API supports two useful triggers: <code>row_inserted</code> when a new row is created, and <code>row_updated</code> when a selected column changes to a selected value.</p><p>For example, a <code>row_updated</code> automation can create a handoff task when a deal's Stage column changes to <em>Won</em>. The task can take its title and body from columns in the deal row, assign selected project members, and map row values into task custom fields.</p><pre><code class="language-plaintext">POST /api/v1/databases/CRM_DATABASE_ID/automations
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "Create onboarding task for won deals",
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
      "pid": "YOUR_PROJECT_ID",
      "users": ["OWNER_USER_ID"],
      "dbFieldTitle": "DEAL_NAME_COLUMN_ID",
      "dbFieldBody": "NEXT_ACTION_COLUMN_ID"
    }
  ]
}</code></pre><p>The trigger value is the stored column value, which may differ from the label shown in the table. Use the database schema to get the table and column ids and the stored values for status choices.</p><p><code>row_inserted</code> is useful earlier in the CRM flow. It can create a qualification task whenever a new deal or contact is added, whether the row comes from the Aamu UI, a published Form, an authenticated Form submission, or a GraphQL mutation.</p><pre><code class="language-plaintext">{
  "name": "Qualify new deals",
  "status": "public",
  "trigger": {
    "type": "row_inserted",
    "tableId": "DEALS_TABLE_ID"
  },
  "actions": [
    {
      "type": "create_task",
      "pid": "YOUR_PROJECT_ID",
      "users": ["SALES_OWNER_USER_ID"],
      "dbFieldTitle": "DEAL_NAME_COLUMN_ID",
      "dbFieldBody": "NOTES_COLUMN_ID"
    }
  ]
}</code></pre><p>The same API can list, inspect, update, and delete automation definitions:</p><pre><code class="language-plaintext">GET    /api/v1/databases/CRM_DATABASE_ID/automations
GET    /api/v1/automations/AUTOMATION_ID
PATCH  /api/v1/automations/AUTOMATION_ID
DELETE /api/v1/automations/AUTOMATION_ID</code></pre><p>Automation management uses the separate Automations API-key scope. A task action also needs Tasks write access to its target project; an email action needs Emails write access and an existing automation email template. Database rows themselves can be inserted and updated through Aamu's GraphQL API, and those mutations run the same automation triggers as changes made in the workspace.</p><p>The template covers a small-team CRM workflow. Check its limits against your sales process before adopting it.</p><p>If a team needs advanced territory management, complex sales forecasting, quoting, commission logic, deep marketing attribution, or a large marketplace of sales integrations, a dedicated CRM may still be the right tool.</p><h2>Related articles</h2><ul><li><a href="/blog/posts/from-form-submission-to-follow-up-workflows-with-aamuapp/">From form submission to follow-up: workflows with Aamu.app</a></li><li><a href="/blog/posts/building-with-the-aamu-api-from-tasks-to-docs-and-graphql/">Building with the Aamu API: From Tasks to Docs and GraphQL</a></li><li><a href="/blog/posts/aamuapp-databases-practical-feature-guide/">Aamu.app Databases: a practical feature guide</a></li><li><a href="/blog/posts/aamuapp-emails-feature-overview/">Aamu.app Emails - feature overview</a></li><li><a href="/blog/posts/database-automations-with-aamuapp/">Database automations with Aamu.app</a></li></ul>