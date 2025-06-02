---
author: "Ilkka Huotari"
title: "Introduction to Aamu.app GraphQL"
date: "2021-10-19T03:07:00.000Z"
modified: "2025-06-02T15:39:17.723Z"
description: "How to use the database from a distance"
cover:
  image: 657291260009484_GraphQL Logo + Wordmark (Rhodamine).png
tags: ["tasks", "graphql", "database"]
ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p>Aamu.app database supports two APIs: one for submitting data into the database via standard HTML forms – this works just one direction. Also you can get and put data into the database via GraphQL.</p><p>As Wikipedia says it:</p><blockquote><p>GraphQL is an open-source data query and manipulation language.</p></blockquote><p>It has a syntax for reading and writing the database. For testing it out, it is helpful to have a tool. I like Altair.<br>To use Altair or any similar tool you first need to setup it with the database endpoint and the database API key. The database endpoint is:</p><pre><code>https://api.aamu.app/api/v1/graphql/</code></pre><p>You can get the API key from your <em>database settings.</em></p><h2>Querying the database</h2><p>Let's assume we are using the database <strong>aamu-blog</strong>, which is the actual database which holds the blog posts you are reading now! The database looks like this in Aamu.app (at this moment in time there are only two rows, i.e. posts):<br></p><img src="608109015337015_1709968790929.jpg" class="ql-image" style="width: auto;"><p><br>It has two tables: "Blog post" and "Person". Our GraphQL API will have these fields for this database (you can use for example Altair GraphQL client to see the database schema):<br></p><img src="5863444519954815_1709968866417.jpg" class="ql-image" style="width: auto;"><p><br>So, the GraphQL API will create two fields for each table, one for fetching a single item (by an <strong>ID</strong>), e.g. <strong>BlogPost</strong> and one (<strong>BlogPostCollection</strong>) for fetching many items (by some criteria you define).</p><p>Let's see how to get a single item. This is the query:</p><pre><code class="language-graphql">query {
  BlogPost (slug: "introduction-to-aamuapp-graphql") {
    id
    created_at
    updated_at
    title
    slug
    description
    body
    status
  } 
}</code></pre><p>When you do the query, you will get the data back (if it exists) as json:</p><pre><code class="language-graphql">{
  "data": {
    "BlogPost": {
      "id": "3cfa30f8-ab29-459a-ad91-0651ae0b08ad",
      "created_at": "2021-10-19T19:11:49.257Z",
      "updated_at": "2024-03-09T07:38:23.916Z",
      "title": "Introduction to Aamu.app GraphQL",
      "slug": "introduction-to-aamuapp-graphql",
      "description": "How to use the database from a distance",
      "body": "Aamu.app database supports two APIs: one for submitting data into the database via standard html forms – this works just one direction. Also you can get and put data into the database via GraphQL."
      ... etc</code></pre><p>You can also get items by querying the field <strong>BlogPostCollection</strong>. This gives you multiple rows. You can also do filtering, sorting and pagination.</p><p>Let's see how getting multiple posts goes. Let's get all the blog posts that are published (status is "published") and the results will be sorted by creation date (older first):</p><pre><code class="language-graphql">query {
    BlogPostCollection(
        filter: { status: { EQ: "published" } }
        sort: { created_at: DESC }
    ) {
        title
        slug
        created_at
        description
    }
}</code></pre><p>This will give the following results:</p><pre><code class="language-graphql">{
  "data": {
    "BlogPostCollection": [
      {
        "title": "Introduction to Aamu.app GraphQL",
        "slug": "introduction-to-aamuapp-graphql",
        "created_at": "2021-10-19T09:00:00.000Z",
        "description": "How to use the database from a distance"
      },
      {
        "title": "Introduction to Aamu.app",
        "slug": "introduction-to-aamu-app",
        "created_at": "2021-10-10T09:00:00.000Z",
        "description": "Aamu.app is an all-in-one productivity tool"
      }
    ]
  }
}</code></pre><p>You can use other filtering methods, for example <strong>GT</strong> (Greater Than):</p><pre><code class="language-graphql">query {
    BlogPostCollection(
        filter: {
            status: { EQ: "published" }
            updated_at: { GT: "2022-01-04T02:15:37.975Z" } 
        }
    ) {
		id
		created_at
		updated_at
		title
		slug
		description
		body
		heroImage {
			url
		}
		author {
			name
		}
		status
		tags
    }
}</code></pre><p>This is the actual query which I'm using to create this blog you are reading. This will fetch all the updated blog posts since I ran this last time (since I built the blog last time). I'm using Hugo to create this blog, and the blog posts are in Aamu's database, and I'm writing this using the Aamu's Documents feature.</p><p>Note that there is a field called <strong>heroImage</strong>, which has a subfield <strong>url</strong>. You can find all the fields with Altair's Docs feature. It will fetch database structure, and you will see all the fields that you can query (or mutate).</p><p>With Altair you can also see what kind of filtering you can do. For example, Altair sees that the <strong>updated</strong> field is a date and will give you the following filtering options:<br></p><img src="3496341407484724_1709979164496.jpg" class="ql-image" style="width: auto;"><p><br>You can get that list by pressing Ctrl-Space. You can also get similar lists in every spot in the query window – all the fields and filtering options will be easy to see.</p><h2>Mutating the database</h2><p>Here we show at how we can mutate database rows.</p><p>At the moment you can mutate single objects, which are targeted with the <code>id</code>.</p><p>Here we update a database row in our <strong>Person</strong> table. We will target the row that we want to change with the <code>id</code> field. In Aamu.app, the <code>id</code> field is a string, and you can find the correct <code>id</code> by first querying the persons, possibly with some criteria. </p><p>Here is an example mutation query. It will change the <strong>title</strong> of the person and return some fields that we want to see about the person.</p><pre><code class="language-graphql">mutation {
    Person(id: "29940627-51e8-4fd0-82ab-d718ddfe802f", title: "Chief Procrastination Officer (CPO)") {
        id
        created_at
        updated_at
        name
        bio
        title
    }
}</code></pre><p><br></p>