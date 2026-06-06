// build-blog-posts.js

import { createHash } from 'crypto';
import { existsSync, mkdirSync, rmdirSync, readFileSync, writeFileSync } from 'fs';
import { DateTime } from 'luxon';
import wget from 'node-wget-fetch';
import { basename } from 'path';
import { parse } from 'node-html-parser';
import 'dotenv/config';
import dotenv from 'dotenv';

dotenv.config({ path: '.envrc', override: false });

// Configuration
const API_BASE_URL = (process.env.AAMU_API_BASE_URL || 'https://ilkkah.aamu.app').replace(/\/$/, '');
const API_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://api.aamu.app/api/v1/graphql/';
const CONTENT_DIR = 'content/posts';
const TIMESTAMP_FILE = 'timestamp';
const API_KEY = process.env.API_KEY;
const DOCS_API_KEY = process.env.DOCS_API_KEY || API_KEY;
const DB_ID = process.env.AAMU_DB_ID || process.env.DB_ID;
const PROJECT_ID = process.env.AAMU_PROJECT_ID || process.env.PROJECT_ID;
const BLOG_DOC_FIELD = process.env.BLOG_DOC_FIELD;

const seriesBySlug = new Map([
	['aamuapp-as-an-ai-workspace-alternative-to-notion-ai-slack-ai-jira-and-zendesk', {
		series: ['AI support in Aamu.app'],
		seriesWeight: 10,
	}],
	['how-aamuapp-uses-team-brain-to-answer-from-your-company-knowledge', {
		series: ['AI support in Aamu.app'],
		seriesWeight: 20,
	}],
	['how-to-build-a-support-knowledge-base-that-ai-can-actually-use', {
		series: ['AI support in Aamu.app'],
		seriesWeight: 30,
	}],
	['ai-customer-support-with-aamuapp-team-brain-drafts-and-human-review', {
		series: ['AI support in Aamu.app'],
		seriesWeight: 40,
	}],
	['from-helpdesk-ticket-to-team-brain-ai-triage-docs-human-review', {
		series: ['AI support in Aamu.app'],
		seriesWeight: 50,
	}],
	['aamuapp-vs-linear-triage-customer-conversations-team-brain-human-reviewed-ai-support', {
		series: ['AI support in Aamu.app'],
		seriesWeight: 60,
	}],
]);

const coverBySlug = new Map([
	['ai-support-in-aamuapp', {
		image: 'ai-articles.png',
		alt: 'Aamu.app AI support articles',
	}],
]);

// Tracks the latest post update timestamp to fetch only newer posts
let latestTimestamp = loadLatestTimestamp();

// Loads the latest timestamp from a file, or returns 0 if not found
function loadLatestTimestamp() {
	try {
		return parseInt(readFileSync(TIMESTAMP_FILE).toString(), 10);
	} catch {
		return 0;
	}
}

// Saves the latest timestamp to a file
function saveLatestTimestamp() {
	writeFileSync(TIMESTAMP_FILE, latestTimestamp.toString());
}

// Logs errors in red for visibility
function logError(message) {
	const RED = '\x1b[31m';
	const RESET = '\x1b[0m';
	console.error(`${RED}${message}${RESET}`);
}

function getErrorMessage(error) {
	return error.cause?.message ? `${error.message}: ${error.cause.message}` : error.message;
}

function normalizeStatus(status) {
	return String(status || '').toLowerCase();
}

function formatTimestamp(timestamp) {
	return DateTime.fromMillis(timestamp).toISO({ suppressMilliseconds: false });
}

function requireApiKey(keyName, keyValue) {
	if (!keyValue) {
		throw new Error(`${keyName} environment variable is required.`);
	}
}

function generateStableFileName(identifier, originalName) {
	const hash = createHash('sha256').update(identifier).digest('hex').slice(0, 16);
	return `${hash}_${basename(originalName)}`;
}

function resolveApiUrl(url) {
	return new URL(url, API_BASE_URL).toString();
}

function getUrlBasename(url) {
	try {
		return basename(new URL(url, API_BASE_URL).pathname);
	} catch {
		return basename(url);
	}
}

function compactHeaders(headers) {
	return Object.fromEntries(Object.entries(headers).filter(([, value]) => value));
}

function getAuthHeaders(extraHeaders = {}) {
	return compactHeaders({
		...extraHeaders,
		'x-api-key': DOCS_API_KEY,
		'x-project-id': PROJECT_ID,
	});
}

function getGraphQLHeaders() {
	return compactHeaders({
		'Content-Type': 'application/json',
		'x-api-key': API_KEY,
		'x-db-id': DB_ID,
	});
}

function extractDocIds(value) {
	if (!value) return [];

	if (Array.isArray(value)) {
		return value.flatMap(extractDocIds);
	}

	if (typeof value === 'object') {
		return [
			...extractDocIds(value.id),
			...extractDocIds(value._id),
			...extractDocIds(value.doc_id),
			...extractDocIds(value.docId),
			...extractDocIds(value.value),
			...extractDocIds(value.values),
			...extractDocIds(value.uuid),
		];
	}

	if (typeof value !== 'string') {
		return [];
	}

	const trimmed = value.trim();
	if (!trimmed) return [];

	try {
		return extractDocIds(JSON.parse(trimmed));
	} catch {
		const ids = trimmed.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi);
		return ids?.length ? ids : [trimmed];
	}
}

