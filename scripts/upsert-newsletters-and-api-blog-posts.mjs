import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';
const AUTHOR_ID = '29940627-51e8-4fd0-82ab-d718ddfe802f';

const newsletterPost = {
	title: 'Newsletters in Aamu.app: from subscribers to sending',
	slug: 'newsletters-in-aamuapp-from-subscribers-to-sending',
	description:
		'Create newsletters, manage subscribers, design reusable templates, send test messages, publish issues, and automate the workflow through the Aamu API.',
	publishDate: '2026-06-23T00:00:00.000Z',
	author: AUTHOR_ID,
	status: 'published',
	tags: ['newsletters', 'email', 'api', 'automations'],
};

const newsletterHtml = String.raw`<p xmlns="http://www.w3.org/1999/xhtml">Newsletters in Aamu.app bring the subscriber list, reusable email design, individual issues, sending, and automation into the same project workspace. A team can prepare a publication without moving contacts to one service, designing the message in another, and reconnecting the workflow through a collection of integrations.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Each newsletter is project-scoped. Its issues, subscribers, template, sender settings, and API access follow the same team and project boundaries as the rest of the work in Aamu.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">One place for the whole publishing workflow</h2>
<p xmlns="http://www.w3.org/1999/xhtml">A newsletter has four practical areas: <strong>Issues</strong>, <strong>Subscribers</strong>, <strong>Template</strong>, and <strong>Settings</strong>. Issues are the messages you prepare and send. Subscribers are the recipients and their subscription state. The template defines the reusable content structure and outer email design. Settings connect the newsletter to a verified sending domain and mailbox.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The newsletter name is edited directly where it is used. A new unnamed newsletter opens the name field automatically, and an existing name can be clicked to edit it. Sender details do not need to be duplicated: the visible sender name and email address come from the selected mailbox's <strong>Sender name</strong> and <strong>Address</strong>.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Subscribers remain explicit</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Subscribers can be added individually or imported from CSV. Each subscriber has a clear <code>subscribed</code> or <code>unsubscribed</code> status, so an address can be removed from active delivery without losing the history or contact record. An unsubscribed contact can also be subscribed again when there is a valid reason to do so.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Every delivered message receives a subscriber-specific unsubscribe URL on the team's own hostname:</p>
<pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">https://{team}.aamu.app/newsletter/unsubscribe/{subscriberId}/{token}</code></pre>
<p xmlns="http://www.w3.org/1999/xhtml">The public confirmation page keeps the result deliberately simple: the recipient sees that they have been unsubscribed and will no longer receive the newsletter.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Publish a signup form with Aamu Forms</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The <strong>Signup form</strong> tab creates a public, editable Aamu Form for the newsletter. The form starts with email and name fields, but it remains a normal Aamu Form: the team can edit its title, description, fields, visual theme, public URL, thank-you page, and custom CSS.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Publishing the signup form also creates its backing Database and a <code>row_inserted</code> automation. Each form response remains in the Database as submission and consent history. The automation then upserts the normalized email address into the newsletter's canonical subscriber list.</p>
<p xmlns="http://www.w3.org/1999/xhtml">This avoids making the Form Database a second delivery list. The Database records what was submitted and when; <code>newsletter_subscribers</code> remains the source of truth for whether an address currently receives the newsletter. Repeated submissions update the existing subscriber instead of creating duplicates.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">A reusable template with deliberate placeholders</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The content template defines the repeatable structure editors see when they create an issue. It contains one issue-content area and one unsubscribe element. This prevents an essential compliance link from becoming an afterthought in each new message.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The wrapper controls the surrounding email HTML. It contains exactly one <code>{{CONTENT}}</code> placeholder for the rendered issue and can use <code>{{SUBJECT}}</code> where the subject belongs. Keeping content and wrapper separate makes it possible to adjust the publication's shared visual frame without rewriting every issue.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Test the real message before sending</h2>
<p xmlns="http://www.w3.org/1999/xhtml">An issue starts as a draft with a subject and HTML content. The preview combines the issue with the current newsletter template and wrapper, so the editor can inspect the actual message structure before delivery.</p>
<p xmlns="http://www.w3.org/1999/xhtml"><strong>Send test</strong> uses the signed-in user's email when that address is an active subscriber. This is intentional: the test message gets the same subscriber-specific unsubscribe link as a production message. Testing therefore covers the link that recipients will really use, not a special placeholder URL that behaves differently.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Sending is explicit. <strong>Send test</strong> sends one test message; <strong>Send</strong> delivers a draft issue to active subscribers and marks it sent. While either operation is running, its button is disabled and shows <strong>Sending...</strong>, preventing accidental duplicate clicks.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Mailbox configuration stays in the UI</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Before messages can be sent, the newsletter needs a mailbox based on a verified email domain. Choose the domain, set the mailbox address, and set the sender name in Aamu. The newsletter then uses that mailbox consistently for test and production delivery.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Mailbox provisioning is intentionally not part of the Newsletter API. Domain verification and sender configuration remain an administrative UI step, while routine publication work can be automated after the mailbox is ready.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Automate newsletters through the API</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The project-scoped Newsletter API can list, create, and update newsletters; create the signup Form–Database–Automation workflow; create and edit draft issues; manage subscribers; send a test; and explicitly send a production issue. Requests use a Team API key with the Newsletters scope and the project header.</p>
<pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre>
<p xmlns="http://www.w3.org/1999/xhtml">A simple automated flow can create a newsletter issue from approved content, add or synchronize subscribers, send a test to the API actor, and leave production sending as a separate action. Subscriber API responses never expose unsubscribe tokens.</p>
<pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/newsletters/{newsletterId}/issues
{
  "subject": "June product update",
  "html": "&lt;p&gt;What changed this month...&lt;/p&gt;"
}

POST /api/v1/newsletters/{newsletterId}/issues/{issueId}/send-test
POST /api/v1/newsletters/{newsletterId}/issues/{issueId}/send</code></pre>
<p xmlns="http://www.w3.org/1999/xhtml">The signup workflow is created idempotently. The first request creates the resources; later requests return the same connected form and automation:</p>
<pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/newsletters/{newsletterId}/signup-form</code></pre>
<p xmlns="http://www.w3.org/1999/xhtml">The separate send endpoints matter for AI and other automations. Creating or revising a draft is reversible; delivering email to a list is an external side effect. Aamu keeps that boundary visible instead of treating every content update as permission to publish.</p>
<p xmlns="http://www.w3.org/1999/xhtml">For the complete endpoint overview, authentication model, and examples alongside the rest of the platform, see <a href="/blog/posts/building-with-the-aamu-api-from-tasks-to-docs-and-graphql/">Building with the Aamu API</a>.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">A newsletter that belongs to the workspace</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The useful part of Newsletters in Aamu is not merely sending an HTML email. It is keeping the publication close to the project that produces it: the Docs that contain source material, the tasks that coordinate a release, the database rows or forms that collect information, and the people responsible for reviewing the final message.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The result is a compact publishing workflow with explicit subscribers, reusable design, realistic testing, safe unsubscribe links, and an API that can automate the repetitive parts without hiding the moment when a message is actually sent.</p>`;

