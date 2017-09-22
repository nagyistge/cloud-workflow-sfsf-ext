# SAP Cloud Platform Workflow Extension for SAP SuccessFactors New Hire Onboarding
This sample project contains the SAPUI5 application used for the user tasks and a workflow model which you can use to readily extend the SAP SuccessFactors new hire Onboarding scenario. This scenario is explained in detail in the following SCN Blogs:

![Workflow Model](https://github.com/SAP/cloud-workflow-sfsf-ext/blob/master/onboarding/images/workflow.jpg?raw=true)

[Extend SAP SuccessFactors with SAP Cloud Platform Workflow - Part 1/2](https://blogs.sap.com/2017/08/19/extend-successfactors-with-sap-cloud-platform-workflow-part-12/)

[Extend SAP SuccessFactors with SAP Cloud Platform Workflow - Part 2/2](https://blogs.sap.com/2017/08/22/extend-successfactors-with-sap-cloud-platform-workflow-part-22/)

## **Solution Diagram**
![Solution Diagram](https://github.com/SAP/cloud-workflow-sfsf-ext/blob/master/onboarding/images/onboardingSolutionDiagram.png?raw=true)

As soon as there is a New Hire event in the SAP SuccessFactors,
1. New hire event triggered. A buddy is assigned as part of the standard process.
2. This calls the configured SuccessFactors intelligent service which starts the custom extension realized by SAP Cloud Platform Workflow service.
3. Technically SAP Cloud Integration service takes care of the X-CSRF token and any needed context mapping. The SuccessFactors Intelligent service maps the context of new hire to the SAP Cloud service then triggers SAP Cloud Platform Workflow service.
4. SAP Cloud Platform Workflow service runtime makes a call to SAP SuccessFactors system to get the new employee details and a list of potential buddies from the team he will join hire and his buddy data.
5. SAP Cloud Platform Workflow service sends details of the new hire (company location, role etc…) to SAP Cloud Platform Business Rules service to get back the equipment list for this new hire.
6. Buddy logs onto the Fiori launchpad to access his tasks in the My Inbox application.
7. He sees he has a new task in his inbox for him to process the equipment assignment for the new hire.
8. The buddy’s decision to confirm or change the equipment is submitted to the workflow to be further processed

## **Getting Started with Sample Workflow**
These instructions will get you the sample Onboarding extension workflow model up and running in your landscape.
>Note: This sample is provided as a starting point for your implementation and is provided without any warranty or support obligations.


### **Pre-Requisite**
 - You should have a SAP Cloud Platform Tenant (Neo) with an active subscription to Workflow service. Refer [here](https://blogs.sap.com/2017/07/14/getting-started-with-the-workflow-service-in-the-free-trial-account-12/) for information on getting a free trial account of SAP Cloud Platform and how to enable SAP Cloud Platform Workflow Service.
 - You should have active subscription to SAP Cloud Platform Business Rules Service (this service is bundled with the Workflow service, make sure it is enabled).
 - You should have the administrator roles to create destinations in SAP Cloud Platform. If not, you can ask your administrator to create the required destinations.
 - You should have Developer role to create, deploy SAPUI5 applications in SAP Cloud Platform.
 - You should have enabled SAP WebIDE multi-cloud version in SAP Cloud Platform (refer to the [help document](https://help.sap.com/viewer/825270ffffe74d9f988a0f0066ad59f0/CF/en-US/51321a804b1a4935b0ab7255447f5f84.html), if needed).
 - You should have completed the Workflow service configuration as mentioned [here](https://uacp2.hana.ondemand.com/viewer/aa302ee52d3a4420b6cc3ecaaeee2ee7/Cloud/en-US/3805ffa92af64eafb6ceff83716262ba.html).
 - You should have WorkflowDeveloper role assigned to create and deploy Workflow Model in SAP Cloud Platform.
 - You should have enabled Workflow Feature in SAP WebIDE multi-cloud version as described in the [help document](https://uacp2.hana.ondemand.com/viewer/f63bbdc234ce4211ab2cdb44564a0acd/Cloud/en-US/07adfa6d819a42e9966e63de1a654de4.html).
 - You should have an active SAP SuccessFactors subscription with a user who has privileges to call the OData API.

### **Downloads**
Download or clone the following content from the git repository:
1. onboarding -> taskui -> target -> onboarding.zip
2. onboarding -> workflowmodel -> SFSFOnboardingWorkflow.zip

### **Deployment**

#### **Creating Destinations in SAP Cloud Platform**
[To be done by an Administrator]

Before you import the downloaded .zip files, you have to create the destination for connecting to SAP SuccessFactors from SAP Cloud Platform. Create a destination with name **SFSF** to connect to SAP SuccessFactors as shown in the image below. This destination will be used in the Workflow model.

![SAP Cloud Platform Destination](https://github.com/SAP/cloud-workflow-sfsf-ext/blob/master/onboarding/images/Destination.jpg)
	
> Note: If you wish to change the destination name, make sure you change the destination name in the workflow model as well (two service tasks to get employee & co-worker details)
	
#### **SAPUI5 Application**
1. Login to SAP WebIDE Full-Stack and import the onboarding.zip into the workspace (refer to [help document](https://help.hana.ondemand.com/webide/frameset.htm?344e8c91e33b4ae8b4032709c45776a3.html) on how to do this).
2. Once the import is successful, deploy the SAPUI5 application to SAP Cloud Platform.
This SAPUI5 application contains three UI components which will be later used in the workflow model for the end users to approve or confirm their respective tasks.

> Note: The products list in the 'confirmEquip' component is based on the *products.json* file available under the *models* folder. In order to use the product list available from your procurement system, you need to modify the *Component.js* of *confirmEquip*.

#### **SAP Cloud Platform Business Rules**
Follow [the document](https://github.com/SAP/cloud-workflow-sfsf-ext/blob/master/onboarding/businessrule/ModelBusinessRules.docx?raw=true) to setup the business rule to determine equipment.
> Note: This is an optional step to determine equipment using SAP Cloud Platform Business Rules.

#### **SAP Cloud Platform Workflow Model**
1. Login to WebIDE multi-cloud version and import the file *SFSFOnboardingWorkflow.zip* into the workspace.
2. Open the project and navigate to *SuccessFactorsOnboarding.workflow* under the *workflows* folder. 
3. Modify the *Order Equipment* service task so that it points to the right service in your procurement system to order the equipment chosen.
4. After saving the workflow, right-click the *SuccessFactorsOnboarding.workflow* and choose *Deploy* -> *Deploy to SAP Cloud Platform Workflow*.

> Note: If you do not have any procurement API to work with, for experiencing workflows, you can remove the *Order Equipment* service task and proceed.

**Different IdP:** Since the co-workers userId is as available in SAP SuccessFactors, assigning them to the recipient of the approval task will make no sense if the same user id is not available in SAP Cloud Platform. So, if the SAP Cloud Platform and SAP SuccessFactors use different Identity Providers for authentication, then the mapping between the users in SAP Cloud Platform and SAP SuccessFactors needs to be performed for productive usages. For testing purposes, you could modify the *Recipients* property of the following user tasks in Workflow to a user in SAP Cloud Platform. 
1. Change or Confirm equipment.
2. Approve Equipment.
3. Accept Workplace for New Hire.

![Modify Recipients](https://github.com/SAP/cloud-workflow-sfsf-ext/blob/master/onboarding/images/modifyRecipients.jpg?raw=true)


> Note: If you need to add multiple recipients, then you can either add a authorization group or individual users separated by comma (,).

## **Running the Onboarding Extension Process**
### **Starting a workflow instance**
As explained in the [blog](https://blogs.sap.com/2017/08/19/extend-successfactors-with-sap-cloud-platform-workflow-part-12), the workflow should be started via Integration Center when the new hire is recruited. For experiencing the extension workflow, we can use the *Monitor Workflows* app to create workflow instance.

The procedure is explained in detail in the section *Managing Workflow Definitions* in the [help document](https://uacp2.hana.ondemand.com/viewer/aa302ee52d3a4420b6cc3ecaaeee2ee7/Cloud/en-US/e6163e119ba645d0ae6a31022b670381.html).

The initial context required by this workflow model is the user id of the new hire in SAP SuccessFactors (userId). The workflowdefinitionId is displayed under property section in the workflow editor.
#### Sample Payload 

    {
		"definitionId":"successfactorsonboarding",
		"context":{
			"userId":"103161"
		}
	}

### **Monitoring the workflow instance**
Once the workflow instance was created successfully, administrators can monitor the progress of the workflow for technical errors in the *Monitor Workflows* App. Refer to the section *Managing Workflow Instances* in the following [help document](https://uacp2.hana.ondemand.com/viewer/aa302ee52d3a4420b6cc3ecaaeee2ee7/Cloud/en-US/e6163e119ba645d0ae6a31022b670381.html).  

### **Working with the approval tasks**
#### Confirm or Change Equipment - Task for Co-worker
Once the workflow instance has been started and is running without errors, a task should be available for the co-workers of the new hire to confirm or change the equipment needed. The recipients of the task are also displayed in the Monitor Workflow App. 

> Note that the recipient of this task is determined by getting all the employees who report to the manager of new hire. In case different IdP is used, then refer to the footnote **Different IdP**.

![enter image description here](https://github.com/SAP/cloud-workflow-sfsf-ext/blob/master/onboarding/images/Recipients.jpg?raw=true)

#### Approve Equipment - Task for Manager
Once the co-worker confirms the equipment, a task is created for the new hire's manager to approve or reject the proposed equipment. If the manager accepts the task then it moves forward. If the manager rejects the task, then the task goes back to the co-worker (previous task) to update the equipment list.

![Approve Equipment](https://github.com/SAP/cloud-workflow-sfsf-ext/blob/master/onboarding/images/approveEquipment.jpg?raw=true)

#### Confirm Order Fulfilment
Once the manager approves the equipment needed, a service is called to place the order in the procurement system. Until a confirmation is received that the order is fulfilled, the workflow will be in a 'waiting' state as per the model definition. This is achieved by the Intermediate Message Event. Ideally this is triggered from your procurement system, but for experiencing the workflow you can manually trigger the same from a REST client (ex: Postman). 
1. Get the XSRF Token
2. Call the *Messages* API to trigger the order fulfilment.

> Note: You need to pass the workflow definition id, business key, intermediate message event id & any new context information like order id, delivery date, etc. For this process model, the following body needs to be used:

    {
		"definitionId":"OrderConfirmationmsg",
		"businessKey":"103161",
		"workflowDefinitionId":"successfactorsonboarding",
		"context":{
			"orderId":"87632",
			"deliveryDate": "20-Sep-2017"
		}
	}


Refer to the [API documentation](https://help.sap.com/doc/40db36d987084ab09e496381090e9a2e/Cloud/en-US/wfs-core-api-docu.html#api-Messages-v1MessagesPost) for further details.

#### Accept Workplace - Task for Co-worker
This is the final task in the Onboarding extension process, where the co-worker of the new hire will confirm that all the equipment requested are delivered and available.
![Accept Workplace](https://github.com/SAP/cloud-workflow-sfsf-ext/blob/master/onboarding/images/acceptWorkplace.jpg?raw=true)

## **Known Issues**
No known issues at the moment


## **License**
Copyright (c) 2017 SAP SE. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