async function fetchDoc(docId) {
	requireApiKey('DOCS_API_KEY or API_KEY', DOCS_API_KEY);
	const response = await fetch(`${API_BASE_URL}/api/v1/docs/${encodeURIComponent(docId)}`, {
		headers: getAuthHeaders(),
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data?.error?.message || `HTTP ${response.status}`);
	}

	return data?.doc;
}

async function hydratePostBodyFromDoc(post) {
	const docValues = [
		post.docs,
		post.doc,
		...Object.entries(post)
			.filter(([key]) => /^docs?\w*$/i.test(key))
			.map(([, value]) => value),
	];
	const docIds = [...new Set(docValues.flatMap(extractDocIds))];
	if (!docIds.length) {
		console.log(`No doc ids found for post: ${post.title}`);
		post.body = '';
		logError(`No doc id found for post "${post.title}".`);
		return;
	}

	for (const docId of docIds) {
		try {
			const doc = await fetchDoc(docId);
			if (doc?.html) {
				post.body = doc.html;
				console.log(`Using doc content for post: ${post.title}`);
				return;
			}
			console.log(`Doc ${docId} has no HTML for post: ${post.title}`);
		} catch (error) {
			logError(`Failed to fetch doc ${docId} for post "${post.title}": ${getErrorMessage(error)}`);
		}
	}

	if (!String(post.body || '').trim()) {
		post.body = '';
		logError(`No doc content found for post "${post.title}".`);
	}
}

// Generates Hugo-compatible front matter and content for a post
function createPostTemplate(post) {
	const seriesMetadata = seriesBySlug.get(post.slug);
	const seriesFrontMatter = seriesMetadata ? [
		`series: [${seriesMetadata.series.map(series => JSON.stringify(series)).join(', ')}]`,
		`seriesWeight: ${seriesMetadata.seriesWeight}`,
	].join('\n') : '';
	const coverMetadata = coverBySlug.get(post.slug);
	const coverImage = post.heroImage?.url || coverMetadata?.image || '';
	const coverAlt = coverMetadata?.alt ? `  alt: "${coverMetadata.alt}"` : '';

	return `
---
author: "${post.author?.name || ''}"
title: "${post.title}"
date: "${post.publishDate}"
modified: "${post.updated_at}"
description: "${post.description}"
cover:
  image: ${coverImage}
  relative: true
${coverAlt}
tags: [${(post.tags || []).map(tag => JSON.stringify(tag)).join(', ')}]
${seriesFrontMatter}
ShowToc: false
ShowBreadCrumbs: false
markup: html
---

${post.body || ''}
  `.trim();
}

function createPostSelection(docFields) {
	const docSelection = docFields.map(field => `        ${field}`).join('\n');
	return `
        id
        created_at
        updated_at
        title
        slug
        description
${docSelection}
        publishDate
        heroImage {
          url
          data
          name
        }
        author {
          name
        }
        status
        tags
`;
}

function createNewPostsQuery(docFields) {
	return {
		query: `
    query ($updated_at: DateTime!) {
      BlogPostCollection(
        filter: {
          status: { EQ: "published" },
          updated_at: { GT: $updated_at }
        }
      ) {
${createPostSelection(docFields)}
      }
    }
	`,
		variables: {
			updated_at: DateTime.fromMillis(latestTimestamp).toISO(),
		},
	};
}

// GraphQL query for draft posts to identify those to delete
const draftPostsQuery = {
	query: `
    {
      BlogPostCollection(
        filter: {
          status: { EQ: "draft" }
        }
      ) {
        id
        created_at
        updated_at
        title
        slug
        status
      }
    }
  `,
};

// Sends a GraphQL request to the API
async function sendGraphQLRequest(query) {
	try {
		requireApiKey('API_KEY', API_KEY);
		const response = await fetch(API_ENDPOINT, {
			method: 'POST',
			headers: getGraphQLHeaders(),
			body: JSON.stringify(query),
		});
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data?.error?.message || `HTTP ${response.status}`);
		}
		if (data?.errors?.length) {
			throw new Error(data.errors.map(error => error.message).join('; '));
		}

		return data;
	} catch (error) {
		logError(`GraphQL request failed: ${getErrorMessage(error)}`);
		throw error;
	}
}

async function getPostDocFields() {
	const data = await sendGraphQLRequest({
		query: `
      {
        __type(name: "BlogPost") {
          fields {
            name
          }
        }
      }
    `,
	});

	const fieldNames = data?.data?.__type?.fields?.map(field => field.name) || [];
	if (BLOG_DOC_FIELD) {
		if (!fieldNames.includes(BLOG_DOC_FIELD)) {
			throw new Error(`BLOG_DOC_FIELD="${BLOG_DOC_FIELD}" was not found in BlogPost fields.`);
		}
		return [BLOG_DOC_FIELD];
	}

	return fieldNames.filter(fieldName => /^docs?\w*$/i.test(fieldName));
}

