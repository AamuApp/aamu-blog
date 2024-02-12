const ENDPOINT = 'https://api.aamu.app/api/v1/graphql/'
import { GraphQLClient, gql } from 'graphql-request'
import { existsSync, mkdirSync, openSync, readFileSync, writeFileSync } from 'fs'
import { DateTime } from 'luxon'
import { wget } from 'node-wget-fetch';
import { basename } from 'path';
// store the latest timestamp into a file so that when we update the posts, we will
// use this to get only the newer posts
let latestUpdatedPost = getLatestTimestamp();

function getLatestTimestamp() {
	try {
		const data = readFileSync('timestamp').toString();
		return parseInt(data, 10);
	} catch (err) {
		return 0;
	}
}

function storeLatestTimestamp() {
	writeFileSync('timestamp', latestUpdatedPost.toString());
}

const error = (str) => {
	const FgRed = "\x1b[31m";
	const Reset = "\x1b[0m"
	console.error(FgRed + str + Reset);
}

const template = (post) => `
---
author: "${post.author.name}"
title: "${post.title}"
date: "${post.publishDate}"
updated: "${post.updated}"
description: "${post.description}"
cover:
  image: ${post.heroImage?.url || ''}
tags: [${(post.tags || []).map(el => JSON.stringify(el))}]
ShowToc: false
ShowBreadCrumbs: false
---

${post.body}
`;

const graphQLClient = new GraphQLClient(ENDPOINT, {
	headers: {
		'x-api-key': process.env.API_KEY,
	},
})

const query = gql`
{
	BlogPostCollection(
		filter: {
			updated: { GT: "${DateTime.fromMillis(latestUpdatedPost).toString()}" }
		}
	) {
		id
		created
		updated
		title
		slug
		description
		body
		publishDate
		heroImage {
			url
		}
		author {
			name
		}
		status
		tags
	}
}
`;

console.log('Fetching posts after', DateTime.fromMillis(latestUpdatedPost).toString())
const data = await graphQLClient.request(query);
console.log('Fetched: ', data?.BlogPostCollection.length);

const postUpdatedDate = (fileName) => {
	const fd = existsSync(fileName) && openSync(fileName, 'r');

	if (fd) {
		const content = readFileSync(fd).toString();
		let match = content?.match(/^updated: "([^"]+)"$/m);

		if (!match) {
			match = content?.match(/^date: "([^"]+)"$/m);
		}

		if (match) {
			return DateTime.fromISO(match[1]);
		}
	}
}

const writePost = async (post) => {
	const postUpdated = DateTime.fromISO(post.updated || post.created);
	const folderName = `content/posts/${post.slug}`;
	const fileName = `content/posts/${post.slug}/index.md`;

	if (latestUpdatedPost < postUpdated.valueOf()) {
		latestUpdatedPost = postUpdated.valueOf();
	}

	// Create the folder for the page bundle
	if (!existsSync(folderName)) {
		mkdirSync(folderName);
	}

	// Download all the images (in markdown's content) for the page
	// Replace original image links with local links
	for (const m of post.body.matchAll(/\!\[([^\]]*)\]\((\S+)\)/g)) {
		if (m[2]) {
			console.log(m[2]);
			try {
				await wget(m[2], folderName + '/');
				post.body = post.body.replace(m[0], `![${m[1]}](${basename(m[2])})`)
			} catch (err) {
				error(err.toString());
			}
			}
	}

	// Download the cover image
	// Replace original image link with local link
	if (post.heroImage?.url) {
		try {
			await wget(post.heroImage.url, folderName + '/');
			post.heroImage.url = basename(post.heroImage.url);
		} catch (err) {
			error(err.toString());
		}
	}

	writeFileSync(fileName, template(post));
}

for (const post of data?.BlogPostCollection) {
	writePost(post);
}

storeLatestTimestamp();
