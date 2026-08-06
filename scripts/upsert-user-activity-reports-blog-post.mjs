import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';
const AUTHOR_ID = '29940627-51e8-4fd0-82ab-d718ddfe802f';
const API_POST_SLUG = 'building-with-the-aamu-api-from-tasks-to-docs-and-graphql';

const title = 'Report on user activity with the Aamu API';
const slug = 'report-on-user-activity-with-the-aamu-api';

const html = String.raw`<p>Activity reporting sounds simple until “active” needs a precise meaning. Counting comments alone misses commits, task changes, documents, meetings, files, support work, and database edits. Counting only current records loses the sequence of actions that produced the current state.</p>
<p>Aamu.app addresses this with project-scoped user report endpoints backed by normalized activity events. You can request compact totals and time series for dashboards, or retrieve the underlying safe event metadata grouped by the user’s local calendar day.</p>

<h2>What the reporting API answers</h2>
<p>The reporting API is designed for questions such as:</p>
<ul>
<li><p>How many days was each project member active during a period?</p></li>
<li><p>How many actions, comments, commits, branches, and pull request changes did they make?</p></li>
<li><p>Which items did a user work with on a particular day?</p></li>
<li><p>How does activity change by day, week, or month?</p></li>
<li><p>Can an integration build its own project dashboard without scraping the Aamu UI?</p></li>
</ul>
<p>An active day is not a comment-specific metric. It is a calendar day on which the user generated at least one matching activity event. That event may come from Tasks, Docs, Git, Helpdesk, meetings, files, databases, comments, or another supported project feature.</p>

<h2>Create a Reports API key</h2>
<p>Create a Team API key with <strong>Reports</strong> read access for the project. Report requests use the same project headers as the other Aamu REST APIs:</p>
<pre><code class="language-plaintext">x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre>
<p>A Reports key does not need write access. The underlying activity-event collection is server-owned; integrations read the reporting representation instead of writing reporting events themselves.</p>

<h2>Choose the reporting range</h2>
<p><code>from</code> is inclusive and <code>to</code> is exclusive. Both accept ISO 8601 values. When omitted, the API returns the latest 30 days up to the current time. One request can cover at most 366 days.</p>
<p><code>timezone</code> is an IANA timezone such as <code>Europe/Helsinki</code>. It determines where calendar days begin and how interval boundaries are calculated. <code>interval</code> can be <code>day</code>, <code>week</code>, or <code>month</code>.</p>
<pre><code class="language-plaintext">from=2026-07-01
to=2026-08-01
timezone=Europe/Helsinki
interval=week</code></pre>
<p>This distinction matters around midnight and daylight-saving changes. The timestamps identify the range; the timezone defines the calendar used to group it.</p>

<h2>Get a report for all project users</h2>
<pre><code class="language-bash">curl "https://YOUR_AAMU_HOST/api/v1/reports/users/?from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;interval=week" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-project-id: YOUR_PROJECT_ID"</code></pre>
<p>The response contains project totals, one value map per user, and continuous intervals. Empty intervals are included with zero values, which makes the result convenient for charts without a separate gap-filling step.</p>
<pre><code class="language-json">{
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
}</code></pre>
<p>Because the requested range starts in the middle of a calendar week, the first returned interval is clipped: it begins at <code>2026-07-01</code> and ends at the next Monday boundary. Clients should use the interval boundaries returned by the API.</p>

<h2>Select users and metrics</h2>
<p>Use <code>users</code> with comma-separated user ids or usernames to limit the project report. Use <code>metrics</code> to request only the values the client needs:</p>
<pre><code class="language-bash">curl "https://YOUR_AAMU_HOST/api/v1/reports/users/?users=ada,grace&amp;metrics=activity.events,activity.active_days,comments.created,git.commits&amp;from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;interval=day" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-project-id: YOUR_PROJECT_ID"</code></pre>
<p>The first reporting version supports these metrics:</p>
<ul>
<li><p><code>activity.events</code> — all matching activity events.</p></li>
<li><p><code>activity.active_days</code> — distinct local calendar days with activity.</p></li>
<li><p><code>activity.distinct_items</code> — distinct item type and item id pairs touched.</p></li>
<li><p><code>comments.created</code> — comments created across supported item types.</p></li>
<li><p><code>git.commits</code> and <code>git.branches_created</code>.</p></li>
<li><p><code>git.pull_requests_created</code>, <code>git.pull_requests_merged</code>, <code>git.pull_requests_closed</code>, and <code>git.pull_requests_reopened</code>.</p></li>
</ul>
<p>Project totals are calculated as project-wide distinct values where appropriate. For example, project active days are not produced by adding every user’s active-day count, because several people can be active on the same date.</p>

<h2>Get one user’s report</h2>
<p>Use a username or user id in the path:</p>
<pre><code class="language-bash">curl "https://YOUR_AAMU_HOST/api/v1/reports/users/ada?from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;interval=month" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-project-id: YOUR_PROJECT_ID"</code></pre>
<p>The one-user endpoint returns the same range and metric definitions, but exposes one <code>user</code>, one <code>values</code> object, and interval values without repeating a project user list.</p>

<h2>List what a user did on each day</h2>
<p>Totals are useful for dashboards, but they do not explain the work behind a number. The activity endpoint returns safe event metadata grouped by the user’s local calendar date:</p>
<pre><code class="language-bash">curl "https://YOUR_AAMU_HOST/api/v1/reports/users/ada/activity?from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;limit=100" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-project-id: YOUR_PROJECT_ID"</code></pre>
<pre><code class="language-json">{
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
}</code></pre>
<p>The API deliberately returns event metadata rather than private comment bodies or database cell values. A comment event can identify the comment and its parent item without copying the comment text into the reporting store.</p>

<h2>Filter the activity stream</h2>
<p><code>categories</code> filters broad groups such as <code>git</code>, <code>comments</code>, <code>tasks</code>, <code>docs</code>, <code>helpdesk</code>, <code>meetings</code>, and <code>databases</code>. <code>types</code> filters exact event names such as <code>task.comment.created</code> or <code>git.pull_request.merged</code>.</p>
<pre><code class="language-bash">curl "https://YOUR_AAMU_HOST/api/v1/reports/users/ada/activity?categories=git,comments&amp;types=git.commit.created,task.comment.created&amp;from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-project-id: YOUR_PROJECT_ID"</code></pre>
<p>The summary respects the same range and filters. It describes the complete matching result, not only the current page.</p>

<h2>Use cursor pagination</h2>
<p>Activity is ordered from newest to oldest. A page contains at most 100 events by default, and <code>limit</code> can be between 1 and 500. When <code>next_cursor</code> is not null, pass it unchanged in the next request:</p>
<pre><code class="language-plaintext">GET /api/v1/reports/users/ada/activity?from=2026-07-01&amp;to=2026-08-01&amp;cursor=OPAQUE_CURSOR</code></pre>
<p>Treat the cursor as opaque. It represents the last event position and avoids the duplicate-or-missing-event problems that page numbers can create while new events are arriving.</p>

<h2>Understand data coverage</h2>
<p>Activity events are collected when actions happen. They are not reconstructed from the current state of a task, ticket, document, or repository. This preserves who did what and when, but it also means the first version does not invent complete history from records that existed before activity-event collection was enabled.</p>
<p>Check <code>data_coverage.activity_events_available_from</code> before comparing old periods. While <code>historical_backfill_complete</code> is <code>false</code>, a zero before the available-from timestamp means “not collected,” not necessarily “no activity.”</p>

<h2>Build useful reports without reducing people to one score</h2>
<p>The API provides facts and timelines, not a universal productivity score. A commit, a customer reply, a planning comment, and a document edit are different kinds of work. Their value depends on the project and cannot be inferred reliably by adding them together.</p>
<p>A useful report therefore combines several views: active days for continuity, event categories for the shape of work, item-level activity for context, and the underlying project outcomes. The Aamu reporting API supplies the activity layer while leaving the interpretation visible to the team building the dashboard.</p>
<p>For authentication, user lookup, and the rest of the API surface, see <a href="/blog/posts/building-with-the-aamu-api-from-tasks-to-docs-and-graphql/">Building with the Aamu API: From Tasks to Docs and GraphQL</a>.</p>`;

