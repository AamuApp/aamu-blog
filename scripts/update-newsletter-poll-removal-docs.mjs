import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { parse } from 'node-html-parser';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(repo, '.envrc'), quiet: true });
const directory = '/tmp/aamu-blog-newsletter-poll-removal';
const planPath = path.join(directory, 'poll-removal-plan.json');
const targets = [
  { slug: 'aamu-newsletters-vs-mailchimp-brevo-beehiiv', docId: 'bffda5a9-aadb-48e6-b923-770622e72c4b' },
  { slug: 'newsletters-in-aamuapp-from-subscribers-to-sending', docId: '5c96f65a-4897-4604-ad73-a27b222bec0e' }
];
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
function revise(source, slug) {
  const dom = parse(source);
  if (!/\bpolls?\b|poll-response/i.test(dom.textContent)) return source;
  function paragraph(prefix) {
    const matches = dom.querySelectorAll('p').filter(node => node.textContent.startsWith(prefix));
    if (matches.length !== 1) throw new Error(`Expected one paragraph starting: ${prefix}`);
    return matches[0];
  }
  function replace(prefix, before, after) {
    const node = paragraph(prefix);
    if (!node.innerHTML.includes(before)) throw new Error(`Expected text in: ${prefix}`);
    node.set_content(node.innerHTML.replace(before, after));
  }
  replace('Aamu implementation update, 16 October 2026:', 'subscriber history, acquisition reporting and polls', 'subscriber history and acquisition reporting');
  if (slug === targets[0].slug) {
    const heading = dom.querySelectorAll('h3').find(node => node.textContent === 'Reader feedback connected to the audience');
    if (!heading) throw new Error('Comparison history heading missing.');
    heading.set_content('Subscriber history and acquisition reporting');
    replace("A subscriber's profile brings together", 'campaign, link-visit and poll-response history', 'campaign and link-visit history');
    paragraph('An issue can also include one question with 2–10 choices.').remove();
  } else {
    replace('Content:', 'HTML-size feedback, polls, and test sending', 'HTML-size feedback, and test sending');
    replace('Report:', 'clicks, unsubscribes, sending problems, and poll results', 'clicks, unsubscribes and sending problems');
    replace('The subscriber dialog includes a paginated timeline', 'campaigns, counted link visits and poll answers', 'campaigns and counted link visits');
    replace('The Content tab also shows a live HTML-size estimate,', 'including the template and poll,', 'including the template,');
    replace('Send test sends to the signed-in user', 'production campaign statistics and cannot cast poll votes', 'production campaign statistics');
    const heading = dom.querySelectorAll('h2').find(node => node.textContent === 'Ask a question and use the answer in the next campaign');
    if (!heading) throw new Error('Poll instructions heading missing.');
    const section = [];
    let node = heading.nextSibling;
    while (node && node.tagName !== 'H2') { section.push(node); node = node.nextSibling; }
    if (section.filter(node => node.tagName === 'P').length !== 4) throw new Error('Unexpected poll instructions section.');
    for (const node of [heading, ...section]) node.remove();
    paragraph('Subscriber profiles complement these campaign reports').set_content('Subscriber profiles complement these campaign reports with a reader-level timeline.');
    replace('The project-scoped Newsletter API can manage Newsletters,', 'audience selection, previews, polls, subscriber history', 'audience selection, previews, subscriber history');
    const apiHeading = dom.querySelectorAll('h3').find(node => node.textContent === 'Preview, inspect reader history, and configure a poll');
    if (!apiHeading) throw new Error('Poll API heading missing.');
    apiHeading.set_content('Preview and inspect reader history');
    paragraph('Save a poll on a draft issue using').remove();
    const examples = dom.querySelectorAll('pre').filter(node => node.textContent.includes('PUT /api/v1/newsletters/{newsletterId}/issues/{issueId}/poll'));
    if (examples.length !== 1) throw new Error('Poll API example missing.');
    examples[0].remove();
    paragraph('Preview, history and results require').set_content('Preview and subscriber history require Newsletters read permission. Subscriber responses include <code>acquisition</code>, and the audience report includes the acquisition breakdown.');
    replace('The send endpoint returns', 'audience, poll configuration, or batch configuration', 'audience, or batch configuration');
  }
  const beforeLinks = parse(source).querySelectorAll('a').map(node => node.getAttribute('href'));
  const afterLinks = dom.querySelectorAll('a').map(node => node.getAttribute('href'));
  if (JSON.stringify(beforeLinks) !== JSON.stringify(afterLinks)) throw new Error('Unexpected link change.');
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
  if (/\bpolls?\b|poll-response|preferred_topic|\bvotes?\b/i.test(text)) throw new Error('Poll material remains.');
  for (const term of ['subscriber', 'acquisition', 'Database']) if (!text.includes(term)) throw new Error(`Missing ${term}.`);
  if (target.slug === targets[1].slug) for (const term of ['375 px', '85,000', '/preview?', '/history', 'Review and send explicitly']) if (!text.includes(term)) throw new Error(`Missing ${term}.`);
  if (!text.includes('16 October 2026') || !text.includes('once that version is deployed')) throw new Error('Implementation date/scope changed.');
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
