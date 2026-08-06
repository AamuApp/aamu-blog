---
author: "Ilkka Huotari"
authorPage: "/blog/authors/ilkka-huotari/"
authorTitle: "Founder"
authorBio: "Hey, dear reader!\n\nI created Aamu.app. \n\nWhy? A few reasons. The main reason was that there didn't seem to be a good option for this kind of an app. The main one, Microsoft's offering, was (and is) a big mess. So, I thought it wouldn't be very difficult to create a better one. \n\nWell, it turned out to be a big job. Who would have known? Luckily AI came along and now the whole thing is about ready. \n\nI'm quite pleased with my creation. I have learned a lot, and still do. That has probably been the most rewarding thing from building this.\n\nThanks for reading!"
authorImage: "profile.png"
title: "Report on user activity with the Aamu API"
date: "2026-08-06T01:00:00.000Z"
modified: "2026-08-06T01:29:14.027Z"
description: "Use the Aamu Reports API to measure active days, comments and Git activity, build day/week/month time series, and retrieve a user’s event timeline by local calendar day."
cover:
  image: 28d18c9b5da240b8_User activity API.png
  relative: true

tags: ["api", "reports", "analytics", "activity", "git"]
directAnswer: "The Aamu Reports API returns project-scoped user activity totals, day/week/month time series, and cursor-paginated event timelines. Active days include all matching activity types rather than comments alone."
contentType: "how-to"
audience: "developers and technical teams"
faq: [{"question":"What counts as an active day in the Aamu Reports API?","answer":"An active day is a local calendar day on which the user generated at least one matching activity event, including supported task, comment, Git, document, meeting, file, Helpdesk, or database activity."},{"question":"Which timezone does an Aamu activity report use?","answer":"The timezone query parameter accepts an IANA timezone and controls calendar-day and interval boundaries. It defaults to UTC."},{"question":"Can the activity endpoint return comment contents?","answer":"No. Reporting events contain safe metadata such as event type, item identity, timestamps, and limited context; private comment bodies and database cell values are not copied into the reporting store."},{"question":"Does the Aamu Reports API include activity from before event collection was enabled?","answer":"Not necessarily. The data_coverage object reports the first available event timestamp and whether historical backfill is complete."}]


ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p><strong>Short answer:</strong> The Aamu Reports API returns project-scoped user activity totals, day/week/month time series, and cursor-paginated event timelines. Active days include all matching activity types rather than comments alone.</p>
<p>Activity reporting sounds simple until “active” needs a precise meaning. Counting comments alone misses commits, task changes, documents, meetings, files, support work, and database edits. Counting only current records loses the sequence of actions that produced the current state.</p><p>Aamu.app addresses this with project-scoped user report endpoints backed by normalized activity events. You can request compact totals and time series for dashboards, or retrieve the underlying safe event metadata grouped by the user’s local calendar day.</p><h2>What the reporting API answers</h2><p>The reporting API is designed for questions such as:</p><ul><li><p>How many days was each project member active during a period?</p></li><li><p>How many actions, comments, commits, branches, and pull request changes did they make?</p></li><li><p>Which items did a user work with on a particular day?</p></li><li><p>How does activity change by day, week, or month?</p></li><li><p>Can an integration build its own project dashboard without scraping the Aamu UI?</p></li></ul><p>An active day is not a comment-specific metric. It is a calendar day on which the user generated at least one matching activity event. That event may come from Tasks, Docs, Git, Helpdesk, meetings, files, databases, comments, or another supported project feature.</p><h2>Create a Reports API key</h2><p>Create a Team API key with <strong>Reports</strong> read access for the project. Report requests use the same project headers as the other Aamu REST APIs:</p><pre><code class="language-plaintext">x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p>A Reports key does not need write access. The underlying activity-event collection is server-owned; integrations read the reporting representation instead of writing reporting events themselves.</p><h2>Choose the reporting range</h2><p><code>from</code> is inclusive and <code>to</code> is exclusive. Both accept ISO 8601 values. When omitted, the API returns the latest 30 days up to the current time. One request can cover at most 366 days.</p><p><code>timezone</code> is an IANA timezone such as <code>Europe/Helsinki</code>. It determines where calendar days begin and how interval boundaries are calculated. <code>interval</code> can be <code>day</code>, <code>week</code>, or <code>month</code>.</p><pre><code class="language-plaintext">from=2026-07-01
to=2026-08-01
timezone=Europe/Helsinki
interval=week</code></pre><p>This distinction matters around midnight and daylight-saving changes. The timestamps identify the range; the timezone defines the calendar used to group it.</p><h2>Get a report for all project users</h2><pre><code class="language-bash">curl "https://YOUR_AAMU_HOST/api/v1/reports/users/?from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;interval=week" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-project-id: YOUR_PROJECT_ID"</code></pre><p>The response contains project totals, one value map per user, and continuous intervals. Empty intervals are included with zero values, which makes the result convenient for charts without a separate gap-filling step.</p><pre><code class="language-json">{
  "report": {
    "project": { "id": "YOUR_PROJECT_ID" },
    "range": {
      "from": "2026-07-01T00:00:00.000+03:00",
      "to": "2026-08-01T00:00:00.000+03:00",
      "timezone": "Europe/Helsinki",
      "interval": "week"
    },
    "metrics": [
      "activity.events",
      "activity.active_days",
      "comments.created",
      "git.commits"
    ],
    "totals": {
      "activity.events": 184,
      "activity.active_days": 22,
      "comments.created": 41,
      "git.commits": 36
    },
    "users": [
      {
        "user": {
          "id": "USER_ID",
          "username": "ada",
          "name": "Ada Lovelace",
          "email": "ada@example.com"
        },
        "values": {
          "activity.events": 67,
          "activity.active_days": 14,
          "comments.created": 18,
          "git.commits": 21
        }
      }
    ],
    "intervals": [
      {
		"from": "2026-07-01T00:00:00.000+03:00",
        "to": "2026-07-06T00:00:00.000+03:00",
        "totals": {
          "activity.events": 29,
          "activity.active_days": 5,
          "comments.created": 7,
          "git.commits": 8
        },
        "users": [
          {
            "user_id": "USER_ID",
            "values": {
              "activity.events": 12,
              "activity.active_days": 4,
              "comments.created": 3,
              "git.commits": 4
            }
          }
        ]
      }
    ],
    "data_coverage": {
      "activity_events_available_from": "2026-06-15T09:00:00.000+03:00",
      "historical_backfill_complete": false
    }
  }
}</code></pre><p>Because the requested range starts in the middle of a calendar week, the first returned interval is clipped: it begins at <code>2026-07-01</code> and ends at the next Monday boundary. Clients should use the interval boundaries returned by the API.</p><h2>Select users and metrics</h2><p>Use <code>users</code> with comma-separated user ids or usernames to limit the project report. Use <code>metrics</code> to request only the values the client needs:</p><pre><code class="language-bash">curl "https://YOUR_AAMU_HOST/api/v1/reports/users/?users=ada,grace&amp;metrics=activity.events,activity.active_days,comments.created,git.commits&amp;from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;interval=day" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-project-id: YOUR_PROJECT_ID"</code></pre><p>The first reporting version supports these metrics:</p><ul><li><p><code>activity.events</code> — all matching activity events.</p></li><li><p><code>activity.active_days</code> — distinct local calendar days with activity.</p></li><li><p><code>activity.distinct_items</code> — distinct item type and item id pairs touched.</p></li><li><p><code>comments.created</code> — comments created across supported item types.</p></li><li><p><code>git.commits</code> and <code>git.branches_created</code>.</p></li><li><p><code>git.pull_requests_created</code>, <code>git.pull_requests_merged</code>, <code>git.pull_requests_closed</code>, and <code>git.pull_requests_reopened</code>.</p></li></ul><p>Project totals are calculated as project-wide distinct values where appropriate. For example, project active days are not produced by adding every user’s active-day count, because several people can be active on the same date.</p><h2>Get one user’s report</h2><p>Use a username or user id in the path:</p><pre><code class="language-bash">curl "https://YOUR_AAMU_HOST/api/v1/reports/users/ada?from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;interval=month" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-project-id: YOUR_PROJECT_ID"</code></pre><p>The one-user endpoint returns the same range and metric definitions, but exposes one <code>user</code>, one <code>values</code> object, and interval values without repeating a project user list.</p><h2>List what a user did on each day</h2><p>Totals are useful for dashboards, but they do not explain the work behind a number. The activity endpoint returns safe event metadata grouped by the user’s local calendar date:</p><pre><code class="language-bash">curl "https://YOUR_AAMU_HOST/api/v1/reports/users/ada/activity?from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;limit=100" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-project-id: YOUR_PROJECT_ID"</code></pre><pre><code class="language-json">{
  "activity": {
    "user": {
      "id": "USER_ID",
      "username": "ada",
      "name": "Ada Lovelace",
      "email": "ada@example.com"
    },
    "project": { "id": "YOUR_PROJECT_ID" },
    "range": {
      "from": "2026-07-01T00:00:00.000+03:00",
      "to": "2026-08-01T00:00:00.000+03:00",
      "timezone": "Europe/Helsinki",
      "interval": "day"
    },
    "summary": {
      "active_days": 14,
      "event_count": 67
    },
    "days": [
      {
        "date": "2026-07-31",
        "events": [
          {
            "id": "ACTIVITY_EVENT_ID",
            "type": "git.commit.created",
            "category": "git",
            "action": "commit_created",
            "actor_id": "USER_ID",
            "occurred_at": "2026-07-31T12:42:10.000Z",
            "item": {
			  "type": "git_commit",
			  "id": "COMMIT_SHA",
              "title": "Improve report export"
            },
            "source": "gitea",
            "context": {
              "commit": {
                "sha": "17a41d2",
                "message": "Add report export"
              }
            }
          }
        ]
      }
    ],
    "pagination": {
      "limit": 100,
      "next_cursor": "OPAQUE_CURSOR"
    }
  }
}</code></pre><p>The API deliberately returns event metadata rather than private comment bodies or database cell values. A comment event can identify the comment and its parent item without copying the comment text into the reporting store.</p><h2>Filter the activity stream</h2><p><code>categories</code> filters broad groups such as <code>git</code>, <code>comments</code>, <code>tasks</code>, <code>docs</code>, <code>helpdesk</code>, <code>meetings</code>, and <code>databases</code>. <code>types</code> filters exact event names such as <code>task.comment.created</code> or <code>git.pull_request.merged</code>.</p><pre><code class="language-bash">curl "https://YOUR_AAMU_HOST/api/v1/reports/users/ada/activity?categories=git,comments&amp;types=git.commit.created,task.comment.created&amp;from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-project-id: YOUR_PROJECT_ID"</code></pre><p>The summary respects the same range and filters. It describes the complete matching result, not only the current page.</p><h2>Use cursor pagination</h2><p>Activity is ordered from newest to oldest. A page contains at most 100 events by default, and <code>limit</code> can be between 1 and 500. When <code>next_cursor</code> is not null, pass it unchanged in the next request:</p><pre><code class="language-plaintext">GET /api/v1/reports/users/ada/activity?from=2026-07-01&amp;to=2026-08-01&amp;cursor=OPAQUE_CURSOR</code></pre><p>Treat the cursor as opaque. It represents the last event position and avoids the duplicate-or-missing-event problems that page numbers can create while new events are arriving.</p><h2>Understand data coverage</h2><p>Activity events are collected when actions happen. They are not reconstructed from the current state of a task, ticket, document, or repository. This preserves who did what and when, but it also means the first version does not invent complete history from records that existed before activity-event collection was enabled.</p><p>Check <code>data_coverage.activity_events_available_from</code> before comparing old periods. While <code>historical_backfill_complete</code> is <code>false</code>, a zero before the available-from timestamp means “not collected,” not necessarily “no activity.”</p><h2>Build useful reports without reducing people to one score</h2><p>The API provides facts and timelines, not a universal productivity score. A commit, a customer reply, a planning comment, and a document edit are different kinds of work. Their value depends on the project and cannot be inferred reliably by adding them together.</p><p>A useful report therefore combines several views: active days for continuity, event categories for the shape of work, item-level activity for context, and the underlying project outcomes. The Aamu reporting API supplies the activity layer while leaving the interpretation visible to the team building the dashboard.</p><p>For authentication, user lookup, and the rest of the API surface, see <a target="_blank" rel="noopener noreferrer nofollow" href="/blog/posts/building-with-the-aamu-api-from-tasks-to-docs-and-graphql/">Building with the Aamu API: From Tasks to Docs and GraphQL</a>.</p><h2>Frequently asked questions</h2><h3>What counts as an active day in the Aamu Reports API?</h3><p>An active day is a local calendar day on which the user generated at least one matching activity event, including supported task, comment, Git, document, meeting, file, Helpdesk, or database activity.</p><h3>Which timezone does an Aamu activity report use?</h3><p>The timezone query parameter accepts an IANA timezone and controls calendar-day and interval boundaries. It defaults to UTC.</p><h3>Can the activity endpoint return comment contents?</h3><p>No. Reporting events contain safe metadata such as event type, item identity, timestamps, and limited context; private comment bodies and database cell values are not copied into the reporting store.</p><h3>Does the Aamu Reports API include activity from before event collection was enabled?</h3><p>Not necessarily. The data_coverage object reports the first available event timestamp and whether historical backfill is complete.</p><h2>Related articles</h2><ul><li><a href="/blog/posts/building-with-the-aamu-api-from-tasks-to-docs-and-graphql/">Building with the Aamu API: From Tasks to Docs and GraphQL</a></li><li><a href="/blog/posts/outbound-webhooks-in-aamuapp-real-time-events-tasks-helpdesk-email/">Outbound webhooks in Aamu.app: real-time events for tasks, Helpdesk, email, and more</a></li><li><a href="/blog/posts/git-belongs-in-the-workspace-code-issues-comments-team-awareness-aamuapp/">Git belongs in the workspace: code, issues, comments, and team awareness in Aamu.app</a></li></ul>