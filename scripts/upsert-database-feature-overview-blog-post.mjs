import fs from 'node:fs';

const envPath = process.env.AAMU_BLOG_ENVRC || '/home/ile/src/sc2/aamu-blog/.envrc';
const apiBaseUrl = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT || process.env.AAMU_API_GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const projectId = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID || 'a257707a-ba42-4bec-a927-b80e9df05cf5';
const author = process.env.AAMU_BLOG_AUTHOR || '29940627-51e8-4fd0-82ab-d718ddfe802f';

const title = 'Aamu.app Databases: a practical feature guide';
const slug = 'aamuapp-databases-practical-feature-guide';

// Keep this reference in sync with FORMULA_FUNCTION_CATALOG in some-companies-lib.
const formulaFunctions = [
	['Logical', 'IF(condition, value_if_true, [value_if_false])', 'Returns one of two values based on a condition.'],
	['Logical', 'IFERROR(value, fallback)', 'Returns fallback when evaluating value produces an error.'],
	['Logical', 'AND(condition, ...)', 'Returns true when every condition is truthy.'],
	['Logical', 'OR(condition, ...)', 'Returns true when any condition is truthy.'],
	['Logical', 'NOT(value)', 'Reverses a boolean value.'],
	['Logical', 'XOR(condition, ...)', 'Returns true when an odd number of conditions are truthy.'],
	['Logical', 'SWITCH(value, case, result, ..., [default])', 'Matches a value to cases and returns the corresponding result.'],
	['Logical', 'COALESCE(value, ...)', 'Returns the first non-empty value.'],
	['Text', 'CONCAT(value, ...)', 'Joins values without a separator.'],
	['Text', 'JOIN(separator, value, ...)', 'Joins values using a separator.'],
	['Text', 'LOWER(text)', 'Converts text to lowercase.'],
	['Text', 'UPPER(text)', 'Converts text to uppercase.'],
	['Text', 'TRIM(text)', 'Removes leading and trailing whitespace and collapses internal whitespace.'],
	['Text', 'LENGTH(value)', 'Returns the length of text or a list.'],
	['Text', 'LEN(value)', 'Alias for LENGTH.'],
	['Text', 'LEFT(text, [count])', 'Returns characters from the beginning of text.'],
	['Text', 'RIGHT(text, [count])', 'Returns characters from the end of text.'],
	['Text', 'MID(text, start, count)', 'Returns characters starting at a one-based position.'],
	['Text', 'SUBSTITUTE(text, search, replacement, [occurrence])', 'Replaces all or one occurrence of text.'],
	['Text', 'REPLACE(text, start, count, replacement)', 'Replaces characters at a one-based position.'],
	['Text', 'CONTAINS(text, search)', 'Tests whether text contains a value.'],
	['Text', 'STARTS_WITH(text, prefix)', 'Tests whether text starts with a value.'],
	['Text', 'ENDS_WITH(text, suffix)', 'Tests whether text ends with a value.'],
	['Math', 'ROUND(number, [precision])', 'Rounds a number to a number of decimal places.'],
	['Math', 'ABS(number)', 'Returns the absolute value of a number.'],
	['Math', 'FLOOR(number, [significance])', 'Rounds a number down to a multiple.'],
	['Math', 'CEILING(number, [significance])', 'Rounds a number up to a multiple.'],
	['Math', 'MOD(number, divisor)', 'Returns the remainder after division.'],
	['Math', 'POWER(number, exponent)', 'Raises a number to a power.'],
	['Math', 'SQRT(number)', 'Returns the non-negative square root.'],
	['Math', 'MIN(value, ...)', 'Returns the smallest numeric value.'],
	['Math', 'MAX(value, ...)', 'Returns the largest numeric value.'],
	['Math', 'SUM(value, ...)', 'Returns the sum of numeric values.'],
	['Math', 'AVERAGE(value, ...)', 'Returns the average of numeric values.'],
	['Math', 'COUNT(value, ...)', 'Counts non-empty values.'],
	['Relation', 'SUM_FIELD(records, field)', 'Sums a field from records returned by LOOKUP_RECORDS.'],
	['Relation', 'AVERAGE_FIELD(records, field)', 'Averages a field from records returned by LOOKUP_RECORDS.'],
	['Relation', 'MIN_FIELD(records, field)', 'Returns the smallest numeric field value from records.'],
	['Relation', 'MAX_FIELD(records, field)', 'Returns the largest numeric field value from records.'],
	['Relation', 'COUNT_FIELD(records, field)', 'Counts non-empty field values in records.'],
	['Relation', 'LOOKUP_ONE(table, field, value, [field, value, ...], [$order_by, field], [$order, direction])', 'Returns the first matching record from a Database table.'],
	['Relation', 'LOOKUP_RECORDS(table, field, value, [field, value, ...], [$order_by, field], [$order, direction], [$limit, count])', 'Returns matching records from a Database table.'],
	['Date', 'NOW()', 'Returns the formula evaluation time as an ISO timestamp.'],
	['Date', 'TODAY()', 'Returns the formula evaluation date in UTC.'],
	['Date', 'DATE(year, month, day)', 'Creates a UTC date. Month is one-based.'],
	['Date', 'YEAR(date)', 'Returns the UTC year of a date.'],
	['Date', 'MONTH(date)', 'Returns the one-based UTC month of a date.'],
	['Date', 'DAY(date)', 'Returns the UTC day of the month.'],
	['Date', 'DATE_ADD(date, amount, [unit])', 'Adds days, weeks, months, years, hours, minutes, or seconds to a date.'],
	['Date', 'DATE_DIFF(start, end, [unit])', 'Returns elapsed days, weeks, hours, minutes, or seconds.'],
	['Date', 'DAYS_BETWEEN(start, end)', 'Returns elapsed days between dates.'],
	['Info', 'ISBLANK(value)', 'Tests whether a value is null, undefined, or empty text.'],
	['Info', 'ISNUMBER(value)', 'Tests whether a value is a finite number.'],
	['Info', 'ISTEXT(value)', 'Tests whether a value is text.'],
	['List', 'FIRST(values)', 'Returns the first item in a list.'],
	['List', 'LAST(values)', 'Returns the last item in a list.'],
	['List', 'NTH(values, position)', 'Returns an item at a one-based position.'],
	['List', 'UNIQUE(values)', 'Returns unique list values while preserving order.'],
	['List', 'SORT(values, [direction])', 'Returns a sorted copy of a list; direction is asc or desc.'],
];

