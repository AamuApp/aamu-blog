import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';

const title = 'Aamu My Apps: extend your team workspace with custom applications';
const slug = 'aamu-my-apps-extend-your-team-workspace-with-custom-applications';
const description = 'Aamu My Apps lets teams connect purpose-built applications to the same identity, team context, projects, notifications, and activity feed. Here is how the extension model works and what it makes possible.';
const publishDate = '2026-07-31T06:00:00.000Z';

const html = `<p xmlns="http://www.w3.org/1999/xhtml">Aamu is designed to be a team workspace, but a workspace should not have to stop at the features built into its first release. Every team has workflows that are specific to its people, industry, or way of working. My Apps gives those workflows a place inside Aamu.</p>
<p>With My Apps, an external application can appear alongside the team's Aamu apps and use the team's existing identity and context. That makes it possible to build a focused experience without asking people to create another account, maintain another team directory, or copy information between unrelated systems.</p>
<h2>What My Apps is</h2>
<p>My Apps is Aamu's extension point for applications that belong in the team's workspace. An app can have its own interface and data model while still being launched from Aamu and connected to the relevant team, users, and projects.</p>
<p>This is useful for applications that are too specific to be a general-purpose Aamu feature, but too important to live as a disconnected tool. A recognition app, a project-specific dashboard, an approval workflow, a customer portal, or an internal operations tool can all be a better fit as an Aamu app.</p>
<h2>The launch flow</h2>
<p>A user opens an app from Aamu's My Apps area. Aamu sends the app a short-lived, one-time launch code together with the app identity and the requested context. The external app exchanges that code server to server with Aamu. The app secret stays on the server, and the browser never needs to receive it.</p>
<p>After the exchange, the app receives a scoped Aamu access token and the initial user and team context. It can create its own local session, apply its own application rules, and send the user to the right place in the app. When Aamu opens an existing item, the launch can also include an external id so the app can open that item directly.</p>
<h2>Context is the important part</h2>
<p>A link can open a page. Context makes an integration useful.</p>
<p>The My Apps context includes the authenticated user, the team, available projects, and the team's user directory. An external application can use that context to answer practical questions immediately:</p>
<ul><li><p>Who is using the application?</p></li><li><p>Which team does the request belong to?</p></li><li><p>Which projects are available?</p></li><li><p>Which teammates can be selected as recipients or collaborators?</p></li></ul>
<p>The application should still validate every write against the context it received. Context is not a reason to bypass authorization; it is a consistent starting point for applying it.</p>
<h2>Events bring the result back to Aamu</h2>
<p>An app becomes part of the workspace when its important results are visible there. My Apps supports events for external items, notifications, and activity-feed entries.</p>
<p>For example, an external app can create an item that opens in the app, notify a specific teammate, and add an activity entry to the relevant project. Aamu users can discover the result in the workspace they already use, while the external app remains the system that owns its detailed data.</p>
<p>Reliable integrations should treat event delivery as asynchronous. The app should store outgoing events in a durable outbox, use deterministic event ids, retry temporary failures, and make delivery idempotent. Aamu can then be temporarily unavailable without losing the work that needs to be reflected in the workspace.</p>
<h2>Kudos as a concrete example</h2>
<p>Kudos is a small open-source reference application built around this model. A team member opens Kudos from Aamu, chooses a teammate and a project, writes a thoughtful message, and sends it. Kudos keeps its own kudos, reactions, sessions, and outbox data in SQLite, while sending the resulting item, notification, and activity events back to Aamu.</p>
<p>The example is deliberately small, but the pattern is general. The external app owns the workflow and its domain data. Aamu provides the team workspace, identity, project context, and places where the result can be discovered.</p>
<h2>Security belongs in the integration design</h2>
<p>A production My Apps integration should validate the app id and the configured Aamu origin on every launch. It should exchange launch codes only on the server, keep the app secret out of browser code, use secure HTTP-only session cookies, and verify that recipients, projects, and other identifiers belong to the authenticated team context.</p>
<p>Sessions should expire, and the Aamu context should be refreshed periodically so that changes to team membership or project access take effect. Rate limiting, durable event delivery, backups, and monitoring are part of the feature too—not afterthoughts added when the first failure happens.</p>
<h2>Why this model matters</h2>
<p>My Apps avoids two unhelpful extremes. Teams do not have to force every specialized workflow into the core product, and they do not have to scatter every workflow across isolated services with separate identities and directories.</p>
<p>The result is a more open workspace: Aamu provides the shared context and the integration surface, while focused applications can evolve independently. A team can start with a small app and grow it as the workflow proves useful.</p>
<h2>Building a My App</h2>
<p>A practical first app usually starts with one clear workflow:</p>
<ol><li><p>Define the action the app should make easier.</p></li><li><p>Create the app in Aamu My Apps and configure its launch URL.</p></li><li><p>Implement the one-time launch-code exchange on the server.</p></li><li><p>Store a local session and use the returned team context for authorization.</p></li><li><p>Send only the events that help the result belong in the workspace.</p></li><li><p>Add retries, monitoring, and a production test with a dedicated team.</p></li></ol>
<p>Start narrow. A focused application with a reliable launch and a meaningful event is more valuable than a large integration that copies half of Aamu without a clear workflow.</p>
<h2>The larger idea</h2>
<p>Aamu My Apps turns the workspace into an extensible platform. The core apps cover common team work, while external applications can add the workflows that make one team different from another.</p>
<p>The best integrations do not make people think about integration. They let a user move from Aamu into a purpose-built experience and back again with the right identity, context, and result already in place.</p>`;

