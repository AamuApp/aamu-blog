# Blogitekstien toimitus — 15.10.2026

Tämä raportti korvaa aiemman neljän artikkelin muokkausehdotuksen. Kaikki 51 julkaistua BlogPost-riviä ja niiden ajantasaiset Doc-lähteet käytiin läpi. Muutokset tehtiin Docs API:n kautta. Näkyvät FAQ-tekstit päivitettiin tarvittaessa CMS-tietokannan GraphQL API:n kautta.

Hugo tekee sisällysluettelot lopullisiin artikkeleihin. Niitä ei lisätty lähteisiin eikä buildia ajettu.

## Mitä muuttui

- Johdannot kertovat aiheen aiempaa suoremmin. Toistuvia yhteisen työtilan perusteluja, välikommentteja ja loppuyhteenvetoja poistettiin.
- Käytännön vaiheet, esimerkit, rajoitukset ja tuotekuvauksen kannalta olennaiset erot säilytettiin.
- 41 postauksesta poistettiin automaattiset, otsikkoa ja kuvausta toistavat FAQ:t (123 kysymys-vastausparia). Sisällölliset FAQ:t säilytettiin. ClickUp- ja monday-FAQ:n vertailuvastaus korjattiin vastaamaan artikkelia.
- ClickUp-jutun Docissa ollut FAQ poistettiin, koska sama osio lisätään buildissa metatiedoista. Myös kahteen kertaan lisätty Short answer poistettiin Docista.

## Korjatut ristiriidat

- **Tasks:** ominaisuusopas kuvaa tagit, prioriteetin, custom fieldit, todo-listat, metatiedot, kommentit, suhteet, idempotenssin ja If-Match-käytön. Lisätty tehtäväsuhteiden käyttäjäkuvaus.
- **Newsletter/API:** Audience Database syntyy Newsletterin luonnissa ja on yleisön lähde. Signup form liittyy siihen. Lähetys käy review-tokenin kautta ja palauttaa 202/queued; se ei tarkoita koko yleisön toimituksen valmistumista. Aikataulutus ja julkinen arkisto kuvataan erillisinä toimintoina.
- **Database/API:** rivejä voi käsitellä myös RESTillä. Saman taulun viittaukset ja taulujen väliset syklit ovat tuettuja. Automaatioiden toimintoja on enemmän kuin create_task ja send_email.
- **Git/API:** repositorion luonti ja poisto sekä hallinta tarvitsevat Git admin -oikeuden. Oppaan kuvaus laajennettiin nykyisiin koodi-, pull request-, peilaus- ja CI-toimintoihin.
- **Company Brain:** johdannosta poistettiin Git-indeksointiväite. Nykyinen indeksoija ei käsittele Git-repositorioita tai Penpot-tiedostoja.
- **Linear:** nykyisin toteutettuja Aamun triage-toimintoja ei enää esitetä kokonaan puuttuvina kehitysideoina.
- **OT/CRDT:** keskitetty palvelin ja OT/CRDT ovat eri suunnitteluratkaisuja. CRDT voi käyttää keskitettyä valtuutusta. Keskitetty palvelin ei takaa exactly-once-sivuvaikutuksia; jonot, uudelleenyritykset ja deduplikointi tarvitaan erikseen.
- **Kilpailijavertailut:** Notionin ja Slackin haku voi ulottua kytkettyihin lähteisiin. ClickUpissa on sähköpostitoimintoja ja Connected Search. Intercomissa on ylläpidettävä tietopohja. monday-vertailu rajattiin pääosin work managementiin ja CRM/service-tuotteet huomioitiin.
- **Sovellushakemisto:** poistettu kuusi epäselvää tai vanhentunutta merkintää, korjattu n8n:n source-available-kuvaus ja Census/Fivetran. Hakemisto on esimerkkiluettelo, ei kaikkien tuotteiden saatavuuden tai ominaisuuksien ajantasainen takuu.
- **Raportointi:** poistettu tekstiin jäänyt “He there … hello…”.

## Tarkistus

Valmis: 51/51 Doc-päivitystä ja 43/43 FAQ-metatietojen muutosta tallennettu ja varmennettu takaisinluvulla.

Jokaisesta muutoksesta säilytettiin alkuperäinen Doc ja muokkausluonnos. Tallennuksen jälkeen Doc luettiin takaisin ja sisältö verrattiin luonnokseen. Vertailu sallii editorin normaalin tyhjätilan sekä uusille linkeille lisäämät target/rel-attribuutit. Kuvat, videot ja muut upotukset tarkistettiin säilyviksi. Koodilohkot säilyivät; API-oppaan Newsletter-lähetysesimerkki päivitettiin tarkoituksella. Otsikot, slugit, julkaisutiedot ja Doc-viittaukset säilyivät.

