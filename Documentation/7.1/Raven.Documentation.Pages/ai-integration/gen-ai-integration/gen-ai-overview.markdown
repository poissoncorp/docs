# GenAI Integration: Overview
---

{NOTE: }

* **GenAI Integration** allows RavenDB to connect and interact with Generative AI models, 
  introducing numerous new ways for intelligent, autonomous data processing in production.  
  
     A task can be built in minutes, e.g. to Classify customer inquiries based on sentiment, 
     Generate automated responses to frequently asked questions, Escalate support tickets, 
     Summarize lengthy documents, Provide relevant recommendations, Tag and prioritize content 
     for efficient retrieval, Enhance data security by detecting anomalies, Optimize inventory 
     predictions... or endless other options, bound only by our creativity.  

* **Ongoing GenAI tasks** can be easily defined, tested and deployed using API or Studio.  

     While creating a GenAI task via Studio, a smart interactive environment is provided, 
     allowing each phase of the task to be tested in a secluded playground, freely and without 
     harming your data, but also produce result sets that can be tried out by the next phase.  

* **You can use local and remote AI models**, e.g. a local `Ollama llama3.2` service during 
  a development phase that requires speed and no additional costs, and a remote `OpenAI gpt-4o-mini` 
  when you need a live service with advanced capabilities.  