const post = {
	title,
	slug,
	description: 'Use the Aamu Reports API to measure active days, comments and Git activity, build day/week/month time series, and retrieve a user’s event timeline by local calendar day.',
	directAnswer: 'The Aamu Reports API returns project-scoped user activity totals, day/week/month time series, and cursor-paginated event timelines. Active days include all matching activity types rather than comments alone.',
	contentType: 'how-to',
	audience: 'developers and technical teams',
	faq: JSON.stringify([
		{
			question: 'What counts as an active day in the Aamu Reports API?',
			answer: 'An active day is a local calendar day on which the user generated at least one matching activity event, including supported task, comment, Git, document, meeting, file, Helpdesk, or database activity.'
		},
		{
			question: 'Which timezone does an Aamu activity report use?',
			answer: 'The timezone query parameter accepts an IANA timezone and controls calendar-day and interval boundaries. It defaults to UTC.'
		},
		{
			question: 'Can the activity endpoint return comment contents?',
			answer: 'No. Reporting events contain safe metadata such as event type, item identity, timestamps, and limited context; private comment bodies and database cell values are not copied into the reporting store.'
		},
		{
			question: 'Does the Aamu Reports API include activity from before event collection was enabled?',
			answer: 'Not necessarily. The data_coverage object reports the first available event timestamp and whether historical backfill is complete.'
		}
	]),
	relatedPosts: JSON.stringify([
		API_POST_SLUG,
		'outbound-webhooks-in-aamuapp-real-time-events-tasks-helpdesk-email',
		'git-belongs-in-the-workspace-code-issues-comments-team-awareness-aamuapp'
	]),
	publishDate: '2026-08-06T01:00:00.000Z',
	author: AUTHOR_ID,
	status: 'published',
	tags: ['api', 'reports', 'analytics', 'activity', 'git']
};

