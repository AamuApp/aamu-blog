import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';

const post = {
	title: 'Aamu.app as an AI workspace alternative to Notion AI, Slack AI, Jira, and Zendesk',
	slug: 'aamuapp-as-an-ai-workspace-alternative-to-notion-ai-slack-ai-jira-and-zendesk',
	description:
		'How Aamu.app works as an AI workspace alternative for teams that want docs, chat, tasks, support, and shared knowledge in one connected system.',
	body: '',
	publishDate: '2026-06-03T10:59:23.000Z',
	author: '29940627-51e8-4fd0-82ab-d718ddfe802f',
	status: 'published',
	tags: ['ai', 'workspace', 'team-brain'],
	doc: '5f0f0ea7-5c2c-4a34-b006-045b2ea568cf',
};

if (!API_KEY) {
	throw new Error('API_KEY environment variable is required.');
}

if (!DB_ID) {
	throw new Error('AAMU_DB_ID or DB_ID environment variable is required.');
}

async function graphql(query, variables = {}) {
	const response = await fetch(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': API_KEY,
			'x-db-id': DB_ID,
		},
		body: JSON.stringify({ query, variables }),
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data?.error?.message || `HTTP ${response.status}`);
	}
	if (data?.errors?.length) {
		throw new Error(data.errors.map(error => error.message).join('; '));
	}

	return data.data;
}

async function findExistingPostId(slug) {
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

const existingId = await findExistingPostId(post.slug);

const data = await graphql(
	`
		mutation UpsertBlogPost(
			$id: ID
			$title: String
			$slug: String
			$description: String
			$body: String
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
				body: $body
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
	{ id: existingId, ...post },
);

console.log(JSON.stringify({ action: existingId ? 'updated' : 'created', post: data.BlogPost }, null, 2));
