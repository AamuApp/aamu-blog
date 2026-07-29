import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const PROJECT_ID =
	process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';

const title = 'Introducing Aamu Slides: spatial presentations inside your workspace';
const slug = 'introducing-aamu-slides-spatial-presentations-inside-your-workspace';

const html = String.raw`<p xmlns="http://www.w3.org/1999/xhtml">Presentations often begin in the same place as the rest of a team's work: project notes, plans, research, images, decisions, and conversations. Moving that material into a separate presentation service creates another account, another permission model, and another place where the final result can become detached from its source.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu Slides brings presentation decks into Aamu.app. A deck belongs to an Aamu project, appears in that project's Slides list, and opens with the same Aamu identity and project access as the rest of the workspace. There is no separate Slides account for the team to manage.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">A focused presentation editor</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Open Slides from an Aamu project to see the decks connected to that project. From there, a deck opens in a focused editor with a large active slide, slide thumbnails, design controls, arranging tools, and Present mode.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The editor is designed for direct visual work. Add text and images, position objects on the canvas, choose the active slide from the thumbnail rail, reorder the deck, and adjust the slide background and design. Images can be dropped directly onto the slide and then moved and resized as part of the composition.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu Slides stores uploaded images in Aamu's object storage and keeps the deck data in the Slides service. Refreshing the editor or returning through the Aamu project restores the same deck instead of creating a disconnected browser-only copy.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Spatial presentations, not only a sequence of rectangles</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu Slides is based on <a href="https://strut.io/" target="_blank" rel="noopener noreferrer">Strut</a>, an open-source editor for spatial presentations. Strut keeps the familiar idea of slides while adding a larger space in which those slides can be arranged. A presentation can still move in a normal sequence, but it can also use position, scale, rotation, and camera movement to show how ideas relate.</p>
<p xmlns="http://www.w3.org/1999/xhtml">That makes the format useful for more than a conventional linear deck. A product story can move from a broad system view into one detail. A roadmap can place related themes near each other. A workshop can use space to make branches and alternatives visible. The presentation becomes a route through a visual structure rather than only a stack of pages.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The Arrange view is where the deck's spatial structure can be shaped. The normal editor remains focused on one slide at a time, so everyday editing does not require working on the full spatial canvas.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Present from the same deck you edit</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Present mode plays the deck directly from the editor. Move through the slides, exit the presentation, and continue editing from the selected slide. There is no separate export step required just to show the current version.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Because the deck remains attached to its Aamu project, teammates can find it where the related work already lives. The project list provides the workspace entry point, while the Slides editor provides the dedicated canvas needed for presentation design.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">One Aamu identity and project boundary</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The integration is more than a link to another application. Aamu opens Slides through an authenticated handoff and scopes decks to the current team and project. The Slides service verifies that context before allowing access, and the deck metadata is synchronized back to Aamu so the project list stays current.</p>
<p xmlns="http://www.w3.org/1999/xhtml">This matters when presentations contain internal plans, customer material, or unfinished product thinking. The team should not need to recreate the project's membership in a second tool before it can begin working on a deck.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Built on open source</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The presentation editor comes from the open-source <a href="https://github.com/tantaman/strut" target="_blank" rel="noopener noreferrer">tantaman/strut</a> project. Its current implementation combines a React editor with Rindle for optimistic data and live synchronization. The upstream project describes Strut and its hosted version at <a href="https://strut.io/" target="_blank" rel="noopener noreferrer">strut.io</a>.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu maintains an <a href="https://github.com/AamuApp/strut" target="_blank" rel="noopener noreferrer">AamuApp/strut fork</a> for the workspace integration, Aamu authentication, project scoping, Aamu Slides identity, storage configuration, and self-hosted deployment. Improvements that are useful outside the Aamu integration can be proposed back to the upstream project.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Using an open-source foundation also keeps the implementation inspectable. The editor, data model, and integration changes can be reviewed instead of being hidden behind a presentation service that the workspace can only link to.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">A natural home for project presentations</h2>
<p xmlns="http://www.w3.org/1999/xhtml">A presentation is usually not an isolated artifact. It summarizes work that already exists: a plan, a proposal, a design direction, a report, a workshop, or a decision. Aamu Slides gives that artifact a dedicated visual editor without removing it from the project that gives it meaning.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The practical workflow is simple: open the project's Slides list, open or create a deck, build the slides in the focused editor, arrange the presentation when spatial structure helps, and present it from the same place. The team stays in Aamu, while Strut provides the presentation canvas.</p>`;

const post = {
	title,
	slug,
	description:
		'Introducing Aamu Slides, an Aamu-integrated presentation editor built on the open-source Strut project with shared authentication, project-scoped decks, spatial arranging, image uploads, and Present mode.',
	publishDate: '2026-07-29T05:00:00.000Z',
	author: '29940627-51e8-4fd0-82ab-d718ddfe802f',
	status: 'draft',
	tags: ['slides', 'presentations', 'workspace', 'open-source', 'strut'],
};

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
		const data = await requestJson(
			`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(existing.id)}`,
			{ method: 'PATCH', headers, body },
		);
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
const postResult = process.env.DOC_ONLY === '1' ? null : await upsertBlogPost(docId);

console.log(
	JSON.stringify(
		{ doc: { action: docResult.action, id: docId, title }, blogPost: postResult },
		null,
		2,
	),
);
