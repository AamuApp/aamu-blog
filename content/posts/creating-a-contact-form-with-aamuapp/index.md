---
author: "Ilkka Huotari"
title: "Creating a contact form with Aamu.app"
date: "2025-05-13T18:10:00.000Z"
modified: "2025-05-19T07:56:56.668Z"
description: "Using the Aamu.app database for contact forms"
cover:
  image: 1438573936369174_image.png
tags: ["database", "forms"]
ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p>There are (at least) three ways to create a contact form with Aamu.app. Let’s look at the first one in detail.</p><h2>Ingredients</h2><p>The ingredients for this contact form are:</p><ul><li><p>HTML code for the form itself, which you can grab from <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/AamuApp/contact-form">https://github.com/AamuApp/contact-form</a></p></li><li><p>Aamu.app database, with <em>forms</em> enabled</p></li></ul><p>What you would do at your website is that you would add the HTML code, with CSS, to the appropriate location of your site, and tie the form to Aamu.app database with the Aamu.app database’s <code>endpoint url</code> and the Aamu.app database’s API key. Let’s see how to do all this.</p><h2>Creating the Aamu.app database</h2><p>We have a ready-made template of the database that you can use for storing the contact form’s data — it’s under the “arrow button” just next to the “plus button” that you would normally create an empty database with. So click the arrow button and select the <em>Contact Form</em>:</p><img src="3050608520091626_image.png" style="width: auto;" id="a1028694-4284-4322-84e0-802f6a75db14"><h2>Setting up the database to accept form submissions</h2><p>In the database settings, you should first enable the forms API:</p><img src="5304015007419345_image.png" style="width: auto;" id="48f331e6-d9b4-4ca2-a8a2-6537091c43b4"><p>You should select the table, where the form submissions will go to:</p><img src="4826963777914763_image.png" style="width: auto;" id="a02c541b-d181-41b2-a9fe-b3b29e3ef4aa"><p>Then copy the <strong><em>Forms endpoint</em></strong>, and put it into the contact form’s HTML code, into <code>&lt;form action=”ENDPOINT HERE”&gt;</code>.</p><img src="3041253916504638_image.png" style="width: auto;" id="e39ceeea-314e-4aa1-af82-146979e38e84"><h2>Creating the Form</h2><p>To create the form, let’s start by grabbing the example HTML code from GitHub. The important part of it is the <code>&lt;form&gt;...&lt;/form&gt;</code>:</p><pre><code class="language-html">&lt;form id="contactForm" action="ENDPOINT_HERE" method="POST" enctype="multipart/form-data" &gt;
	&lt;div&gt;
		&lt;input placeholder="Name" type="text" name="name" id="form_name" required autofocus&gt;
	&lt;/div&gt;
	&lt;div&gt;
		&lt;input placeholder="Email" type="text" name="email" id="form_email" required&gt;
	&lt;/div&gt;
	&lt;div&gt;
		&lt;textarea placeholder="Message" name="message" id="form_message" required&gt;&lt;/textarea&gt;
	&lt;/div&gt;
	&lt;button id="submit" type="submit"&gt;Send&lt;/button&gt;
&lt;/form&gt;</code></pre><p>The way this form works, is first by the <code>action="ENDPOINT_HERE"</code> which sends the form the API endpoint. </p><h3>Form input field bindings</h3><p>Another important point is how the form input fields’ names are matched to the database fields. The way the input field names are created is pretty straightforward — they are basically lowercase words with spaces turned into underscores. The correct input field names can also be seen in the <strong><em>Database settings / Forms</em></strong>. You can copy the <code>&lt;form&gt;</code>‘s HTML code there and use it in your applications.</p><p>The form which you can get from <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/AamuApp/contact-form" id="0ec9cb15-f76c-45a5-982b-b3d57ca1801b">GitHub</a> has some other niceties — for example it is submitted by JavaScript on the fly, without causing a round-trip at the server (Aamu.app’s server).</p><p>For example, in our contact form database, there are three fields: <code>Name</code>, <code>Email</code>, <code>Message</code>. These correspond to form input fields <code>name</code>, <code>email</code>, <code>message</code>. </p><h3>That’s about it!</h3><p>Now, if you have the form in place, point your browser to it, and test if. All the form submissions should end up in the database.</p><img src="1306516040216159_image.png" style="width: auto;" id="e7fc64c7-5a3c-4780-a575-776e32216a5c"><p></p><p></p>