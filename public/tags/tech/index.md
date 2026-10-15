# Tech




## [Why Aamu.app Uses a Central Server and ShareDB/OT Instead of CRDTs](https://aamu.app/blog/posts/why-aamuapp-uses-a-central-server-and-sharedb-ot-instead-of-crdt/index.md)

Aamu uses ShareDB and Operational Transformation (OT) for collaborative editing, with the server validating and ordering accepted changes.
CRDTs let replicas merge concurrent changes and are useful for local-first and offline collaboration. They can also be deployed with a central server.
Clients edit optimistically. ShareDB transforms concurrent operations, and the server stores and broadcasts the accepted state.
Documents live next to tasks, email, helpdesk, meetings, databases, forms, files, comments, permissions, automations, search, AI features, and team-level workflows. In that kind of product, the hardest problem is not only merging text edits. The harder problem is keeping the whole workspace consistent.



