import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';
const BLOG_POST_TABLE = 'BlogPost';

const title = 'Aamu Calendar now brings tasks and meetings together';
const slug = 'aamu-calendar-now-brings-tasks-and-meetings-together';

const html = String.raw`<p>A calendar is most useful when it shows the work that takes time, regardless of whether that work is called a task or a meeting. Aamu Calendar now brings both into one project-aware schedule.</p>
<p>Scheduled tasks and Aamu meetings appear together in the same weekly or monthly view. They remain separate Aamu objects, with their own details and workflows, but the calendar gives the team one place to understand when the work happens.</p>

<h2>Tasks and meetings in one view</h2>
<p>Aamu Calendar uses two event sources: scheduled Tasks and Meetings. Tasks are shown in blue and meetings in purple, so the type of each calendar item stays recognizable even when the week becomes busy.</p>
<p>Clicking an item opens its original Task or Meeting. The calendar is therefore a planning view, not a second copy of the data. Titles, dates, statuses, meeting details, task discussions, and other context continue to live in the source item.</p>

<h2>Create the right kind of item from the calendar</h2>
<p>Click and drag across a time range to create something new. When the range has been selected, Aamu asks whether it should become a Task or a Meeting.</p>
<ul>
<li><p>Choose <strong>Task</strong> when the time is reserved for work that should be tracked, assigned, discussed, or completed.</p></li>
<li><p>Choose <strong>Meeting</strong> when the time belongs to a team conversation, customer call, planning session, or another meeting workflow.</p></li>
</ul>
<p>The selected start and end times are carried into the new item. There is no need to recreate the same time range after leaving the calendar.</p>

<h2>A task can be a due-date task or a scheduled event</h2>
<p>Aamu Tasks support two useful date models. A normal task can have only a due date. A scheduled, event-type task has both a start time and an end time.</p>
<p>The calendar focuses on the second model: work that occupies a real time range. This includes scheduled task events and repeating task events. Calendar-synchronized task events also fit this model because they have both a beginning and an end.</p>
<p>This distinction keeps a deadline from pretending to be a booked block of time. A due date answers “when must this be finished?” A start–end range answers “when are we planning to do it?”</p>

<h2>Edit the whole time range</h2>
<p>Event-type Tasks and Meetings now use the same time-range editor. The editor shows the start, end, and duration together. A new range defaults to one hour, and moving its start preserves the existing duration.</p>
<p>The end must always be after the start. For meetings, the range is stored as both <code>start_time</code> and <code>end_time</code>, so the meeting has an explicit duration instead of only an arrival time.</p>
<p>You can also move or resize items directly in the calendar. Aamu updates the underlying Task or Meeting while preserving the object type and its surrounding project context.</p>

<h2>Calendar is now a top-level Aamu app</h2>
<p>Calendar now has its own entry in Aamu's main sidebar. It sits alongside Tasks and Meetings because it answers a different question: not only what work exists, but how that work fits into the available time.</p>
<p>The view follows the selected project when a project is active. In an all-project view, it can provide a broader picture of scheduled work across the workspace.</p>

<h2>A simpler planning loop</h2>
<p>The practical workflow is short:</p>
<ol>
<li><p>Open Calendar from the sidebar.</p></li>
<li><p>Review scheduled Tasks and Meetings together.</p></li>
<li><p>Drag across an open range.</p></li>
<li><p>Choose whether to create a Task or a Meeting.</p></li>
<li><p>Open, move, or resize the item as the plan changes.</p></li>
</ol>
<p>Aamu still keeps Tasks and Meetings distinct because they serve different purposes. The calendar brings them together only where that is useful: in time.</p>`;

const post = {
	title,
	slug,
	description: 'Aamu Calendar combines scheduled tasks and meetings in one project-aware view, with distinct colors, direct creation, drag-and-resize planning, and a shared start–end time editor.',
	directAnswer: 'Aamu Calendar shows scheduled tasks and Aamu meetings together while keeping them as separate source objects. Users can paint a time range, choose Task or Meeting, and edit the full start–end range from either the calendar or the item.',
	contentType: 'overview',
	audience: 'small and growing teams evaluating productivity software',
	faq: JSON.stringify([
		{
			question: 'Does Aamu Calendar show both tasks and meetings?',
			answer: 'Yes. It combines scheduled, event-type tasks and Aamu meetings in one view and uses different colors to distinguish them.'
		},
		{
			question: 'What happens when I drag across an empty time range?',
			answer: 'Aamu asks whether the selected range should become a Task or a Meeting, then carries the start and end times into the new item.'
		},
		{
			question: 'What is the difference between a due-date task and an event-type task?',
			answer: 'A due-date task has only a deadline, while an event-type task has a start and end time and represents work scheduled into a specific time range.'
		},
		{
			question: 'Can meeting duration be edited in Aamu?',
			answer: 'Yes. Meetings store both a start and end time and use the same time-range editor as event-type tasks.'
		}
	]),
	relatedPosts: JSON.stringify([
		'introduction-to-aamu-app',
		'aamuapp-as-a-calendly-alternative',
		'all-the-productivity-apps-you-could-think-of-100'
	]),
	publishDate: '2026-08-08T12:00:00.000Z',
	author: '29940627-51e8-4fd0-82ab-d718ddfe802f',
	status: 'published',
	tags: ['calendar', 'tasks', 'meetings', 'planning', 'productivity']
};

if (!API_KEY) throw new Error('API_KEY environment variable is required.');
if (!DB_ID) throw new Error('AAMU_DB_ID or DB_ID environment variable is required.');

async function requestJson(url, options) {
	const response = await fetch(url, options);
	const data = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(data?.error?.message || data?.message || `HTTP ${response.status}`);
	return data;
}

async function upsertDoc() {
	const headers = {
		'Content-Type': 'application/json',
		'x-api-key': DOCS_API_KEY,
		'x-project-id': PROJECT_ID
	};
	const list = await requestJson(`${API_BASE_URL}/api/v1/docs/`, { headers });
	const existing = list.docs?.find(doc => doc.title === title);
	const body = JSON.stringify({ title, status: 'public', html, project_id: PROJECT_ID, pid: PROJECT_ID });

	if (existing) {
		const data = await requestJson(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(existing.id)}`, {
			method: 'PATCH', headers, body
		});
		return { action: 'updated', doc: data.doc || { ...existing, html } };
	}

	const data = await requestJson(`${API_BASE_URL}/api/v1/docs/`, { method: 'POST', headers, body });
	return { action: 'created', doc: data.doc || data };
}

async function upsertBlogPost(docId) {
	const headers = { 'Content-Type': 'application/json', 'x-api-key': API_KEY };
	const basePath = `${API_BASE_URL}/api/v1/databases/${encodeURIComponent(DB_ID)}/tables/${BLOG_POST_TABLE}/rows`;
	const filter = encodeURIComponent(JSON.stringify({ slug }));
	const existingData = await requestJson(`${basePath}?limit=1&filter=${filter}`, { headers });
	const existing = existingData.rows?.[0];
	const body = JSON.stringify({ fields: { ...post, doc: docId } });
	const data = existing
		? await requestJson(`${basePath}/${encodeURIComponent(existing.id)}`, { method: 'PATCH', headers, body })
		: await requestJson(basePath, { method: 'POST', headers, body });
	return { action: existing ? 'updated' : 'created', post: data.row };
}

const docResult = await upsertDoc();
const postResult = await upsertBlogPost(docResult.doc.id);
console.log(JSON.stringify({
	doc: { action: docResult.action, id: docResult.doc.id, title },
	blogPost: postResult
}, null, 2));
