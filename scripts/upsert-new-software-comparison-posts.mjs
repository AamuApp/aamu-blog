import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';
const AUTHOR_ID = '29940627-51e8-4fd0-82ab-d718ddfe802f';

const posts = [
  {
    title: 'Aamu.app vs Asana: tasks are better when they remember why they exist',
    slug: 'aamuapp-vs-asana-tasks-and-shared-context',
    description: 'A practical comparison of Aamu.app and Asana for teams that want tasks connected to docs, conversations, customer work, and shared knowledge.',
    tags: ['comparisons', 'tasks', 'docs', 'team-brain'],
    html: `<p>Asana is built around a useful question: what needs to happen, who owns it, and when is it due? That is a good question. It is also the question that creates the least confusion in a meeting where everyone has already said “yes, I’ll take that”.</p><p>Aamu.app starts from a wider workspace. Tasks are still clear, assignable pieces of work, but they can live next to the Doc, Helpdesk conversation, meeting, email, database row, or project context that explains why the task exists.</p><h2>Asana is task-first</h2><p>Asana is a natural fit when the team wants a dedicated system for planning projects, assigning work, and following progress. Its strength is making execution visible.</p><p>The trade-off is that the reason behind a task can live elsewhere. The task says “update onboarding”, while the details are in a meeting, a chat thread, and someone's memory. The task is not wrong. It is simply wearing a very small hat.</p><h2>Aamu keeps the context with the task</h2><p>In Aamu, a support question can create a Task. The Task can link to the customer conversation and the Doc that contains the answer. A meeting can produce tasks without losing the notes that explain the decision. A database row can represent the object being worked on while tasks track the actual next steps.</p><p>Company Brain and Team Brain can also help retrieve relevant context before a task is drafted or discussed. The goal is not AI-generated busyness. It is less detective work before the team can act.</p><h2>When Asana may be the better choice</h2><p>Choose Asana when project and task management is the main problem and the surrounding knowledge already has a good home. Consider Aamu when work repeatedly crosses tasks, Docs, customer conversations, meetings, and structured data.</p><p>The practical difference is simple: Asana helps you remember what to do. Aamu tries to keep nearby the answer to “why are we doing this, and what do we already know?”</p><h2>The bottom line</h2><p>Asana is a strong task system. Aamu.app is a connected workspace where tasks are one part of the team's memory and execution loop. For small teams, that can mean fewer tabs and fewer meetings whose only purpose is to explain the previous meeting.</p>`,
  },
  {
    title: 'Aamu.app vs Intercom: support should not need a passport to reach product',
    slug: 'aamuapp-vs-intercom-support-and-product-context',
    description: 'A practical comparison of Aamu.app and Intercom for teams that want customer conversations, support knowledge, and internal follow-up in one workspace.',
    tags: ['comparisons', 'helpdesk', 'support', 'team-brain'],
    html: `<p>Intercom is designed around customer communication: conversations, support, engagement, and the systems that help a support or customer team respond at scale. That focus is valuable.</p><p>Aamu.app looks at the same customer question from the other side of the wall. What does the customer need, what does the company know, and which person or Task can move the issue forward? Ideally the answer should not require a small expedition through the software archipelago.</p><h2>Intercom is conversation-first</h2><p>Intercom is a natural fit when customer messaging and support operations are the central workflow. It helps teams organize conversations and build repeatable ways to serve customers.</p><p>Aamu Helpdesk also handles customer conversations, but it sits inside a broader workspace. The same project can contain Docs, Tasks, meetings, email, databases, files, and shared knowledge.</p><h2>The Aamu knowledge loop</h2><p>A customer asks how a feature works. Team Brain or Helpdesk Knowledge Base finds the maintained source. Aamu can prepare a reply draft for human review. If the answer is missing, the team can create a Doc or Task. The improved source then helps with the next similar question.</p><p>That loop matters for small teams because support is often also product feedback, onboarding, sales context, and documentation maintenance. The person answering the customer may be the same person fixing the feature later. They should not need to introduce themselves to their own context.</p><h2>When Intercom may be the better choice</h2><p>Choose Intercom when customer messaging, engagement, and a specialized support operation are the main requirements. Aamu is a strong alternative when support needs to stay close to the internal work behind the answer.</p><p>Neither product can turn an unclear policy into a magically correct one. Aamu's useful promise is more modest: make it easier to put the policy in a Doc, retrieve it when needed, and keep the human in control of important replies.</p><h2>The bottom line</h2><p>Intercom optimizes customer communication as a dedicated discipline. Aamu.app connects customer communication with the Docs, Tasks, and people who make the answer true. For a growing team, that connection can be more valuable than adding another integration and hoping the context survives the journey.</p>`,
  },
  {
    title: 'Aamu.app vs Confluence: documentation that can leave the shelf',
    slug: 'aamuapp-vs-confluence-documentation-and-work',
    description: 'A practical comparison of Aamu.app and Confluence for teams that want documentation connected to tasks, support, meetings, and AI-assisted knowledge work.',
    tags: ['comparisons', 'docs', 'knowledge', 'ai'],
    html: `<p>Confluence is a familiar home for team documentation. It is good at collecting pages, spaces, project information, and the accumulated wisdom of a company—along with the occasional page called “New new onboarding FINAL v3”.</p><p>Aamu.app treats documentation as part of the workspace where the work happens. Docs can be connected to Tasks, Helpdesk, email, meetings, files, databases, and AI knowledge workflows.</p><h2>Confluence is documentation-first</h2><p>Confluence is a sensible choice when the team's main need is a shared documentation system, especially alongside an established project and engineering workflow. Its structure helps teams publish and find internal information.</p><p>The challenge for any documentation system is not only writing pages. It is keeping them alive. A page that is not connected to the work that changes it can become a historical artifact with excellent formatting.</p><h2>Aamu makes Docs operational</h2><p>In Aamu, a Doc can explain a process while a Task owns the update. A Helpdesk conversation can reveal a missing instruction. A meeting can create both a decision Doc and implementation tasks. Team Brain can retrieve maintained Docs when the team asks questions or prepares support drafts.</p><p>This gives documentation a feedback loop: real work shows where the knowledge is missing, and improved knowledge helps the next piece of real work.</p><h2>When Confluence may be the better choice</h2><p>Choose Confluence when a dedicated documentation hub is what the organization needs, particularly if the team already relies heavily on its surrounding ecosystem. Consider Aamu when Docs should be close to customer work, daily execution, and structured project data without another handoff.</p><p>Aamu does not claim that every page needs an AI assistant. Sometimes a page just needs a human who remembers to update it. The useful part is that the same workspace can support both the page and the follow-up.</p><h2>The bottom line</h2><p>Confluence is a strong documentation repository. Aamu.app is a connected workspace where documentation can become a Task, inform a customer answer, and remain close to the work that keeps it accurate. Fewer shelves, more doors.</p>`,
  },
];

