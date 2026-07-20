import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';
const AUTHOR_ID = '29940627-51e8-4fd0-82ab-d718ddfe802f';

const title = 'Using third-party APIs through Aamu.app AI';
const slug = 'using-third-party-apis-through-aamuapp-ai';
const description = 'How Aamu.app AI uses OpenAPI descriptions and user-owned credentials to read data from external services and turn the result into Aamu Docs and Database rows.';
const publishDate = '2026-07-20T09:00:00.000Z';

const html = String.raw`
<p xmlns="http://www.w3.org/1999/xhtml">Some of the information you need for work does not live in Aamu. It may be in your X account, GitHub, Slack, Jira, Linear, CRM, helpdesk, or another service that your team uses every day.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu.app AI can now work with those services through their APIs. The important distinction is that this is not about using an external provider as the AI model. It is about letting AI use a service that you have authorised, then bringing the useful result back into your Aamu workspace.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">OpenAPI describes what a service can do</h2>
<p xmlns="http://www.w3.org/1999/xhtml">An API key by itself is only a credential. It may let a request authenticate, but it does not tell AI which operations exist, which parameters are required, or what the response means.</p>
<p xmlns="http://www.w3.org/1999/xhtml">That is where <strong>OpenAPI</strong> helps. An OpenAPI document describes an API's operations, paths, parameters, authentication schemes, and response formats in a machine-readable form. Aamu can use that description as a capability map for the external service.</p>
<p xmlns="http://www.w3.org/1999/xhtml">This means Aamu does not need a built-in connector for every possible service. You provide an OpenAPI description and a credential with the required permissions. The available actions then depend on the operations described by that document and on what the credential is allowed to access.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Add a service in Third-Party API keys</h2>
<p xmlns="http://www.w3.org/1999/xhtml">External service credentials belong in <strong>Settings → Third-Party API keys</strong>. For each service, you can add:</p>
<ul xmlns="http://www.w3.org/1999/xhtml">
  <li><p>a service identifier and a label that helps you recognise it,</p></li>
  <li><p>the API key or token,</p></li>
  <li><p>an optional base URL, and</p></li>
  <li><p>the service's OpenAPI 3.0 or 3.1 document in JSON or YAML.</p></li>
</ul>
<p xmlns="http://www.w3.org/1999/xhtml">The OpenAPI document explains the API. It does not grant access by itself. The key or token remains the thing that authorises the request, and its scopes still limit what can be returned.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu stores the credential in the user's own settings and does not put the secret into the AI prompt. The server resolves the credential only when it needs to make the external request.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">From a request to an API call</h2>
<p xmlns="http://www.w3.org/1999/xhtml">When you use <strong>Launch AI</strong> or mention <code>@ai</code>, the request follows the same AI path as other Aamu actions:</p>
<ol xmlns="http://www.w3.org/1999/xhtml">
  <li><p>The intent router recognises that the request concerns an external service.</p></li>
  <li><p>It compares the request with the operations available in your configured OpenAPI descriptions.</p></li>
  <li><p>AI selects an operation and fills in the required parameters from your request and conversation context.</p></li>
  <li><p>Aamu checks the request, applies your credential on the server, and calls the external API.</p></li>
  <li><p>The result is returned to the conversation or used to create something in Aamu.</p></li>
</ol>
<p xmlns="http://www.w3.org/1999/xhtml">The intent router is useful here because the user should not have to name an endpoint or know the API's internal terminology. “Find my open support tickets” is a work request. The OpenAPI operation is the implementation detail that Aamu resolves behind it.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Example: turn X direct messages into an Aamu Database</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Imagine that you want to collect customer conversations from X for follow-up work. You could ask Launch AI:</p>
<blockquote xmlns="http://www.w3.org/1999/xhtml"><p>Fetch my X direct messages from the last month and create an Aamu Database with one row per conversation. Include the sender, date, message text, and a link if the API provides one.</p></blockquote>
<p xmlns="http://www.w3.org/1999/xhtml">If the configured OpenAPI document contains a compatible direct-message operation and your token has the required permission, Aamu can call that operation, interpret the response, and create a structured Database.</p>
<p xmlns="http://www.w3.org/1999/xhtml">This is a good Database use case because each conversation becomes a row that you can filter, sort, assign, enrich, and process further. The same request could also create a Doc with a short summary of the recurring topics.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The exact result depends on the service API. Aamu does not assume that every X account, token, or OpenAPI document exposes private messages. The API description and the permissions granted to your credential define the real boundary.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Examples from other services</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The same pattern can be useful in many kinds of work:</p>
<ul xmlns="http://www.w3.org/1999/xhtml">
  <li><p><strong>GitHub:</strong> collect open issues, pull requests, reviews, or release information into a Database. Ask AI to create a release-readiness Doc from the selected results.</p></li>
  <li><p><strong>Slack:</strong> retrieve messages from a permitted channel and turn a discussion into a decision log or a follow-up Database. This depends on the operations and scopes exposed by the configured Slack API.</p></li>
  <li><p><strong>Jira or Linear:</strong> import issues, sprint items, or recently completed work into a Database, then generate a planning Doc grouped by project, owner, or status.</p></li>
  <li><p><strong>CRM or helpdesk:</strong> bring contacts, companies, tickets, or conversation history into Aamu so that customer context can be reviewed and followed up in one place.</p></li>
  <li><p><strong>Analytics and monitoring:</strong> retrieve incidents, metrics, or service events and create an incident brief in a Doc or a triage table in a Database.</p></li>
</ul>
<p xmlns="http://www.w3.org/1999/xhtml">These are examples of possible workflows, not a promise that every service is already connected out of the box. The service must expose a usable OpenAPI description, and the credential must be allowed to perform the requested read.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">When should the result be a Doc or a Database?</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Use a <strong>Doc</strong> when the useful output is a narrative: a summary of a thread, a release brief, a customer context page, or a list of decisions and next steps.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Use a <strong>Database</strong> when the response contains repeatable records: one row per message thread, ticket, issue, contact, incident, or event. Database rows make the imported data easier to filter, update, assign, and use in later workflows.</p>
<p xmlns="http://www.w3.org/1999/xhtml">AI can also combine the two: import the source records into a Database and create a Doc that explains the important patterns found in them.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Designed for user-owned access</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Third-party API access is deliberately tied to the user who adds the credential. Aamu should not turn one person's private service account into a shared team connection by accident.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The OpenAPI document is a description of capabilities, not an instruction to give AI unrestricted access. In the initial implementation, Aamu focuses on read operations such as <code>GET</code> and <code>HEAD</code>. API-key headers and query parameters, bearer tokens, and OAuth2-style access tokens can be described by the configured API definition.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Write operations can have real side effects: sending a message, changing a ticket, deleting a record, or publishing content. Those actions need a more explicit confirmation and safety model before they should be treated like ordinary retrieval.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Getting started</h2>
<ol xmlns="http://www.w3.org/1999/xhtml">
  <li><p>Open <strong>Settings → Third-Party API keys</strong>.</p></li>
  <li><p>Add the service's API key or access token.</p></li>
  <li><p>Paste the service's OpenAPI 3.0 or 3.1 JSON/YAML description.</p></li>
  <li><p>Open Launch AI or write an <code>@ai</code> request that describes the outcome you want.</p></li>
</ol>
<p xmlns="http://www.w3.org/1999/xhtml">Start with a read-only request and inspect the returned data before asking AI to create a Doc or import rows. If the service requires a particular account scope, workspace ID, or date range, include that context in the request.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Related Aamu AI workflows</h2>
<p xmlns="http://www.w3.org/1999/xhtml"><a href="/blog/posts/ai-commands-in-aamuapp-turning-comments-into-workspace-actions/">AI commands in Aamu.app: turning comments into workspace actions</a> explains how Launch AI and <code>@ai</code> can already route requests to actions inside Aamu.</p>
<p xmlns="http://www.w3.org/1999/xhtml"><a href="/blog/posts/company-brain-in-aamuapp-ai-across-your-workspace/">Company Brain in Aamu.app</a> covers permission-aware retrieval from the Aamu workspace itself.</p>
<p xmlns="http://www.w3.org/1999/xhtml"><a href="/blog/posts/aamuapp-databases-practical-feature-guide/">A practical guide to Aamu.app Databases</a> shows how structured rows can become a working part of the workspace.</p>

<p xmlns="http://www.w3.org/1999/xhtml">With third-party APIs, Aamu.app AI can connect those ideas: understand a request, use an API that you have authorised, and turn external information into work that stays useful inside Aamu.</p>
`;

