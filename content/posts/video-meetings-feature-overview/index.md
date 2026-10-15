---
author: "Ilkka Huotari"
authorPage: "/blog/authors/ilkka-huotari/"
authorTitle: "Founder"
authorBio: "Hey, dear reader!\n\nI created Aamu.app. \n\nWhy? A few reasons. The main reason was that there didn't seem to be a good option for this kind of an app. The main one, Microsoft's offering, was (and is) a big mess. So, I thought it wouldn't be very difficult to create a better one. \n\nWell, it turned out to be a big job. Who would have known? Luckily AI came along and now the whole thing is about ready. \n\nI'm quite pleased with my creation. I have learned a lot, and still do. That has probably been the most rewarding thing from building this.\n\nThanks for reading!"
authorImage: "profile.png"
title: "Video Meetings - feature overview"
date: "2025-06-08T06:00:00.000Z"
modified: "2026-10-15T09:53:45.985Z"
description: "An overview of Aamu.app video meetings, including project meetings, invitees, reminders, comments, Event Booking, and the Meetings API."
cover:
  image: 8d7b7886b7e0ca5b_aamuapp-video-meetings.png
  relative: true

tags: ["meetings", "scheduling", "api"]
directAnswer: "An overview of Aamu.app video meetings, including project meetings, invitees, reminders, comments, Event Booking, and the Meetings API."
contentType: "how-to"
audience: "developers and technical teams"



ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p><strong>Short answer:</strong> An overview of Aamu.app video meetings, including project meetings, invitees, reminders, comments, Event Booking, and the Meetings API.</p>
<p>Aamu Meetings combines video calls with project membership, guest invitations, agendas and comments. Video calls use LiveKit.</p><h2>Meetings belong to projects</h2><p>Meetings are project-scoped. You can view meetings in one project, or use the all-projects view when you want to scan across the team.</p><p>The Meetings list is split into two practical tabs:</p><ul><li><p><strong>Upcoming</strong> for meetings that are still ahead.</p></li><li><p><strong>Past</strong> for meetings that have been archived or are no longer active.</p></li></ul><p>Each meeting card shows the meeting name, project, start time, comments, tags, invited people, guests, and who is currently in the meeting when participants are present.</p><h2>Create a meeting</h2><p>Start from the Meetings section and create a new meeting in the right project. A new meeting starts as a draft. Give it a name, then proceed to create the meeting.</p><p>After the meeting exists, set the start time. Aamu shows the start time in the user's local timezone and can show friendly relative timing, such as when the meeting starts.</p><p>A meeting can also have a rich-text description. Use it for agenda, preparation notes, links, or the context participants should read before joining.</p><h2>Invite team members and guests</h2><p>You can invite people from your Aamu team, and you can also invite guests by email address. This makes Meetings useful for both internal calls and external customer calls.</p><p>Invited Aamu users appear as normal workspace users. Email invitees appear as guests. Admins can remove invitees when needed.</p><p>When invitees are added, Aamu can send meeting notifications by email. You can also send notifications manually from the meeting page.</p><h2>Start-time notifications</h2><p>If the meeting has a start time, admins can configure email notifications before the meeting starts. For example, a meeting can notify invitees a chosen number of minutes before the start time.</p><h2>Join the meeting</h2><p>Invited users can join from the meeting page. Aamu creates the join route for the meeting and handles access through meeting tokens.</p><ol><li><p>Open the meeting in Aamu.</p></li><li><p>Check the time, description, and invitees.</p></li><li><p>Click <strong>Join the meeting</strong> when it is time.</p></li></ol><p>The meeting page can also show who is currently in the meeting, including team users and guest email participants.</p><h2>Comments and meeting notes</h2><p>A meeting has comments, just like other collaborative Aamu items. This is useful for agenda discussion, follow-up notes, decisions, or links that should stay connected to the meeting.</p><p>Use the description for stable meeting context and the comments for discussion around it. If the meeting creates follow-up work, turn that work into tasks instead of leaving everything in the comment thread.</p><h2>Tags and search</h2><p>Meetings can have tags, and Meetings are searchable. This matters when meetings become part of a long-running project history.</p><p>For example, you can tag meetings by customer, topic, sprint, sales stage, incident, or project phase. Later, search and tags help find the right meeting without remembering the exact date.</p><h2>Archive past meetings</h2><p>Meetings can be archived into the past view. This keeps the upcoming list focused while preserving meeting history.</p><p>Archived meetings can be unarchived when needed. This is useful if a meeting was archived too early or needs to be reused.</p><h2>Event Booking can create video meetings</h2><p>Aamu Event Booking can use an Aamu video meeting as the booking location. When a booking is created with Aamu video selected, Aamu can create the related meeting, invite the right people, and send confirmation/reminder email for the booked call.</p><h2>AI can help create meetings</h2><p>Aamu AI can use the meeting description and related workspace context to help prepare an agenda or follow-up tasks.</p><p>For example, a support conversation or project discussion can become a proposed meeting with a title, description, and time, then Aamu opens the created meeting.</p><h2>Meetings API</h2><p>Aamu exposes Meetings through the Team API for integrations that need to list, create, read, or reschedule project meetings.</p><pre><code class="language-plaintext">GET   /api/v1/meetings/
POST  /api/v1/meetings/
GET   /api/v1/meetings/MEETING_ID
PATCH /api/v1/meetings/MEETING_ID</code></pre><p>Send <code>x-api-key</code> and <code>x-project-id</code>. Write calls can set <code>x-aamu-actor</code>. Use Meetings read permission for list/get and Meetings write permission for create/update.</p><pre><code class="language-plaintext">POST /api/v1/meetings/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "Customer onboarding call",
  "html": "&lt;p&gt;Review goals and agree on next steps.&lt;/p&gt;",
  "start_time": 1781863200000,
  "end_time": 1781866800000,
  "invitee_emails": ["customer@example.com"]
}</code></pre><p>The API can update a meeting’s name, HTML description, start and end times, and invitees through <code>invitee_emails</code> and <code>remove_invitee_emails</code>.</p><h2>When Meetings works best</h2><p>Aamu Meetings is most useful when the meeting is part of the work, not separate from it. Use it for:</p><ul><li><p>customer calls connected to Helpdesk or Emails,</p></li><li><p>project planning and review meetings,</p></li><li><p>booked calls from Event Booking,</p></li><li><p>implementation or onboarding sessions,</p></li><li><p>internal discussions that create tasks or docs, and</p></li><li><p>API-created meetings from another workflow.</p></li></ul><h2>Related articles</h2><ul><li><a href="/blog/posts/aamuapp-as-a-calendly-alternative/">Aamu.app as a Calendly alternative</a></li><li><a href="/blog/posts/aamuapp-tasks-feature-overview/">Aamu.app Tasks - feature overview</a></li><li><a href="/blog/posts/ai-commands-in-aamuapp-turning-comments-into-workspace-actions/">AI commands in Aamu.app: turning comments into workspace actions</a></li><li><a href="/blog/posts/aamuapp-docs-feature-overview/">Aamu.app Docs - feature overview</a></li><li><a href="/blog/posts/aamuapp-emails-feature-overview/">Aamu.app Emails - feature overview</a></li></ul>