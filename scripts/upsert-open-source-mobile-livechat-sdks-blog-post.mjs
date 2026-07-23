import { readFile } from 'node:fs/promises';
import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const FILES_API_KEY = process.env.FILES_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';

const title = 'Open-source Livechat clients for web, Android, and iOS';
const slug = 'open-source-livechat-clients-for-web-android-and-ios';
const previousTitle = 'Open-source Livechat SDKs for Android and iOS';
const previousSlug = 'open-source-livechat-sdks-for-android-and-ios';
const heroImagePath = new URL('../assets/images/open-source-mobile-livechat-sdks.jpg', import.meta.url);
const heroImageName = 'open-source-mobile-livechat-sdks.jpg';
const heroImageType = 'image/jpeg';

const html = String.raw`<p xmlns="http://www.w3.org/1999/xhtml">We now provide open-source Aamu Livechat clients for the web, Android, and iOS. <a href="https://github.com/AamuApp/aamu-livechat-web" target="_blank" rel="noopener noreferrer">Aamu Livechat for the web</a> is a ready-made web client that can be embedded in a website.</p>
<p xmlns="http://www.w3.org/1999/xhtml">A web chat widget can bring customer conversations into a website with one embedded component. Mobile applications need a different integration boundary. Their navigation, visual language, accessibility behavior, lifecycle, and state management already belong to the native application.</p>
<p xmlns="http://www.w3.org/1999/xhtml">That is why we have created two open-source, headless Aamu Livechat client libraries: one for Android and one for iOS. They handle the Livechat protocol and leave the interface to the application that embeds them.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The source is available now:</p>
<ul xmlns="http://www.w3.org/1999/xhtml">
  <li><p><a href="https://github.com/ile/aamu-livechat-android" target="_blank" rel="noopener noreferrer">Aamu Livechat for Android</a></p></li>
  <li><p><a href="https://github.com/AamuApp/aamu-livechat-ios" target="_blank" rel="noopener noreferrer">Aamu Livechat for iOS</a></p></li>
</ul>

<h2 xmlns="http://www.w3.org/1999/xhtml">Headless means the application owns the experience</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Neither library contains a chat window, message list, email form, buttons, colors, animations, or other ready-made UI. Instead, the library publishes connection state and typed events. The host application decides how those values should appear.</p>
<p xmlns="http://www.w3.org/1999/xhtml">This makes the clients useful in applications that already have their own design system. A banking app, an internal operations tool, and a consumer mobile product may all want Livechat, but they should not be forced into the same navigation pattern or visual component.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The application can build the experience with Jetpack Compose, Android Views, SwiftUI, UIKit, or its existing presentation architecture. It can show Livechat as a full-screen support view, a sheet, part of an account page, or a flow connected to an existing Help section.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">What the libraries handle</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The Android and iOS clients implement the same Livechat protocol responsibilities:</p>
<ul xmlns="http://www.w3.org/1999/xhtml">
  <li><p>opening and closing the secure WebSocket connection,</p></li>
  <li><p>serializing outgoing commands and parsing incoming JSON messages,</p></li>
  <li><p>persisting the user and chat session identifiers,</p></li>
  <li><p>sending heartbeats and detecting stale connections,</p></li>
  <li><p>reconnecting after a connection closes,</p></li>
  <li><p>starting, continuing, and ending a chat,</p></li>
  <li><p>publishing agent availability and queue information,</p></li>
  <li><p>handling AI availability and thinking events,</p></li>
  <li><p>restoring message history and correlating message acknowledgements,</p></li>
  <li><p>sending Email fallback messages,</p></li>
  <li><p>sending post-chat feedback, and</p></li>
  <li><p>requesting signed URLs for attachments.</p></li>
</ul>
<p xmlns="http://www.w3.org/1999/xhtml">The application remains responsible for user input, rendering, accessibility, file selection, and deciding when the client should connect or disconnect.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">One protocol, two native APIs</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The two libraries share a platform-independent protocol contract, but each exposes the result in a way that feels natural on its platform.</p>
<p xmlns="http://www.w3.org/1999/xhtml"><strong>Android</strong> is implemented in Kotlin. Livechat state is exposed as a <code>StateFlow</code>, while messages and other one-time events are exposed through a <code>SharedFlow</code>. Session identifiers can be stored with the included <code>SharedPreferencesSessionStore</code>. The library supports Android API level 23 and newer and is structured as an Android library that can be published as an AAR/Maven artifact.</p>
<pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-kotlin">val client = LivechatClient(
    config = LivechatConfig(host = "your-tenant", pid = "your-widget"),
    sessionStore = SharedPreferencesSessionStore(context)
)

lifecycleScope.launch {
    client.events.collect { event -&gt;
        // Update your application's own state and UI.
    }
}

client.connect()
client.startChat("Hello")</code></pre>
<p xmlns="http://www.w3.org/1999/xhtml"><strong>iOS</strong> is a Swift Package. It publishes typed events through an event handler and stores session identifiers through the included <code>UserDefaultsSessionStore</code>. It supports iOS 13 and newer and can be integrated as a local package today or through a Git repository dependency.</p>
<pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-swift">let configuration = try LivechatConfiguration(
    host: "your-tenant",
    pid: "your-widget"
)

let client = LivechatClient(
    configuration: configuration,
    sessionStore: UserDefaultsSessionStore()
)

client.onEvent = { event in
    // Update your application's own state and UI.
}

client.connect()
try client.startChat(message: "Hello")</code></pre>

<h2 xmlns="http://www.w3.org/1999/xhtml">Chat and Email use the same session context</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Livechat can report that chat is available, that only a human agent is unavailable, or that the connection cannot currently reach the chat service. The host application can use that state to offer the right contact path.</p>
<p xmlns="http://www.w3.org/1999/xhtml">When the WebSocket is available, an Email message can travel through the normal protocol. When it is not, both libraries can use the HTTPS Email fallback endpoint. The SDK reports sending, success, and failure state while the application decides how to ask for a name, email address, and message.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Mobile lifecycle is explicit</h2>
<p xmlns="http://www.w3.org/1999/xhtml">A mobile application should not assume that a foreground WebSocket will remain active indefinitely in the background. The intended integration is explicit: connect when the owning application flow becomes active, disconnect when it leaves the foreground, and reconnect when it returns.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The current protocol does not include APNs or Firebase Cloud Messaging push delivery. Background chat notifications would need a separate server-side push contract. Keeping that boundary clear prevents the SDK from promising background behavior the operating system cannot guarantee through a normal WebSocket.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">A deliberately small attachment boundary</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The libraries can request a signed upload URL, but they do not open a system file picker or provide an upload interface. The application selects the file and decides how progress should be displayed.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Protocol version 1.0 does not include a correlation identifier in the signed URL response, so the clients permit only one pending signed URL request. This limitation is documented rather than hidden. A future protocol version can add a request identifier and safely allow concurrent requests.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Why open source</h2>
<p xmlns="http://www.w3.org/1999/xhtml">A customer communication SDK sits inside another team's application. Integrators should be able to inspect how it connects, what it stores, what it sends, how it responds to errors, and what happens when the network disappears.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Both repositories use the Apache License 2.0. The license permits commercial and private use, modification, and distribution, and includes an explicit patent grant. Each repository also includes tests, development instructions, and continuous integration configuration.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">The current release stage</h2>
<p xmlns="http://www.w3.org/1999/xhtml">These are initial source releases. The Android project already has Maven publication metadata, but it is not yet published to a public Maven repository. The iOS project can be consumed directly as a Swift Package from its Git repository. The APIs may still evolve as the clients are tested in real mobile applications.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Keeping the clients in separate repositories makes that evolution visible. Android and iOS issues, releases, examples, and package metadata can follow their own platform conventions while the wire protocol remains shared.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">The bottom line</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu Livechat no longer has to be presented only through a web widget. The new Android and iOS libraries provide the protocol layer needed to build a native support experience without importing someone else's user interface.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The SDK owns the connection. The application owns the experience. Chat and Email stay compatible with Aamu Livechat, while each mobile product remains free to feel like itself.</p>`;

