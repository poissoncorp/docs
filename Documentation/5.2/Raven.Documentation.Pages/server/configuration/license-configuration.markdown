# Configuration: License Options

{PANEL:License}

* When using this configuration key in _settings.json_ embed the license key as a **string**, e.g.:  
  `"License": "{ paste your license key including curly brackets here }"`.  

* When using this configuration key as an [environment variable](../../server/configuration/configuration-options#environment-variables) embed the JSON license key **object**.  

* If `License` is specified, it overrides the `License.Path` configuration.  
 
---

- **Type**: `string`
- **Default**: `null`
- **Scope**: Server-wide only

{PANEL/}

{PANEL:License.Path}

Save the license key to a `license.json` file.  
Provide the path to this file in the 'License.Path' configuration key:

  * Either the **full** path to the license file, e.g.:  
    `"License.Path": "D:\\RavenDB\\Server\\license.json"`  

  * Or, a **relative** path to the license file from the Server folder, e.g.:  
    `"License.Path": "License\\license.json"`  
    (where 'License' folder is under the 'Server' folder)

---

- **Type**: `string`
- **Default**: `license.json`
- **Scope**: Server-wide only

{PANEL/}

{PANEL:License.Eula.Accepted}

Indicates if End-User License Agreement was accepted.

- **Type**: `bool`
- **Default**: `false`
- **Scope**: Server-wide only

{PANEL/}

{PANEL:License.CanActivate}

EXPERT ONLY.  
Indicates if license can be activated.  

- **Type**: `bool`
- **Default**: `true`
- **Scope**: Server-wide only

{PANEL/}

{PANEL:License.CanForceUpdate}

EXPERT ONLY.  
Indicates if license can be updated from the License Server (api.ravendb.net).

- **Type**: `bool`
- **Default**: `true`
- **Scope**: Server-wide only

{PANEL/}

{PANEL:License.CanRenewLicense / License.CanRenew}

EXPERT ONLY.  
Indicates if license can be renewed from the License Server (api.ravendb.net).  
Relevant only for Developer and Community licenses.

- **Type**: `bool`
- **Default**: `true`
- **Scope**: Server-wide only

{PANEL/}

{PANEL:License.SkipLeasingErrorsLogging}

EXPERT ONLY.  
Skip logging of lease license errors.

- **Type**: `bool`
- **Default**: `false`
- **Scope**: Server-wide only

{PANEL/}

{PANEL:License.DisableAutoUpdate}

EXPERT ONLY.  
Disable all updates of the license, from string, from path and from the License Server (api.ravendb.net). 

- **Type**: `bool`
- **Default**: `false`
- **Scope**: Server-wide only

{PANEL/}

{PANEL:License.DisableAutoUpdateFromApi}

EXPERT ONLY.  
Disable automatic updates of the license from the License Server (api.ravendb.net).  
Can still update the license by either:  

* Setting the [License](../../server/configuration/license-configuration#license) configuration
* Setting the [License.Path](../../server/configuration/license-configuration#license.path) configuration
* Replacing the _license.json_ file on disk

---

- **Type**: `bool`
- **Default**: `false`
- **Scope**: Server-wide only

{PANEL/}

{PANEL:License.DisableLicenseSupportCheck}

EXPERT ONLY.  
Disable checking the license support options from the License Server (api.ravendb.net).

- **Type**: `bool`
- **Default**: `false`
- **Scope**: Server-wide only

{PANEL/}

