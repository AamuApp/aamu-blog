// build-blog-posts.js

import { existsSync, mkdirSync, rmdirSync, readFileSync, writeFileSync } from 'fs';
import { DateTime } from 'luxon';
import wget from 'node-wget-fetch';
import { basename } from 'path';
import { parse } from 'node-html-parser';
import 'dotenv/config';

// Configuration
const API_ENDPOINT = 'https://api.aamu.app/api/v1/graphql/';
const CONTENT_DIR = 'content/posts';
const TIMESTAMP_FILE = 'timestamp';

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

function generateRandomFileName(originalName) {
	return Math.floor(Math.random() * 10000000000000000) + '_' + basename(originalName);
}

// Generates Hugo-compatible front matter and content for a post
function createPostTemplate(post) {
	return `
---
author: "${post.author?.name || ''}"
title: "${post.title}"
date: "${post.publishDate}"
modified: "${post.updated_at}"
description: "${post.description}"
cover:
  image: ${post.heroImage?.url || ''}
tags: [${(post.tags || []).map(tag => JSON.stringify(tag)).join(', ')}]
ShowToc: false
ShowBreadCrumbs: false
---

${post.body}
  `.trim();
}

// GraphQL query for published posts updated after the latest timestamp
const newPostsQuery = {
	query: `
    query ($updated_at: DateTime!) {
      BlogPostCollection(
        filter: {
          status: { EQ: "published" },
          updated_at: { GT: $updated_at }
        }
      ) {
        id
        created_at
        updated_at
        title
        slug
        description
        body
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
      }
    }
  `,
	variables: {
		updated_at: DateTime.fromMillis(latestTimestamp).toISO(),
	},
};

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
		const response = await fetch(API_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': process.env.API_KEY,
			},
			body: JSON.stringify(query),
		});
		return await response.json();
	} catch (error) {
		logError(`GraphQL request failed: ${error.message}`);
		throw error;
	}
}

// Fetches new/updated published posts and draft posts
async function fetchPosts() {
	console.log('Fetching posts updated/created after', DateTime.fromMillis(latestTimestamp).toISO());
	const [newPostsData, draftPostsData] = await Promise.all([
		sendGraphQLRequest(newPostsQuery),
		sendGraphQLRequest(draftPostsQuery),
	]);

	const newPosts = newPostsData?.data?.BlogPostCollection || [];
	const draftPosts = draftPostsData?.data?.BlogPostCollection || [];

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
	console.log(`\nWriting post: ${post.title}`);
	const postUpdated = DateTime.fromISO(post.updated_at || post.created_at);
	const folderPath = `${CONTENT_DIR}/${post.slug}`;
	const filePath = `${folderPath}/index.md`;

	// Update the latest timestamp if this post is newer
	if (latestTimestamp < postUpdated.valueOf()) {
		latestTimestamp = postUpdated.valueOf();
	}

	// Create the post's folder if it doesn't exist
	if (!existsSync(folderPath)) {
		mkdirSync(folderPath, { recursive: true });
	}

	// Parse and update image URLs in the post body
	const htmlRoot = parse(post.body);
	const images = htmlRoot.querySelectorAll('img');
	for (const img of images) {
		const src = img.getAttribute('src');
		if (src) {
			try {
				const imagePath = `${folderPath}/${generateRandomFileName(src)}`;
				await wget(src, imagePath);
				img.setAttribute('src', basename(imagePath));
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
			const imagePath = `${folderPath}/${basename(url)}`;
			await wget(url, imagePath);
			post.body = post.body.replace(match[0], `![${alt}](${basename(url)})`);
			console.log(`Fetched image: ${url}`);
		} catch (error) {
			logError(`Failed to download Markdown image ${url}: ${error.message}`);
		}
	}

	// Handle the cover image
	if (post.heroImage?.data && post.heroImage.name) {
		try {
			const heroImageName = generateRandomFileName(post.heroImage.name);
			writeFileSync(`${folderPath}/${heroImageName}`, Buffer.from(post.heroImage.data, 'base64'));
			post.heroImage.url = heroImageName;
		} catch (error) {
			logError(`Failed to save cover image: ${error.message}`);
		}
	} else if (post.heroImage?.url) {
		try {
			const imagePath = `${folderPath}/${basename(post.heroImage.url)}`;
			await wget(post.heroImage.url, imagePath);
			post.heroImage.url = basename(post.heroImage.url);
		} catch (error) {
			logError(`Failed to download cover image: ${error.message}`);
		}
	}

	// Write the post to disk
	writeFileSync(filePath, createPostTemplate(post));
}

// Main function to build the blog
async function buildBlog() {
	try {
		const { newPosts, draftPosts } = await fetchPosts();

		// Process new and updated posts
		for (const post of newPosts) {
			await writePost(post);
		}

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