if (!API_KEY || !DOCS_API_KEY || !DB_ID) throw new Error('API_KEY, DOCS_API_KEY, and AAMU_DB_ID/DB_ID are required.');

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || data?.error?.message || `HTTP ${response.status} from ${url}`);
  return data;
}

async function graphql(query, variables = {}) {
  const data = await requestJson(GRAPHQL_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'x-db-id': DB_ID }, body: JSON.stringify({ query, variables }) });
  if (data?.errors?.length) throw new Error(data.errors.map(error => error.message).join('; '));
  return data.data;
}

async function upsertDoc(post) {
  const headers = { 'Content-Type': 'application/json', 'x-api-key': DOCS_API_KEY, 'x-project-id': PROJECT_ID };
  const list = await requestJson(`${API_BASE_URL}/api/v1/docs/`, { headers });
  const existing = list.docs?.find(doc => doc.title === post.title);
  const body = JSON.stringify({ title: post.title, status: 'public', html: post.html, project_id: PROJECT_ID, pid: PROJECT_ID });
  const data = existing
    ? await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(existing.id)}`, { method: 'PATCH', headers, body })
    : await requestJson(`${API_BASE_URL}/api/v1/docs/`, { method: 'POST', headers, body });
  return { action: existing ? 'updated' : 'created', doc: data.doc || data };
}

async function upsertPost(post, docId) {
  const existing = (await graphql('{ BlogPostCollection { id slug } }')).BlogPostCollection.find(row => row.slug === post.slug);
  const data = await graphql(`mutation($id: ID, $title: String, $slug: String, $description: String, $publishDate: DateTime, $author: String, $status: String, $tags: [String], $doc: String) { BlogPost(id: $id, title: $title, slug: $slug, description: $description, publishDate: $publishDate, author: $author, status: $status, tags: $tags, doc: $doc) { id title slug status doc } }`, { id: existing?.id, title: post.title, slug: post.slug, description: post.description, publishDate: '2026-07-23T08:00:00.000Z', author: AUTHOR_ID, status: 'published', tags: post.tags, doc: docId });
  return data.BlogPost;
}

for (const post of posts) {
  const doc = await upsertDoc(post);
  const blogPost = await upsertPost(post, doc.doc.id);
  console.log(JSON.stringify({ doc: { action: doc.action, id: doc.doc.id, title: post.title }, blogPost }, null, 2));
}
