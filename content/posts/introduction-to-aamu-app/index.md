
---
author: "Ilkka Huotari"
title: "Introduction to Aamu.app"
date: "2021-10-10T09:00:00.000Z"
updated: "2024-02-04T07:27:34.497Z"
description: "Aamu.app is an all-in-one productivity tool"
cover:
  image: 1632799991875.jpg
tags: []
ShowToc: false
ShowBreadCrumbs: false
---

Aamu.app is an all-in-one productivity tool, or at least the idea is to become one. 

Let’s go through the features that are currently ready and then see what’s should be coming next.

But first, let me say who is behind all this and why you should trust this tool.

I’m Ilkka, a software developer/entrepreneur from Finland. My time is spent in coding, being in nature, and being a dad, all of which I greatly enjoy. I have another business. [Embed.rocks](https://embed.rocks/), which is an API service (like Embedly) and I have been running it for a few years now. Building Aamu.app has been my main interest for a few years now and it’s going to stay that way – there is no reason to let this go.

Why you should trust this tool?
-------------------------------

Trust is an important issue in a tool like this. That trust will be built in time, and at the moment I can only give assurances. There are several reasons why you should trust this.

First, as a software developer, I’m quite experienced, having been working in several companies in Finland and after those, on my own. That’s multiple decades.

From the technical standpoint,I have tried to distance myself from the user’s data. That means that everything important is encrypted, server-side. with the user’s secret key, something that I don’t know. It means that I cannot access that data. Meta-data, like timestamps and such, is not encrypted in a similar fashion, but mostly everything that the users are inputting by themselves, is. Some exceptions exist, which will be talked about later.

This server-side encryption also means, that if you, the user, lose your password, you cannot access your data after that. So you should really keep good care of your password, i.e. save it in a safe place! **There is no “forgot password” feature at all**!

The third reason why you should trust this tool is that there are really no costs of running this. The server hosting fees are small and easily covered by my other business. Besides the hosting fees there are no other costs, because I am the only employee and I don’t take any salary (at the moment). So, this will stay online as long as I am alive (and probably after that as well) – there is no reason to shut this down. There is a possibility that something happens to me, and then this service could go down. But I will hire someone to help me with this as soon as I can, so even this will not be an issue in the future.

So, what is Aamu.app anyway?
----------------------------

It’s a business/productivity tool. But you knew that already. So, let’s get a little deeper.

The plan is to have everything, that a company might need for its most important, daily productivity/office tasks, in a single package. Along that there should be collaboration integrated throughout that package. The user interface should be unified throughout. And of course everything should be easy to use.

That’s the plan and this is the start. Let’s see what we have so far.

Features
--------

So, even though there are quite a lot of features, the combination shouldn’t feel overwhelming. Please tell us how we have succeeded.

### Posts / chat / comments

![](1634352671167.jpg)

Team communication can happen in three different places. Commenting is everywhere: every _main level feature item_ has a commenting possibility. A main level feature item means: a document, a task, a meeting, a database, a helpdesk ticket and so on.

![](1634350023986.jpg)

Then there is the chat, which is a bit like Slack. It may be good for casual chatting.

And finally there are posts, which are meant for more important discussion, with a specific topic.

When the discussion is separated this way, everything important should be easier to find. Use _posts_ if you want the topic to gain attention, use _chat_ for casual chatting and use _comments_ for talking about a specific item.

### Tasks

![](1634354051349.jpg)

Tasks are sort of an important feature. Just about every company needs tasks – after all, the companies are doing stuff all the time. So, use the tasks as a _todo list_, _issue tracker_, _calendar items_, etc.

![](1634490582334.jpg)

Tasks can be viewed in many ways: as a _list_, as a _kanban board_, as a _timeline_ and as a _calendar_. Use whatever suits you the best!

The data (text) in tasks is encrypted. You can choose to make the titles as plain text, which will make notifications (email/mobile) a bit more useful.

### Helpdesk

![](1634355722110.jpg)

Helpdesk is also important and almost every company needs one. With helpdesk, you can handle customer support through what is called _tickets_. These tickets are currently created by email or by live chat (real time chat on your marketing website). In the future we may expand to handling customer support through social networks, but currently it’s just email and live chat,

By the way, at this point you may have noticed, that every main level feature looks and feels pretty much the same. This familiarity is important for the unified experience through our service.

To connect the helpdesk to an email account, you will need an IMAP connectivity, at the moment, We will improve this later so that IMAP isn’t needed.

The data (text) in tickets is encrypted – with the exception of titles. The titles are needed for creating email threads and titles are not encrypted.

### Documents

![](1634356972107.jpg)

Documents are like Google™ Docs, they may or may not be important for you. With this you can create all sorts of documents or ebooks (pdf). You can publish them for the world to see or you can keep them for your own use. In case it’s for your own use, everything is encrypted, but if it’s published, then it’s not encrypted – so you decide how secure you want them to be,

The data in the documents is totally secure – it’s encrypted with your team’s key. If you share the document with the world, then it is made plain text and unencrypted.

### Database

![](1634357213187.jpg)

Databases can be used for a lot of things and they can be easily connected to outside world. For example, I am using the database feature as a _headless CMS_ for this very blog. I am currently writing this blog post in the database – you can see that in the picture above. You can also get the JavaScript sources for this blog [on GitHub](https://github.com/AamuApp/aamu-blog).

Databases can be used for blogs, contact forms, single page apps, e-commerce sites, CRMs (customer relations management) and so on. There is a GraphQL and forms API to connect your sites to the database. And of course we have a lot of templates to start with.

Also the data in the databases is encrypted, unless you choose them to not be. If you create an API key, then the data will become unencrypted – so you may use the GrahphQL feature, or API key, in only the databases where data security isn’t the top priority. At least for now.

### Video Meetings

![](1634358493576.jpg)

Meetings,mean online, or video meetings, as is quite usual today. We are using [Jitsi](https://jitsi.org/) for this, which is well tested and secure video conferencing software, also open source.

You can invite participants to the meetings who are not users in Aamu.app , i.e. they are outside guests.

Note: meeting names are not encrypted for technical reason (the notification system needs to “see” the names).

### Database + Meetings (Event Reservations)

![](1634398223576.jpg)

You can combine Database and the Meetings. What this means is that you can create a database with the template _Event Reservations_ and then, in the database settings, set the type of the event to _Video Meetings_. In this way, people outside (or inside, for that matter) your team can make video conferencing meeting reservations with you or your team. The reservations will be placed into the database and members will be notified.

![](https://aamu.app/home/image-event-calendar.png)

You can think this to be similar to Calendly™.

### Designs

![](1634361977726.jpg)

With _design_ you can create vector graphics (SVG) images. With this it should be pretty easy to make plans what your product should look like.

Security
--------

As you may have noticed, we have talked a bit on encryption. What this means in practice, is that all the important data (things you upload, data in tasks, databases, helpdesk etc.) is encrypted with your team’s key and only your team can access that data. The encryption happens on the server, so this isn’t end-to-end encryption. But this is still a lot more secure than _not encrypting_ the data, as then a hacker might get access to it.

_Don’t lose your password, though!_ As the data can be accessed only with your key (your password), only you and your team can access it. We don’t have access to your unencrypted data!

Pricing
-------

Some of you may wonder what’s with the price, which is $5/user/month, with the free option there as well. That seems kind of low, right? Yes, it kind of does.

I have always, personally, looked for “good deals”, i.e. bought things as used and generally gone for things that offer good value for the price. This is prices similarly. I like if everybody can afford this and if this offers a good value. I understand that the price can “send a signal” but I have chosen not to worry about it. I believe (or hope) that people will notice the value of this service – in time.

How about that name?
--------------------

Aamu means “morning” in Finnish. I think it’s also quite a beautiful name, aesthetically. And it comes early in the alphabetics. It’s simple and distinctive. And most people start working in the morning :-).

That’s it!
----------

So, that’s it so far. There are perhaps some features missing that you might expect. For example email – currently you can use the _helpdesk_ for basic email activity, but we will create a more complete email experience later (or, next, actually).

[Try it out](https://aamu.app) and leave us feedback by clicking the email icon on the bottom of the screen. We would really appreciate the feedback. 

Thanks!
