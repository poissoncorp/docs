﻿# Licensing Overview
---

{NOTE: }

* RavenDB is activated using a JSON format license key.  
  The key is sent to the email address provided while obtaining the license.  

* A few license types are available.  
  The license type you acquire and activate RavenDB with, determines the database's feature set.  
   * Learn more below about each license type.  
   * visit the [pricing page](https://ravendb.net/buy) to see the entire feature set 
     made available by each type.  
 
* Each license has a specific expiration date.  
  To renew your license see [renew license](../../start/licensing/renew-license).  

* In this page:
    * [License types](../../start/licensing/licensing-overview#license-types)
        * [Developer](../../start/licensing/licensing-overview#developer)
        * [Community](../../start/licensing/licensing-overview#community)
        * [Professional](../../start/licensing/licensing-overview#professional)
        * [Enterprise](../../start/licensing/licensing-overview#enterprise)
        * [ISV Licenses](../../start/licensing/licensing-overview#isv-licenses)
    * [ISV Bank-of-Cores License](../../start/licensing/licensing-overview#isv-bank-of-cores-license)
    * [Manage license view](../../start/licensing/licensing-overview#manage-license-view)

{NOTE/}

---

{PANEL: License types}

{INFO: }
Visit the [pricing page](https://ravendb.net/buy) to see which features are included with each license type.
{INFO/}

---

### Developer

* The developer license is for development use only and isn't applicable for commercial use.  
  You must upgrade this license before going into production.   
* It is fully featured but temporary - license lasts 6 months and can be renewed.  
* Certificates exceeding 4 months expiration period are Not allowed to be used with this license.  
  Automatic renewal of Let’s Encrypt certificates is disabled.  
* When you are ready to go into production:  
   * Be sure to choose a license that has all features with which your client was developed.  
   * [Upgrade to a production license](https://ravendb.net/buy) and then [replace](../../start/licensing/replace-license) the developer license.  
* The developer license can be obtained [here](https://ravendb.net/buy#developer).

---

### Community

* A basic production-grade license.
* Community licenses last one year and can be renewed every year.  
* Servers using a Community license are **required to run the latest major version**.  
  E.g., if RavenDB `7.0` is released and your server runs RavenDB `6.2` with a Community license, 
  you will be required to upgrade RavenDB to version `7.0`.  
  Running RavenDB of an older version than the latest with a Community license will **block your 
  server's access to Studio**.  
  {NOTE: Grace Period}
  If you run your server with a Community license and a new RavenDB major version is released, 
  Studio will continue to function for **14 days** before it is blocked.  
  During this period, a pop-up notification will show when Studio is started:  
  ![Grace period](images/grace-period.png "Grace period")
  You can: 
  
   * **Close the notification and keep on working**  
     For 14 days, after which Studio will be blocked until the server is upgraded or the license replaced.  
   * **Replace your license**  
     Acquire a non community license that allows you to use an older version.  
   * **Download a new server version**  
     Upgrade to the latest major version.  
  
  {NOTE/}

---

### Professional

* A standard production-grade license.  
* Extended automatically if the server has access to RavenDB's License Server.  

---

### Enterprise

* A high-performance, fully-featured production-grade license.  
* Extended automatically if the server has access to RavenDB's License Server.  

---

### ISV Licenses

* ISV licenses are commercial licenses that allow you to redistribute RavenDB with your software  
  for on-premise installation and use by your customers.  
* Available ISV license types are: Essential, Professional, and Enterprise.  
* [Contact RavenDB for more details](https://ravendb.net/contact).

{PANEL/}

{PANEL: ISV Bank-of-Cores License}

An ISV Bank-of-Cores license allows you to generate RavenDB licenses on your own for a given number of cores.  
If you purchase a 128-cores license for example, you can use it to generate 8 licenses for 8-core machines, 
16 licenses for 4-core machines, or any other combination that suits your needs.  

* Available bank-of-cores license types are: Essential, Professional, and Enterprise.  
* [Contact RavenDB for more details](https://ravendb.net/contact).  

{CONTENT-FRAME: Generating bank-of-cores licenses}

* When you purchase a bank-of-cores license, you are given a login key.  
  To generate licenses, enter your key at: [https://licenses.ravendb.net/isv](https://licenses.ravendb.net/isv)  
  
     ![License generation login page](images/bank-of-cores_login-key.png "License generation login page")

* You will be requested to provide an email address associated with your license key.  
  Authorizing license generation through your email provides an additional security layer.  
  You can contact RavenDB's support to associate your key with additional addresses or with 
  all addresses of a given domain.  

     ![License generation login page](images/bank-of-cores_login-email.png "License generation login page")

* An email message with a sign-in link will be sent to the provided email address.  
  Use this link to enter the bank of cores management page.  

     ![License generation management page](images/bank-of-cores_manage-main.png "License generation management page")

     1. **Main License**  
        The details of your bank-of-cores license.  
     2. **Features**  
        The features that are available for the licenses you generate here.  
     3. **Generate new sublicense**  
        Use this section to assign cores to a new sublicense.  
        ![Generate license](images/bank-of-cores_generate-license.png "Generate license")  
          * _Cores count_ - The number of cores you want to assign this sublicense.  
          * _Sublicense tag_ - A tag you want to recognize the sublicense by.  
          * _Customer name_ - The identity of the sublicense's owner.  
          * _Expiration date_ - The date in which this sublicense will expire and its cores will be returned to your bank.  
            **Note**: Leavine this field empty will set the expiration date to that of the main license.  
          * _Generate_ - Click to generate the new sublicense.  

* Generating a sublicense will create a key that you can copy or download and register RavenDB with.  

     ![New sublicense key](images/bank-of-cores_sublicense-key.png "New sublicense key")

* The new sublicense will then be listed in the sublicenses list at the bottom of the page.  

     ![Sublicenses list](images/bank-of-cores_sublicenses-list.png "Sublicenses list")

{CONTENT-FRAME/}

{PANEL/}

{PANEL: Manage license view}

![About page](images/about-page.png "About page")

1. **About**  
    * Click to open the About page and view RavenDB version, license, support info, and more.  

2. **Version**  
    * **Current version**  
      Specifies the current Server and Studio versions.  
      Knowing the version may be important because some features are version-specific.  
    * **Send Feedback**  
      You can send RavenDB feedback about any issue you encounter.  
    * **Version Number**  
      Specifies whether you are using the latest Server version.  
      To upgrade to a newer version, see [upgrading instructions](../../start/installation/upgrading-to-new-version).  

3. **License Information**  
    * **Type**  
      Current license type  
    * **Expires**  
      License expiration date.  
    * **Available features**  
      A list of features included with this license  
    * **License Server**  
      Notifies if there is an active connection to RavenDB's License Server.  
      Connectivity issues are often caused by a firewall 
      blocking the connection, or the server running offline.  
       * Make sure that RavenDB has access to `api.ravendb.net`.  
       * Click the refresh button to check the connection.  

            ![License server connection](images/license-server.png "License server connection")

4. **Scroll**  
   Drag the scroll bar to view all the available features.  

5. **Support plan**  
    * Specifies the support options available under your current support plan.  

6. **Available actions**  
    * [Replace License](../../start/licensing/replace-license) / [Force Update](../../start/licensing/force-update) / [Renew License](../../start/licensing/renew-license)  

7. **Links**  
    * **Access**  
      Click to select RavenDB Community Discussions in GitHub, or Google Groups archive.  
    * **See support options**  
      Click to visit the RavenDB support options page.  

{PANEL/}

## Related Articles

### Licensing
- [Activate license](../../start/licensing/activate-license)
- [Replace license](../../start/licensing/replace-license)
- [Renew license](../../start/licensing/renew-license)
- [Force update license](../../start/licensing/force-update)

### Server
- [License configuration options](../../server/configuration/license-configuration)

## Related Links
- [Get License](https://ravendb.net/buy)
- [Support Options](https://ravendb.net/support)

