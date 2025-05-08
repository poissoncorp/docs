# SNMP Support

---

{INFO: }

SNMP support is available for [Enterprise](../../../start/licensing/licensing-overview#enterprise) licenses only.

{INFO/}

{NOTE: }

* This page explains how to use SNMP to monitor RavenDB and what metrics can be accessed.  

* In this page:  
  * [Overview](../../../server/administration/snmp/snmp#overview)
  * [Enabling SNMP in RavenDB](../../../server/administration/snmp/snmp#enabling-snmp-in-ravendb)
  * [SNMP Configuration options](../../../server/administration/snmp/snmp#snmp-configuration-options)
  * [The Metrics](../../../server/administration/snmp/snmp#the-metrics)
      * [Access metrics via monitoring tools](../../../server/administration/snmp/snmp#access-metrics-via-monitoring-tools)
      * [Access metrics via SNMP agents](../../../server/administration/snmp/snmp#access-metrics-via-snmp-agents)
      * [Access metrics via HTTP](../../../server/administration/snmp/snmp#access-metrics-via-http)
  * [List of OIDs](../../../server/administration/snmp/snmp#list-of-oids)

{NOTE/}

---

{PANEL: Overview}

* Simple Network Management Protocol (SNMP) is an Internet-standard protocol for collecting and organizing 
  information about managed devices on IP networks. It is used primarily for monitoring network services. 
  SNMP exposes management data in the form of variables (metrics) that describe the system status and 
  configuration. These metrics can then be remotely queried (and, in some circumstances, manipulated) by 
  managing applications.  

* In RavenDB we have support for SNMP which allows monitoring tools like [Zabbix](https://www.zabbix.com), 
  [PRTG](https://www.paessler.com/prtg), and [Datadog](https://www.datadoghq.com/) direct access to the 
  internal details of RavenDB. We expose a long [list of metrics](../../../server/administration/snmp/snmp#list-of-oids): CPU and memory usage, server total requests, 
  the loaded databases, and database-specific metrics like the number of indexed items per second, 
  document writes per second, storage space each database takes, and more.  

* You can still monitor what is going on with RavenDB directly from the Studio, or by using one of our 
  monitoring tools. However, using SNMP might be easier in some cases. As users start running large numbers 
  of RavenDB instances, it becomes impractical to deal with each of them individually, and using a monitoring 
  system that can watch many servers becomes advisable.  

{PANEL/}

{PANEL: Enabling SNMP in RavenDB}

* To monitor RavenDB using SNMP you **must** first set the [Monitoring.Snmp.Enabled](../../../server/configuration/monitoring-configuration#monitoring.snmp.enabled) configuration key to _true_.

* To learn how to modify a configuration key, refer to the [Configuration Overview](../../../server/configuration/configuration-options) article,  
  which outlines all available options.

* For example, add this key to your _settings.json_ file and restart the server.

{CODE-BLOCK:json}
{
    ...
    "Monitoring.Snmp.Enabled": true
    ...
}
{CODE-BLOCK/}

{PANEL/}

{PANEL: SNMP configuration options}

There are several configurable SNMP properties in RavenDB:

---

##### For SNMPv1:

* [Monitoring.Snmp.Port](../../../server/configuration/monitoring-configuration#monitoring.snmp.port)  
  The SNMP port.  
  Default: `161`  
* [Monitoring.Snmp.SupportedVersions](../../../server/configuration/monitoring-configuration#monitoring.snmp.supportedversions)  
  List of supported SNMP versions.  
  Default: `"V2C;V3"`

##### For SNMPv2c:

* [Monitoring.Snmp.Community](../../../server/configuration/monitoring-configuration#monitoring.snmp.community)   
  The community string is used as a password.  
  It is sent with each SNMP `GET` request and allows or denies access to the monitored device.  
  Default: `"ravendb"`

##### For SNMPv3:

* [Monitoring.Snmp.AuthenticationProtocol](../../../server/configuration/monitoring-configuration#monitoring.snmp.authenticationprotocol)  
  Authentication protocol.  
  Default: `"SHA1"`  
* [Monitoring.Snmp.AuthenticationUser](../../../server/configuration/monitoring-configuration#monitoring.snmp.authenticationuser)  
  The user for authentication.  
  Default: `"ravendb"`  
* [Monitoring.Snmp.AuthenticationPassword](../../../server/configuration/monitoring-configuration#monitoring.snmp.authenticationpassword)  
  The authentication password.
  When set to `null` the community string is used instead.  
  Default: `null` 
* [Monitoring.Snmp.PrivacyProtocol](../../../server/configuration/monitoring-configuration#monitoring.snmp.privacyprotocol)  
  Privacy protocol.  
  Default: `None`   
* [Monitoring.Snmp.PrivacyPassword](../../../server/configuration/monitoring-configuration#monitoring.snmp.privacypassword)  
  Privacy password.  
  Default: `"ravendb"`

--- 

{INFO: }

* See article [Monitoring Options](../../../server/configuration/monitoring-configuration) for the full list of **SNMP configuration keys**.
 
* To learn how to modify a configuration key, refer to the [Configuration Overview](../../../server/configuration/configuration-options) article,  
  which outlines all available options.
{INFO/}

{PANEL/}

{PANEL: The Metrics}

{NOTE: }

#### Access metrics via monitoring tools

* Querying the exposed metrics using a monitoring tool is typically straightforward (see this [Zabbix example](../../../server/administration/snmp/setup-zabbix)).

* For a simplified setup, we have provided a few templates which can be found [here](https://github.com/ravendb/ravendb/tree/v4.0/src/Raven.Server/Monitoring/Snmp/Templates).   
  These templates include the metrics and their associated OIDs.
 
{NOTE/}

{NOTE: }

#### Access metrics via SNMP agents

* The metrics can be accessed directly using any SNMP agent such as [Net-SNMP](http://net-snmp.sourceforge.net/).  
  Each metric has a unique object identifier (OID) and can be accessed individually.  

* The most basic SNMP commands are `snmpget`, `snmpset` and `snmpwalk`.  
  For example, you can execute the following _snmpget_ commands to retrieve the server's [up-time metric](../../../server/administration/snmp/snmp#1.3).

    ##### For SNMPv2c:

    {CODE-BLOCK:bash}
// Request:
snmpget -v 2c -c ravendb live-test.ravendb.net 1.3.6.1.4.1.45751.1.1.1.3

// Result:
iso.3.6.1.4.1.45751.1.1.1.3 = Timeticks: (29543973) 3 days, 10:03:59.73
    {CODE-BLOCK/}

    * `ravendb` is the community string (set via the [Monitoring.Snmp.Community](../../../server/configuration/monitoring-configuration#monitoring.snmp.community) configuration key).   
    * `"live-test.ravendb.net"` is the host.  

    ##### For SNMPv3:


    {CODE-BLOCK:bash}
snmpget -v 3 -l authNoPriv -u ravendb -a SHA \
        -A ravendb live-test.ravendb.net 1.3.6.1.4.1.45751.1.1.1.3
    {CODE-BLOCK/}

    * `-l authNoPriv` - sets the security level to use authentication but no privacy.  
    * `-u ravendb` - sets the user for authentication purposes to "ravendb".  
    * `-a SHA` - sets the authentication protocol to SHA.  
    * `-A ravendb` - sets the authentication password to "ravendb".  

{NOTE/}

{NOTE: }

#### Access metrics via HTTP

---

**Access single OID value**:

* An individual OID value can be retrieved via HTTP `GET` endpoint:  
  `<serverUrl>/monitoring/snmp?oid=<oid>`  

* For example, a cURL request for the server [up-time metric](../../../server/administration/snmp/snmp#1.3):

    {CODE-BLOCK:bash}
// Request:
curl -X GET http://live-test.ravendb.net/monitoring/snmp?oid=1.3.6.1.4.1.45751.1.1.1.3

// Result:
{ "Value" : "4.21:32:56.0700000" }
    {CODE-BLOCK/}


---

**Access multiple OID values**:

* Multiple OID values can be retrieved by making either a `GET` or a `POST` request to the following HTTP endpoint:
  `<serverUrl>/monitoring/snmp/bulk`

* For example, cURL requests for the server [managed memory](../../../server/administration/snmp/snmp#1.6.7) and [unmanaged memory](../../../server/administration/snmp/snmp#1.6.8) metrics:

    {CODE-BLOCK:bash}
curl -X GET "http://live-test.ravendb.net/monitoring/snmp/bulk? \
             oid=1.3.6.1.4.1.45751.1.1.1.6.7&oid=1.3.6.1.4.1.45751.1.1.1.6.8"
    {CODE-BLOCK/}

    {CODE-BLOCK:bash}
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{  "OIDs": ["1.3.6.1.4.1.45751.1.1.1.6.7", "1.3.6.1.4.1.45751.1.1.1.6.8"]}' \
     http://localhost:8080/monitoring/snmp/bulk
    {CODE-BLOCK/}

    {CODE-BLOCK:bash}
{
    "Results": [
        { "OID": "1.3.6.1.4.1.45751.1.1.1.6.7", "Value": "410" },
        { "OID": "1.3.6.1.4.1.45751.1.1.1.6.8", "Value": "4"   }
    ]
}
    {CODE-BLOCK/}

--- 

<a id="getAllOids" /> **Get all OIDs:**

* You can get a list of all OIDs along with their description via this HTTP `GET` endpoint:  
  `<serverUrl>/monitoring/snmp/oids`

* For example: [http://live-test.ravendb.net/monitoring/snmp/oids](http://live-test.ravendb.net/monitoring/snmp/oids)

{NOTE/}

{PANEL/}

{PANEL: List of OIDs}

{NOTE: }

* RavenDB's **root OID** is: **1.3.6.1.4.1.45751.1.1.**

* Values represented by `X`, `D`, or `I` in the OIDs list below will be:
    * `X`:  
      `0` - **any kind of collection**  
      `1` - **a generation-0 or generation-1 collection**  
      `2` - **a blocking generation-2 collection**  
      `3` - **a background collection** (this is always a generation 2 collection)  
    * `D` - **Database number**  
    * `I` - **Index number**  

{NOTE/}

| OID                                            | Metric (Server)                                                                                                                                                                                                                                                                |
|------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <a id="1.1.1" /> 1.1.1                         | Server URL                                                                                                                                                                                                                                                                     |
| <a id="1.1.2" /> 1.1.2                         | Server Public URL                                                                                                                                                                                                                                                              |
| <a id="1.1.3" /> 1.1.3                         | Server TCP URL                                                                                                                                                                                                                                                                 |
| <a id="1.1.4" /> 1.1.4                         | Server Public TCP URL                                                                                                                                                                                                                                                          |
| <a id="1.2.1" /> 1.2.1                         | Server version                                                                                                                                                                                                                                                                 |
| <a id="1.2.2" /> 1.2.2                         | Server full version                                                                                                                                                                                                                                                            |
| <a id="1.3" /> 1.3                             | Server up-time                                                                                                                                                                                                                                                                 |
| <a id="1.3.6.1.2.1.1.3.0" /> 1.3.6.1.2.1.1.3.0 | Server up-time (global)                                                                                                                                                                                                                                                        |
| <a id="1.4" /> 1.4                             | Server process ID                                                                                                                                                                                                                                                              |
| <a id="1.5.1" /> 1.5.1                         | Process CPU usage in %                                                                                                                                                                                                                                                         |
| <a id="1.5.2" /> 1.5.2                         | Machine CPU usage in %                                                                                                                                                                                                                                                         |
| <a id="1.5.3.1" /> 1.5.3.1                     | CPU Credits Base                                                                                                                                                                                                                                                               |
| <a id="1.5.3.2" /> 1.5.3.2                     | CPU Credits Max                                                                                                                                                                                                                                                                |
| <a id="1.5.3.3" /> 1.5.3.3                     | CPU Credits Remaining                                                                                                                                                                                                                                                          |
| <a id="1.5.3.4" /> 1.5.3.4                     | CPU Credits Gained Per Second                                                                                                                                                                                                                                                  |
| <a id="1.5.3.5" /> 1.5.3.5                     | CPU Credits Background Tasks Alert Raised                                                                                                                                                                                                                                      |
| <a id="1.5.3.6" /> 1.5.3.6                     | CPU Credits Failover Alert Raised                                                                                                                                                                                                                                              |
| <a id="1.5.3.7" /> 1.5.3.7                     | CPU Credits Any Alert Raised                                                                                                                                                                                                                                                   |
| <a id="1.5.4" /> 1.5.4                         | IO wait in %                                                                                                                                                                                                                                                                   |
| <a id="1.6.1" /> 1.6.1                         | Server allocated memory in MB                                                                                                                                                                                                                                                  |
| <a id="1.6.2" /> 1.6.2                         | Server low memory flag value                                                                                                                                                                                                                                                   |
| <a id="1.6.3" /> 1.6.3                         | Server total swap size in MB                                                                                                                                                                                                                                                   |
| <a id="1.6.4" /> 1.6.4                         | Server total swap usage in MB                                                                                                                                                                                                                                                  |
| <a id="1.6.5" /> 1.6.5                         | Server working set swap usage in MB                                                                                                                                                                                                                                            |
| <a id="1.6.6" /> 1.6.6                         | Dirty Memory that is used by the scratch buffers in MB                                                                                                                                                                                                                         |
| <a id="1.6.7" /> 1.6.7                         | Server managed memory size in MB                                                                                                                                                                                                                                               |
| <a id="1.6.8" /> 1.6.8                         | Server unmanaged memory size in MB                                                                                                                                                                                                                                             |
| <a id="1.6.9" /> 1.6.9                         | Server encryption buffers memory being in use in MB                                                                                                                                                                                                                            |
| <a id="1.6.10" /> 1.6.10                       | Server encryption buffers memory being in pool in MB                                                                                                                                                                                                                           |
| <a id="1.6.11.X.2" /> 1.6.11.`X`.2             | GC info for `X`.<br>Specifies if this is a concurrent GC or not.                                                                                                                                                                                                               |
| <a id="1.6.11.X.3" /> 1.6.11.`X`.3             | GC info for `X`.<br>Gets the number of objects ready for finalization this GC observed.                                                                                                                                                                                        |
| <a id="1.6.11.X.4" /> 1.6.11.`X`.4             | GC info for `X`.<br>Gets the total fragmentation (in MB) when the last garbage collection occurred.                                                                                                                                                                            |
| <a id="1.6.11.X.5" /> 1.6.11.`X`.5             | GC info for `X`.<br>Gets the generation this GC collected.                                                                                                                                                                                                                     |
| <a id="1.6.11.X.6" /> 1.6.11.`X`.6             | GC info for `X`.<br>Gets the total heap size (in MB) when the last garbage collection occurred.                                                                                                                                                                                |
| <a id="1.6.11.X.7" /> 1.6.11.`X`.7             | GC info for `X`.<br>Gets the high memory load threshold (in MB) when the last garbage collection occurred.                                                                                                                                                                     |
| <a id="1.6.11.X.8" /> 1.6.11.`X`.8             | GC info for `X`.<br>The index of this GC.                                                                                                                                                                                                                                      |
| <a id="1.6.11.X.9" /> 1.6.11.`X`.9             | GC info for `X`.<br>Gets the memory load (in MB) when the last garbage collection occurred.                                                                                                                                                                                    |
| <a id="1.6.11.X.10.1" /> 1.6.11.`X`.10.1       | GC info for `X`.<br>Gets the pause durations. First item in the array.                                                                                                                                                                                                         |
| <a id="1.6.11.X.10.2" /> 1.6.11.`X`.10.2       | GC info for `X`.<br>Gets the pause durations. Second item in the array.                                                                                                                                                                                                        |
| <a id="1.6.11.X.11" /> 1.6.11.`X`.11           | GC info for `X`.<br>Gets the pause time percentage in the GC so far.                                                                                                                                                                                                           |
| <a id="1.6.11.X.12" /> 1.6.11.`X`.12           | GC info for `X`.<br>Gets the number of pinned objects this GC observed.                                                                                                                                                                                                        |
| <a id="1.6.11.X.13" /> 1.6.11.`X`.13           | GC info for `X`.<br>Gets the promoted MB for this GC.                                                                                                                                                                                                                          |
| <a id="1.6.11.X.14" /> 1.6.11.`X`.14           | GC info for `X`.<br>Gets the total available memory (in MB) for the garbage collector to use when the last garbage collection occurred.                                                                                                                                        |
| <a id="1.6.11.X.15" /> 1.6.11.`X`.15           | GC info for `X`.<br>Gets the total committed MB of the managed heap.                                                                                                                                                                                                           |
| <a id="1.6.11.X.16.3" /> 1.6.11.`X`.16.3       | GC info for `X`.<br>Gets the large object heap size (in MB) after the last garbage collection of given kind occurred.                                                                                                                                                          |
| <a id="1.6.12.{0}" /> 1.6.12.{0}               | Monitor [/proc/meminfo/](https://man7.org/linux/man-pages/man5/proc.5.html) metrics (unix/linux).<br>The description of each metric is available via endpoint `<serverUrl>/monitoring/snmp/oids`.<br> See [Get all OIDs](../../../server/administration/snmp/snmp#getAllOids). |
| <a id="1.6.13" /> 1.6.13                       | Available memory for processing (in MB)                                                                                                                                                                                                                                        |
| <a id="1.7.1" /> 1.7.1                         | Number of concurrent requests                                                                                                                                                                                                                                                  |
| <a id="1.7.2" /> 1.7.2                         | Total number of requests since server startup                                                                                                                                                                                                                                  |
| <a id="1.7.3" /> 1.7.3                         | Number of requests per second (one minute rate)                                                                                                                                                                                                                                |
| <a id="1.7.3.1" /> 1.7.3.1                     | Number of requests per second (five second rate)                                                                                                                                                                                                                               |
| <a id="1.7.4" /> 1.7.4                         | Average request time in milliseconds                                                                                                                                                                                                                                           |
| <a id="1.8" /> 1.8                             | Server last request time                                                                                                                                                                                                                                                       |
| <a id="1.8.1" /> 1.8.1                         | Server last authorized non cluster admin request time                                                                                                                                                                                                                          |
| <a id="1.9.1" /> 1.9.1                         | Server license type                                                                                                                                                                                                                                                            |
| <a id="1.9.2" /> 1.9.2                         | Server license expiration date                                                                                                                                                                                                                                                 |
| <a id="1.9.3" /> 1.9.3                         | Server license expiration left                                                                                                                                                                                                                                                 |
| <a id="1.9.4" /> 1.9.4                         | Server license utilized CPU cores                                                                                                                                                                                                                                              |
| <a id="1.9.5" /> 1.9.5                         | Server license max CPU cores                                                                                                                                                                                                                                                   |
| <a id="1.10.1" /> 1.10.1                       | Server storage used size in MB                                                                                                                                                                                                                                                 |
| <a id="1.10.2" /> 1.10.2                       | Server storage total size in MB                                                                                                                                                                                                                                                |
| <a id="1.10.3" /> 1.10.3                       | Remaining server storage disk space in MB                                                                                                                                                                                                                                      |
| <a id="1.10.4" /> 1.10.4                       | Remaining server storage disk space in %                                                                                                                                                                                                                                       |
| <a id="1.10.5" /> 1.10.5                       | IO read operations per second                                                                                                                                                                                                                                                  |
| <a id="1.10.6" /> 1.10.6                       | IO write operations per second                                                                                                                                                                                                                                                 |
| <a id="1.10.7" /> 1.10.7                       | Read throughput in kilobytes per second                                                                                                                                                                                                                                        |
| <a id="1.10.8" /> 1.10.8                       | Write throughput in kilobytes per second                                                                                                                                                                                                                                       |
| <a id="1.10.9" /> 1.10.9                       | Queue length                                                                                                                                                                                                                                                                   |
| <a id="1.11.1" /> 1.11.1                       | Server certificate expiration date                                                                                                                                                                                                                                             |
| <a id="1.11.2" /> 1.11.2                       | Server certificate expiration left                                                                                                                                                                                                                                             |
| <a id="1.11.3" /> 1.11.3                       | List of well known admin certificate thumbprints                                                                                                                                                                                                                               |
| <a id="1.11.4" /> 1.11.4                       | List of well known admin certificate issuers                                                                                                                                                                                                                                   |
| <a id="1.12.1" /> 1.12.1                       | Number of processor on the machine                                                                                                                                                                                                                                             |
| <a id="1.12.2" /> 1.12.2                       | Number of assigned processors on the machine                                                                                                                                                                                                                                   |
| <a id="1.13.1" /> 1.13.1                       | Number of backups currently running                                                                                                                                                                                                                                            |
| <a id="1.13.2" /> 1.13.2                       | Max number of backups that can run concurrently                                                                                                                                                                                                                                |
| <a id="1.14.1" /> 1.14.1                       | Number of available worker threads in the thread pool                                                                                                                                                                                                                          |
| <a id="1.14.2" /> 1.14.2                       | Number of available completion port threads in the thread pool                                                                                                                                                                                                                 |
| <a id="1.15.1" /> 1.15.1                       | Number of active TCP connections                                                                                                                                                                                                                                               |
| <a id="1.16.1" /> 1.16.1                       | Indicates if any experimental features are used                                                                                                                                                                                                                                |
| <a id="1.17.1" /> 1.17.1                       | Value of the '/proc/sys/vm/max_map_count' parameter                                                                                                                                                                                                                            |
| <a id="1.17.2" /> 1.17.2                       | Number of current map files in '/proc/self/maps'                                                                                                                                                                                                                               |
| <a id="1.17.3" /> 1.17.3                       | Value of the '/proc/sys/kernel/threads-max' parameter                                                                                                                                                                                                                          |
| <a id="1.17.4" /> 1.17.4                       | Number of current threads                                                                                                                                                                                                                                                      |

| OID                    | Metric (Cluster)   |
|------------------------|--------------------| 
| <a id="3.1.1" /> 3.1.1 | Current node tag   |
| <a id="3.1.2" /> 3.1.2 | Current node state |
| <a id="3.2.1" /> 3.2.1 | Cluster term       |
| <a id="3.2.2" /> 3.2.2 | Cluster index      |
| <a id="3.2.3" /> 3.2.3 | Cluster ID         |

| OID                                | Metric (Database)                                                        |
|------------------------------------|--------------------------------------------------------------------------| 
| <a id="5.2.D.1.1" /> 5.2.`D`.1.1   | Database name                                                            |
| <a id="5.2.D.1.2" /> 5.2.`D`.1.2   | Number of indexes                                                        |
| <a id="5.2.D.1.3" /> 5.2.`D`.1.3   | Number of stale indexes                                                  |
| <a id="5.2.D.1.4" /> 5.2.`D`.1.4   | Number of documents                                                      |
| <a id="5.2.D.1.5" /> 5.2.`D`.1.5   | Number of revision documents                                             |
| <a id="5.2.D.1.6" /> 5.2.`D`.1.6   | Number of attachments                                                    |
| <a id="5.2.D.1.7" /> 5.2.`D`.1.7   | Number of unique attachments                                             |
| <a id="5.2.D.1.10" /> 5.2.`D`.1.10 | Number of alerts                                                         |
| <a id="5.2.D.1.11" /> 5.2.`D`.1.11 | Database ID                                                              |
| <a id="5.2.D.1.12" /> 5.2.`D`.1.12 | Database up-time                                                         |
| <a id="5.2.D.1.13" /> 5.2.`D`.1.13 | Indicates if database is loaded                                          |
| <a id="5.2.D.1.14" /> 5.2.`D`.1.14 | Number of rehabs                                                         |
| <a id="5.2.D.1.15" /> 5.2.`D`.1.15 | Number of performance hints                                              |
| <a id="5.2.D.1.16" /> 5.2.`D`.1.16 | Number of indexing errors                                                |
| <a id="5.2.D.2.1" /> 5.2.`D`.2.1   | Documents storage allocated size in MB                                   |
| <a id="5.2.D.2.2" /> 5.2.`D`.2.2   | Documents storage used size in MB                                        |
| <a id="5.2.D.2.3" /> 5.2.`D`.2.3   | Index storage allocated size in MB                                       |
| <a id="5.2.D.2.4" /> 5.2.`D`.2.4   | Index storage used size in MB                                            |
| <a id="5.2.D.2.5" /> 5.2.`D`.2.5   | Total storage size in MB                                                 |
| <a id="5.2.D.2.6" /> 5.2.`D`.2.6   | Remaining storage disk space in MB                                       |
| <a id="5.2.D.2.7" /> 5.2.`D`.2.7   | IO read operations per second                                            |
| <a id="5.2.D.2.8" /> 5.2.`D`.2.8   | IO write operations per second                                           |
| <a id="5.2.D.2.9" /> 5.2.`D`.2.9   | Read throughput in kilobytes per second                                  |
| <a id="5.2.D.2.10" /> 5.2.`D`.2.10 | Write throughput in kilobytes per second                                 |
| <a id="5.2.D.2.11" /> 5.2.`D`.2.11 | Queue length                                                             |
| <a id="5.2.D.3.1" /> 5.2.`D`.3.1   | Number of document puts per second (one minute rate)                     |
| <a id="5.2.D.3.2" /> 5.2.`D`.3.2   | Number of indexed documents per second for map indexes (one minute rate) |
| <a id="5.2.D.3.3" /> 5.2.`D`.3.3   | Number of maps per second for map-reduce indexes (one minute rate)       |
| <a id="5.2.D.3.4" /> 5.2.`D`.3.4   | Number of reduces per second for map-reduce indexes (one minute rate)    |
| <a id="5.2.D.3.5" /> 5.2.`D`.3.5   | Number of requests per second (one minute rate)                          |
| <a id="5.2.D.3.6" /> 5.2.`D`.3.6   | Number of requests from database start                                   |
| <a id="5.2.D.3.7" /> 5.2.`D`.3.7   | Average request time in milliseconds                                     |
| <a id="5.2.D.5.1" /> 5.2.`D`.5.1   | Number of indexes                                                        |
| <a id="5.2.D.5.2" /> 5.2.`D`.5.2   | Number of static indexes                                                 |
| <a id="5.2.D.5.3" /> 5.2.`D`.5.3   | Number of auto indexes                                                   |
| <a id="5.2.D.5.4" /> 5.2.`D`.5.4   | Number of idle indexes                                                   |
| <a id="5.2.D.5.5" /> 5.2.`D`.5.5   | Number of disabled indexes                                               |
| <a id="5.2.D.5.6" /> 5.2.`D`.5.6   | Number of error indexes                                                  |
| <a id="5.2.D.5.7" /> 5.2.`D`.5.7   | Number of faulty indexes                                                 |
| <a id="5.2.D.6.1" /> 5.2.`D`.6.1   | Number of writes (documents, attachments, counters, timeseries)          |
| <a id="5.2.D.6.2" /> 5.2.`D`.6.2   | Number of bytes written (documents, attachments, counters, timeseries)   |

| OID                                      | Metric (Index)                                 |
|------------------------------------------|------------------------------------------------| 
| <a id="5.2.D.4.I.1" /> 5.2.`D`.4.`I`.1   | Indicates if index exists                      |
| <a id="5.2.D.4.I.2" /> 5.2.`D`.4.`I`.2   | Index name                                     |
| <a id="5.2.D.4.I.4" /> 5.2.`D`.4.`I`.4   | Index priority                                 |
| <a id="5.2.D.4.I.5" /> 5.2.`D`.4.`I`.5   | Index state                                    |
| <a id="5.2.D.4.I.6" /> 5.2.`D`.4.`I`.6   | Number of index errors                         |
| <a id="5.2.D.4.I.7" /> 5.2.`D`.4.`I`.7   | Last query time                                |
| <a id="5.2.D.4.I.8" /> 5.2.`D`.4.`I`.8   | Index indexing time                            |
| <a id="5.2.D.4.I.9" /> 5.2.`D`.4.`I`.9   | Time since last query                          |
| <a id="5.2.D.4.I.10" /> 5.2.`D`.4.`I`.10 | Time since last indexing                       |
| <a id="5.2.D.4.I.11" /> 5.2.`D`.4.`I`.11 | Index lock mode                                |
| <a id="5.2.D.4.I.12" /> 5.2.`D`.4.`I`.12 | Indicates if index is invalid                  |
| <a id="5.2.D.4.I.13" /> 5.2.`D`.4.`I`.13 | Index status                                   |
| <a id="5.2.D.4.I.14" /> 5.2.`D`.4.`I`.14 | Number of maps per second (one minute rate)    |
| <a id="5.2.D.4.I.15" /> 5.2.`D`.4.`I`.15 | Number of reduces per second (one minute rate) |
| <a id="5.2.D.4.I.16" /> 5.2.`D`.4.`I`.16 | Index type                                     |

| OID                        | Metric (General)                                                                                 |
|----------------------------|--------------------------------------------------------------------------------------------------| 
| <a id="5.1.1" /> 5.1.1     | Number of all databases                                                                          |
| <a id="5.1.2" /> 5.1.2     | Number of loaded databases                                                                       |
| <a id="5.1.3" /> 5.1.3     | Time since oldest backup                                                                         |
| <a id="5.1.4" /> 5.1.4     | Number of disabled databases                                                                     |
| <a id="5.1.5" /> 5.1.5     | Number of encrypted databases                                                                    |
| <a id="5.1.6" /> 5.1.6     | Number of databases for current node                                                             |
| <a id="5.1.7.1" /> 5.1.7.1 | Number of indexes in all loaded databases                                                        |
| <a id="5.1.7.2" /> 5.1.7.2 | Number of stale indexes in all loaded databases                                                  |
| <a id="5.1.7.3" /> 5.1.7.3 | Number of error indexes in all loaded databases                                                  |
| <a id="5.1.7.4" /> 5.1.7.4 | Number of faulty indexes in all loaded databases                                                 | 
| <a id="5.1.7.5" /> 5.1.7.5 | Number of indexing errors in all loaded databases                                                | 
| <a id="5.1.8.1" /> 5.1.8.1 | Number of indexed documents per second for map indexes (one minute rate) in all loaded databases |
| <a id="5.1.8.2" /> 5.1.8.2 | Number of maps per second for map-reduce indexes (one minute rate) in all loaded databases       |
| <a id="5.1.8.3" /> 5.1.8.3 | Number of reduces per second for map-reduce indexes (one minute rate) in all loaded databases    |
| <a id="5.1.9.1" /> 5.1.9.1 | Number of writes (documents, attachments, counters, timeseries) in all loaded databases          |
| <a id="5.1.9.2" /> 5.1.9.2 | Number of bytes written (documents, attachments, counters, timeseries) in all loaded databases   |
| <a id="5.1.10" /> 5.1.10   | Number of faulted databases                                                                      |

| OID                            | Metric (Ongoing tasks)                                             |
|--------------------------------|--------------------------------------------------------------------| 
| <a id="5.1.11.1" /> 5.1.11.1   | Number of enabled ongoing tasks for all databases                  |
| <a id="5.1.11.2" /> 5.1.11.2   | Number of active ongoing tasks for all databases                   |
| <a id="5.1.11.3" /> 5.1.11.3   | Number of enabled external replication tasks for all databases     |
| <a id="5.1.11.4" /> 5.1.11.4   | Number of active external replication tasks for all databases      |
| <a id="5.1.11.5" /> 5.1.11.5   | Number of enabled RavenDB ETL tasks for all databases              |
| <a id="5.1.11.6" /> 5.1.11.6   | Number of active RavenDB ETL tasks for all databases               |
| <a id="5.1.11.7" /> 5.1.11.7   | Number of enabled SQL ETL tasks for all databases                  |
| <a id="5.1.11.8" /> 5.1.11.8   | Number of active SQL ETL tasks for all databases                   |
| <a id="5.1.11.9" /> 5.1.11.9   | Number of enabled OLAP ETL tasks for all databases                 |
| <a id="5.1.11.10" /> 5.1.11.10 | Number of active OLAP ETL tasks for all databases                  |
| <a id="5.1.11.11" /> 5.1.11.11 | Number of enabled Elasticsearch ETL tasks for all databases        |
| <a id="5.1.11.12" /> 5.1.11.12 | Number of active Elasticsearch ETL tasks for all databases         |
| <a id="5.1.11.13" /> 5.1.11.13 | Number of enabled Queue ETL tasks for all databases                |
| <a id="5.1.11.14" /> 5.1.11.14 | Number of active Queue ETL tasks for all databases                 |
| <a id="5.1.11.15" /> 5.1.11.15 | Number of enabled Backup tasks for all databases                   |
| <a id="5.1.11.16" /> 5.1.11.16 | Number of active Backup tasks for all databases                    |
| <a id="5.1.11.17" /> 5.1.11.17 | Number of enabled Subscription tasks for all databases             |
| <a id="5.1.11.18" /> 5.1.11.18 | Number of active Subscription tasks for all databases              |
| <a id="5.1.11.19" /> 5.1.11.19 | Number of enabled Pull Replication As Sink tasks for all databases |
| <a id="5.1.11.20" /> 5.1.11.20 | Number of active Pull Replication As Sink tasks for all databases  |

{PANEL/}

## Related Articles

### Monitoring

- [Setup Zabbix monitoring](../../../server/administration/snmp/setup-zabbix)

### Configuration

- [Configuration overview](../../../server/configuration/configuration-options)
- [Monitoring Options](../../../server/configuration/monitoring-configuration)
