import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.DOCS_API_KEY || process.env.API_KEY;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';
const API_DOC_ID = process.env.AAMU_API_DOC_ID || '252fb285-ecc8-43f2-889f-0671a7637bca';

if (!API_KEY) throw new Error('DOCS_API_KEY or API_KEY environment variable is required.');

const filesSection = String.raw`<h2>Files</h2>
<p>Aamu files have two related identifiers: <code>pointer</code> identifies the logical file and <code>fid</code> identifies one stored file version. Database GraphQL media fields require both values. Obtain them from a successful Files API response; do not invent ids or store raw base64 data in a file column.</p>

<h3>POST: upload a small file in one request</h3>
<p>For small files, send one <code>multipart/form-data</code> request. Aamu receives the bytes, stores the object, creates the file and filepointer records, and returns a media object ready for GraphQL. The default limit is 10 MiB and can be configured by the server.</p>
<pre><code class="language-plaintext">curl -X POST https://YOUR_AAMU_HOST/api/v1/files/ \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-project-id: YOUR_PROJECT_ID" \
  -F "file=@example.png;type=image/png"</code></pre>
<p>The API key needs the project Files write scope.</p>

<h3>POST: prepare a direct upload</h3>
<p>For larger files, upload directly to object storage through a signed URL. Aamu keeps the bucket, object key, project, actor, file ids, and metadata in a short-lived server-side upload session. The client receives only an opaque <code>uploadId</code> plus the signed PUT request.</p>
<pre><code class="language-plaintext">POST /api/v1/files/prepare-upload
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "name": "example.png",
  "type": "image/png",
  "size": 12345
}</code></pre>
<p>Example response:</p>
<pre><code class="language-plaintext">{
  "uploadId": "upl_OPAQUE_ID",
  "expiresAt": "2026-07-11T10:00:00.000Z",
  "upload": {
    "method": "PUT",
    "url": "SIGNED_UPLOAD_URL",
    "headers": { "Content-Type": "image/png" }
  },
  "file": {
    "file_id": "FILE_VERSION_ID",
    "file_version_id": "FILE_VERSION_ID",
    "name": "example.png",
    "type": "image/png",
    "size": 12345
  }
}</code></pre>
<p>Send the bytes to <code>upload.url</code> with the returned method and headers. The signed URL contains the storage authorization; the client does not receive or send separate bucket or object-key fields.</p>

<h3>POST: complete a direct upload</h3>
<pre><code class="language-plaintext">POST /api/v1/files/complete-upload
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID
Content-Type: application/json

{
  "uploadId": "upl_OPAQUE_ID"
}</code></pre>
<p>The upload session is project- and actor-bound, expires after a short time, and can be completed idempotently while the session remains available.</p>

<h3>GET: read file metadata</h3>
<pre><code class="language-plaintext">GET /api/v1/files/FILEPOINTER_ID
x-api-key: YOUR_API_KEY
x-project-id: YOUR_PROJECT_ID</code></pre>
<p>All three successful file operations return the same shape:</p>
<pre><code class="language-json">{
  "file": {
    "id": "FILEPOINTER_ID",
    "fid": "FILE_VERSION_ID",
    "pointer": "FILEPOINTER_ID",
    "filepointer_id": "FILEPOINTER_ID",
    "file_id": "FILE_VERSION_ID",
    "file_version_id": "FILE_VERSION_ID",
    "name": "example.png",
    "type": "image/png",
    "size": 12345,
    "browser_url": "/file/browser/FILEPOINTER_ID/FILE_VERSION_ID/example.png",
    "download_url": "/file/dl/FILEPOINTER_ID/FILE_VERSION_ID/example.png"
  }
}</code></pre>

<h3>Use a file in a GraphQL database mutation</h3>
<p>Pass only the registered media identity to a generated GraphQL <code>file</code> or <code>files</code> field:</p>
<pre><code class="language-json">{
  "heroImage": {
    "fid": "FILE_VERSION_ID",
    "pointer": "FILEPOINTER_ID"
  }
}</code></pre>
<p>Before inserting or updating the row, Aamu checks that both records exist, the file version belongs to the pointer, neither record is deleted, and the pointer belongs to the same company and project as the database table. A URL-only, base64-only, missing, cross-project, or mismatched media value is rejected.</p>
<p>The <code>browser_url</code> can also be embedded in Docs, Tasks, or other editor HTML. The old item-level <code>files</code> field is deprecated and is not returned by the current API.</p>`;

async function requestJson(url, options) {
	const response = await fetch(url, options);
	const data = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(data?.error?.message || data?.message || `HTTP ${response.status}`);
	return data;
}

const headers = {
	'Content-Type': 'application/json',
	'x-api-key': API_KEY,
	'x-project-id': PROJECT_ID,
};
const currentData = await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(API_DOC_ID)}`, { headers });
const doc = currentData.doc || currentData;
const html = `${doc.html || ''}`;
const start = html.indexOf('<h2>Files</h2>');
const end = start >= 0 ? html.indexOf('<h2', start + '<h2>Files</h2>'.length) : -1;

if (start < 0 || end < 0) {
	throw new Error('Could not find the complete Files section in the API Doc.');
}

const updatedHtml = `${html.slice(0, start)}${filesSection}${html.slice(end)}`;
const currentFilesSection = html.slice(start, end);
const alreadyCurrent = currentFilesSection.includes('POST: upload a small file in one request')
	&& currentFilesSection.includes('upl_OPAQUE_ID')
	&& currentFilesSection.includes('does not receive or send separate bucket or object-key fields')
	&& currentFilesSection.includes('A URL-only, base64-only, missing, cross-project, or mismatched media value is rejected');
const changed = !alreadyCurrent;
const result = changed
	? await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(API_DOC_ID)}`, {
		method: 'PATCH',
		headers,
		body: JSON.stringify({ html: updatedHtml }),
	})
	: currentData;

console.log(JSON.stringify({
	doc: {
		id: (result.doc || result).id || API_DOC_ID,
		title: (result.doc || result).title || doc.title,
		action: changed ? 'updated' : 'unchanged',
	}
}, null, 2));