const escapeHtml = value => String(value)
	.replaceAll('&', '&amp;')
	.replaceAll('<', '&lt;')
	.replaceAll('>', '&gt;')
	.replaceAll('"', '&quot;');

const formulaReferenceHtml = [...new Set(formulaFunctions.map(([category]) => category))]
	.map(category => {
		const rows = formulaFunctions
			.filter(([itemCategory]) => itemCategory === category)
			.map(([, signature, description]) => `<tr><td><code>${escapeHtml(signature)}</code></td><td>${escapeHtml(description)}</td></tr>`)
			.join('');
		return `<h3 xmlns="http://www.w3.org/1999/xhtml">${escapeHtml(category)} functions</h3><table xmlns="http://www.w3.org/1999/xhtml"><thead><tr><th>Function</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>`;
	})
	.join('\n');

const parseEnvrc = path => Object.fromEntries(
	fs.readFileSync(path, 'utf8')
		.split(/\n/)
		.map(line => line.trim())
		.filter(line => line.startsWith('export ') && line.includes('='))
		.map(line => {
			const value = line.slice('export '.length);
			const index = value.indexOf('=');
			return [value.slice(0, index), value.slice(index + 1).replace(/^['"]|['"]$/g, '')];
		})
);

const env = parseEnvrc(envPath);
const apiKey = process.env.AAMU_API_KEY || process.env.API_KEY || env.API_KEY;
const docsApiKey = process.env.DOCS_API_KEY || env.DOCS_API_KEY || apiKey;
const dbId = process.env.AAMU_DB_ID || process.env.DB_ID || env.AAMU_DB_ID || env.DB_ID;

const html = String.raw`<p xmlns="http://www.w3.org/1999/xhtml">Aamu.app Databases are for structured work that needs more than a document but should stay connected to the rest of a team's workspace. A database can hold a CRM, content calendar, product catalogue, research collection, inventory, application pipeline, form responses, or the content for a public website.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The familiar starting point is a table with columns and rows. From there, Aamu adds saved views, filters, grouping, formulas, relations, bulk editing, activity history, automations, forms, portable backups, and APIs. This guide covers the current Database feature from everyday editing to external integrations.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Databases, tables, columns, and rows</h2>
<p xmlns="http://www.w3.org/1999/xhtml">A Database belongs to an Aamu project and can contain multiple tables. Each table has its own schema and rows, while tables in the same Database can be connected with reference columns and formulas.</p>
<p xmlns="http://www.w3.org/1999/xhtml">A column has both a display name and a stable API identifier. The display name can be made friendly for people, while the identifier gives GraphQL, REST, CSV imports, formulas, and integrations a predictable field name. Rows also include created and updated timestamps in addition to the fields you define.</p>
<p xmlns="http://www.w3.org/1999/xhtml">You can start with an empty Database, create one from a template, add more tables, duplicate a table with its rows, and rename or remove tables as the structure evolves. Deleted tables, columns, and rows go to the Database recycle bin instead of disappearing from the normal interface without a recovery path.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Column types</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Column types define how values are edited, displayed, validated, exposed through the API, and used by other Database features. The current editor supports:</p>
<ul xmlns="http://www.w3.org/1999/xhtml">
	<li><p><strong>Text, Long Text, and Link</strong> for names, notes, descriptions, identifiers, and URLs.</p></li>
	<li><p><strong>Number</strong> for amounts, quantities, scores, percentages, and other numeric values. Number columns can have display formatting, precision, and a symbol.</p></li>
	<li><p><strong>Status</strong> for a single labelled choice and <strong>Checkbox</strong> for multiple choices.</p></li>
	<li><p><strong>Tags</strong> for reusable labels and categories.</p></li>
	<li><p><strong>Time &amp; Date</strong> for one point in time and <strong>Timeline</strong> for a start and end range.</p></li>
	<li><p><strong>Location</strong> for a place with structured location data.</p></li>
	<li><p><strong>User</strong> for connecting one or more team members to a row.</p></li>
	<li><p><strong>Outside contact</strong> for connecting an Email contact to a row.</p></li>
	<li><p><strong>File</strong> and <strong>Files</strong> for one or several Aamu file attachments.</p></li>
	<li><p><strong>Document, Task, Email, and Meeting</strong>, each with singular and plural variants, for linking rows directly to other Aamu workspace objects.</p></li>
	<li><p><strong>Reference</strong> for relations between Database tables.</p></li>
	<li><p><strong>Formula</strong> for read-only computed values.</p></li>
</ul>
<p xmlns="http://www.w3.org/1999/xhtml">This mix is what makes a Database more than an isolated spreadsheet. A sales row can have a numeric deal value, a status, an owner, a follow-up date, related meeting notes, Tasks, Emails, and a reference to another table without copying all that context into text cells.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Grid editing</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The table grid is the main view for dense data work. Cells use editors appropriate to their column type, and rows can also be opened in a details dialog when a record is easier to review vertically.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The grid supports spreadsheet-style selection and clipboard work. Select a rectangular range by dragging, copy it with Ctrl/Cmd+C, and paste tabular data with Ctrl/Cmd+V. A single copied value can fill a larger selected range. Pasting respects editable column types and leaves Formula columns read-only.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu loads large tables in pages and renders the working window virtually. This keeps normal scrolling and editing practical without requiring the browser to render every row and cell in a large table at once.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Sorting, filtering, and searching</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Click a column header to sort the table, or sort by row creation and update time. Database search can narrow the visible rows without changing the stored data.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Grid filters make repeatable subsets more precise. A filter can test whether a value:</p>
<ul xmlns="http://www.w3.org/1999/xhtml">
	<li><p>is or is not equal to another value,</p></li>
	<li><p>contains or does not contain text or a choice,</p></li>
	<li><p>is empty or is not empty, or</p></li>
	<li><p>is greater than, greater than or equal to, less than, or less than or equal to a value.</p></li>
</ul>
<p xmlns="http://www.w3.org/1999/xhtml">Multiple conditions can match either all conditions or any condition. The filter editor adapts the input to the selected column, so a Status field can use its configured choices while numeric and date-like fields use suitable values.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Saved Grid views</h2>
<p xmlns="http://www.w3.org/1999/xhtml">A Grid view saves a useful way of looking at one table. A view can store filters, sorting, hidden columns, grouping, and aggregate choices. Instead of rebuilding the same setup each time, select the saved view and continue working from it.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Views can be shared with the project or kept personal. This supports both team workflows and individual working views: the team can maintain a shared “Open applications” view while one person keeps a private view of records assigned to them.</p>
<p xmlns="http://www.w3.org/1999/xhtml">When a saved view is changed, Aamu marks it as having unsaved changes. You can save the changes back to the view, save the configuration as a new view, rename a view, or delete one without modifying the underlying rows.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Grouping and summaries</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Rows in the Grid can be grouped by a visible column. Groups can be collapsed, which is useful for scanning a large table by status, owner, category, customer, or another meaningful field.</p>
<p xmlns="http://www.w3.org/1999/xhtml">A group can also calculate summaries for columns. Available aggregate operations include Count, Sum, Average, Minimum, and Maximum where the column type supports them. The same table can therefore show operational detail and lightweight summaries without exporting the data to a separate spreadsheet.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">List, Kanban, and Calendar views</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The same rows can be presented in views suited to different kinds of work:</p>
<ul xmlns="http://www.w3.org/1999/xhtml">
	<li><p><strong>Table</strong> is the full grid for editing, filtering, grouping, and working across many cells.</p></li>
	<li><p><strong>List</strong> presents records as individual row cards and is useful when each row has many fields.</p></li>
	<li><p><strong>Kanban</strong> uses a Status column as lanes. Moving a card changes the row's status and order.</p></li>
	<li><p><strong>Calendar</strong> uses a Time &amp; Date or Timeline column to place rows on a calendar.</p></li>
</ul>
<p xmlns="http://www.w3.org/1999/xhtml">These are different presentations of the same records, not separate copies. An application can be triaged in a Kanban view, scheduled in Calendar, and edited in the Grid while keeping one underlying row.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">References and relational data</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Reference columns connect rows between tables in the same Database. A reference can point to one row or many rows, and Aamu can create an inverse reference on the other table when the relationship should be navigable in both directions.</p>
<p xmlns="http://www.w3.org/1999/xhtml">For example, a CRM Database can have separate Companies and Contacts tables. Each Contact references a Company, while the Company row can show the related Contacts. A Projects table can similarly reference Customers, Deliverables, or Invoices without flattening everything into one oversized sheet.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The row details dialog shows both visible fields and references coming from other rows. New related records can be created from the relationship workflow, which reduces the need to jump between tables while entering connected data.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Formula columns</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Formula columns calculate read-only values from the row. The formula editor suggests fields and functions, validates the expression, and previews a result from existing data before the column is saved.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Formula expressions are parsed by Aamu's formula engine; they are not evaluated as JavaScript. A formula can use literals, row fields, operators, parentheses, and the supported functions listed below. Function names are case-insensitive, while field names use the column's stable API identifier.</p>

<h3 xmlns="http://www.w3.org/1999/xhtml">Values and field references</h3>
<p xmlns="http://www.w3.org/1999/xhtml">Text can use single or double quotes. Numbers support decimals and exponent notation. The literal values <code>true</code>, <code>false</code>, and <code>null</code> are also supported.</p>
<pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">"Active customer"
125.50
true
customer_name
created_at
company.country</code></pre>
<p xmlns="http://www.w3.org/1999/xhtml">A simple field reference such as <code>amount</code> reads that field from the current row. Reference columns can be followed with dot notation, such as <code>company.name</code>. A one-to-many Reference produces a list, so following a field can produce a list of values.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Every formula row also has the built-in fields <code>id</code>, <code>created_at</code>, and <code>updated_at</code>. Dates use ISO-formatted values, and date functions use UTC.</p>

<h3 xmlns="http://www.w3.org/1999/xhtml">Operators</h3>
<table xmlns="http://www.w3.org/1999/xhtml"><thead><tr><th>Operators</th><th>Purpose</th></tr></thead><tbody>
	<tr><td><code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>%</code>, <code>^</code></td><td>Addition, subtraction, multiplication, division, remainder, and exponentiation. If either side of <code>+</code> is text, the values are concatenated.</td></tr>
	<tr><td><code>==</code>, <code>===</code>, <code>!=</code>, <code>!==</code></td><td>Equality and inequality. The double and triple forms currently use the same strict comparison behavior.</td></tr>
	<tr><td><code>&gt;</code>, <code>&gt;=</code>, <code>&lt;</code>, <code>&lt;=</code></td><td>Greater than, greater than or equal, less than, and less than or equal.</td></tr>
	<tr><td><code>&amp;&amp;</code>, <code>||</code>, <code>!</code></td><td>Logical AND, OR, and NOT. AND and OR short-circuit.</td></tr>
	<tr><td><code>+value</code>, <code>-value</code></td><td>Unary numeric conversion and negation.</td></tr>
	<tr><td><code>(...)</code></td><td>Controls evaluation order.</td></tr>
</tbody></table>
<p xmlns="http://www.w3.org/1999/xhtml">Division or remainder by zero returns <code>null</code>. Numeric results must be finite; invalid numeric results produce a formula error.</p>

<h3 xmlns="http://www.w3.org/1999/xhtml">Formula examples</h3>
<pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">IF(status == "won", amount, 0)
DATE_DIFF(created_at, TODAY(), "days")
CONCAT(company.name, " — ", contact_name)
SUM_FIELD(LOOKUP_RECORDS("LineItems", "order", id), "total")
IFERROR(company.country, "Country not set")</code></pre>

<h3 xmlns="http://www.w3.org/1999/xhtml">Lookup functions</h3>
<p xmlns="http://www.w3.org/1999/xhtml"><code>LOOKUP_ONE</code> and <code>LOOKUP_RECORDS</code> query another table in the same Database. The table name and condition field names are stable API identifiers written as strings. Conditions are supplied as field/value pairs and all supplied conditions must match.</p>
<pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">LOOKUP_ONE("Companies", "domain", email_domain)

LOOKUP_RECORDS(
  "Invoices",
  "customer", id,
  "status", "open",
  "$order_by", "due_date",
  "$order", "asc",
  "$limit", 100
)</code></pre>
<p xmlns="http://www.w3.org/1999/xhtml"><code>$order_by</code> accepts a column identifier, <code>id</code>, <code>created_at</code>, or <code>updated_at</code>. <code>$order</code> is <code>asc</code> or <code>desc</code>. <code>$limit</code> is available to <code>LOOKUP_RECORDS</code> and can be from 1 to 1,000. <code>LOOKUP_ONE</code> always returns at most one record; <code>LOOKUP_RECORDS</code> returns a list.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Lookup functions require server-side Database data. The editor can validate the expression before saving, but a complete preview of a lookup may require saving the Formula so Aamu can evaluate it on the server.</p>

<h3 xmlns="http://www.w3.org/1999/xhtml">Supported functions</h3>
<p xmlns="http://www.w3.org/1999/xhtml">Square brackets in a signature mark an optional argument. An ellipsis means that the function accepts more values up to the formula argument limit.</p>
${formulaReferenceHtml}

<h3 xmlns="http://www.w3.org/1999/xhtml">Evaluation behavior and limits</h3>
<ul xmlns="http://www.w3.org/1999/xhtml">
	<li><p><code>IF</code>, <code>IFERROR</code>, <code>AND</code>, <code>OR</code>, and <code>SWITCH</code> evaluate lazily. A branch that is not selected is not evaluated.</p></li>
	<li><p><code>NOW()</code> and <code>TODAY()</code> use one consistent evaluation time for the formula calculation. <code>TODAY()</code> returns the UTC date.</p></li>
	<li><p><code>DATE_ADD</code> supports day, week, month, year, hour, minute, and second units in singular or plural form. <code>DATE_DIFF</code> supports day, week, hour, minute, and second units.</p></li>
	<li><p><code>LEFT</code>, <code>RIGHT</code>, <code>MID</code>, <code>REPLACE</code>, and <code>NTH</code> use one-based positions where a position is requested.</p></li>
	<li><p>A formula can contain at most 4,096 characters, 1,000 tokens, 100 function arguments, 64 expression nesting levels, and a field path of 32 parts.</p></li>
	<li><p>Reference traversal is limited to 10 levels. A lookup can return at most 1,000 rows.</p></li>
	<li><p>A text result can contain at most 100,000 characters and an array result at most 10,000 items. Circular and non-finite results are rejected.</p></li>
</ul>
<p xmlns="http://www.w3.org/1999/xhtml">Formula errors are stored separately from the computed value and can be exposed through Database APIs. Use <code>IFERROR</code> when a fallback is an intentional part of the calculation; otherwise, let the error remain visible so an invalid field, date, lookup, or argument does not silently become misleading data.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Stable API identifiers are the field names used in formulas. Choosing clear identifiers makes the schema easier to use in formulas, CSV imports, GraphQL, and REST integrations.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Mass actions</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Select multiple rows when an operation should apply to a set. Current mass actions can:</p>
<ul xmlns="http://www.w3.org/1999/xhtml">
	<li><p>set or clear a value in an editable column,</p></li>
	<li><p>duplicate selected rows,</p></li>
	<li><p>copy complete rows as tab-separated values, and</p></li>
	<li><p>move rows to the recycle bin or restore them.</p></li>
</ul>
<p xmlns="http://www.w3.org/1999/xhtml">Batch operations report how many rows succeeded and failed. This is useful for imports and operational tables where changing records one at a time would be slow.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Activity, undo, and redo</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Every row has an activity timeline. It explains what changed, which field was affected, the previous and new values, who made the change, and when it happened. Related Docs, Tasks, Emails, Meetings, users, and referenced rows are rendered with useful names instead of only raw identifiers when that context is available.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Recent Database mutations can be undone and redone. Undo and redo are available from the activity workflow and through the familiar Ctrl/Cmd+Z and Ctrl/Cmd+Y or Shift+Ctrl/Cmd+Z shortcuts in the Grid. The history shows when a mutation has been undone.</p>
<p xmlns="http://www.w3.org/1999/xhtml">This matters when a paste, bulk edit, or ordinary cell change affects real operational data. The team gets both an audit trail and a practical recovery action.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">CSV import and export</h2>
<p xmlns="http://www.w3.org/1999/xhtml">A table can be exported as CSV for spreadsheet work, reporting, migration, or archival use. CSV rows can also be imported into an existing table.</p>
<p xmlns="http://www.w3.org/1999/xhtml">During import, headers can match either a column's display name or its stable API identifier. Imported rows are appended to the table, values are parsed according to the destination column types, and Formula columns are ignored because their results are computed.</p>
<p xmlns="http://www.w3.org/1999/xhtml">For repeatable integrations, use stable identifiers in the CSV header. Display names may be renamed for people, while API identifiers are designed to remain predictable for machines.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Portable Database backups</h2>
<p xmlns="http://www.w3.org/1999/xhtml">A Database can be downloaded as a portable <code>.aamu.json</code> backup. Unlike a table-level CSV, the backup preserves the Database structure: tables, columns, rows, references, saved views, and related definitions needed to move the structured application.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Restoring a backup is non-destructive. Aamu restores tables into the selected Database as new copies and remaps internal identifiers and references. Saved views are restored, while restored automations and forms remain drafts so potentially active workflows are not silently enabled.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Use CSV when the goal is to move rows in or out of one table. Use the portable backup when the schema and relationships matter too.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Forms and response data</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu Forms store submissions in a connected Database table. Form questions become typed columns and each submission becomes a row. Responses can then be filtered, grouped, reviewed in another view, connected to other records, or passed into an automation.</p>
<p xmlns="http://www.w3.org/1999/xhtml">This pattern works for contact forms, surveys, applications, registrations, bug reports, and internal requests. The Form collects the input; the Database becomes the structured system of record for what happens next.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">Database automations</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Automations turn row events into workspace actions. An automation can react to a row being inserted or updated, optionally test conditions against its fields, and then perform one or more actions.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Typical workflows include creating a Task from a new form response, updating another Database row, sending a notification, or starting a newsletter-related action. Automation runs are recorded so the workflow can be inspected instead of behaving like an invisible background rule.</p>
<p xmlns="http://www.w3.org/1999/xhtml">For safety, restored automations stay in draft status. Review their table references, conditions, and actions before enabling them in a restored Database.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">GraphQL API</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Every Database can expose a generated GraphQL schema based on the table and column API identifiers. Integrations can query rows and use mutations to insert, update, and delete data with typed fields.</p>
<pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-graphql">query {
  CustomerCollection(filter: { status: { EQ: "active" } }) {
    id
    name
    email
    updated_at
  }
}

mutation {
  Customer(name: "Acme", status: "lead") {
    id
    name
  }
}</code></pre>
<p xmlns="http://www.w3.org/1999/xhtml">Requests use an API key and the Database id. The generated schema makes Aamu Databases useful as a lightweight backend for websites, small applications, content systems, and integrations. This blog itself uses a Database for post metadata and Docs for article content.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">REST Database API</h2>
<p xmlns="http://www.w3.org/1999/xhtml">The team API also exposes the Database lifecycle directly. REST endpoints can create, inspect, rename, and delete Databases, tables, and columns; list, create, update, delete, and batch-process rows; manage automations; read activity; and run data transfer operations.</p>
<pre xmlns="http://www.w3.org/1999/xhtml"><code class="language-plaintext">GET    /api/v1/databases/
POST   /api/v1/databases/
GET    /api/v1/databases/{dbId}/tables
POST   /api/v1/databases/{dbId}/tables/{tableId}/columns
GET    /api/v1/databases/{dbId}/tables/{tableId}/rows
POST   /api/v1/databases/{dbId}/tables/{tableId}/rows
PATCH  /api/v1/databases/{dbId}/tables/{tableId}/rows/{rowId}
POST   /api/v1/databases/{dbId}/tables/{tableId}/rows/batch
GET    /api/v1/databases/{dbId}/backup
POST   /api/v1/databases/{dbId}/restore</code></pre>
<p xmlns="http://www.w3.org/1999/xhtml">Row listing supports filtering, sorting, and cursor pagination. Batch writes can be made atomic when the integration needs all requested changes to succeed together, and idempotency support helps clients avoid repeating the same write after a retry.</p>

<h2 xmlns="http://www.w3.org/1999/xhtml">A practical way to design a Database</h2>
<ol xmlns="http://www.w3.org/1999/xhtml">
	<li><p>Decide what one row represents: a customer, application, article, product, response, or another clear object.</p></li>
	<li><p>Create typed columns for values you need to filter, group, calculate, or integrate. Keep longer narrative material in a linked Doc.</p></li>
	<li><p>Use stable, readable API identifiers before connecting scripts or external applications.</p></li>
	<li><p>Split repeated entities into another table and connect them with References instead of duplicating data.</p></li>
	<li><p>Create shared views for team workflows and personal views for individual focus.</p></li>
	<li><p>Add Form input, formulas, and automations only after the core row structure is understandable.</p></li>
	<li><p>Export a CSV for tabular interchange and keep portable backups when the complete structure matters.</p></li>
</ol>

<h2 xmlns="http://www.w3.org/1999/xhtml">The bottom line</h2>
<p xmlns="http://www.w3.org/1999/xhtml">Aamu.app Databases combine the approachable table model of a spreadsheet with the structure of a small relational application. Rows can be edited in a Grid, List, Kanban, or Calendar; organized with saved views, filters, grouping, and summaries; connected with References and formulas; and changed safely with bulk tools, activity history, undo, and redo.</p>
<p xmlns="http://www.w3.org/1999/xhtml">The feature becomes more useful because it is part of the wider workspace. Forms can create rows, automations can turn rows into actions, fields can link to Docs and other Aamu objects, and both GraphQL and REST APIs can connect the same data to external systems.</p>
<p xmlns="http://www.w3.org/1999/xhtml">Use a Doc when the main thing is maintained writing. Use Tasks when the main thing is actionable work. Use a Database when the team needs structured records that can be viewed, related, calculated, automated, and integrated without leaving the project where the rest of the work lives.</p>`;

const post = {
	title,
	slug,
	description: 'A practical reference for Aamu.app Databases: typed columns, views, filters, formulas and functions, relations, history, bulk editing, backups, automations, and APIs.',
	publishDate: '2026-07-19T09:00:00.000Z',
	author,
	status: 'published',
	tags: ['database', 'databases', 'documentation', 'formulas', 'api', 'automations'],
};

if (!apiKey) throw new Error(`API key not found in the environment or ${envPath}.`);
if (!dbId) throw new Error(`Database id not found in the environment or ${envPath}.`);

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
	const data = await requestJson(graphqlEndpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'x-db-id': dbId },
		body: JSON.stringify({ query, variables }),
	});
	if (data?.errors?.length) throw new Error(data.errors.map(error => error?.message || String(error)).join('; '));
	return data.data;
}

