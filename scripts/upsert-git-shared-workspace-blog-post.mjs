import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';

const title = 'Git belongs in the workspace: code, issues, comments, and team awareness in Aamu.app';
const slug = 'git-belongs-in-the-workspace-code-issues-comments-team-awareness-aamuapp';

const html = String.raw`<p xmlns="http://www.w3.org/1999/xhtml">Git is usually treated as a separate developer tool. The repository lives in one service, issues in another, product decisions in documents, customer feedback in a helpdesk, and everyday discussion in chat. The code may be well organized while the reason behind the code is scattered across five different places.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu.app takes a different view. Git is part of the shared workspace. Repositories, branches, commits, pull requests, code review comments, tasks, Docs, meetings, support conversations, and notifications can live inside the same team and project context.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The useful part is not simply that Aamu can host a Git repository. The useful part is that the repository does not become an island.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Code has context outside the repository</h2>
<p xmlns="http://www.w3.org/1999/xhtml">A code change rarely begins with code. It may begin with a customer reporting a bug, a product discussion in a meeting, a task created from support, or a decision written in a Doc.</p>
<p xmlns="http://www.w3.org/1999/xhtml">When Git is a separate destination, the team has to carry that context across tools. Someone copies a support link into an issue. Another person pastes the issue into a pull request. The final decision stays in a comment thread that the rest of the team may never see.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Inside Aamu, the repository belongs to a project. The same project can contain the tasks, documents, conversations, meetings, files, and customer work surrounding the implementation. The team can move from the reason for a change to the code itself without leaving the workspace.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Repositories and issues share the same project</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu repositories have their own linked task view. These tasks can work as practical issues for the repository: bugs, features, maintenance work, review follow-ups, or release tasks.</p>
<p xmlns="http://www.w3.org/1999/xhtml">A repository shows its active and completed task counts, and new tasks can be created directly in the repository context. The task still has the normal Aamu work features around it, including assignment, status, due dates, comments, attachments, reminders, and project visibility.</p>
<p xmlns="http://www.w3.org/1999/xhtml">This keeps engineering work connected to the broader team. A support person does not need to learn a separate issue tracker just to follow a reported bug. A project lead can see the task in the same workspace as the meeting or Doc that produced it. A developer can open the repository from the work item and return to the surrounding discussion when needed.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Pull requests are team conversations</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu supports the normal pull request workflow: compare a branch with the default branch, open a pull request, review its commits and changed files, discuss the change, merge it, close it without merging, or reopen it later.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The conversation is not only a description attached to a diff. Pull requests have their own comment thread, and reviewers can also discuss specific lines in changed files. Inline review comments remain anchored to the relevant file, line, and side of the diff.</p>
<p xmlns="http://www.w3.org/1999/xhtml">That distinction matters. A general comment can discuss architecture, scope, testing, or release concerns. A line comment can point to one exact implementation detail. Both stay connected to the pull request and visible to the people participating in the review.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Unread comments become shared awareness</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The quiet failure mode of code review is not usually that comments cannot be written. It is that the right person does not notice them, or notices them once and then loses the thread.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu tracks unread activity around pull request discussions and inline code comments. Comment counts, participants, and unread indicators help show where a review is still active. Git-related activity can appear alongside the workspace's other notifications instead of requiring the team to maintain a separate notification habit for every service.</p>
<p xmlns="http://www.w3.org/1999/xhtml">This creates a more useful kind of awareness. A developer can see that a reviewer replied on a line. A project member can notice that a pull request discussion is still unresolved. The notification leads back to the exact repository, pull request, file, and line where the conversation belongs.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">The repository is usable from Git and from the browser</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Developers can use repositories through normal Git workflows with SSH keys. Aamu shows the repository's SSH address and lets each user manage Git SSH keys from their settings.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The browser interface is useful when the team needs to inspect or make a small change without switching tools. Aamu can show the repository tree, branches, commits, commit diffs, pull requests, and changed files. Files can also be created or edited in the browser and committed with a message.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The browser is not meant to replace a developer's local editor. It gives the rest of the team a readable window into the code and provides a quick path for small documentation, configuration, or content changes.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">A practical connected workflow</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Consider a customer-reported bug:</p>
<ol xmlns="http://www.w3.org/1999/xhtml">
	<li><p>The report arrives in Aamu Helpdesk.</p></li>
	<li><p>The support person creates a task for the internal follow-up and links the customer context.</p></li>
	<li><p>The task is associated with the relevant repository and assigned to a developer.</p></li>
	<li><p>The developer creates a branch, implements the fix, and opens a pull request.</p></li>
	<li><p>A reviewer comments on the pull request or on an exact line in the diff.</p></li>
	<li><p>Unread indicators and notifications keep the review visible until the discussion moves forward.</p></li>
	<li><p>The pull request is merged and the task is completed.</p></li>
	<li><p>The support person returns to the original ticket with the implementation status and can answer the customer.</p></li>
</ol>
<p xmlns="http://www.w3.org/1999/xhtml">Every step has its own proper object: the customer conversation remains a Helpdesk ticket, the internal follow-up is a task, the implementation is a branch and pull request, and review details stay attached to the code. They still belong to one project workspace.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Fewer integrations to babysit</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Teams often try to recreate this workflow by connecting a Git host, issue tracker, chat service, documentation tool, and helpdesk with bots and webhooks. That can work, but the integration layer becomes another system the team has to understand.</p>
<p xmlns="http://www.w3.org/1999/xhtml">A link preview is not the same as shared context. A bot message saying that a pull request changed does not necessarily preserve the task, customer request, decision, review conversation, and notification state around it.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu's approach is simpler: keep the objects in the same workspace model from the beginning. The repository is project-scoped. The tasks are project-scoped. Comments and notifications know which team and project they belong to. Access follows the workspace instead of being reconstructed separately in every integration.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">What Aamu Git is for</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu Git is a good fit for teams that want code hosting and review close to everyday product work. It is especially useful for small product teams, agencies, consultancies, internal tool teams, and organizations where developers work closely with support, operations, content, or customer-facing colleagues.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The point is not to claim that every team needs to replace a large dedicated developer platform. Teams with highly specialized enterprise release processes, large extension ecosystems, or deeply established external CI/CD infrastructure may prefer to keep their existing Git host.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The Aamu question is narrower and more practical: if code, issues, comments, notifications, customer feedback, and project knowledge already depend on each other, how much coordination work is created by keeping them in separate products?</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">The bottom line</h2>
<p xmlns="http://www.w3.org/1999/xhtml">A Git server stores code. A shared workspace keeps the team oriented around why the code is changing, who is waiting for it, what was discussed, and what should happen next.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu.app brings those two ideas together. Repositories, branches, commits, pull requests, inline review comments, issue-like tasks, and unread notifications live in the same project environment as Docs, meetings, Helpdesk, email, chat, and the rest of the team's work.</p>
<p xmlns="http://www.w3.org/1999/xhtml">That is the larger value of Git in Aamu: the code stays versioned, while the context stays with the team.</p>`;

const post = {
	title,
	slug,
	description:
		'How Aamu.app keeps Git repositories, issue-like tasks, pull requests, code review comments, and notifications inside one shared team workspace.',
	publishDate: '2026-06-19T09:00:00.000Z',
	author: '29940627-51e8-4fd0-82ab-d718ddfe802f',
	status: 'draft',
	tags: ['git', 'workspace', 'tasks', 'collaboration', 'notifications'],
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
		throw new Error(data?.error?.message || data?.message || `HTTP ${response.status}`);
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

	if (data?.errors?.length) {
		throw new Error(data.errors.map(error => error.message).join('; '));
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