if (!API_KEY || !DOCS_API_KEY || !DB_ID) {
	throw new Error('API_KEY, DOCS_API_KEY, and AAMU_DB_ID/DB_ID are required.');
}

async function requestJson(url, options = {}) {
	const response = await fetch(url, options);
	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${data?.error?.message || data?.message || JSON.stringify(data)}`);
	}
	return data;
}

async function graphql(query, variables = {}) {
	const data = await requestJson(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'x-db-id': DB_ID },
		body: JSON.stringify({ query, variables })
	});
	if (data?.errors?.length) {
		throw new Error(data.errors.map(error => error.message).join('; '));
	}
	return data.data;
}

const docsHeaders = {
	'Content-Type': 'application/json',
	'x-api-key': DOCS_API_KEY,
	'x-project-id': PROJECT_ID
};

async function getDocs() {
	const data = await requestJson(`${API_BASE_URL}/api/v1/docs/`, { headers: docsHeaders });
	return data.docs || [];
}

async function upsertDoc(docs) {
	const existing = docs.find(doc => doc.title === title);
	const body = JSON.stringify({ title, status: 'public', html, project_id: PROJECT_ID, pid: PROJECT_ID });
	if (existing) {
		const data = await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(existing.id)}`, {
			method: 'PATCH', headers: docsHeaders, body
		});
		return { action: 'updated', doc: data.doc || data };
	}
	const data = await requestJson(`${API_BASE_URL}/api/v1/docs/`, {
		method: 'POST', headers: docsHeaders, body
	});
	return { action: 'created', doc: data.doc || data };
}

