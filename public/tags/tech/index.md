# Tech




## [Why Aamu.app Uses a Central Server and ShareDB/OT Instead of CRDTs](https://aamu.app/blog/posts/why-aamuapp-uses-a-central-server-and-sharedb-ot-instead-of-crdt/index.md)

Collaborative editing is one of those technical choices that looks simple from the outside and becomes very nuanced once you build a real product around it. Distributed systems have a remarkable talent for turning “just keep two copies in sync” into a career.
A common question is: why not use CRDTs?
CRDTs are a powerful approach to collaboration. They are especially attractive for local-first software, offline editing, peer-to-peer synchronization, and systems where multiple replicas need to merge changes automatically without a single central authority deciding the final order of operations.