const apiPost = {
	id: 'c0dcb09a-33ad-44fb-8015-1f98c5cba9c4',
	docId: '252fb285-ecc8-43f2-889f-0671a7637bca',
	title: 'Building with the Aamu API: From Tasks to Docs and GraphQL',
	slug: 'building-with-the-aamu-api-from-tasks-to-docs-and-graphql',
	description:
		'A practical guide to the Aamu API for newsletters, tasks, docs, meetings, files, forms, database automations, GraphQL rows, and activity timelines.',
	publishDate: '2026-05-22T07:10:00.000Z',
	author: AUTHOR_ID,
	status: 'published',
	tags: ['api', 'newsletters', 'docs', 'tasks', 'graphql', 'databases', 'automations'],
};

const newsletterApiSection = String.raw`<h2 xmlns="http://www.w3.org/1999/xhtml">Newsletters</h2><p xmlns="http://www.w3.org/1999/xhtml">The Newsletters API manages project-scoped newsletters, signup forms, draft and sent issues, and subscribers. It also keeps test delivery and production delivery as explicit operations. Use the <strong>Newsletters</strong> read or write scope together with <code>x-project-id</code>.</p><p xmlns="http://www.w3.org/1999/xhtml">Mailbox setup is an administrative UI step: configure a verified email domain, Address, and Sender name before sending. The API handles the publication workflow after that mailbox exists.</p><h3 xmlns="http://www.w3.org/1999/xhtml">Create a newsletter</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/newsletters/
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "Product updates"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">List newsletters with <code>GET /api/v1/newsletters/</code>. Read or update one newsletter with <code>GET</code> or <code>PATCH /api/v1/newsletters/{id}</code>. A newsletter update can change its name, archive or reactivate it, and update the content template or wrapper HTML.</p><h3 xmlns="http://www.w3.org/1999/xhtml">Create a public signup workflow</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/newsletters/NEWSLETTER_ID/signup-form
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai</code></pre><p xmlns="http://www.w3.org/1999/xhtml">This idempotent endpoint creates a published Aamu Form, its backing Database table, and a published <code>row_inserted</code> automation with a <code>subscribe_to_newsletter</code> action. The response includes the form, Database and table ids, automation, and public form URL. The Database keeps form-response history while the newsletter subscriber collection remains the delivery source of truth.</p><h3 xmlns="http://www.w3.org/1999/xhtml">Create and update an issue</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/newsletters/NEWSLETTER_ID/issues
{
  "subject": "June product update",
  "html": "&lt;p&gt;What changed this month...&lt;/p&gt;"
}

PATCH /api/v1/newsletters/NEWSLETTER_ID/issues/ISSUE_ID
{
  "subject": "June product update — revised",
  "html": "&lt;p&gt;The reviewed version...&lt;/p&gt;"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Issues are listed at <code>GET /api/v1/newsletters/{id}/issues</code> and read individually at <code>GET /api/v1/newsletters/{id}/issues/{issueId}</code>. Only draft issues can be updated or sent.</p><h3 xmlns="http://www.w3.org/1999/xhtml">Manage subscribers</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/newsletters/NEWSLETTER_ID/subscribers
{
  "email": "reader@example.com",
  "name": "Ada Lovelace",
  "tags": ["customer"]
}

PATCH /api/v1/newsletters/NEWSLETTER_ID/subscribers/SUBSCRIBER_ID
{
  "status": "unsubscribed"
}</code></pre><p xmlns="http://www.w3.org/1999/xhtml">Use <code>GET /api/v1/newsletters/{id}/subscribers</code> to list subscribers. The optional <code>status</code> query filters the result. Subscriber updates can change the name, tags, or status between <code>subscribed</code> and <code>unsubscribed</code>. API responses never return the private unsubscribe token.</p><h3 xmlns="http://www.w3.org/1999/xhtml">Test and send explicitly</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/newsletters/NEWSLETTER_ID/issues/ISSUE_ID/send-test
x-aamu-actor: ai

POST /api/v1/newsletters/NEWSLETTER_ID/issues/ISSUE_ID/send
x-aamu-actor: ai</code></pre><p xmlns="http://www.w3.org/1999/xhtml">The test endpoint sends to the API actor when that user's email is an active subscriber. This gives the test the same subscriber-specific unsubscribe URL as a production message. The production endpoint sends the draft issue to active subscribers and is an external side effect, so agents should retain an explicit confirmation boundary before calling it.</p><p xmlns="http://www.w3.org/1999/xhtml">For the product workflow behind these endpoints, see <a href="/blog/posts/newsletters-in-aamuapp-from-subscribers-to-sending/">Newsletters in Aamu.app: from subscribers to sending</a>.</p>`;

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
			'x-db-id': DB_ID,
		},
		body: JSON.stringify({ query, variables }),
	});
	if (data?.errors?.length) throw new Error(data.errors.map(error => error.message).join('; '));
	return data.data;
}