async function upsertDoc() {
	const headers = { 'Content-Type': 'application/json', 'x-api-key': docsApiKey, 'x-project-id': projectId };
	const list = await requestJson(`${apiBaseUrl}/api/v1/docs/`, { headers });
	const existing = list.docs?.find(doc => doc.title === title);
	const body = JSON.stringify({ title, status: 'public', html, project_id: projectId, pid: projectId });
	if (existing) {
		const data = await requestJson(`${apiBaseUrl}/api/v1/docs/${encodeURIComponent(existing.id)}`, { method: 'PATCH', headers, body });
		return { action: 'updated', doc: data.doc || existing };
	}
	const data = await requestJson(`${apiBaseUrl}/api/v1/docs/`, { method: 'POST', headers, body });
	return { action: 'created', doc: data.doc || data };
}

async function upsertBlogPost(docId) {
	const found = await graphql(`query FindBlogPost($slug: String!) { BlogPost(slug: $slug) { id } }`, { slug });
	const existingId = found.BlogPost?.id;
	const variables = existingId
		? {
			id: existingId,
			title: post.title,
			slug: post.slug,
			description: post.description,
			tags: post.tags,
			doc: docId,
		}
		: { id: null, ...post, doc: docId };
	const data = await graphql(`
		mutation UpsertBlogPost($id: ID, $title: String, $slug: String, $description: String, $publishDate: DateTime, $author: String, $status: String, $tags: [String], $doc: String) {
			BlogPost(id: $id, title: $title, slug: $slug, description: $description, publishDate: $publishDate, author: $author, status: $status, tags: $tags, doc: $doc) {
				id title slug description status publishDate tags doc author { id name }
			}
		}
	`, variables);
	return { action: existingId ? 'updated' : 'created', post: data.BlogPost };
}

const docResult = await upsertDoc();
const postResult = await upsertBlogPost(docResult.doc.id);

console.log(JSON.stringify({
	doc: { action: docResult.action, id: docResult.doc.id, title },
	blogPost: postResult,
}, null, 2));
