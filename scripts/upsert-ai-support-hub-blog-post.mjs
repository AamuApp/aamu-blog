import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';

const title = 'AI support in Aamu.app';
const slug = 'ai-support-in-aamuapp';

const html = `<p xmlns="http://www.w3.org/1999/xhtml">Aamu.app's AI support posts form a connected reading path. Start with the workspace idea, then move into Team Brain, support knowledge bases, customer support drafts, Helpdesk triage, and the Linear comparison.</p><ol xmlns="http://www.w3.org/1999/xhtml"><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://aamu.app/blog/posts/aamuapp-as-an-ai-workspace-alternative-to-notion-ai-slack-ai-jira-and-zendesk/">Aamu.app as an AI workspace alternative to Notion AI, Slack AI, Jira, and Zendesk</a></p><p>Why Aamu treats AI as part of a connected workspace instead of a sidebar inside one app.</p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://aamu.app/blog/posts/how-aamuapp-uses-team-brain-to-answer-from-your-company-knowledge/">How Aamu.app uses Team Brain to answer from your company knowledge</a></p><p>How Team Brain gives Aamu AI maintained company knowledge to retrieve before it drafts or answers.</p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://aamu.app/blog/posts/how-to-build-a-support-knowledge-base-that-ai-can-actually-use/">How to build a support knowledge base that AI can actually use</a></p><p>How to write policies, product answers, escalation rules, and examples so AI can retrieve useful support context.</p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://aamu.app/blog/posts/ai-customer-support-with-aamuapp-team-brain-drafts-and-human-review/">AI customer support with Aamu.app: Team Brain, drafts, and human review</a></p><p>The main support workflow: Team Brain context, AI-generated drafts, live chat automation, and human review.</p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://aamu.app/blog/posts/from-helpdesk-ticket-to-team-brain-ai-triage-docs-human-review/">From Helpdesk ticket to Team Brain: AI triage, Docs, and human review in Aamu.app</a></p><p>How a support ticket can become better knowledge, clearer triage, docs, and follow-up work.</p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://aamu.app/blog/posts/aamuapp-vs-linear-triage-customer-conversations-team-brain-human-reviewed-ai-support/">Aamu.app vs Linear Triage: customer conversations, Team Brain, and human-reviewed AI support</a></p><p>A practical comparison of product issue intake and customer conversation intake.</p></li></ol><p xmlns="http://www.w3.org/1999/xhtml">The common thread is simple: AI support works best when customer conversations, company knowledge, docs, tasks, and human review stay connected.</p>`;

const post = {
	title,
	slug,
	description: "A reading path for Aamu.app's AI support workflow: AI workspace, Team Brain, support knowledge bases, customer support drafts, Helpdesk triage, and Linear comparison.",
	publishDate: '2026-06-05T04:15:00.000Z',
	author: '29940627-51e8-4fd0-82ab-d718ddfe802f',
	status: 'published',
	tags: ['ai', 'helpdesk', 'team-brain'],
};

if (!API_KEY) {
	throw new Error('API_KEY environment variable is required.');
}

if (!DB_ID) {
	throw new Error('AAMU_DB_ID or DB_ID environment variable is required.');
}

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
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': API_KEY,
			'x-db-id': DB_ID,
		},
		body: JSON.stringify({ query, variables }),
	});

	if (Array.isArray(data?.errors) && data.errors.length) {
		throw new Error(data.errors.map(error => error?.message || String(error)).join('; '));
	}
	if (data?.errors) {
		throw new Error(JSON.stringify(data.errors));
	}
	if (data?.error) {
		throw new Error(data.error?.message || JSON.stringify(data.error));
	}

	return data.data;
}

async function upsertDoc() {
	const headers = {
		'Content-Type': 'application/json',
		'x-api-key': DOCS_API_KEY,
		'x-project-id': PROJECT_ID,
	};
	const list = await requestJson(`${API_BASE_URL}/api/v1/docs/`, { headers });
	const existing = list.docs?.find(doc => doc.title === title);
	const body = JSON.stringify({
		title,
		status: 'public',
		html,
		project_id: PROJECT_ID,
		pid: PROJECT_ID,
	});

	if (existing) {
		const data = await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(existing.id)}`, {
			method: 'PATCH',
			headers,
			body,
		});
		return { action: 'updated', doc: data.doc || { ...existing, html } };
	}

	const data = await requestJson(`${API_BASE_URL}/api/v1/docs/`, {
		method: 'POST',
		headers,
		body,
	});
	return { action: 'created', doc: data.doc || data };
}

async function findExistingPostId() {
	const data = await graphql(`
		{
			BlogPostCollection {
				id
				slug
			}
		}
	`);

	return data.BlogPostCollection.find(row => row.slug === slug)?.id;
}

async function upsertBlogPost(docId) {
	const existingId = await findExistingPostId();
	const data = await graphql(
		`
			mutation UpsertBlogPost(
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
					author {
						id
						name
					}
				}
			}
		`,
		{ id: existingId, ...post, doc: docId },
	);

	return { action: existingId ? 'updated' : 'created', post: data.BlogPost };
}

const docResult = await upsertDoc();
const docId = docResult.doc.id;
const postResult = await upsertBlogPost(docId);

console.log(JSON.stringify({ doc: { action: docResult.action, id: docId, title }, blogPost: postResult }, null, 2));