const apiReportsSection = String.raw`<h2>User activity reports</h2><p>The Reports API provides project-scoped user activity totals, day/week/month time series, and event timelines grouped by local calendar day. Use a Team API key with <strong>Reports</strong> read scope and the normal <code>x-project-id</code> header.</p><p>An active day includes every matching activity type rather than comments alone. The event stream can contain activity from Tasks, Docs, Git, Helpdesk, meetings, files, databases, comments, and other supported project features.</p><h3>GET: report all project users</h3><pre><code class="language-plaintext">GET /api/v1/reports/users/?from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;interval=week
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre><p><code>from</code> is inclusive, <code>to</code> is exclusive, and the maximum range is 366 days. The timezone controls calendar-day boundaries. Supported intervals are <code>day</code>, <code>week</code>, and <code>month</code>. Use <code>users</code> with comma-separated ids or usernames and <code>metrics</code> to select only the required values.</p><p>The first metrics include total events, active days, distinct touched items, comments, commits, created branches, and created, merged, closed, or reopened pull requests. Project totals, per-user values, and continuous intervals are returned together.</p><h3>GET: report one user</h3><pre><code class="language-plaintext">GET /api/v1/reports/users/ada?from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;interval=day</code></pre><p>The path accepts a username or user id.</p><h3>GET: list a user’s activity by day</h3><pre><code class="language-plaintext">GET /api/v1/reports/users/ada/activity?from=2026-07-01&amp;to=2026-08-01&amp;timezone=Europe/Helsinki&amp;categories=git,comments&amp;limit=100</code></pre><p>The activity endpoint returns safe event metadata grouped by date. Filter with broad <code>categories</code> or exact event <code>types</code>, and continue with the opaque <code>next_cursor</code>. Its summary covers the complete filtered range rather than only the current page.</p><p>Activity history begins when normalized event collection is enabled. Check the response’s <code>data_coverage</code> object before comparing older periods; the API does not infer a complete event history from the current state of tasks, tickets, documents, or repositories.</p><p>For complete examples and metric definitions, see <a href="/blog/posts/report-on-user-activity-with-the-aamu-api/">Report on user activity with the Aamu API</a>.</p>`;

if (!API_KEY) throw new Error('API_KEY environment variable is required.');
if (!DB_ID) throw new Error('AAMU_DB_ID or DB_ID environment variable is required.');

async function requestJson(url, options) {
	const response = await fetch(url, options);
	const data = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(data?.error?.message || data?.message || `HTTP ${response.status}`);
	return data;
}

async function graphql(query, variables = {}) {
	const data = await requestJson(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': API_KEY,
			'x-db-id': DB_ID
		},
		body: JSON.stringify({ query, variables })
	});
	if (data?.errors?.length) throw new Error(data.errors.map(error => error.message).join('; '));
	return data.data;
}

function docsHeaders() {
	return {
		'Content-Type': 'application/json',
		'x-api-key': DOCS_API_KEY,
		'x-project-id': PROJECT_ID
	};
}

async function listBlogPosts() {
	const data = await graphql(`{
		BlogPostCollection {
			id
			title
			slug
			doc
			status
			publishDate
			description
			directAnswer
			contentType
			audience
			faq
			relatedPosts
			tags
			author { id }
		}
	}`);
	return data.BlogPostCollection || [];
}

async function getDoc(id) {
	const data = await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(id)}`, {
		headers: docsHeaders()
	});
	return data.doc || data;
}

async function upsertDocByTitle(docTitle, docHtml) {
	const headers = docsHeaders();
	const list = await requestJson(`${API_BASE_URL}/api/v1/docs/`, { headers });
	const existing = list.docs?.find(doc => doc.title === docTitle);
	const body = JSON.stringify({
		title: docTitle,
		status: 'public',
		html: docHtml,
		project_id: PROJECT_ID,
		pid: PROJECT_ID
	});

	if (existing) {
		const current = await getDoc(existing.id);
		if ((current.html || '').includes('Because the requested range starts in the middle of a calendar week')
			&& (current.html || '').includes('2026-06-15T09:00:00.000+03:00')
			&& (current.html || '').includes('Build useful reports without reducing people to one score')
			&& (current.html || '').includes('/api/v1/reports/users/ada/activity')
			&& current.status === 'public') {
			return { action: 'unchanged', doc: current };
		}
		const data = await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(existing.id)}`, {
			method: 'PATCH',
			headers,
			body
		});
		return { action: 'updated', doc: data.doc || existing };
	}

	const data = await requestJson(`${API_BASE_URL}/api/v1/docs/`, {
		method: 'POST',
		headers,
		body
	});
	return { action: 'created', doc: data.doc || data };
}