function docsHeaders() {
	return {
		'Content-Type': 'application/json',
		'x-api-key': DOCS_API_KEY,
		'x-project-id': PROJECT_ID,
	};
}

async function upsertDocByTitle(title, html) {
	const headers = docsHeaders();
	const list = await requestJson(`${API_BASE_URL}/api/v1/docs/`, { headers });
	const existing = list.docs?.find(doc => doc.title === title);
	const body = JSON.stringify({ title, status: 'public', html, project_id: PROJECT_ID, pid: PROJECT_ID });

	if (existing) {
		const data = await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(existing.id)}`, {
			method: 'PATCH',
			headers,
			body,
		});
		return { action: 'updated', doc: data.doc || existing };
	}

	const data = await requestJson(`${API_BASE_URL}/api/v1/docs/`, {
		method: 'POST',
		headers,
		body,
	});
	return { action: 'created', doc: data.doc || data };
}

async function getDoc(id) {
	const data = await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(id)}`, {
		headers: docsHeaders(),
	});
	return data.doc || data;
}

function replaceOnce(value, search, replacement, label) {
	if (!value.includes(search)) throw new Error(`Could not update API Doc: missing ${label}.`);
	return value.replace(search, replacement);
}

function updateApiHtml(source) {
	if (source.includes('>Newsletters</h2>')) {
		if (source.includes('/signup-form')) return source;
		return replaceOnce(
			source,
			'<h3 xmlns="http://www.w3.org/1999/xhtml">Create and update an issue</h3>',
			`<h3 xmlns="http://www.w3.org/1999/xhtml">Create a public signup workflow</h3><pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">POST /api/v1/newsletters/NEWSLETTER_ID/signup-form
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
x-aamu-actor: ai</code></pre><p xmlns="http://www.w3.org/1999/xhtml">This idempotent endpoint creates a published Aamu Form, its backing Database table, and a published <code>row_inserted</code> automation with a <code>subscribe_to_newsletter</code> action. The response includes the form, Database and table ids, automation, and public form URL. The Database keeps form-response history while the newsletter subscriber collection remains the delivery source of truth.</p><h3 xmlns="http://www.w3.org/1999/xhtml">Create and update an issue</h3>`,
			'Newsletter issue heading',
		);
	}

	let html = source;
	html = replaceOnce(
		html,
		'tasks, docs, meetings, forms, files, databases, database automations, and database rows through GraphQL.',
		'newsletters, tasks, docs, meetings, forms, files, databases, database automations, and database rows through GraphQL.',
		'introduction',
	);
	html = replaceOnce(
		html,
		'upload files, submit forms, and manage database automations',
		'upload files, submit forms, manage newsletters, and manage database automations',
		'scope example',
	);
	html = replaceOnce(
		html,
		'tasks, docs, meetings, form submissions, file upload registration, and database creation/schema operations.',
		'tasks, docs, meetings, newsletters, form submissions, file upload registration, and database creation/schema operations.',
		'actor list',
	);
	html = replaceOnce(
		html,
		'It accepts any project read scope, such as Tasks, Docs, Helpdesk or Emails.',
		'It accepts any project read scope, such as Tasks, Docs, Newsletters, Helpdesk or Emails.',
		'user scope list',
	);
	html = replaceOnce(
		html,
		'<h2 xmlns="http://www.w3.org/1999/xhtml">Webhooks API</h2>',
		`${newsletterApiSection}<h2 xmlns="http://www.w3.org/1999/xhtml">Webhooks API</h2>`,
		'Webhooks heading',
	);
	html = replaceOnce(
		html,
		'Tasks, Docs, and Meetings expose REST <code>PATCH</code> endpoints.',
		'Tasks, Docs, Meetings, Newsletters, newsletter drafts, and subscribers expose REST <code>PATCH</code> endpoints.',
		'update summary',
	);
	html = replaceOnce(
		html,
		'create a task, attach files, write a doc, schedule a meeting, submit a form response, manage a database automation, or work with structured database rows',
		'create a task, attach files, write a doc, prepare a newsletter issue, schedule a meeting, submit a form response, manage a database automation, or work with structured database rows',
		'AI agent example',
	);
	html = replaceOnce(
		html,
		'start with one workflow: create a task, write a doc, or upload a file and reference it from editor HTML.',
		'start with one workflow: create a task, write a doc, prepare a newsletter issue, or upload a file and reference it from editor HTML.',
		'starting point',
	);
	html = replaceOnce(
		html,
		'use tasks for action, docs for knowledge, forms for input, files for context, meetings for coordination, GraphQL databases for structured state',
		'use tasks for action, docs for knowledge, newsletters for publication, forms for input, files for context, meetings for coordination, GraphQL databases for structured state',
		'workflow summary',
	);
	html = replaceOnce(
		html,
		'Helpdesk, Email, Docs, Tasks, and Meetings.',
		'Helpdesk, Email, Newsletters, Docs, Tasks, and Meetings.',
		'internal AI list',
	);
	return html;
}