const post = {
	title,
	slug,
	description,
	publishDate,
	author: '29940627-51e8-4fd0-82ab-d718ddfe802f',
	status: 'published',
	tags: ['aamu', 'integrations', 'my-apps', 'developers'],
	directAnswer: 'Aamu My Apps is an extension model that lets external applications use a team\'s Aamu identity and context while sending useful items, notifications, and activity back into the workspace.',
	contentType: 'feature-guide',
	audience: 'developers and technical teams',
	faq: JSON.stringify([
		{ question: 'What is Aamu My Apps?', answer: 'Aamu My Apps lets external applications connect to an Aamu team workspace with a server-side launch flow, shared team context, and events returned to Aamu.' },
		{ question: 'What context can a My Apps application receive?', answer: 'The application can receive the authenticated user, team, available projects, and the team user directory, subject to the scopes and context provided by Aamu.' },
		{ question: 'Can a My Apps application send information back to Aamu?', answer: 'Yes. An application can send external item, notification, and activity events so that its work can be discovered inside Aamu.' },
		{ question: 'Does a My Apps application need its own user database?', answer: 'It needs its own application data and session handling, but it can use the Aamu launch flow for identity and team context instead of creating a separate team directory.' },
	]),
	relatedPosts: JSON.stringify([
		'aamuapp-as-an-ai-workspace-alternative-to-notion-ai-slack-ai-jira-and-zendesk',
		'outbound-webhooks-in-aamuapp-real-time-events-tasks-helpdesk-email',
		'introduction-to-aamu-app',
	]),
};

if (!API_KEY) throw new Error('API_KEY environment variable is required.');
if (!DB_ID) throw new Error('AAMU_DB_ID or DB_ID environment variable is required.');

async function requestJson(url, options) {
	const response = await fetch(url, options);
	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		const message = data?.error?.message || data?.message || JSON.stringify(data);
		throw new Error(`HTTP ${response.status}: ${message}`);
	}
	return data;
}

async function graphql(query, variables = {}) {
	const data = await requestJson(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'x-db-id': DB_ID },
		body: JSON.stringify({ query, variables }),
	});
	if (data?.errors?.length) throw new Error(data.errors.map(error => error?.message || String(error)).join('; '));
	return data.data;
}

async function upsertDoc() {
	const headers = { 'Content-Type': 'application/json', 'x-api-key': DOCS_API_KEY, 'x-project-id': PROJECT_ID };
	const list = await requestJson(`${API_BASE_URL}/api/v1/docs/`, { headers });
	const existing = list.docs?.find(doc => doc.title === title);
	const body = JSON.stringify({ title, status: 'public', html, project_id: PROJECT_ID, pid: PROJECT_ID });
	if (existing) {
		const data = await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(existing.id)}`, { method: 'PATCH', headers, body });
		return { action: 'updated', doc: data.doc || { ...existing, html } };
	}
	const data = await requestJson(`${API_BASE_URL}/api/v1/docs/`, { method: 'POST', headers, body });
	return { action: 'created', doc: data.doc || data };
}

async function upsertBlogPost(docId) {
	const existingData = await graphql('{ BlogPostCollection { id slug } }');
	const existingId = existingData.BlogPostCollection.find(row => row.slug === slug)?.id;
	const data = await graphql(`
		mutation UpsertBlogPost($id: ID, $title: String, $slug: String, $description: String, $publishDate: DateTime, $author: String, $status: String, $tags: [String], $doc: String, $directAnswer: String, $contentType: String, $audience: String, $faq: String, $relatedPosts: String) {
			BlogPost(id: $id, title: $title, slug: $slug, description: $description, publishDate: $publishDate, author: $author, status: $status, tags: $tags, doc: $doc, directAnswer: $directAnswer, contentType: $contentType, audience: $audience, faq: $faq, relatedPosts: $relatedPosts) {
				id title slug status publishDate tags doc directAnswer contentType audience faq relatedPosts
			}
		}`, { id: existingId, ...post, doc: docId });
	return { action: existingId ? 'updated' : 'created', post: data.BlogPost };
}

const docResult = await upsertDoc();
const postResult = await upsertBlogPost(docResult.doc.id);
console.log(JSON.stringify({ doc: { action: docResult.action, id: docResult.doc.id, title }, blogPost: postResult }, null, 2));
