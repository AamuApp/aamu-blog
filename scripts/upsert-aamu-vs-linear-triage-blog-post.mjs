import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';

const title = 'Aamu.app vs Linear Triage: customer conversations, Team Brain, and human-reviewed AI support';
const slug = 'aamuapp-vs-linear-triage-customer-conversations-team-brain-human-reviewed-ai-support';

const html = `<p xmlns="http://www.w3.org/1999/xhtml">Linear has built one of the clearest modern triage workflows for product and engineering teams. A new issue enters a team inbox, someone reviews it, and the team decides whether to accept it, decline it, mark it as a duplicate, snooze it, route it, label it, or assign it.</p><p xmlns="http://www.w3.org/1999/xhtml">That is a strong pattern. It keeps the backlog cleaner. It reduces random work landing directly in active queues. It gives product and engineering teams a controlled way to turn incoming requests, bugs, and support escalations into actual issues.</p><p xmlns="http://www.w3.org/1999/xhtml">Aamu.app's Helpdesk AI triage starts from a different problem. Aamu is not only asking: "Where should this issue go?" It is asking: "What is this customer trying to say, can we answer safely, what knowledge do we have, what knowledge is missing, should a human take over, should we create follow-up work, and can this answer become reusable Team Brain knowledge?"</p><p xmlns="http://www.w3.org/1999/xhtml">That difference matters. Linear triage is strongest as product work intake. Aamu triage is strongest as customer conversation intake.</p><p xmlns="http://www.w3.org/1999/xhtml">This comparison is based on Linear's public documentation for <a target="_blank" rel="noopener noreferrer nofollow" href="https://linear.app/docs/triage">Triage</a>, <a target="_blank" rel="noopener noreferrer nofollow" href="https://linear.app/docs/triage-intelligence">Triage Intelligence</a>, and <a target="_blank" rel="noopener noreferrer nofollow" href="https://linear.app/docs/linear-agent">Linear Agent automations</a>, and on how Aamu Helpdesk AI triage connects Helpdesk, Tasks, Docs, and Team Brain.</p><h2 xmlns="http://www.w3.org/1999/xhtml">What Linear triage is optimized for</h2><p xmlns="http://www.w3.org/1999/xhtml">Linear describes Triage as a special inbox for issues created by integrations, other teams, or people outside the owning team. Before an issue enters the normal workflow, the team can review and decide what should happen to it.</p><p xmlns="http://www.w3.org/1999/xhtml">The core actions are deliberately issue-shaped:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p><strong>Accept</strong> the issue into the team's workflow.</p></li><li><p><strong>Mark as duplicate</strong> and merge it into an existing canonical issue.</p></li><li><p><strong>Decline</strong> the issue and optionally explain why.</p></li><li><p><strong>Snooze</strong> the issue until later or until there is new activity.</p></li><li><p><strong>Route</strong> the issue to another team, status, assignee, label, project, or priority.</p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">That is excellent for software teams because most incoming work eventually needs to become structured backlog data. The key question is not usually "what should we write back to this customer?" It is "does this belong in our product workflow, and if so, where?"</p><p xmlns="http://www.w3.org/1999/xhtml">Linear also adds several automation layers around that workflow. Triage Rules apply deterministic actions when issues match configured conditions. Triage Intelligence uses AI to suggest properties and relationships, such as team, project, assignee, labels, related issues, and duplicates. Linear Agent automations can perform more flexible instruction-based actions when issues enter triage.</p><p xmlns="http://www.w3.org/1999/xhtml">Together, those features make Linear triage feel like an intelligent intake system for product and engineering work.</p><h2 xmlns="http://www.w3.org/1999/xhtml">What Aamu triage is optimized for</h2><p xmlns="http://www.w3.org/1999/xhtml">Aamu Helpdesk AI triage starts from a customer message, not an issue card. That changes the shape of the workflow.</p><p xmlns="http://www.w3.org/1999/xhtml">A customer message may contain a product question, a complaint, a sales signal, a security concern, a bug report, a missing policy, a request for a human, or several of those at once. The next action might be a reply draft, a task, an assignment, a new Doc, a search for an existing Doc, or a Team Brain update.</p><p xmlns="http://www.w3.org/1999/xhtml">Aamu's triage result can therefore include:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p><strong>Intent</strong>: what the customer is asking.</p></li><li><p><strong>Suggested action</strong>: for example, reply, assign to human, create follow-up work, or search existing Docs.</p></li><li><p><strong>Summary</strong>: what the ticket is about in plain language.</p></li><li><p><strong>Suggested reply</strong>: a draft when it is appropriate to prepare one.</p></li><li><p><strong>Suggested follow-up work</strong>: a task when the answer needs investigation or product input.</p></li><li><p><strong>Risk flags</strong>: reasons the user should not answer too confidently.</p></li><li><p><strong>Relevant knowledge</strong>: what Team Brain or Aamu Docs can confirm, and what is missing.</p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">This is less like classifying a backlog item and more like helping a support person decide what is true, what is safe, and what should happen next.</p><h2 xmlns="http://www.w3.org/1999/xhtml">A simple example</h2><p xmlns="http://www.w3.org/1999/xhtml">Imagine a customer writes:</p><blockquote xmlns="http://www.w3.org/1999/xhtml"><p>Can Aamu.app be self-hosted?</p></blockquote><p xmlns="http://www.w3.org/1999/xhtml">In Linear, this might become an issue or an Asks request. The triage workflow might route it to the right team, add a customer label, link it to an existing issue about self-hosting, or assign someone to respond.</p><p xmlns="http://www.w3.org/1999/xhtml">In Aamu, the first concern is different. The support team needs a correct customer-facing answer. Self-hosting is not the kind of question AI should improvise from general SaaS assumptions. The answer should come from a maintained policy.</p><p xmlns="http://www.w3.org/1999/xhtml">Aamu triage can say: this is a self-hosting availability question, the answer has security and commercial implications, do not make claims unless policy knowledge confirms them, and look for an existing Doc or Team Brain source before drafting a reply.</p><p xmlns="http://www.w3.org/1999/xhtml">If a policy Doc exists but is not yet part of that Helpdesk project's Team Brain sources, Aamu can make that visible. The user can add the Doc to Team Brain, reindex it, and then ask AI to draft the reply from the newly available source.</p><p xmlns="http://www.w3.org/1999/xhtml">That is the Aamu difference: the support ticket does not only become work. It can also improve the knowledge system that future support answers depend on.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Side-by-side comparison</h2><table xmlns="http://www.w3.org/1999/xhtml"><thead><tr><th colspan="1" rowspan="1"><p>Area</p></th><th colspan="1" rowspan="1"><p>Linear</p></th><th colspan="1" rowspan="1"><p>Aamu.app</p></th></tr></thead><tbody><tr><td colspan="1" rowspan="1"><p>Primary object</p></td><td colspan="1" rowspan="1"><p>Issue</p></td><td colspan="1" rowspan="1"><p>Customer message or Helpdesk item</p></td></tr><tr><td colspan="1" rowspan="1"><p>Main workflow</p></td><td colspan="1" rowspan="1"><p>Review incoming issues before they enter the team's normal workflow</p></td><td colspan="1" rowspan="1"><p>Understand a customer request, decide the next action, and prepare a safe response</p></td></tr><tr><td colspan="1" rowspan="1"><p>Best automation fit</p></td><td colspan="1" rowspan="1"><p>Routing, labels, assignees, priority, projects, duplicates, related issues</p></td><td colspan="1" rowspan="1"><p>Intent, summaries, risk flags, reply drafts, tasks, Docs, Team Brain sources, human assignment</p></td></tr><tr><td colspan="1" rowspan="1"><p>Knowledge base</p></td><td colspan="1" rowspan="1"><p>Existing issues, historical workspace patterns, integrations, and agent context</p></td><td colspan="1" rowspan="1"><p>Team Brain, Aamu Docs, Helpdesk knowledge sources, and maintained support policies</p></td></tr><tr><td colspan="1" rowspan="1"><p>Human decision</p></td><td colspan="1" rowspan="1"><p>Accept, decline, snooze, merge, route, or adjust issue properties</p></td><td colspan="1" rowspan="1"><p>Approve AI reasoning, assign a human, update knowledge, review drafts, and send replies</p></td></tr><tr><td colspan="1" rowspan="1"><p>Strongest product story</p></td><td colspan="1" rowspan="1"><p>Keep the product backlog organized as intake scales</p></td><td colspan="1" rowspan="1"><p>Turn customer conversations into better answers and reusable company knowledge</p></td></tr></tbody></table><h2 xmlns="http://www.w3.org/1999/xhtml">Where Linear is ahead</h2><p xmlns="http://www.w3.org/1999/xhtml">Linear is more mature as a formal triage system for product teams. Its Triage view is a first-class workflow. The actions are clear. Keyboard shortcuts are fast. Rules are configurable. Triage Intelligence has a specific job: analyze incoming issues against historical workspace behavior and suggest the right issue properties or relationships.</p><p xmlns="http://www.w3.org/1999/xhtml">There are several ideas Aamu can learn from Linear.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Rules before AI.</strong> Not every triage decision needs an LLM. If a Helpdesk message is about billing, route it to billing. If it mentions security review, flag it as high risk. If it comes from an enterprise customer, assign a specific owner. Deterministic rules are easier to trust, faster to run, and simpler to audit.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Configurable auto-apply.</strong> Linear lets teams decide whether suggestions should be shown, hidden, or automatically applied for different property types. Aamu can use a similar idea for support metadata: labels, priority, assignee, task creation, or escalation. Customer replies should still require more caution, but lower-risk metadata can often be automated.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Duplicate and related detection.</strong> Linear's duplicate detection is especially valuable because backlog quality depends on grouping similar work. In Aamu, the equivalent is similar ticket and related knowledge detection. If ten customers ask the same thing, Aamu should help the team see that pattern, reuse the best answer, and improve the source Doc.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Triage responsibility.</strong> Linear's responsibility model gives teams a clear owner for incoming triage work. Aamu could apply the same idea to Helpdesk: who is currently responsible for AI-flagged tickets, unresolved knowledge gaps, or high-risk customer conversations?</p><h2 xmlns="http://www.w3.org/1999/xhtml">Where Aamu has a different advantage</h2><p xmlns="http://www.w3.org/1999/xhtml">Aamu's advantage is that its triage can stay close to the customer conversation and the company knowledge needed to answer it.</p><p xmlns="http://www.w3.org/1999/xhtml">A Helpdesk item can lead directly to a reply draft. It can also lead to a task when someone needs to investigate. It can lead to a Doc when the team needs a maintained policy. It can lead to Team Brain source updates when the right knowledge exists but is not yet available to AI. It can lead to human assignment when the situation is sensitive.</p><p xmlns="http://www.w3.org/1999/xhtml">That makes Aamu triage especially useful for support and customer success teams. The goal is not only to put work into the right bucket. The goal is to answer customers well and make the next similar answer easier.</p><p xmlns="http://www.w3.org/1999/xhtml">This is also why Aamu's human-in-the-loop model matters. Aamu can draft a reply, but sending the reply is a separate explicit action. AI can create or find a Doc, but the team decides whether that Doc should become a Helpdesk knowledge source. AI can suggest assignment, but the user can choose who should own the ticket.</p><p xmlns="http://www.w3.org/1999/xhtml">For customer communication, that separation is not friction. It is trust infrastructure.</p><h2 xmlns="http://www.w3.org/1999/xhtml">The knowledge loop is the product wedge</h2><p xmlns="http://www.w3.org/1999/xhtml">The most important Aamu idea is the knowledge loop:</p><ol xmlns="http://www.w3.org/1999/xhtml"><li><p>A customer asks a question.</p></li><li><p>AI triage identifies the intent and risk.</p></li><li><p>Team Brain retrieves what the company already knows.</p></li><li><p>If the knowledge is missing, AI can suggest a Doc or task.</p></li><li><p>If the knowledge exists but is not connected, the user can add it to Team Brain sources.</p></li><li><p>The user can reindex Team Brain and ask AI to draft again.</p></li><li><p>A human reviews and sends the final reply.</p></li><li><p>The improved knowledge helps future tickets.</p></li></ol><p xmlns="http://www.w3.org/1999/xhtml">Linear's loop is backlog quality: similar work gets grouped, routed, labeled, and prioritized better over time.</p><p xmlns="http://www.w3.org/1999/xhtml">Aamu's loop is support knowledge quality: repeated customer questions become maintained answers, Docs, and Team Brain sources.</p><p xmlns="http://www.w3.org/1999/xhtml">Both are valuable. They are just solving different intake problems.</p><h2 xmlns="http://www.w3.org/1999/xhtml">What Aamu should borrow from Linear</h2><p xmlns="http://www.w3.org/1999/xhtml">Aamu should not copy Linear's product shape too literally. It should borrow the parts that make triage feel dependable.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>First, add a visible rules layer.</strong> Helpdesk teams should be able to define simple rules before AI runs: route billing to a person, mark security questions as high risk, assign Finnish-language tickets to Finnish speakers, or always create a task for certain enterprise requests.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Second, make AI suggestions more actionable.</strong> A triage report should not be only text. If AI suggests assigning to a human, show the assignment control. If it suggests creating a task, show a create-task action. If it finds a Doc outside Team Brain, show Add to Team Brain sources. If the source list changed, show Reindex Team Brain now.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Third, separate suggestion types by risk.</strong> Labels and summaries can be low risk. Assignments are medium risk. Customer replies, policy commitments, refunds, security answers, and sending messages are high risk. Aamu should let teams automate low-risk actions while keeping high-risk actions human-reviewed.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Fourth, detect repeated questions.</strong> Aamu should treat similar support tickets as a signal that the knowledge base needs work. If many customers ask the same question, the answer should probably become a maintained Doc or Team Brain source.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Fifth, report triage outcomes.</strong> Teams should be able to see how many tickets were answered from Team Brain, how many required a human, how many revealed missing knowledge, and which Docs or policies were most often needed.</p><h2 xmlns="http://www.w3.org/1999/xhtml">What Linear should not define for Aamu</h2><p xmlns="http://www.w3.org/1999/xhtml">The danger in comparing with Linear is copying the wrong center of gravity.</p><p xmlns="http://www.w3.org/1999/xhtml">Linear is intentionally issue-centric. That is the right choice for a product development system. Aamu should remain conversation-centric when the work begins in Helpdesk. The customer message, the AI triage, the reply draft, the linked Doc, the Team Brain source, and the follow-up task should all remain visible together.</p><p xmlns="http://www.w3.org/1999/xhtml">Aamu should also avoid making AI feel like an opaque routing engine. Support teams need to see why AI thinks a question is risky, what knowledge it used, what it could not find, and what action it is proposing. This is especially important when the next step is a customer-facing answer.</p><p xmlns="http://www.w3.org/1999/xhtml">The best version of Aamu triage is not "Linear, but for support tickets." It is a support workspace where customer questions improve the team's knowledge and where AI remains close to the human review workflow.</p><h2 xmlns="http://www.w3.org/1999/xhtml">The bottom line</h2><p xmlns="http://www.w3.org/1999/xhtml">Linear triage and Aamu triage are both about intake, but they optimize for different outcomes.</p><p xmlns="http://www.w3.org/1999/xhtml">Linear helps product and engineering teams keep incoming issues organized: accept, decline, route, label, assign, detect duplicates, and connect related work.</p><p xmlns="http://www.w3.org/1999/xhtml">Aamu helps support teams understand customer conversations, answer from maintained knowledge, create follow-up work, update Docs, connect knowledge to Team Brain, and keep a human in control of customer-facing replies.</p><p xmlns="http://www.w3.org/1999/xhtml">A good shorthand is this: Linear triages work items. Aamu triages customer conversations and turns them into answers, tasks, and reusable company knowledge.</p>`;

const post = {
	title,
	slug,
	description:
		'A practical comparison of Linear Triage and Aamu.app Helpdesk AI triage: product issue intake versus customer conversation intake.',
	body: '',
	publishDate: '2026-06-05T14:00:00.000Z',
	author: '29940627-51e8-4fd0-82ab-d718ddfe802f',
	status: 'published',
	tags: ['ai', 'helpdesk', 'triage', 'linear'],
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
		throw new Error(data?.error?.message || `HTTP ${response.status}`);
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
		{ id: existingId, ...post, doc: docId },
	);

	return { action: existingId ? 'updated' : 'created', post: data.BlogPost };
}

const docResult = await upsertDoc();
const docId = docResult.doc.id;
const postResult = await upsertBlogPost(docId);

console.log(JSON.stringify({ doc: { action: docResult.action, id: docId, title }, blogPost: postResult }, null, 2));