async function upsertBlogPost(posts, docId) {
	const existing = posts.find(row => row.slug === slug);
	const existingId = existing?.id;
	const unchanged = existing
		&& existing.title === post.title
		&& existing.description === post.description
		&& existing.directAnswer === post.directAnswer
		&& existing.contentType === post.contentType
		&& existing.audience === post.audience
		&& existing.faq === post.faq
		&& existing.relatedPosts === post.relatedPosts
		&& existing.publishDate === post.publishDate
		&& existing.author?.id === post.author
		&& existing.status === post.status
		&& existing.doc === docId
		&& JSON.stringify(existing.tags || []) === JSON.stringify(post.tags);
	if (unchanged) return { action: 'unchanged', post: existing };
	const data = await graphql(
		`mutation UpsertBlogPost(
			$id: ID
			$title: String
			$slug: String
			$description: String
			$directAnswer: String
			$contentType: String
			$audience: String
			$faq: String
			$relatedPosts: String
			$publishDate: DateTime
			$author: String
			$status: String
			$tags: [String]
			$doc: String
		) {
			BlogPost(
				id: $id
				title: $title
				slug: $slug
				description: $description
				directAnswer: $directAnswer
				contentType: $contentType
				audience: $audience
				faq: $faq
				relatedPosts: $relatedPosts
				publishDate: $publishDate
				author: $author
				status: $status
				tags: $tags
				doc: $doc
			) {
				id
				title
				slug
				status
				publishDate
				tags
				doc
			}
		}`,
		{ id: existingId, ...post, doc: docId }
	);
	return { action: existingId ? 'updated' : 'created', post: data.BlogPost };
}

function updateApiDocHtml(source) {
	if (source.includes('<h2>User activity reports</h2>')
		&& source.includes('/blog/posts/report-on-user-activity-with-the-aamu-api/')) return source;
	const headingMatch = /<h2[^>]*>User activity reports<\/h2>/.exec(source);
	const sectionStart = headingMatch?.index ?? -1;
	if (sectionStart >= 0) {
		const sectionEnd = source.indexOf('<h2', sectionStart + (headingMatch?.[0].length || 4));
		if (sectionEnd < 0) throw new Error('Could not find the end of the existing Reports section.');
		return `${source.slice(0, sectionStart)}${apiReportsSection}${source.slice(sectionEnd)}`;
	}

	const gitHeading = '<h2>Git</h2>';
	if (!source.includes(gitHeading)) throw new Error('Could not find the Git heading in the API Doc.');
	return source.replace(gitHeading, `${apiReportsSection}${gitHeading}`);
}

async function updateApiDoc(posts) {
	const apiRow = posts.find(row => row.slug === API_POST_SLUG);
	if (!apiRow?.id) throw new Error(`Could not find API blog row with slug ${API_POST_SLUG}.`);
	const docId = typeof apiRow.doc === 'string' ? apiRow.doc : apiRow.doc?.id;
	if (!docId) throw new Error('The API blog row does not reference a Doc.');

	const current = await getDoc(docId);
	if (current.title !== 'Building with the Aamu API: From Tasks to Docs and GraphQL') {
		throw new Error(`API Doc title did not match: ${current.title || '(missing)'}.`);
	}
	const updatedHtml = updateApiDocHtml(current.html || '');
	if (updatedHtml === current.html) return { action: 'unchanged', id: docId, rowId: apiRow.id };

	const data = await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(docId)}`, {
		method: 'PATCH',
		headers: docsHeaders(),
		body: JSON.stringify({ html: updatedHtml })
	});
	return { action: 'updated', id: (data.doc || data).id || docId, rowId: apiRow.id };
}

const posts = await listBlogPosts();
const apiDocResult = await updateApiDoc(posts);
const newDocResult = await upsertDocByTitle(title, html);
const newPostResult = await upsertBlogPost(posts, newDocResult.doc.id);

console.log(JSON.stringify({
	apiPost: { doc: apiDocResult },
	activityReportsPost: {
		doc: { action: newDocResult.action, id: newDocResult.doc.id },
		blogPost: newPostResult
	}
}, null, 2));