async function patchApiDoc() {
	const current = await getDoc(apiPost.docId);
	const html = updateApiHtml(current.html || '');
	const data = await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(apiPost.docId)}`, {
		method: 'PATCH',
		headers: docsHeaders(),
		body: JSON.stringify({
			title: apiPost.title,
			status: 'public',
			html,
			project_id: PROJECT_ID,
			pid: PROJECT_ID,
		}),
	});
	return { action: html === current.html ? 'unchanged' : 'updated', doc: data.doc || current };
}

async function findPostId(slug) {
	const data = await graphql(`{
		BlogPostCollection {
			id
			slug
		}
	}`);
	return data.BlogPostCollection.find(row => row.slug === slug)?.id;
}

async function upsertBlogPost(post, docId, explicitId) {
	const id = explicitId || (await findPostId(post.slug));
	const data = await graphql(
		`mutation UpsertBlogPost(
			$id: ID
			$title: String
			$slug: String
			$description: String
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
		{ id, ...post, doc: docId },
	);
	return { action: id ? 'updated' : 'created', post: data.BlogPost };
}

const newsletterDoc = await upsertDocByTitle(newsletterPost.title, newsletterHtml);
const newsletterBlogPost = await upsertBlogPost(newsletterPost, newsletterDoc.doc.id);
const apiDoc = await patchApiDoc();
const apiBlogPost = await upsertBlogPost(apiPost, apiPost.docId, apiPost.id);

console.log(
	JSON.stringify(
		{
			newsletter: {
				doc: { action: newsletterDoc.action, id: newsletterDoc.doc.id },
				blogPost: newsletterBlogPost,
			},
			api: {
				doc: { action: apiDoc.action, id: apiPost.docId },
				blogPost: apiBlogPost,
			},
		},
		null,
		2,
	),
);
