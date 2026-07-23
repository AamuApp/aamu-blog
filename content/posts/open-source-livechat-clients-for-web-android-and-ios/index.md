---
author: "Ilkka Huotari"
title: "Open-source Livechat clients for web, Android, and iOS"
date: "2026-07-11T09:30:00.000Z"
modified: "2026-07-23T11:13:22.346Z"
description: "Introducing open-source Aamu Livechat clients for the web, Android, and iOS, including a ready-made web client and headless native APIs for Chat, Email, sessions, reconnects, and events."
cover:
  image: 2edd4f7a78a38f1e_livechat.png
  relative: true

tags: ["livechat", "web", "android", "ios", "open-source", "sdk", "mobile"]

ShowToc: false
ShowBreadCrumbs: false
markup: html
---

<p>We now provide open-source Aamu Livechat clients for the web, Android, and iOS. <a target="_blank" rel="noopener noreferrer" href="https://github.com/AamuApp/aamu-livechat-web">Aamu Livechat for the web</a> is a ready-made web client that can be embedded in a website.</p>

<p>A web chat widget can bring customer conversations into a website with one embedded component. Mobile applications need a different integration boundary. Their navigation, visual language, accessibility behavior, lifecycle, and state management already belong to the native application.</p><p>That is why we have created two open-source, headless Aamu Livechat client libraries: one for Android and one for iOS. They handle the Livechat protocol and leave the interface to the application that embeds them.</p><p>The source is available now:</p><ul><li><p><a target="_blank" rel="noopener noreferrer" href="https://github.com/ile/aamu-livechat-android">Aamu Livechat for Android</a></p></li><li><p><a target="_blank" rel="noopener noreferrer" href="https://github.com/AamuApp/aamu-livechat-ios">Aamu Livechat for iOS</a></p></li></ul><h2>Headless means the application owns the experience</h2><p>Neither library contains a chat window, message list, email form, buttons, colors, animations, or other ready-made UI. Instead, the library publishes connection state and typed events. The host application decides how those values should appear.</p><p>This makes the clients useful in applications that already have their own design system. A banking app, an internal operations tool, and a consumer mobile product may all want Livechat, but they should not be forced into the same navigation pattern or visual component.</p><p>The application can build the experience with Jetpack Compose, Android Views, SwiftUI, UIKit, or its existing presentation architecture. It can show Livechat as a full-screen support view, a sheet, part of an account page, or a flow connected to an existing Help section.</p><h2>What the libraries handle</h2><p>The Android and iOS clients implement the same Livechat protocol responsibilities:</p><ul><li><p>opening and closing the secure WebSocket connection,</p></li><li><p>serializing outgoing commands and parsing incoming JSON messages,</p></li><li><p>persisting the user and chat session identifiers,</p></li><li><p>sending heartbeats and detecting stale connections,</p></li><li><p>reconnecting after a connection closes,</p></li><li><p>starting, continuing, and ending a chat,</p></li><li><p>publishing agent availability and queue information,</p></li><li><p>handling AI availability and thinking events,</p></li><li><p>restoring message history and correlating message acknowledgements,</p></li><li><p>sending Email fallback messages,</p></li><li><p>sending post-chat feedback, and</p></li><li><p>requesting signed URLs for attachments.</p></li></ul><p>The application remains responsible for user input, rendering, accessibility, file selection, and deciding when the client should connect or disconnect.</p><h2>One protocol, two native APIs</h2><p>The two libraries share a platform-independent protocol contract, but each exposes the result in a way that feels natural on its platform.</p><p><strong>Android</strong> is implemented in Kotlin. Livechat state is exposed as a <code>StateFlow</code>, while messages and other one-time events are exposed through a <code>SharedFlow</code>. Session identifiers can be stored with the included <code>SharedPreferencesSessionStore</code>. The library supports Android API level 23 and newer and is structured as an Android library that can be published as an AAR/Maven artifact.</p><pre><code class="language-kotlin">val client = LivechatClient(
    config = LivechatConfig(host = "your-tenant", pid = "your-widget"),
    sessionStore = SharedPreferencesSessionStore(context)
)

lifecycleScope.launch {
    client.events.collect { event -&gt;
        // Update your application's own state and UI.
    }
}

client.connect()
client.startChat("Hello")</code></pre><p><strong>iOS</strong> is a Swift Package. It publishes typed events through an event handler and stores session identifiers through the included <code>UserDefaultsSessionStore</code>. It supports iOS 13 and newer and can be integrated as a local package today or through a Git repository dependency.</p><pre><code class="language-swift">let configuration = try LivechatConfiguration(
    host: "your-tenant",
    pid: "your-widget"
)

let client = LivechatClient(
    configuration: configuration,
    sessionStore: UserDefaultsSessionStore()
)

client.onEvent = { event in
    // Update your application's own state and UI.
}

client.connect()
try client.startChat(message: "Hello")</code></pre><h2>Chat and Email use the same session context</h2><p>Livechat can report that chat is available, that only a human agent is unavailable, or that the connection cannot currently reach the chat service. The host application can use that state to offer the right contact path.</p><p>When the WebSocket is available, an Email message can travel through the normal protocol. When it is not, both libraries can use the HTTPS Email fallback endpoint. The SDK reports sending, success, and failure state while the application decides how to ask for a name, email address, and message.</p><h2>Mobile lifecycle is explicit</h2><p>A mobile application should not assume that a foreground WebSocket will remain active indefinitely in the background. The intended integration is explicit: connect when the owning application flow becomes active, disconnect when it leaves the foreground, and reconnect when it returns.</p><p>The current protocol does not include APNs or Firebase Cloud Messaging push delivery. Background chat notifications would need a separate server-side push contract. Keeping that boundary clear prevents the SDK from promising background behavior the operating system cannot guarantee through a normal WebSocket.</p><h2>A deliberately small attachment boundary</h2><p>The libraries can request a signed upload URL, but they do not open a system file picker or provide an upload interface. The application selects the file and decides how progress should be displayed.</p><p>Protocol version 1.0 does not include a correlation identifier in the signed URL response, so the clients permit only one pending signed URL request. This limitation is documented rather than hidden. A future protocol version can add a request identifier and safely allow concurrent requests.</p><h2>Why open source</h2><p>A customer communication SDK sits inside another team's application. Integrators should be able to inspect how it connects, what it stores, what it sends, how it responds to errors, and what happens when the network disappears.</p><p>Both repositories use the Apache License 2.0. The license permits commercial and private use, modification, and distribution, and includes an explicit patent grant. Each repository also includes tests, development instructions, and continuous integration configuration.</p><h2>The current release stage</h2><p>These are initial source releases. The Android project already has Maven publication metadata, but it is not yet published to a public Maven repository. The iOS project can be consumed directly as a Swift Package from its Git repository. The APIs may still evolve as the clients are tested in real mobile applications.</p><p>Keeping the clients in separate repositories makes that evolution visible. Android and iOS issues, releases, examples, and package metadata can follow their own platform conventions while the wire protocol remains shared.</p><h2>The bottom line</h2><p>Aamu Livechat no longer has to be presented only through a web widget. The new Android and iOS libraries provide the protocol layer needed to build a native support experience without importing someone else's user interface.</p><p>The SDK owns the connection. The application owns the experience. Chat and Email stay compatible with Aamu Livechat, while each mobile product remains free to feel like itself.</p>
