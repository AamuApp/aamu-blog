---
author: "Ilkka Huotari"
title: "Database automations with Aamu.app"
date: "2025-06-02T14:00:00.000Z"
modified: "2025-06-02T15:38:23.706Z"
description: ""
cover:
  image: 1947573647348897_form-automations.jpg
tags: ["database", "automations", "forms"]
ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p>Earlier we created the contact form. Let’s spice it up a little bit — let’s create an automation for it! </p><p>Since we might want to get an email notification when someone sends us a message through the contact form, let’s do that. Let’s create an automation that sends an email to us.</p><p>We start by going into the contact form database and in the 3 dots menu you will see “Automations”.</p><img src="3760114788586983_image.png" style="width: auto;" id="af5aed3b-5e86-435a-a07f-d8a0aac7c0dd"><p>And you will see an empty page of Automations. Let’s create one:</p><img src="1798151603756426_image.png" style="width: auto;" id="e07afaab-6184-4f59-9447-42a1daf1fa85"><p>Next you will see a few things, which I will explain here:</p><img src="5175851335703123_image.png" style="width: auto;" id="00977def-cb73-4142-a35b-7692167fa8ff"><ol><li><p>The Automation will be triggered by some event. At the moment, only <code>Row inserted</code> is supported.</p></li><li><p>Triggering table. We need to specify, which table triggers the Automation.</p></li><li><p>Bindings. When the row is inserted, it has some data, and the different fields are named by some human-readable name which tells what the data is about. Here are those names turned into lowercase character strings, wrapped in <code>{{}}</code>. You can use these bindings in the email that you send out. For example, the <code>{{name}}</code> means the name that the person gave and <code>{{email}}</code> is his/her email address.</p></li><li><p>Publishing. When you are ready to take this Automation into use, set this to Public.</p></li><li><p>Add action. Your automation needs actions — at least one. Add it here.</p></li></ol><h2>Actions</h2><p>Your automation needs actions. Currently, two types of actions are supported: </p><ol><li><p>Sending an email</p></li><li><p>Creating a task</p></li></ol><img src="2444542144020265_image.png" style="width: auto;" id="a4165404-d25c-4644-a22f-3c6ce650af52"><p>And email needs a sender. And we can only use a sender that we have specified by ourselves. So, in case you haven’t set up Emails yet, now would be a good time to do that.</p><p>Here are the email accounts that I have set up, and I can choose from one of them:</p><img src="9081027891621226_image.png" style="width: auto;" id="3566e9a6-7acd-47e6-a39f-8fe7376ccab0"><p>Next we get to the main point — writing the email template that will be used for sending.</p><img src="9887303318553546_image.png" style="width: auto;" id="7d779717-651d-4a53-9aa4-397877c13371"><p>Here is the screen for writing email templates:</p><img src="7721800584288292_image.png" style="width: auto;" id="a408b2c6-85ac-48ec-8156-10bd5a581947"><p>The <em>Bindings</em> are explained there again — how they work. You can use them in the body section of the email. And the actual bindings you saw in previous section.</p><p>The <em>To</em> field would be the email where you want the email to arrive at. The <em>From</em> field was set earlier.</p><p>You can write a template like this, for example:</p><p>Subject: Contact form submission<br>To: youraddress@gmail.com<br>Body:</p><pre><code class="language-html">Hi me!

Someone just filled our contact form with this information:

Name: {{name}}
Email: {{email}}
Message: {{message}}</code></pre><p>Click <em>Save template</em>.</p><p>At this point just change the <em>Publishing</em> to <em>Public</em>. When you do that, you can test the Automation:</p><img src="7673118099890983_image.png" style="width: auto;" id="4542b29a-3582-4230-9c29-feebc4d12cb1"><p>Then just start waiting for the emails to pour in!</p><p></p>