// Fetches new/updated published posts and draft posts
async function fetchPosts() {
	console.log('Fetching posts updated/created after', formatTimestamp(latestTimestamp));
	const docFields = await getPostDocFields();
	console.log(`Detected BlogPost doc fields: ${docFields.length ? docFields.join(', ') : '(none)'}`);
	const [newPostsData, draftPostsData] = await Promise.all([
		sendGraphQLRequest(createNewPostsQuery(docFields)),
		sendGraphQLRequest(draftPostsQuery),
	]);

	const newPostsResponse = newPostsData?.data?.BlogPostCollection || [];
	const draftPostsResponse = draftPostsData?.data?.BlogPostCollection || [];
	const newPosts = newPostsResponse.filter(post => normalizeStatus(post.status) === 'published');
	const draftPosts = draftPostsResponse.filter(post => normalizeStatus(post.status) === 'draft');

	console.log(`Fetched ${newPosts.length} new/updated posts.`);
	console.log(`Fetched ${draftPosts.length} draft posts.`);

	return { newPosts, draftPosts };
}

// Deletes a post's folder if it exists
async function deletePost(post) {
	const folderPath = `${CONTENT_DIR}/${post.slug}`;
	if (existsSync(folderPath)) {
		rmdirSync(folderPath, { recursive: true });
		console.log(`Deleted draft post: ${post.title}`);
	}
}

// Processes and writes a post to the Hugo content directory
async function writePost(post) {
	console.log(`Writing post: ${post.title}`);
	const postUpdated = DateTime.fromISO(post.updated_at || post.created_at);
	const folderPath = `${CONTENT_DIR}/${post.slug}`;
	const filePath = `${folderPath}/index.md`;

	// Create the post's folder if it doesn't exist
	if (!existsSync(folderPath)) {
		mkdirSync(folderPath, { recursive: true });
	}

	await hydratePostBodyFromDoc(post);

	// Parse and update image URLs in the post body
	const htmlRoot = parse(post.body || '');
	const images = htmlRoot.querySelectorAll('img');
	for (const img of images) {
		const src = img.getAttribute('src');
		if (src) {
			try {
				const imageUrl = resolveApiUrl(src);
				const imageName = generateStableFileName(imageUrl, getUrlBasename(imageUrl));
				const imagePath = `${folderPath}/${imageName}`;
				await wget(imageUrl, imagePath);
				img.setAttribute('src', imageName);
			} catch (error) {
				logError(`Failed to download image ${src}: ${error.message}`);
			}
		}
	}
	post.body = htmlRoot.toString();

	// Process Markdown image links
	for (const match of post.body.matchAll(/!\[([^\]]*)\]\((\S+)\)/g)) {
		const [, alt, url] = match;
		try {
			const imageUrl = resolveApiUrl(url);
			const imageName = generateStableFileName(imageUrl, getUrlBasename(imageUrl));
			const imagePath = `${folderPath}/${imageName}`;
			await wget(imageUrl, imagePath);
			post.body = post.body.replace(match[0], `![${alt}](${imageName})`);
			console.log(`Fetched image: ${url}`);
		} catch (error) {
			logError(`Failed to download Markdown image ${url}: ${error.message}`);
		}
	}

	// Handle the cover image
	if (post.heroImage?.data && post.heroImage.name) {
		try {
			const heroImageName = generateStableFileName(post.heroImage.data, post.heroImage.name);
			writeFileSync(`${folderPath}/${heroImageName}`, Buffer.from(post.heroImage.data, 'base64'));
			post.heroImage.url = heroImageName;
		} catch (error) {
			logError(`Failed to save cover image: ${error.message}`);
		}
	} else if (post.heroImage?.url) {
		try {
			const imageUrl = resolveApiUrl(post.heroImage.url);
			const imageName = generateStableFileName(imageUrl, getUrlBasename(imageUrl));
			const imagePath = `${folderPath}/${imageName}`;
			await wget(imageUrl, imagePath);
			post.heroImage.url = imageName;
		} catch (error) {
			logError(`Failed to download cover image: ${error.message}`);
		}
	}

	// Write the post to disk
	writeFileSync(filePath, createPostTemplate(post));

	// Update the latest timestamp only after the post has been written.
	if (latestTimestamp < postUpdated.valueOf()) {
		latestTimestamp = postUpdated.valueOf();
	}
}

// Main function to build the blog
async function buildBlog() {
	try {
		const { newPosts, draftPosts } = await fetchPosts();

		// Process new and updated posts
		for (const post of newPosts) {
			await writePost(post);
		}

		console.log('');

		// Delete draft posts
		for (const post of draftPosts) {
			await deletePost(post);
		}

		// Save the latest timestamp
		saveLatestTimestamp();
	} catch (error) {
		logError(`Build failed: ${error.message}`);
	}
}

// Run the build process
buildBlog();
