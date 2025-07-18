# Knowledge Base: JavaScript Engine
---

{NOTE: }

* RavenDB integrates **JavaScript scripting** across various features, including:
   * [RQL projections](../../indexes/querying/projections)  
   * [Subscriptions](../../client-api/data-subscriptions/creation/examples#create-subscription-with-filtering-and-projection)  
   * [ETL](../../server/ongoing-tasks/etl/basics)  
   * [Smuggler (data import/export)](../../client-api/smuggler/what-is-smuggler#transformscript)  
   * [Single](../../client-api/operations/patching/single-document) or [Set based](../../client-api/operations/patching/set-based) document patches  
   * [Time Series](../../document-extensions/timeseries/client-api/javascript-support) 
     and 
     [Incremental Time Series](../../document-extensions/timeseries/incremental-time-series/client-api/javascript-support)  

* To execute JavaScript code,  
  RavenDB uses [Jint](https://github.com/sebastienros/jint), an open source JavaScript interpreter supporting ECMAScript 5.1.  

* In this page:  
   * [How RavenDB uses Jint](../../server/kb/javascript-engine#how-ravendb-uses-jint)  
   * [Predefined JavaScript functions](../../server/kb/javascript-engine#predefined-javascript-functions)  


{NOTE/}

---

{PANEL: How RavenDB uses Jint}

* **Execution context**:  
  Jint executes a JavaScript function on a single document at a time, with each execution running in isolation.  
  Its processing context is limited to a single document, with no persistent execution state -  
  even in patch operations, where it might appear to maintain continuity.

* **Performance considerations**:  
  Since initializing the Jint engine is resource-intensive,  
  RavenDB caches Jint instances based on user-defined scripts to reuse them and enhance performance.

* **Execution limitations**:  
  * RavenDB limits the amount of statements that can be performed for each document processing.  
    The default value is **10,000** and it can be set using the [Patching.MaxStepsForScript](../../server/configuration/patching-configuration#patching.maxstepsforscript) configuration.
  * RavenDB limits the amount of cached Jint engines.  
    The default value is **2,048** and it can be set using the [Patching.MaxNumberOfCachedScripts](../../server/configuration/patching-configuration#patching.maxstepsforscript) configuration.
  * Recursive calls within scripts are limited to a depth of **64**, a constant value that cannot be modified.

{PANEL/}

{PANEL: Predefined JavaScript functions}

In addition to Jint's ECMAScript 5.1 implementation,  
RavenDB provides the following set of predefined functions:

---

#### **Document operations**:

| Method Signature                                            | Return type  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|-------------------------------------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| **id(document)**                                            | `string`     | Returns the ID of the specified document<sup>[[ex]](../../client-api/operations/patching/set-based#updating-by-document-id)</sup>.                                                                                                                                                                                                                                                                                                                                                                                                       |
| **load(documentId)**                                        | `object`     | Returns the document with the given ID.<br>Used in [patching](../../client-api/operations/patching/single-document#loading-documents-in-a-script) or [ETL scripts](../../server/ongoing-tasks/etl/basics#transform).                                                                                                                                                                                                                                                                                                                     |
| **load(documentId, collectionName)**                        | `object`     | Returns the document with the given ID.<br>Used in [JavaScript indexes](../../indexes/javascript-indexes).                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **loadPath(document, pathString)**                          | `object`     | Returns document(s) based on IDs found within the specified `pathString` in the given document.<br>The `pathString` can be in a simple _Foo.Bar_ form, in which case a single document is returned. A path like _Foo.Bars[].Buzz_ can return an array of documents.                                                                                                                                                                                                                                                                      |
| **getMetadata(document)**                                   | `object`     | Returns the metadata of the specified document, including properties like `ChangeVector`, `ID`, and `LastModified`.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **lastModified(document)**                                  | `number`     | Returns the number of milliseconds elapsed since the last modification time (UTC) of the specified document.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **include(documentId)**                                     | `Task`       | Used in RQL [queries](../../client-api/session/querying/what-is-rql) to include the document with the specified ID with the results.                                                                                                                                                                                                                                                                                                                                                                                                     |
| **put(documentId, document, [optional]changeVectorString)** | `Task`       | Creates or updates a document with the specified ID.<br>To generate a new document ID, you can use the _"collectionPrefix/[Server-Side ID](../../server/kb/document-identifier-generation#strategy--2)"_ notation<sup>[[ex]](../../client-api/operations/patching/single-document#add-document)</sup>.<br/>This function can also clone an existing document.<br>Note: attachments & counters will not be included in the clone<sup>[[ex]](../../client-api/operations/patching/single-document#clone-document)</sup>. Used in patching. |
| **del(documentId)**                                         | `void`       | Deletes the document with the specified ID.<br>Used in [patching](../../client-api/operations/patching/set-based#updating-a-collection-name).                                                                                                                                                                                                                                                                                                                                                                                            |
| **archived.archiveAt(document, dateString)**                | `void`       | Schedules the specified document to be archived at the specified `dateString`.<br>Used in [patching](../../data-archival/schedule-document-archiving#schedule-multiple-documents-for-archiving---from-the-client-api).                                                                                                                                                                                                                                                                                                                   |
| **archived.unarchive(document)**                            | `void`       | Unarchives the specified document.<br>Used in [patching](../../data-archival/unarchiving-documents#unarchive-all-documents-in-a-collection---from-the-client-api).                                                                                                                                                                                                                                                                                                                                                                |

---

#### **Counter operations**:

| Method Signature                                     | Return type  | Description                                                                                                                                                                                                                                                                                                                  |
|------------------------------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| **counter(documentId, counterName)**                 | `number`     | Returns the value of the specified counter for the given document ID<sup>[[ex]](../../client-api/operations/patching/single-document#get-counter)</sup>.                                                                                                                                                                     |
| **counter(document, counterName)**                   | `number`     | Returns the value of the specified counter for the given document<sup>[[ex]](../../client-api/operations/patching/single-document#get-counter)</sup>.                                                                                                                                                                        |
| **incrementCounter(documentId, counterName, value)** | `void`       | Increments the specified counter for the given document ID.<br>If the counter does not exist, it is implicitly created with the provided `value`. Counter values can be negative, allowing both increment and decrement operations<sup>[[ex]](../../client-api/operations/patching/single-document#increment-counter)</sup>. |
| **incrementCounter(document, counterName, value)**   | `void`       | Increments the specified counter for the given document.<br>If the counter does not exist, it is implicitly created with the provided `value`. Counter values can be negative, allowing both increment and decrement operations<sup>[[ex]](../../client-api/operations/patching/single-document#increment-counter)</sup>.    |
| **deleteCounter(documentId, counterName)**           | `void`       | Delete the specified counter from the given document ID<sup>[[ex]](../../client-api/operations/patching/single-document#delete-counter)</sup>.                                                                                                                                                                               |
| **deleteCounter(document, counterName)**             | `void`       | Delete the specified counter from the given document<sup>[[ex]](../../client-api/operations/patching/single-document#delete-counter)</sup>.                                                                                                                                                                                  |
| **counterRaw(documentId, counterName)**              | `object`     | Returns a dictionary containing the counter value for each database node. The overall counter value is the sum of all node values.                                                                                                                                                                                           |
| **counterRaw(document, counterName)**                | `object`     | Returns a dictionary containing the counter value for each database node. The overall counter value is the sum of all node values.                                                                                                                                                                                           |

---

#### **Compare-exchange**:

| Method Signature                | Return type  | Description                                                                                                                         |
|---------------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------| 
| **cmpxchg(compareExchangeKey)** | `object`     | Returns the value stored in a [Compare Exchange](../../client-api/operations/compare-exchange/overview) item for the specified key. |

---

#### **String manipulation**:

| Method Signature                                        | Return type  | Description                                                                                                                            |
|---------------------------------------------------------|--------------|----------------------------------------------------------------------------------------------------------------------------------------| 
| **String.prototype.startsWith(searchString, position)** | `boolean`    | Returns _true_ if the specified string starts with `searchString` at the given `position`. `position` is optional and defaults to `0`. |
| **String.prototype.endsWith(searchString, position)**   | `boolean`    | Returns _true_ if the specified string end with `searchString` at the given `position`. `position` is optional and defaults to `0`.    |
| **String.prototype.padStart(targetLength, padString)**  | `string`     | Pads the string from the start with `padString`<br>(or whitespace by default) until it reaches `targetLength`.                         |
| **String.prototype.padEnd(targetLength, padString)**    | `string`     | Pads the string from the end with `padString`<br>(or whitespace by default) until it reaches `targetLength`.                           |
| **String.prototype.format(arg1, arg2, arg3 ...)**       | `string`     | Formats the string by replacing occurrences of `{[number]}` with the corresponding argument based on a zero-based index.               |
| **startsWith(inputString, prefix)**                     | `boolean`    | Returns _true_ if `inputString` starts with the specified `prefix`.                                                                    |
| **endsWith(inputString, suffix)**                       | `boolean`    | Returns _true_ if `inputString` ends with the specified `suffix`.                                                                      |
| **regex(inputString, regex)**                           | `boolean`    | Returns _true_ if `inputString` matches the specified `regex` pattern.                                                                 |

---

#### **Arrays & objects**:

| Method Signature                                     | Return type     | Description                                                                                                                                                                                    |
|------------------------------------------------------|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| **Array.prototype.find(function callback)**          | Array's element | Returns the first element in the array for which the `callback` function returns _true_.                                                                                                       |
| **Object.map(input, function mapFunction, context)** | `Array`         | Returns an array containing the results of `mapFunction` applied to all properties of `input` (or items, if input is an array). The `mapFunction` signature is `function(itemValue, itemKey)`. |

---

#### **Mathematical operations**:

| Method Signature          | Return type  | Description                                                                                                                                                                                                                                                                                                                                            |
|---------------------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| **Raven_Min(num1, num2)** | `number`     | Returns the smaller of `num1` and `num2`. If both params are of the same type (both numbers or both strings), a standard comparison is performed.<br>If they are of mixed types (one number and one string), the string is parsed as a double for comparison.<br>`LazyNumberValue` params resulting from method `scalarToRawString` are not supported. |
| **Raven_Max(num1, num2)** | `number`     | Returns the larger of `num1` and `num2`. If both params are of the same type (both numbers or both strings), a standard comparison is performed.<br>If they are of mixed types (one number and one string), the string is parsed as a double for comparison.<br>`LazyNumberValue` params resulting from method `scalarToRawString` are not supported.  |

---

#### **Conversion operations**:

| Method Signature                               | Return type                                                                                         | Description                                                                                                                                                                                                                                                                                                                          |
|------------------------------------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| **scalarToRawString(document, lambdaToField)** | Raw field value.<br>`LazyStringValue` for strings,<br>`LazyNumberValue` for floating point numbers. | Returns the raw representation of a field. Useful for handling numbers that exceed the numeric or accuracy range of `double` (See [Numbers in Jint](../../server/kb/numbers-in-ravendb#numbers-in-javascript-engine)), or for optimizing memory consumption when projecting large string values.<br>The returned value is immutable. |
| **convertJsTimeToTimeSpanString(ticksNumber)** | `string`                                                                                            | Returns a human-readable `TimeSpan` representation of the specified `ticksNumber`.                                                                                                                                                                                                                                                   |


---

#### **Debugging**:

| Method Signature                                | Return   | Description                                                                                                                                |
|-------------------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------| 
| **output(message)** or **console.log(message)** | `void`   | Prints message to the debug output.<br>Used for debugging [single document patches](../../client-api/operations/patching/single-document). |

{PANEL/}

## Related Articles

### Patching

- [How to Perform Single Document Patch Operations](../../client-api/operations/patching/single-document)
- [How to Perform Set Based Operations on Documents](../../client-api/operations/patching/set-based)

### Querying

- [Projections](../../indexes/querying/projections)

### Knowledge Base

- [Numbers in RavenDB](../../server/kb/numbers-in-ravendb)
