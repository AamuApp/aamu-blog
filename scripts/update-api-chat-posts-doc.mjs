import dotenv from 'dotenv';
import { mkdir, writeFile } from 'node:fs/promises';
import { parse } from 'node-html-parser';

dotenv.config({ path: '.envrc', override: false });
const key = process.env.DOCS_API_KEY || process.env.API_KEY;
const base = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const projectId = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';
const docId = process.env.AAMU_API_DOC_ID || '252fb285-ecc8-43f2-889f-0671a7637bca';
if (!key) throw new Error('DOCS_API_KEY or API_KEY is required.');
const headers = { 'Content-Type': 'application/json', 'x-api-key': key, 'x-project-id': projectId };
const endpoint = `${base}/api/v1/docs/${encodeURIComponent(docId)}`;
async function request(options = {}) {
 const response = await fetch(endpoint, { ...options, headers });
 const data = await response.json();
 if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`);
 return data.doc || data;
}
const chat = String.raw`<h2>Chat API</h2>
<p>The Chat API lets an external AI agent or integration read and reply in existing private and group chats. Enable <strong>Chat</strong> when creating a Team API key and select the chat rooms it may access. Chat scopes contain room ids rather than project ids, so these requests do not need <code>x-project-id</code>. Read keys can fetch rooms and messages; Write keys also send messages.</p>
<p>The key creator must remain a registered team member and a participant in each room. A scope does not add the owner to someone else's conversation. History includes only messages sent by or addressed to the owner.</p>
<p>Messages are sent as the <strong>user who created the API key</strong>, with a separate visible <strong>Agent: API key name</strong> label. Give each agent a descriptive key name, such as <code>Codex</code>. The server records that name and the key id in the message; callers cannot override the author, recipients, or agent name. <code>x-aamu-actor</code> does not change the sender.</p>
<h3>GET: list accessible chats</h3>
<pre><code class="language-plaintext">GET /api/v1/chats
x-api-key: YOUR_API_KEY</code></pre>
<p>The response contains <code>chats</code>, with each room's <code>id</code>, <code>users</code>, and <code>created</code> timestamp. The list returns up to 100 scoped rooms the key owner participates in. Use <code>GET /api/v1/chats/ROOM_ID</code> for a single room.</p>
<h3>GET: read chat messages</h3>
<pre><code class="language-plaintext">GET /api/v1/chats/ROOM_ID/messages?limit=50
x-api-key: YOUR_API_KEY</code></pre>
<p>Example response:</p>
<pre><code class="language-json">{
  "messages": [
    {
      "id": "MESSAGE_ID",
      "room_id": "ROOM_ID",
      "from": "KEY_CREATOR_USER_ID",
      "html": "&lt;p&gt;The requested checks are complete.&lt;/p&gt;",
      "text": "The requested checks are complete.",
      "created": 1792155600000,
      "agent": { "name": "Codex", "key_id": "API_KEY_ID" }
    }
  ],
  "has_more": false,
  "next_cursor": "MESSAGE_ID"
}</code></pre>
<p>Human messages have <code>agent: null</code>. The default order is newest first. <code>limit</code> accepts 1–100 and defaults to 50. For older history, send <code>before=MESSAGE_ID</code>. For new messages, poll with <code>after=MESSAGE_ID</code>, which returns messages oldest first. Do not combine <code>before</code> and <code>after</code>.</p>
<p>Use <code>next_cursor</code> to advance and drain every <code>has_more</code> page before waiting. An empty page has a null cursor: retain your previous cursor. Poll at a reasonable interval, for example five seconds, and ignore the agent's own replies to avoid loops.</p>
<h3>POST: send a chat message</h3>
<pre><code class="language-plaintext">POST /api/v1/chats/ROOM_ID/messages
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "text": "The requested checks are complete."
}</code></pre>
<p>Provide exactly one field: <code>text</code> for plain text or <code>html</code> for formatted content. The response is HTTP 201 with <code>{ "message": ... }</code>. Content is sanitized, must contain text, and is limited to 100,000 characters of final HTML. Sending uses normal unread tracking and realtime notifications without triggering Aamu's built-in AI replies.</p>
<p>Sending is not idempotent. After a timeout, inspect recent messages before retrying. Invalid or revoked keys return 401; missing permission or inactive owners return 403; inaccessible rooms return 404; invalid content or pagination returns 400.</p>`;

const posts = String.raw`<h2>Posts API</h2>
<p>The Posts API reads and publishes project discussions and their comments. Select <strong>Posts</strong>, the allowed projects, and Read or Write permissions when creating a Team API key. Use <code>x-project-id</code> to select the project, especially when a key has more than one project. The key creator must remain a registered team member and project participant; team admins can use any project covered by the key's scope.</p>
<p>Posts and comments are published directly as the <strong>user who created the API key</strong>. They have <strong>no agent label or agent metadata</strong>. Unlike Chat, the key name is not displayed as an agent name. <code>x-aamu-actor</code> is ignored, and the body cannot override the author, project, status, or metadata.</p>
<h3>GET: list project posts</h3>
<pre><code class="language-plaintext">GET /api/v1/posts?limit=50
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre>
<p>The response contains <code>posts</code>, <code>has_more</code>, and <code>next_cursor</code>. Posts are ordered newest first, with the id breaking ties between equal creation timestamps. <code>limit</code> accepts 1–100 and defaults to 50. Pass <code>before=next_cursor</code> to read the next page of older posts.</p>
<p>Use <code>GET /api/v1/posts/POST_ID</code> to retrieve <code>{ "post": ... }</code>. Post objects contain <code>id</code>, <code>project_id</code>, <code>from</code>, <code>html</code>, <code>text</code>, <code>created</code>, <code>updated</code>, and <code>comment_count</code>. Drafts, deleted posts, shared-comment wrappers, and posts outside the selected project are unavailable.</p>
<h3>POST: publish a post</h3>
<pre><code class="language-plaintext">POST /api/v1/posts
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "text": "The release is ready for review. Please add your feedback below."
}</code></pre>
<p>This requires Posts <code>write</code> permission and publishes immediately. The response is HTTP 201 with <code>{ "post": ... }</code>. The author is the API key creator, regardless of whether a human or an agent made the HTTP request.</p>
<h3>GET: read post comments</h3>
<pre><code class="language-plaintext">GET /api/v1/posts/POST_ID/comments?limit=50&amp;offset=0
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre>
<p>The response contains <code>comments</code>, <code>has_more</code>, and <code>next_offset</code>. It lists published top-level comments in insertion order, excluding hidden and system comments. Use <code>next_offset</code> as the next request's <code>offset</code> while <code>has_more</code> is true. <code>limit</code> accepts 1–100; <code>offset</code> must be a nonnegative integer.</p>
<h3>POST: add a comment</h3>
<pre><code class="language-plaintext">POST /api/v1/posts/POST_ID/comments
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "html": "&lt;p&gt;The review is complete. The release looks ready.&lt;/p&gt;"
}</code></pre>
<p>This creates a top-level comment and returns HTTP 201 with <code>{ "comment": ... }</code>. It requires Posts <code>comment</code> permission, which is included in Write keys created from the settings page. Comment objects contain <code>id</code>, <code>from</code>, <code>html</code>, <code>text</code>, and <code>created</code>.</p>
<p>Both creation endpoints accept exactly one of <code>text</code> or <code>html</code>, sanitize the content, and require nonempty text with at most 100,000 characters of final HTML. Posts and comments use the normal publication, activity, subscription, notification, and webhook handling. These endpoints do not edit or delete existing content.</p>
<p>Creation is not idempotent: inspect recent posts or comments before retrying an uncertain request. Invalid or revoked keys return 401; missing scope or inactive team/project membership returns 403; unavailable posts return 404; invalid content or pagination returns 400.</p>`;

const current = await request();
let html = current.html;
if (!html || current.title !== 'Building with the Aamu API: From Tasks to Docs and GraphQL') throw new Error('Unexpected API Doc; refusing to update.');
function replaceOnce(before, after) {
 if (html.includes(after)) return;
 if (html.split(before).length !== 2) throw new Error(`Expected one matching paragraph: ${before.slice(0,100)}`);
 html = html.replace(before, after);
}
replaceOnce('The Aamu API lets integrations work with project Tasks, Docs, meetings, Forms, Newsletters, Git, files, Helpdesk, Email and Databases.', 'The Aamu API lets integrations work with private and group Chats and with project Posts, Tasks, Docs, meetings, Forms, Newsletters, Git, files, Helpdesk, Email and Databases.');
replaceOnce('Project-scoped resources also use <code>x-project-id</code>.', 'Project-scoped resources, including Posts, also use <code>x-project-id</code>. Chat is scoped to selected rooms and does not use a project header.');
replaceOnce('<p>Write operations can set the acting user with <code>x-aamu-actor</code>.', '<p>Most project write operations can set the acting user with <code>x-aamu-actor</code>.');
const actorException = '<p><strong>Chat and Posts are exceptions:</strong> both always use the API key creator as the sender or author and ignore <code>x-aamu-actor</code>. Chat messages also display the agent name from the API key; Posts and their comments have no agent label.</p>';
if (!html.includes(actorException)) replaceOnce('<h2>API key introspection</h2>', `${actorException}<h2>API key introspection</h2>`);
for (const [heading, section] of [['Chat API', chat], ['Posts API', posts]]) {
 const marker = `<h2>${heading}</h2>`;
 const start = html.indexOf(marker);
 if (start >= 0) {
  const end = html.indexOf('<h2', start + marker.length);
  if (end < 0) throw new Error(`Missing next section after ${heading}`);
  html = html.slice(0, start) + section + html.slice(end);
 } else replaceOnce('<h2>Tasks</h2>', `${section}<h2>Tasks</h2>`);
}
const summary = '<p>Chat supports room and message reads plus message creation. Posts supports published-post reads, publication, and top-level comment reads and creation; these routes do not edit or delete posts or comments.</p>';
if (!html.includes(summary)) replaceOnce('<h2>Update support summary</h2>', `<h2>Update support summary</h2>${summary}`);
const beforeHeadings = parse(current.html).querySelectorAll('h2').map(node => node.textContent);
const headings = parse(html).querySelectorAll('h2').map(node => node.textContent);
if (!beforeHeadings.every(heading => headings.includes(heading)) || headings.filter(heading => heading === 'Chat API').length !== 1 || headings.filter(heading => heading === 'Posts API').length !== 1) throw new Error('Section preservation check failed.');
const dir = '/tmp/aamu-blog-api-update';
await mkdir(dir, { recursive: true, mode: 0o700 });
await writeFile(`${dir}/chat-posts-before.json`, JSON.stringify(current, null, 2), { mode: 0o600 });
await writeFile(`${dir}/chat-posts-preview.html`, html, { mode: 0o600 });
if (!process.argv.includes('--apply')) {
 console.log(JSON.stringify({ action: 'preview', docId, title: current.title, beforeLength: current.html.length, afterLength: html.length, addedSections: ['Chat API', 'Posts API'], preview: `${dir}/chat-posts-preview.html` }, null, 2));
} else {
 const latest = await request();
 if (latest.html !== current.html || latest.updated !== current.updated) throw new Error('Doc changed while preparing update; rerun against current content.');
 if (html !== current.html) await request({ method: 'PATCH', body: JSON.stringify({ html }) });
 const saved = await request();
 const tree = parse(saved.html);
 for (const marker of ['Chat API', 'Posts API', '/api/v1/chats/ROOM_ID/messages', '/api/v1/posts/POST_ID/comments', 'no agent label or agent metadata', 'Chat and Posts are exceptions']) {
  if (!tree.textContent.includes(marker)) throw new Error(`Saved Doc verification failed: ${marker}`);
 }
 for (const heading of beforeHeadings) if (!tree.querySelectorAll('h2').some(node => node.textContent === heading)) throw new Error(`Original section missing: ${heading}`);
 await writeFile(`${dir}/chat-posts-after.json`, JSON.stringify(saved, null, 2), { mode: 0o600 });
 console.log(JSON.stringify({ action: html === current.html ? 'unchanged' : 'updated', verified: true, doc: { id: saved.id, title: saved.title, updated: saved.updated }, url: `${base}/doc/${docId}` }, null, 2));
}
