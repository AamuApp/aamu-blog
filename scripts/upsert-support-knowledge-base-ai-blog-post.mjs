import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';

const title = 'How to build a support knowledge base that AI can actually use';
const slug = 'how-to-build-a-support-knowledge-base-that-ai-can-actually-use';

const html = `<p xmlns="http://www.w3.org/1999/xhtml">A support knowledge base can look complete and still be almost useless to AI. It may have many pages, a polished help center, and years of old support answers, but if the knowledge is vague, duplicated, outdated, or written only for human browsing, an AI assistant will struggle to retrieve the right context and turn it into a safe customer reply.</p><p xmlns="http://www.w3.org/1999/xhtml">The useful question is not only “do we have documentation?” It is: can the support workflow find the right source, understand what it means, know when it applies, and avoid using it when the situation needs a human?</p><p xmlns="http://www.w3.org/1999/xhtml">That is the kind of knowledge base Aamu.app Team Brain is meant to use. Team Brain can retrieve company knowledge for Helpdesk drafts, live chat answers, triage, and API workflows, but retrieval works best when the source material is written like operational knowledge, not like a pile of disconnected notes.</p><p xmlns="http://www.w3.org/1999/xhtml">This article is a practical guide to building that kind of support knowledge base.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Start with the questions support actually gets</h2><p xmlns="http://www.w3.org/1999/xhtml">The best AI-ready knowledge base starts from real customer questions. Public product documentation is useful, but support teams usually need more than product descriptions. They need answers to the questions people ask when something is unclear, broken, risky, or tied to their account.</p><p xmlns="http://www.w3.org/1999/xhtml">A good starting list includes:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>common setup questions,</p></li><li><p>pricing and billing questions,</p></li><li><p>cancellation and refund policies,</p></li><li><p>known limitations and workarounds,</p></li><li><p>security and data handling explanations,</p></li><li><p>what to do when a customer asks for a human,</p></li><li><p>what to do when the answer depends on account-specific state, and</p></li><li><p>the tone the team wants in customer-facing replies.</p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">The point is not to document everything. The point is to document the reusable decisions that support people otherwise repeat from memory.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Write answers, not fragments</h2><p xmlns="http://www.w3.org/1999/xhtml">AI retrieval works poorly when the source material only contains fragments like “annual plans renew automatically” or “contact sales for enterprise.” Those fragments may be true, but they do not explain the customer-facing answer.</p><p xmlns="http://www.w3.org/1999/xhtml">A better source says what the team should actually communicate.</p><p xmlns="http://www.w3.org/1999/xhtml">Instead of:</p><blockquote xmlns="http://www.w3.org/1999/xhtml"><p>Refunds: case by case.</p></blockquote><p xmlns="http://www.w3.org/1999/xhtml">Write:</p><blockquote xmlns="http://www.w3.org/1999/xhtml"><p>If a customer asks for a refund, explain that refunds are reviewed case by case. Ask for the account email, the reason for the request, and whether the issue is related to billing, technical problems, or product fit. Do not promise a refund before a human has reviewed the account.</p></blockquote><p xmlns="http://www.w3.org/1999/xhtml">The second version gives AI enough context to draft a useful first reply without overpromising. It also tells the human reviewer what still needs judgment.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Separate facts, policies, and judgment</h2><p xmlns="http://www.w3.org/1999/xhtml">A knowledge base that AI can use should make a clear distinction between three kinds of knowledge.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Facts</strong> describe how the product works: where a setting lives, what an API endpoint does, which file formats are supported, or how a live chat widget behaves.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Policies</strong> describe what the company has decided: billing rules, refund conditions, escalation paths, data retention, security review, and what support is allowed to say.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Judgment</strong> describes when a person must decide: enterprise exceptions, emotional customers, legal language, account ownership, refunds, data deletion, abuse reports, or anything that depends on private account state.</p><p xmlns="http://www.w3.org/1999/xhtml">This distinction matters because AI can safely help with facts and many policy explanations, but it should not pretend to make account-specific business decisions. A good knowledge base says where the boundary is.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Include “do not answer” rules</h2><p xmlns="http://www.w3.org/1999/xhtml">AI support fails most visibly when it answers a question it should have escalated. The fix is not only better writing. The knowledge base needs explicit refusal and escalation rules.</p><p xmlns="http://www.w3.org/1999/xhtml">Useful rules include:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>Do not confirm account ownership without verification.</p></li><li><p>Do not promise refunds, credits, discounts, or legal commitments.</p></li><li><p>Do not make security claims unless the source specifically covers the topic.</p></li><li><p>Do not answer data deletion or export requests as completed actions.</p></li><li><p>Do not continue with a normal answer when the customer asks for a human.</p></li><li><p>Do not invent roadmap dates or feature commitments.</p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">These rules are especially important for live chat, where an AI answer may be shown directly to the visitor. For ticket and email workflows, the same rules help the draft generator prepare cautious text that a human can review.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Make source material small enough to retrieve</h2><p xmlns="http://www.w3.org/1999/xhtml">A single giant “Support policy” document is easy to create and hard to retrieve precisely. If one page contains billing, security, cancellation, onboarding, API limits, tone guidance, and escalation rules, retrieval may find the page but miss the specific part the answer needs.</p><p xmlns="http://www.w3.org/1999/xhtml">Use focused sources instead:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>Cancellation and renewal policy</p></li><li><p>Refund request handling</p></li><li><p>Self-hosting availability</p></li><li><p>Connecting Helpdesk email</p></li><li><p>Live chat human handoff</p></li><li><p>API key permission troubleshooting</p></li><li><p>Security review answers</p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">Each source should be complete enough to stand alone, but narrow enough that retrieving it is a strong signal.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Use the right source type</h2><p xmlns="http://www.w3.org/1999/xhtml">In Aamu, Team Brain knowledge can come from several source types. The right choice depends on how the material is maintained.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Page URL</strong> works well for a specific public page that already answers a question clearly.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Sitemap</strong> works when a public documentation site or help center is reasonably clean and current.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Manual FAQ</strong> is useful for short canonical answers that do not need a full document.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Aamu Doc</strong> is often the best fit for internal or semi-internal support knowledge: policies, reusable answer guides, escalation rules, and product explanations the team wants to maintain directly in the workspace.</p><p xmlns="http://www.w3.org/1999/xhtml"><strong>Resolved Helpdesk tickets</strong> can be useful when past answers are still accurate, but they need caution. Old tickets may contain outdated wording, one-off exceptions, or account-specific context that should not become a general answer.</p><p xmlns="http://www.w3.org/1999/xhtml">The safest pattern is to turn repeated resolved answers into maintained Docs or FAQ snippets, then let those maintained sources become Team Brain context.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Write in the language customers use</h2><p xmlns="http://www.w3.org/1999/xhtml">Support knowledge should include the words customers actually use, not only internal product names. If customers ask about “chat bot,” “support widget,” or “talking to a real person,” the source should make it clear that this maps to Livechat, AI answers, and human handoff.</p><p xmlns="http://www.w3.org/1999/xhtml">This does not mean stuffing keywords. It means writing naturally enough that retrieval can connect the customer's question to the company's answer.</p><p xmlns="http://www.w3.org/1999/xhtml">A good source often includes:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>the internal feature name,</p></li><li><p>common customer wording,</p></li><li><p>one or two example questions, and</p></li><li><p>the answer the team wants to give.</p></li></ul><h2 xmlns="http://www.w3.org/1999/xhtml">Add examples of good answers</h2><p xmlns="http://www.w3.org/1999/xhtml">Tone is hard to infer from policy bullets. If the team wants answers to be short, warm, careful, or direct, include examples.</p><p xmlns="http://www.w3.org/1999/xhtml">For example:</p><blockquote xmlns="http://www.w3.org/1999/xhtml"><p>Customer asks: “Can I talk to someone?”</p><p>Good answer: “Sure. I can ask a human support person to take over this chat. Please add any details that would help them understand the issue.”</p><p>Do not answer by continuing to explain the product. The customer's intent is human help, not a knowledge question.</p></blockquote><p xmlns="http://www.w3.org/1999/xhtml">Examples help AI draft in the team's style, but they also help new support people understand the operating principle behind the answer.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Test with retrieval preview before trusting it</h2><p xmlns="http://www.w3.org/1999/xhtml">A knowledge base is not ready just because the sources have been added. It should be tested with realistic questions.</p><p xmlns="http://www.w3.org/1999/xhtml">In Aamu, the Team Brain retrieval preview is useful for this. Ask the questions customers actually ask and check what sources are retrieved.</p><p xmlns="http://www.w3.org/1999/xhtml">A practical test set might include:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>Can I cancel before the renewal date?</p></li><li><p>Can Aamu be self-hosted?</p></li><li><p>Can AI reply to live chat automatically?</p></li><li><p>Can we generate email drafts without sending them?</p></li><li><p>Where do I configure the support mailbox?</p></li><li><p>Can I speak to a human?</p></li><li><p>What API permissions do I need for Team Brain retrieval?</p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">If the wrong source appears, the fix may be to rename a Doc, split a long source, add clearer wording, remove stale material, or create a better canonical answer.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Measure knowledge gaps, not only reply speed</h2><p xmlns="http://www.w3.org/1999/xhtml">Many teams judge AI support by response time. Speed matters, but it is not the whole story. A better measure is how often AI reveals missing or weak knowledge.</p><p xmlns="http://www.w3.org/1999/xhtml">Track questions like:</p><ul xmlns="http://www.w3.org/1999/xhtml"><li><p>Which drafts needed major edits?</p></li><li><p>Which questions failed to retrieve a useful source?</p></li><li><p>Which support answers required a person because no policy existed?</p></li><li><p>Which resolved tickets should become maintained Docs?</p></li><li><p>Which Docs are retrieved often and need extra care?</p></li><li><p>Which sources are never retrieved and may be too vague or unnecessary?</p></li></ul><p xmlns="http://www.w3.org/1999/xhtml">This turns AI support into a knowledge improvement loop. The team is not only answering faster; it is learning which knowledge deserves maintenance.</p><h2 xmlns="http://www.w3.org/1999/xhtml">Keep public and internal knowledge separate</h2><p xmlns="http://www.w3.org/1999/xhtml">Some support knowledge should be public: setup guides, feature explanations, pricing pages, and help center articles. Other knowledge should stay internal: escalation rules, refund review notes, account risk signals, special customer arrangements, or security review instructions.</p><p xmlns="http://www.w3.org/1999/xhtml">A useful AI support system can use both, but the sources should be labeled and written carefully. Internal knowledge can guide a draft without being quoted directly to the customer. Public knowledge can be linked or paraphrased more freely.</p><p xmlns="http://www.w3.org/1999/xhtml">When the distinction matters, write it into the source. For example:</p><blockquote xmlns="http://www.w3.org/1999/xhtml"><p>This section is internal guidance. Use it to decide whether to escalate. Do not quote it directly to customers.</p></blockquote><h2 xmlns="http://www.w3.org/1999/xhtml">Review old answers before using old tickets</h2><p xmlns="http://www.w3.org/1999/xhtml">Resolved tickets are tempting because they contain real support language. They also contain risk. An old answer may have been right for one customer, one plan, one date, or one product state. It may mention a temporary workaround that is no longer safe.</p><p xmlns="http://www.w3.org/1999/xhtml">If resolved tickets are enabled as a Team Brain source, treat them as historical support memory, not as final policy. For recurring questions, promote the best current answer into a maintained Doc or Manual FAQ. That gives AI a cleaner source for future drafts.</p><h2 xmlns="http://www.w3.org/1999/xhtml">A simple structure for an AI-ready support article</h2><p xmlns="http://www.w3.org/1999/xhtml">A useful support knowledge article can follow a repeatable structure:</p><ol xmlns="http://www.w3.org/1999/xhtml"><li><p><strong>Question</strong>: the customer question this source answers.</p></li><li><p><strong>Short answer</strong>: the safe customer-facing answer.</p></li><li><p><strong>When it applies</strong>: plans, regions, settings, product state, or exceptions.</p></li><li><p><strong>When to escalate</strong>: cases that need a person.</p></li><li><p><strong>Good reply example</strong>: wording the team would be comfortable sending.</p></li><li><p><strong>Do not say</strong>: promises, claims, or shortcuts to avoid.</p></li><li><p><strong>Related links</strong>: docs, settings, tasks, policy pages, or source material.</p></li></ol><p xmlns="http://www.w3.org/1999/xhtml">This format is good for AI because it gives retrieval a clear target and gives the draft generator enough context to write carefully.</p><h2 xmlns="http://www.w3.org/1999/xhtml">What this looks like in Aamu</h2><p xmlns="http://www.w3.org/1999/xhtml">In Aamu, the workflow can be simple:</p><ol xmlns="http://www.w3.org/1999/xhtml"><li><p>Create or improve an Aamu Doc for a recurring support question.</p></li><li><p>Add it as a Team Brain source for the Helpdesk project.</p></li><li><p>Reindex Team Brain.</p></li><li><p>Use retrieval preview with real customer questions.</p></li><li><p>Generate Helpdesk or Email reply drafts from Team Brain context.</p></li><li><p>Review the drafts and improve the source Doc when the answer is weak.</p></li></ol><p xmlns="http://www.w3.org/1999/xhtml">That loop is the important part. A knowledge base that AI can actually use is not a one-time content project. It is a support operating habit.</p><h2 xmlns="http://www.w3.org/1999/xhtml">The bottom line</h2><p xmlns="http://www.w3.org/1999/xhtml">AI does not make a weak knowledge base strong. It makes the quality of the knowledge base more visible.</p><p xmlns="http://www.w3.org/1999/xhtml">If the sources are vague, duplicated, stale, or missing escalation rules, AI will produce confident but fragile drafts. If the sources are clear, scoped, current, and written around real support questions, AI can help the team answer faster without losing control.</p><p xmlns="http://www.w3.org/1999/xhtml">The best support knowledge base is not just a library of articles. It is a maintained set of answers, policies, examples, and boundaries that both people and AI can use.</p>`;

const post = {
	title,
	slug,
	description: 'How to write support policies, product answers, escalation rules, and examples so AI can retrieve useful context instead of guessing.',
	publishDate: '2026-06-06T08:00:00.000Z',
	author: '29940627-51e8-4fd0-82ab-d718ddfe802f',
	status: 'published',
	tags: ['ai', 'helpdesk', 'team-brain', 'docs'],
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

	if (data?.errors?.length) {
		throw new Error(data.errors.map(error => error?.message || String(error)).join('; '));
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