async function getExistingPost() {
	const data = await graphql(`query FindPost($slug: String) {
		BlogPostCollection(filter: { slug: { EQ: $slug } }) {
			id title slug publishDate author { id name } doc
		}
	}`, { slug });
	return data.BlogPostCollection?.[0];
}

async function upsertBlogPost(docId, existing) {
	const data = await graphql(`mutation UpsertThirdPartyApiPost(
		$id: ID, $title: String, $slug: String, $description: String,
		$publishDate: DateTime, $author: String, $status: String,
		$tags: [String], $doc: String
	) {
		BlogPost(
			id: $id, title: $title, slug: $slug, description: $description,
			publishDate: $publishDate, author: $author, status: $status,
			tags: $tags, doc: $doc
		) { id title slug status publishDate tags doc }
	}`, {
		id: existing?.id,
		title,
		slug,
		description,
		publishDate: existing?.publishDate || publishDate,
		author: existing?.author?.id || AUTHOR_ID,
		status: 'published',
		tags: ['ai', 'openapi', 'api', 'integrations', 'databases', 'docs'],
		doc: docId
	});
	return { action: existing ? 'updated' : 'created', post: data.BlogPost };
}

const docs = await getDocs();
const docResult = await upsertDoc(docs);
const existingPost = await getExistingPost();
const postResult = await upsertBlogPost(docResult.doc.id, existingPost);

console.log(JSON.stringify({
	doc: { action: docResult.action, id: docResult.doc.id, title: docResult.doc.title },
	post: { action: postResult.action, id: postResult.post.id, slug: postResult.post.slug, status: postResult.post.status }
}, null, 2));
