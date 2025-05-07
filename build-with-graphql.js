const ENDPOINT = 'https://api.aamu.app/api/v1/graphql/'

import { existsSync, mkdirSync, rmdirSync, readFileSync, writeFileSync } from 'fs'
import { DateTime } from 'luxon'
import { wget } from 'node-wget-fetch';
import { basename } from 'path';
import { parse } from 'node-html-parser';
import 'dotenv/config';

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
modified: "${post.updated_at}"
description: "${post.description}"
cover:
  image: ${post.heroImage?.url || ''}
tags: [${(post.tags || []).map(el => JSON.stringify(el))}]
ShowToc: false
ShowBreadCrumbs: false
---

${post.body}
`;

const queryNewPosts = {
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
					url,
					data,
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
		updated_at: DateTime.fromMillis(latestUpdatedPost).toString()
	}
};

const queryDraftPosts = {
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
		`
};

const request = async (query) => {

	try {
		const body = JSON.stringify(query);

		const response = await fetch(ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				'x-api-key': process.env.API_KEY,
			},
			body,
		});

		return await response.json();
	} catch (err) {
		console.log(err)
	}
}

const fetchPosts = async (post) => {
	try {
		console.log('Fetching posts updated/created after', DateTime.fromMillis(latestUpdatedPost).toString())

		const dataNewPosts = await request(queryNewPosts);
		const dataDraftPosts = await request(queryDraftPosts);
		// console.log(inspect(dataDraftPosts, { depth: 9, colors: true }));
		console.log('Fetched', dataNewPosts?.data?.BlogPostCollection.length, 'new/updated posts.');
		console.log('Fetched', dataDraftPosts?.data?.BlogPostCollection.length, 'draft posts.');

		return { dataNewPosts, dataDraftPosts };
	} catch (err) {
		console.log(err);
		throw err;
	}
}

const deletePost = async (post) => {
	const folderName = `content/posts/${post.slug}`;

	if (existsSync(folderName)) {
		rmdirSync(folderName, { recursive: true });
	}
}

const writePost = async (post) => {
	const postUpdated = DateTime.fromISO(post.updated_at || post.created_at);
	const folderName = `content/posts/${post.slug}`;
	const fileName = `content/posts/${post.slug}/index.md`;
	console.log('');
	console.log('Write post:', post.title);

	if (latestUpdatedPost < postUpdated.valueOf()) {
		latestUpdatedPost = postUpdated.valueOf();
	}

	// Create the folder for the page bundle
	if (!existsSync(folderName)) {
		mkdirSync(folderName);
	}

	const root = parse(post.body);
	const imgs = root.querySelectorAll('img');

	if (imgs.length) {
		for (const img of imgs) {
			const src = img.getAttribute('src');

			if (src) {
				try {
					const name = folderName + '/' + Date.now() + basename(src);
					await wget(src, name);
					img.setAttribute('src', basename(name))
				} catch (err) {
					console.log(err.toString())
				}
			}
		}

		post.body = root.toString();
	}

	// Download all the images (in markdown's content) for the page
	// Replace original image links with local links
	for (const m of post.body.matchAll(/\!\[([^\]]*)\]\((\S+)\)/g)) {
		if (m[2]) {
			console.log('Fetched image', m[2]);
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
	if (post.heroImage?.data && post.heroImage.name) {
		try {
			writeFileSync(folderName + '/' + post.heroImage.name, Buffer.from(post.heroImage.data, 'base64'));
			post.heroImage.url = post.heroImage.name;
		} catch (err) {
			error(err.toString());
		}
	} else if (post.heroImage?.url) {
		try {
			await wget(post.heroImage.url, folderName + '/');
			post.heroImage.url = basename(post.heroImage.url);
		} catch (err) {
			error(err.toString());
		}
	}

	writeFileSync(fileName, template(post));
}

const build = async () => {
	try {
		const { dataNewPosts, dataDraftPosts } = await fetchPosts();

		for (const post of dataNewPosts?.data?.BlogPostCollection) {
			await writePost(post);
		}

		for (const post of dataDraftPosts?.data?.BlogPostCollection) {
			await deletePost(post);
		}
	} catch (err) {

	}
}

await build();

storeLatestTimestamp();
