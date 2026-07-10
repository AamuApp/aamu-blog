import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';
const AUTHOR_ID = '29940627-51e8-4fd0-82ab-d718ddfe802f';
const HERO_PATH = path.resolve('assets/images/company-brain.jpg');

const title = 'Company Brain in Aamu.app: ask AI across your workspace';
const slug = 'company-brain-in-aamuapp-ask-ai-across-your-workspace';
const description = 'How Aamu.app Company Brain lets Launch AI and @ai answer from permission-aware workspace data with links back to tasks, Docs, meetings, databases, tickets, and other sources.';

const html = String.raw`
<p xmlns="http://www.w3.org/1999/xhtml">The useful knowledge inside a company rarely lives in one knowledge base. It is spread across tasks, Docs, meeting notes, database rows, support tickets, email threads, forms, files, and the people who work with them.</p>
<p xmlns="http://www.w3.org/1999/xhtml">That creates an awkward gap for AI. A model may be able to write a fluent answer, but it still needs to know where the team's current information lives, which projects the person asking can access, and which source supports each claim.</p>
<p xmlns="http://www.w3.org/1999/xhtml"><strong>Company Brain</strong> is Aamu.app's answer to that problem. It gives Launch AI and <code>@ai</code> a permission-aware way to retrieve information from the Aamu workspace, answer a question, and link back to the objects where the answer was found.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">From a support knowledge base to workspace knowledge</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu already has Team Brain for maintained Helpdesk knowledge. Team Brain works well when a team wants to choose canonical support sources such as Docs, FAQ snippets, web pages, sitemaps, or selected resolved tickets. It answers a focused question: what approved knowledge should support use?</p>
<p xmlns="http://www.w3.org/1999/xhtml">Company Brain has a broader job. It makes the operational information already stored in Aamu retrievable for internal questions. Instead of requiring every useful fact to be copied into a separate knowledge source, Company Brain indexes the top-level workspace objects that the team uses every day.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The two layers complement each other:</p>
<ul xmlns="http://www.w3.org/1999/xhtml">
  <li><p><strong>Team Brain</strong> contains selected, maintained knowledge for workflows such as Helpdesk answers and customer-facing drafts.</p></li>
  <li><p><strong>Company Brain</strong> helps people ask broader questions across the work taking place in Aamu.</p></li>
</ul>

<h2 xmlns="http://www.w3.org/1999/xhtml">What Company Brain can find</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The first Company Brain version indexes the main Aamu workspace objects:</p>
<ul xmlns="http://www.w3.org/1999/xhtml">
  <li><p>projects and team members,</p></li>
  <li><p>tasks and their discussion context,</p></li>
  <li><p>Docs and Doc content,</p></li>
  <li><p>meetings, AI notes, and speaker-attributed transcripts,</p></li>
  <li><p>forms and form structure,</p></li>
  <li><p>file metadata,</p></li>
  <li><p>databases, tables, and rows,</p></li>
  <li><p>Helpdesk tickets,</p></li>
  <li><p>the signed-in user's own email, and</p></li>
  <li><p>newsletters and newsletter issues.</p></li>
</ul>
<p xmlns="http://www.w3.org/1999/xhtml">Git repositories and Penpot designs are deliberately outside the first version. Their data models need more specialized indexing than normal workspace objects. File contents also need their own handling: the initial version indexes file metadata, not arbitrary binary files stored in object storage.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Ask from Launch AI or mention @ai</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Company Brain is not a separate chatbot. It is part of the same AI path people already use in Aamu.</p>
<p xmlns="http://www.w3.org/1999/xhtml">A person can open the <strong>Launch AI</strong> dialog and ask a broad workspace question:</p>
<blockquote xmlns="http://www.w3.org/1999/xhtml"><p>What did we decide about the onboarding change, and is there already a task for it?</p></blockquote>
<p xmlns="http://www.w3.org/1999/xhtml">The same retrieval is available when someone mentions <code>@ai</code> in a task, Doc, meeting, ticket, or another supported discussion. The current item and discussion provide immediate context, while Company Brain can retrieve related information from elsewhere in the accessible workspace.</p>
<p xmlns="http://www.w3.org/1999/xhtml">This shared path matters. Launch AI and <code>@ai</code> should not behave like two assistants with different memories. They should use the same permissions, the same indexed sources, and the same grounding rules.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Answers include links back to Aamu</h2>
<p xmlns="http://www.w3.org/1999/xhtml">A useful company answer should not end with “the AI says so.” Company Brain results keep the source type, title, project, and Aamu URL alongside the indexed text.</p>
<p xmlns="http://www.w3.org/1999/xhtml">When AI uses those results for a factual answer, it is instructed to cite the supporting sources. Launch AI stores those source references with the conversation and renders them as clickable links.</p>
<p xmlns="http://www.w3.org/1999/xhtml">That makes an answer a starting point for work rather than a dead end. A teammate can open the meeting where a decision was made, inspect the task that tracks it, read the original Doc, or check the relevant database row.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Permissions are part of retrieval</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Indexing company data is only useful if retrieval respects the same boundaries as the workspace.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Every Company Brain document carries its team, project, source type, and visibility metadata. Before a query reaches the index, Aamu resolves the projects available to the signed-in user. The retrieval query then includes only:</p>
<ul xmlns="http://www.w3.org/1999/xhtml">
  <li><p>company-level information for the current team,</p></li>
  <li><p>project information from projects the user belongs to, and</p></li>
  <li><p>user-specific information owned by that user.</p></li>
</ul>
<p xmlns="http://www.w3.org/1999/xhtml">Email is the clearest example. Email content can be useful context, but one team member's mailbox must not become another team member's AI search result. Company Brain therefore marks email chunks as user-owned and requires both the owner and project checks during retrieval.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The access check happens before source text is added to the model context. The model is not asked to decide which information the user should be allowed to see.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Meetings become searchable knowledge</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Live meetings are an important Company Brain source because decisions often appear in conversation before they reach a Doc or task.</p>
<p xmlns="http://www.w3.org/1999/xhtml">When the AI meeting assistant is enabled, it can join the LiveKit room as a participant, transcribe each participant's audio with speaker attribution, and produce meeting notes. Company Brain can index the meeting title, description, transcript, summary, decisions, and action items.</p>
<p xmlns="http://www.w3.org/1999/xhtml">A later question can then connect the conversation to the rest of the workspace:</p>
<blockquote xmlns="http://www.w3.org/1999/xhtml"><p>Who agreed to contact the customer after Tuesday's meeting?</p></blockquote>
<p xmlns="http://www.w3.org/1999/xhtml">The answer can point back to the meeting page instead of treating the transcript as anonymous text.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Incremental indexing keeps the cost manageable</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Company Brain does not need to recreate every embedding on every run. Each indexed document has a content hash. Unchanged documents are reused, changed documents are split into fresh chunks, and removed objects are deleted from the index after a successful run.</p>
<p xmlns="http://www.w3.org/1999/xhtml">An admin starts the first Company Brain indexing run from the team's AI settings. Once enabled, Aamu checks the index periodically and refreshes only the material that changed.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">What Company Brain changes</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The practical shift is small but important. People no longer need to remember whether the answer was hidden in a task comment, meeting transcript, Doc, ticket, or database row before they can start searching.</p>
<p xmlns="http://www.w3.org/1999/xhtml">They can ask the question in the language of the work:</p>
<ul xmlns="http://www.w3.org/1999/xhtml">
  <li><p>What did we promise this customer?</p></li>
  <li><p>Which tasks mention the migration deadline?</p></li>
  <li><p>What decisions came out of the latest product meeting?</p></li>
  <li><p>Where is the current onboarding process documented?</p></li>
  <li><p>Do we already have a database row for this company?</p></li>
</ul>
<p xmlns="http://www.w3.org/1999/xhtml">Company Brain does not replace navigation, search, or maintained documentation. It connects them. AI can help find and explain the relevant information, while the linked Aamu objects remain the source of truth.</p>
`;