const post = {
	title,
	slug,
	description:
		'Introducing open-source Aamu Livechat clients for the web, Android, and iOS, including a ready-made web client and headless native APIs for Chat, Email, sessions, reconnects, and events.',
	publishDate: '2026-07-11T09:30:00.000Z',
	author: '29940627-51e8-4fd0-82ab-d718ddfe802f',
	status: 'draft',
	tags: ['livechat', 'web', 'android', 'ios', 'open-source', 'sdk', 'mobile'],
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
	const existing = list.docs?.find(doc => doc.title === title || doc.title === previousTitle);
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
		return { action: 'updated', doc: data.doc || existing };
	}

	const data = await requestJson(`${API_BASE_URL}/api/v1/docs/`, { method: 'POST', headers, body });
	return { action: 'created', doc: data.doc || data };
}

async function findExistingPost() {
	const data = await graphql(`
		{
			BlogPostCollection {
				id
				slug
				heroImage { fid pointer name url }
			}
		}
	`);
	return data.BlogPostCollection.find(row => row.slug === slug || row.slug === previousSlug);
}

async function uploadHeroImage() {
	const bytes = await readFile(heroImagePath);
	const form = new FormData();
	form.append('file', new Blob([bytes], { type: heroImageType }), heroImageName);
	const response = await fetch(`${API_BASE_URL}/api/v1/files/`, {
		method: 'POST',
		headers: {
			'x-api-key': FILES_API_KEY,
			'x-project-id': PROJECT_ID,
			'x-aamu-actor': 'ai',
		},
		body: form,
	});
	const completed = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(completed?.error?.message || completed?.message || `HTTP ${response.status}`);
	}
	const file = completed.file;
	if (!file?.fid || !file?.pointer) {
		throw new Error('Files API did not return fid and pointer for the hero image.');
	}

	return {
		fid: file.fid,
		pointer: file.pointer,
		name: file.name || heroImageName,
		url: file.browser_url || undefined,
	};
}

async function upsertBlogPost(docId) {
	const existing = await findExistingPost();
	const existingHero = existing?.heroImage;
	const canReuseHero = existingHero?.fid && existingHero?.pointer && process.env.FORCE_HERO_UPLOAD !== '1';
	const heroImage = canReuseHero
		? {
			fid: existingHero.fid,
			pointer: existingHero.pointer,
			name: existingHero.name || heroImageName,
			url: existingHero.url || undefined,
		}
		: undefined;
	const data = await graphql(
		`
			mutation UpsertBlogPost(
				$id: ID
				$title: String
				$slug: String
				$description: String
				$publishDate: DateTime
				$heroImage: GraphQLMediaItemInput
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
					heroImage: $heroImage
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
					heroImage { name url }
					author { id name }
				}
			}
		`,
		{ id: existing?.id, ...post, doc: docId, ...(heroImage ? { heroImage } : {}) },
	);
	return { action: existing ? 'updated' : 'created', heroImage: canReuseHero ? 'reused' : 'uploaded', post: data.BlogPost };
}

const docResult = await upsertDoc();
const postResult = await upsertBlogPost(docResult.doc.id);

console.log(JSON.stringify({
	doc: { action: docResult.action, id: docResult.doc.id, title },
	blogPost: postResult,
}, null, 2));