* In this article:
    * [RavenDB GenAI tasks](../../ai-integration/gen-ai-integration/gen-ai-overview#ravendb-genai-tasks)
    * [Run time](../../ai-integration/gen-ai-integration/gen-ai-overview#run-time)
    * [Licensing](../../ai-integration/gen-ai-integration/gen-ai-overview#licensing)
    * [Supported services](../../ai-integration/gen-ai-integration/gen-ai-overview#supported-services)

{NOTE/}

---

{PANEL: RavenDB GenAI tasks}

RavenDB offers an integration of generative AI capabilities through user-defined **GenAI tasks**.  
A GenAI task is an ongoing process that continuously monitors a document collection associated with it, 
and reacts when a document is added or modified by Retrieving the document, Generating "context objects" 
based on its data, Sending these objects to a generative AI model along with instructions regarding what 
to do with the data and how to format the reply, and potentially Acting upon the model's response.  

{CONTENT-FRAME: <a id="the-flow" />The flow}
Let's put the above stages in order.
<br>
<br>

1. The task continuously monitors the collection it is associated with.  
2. When a document is added or modified, the task retrieves it.  
3. The task generates context objects based on the source document data.  
   To generate these objects, the task applies a user-defined [context generation script](../../ai-integration/gen-ai-integration/gen-ai-overview#the-elements_context-objects) 
   that runs through the source document and generates context objects based on the document data.  
4. The task sends each context object to a GenAI model for processing.  
    * The task is associated with a [Connection string](../../ai-integration/gen-ai-integration/gen-ai-studio#studio_connection-string) 
      that defines how to connect to the AI model.
    * Each context object is sent via a separate connection to the AI model.  
       - The number of concurrent connections to the AI model is configurable 
         via the [MaxConcurrency](../../ai-integration/gen-ai-integration/gen-ai-api#section) variable.  
    * Each context object is sent along with a user-defined [Prompt](../../ai-integration/gen-ai-integration/gen-ai-overview#the-elements_prompt), 
      that instructs the AI model what to do with the data, and 
      a user-defined [JSON schema](../../ai-integration/gen-ai-integration/gen-ai-overview#the-elements_json-schema) 
      that instructs the AI model how to shape its response.  
5. When the AI model returns its response, a user-defined [Update script](../../ai-integration/gen-ai-integration/gen-ai-overview#the-elements_update-script) 
   is applied to handle the results.  
{CONTENT-FRAME/}

{CONTENT-FRAME: <a id="the-elements" />The elements}
These are the elements that need to be defined for a GenAI task.
<br>
<br>

* [Connection string](../../ai-integration/gen-ai-integration/gen-ai-studio#studio_connection-string)  
  The connection string defines the connection to the GenAI model.  

* <a id="the-elements_context-objects" />**Context generation script**  
  The context generation script goes through the source document,  
  and applies the `ai.genContext` method to create **context objects** based on the source document's data.  
  E.g. -  
  {CODE-BLOCK:javascript}
  for(const comment of this.Comments)
{
    // Use the `ai.genContext` method to generate a context object for each comment.  
    ai.genContext({Text: comment.Text, Author: comment.Author, Id: comment.Id});
} 
     {CODE-BLOCK/}
   * RavenDB will pass the AI model **not** the source document, but the generated context objects.  
   * Producing a series of context objects that share a clear common format can add the communication 
     with the AI model a methodical, reliable aspect that is under our full control.  
   * This is also an important security layer added between the database and the AI model, that 
     you can use to ensure that only data you actually want to share with the AI model is passed on.  

* <a id="the-elements_json-schema" />**JSON schema**  
  This is a JSON-based object that defines the layout of the AI model's response.  
  This object can be either an **explicit JSON schema**, or a **sample response object** 
  that RavenDB will turn to a JSON schema for us.  
   * It is normally easier to provide a sample response object, and let RavenDB create 
     the schema behind the scenes. E.g. -  
     {CODE-TABS}
{CODE-TAB-BLOCK:json:Sample_response_object}
{ 
    "Blocked": true, 
    "Reason": "Concise reason for why this comment was marked as spam or ham" 
}
{CODE-TAB-BLOCK/}
{CODE-TAB-BLOCK:json:Explicit_JSON_schema}
{
  "name": "some-name",
  "strict": true,
  "schema": {
    "type": "object",
    "properties": {
      "Blocked": {
        "type": "boolean"
      },
      "Reason": {
        "type": "string",
        "description": "Concise reason for why this comment was marked as spam or ham"
      }
    },
    "required": [
      "Blocked",
      "Reason"
    ],
    "additionalProperties": false
  }
}
{CODE-TAB-BLOCK/}
{CODE-TABS/}

* <a id="the-elements_prompt" />**Prompt**  
  The prompt relays to the AI model what we need it to do.  
   * It can be phrased in natural language.  
   * Since the JSON schema already specifies the response layout, including what fields we'd 
     like the AI model to fill and with what content, the prompt can be used simply to explain 
     what we want the model to do.  
     E.g. -  
     {CODE-BLOCK:plain}
     Check if the following blog post comment is spam or not.  
A spam comment typically includes irrelevant or promotional content, excessive 
links, misleading information, or is written with the intent to manipulate search 
rankings or advertise products/services.  
Consider the language, intent, and relevance of the comment to the blog post topic.
     {CODE-BLOCK/}

* <a id="the-elements_update-script" />**Update Script**  
  The update script is executed when the AI model responds to a context object we've sent it.  
   * The update script can take any action, based on the information included in the model's response.  
     It can, for example, Modify the source document, Create new documents populated by AI-generated text, 
     Remove existing documents, and so on.  
     The following script, for example, removes a comment from a blog post if the AI has concluded 
     that the comment is spam.  
     {CODE-BLOCK:javascript}
const idx = this.Comments.findIndex(c => c.Id == $input.Id);  
if($output.Blocked)
{
    this.Comments.splice(idx, 1);  
} 
    {CODE-BLOCK/}

   * The update script can also be used as an additional security measure, and apply only actions 
     that we trust not to inflict any damage.  

{CONTENT-FRAME/}

{CONTENT-FRAME: <a id="how-to-create-and-run-a-gen-ai-task" />How to create and run a GenAI task}

* You can use [Studio's intuitive wizard](../../ai-integration/gen-ai-integration/gen-ai-studio#add-a-genai-task) 
  to create GenAI tasks. The wizard will guide you through the task creation phases, 
  exemplify where needed, and provide you with convenient, interactive, secluded "playgrounds" 
  for free interactive experimenting.  
* You can also create GenAI tasks using the [Client API](../../ai-integration/gen-ai-integration/gen-ai-api) 
{CONTENT-FRAME/}
 
{PANEL/}

{PANEL: Run time}

Once you complete the configuration and save the task, it will start running (if enabled).  
The task will monitor the collection associated with it, and process documents as they are 
added or modified.  

---

#### Tracking of processed document parts

* After creating a [context object](../../ai-integration/gen-ai-integration/gen-ai-studio#generate-context-objects) 
  of a document part and processing it, RavenDB will log this context object in 
  the document's metadata, under a property whose name is the unique task identifier 
  defined [here](../../ai-integration/gen-ai-integration/gen-ai-studio#unique-identifier).  
* The task will create a hash code for the context object, and log it in the document metadata.  
  {CONTENT-FRAME: Hash computation}
  When computing the hash code, the task will include these elements in the computation:  
  <br>

  * The context object  
  * The GenAI provider and model (e.g. Ollama llama3.2)  
  * The prompt  
  * The JSON schema  
  * The update script
  {CONTENT-FRAME/}
  Whenever the task is requested to process this document part again, it will recreate 
  a hash code for the same 5 elements.  
  If the new hash code is identical to one of the codes logged in the document's metadata, 
  the task will conclude that the context object was already processed with the exact same 
  model, prompt, schema and update script, and skip reprocessing it.  
  If the new code is not found in the metadata list, the context object will be processed again.  

       ![Tracking processed document parts](images/gen-ai_hash-flow.png "Tracking processed document parts")

![Metadata Identifier and Hash codes](images/gen-ai_metadata-identifier-and-hash-codes.png "Metadata Identifier and Hash codes")

1. **Identifier**  
   This is the unique identifier used by the GenAI task.  
2. **Hash codes**  
   These two hash codes were added after processing `comment/1` and `comment/3`.  

{PANEL/}

{PANEL: Licensing}

For RavenDB to support the GenAI Integration feature, you need a `RavenDB AI` license type.  
A `Developer` license will also enable the feature for experimentation and development.  

![Licensing: RavenDB AI license](images/gen-ai_licensing.png "Licensing: RavenDB AI license")

{PANEL/}

{PANEL: Supported services}

Supported services include:

* `OpenAI` and `OpenAI-compatible` services  
* `Ollama`  

{PANEL/}


## Related Articles

### GenAI Integration

- [GenAI API](../../ai-integration/gen-ai-integration/gen-ai-api)  
- [GenAI Studio](../../ai-integration/gen-ai-integration/gen-ai-studio)
- [GenAI Security Concerns](../../ai-integration/gen-ai-integration/gen-ai-security-concerns)

### Vector Search

- [Vector search using a dynamic query](../../ai-integration/vector-search/vector-search-using-dynamic-query.markdown)
- [Vector search using a static index](../../ai-integration/vector-search/vector-search-using-static-index.markdown)
- [Data types for vector search](../../ai-integration/vector-search/data-types-for-vector-search)
