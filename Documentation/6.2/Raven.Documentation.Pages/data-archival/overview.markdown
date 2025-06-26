﻿# Data Archival Overview
---

{NOTE: }

* As a database grows, basic functions like indexing can slow down.
  To address this, RavenDB offers the ability to **archive selected documents**.
  Documents that are rarely accessed or no longer relevant for active use, but still need to be kept for compliance or historical purposes, can be archived. 

* RavenDB features can detect archived documents and handle them in different ways.
  For example, indexing and data subscriptions can be configured to exclude, include, or handle only archived documents during processing.  
  Limiting processing to either archived or non-archived documents may **improve performance**.  
  Learn more in [Archived documents and other features](../data-archival/archived-documents-and-other-features).

* Archived documents are stored in **compressed** form, which helps **reduce database size**.  
  Note that while compression saves disk space, retrieving archived documents may be slower and consume more CPU/memory than accessing regular documents.

* To take advantage of the archiving feature, you must first **enable** it.  
  Once enabled, you can **schedule** documents for archiving.  
  Learn more in the [Overview](../data-archival/overview#overview) section below.

---

* In this article:  
  * [Overview](../data-archival/overview#overview)  
  * [The archived document](../data-archival/overview#the-archived-document)  
  * [Licensing](../data-archival/overview#licensing)

{NOTE/}

---

{PANEL: Overview}

* **Enable the archiving feature**  
  * To archive documents, you must first enable the archiving feature in RavenDB.  
    Learn how in the dedicated article: [Enable data archiving](../data-archival/enable-data-archiving).

* **Schedule documents for archival**
  * Once the feature is enabled, you can schedule any document to be archived at a specific future time.  
    This is done by adding the `@archive-at` metadata property to the document, which specifies the time at which it should be archived.
    Learn more in the dedicated article: [Schedule document archiving](../data-archival/schedule-document-archiving).  
  * The server scans the database periodically (at an interval specified when the task is enabled),  
    identifies documents scheduled for archiving, and archives them at the scheduled time.
  * In a cluster, the archiving task runs on the [preferred node](../client-api/configuration/load-balance/overview#the-preferred-node) (the first node in the cluster topology).  
    Archived documents are then propagated to the other nodes through [internal replication](../server/clustering/replication/replication#internal-replication).  

* **What is archived**  
  * The JSON document itself is archived.  
    Time series, counters, and attachments associated with the document are Not archived.  
    A revision that is created from an archived document is archived as well.

* **Modifying archived documents**
    * Archived documents and their extensions (time series, counters, attachments) remain accessible and can be updated  
      (except for revisions, which are immutable).
    * Modifying an archived document or any of its extensions does not affect its archival status -  
      the document remains archived.

* **Unarchiving documents**  
  * An archived document can be unarchived.  
    Learn more in the dedicated article: [Unarchiving documents](../data-archival/unarchiving-documents).  

{PANEL/}

{PANEL: The archived document}

A document that has been archived is compressed and marked with both a metadata property and an internal metadata flag:

* **Metadata property**:
   * When a document is archived,  
     the archiving task replaces the `@archive-at` metadata property with `"@archived": true`.    
   * This property is informational only - you **cannot** archive a document by manually adding `"@archived": true` to its metadata.
     To archive a document, you must schedule it for archival. Learn more in [Schedule document archiving](../data-archival/schedule-document-archiving).
   * This property allows RavenDB features, clients, and users to recognize the document’s archived status and handle it accordingly.
     For example, a user-defined ETL task can use the presence of this property to skip or handle archived documents differently.
     Learn more in [Archived documents and other features](../data-archival/archived-documents-and-other-features).

* **Internal flag**:
  * When a document is archived, the internal flag `"@flags": "Archived"` is added to its metadata.
  * Features like indexing and data subscriptions use this flag to detect archived documents and handle them based on the configured behavior.
    Learn more in [Archived documents and indexing](../data-archival/archived-documents-and-other-features#archived-documents-and-indexing) & 
    [Archived documents and data subscriptions](../data-archival/archived-documents-and-other-features#archived-documents-and-subscriptions).

---

**An archived document**:  

![An archived document](images/an-archived-document.png "An archived document")

1. This label in the Studio indicates that this document is archived.
2. The `@flags` metadata property contains the `Archived` flag.
3. The document’s metadata contains the `@archived: true` property.

---

**An archived document in the list view**:  

![Archived document in list view](images/archived-document-in-list-view.png "Archived document in list view")

1. This icon indicates the document is archived.

{PANEL/}

{PANEL: Licensing}

The archival feature is available with the **Enterprise** license.  
Learn more about licensing in [Licensing overview](../start/licensing/licensing-overview).  

{PANEL/}

## Related Articles

### Document Archival
- [Enable data archiving](../data-archival/enable-data-archiving)
- [Schedule document archiving](../data-archival/schedule-document-archiving)
- [Archived documents and other features](../data-archival/archived-documents-and-other-features)
- [Unarchiving documents](../data-archival/unarchiving-documents)

### Configuration
- [Overview](../server/configuration/configuration-options#settings.json)  
- [Database Settings](../studio/database/settings/database-settings#view-database-settings)  

### Extensions
- [Document Expiration](../server/extensions/expiration)  

### Patching
- [Patch By Query](../client-api/rest-api/queries/patch-by-query)  
