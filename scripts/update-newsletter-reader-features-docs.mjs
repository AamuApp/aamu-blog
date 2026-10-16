import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { parse } from 'node-html-parser';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(repo, '.envrc'), quiet: true });
const directory = '/tmp/aamu-blog-newsletter-update';
const planPath = path.join(directory, 'reader-features-plan.json');
const targets = [
  { slug: 'aamu-newsletters-vs-mailchimp-brevo-beehiiv', docId: 'bffda5a9-aadb-48e6-b923-770622e72c4b' },
  { slug: 'newsletters-in-aamuapp-from-subscribers-to-sending', docId: '5c96f65a-4897-4604-ad73-a27b222bec0e' }
];
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const rollout = '<p><strong>Aamu implementation update, 16 October 2026:</strong> desktop and mobile previews, subscriber history, acquisition reporting and polls are implemented in the latest version. These additions appear in a workspace once that version is deployed.</p>';

function revise(source, slug) {
  const dom = parse(source);
  const comparison = slug === targets[0].slug;
  const marker = comparison ? 'Reader feedback connected to the audience' : 'Ask a question and use the answer in the next campaign';
  if (dom.querySelectorAll('h2,h3').some(node => node.textContent === marker)) return source;
  function paragraph(prefix) {
    const matches = dom.querySelectorAll('p').filter(node => node.textContent.startsWith(prefix));
    if (matches.length !== 1) throw new Error(`Expected one paragraph starting: ${prefix}`);
    return matches[0];
  }
  function beforeHeading(title, html) {
    const matches = dom.querySelectorAll('h2,h3').filter(node => node.textContent === title);
    if (matches.length !== 1) throw new Error(`Expected one heading: ${title}`);
    matches[0].insertAdjacentHTML('beforebegin', html);
  }
  if (comparison) {
    paragraph("This assessment comes from Aamu's product perspective.").insertAdjacentHTML('afterend', rollout);
    paragraph('The writing workflow includes reusable templates,').set_content('The writing workflow includes reusable templates, an HTML wrapper, preview text, personalization with fallback values, test sending and a pre-send review. Desktop and mobile previews can show an existing subscriber\'s name and referenced Database values, or fallback text when no subscriber is selected. A live HTML-size estimate warns as the issue approaches the sending limit. You can schedule an issue and publish a separate public archive snapshot; publishing it and sending the email are separate actions.');
    beforeHeading('The delivery constraint matters', `<h3>${marker}</h3>
<p>A subscriber's profile brings together available subscription, consent, campaign, link-visit and poll-response history. Signup forms capture campaign attribution separately from the way an address was added: UTM labels, the form, landing page and referrer. Acquisition reports connect those sources with unique subscriber counts, recorded confirmation proof and classified campaign clicks. Older missing attribution and events are left unknown.</p>
<p>An issue can also include one question with 2–10 choices. A reader opens an answer link and confirms it on a web page; merely visiting a link does not cast a vote. The answer is associated with the subscriber and saved to a separate audience Database text field. A team could ask whether readers want product or training news, then use that answer as a condition for the next campaign. Poll results are available in the issue's Report tab.</p>
`);
  } else {
    paragraph('The workflow starts with a Database-backed audience').insertAdjacentHTML('afterend', rollout);
    const contentTab = dom.querySelectorAll('li p').find(node => node.textContent.startsWith('Content:'));
    const reportTab = dom.querySelectorAll('li p').find(node => node.textContent.startsWith('Report:'));
    if (!contentTab || !reportTab) throw new Error('Issue navigation list not found.');
    contentTab.set_content('<strong>Content:</strong> the subject, inbox preview text, message editor, desktop/mobile and subscriber previews, HTML-size feedback, polls, and test sending.');
    reportTab.set_content('<strong>Report:</strong> campaign progress, delivery feedback, clicks, unsubscribes, sending problems, and poll results.');
    beforeHeading('Collect subscriptions with an optional Aamu Form', `<h3>Read the subscriber's history</h3>
<p>The subscriber dialog includes a paginated timeline of available subscription and consent events, campaigns, counted link visits and poll answers. Campaign names link back to their issues. Retained signup, confirmation and unsubscribe timestamps are labelled as current records. Aamu does not reconstruct older events that were never recorded.</p>
<p>Campaign entries show the latest recorded delivery outcome. Automated and repeat visits remain separate from counted clicks, and older visits without bot classification are identified. This history provides context for the relationship with a reader; it does not prove that every counted visit was human or that SMTP acceptance meant inbox delivery.</p>`);
    beforeHeading('Reuse the design and write each issue in Content', `<h3>See where subscribers came from</h3>
<p>Newsletter signup forms capture UTM source, medium, campaign, content and term, together with the form ID, landing page and referrer. This visitor-reported acquisition information is separate from the existing insertion source, such as an import or API addition. Later edits to subscriber details preserve the captured first signup attribution. Older contacts without captured information remain unattributed.</p>
<p>The subscriber dialog shows acquisition details. The Subscribers report groups source, medium, campaign and form, with deduplicated address counts, valid confirmation proof and addresses with classified production campaign clicks. It refreshes with the audience report, approximately every five minutes. Use it to compare the readers produced by different signup campaigns, while treating click-based activity as an imperfect signal.</p>`);
    paragraph('The preview combines the message with the Newsletter').set_content('Open <strong>Preview</strong> to see the message inside the Newsletter\'s design, then choose <strong>Desktop</strong> or <strong>Mobile (375 px)</strong>. Enter an existing subscriber\'s email to preview their name and referenced Database fields. Leave it empty to check the fallback text. Use <strong>Refresh preview</strong> after changes to load the latest saved content. This preview does not send an email, alter consent or require a configured sending mailbox; rendering can still differ between email apps.');
    paragraph('Open Preview to see the message inside').insertAdjacentHTML('afterend', `<p>The Content tab also shows a live HTML-size estimate, including the template and poll, before personalization and tracking links. The warning starts at 85,000 bytes. The final sending review still checks each recipient's tracked HTML against the 100,000-byte limit, so the editor estimate is an early warning rather than a replacement for that check.</p>
<p><strong>Send test</strong> sends to the signed-in user when that address is an eligible active subscriber. It uses the real subscriber-specific unsubscribe link. Test deliveries are excluded from production campaign statistics and cannot cast poll votes.</p>`);
    beforeHeading('Choose the audience and personalization in Issue Settings', `<h2>${marker}</h2>
<p>In <strong>Content → Poll</strong>, add one question and 2–10 different answer choices. Choose a separate existing text field in the Audience Database to store responses. If you need a new field, create it in the Database and use <strong>Reload fields</strong>. Identity, subscription-status and tag fields cannot be used as the answer field. Save the poll to append it to the issue.</p>
<p>Answer links appear in both the HTML and plain-text campaign email. Each link opens a web page where the reader confirms the answer. Opening or previewing the link alone does not vote, preventing ordinary link-scanner visits from recording answers. Aamu accepts one confirmed answer per subscriber and poll; preview and test messages cannot submit votes.</p>
<p>The answer is linked to the subscriber and saved to their audience row. For example, a question about product or training news can populate a <code>preferred_topic</code> text field. In the next issue's <strong>Campaign audience</strong>, add a condition that this field equals the chosen answer. This uses the existing Database field conditions.</p>
<p>In <strong>Report → Poll results</strong>, use <strong>Refresh results</strong> for the current answer totals and the number awaiting a Database update. A response can be recorded before its Database row is updated; interrupted updates retry automatically. If several polls share an answer field, a newer response takes precedence over an older pending response. Use separate fields when you want to retain separate answers in the audience table.</p>`);
    beforeHeading('Manage the sender in Newsletter Settings', '<p>Subscriber profiles complement these campaign reports with a reader-level timeline. Poll response totals are available in the issue\'s Report tab; use <strong>Refresh results</strong> to retrieve the latest counts.</p>');
    paragraph('The project-scoped Newsletter API can manage Newsletters,').set_content('The project-scoped Newsletter API can manage Newsletters, draft issues, subscribers, audience selection, previews, polls, subscriber history, reviews, scheduling, reporting, and archive publication. Requests use a Team API key with the appropriate Newsletters scope and the project header:');
    paragraph('Send a test, then request the production review.').insertAdjacentHTML('beforebegin', `<h3>Preview, inspect reader history, and configure a poll</h3>
<p>The read-only preview can use a subscriber's values, or fallback text when <code>subscriber_email</code> is omitted. Subscriber history returns a page of events and an opaque <code>history.nextCursor</code>; pass it as <code>cursor</code> for older entries.</p>
<pre><code class="language-plaintext">GET /api/v1/newsletters/{newsletterId}/issues/{issueId}/preview?subscriber_email=reader%40example.com
GET /api/v1/newsletters/{newsletterId}/subscribers/{subscriberId}/history
GET /api/v1/newsletters/{newsletterId}/subscribers/{subscriberId}/history?cursor=NEXT_CURSOR</code></pre>
<p>Save a poll on a draft issue using the audience text field's <code>gtype</code>:</p>
<pre><code class="language-plaintext">PUT /api/v1/newsletters/{newsletterId}/issues/{issueId}/poll
{
  "question": "What would you like to read about next?",
  "options": ["Product news", "Training"],
  "field": "preferred_topic"
}

GET /api/v1/newsletters/{newsletterId}/issues/{issueId}/poll/results
DELETE /api/v1/newsletters/{newsletterId}/issues/{issueId}/poll</code></pre>
<p>Preview, history and results require Newsletters read permission. Saving or removing a draft poll requires write permission and the normal API actor checks. Issue responses include <code>poll</code>, subscriber responses include <code>acquisition</code>, and the audience report includes the acquisition breakdown. Poll configuration is frozen with the queued campaign.</p>
<h3>Review and send explicitly</h3>`);
    const sendParagraph = paragraph('The send endpoint returns');
    if (!sendParagraph.innerHTML.includes('audience, or batch configuration')) throw new Error('Review-token paragraph changed.');
    sendParagraph.set_content(sendParagraph.innerHTML.replace('audience, or batch configuration', 'audience, poll configuration, or batch configuration'));
  }
  return dom.toString();
}