Aamun ristiriitaiset tuoteväitteet tarkistettiin tämän työtilan palvelinreiteistä ja toteutuksesta, erityisesti api-newsletters.ts, newsletters.ts, api-databases.ts, api-database-automation-service.ts, api-git.ts, api-openapi.ts ja company-brain.ts. Tämä on toimituksellinen läpikäynti, ei kaikkien API-operaatioiden uusi integraatiotesti tai kaikkien hakemistotuotteiden kattava saatavuuskartoitus.

Varmuuskopiot ja ennen/jälkeen-aineisto: `/home/ile/.local/state/aamu-blog-copyedit/2026-10-15-Vx4L61/`.

## Ulkoiset lähteet

Vertailujen korjaukset perustuvat palvelujen omiin dokumentteihin:

- [Linear Triage](https://linear.app/docs/triage)
- [Notion AI Connectors](https://www.notion.com/help/notion-ai-connectors)
- [Slack enterprise search](https://slack.com/features/enterprise-search)
- [ClickUp Connected Search](https://help.clickup.com/hc/en-us/articles/14642390285463-Connected-Search) ja [email](https://clickup.com/features/email-project-management)
- [Intercom Knowledge](https://www.intercom.com/help/en/articles/9440354-knowledge-sources-to-power-ai-agents-and-self-serve-support)
- [monday CRM](https://monday.com/crm) ja [monday service](https://support.monday.com/hc/en-us/articles/16810835014546-Get-started-with-monday-service)
- [Basecamp features](https://basecamp.com/features)
- [ShareDB](https://github.com/share/sharedb), [Yjsin keskitetty WebSocket-palvelin](https://docs.yjs.dev/ecosystem/connection-provider/y-websocket), [n8n:n lisenssi](https://github.com/n8n-io/n8n/blob/master/LICENSE.md) ja [Census/Fivetran](https://www.fivetran.com/blog/why-fivetran-and-census-are-joining-forces)

## Artikkelikohtainen luettelo

Doc-lähteiden tekstimäärä: noin 70,958 → 55,726 sanaa (−21.5 %). Luku sisältää otsikot ja leipätekstin, ei koodilohkoja eikä buildin lisäämiä metatietoja.

| Artikkeli | Sanat ennen | Sanat jälkeen | FAQ |
|---|---:|---:|---|
| [Creating a blog with Aamu.app](https://aamu.app/blog/posts/creating-a-blog-with-aamuapp/) | 1212 | 1010 | Poistettu yleistäyte |
| [Creating a single-page application with Aamu.app's database and GraphQL API](https://aamu.app/blog/posts/creating-a-single-page-application-with-aamuapps-database-and-graphql-api/) | 867 | 678 | Poistettu yleistäyte |
| [Setting up Helpdesk in Aamu.app - Part 2, livechat](https://aamu.app/blog/posts/setting-up-helpdesk-in-aamuapp-part-2-livechat/) | 1146 | 1052 | Poistettu yleistäyte |
| [Creating a contact form with Aamu.app](https://aamu.app/blog/posts/creating-a-contact-form-with-aamuapp/) | 874 | 737 | Poistettu yleistäyte |
| [Creating survey forms with Aamu.app Form Builder](https://aamu.app/blog/posts/creating-survey-forms-with-aamuapp-form-builder/) | 1035 | 878 | Poistettu yleistäyte |
| [Setting up Emails in Aamu.app](https://aamu.app/blog/posts/setting-up-emails-in-aamuapp/) | 978 | 802 | Poistettu yleistäyte |
| [Database automations with Aamu.app](https://aamu.app/blog/posts/database-automations-with-aamuapp/) | 1409 | 1273 | Poistettu yleistäyte |
| [Aamu.app Tasks - feature overview](https://aamu.app/blog/posts/aamuapp-tasks-feature-overview/) | 1128 | 897 | Poistettu yleistäyte |
| [Video Meetings - feature overview](https://aamu.app/blog/posts/video-meetings-feature-overview/) | 915 | 730 | Poistettu yleistäyte |
| [Setting up Helpdesk in Aamu.app - Part 1, emails](https://aamu.app/blog/posts/setting-up-helpdesk-in-aamuapp-part-1-emails/) | 871 | 716 | Poistettu yleistäyte |
| [Introduction to Aamu.app](https://aamu.app/blog/posts/introduction-to-aamu-app/) | 1468 | 1084 | Poistettu yleistäyte |
| [Aamu.app Helpdesk - feature overview](https://aamu.app/blog/posts/aamuapp-helpdesk-feature-overview/) | 1129 | 984 | Poistettu yleistäyte |
| [Internal Links in Aamu.app](https://aamu.app/blog/posts/internal-links-in-aamuapp/) | 770 | 594 | Poistettu yleistäyte |
| [Keyboard shortcuts in Aamu.app](https://aamu.app/blog/posts/keyboard-shortcuts-in-aamuapp/) | 806 | 699 | Poistettu yleistäyte |
| [144 productivity apps in 2026](https://aamu.app/blog/posts/all-the-productivity-apps-you-could-think-of-100/) | 2289 | 1797 | Poistettu yleistäyte |
| [Penpot Design Tool - feature overview](https://aamu.app/blog/posts/penpot-design-tool-feature-overview/) | 871 | 594 | Poistettu yleistäyte |
| [Aamu.app Emails - feature overview](https://aamu.app/blog/posts/aamuapp-emails-feature-overview/) | 1237 | 1102 | Poistettu yleistäyte |
| [Aamu.app Docs - feature overview](https://aamu.app/blog/posts/aamuapp-docs-feature-overview/) | 1527 | 1211 | Poistettu yleistäyte |
| [Aamu.app as a Calendly alternative](https://aamu.app/blog/posts/aamuapp-as-a-calendly-alternative/) | 946 | 600 | Poistettu yleistäyte |
| [Building with the Aamu API: From Tasks to Docs and GraphQL](https://aamu.app/blog/posts/building-with-the-aamu-api-from-tasks-to-docs-and-graphql/) | 5777 | 5528 | Poistettu yleistäyte |
| [AI customer support with Aamu.app: Helpdesk Knowledge Base, drafts, and human review](https://aamu.app/blog/posts/ai-customer-support-with-aamuapp-team-brain-drafts-and-human-review/) | 3494 | 2345 | Poistettu yleistäyte |
| [Aamu.app as an AI workspace alternative to Notion AI, Slack AI, Jira, and Zendesk](https://aamu.app/blog/posts/aamuapp-as-an-ai-workspace-alternative-to-notion-ai-slack-ai-jira-and-zendesk/) | 1891 | 1272 | Poistettu yleistäyte |
| [How Aamu.app uses the Helpdesk Knowledge Base for grounded support answers](https://aamu.app/blog/posts/how-aamuapp-uses-team-brain-to-answer-from-your-company-knowledge/) | 1750 | 1137 | Poistettu yleistäyte |
| [From Helpdesk ticket to Helpdesk Knowledge Base: AI triage, Docs, and human review in Aamu.app](https://aamu.app/blog/posts/from-helpdesk-ticket-to-team-brain-ai-triage-docs-human-review/) | 1767 | 1151 | Poistettu yleistäyte |
| [Aamu.app vs Linear Triage: customer conversations, Helpdesk Knowledge Base, and human-reviewed AI support](https://aamu.app/blog/posts/aamuapp-vs-linear-triage-customer-conversations-team-brain-human-reviewed-ai-support/) | 2054 | 1433 | Poistettu yleistäyte |
| [Outbound webhooks in Aamu.app: real-time events for tasks, Helpdesk, email, and more](https://aamu.app/blog/posts/outbound-webhooks-in-aamuapp-real-time-events-tasks-helpdesk-email/) | 1308 | 982 | Poistettu yleistäyte |
| [How to build a support knowledge base that AI can actually use](https://aamu.app/blog/posts/how-to-build-a-support-knowledge-base-that-ai-can-actually-use/) | 1887 | 1499 | Poistettu yleistäyte |
| [AI support in Aamu.app](https://aamu.app/blog/posts/ai-support-in-aamuapp/) | 254 | 233 | Poistettu yleistäyte |
| [How to use Aamu.app as a small-team CRM](https://aamu.app/blog/posts/how-to-use-aamuapp-as-a-small-team-crm/) | 1907 | 1273 | Poistettu yleistäyte |
| [AI commands in Aamu.app: turning comments into workspace actions](https://aamu.app/blog/posts/ai-commands-in-aamuapp-turning-comments-into-workspace-actions/) | 2200 | 1677 | Poistettu yleistäyte |
| [Daily backups from Aamu.app to S3-compatible storage](https://aamu.app/blog/posts/daily-backups-from-aamuapp-to-s3-compatible-storage/) | 1235 | 846 | Poistettu yleistäyte |
| [From form submission to follow-up: workflows with Aamu.app](https://aamu.app/blog/posts/from-form-submission-to-follow-up-workflows-with-aamuapp/) | 1359 | 1177 | Poistettu yleistäyte |
| [Git belongs in the workspace: code, issues, comments, and team awareness in Aamu.app](https://aamu.app/blog/posts/git-belongs-in-the-workspace-code-issues-comments-team-awareness-aamuapp/) | 1738 | 1179 | Poistettu yleistäyte |
| [Ask Aamu for product help with AI](https://aamu.app/blog/posts/ask-aamu-for-product-help-with-ai/) | 1131 | 923 | Poistettu yleistäyte |
| [Newsletters in Aamu.app: from subscribers to sending](https://aamu.app/blog/posts/newsletters-in-aamuapp-from-subscribers-to-sending/) | 1645 | 1569 | Poistettu yleistäyte |
| [Why Aamu.app Uses a Central Server and ShareDB/OT Instead of CRDTs](https://aamu.app/blog/posts/why-aamuapp-uses-a-central-server-and-sharedb-ot-instead-of-crdt/) | 1683 | 927 | Poistettu yleistäyte |
| [Company Brain in Aamu.app: AI across your workspace](https://aamu.app/blog/posts/company-brain-in-aamuapp-ai-across-your-workspace/) | 1053 | 917 | Poistettu yleistäyte |
| [Open-source Livechat clients for web, Android, and iOS](https://aamu.app/blog/posts/open-source-livechat-clients-for-web-android-and-ios/) | 1019 | 813 | Poistettu yleistäyte |
| [Aamu.app Databases: a practical feature guide](https://aamu.app/blog/posts/aamuapp-databases-practical-feature-guide/) | 3305 | 3097 | Poistettu yleistäyte |
| [Using third-party APIs through Aamu.app AI](https://aamu.app/blog/posts/using-third-party-apis-through-aamuapp-ai/) | 1323 | 1091 | Poistettu yleistäyte |
| [Aamu.app vs Asana: tasks are better when they remember why they exist](https://aamu.app/blog/posts/aamuapp-vs-asana-tasks-and-shared-context/) | 382 | 225 | Poistettu yleistäyte |
| [Aamu.app vs Intercom: support should not need a passport to reach product](https://aamu.app/blog/posts/aamuapp-vs-intercom-support-and-product-context/) | 374 | 219 | Säilytetty |
| [Aamu.app vs Confluence: documentation that can leave the shelf](https://aamu.app/blog/posts/aamuapp-vs-confluence-documentation-and-work/) | 351 | 186 | Säilytetty |
| [Introducing Aamu Slides: spatial presentations inside your workspace](https://aamu.app/blog/posts/introducing-aamu-slides-spatial-presentations-inside-your-workspace/) | 771 | 573 | Säilytetty |
| [Aamu My Apps: extend your team workspace with custom applications](https://aamu.app/blog/posts/aamu-my-apps-extend-your-team-workspace-with-custom-applications/) | 1358 | 1078 | Säilytetty |
| [Sign documents in Aamu.app with email OTP or strong authentication](https://aamu.app/blog/posts/sign-documents-in-aamuapp-email-otp-strong-authentication/) | 956 | 792 | Säilytetty |
| [Report on user activity with the Aamu API](https://aamu.app/blog/posts/report-on-user-activity-with-the-aamu-api/) | 941 | 924 | Säilytetty |
| [Aamu Calendar now brings tasks and meetings together](https://aamu.app/blog/posts/aamu-calendar-now-brings-tasks-and-meetings-together/) | 601 | 526 | Säilytetty |
| [Aamu.app vs ClickUp: connected work beyond project management](https://aamu.app/blog/posts/aamuapp-vs-clickup-connected-workspace-and-shared-context/) | 1331 | 840 | Korjattu |
| [Aamu.app vs Basecamp: from project collaboration to company context](https://aamu.app/blog/posts/aamuapp-vs-basecamp-project-context-and-customer-work/) | 1275 | 881 | Säilytetty |
| [Aamu.app vs monday.com: project management with company context](https://aamu.app/blog/posts/aamuapp-vs-monday-project-management-and-company-context/) | 1360 | 975 | Korjattu |