if (!API_KEY || !DOCS_API_KEY || !DB_ID) {
	throw new Error('API_KEY, DOCS_API_KEY, and AAMU_DB_ID/DB_ID are required.');
}
if (!fs.existsSync(HERO_PATH)) {
	throw new Error(`Hero image not found: ${HERO_PATH}`);
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

async function getBlogPosts() {
	const data = await graphql(`{
		BlogPostCollection {
			id title slug description publishDate status tags doc
			author { id name }
		}
	}`);
	return data.BlogPostCollection || [];
}

async function upsertBlogPost(posts, docId) {
	const existing = posts.find(post => post.slug === slug);
	const heroImage = {
		data: fs.readFileSync(HERO_PATH).toString('base64'),
		name: path.basename(HERO_PATH)
	};
	const data = await graphql(`
		mutation UpsertCompanyBrainPost(
			$id: ID, $title: String, $slug: String, $description: String,
			$publishDate: DateTime, $author: String, $status: String,
			$tags: [String], $doc: String, $heroImage: GraphQLMediaItemInput
		) {
			BlogPost(
				id: $id, title: $title, slug: $slug, description: $description,
				publishDate: $publishDate, author: $author, status: $status,
				tags: $tags, doc: $doc, heroImage: $heroImage
			) { id title slug status publishDate tags doc heroImage { name url } }
		}
	`, {
		id: existing?.id,
		title,
		slug,
		description,
		publishDate: existing?.publishDate || '2026-07-10T08:00:00.000Z',
		author: existing?.author?.id || AUTHOR_ID,
		status: 'published',
		tags: ['ai', 'company-brain', 'team-brain', 'knowledge', 'meetings'],
		doc: docId,
		heroImage
	});
	return { action: existing ? 'updated' : 'created', post: data.BlogPost };
}

const companyBrainHubSection = String.raw`
<h2 xmlns="http://www.w3.org/1999/xhtml">Company Brain: ask across the workspace</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Company Brain extends Aamu's grounded AI beyond selected support knowledge. Launch AI and <code>@ai</code> can retrieve information from tasks, Docs, meetings and transcripts, forms, file metadata, databases, Helpdesk tickets, the user's own email, newsletters, projects, and team members.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Retrieval is permission-aware: answers can use company-level information and only the projects available to the signed-in user. User-owned sources such as email have an additional owner check. Answers can include links back to the Aamu objects used as sources.</p>
<p xmlns="http://www.w3.org/1999/xhtml"><a href="/blog/posts/${slug}/">Read how Company Brain turns workspace data into permission-aware AI answers.</a></p>`;

function upsertSection(currentHtml, heading, section) {
	const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const pattern = new RegExp(`<h2[^>]*>${escapedHeading}<\\/h2>[\\s\\S]*?(?=<h2[^>]*>|$)`, 'i');
	return pattern.test(currentHtml)
		? currentHtml.replace(pattern, section.trim())
		: `${currentHtml.trim()}\n${section.trim()}`;
}

async function updateHubDoc(docs, posts) {
	const summaryTitle = 'AI support in Aamu.app';
	const summary = docs.find(doc => doc.title === summaryTitle);
	if (!summary) {
		throw new Error(`Doc not found: ${summaryTitle}`);
	}
	const fullData = await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(summary.id)}`, { headers: docsHeaders });
	const fullDoc = fullData.doc || fullData;
	const updatedHtml = upsertSection(fullDoc.html || '', 'Company Brain: ask across the workspace', companyBrainHubSection);
	await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(summary.id)}`, {
		method: 'PATCH',
		headers: docsHeaders,
		body: JSON.stringify({
			title: summaryTitle,
			status: fullDoc.status || 'public',
			html: updatedHtml,
			project_id: fullDoc.pid || PROJECT_ID,
			pid: fullDoc.pid || PROJECT_ID
		})
	});

	const hubPost = posts.find(post => post.slug === 'ai-support-in-aamuapp');
	if (hubPost) {
		await graphql(`mutation TouchHub($id: ID, $description: String, $tags: [String]) {
			BlogPost(id: $id, description: $description, tags: $tags) { id slug updated_at }
		}`, {
			id: hubPost.id,
			description: "A reading path for Aamu.app's AI support: Company Brain, Team Brain, AI commands, support knowledge, drafts, meetings, and human review.",
			tags: Array.from(new Set([...(hubPost.tags || []), 'company-brain']))
		});
	}

	return { id: summary.id, title: summaryTitle };
}

const docs = await getDocs();
const posts = await getBlogPosts();
const docResult = await upsertDoc(docs);
const postResult = await upsertBlogPost(posts, docResult.doc.id);
const hubResult = await updateHubDoc(docs, posts);

console.log(JSON.stringify({
	doc: { action: docResult.action, id: docResult.doc.id, title },
	blogPost: postResult,
	hero: { path: HERO_PATH, name: path.basename(HERO_PATH) },
	hub: { action: 'updated', ...hubResult }
}, null, 2));