function signature(html) {
  const dom = parse(html);
  for (const element of dom.querySelectorAll('*')) {
    for (const attribute of ['xmlns', 'target', 'rel']) element.removeAttribute(attribute);
  }
  return dom.toString().replace(/>\s+</g, '><').trim();
}
function validate(html, target) {
  const dom = parse(html), text = dom.textContent;
  if (dom.querySelector('h1,script,iframe')) throw new Error('Unexpected article markup.');
  for (const term of ['375 px', 'subscriber', '85,000', 'poll', 'Database']) {
    if (target.slug === targets[1].slug && !text.includes(term)) throw new Error(`Missing ${term}.`);
  }
  if (!text.includes('16 October 2026') || !text.includes('once that version is deployed')) throw new Error('Implementation date/scope missing.');
  if (target.slug === targets[0].slug && (!text.includes('checked on 15 October 2026') || dom.querySelectorAll('tr').length !== 5)) throw new Error('Comparison evidence date/table changed.');
  const headings = dom.querySelectorAll('h2,h3').map(node => node.textContent);
  if (new Set(headings).size !== headings.length) throw new Error('Duplicate headings.');
  return { words: text.trim().split(/\s+/).length, headings };
}

const key = process.env.API_KEY, docKey = process.env.DOCS_API_KEY || key;
const dbId = process.env.AAMU_DB_ID || process.env.DB_ID;
const project = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';
const base = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
if (!key || !docKey || !dbId) throw new Error('Blog API credentials or Database ID missing.');
async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.errors) throw new Error(`API request rejected (${response.status}).`);
  return data;
}
const headers = { 'content-type': 'application/json', 'x-api-key': docKey, 'x-project-id': project };
const endpoint = id => `${base}/api/v1/docs/${encodeURIComponent(id)}`;
const readDoc = async id => { const data = await request(endpoint(id), { headers }); return data.doc || data; };
async function verifyLinks() {
  const result = await request(process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/', { method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'x-db-id': dbId },
    body: JSON.stringify({ query: '{ BlogPostCollection { id slug doc } }' }) });
  for (const target of targets) {
    const matches = result.data.BlogPostCollection.filter(post => post.slug === target.slug);
    if (matches.length !== 1 || matches[0].doc !== target.docId) throw new Error(`Unexpected Doc link: ${target.slug}`);
  }
}
await verifyLinks();
await fs.mkdir(directory, { recursive: true, mode: 0o700 });
if (!process.argv.includes('--apply')) {
  const plan = [];
  for (const target of targets) {
    const doc = await readDoc(target.docId);
    if (!doc.html || !doc.title) throw new Error('Doc content missing.');
    const afterHtml = revise(doc.html, target.slug);
    const checks = validate(afterHtml, target);
    plan.push({ ...target, title: doc.title, beforeHash: hash(doc.html), beforeDoc: doc, afterHtml });
    await fs.writeFile(path.join(directory, `${target.slug}.before.html`), doc.html, { mode: 0o600 });
    await fs.writeFile(path.join(directory, `${target.slug}.after.html`), afterHtml, { mode: 0o600 });
    console.log(JSON.stringify({ slug: target.slug, docId: target.docId, changed: signature(doc.html) !== signature(afterHtml), ...checks }));
  }
  await fs.writeFile(planPath, JSON.stringify(plan, null, 2), { mode: 0o600 });
  console.log(`Prepared Doc-only update: ${planPath}`);
} else {
  const plan = JSON.parse(await fs.readFile(planPath, 'utf8'));
  if (plan.length !== targets.length) throw new Error('Unexpected update plan.');
  for (const target of targets) {
    const item = plan.find(entry => entry.slug === target.slug && entry.docId === target.docId);
    if (!item) throw new Error('Target missing from prepared plan.');
    validate(item.afterHtml, target);
    const current = await readDoc(target.docId);
    if (current.title !== item.title) throw new Error('Doc title changed since preparation.');
    if (signature(current.html) !== signature(item.afterHtml)) {
      if (hash(current.html) !== item.beforeHash) throw new Error('Doc changed since preparation; prepare and review again.');
      await request(endpoint(target.docId), { method: 'PATCH', headers, body: JSON.stringify({ html: item.afterHtml }) });
    }
    const verified = await readDoc(target.docId);
    if (verified.title !== item.title || signature(verified.html) !== signature(item.afterHtml)) throw new Error(`Readback mismatch: ${target.slug}`);
    await fs.writeFile(path.join(directory, `${target.slug}.verified.json`), JSON.stringify(verified, null, 2), { mode: 0o600 });
    console.log(JSON.stringify({ slug: target.slug, docId: target.docId, verified: true }));
  }
}
