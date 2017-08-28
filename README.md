# SAP Cloud Platform Workflow Extension for SuccessFactors New Hire Onboarding
This sample project contains the SAPUI5 application used for the user tasks and a sample workflow which you can readily consume to extend the SuccessFactors new hire Onboarding scenario. This scenario is explained in detail in the following SCN Blogs:
[Extend SuccessFactors with SAP Cloud Platform Workflow - Part 1/2](https://blogs.sap.com/2017/08/19/extend-successfactors-with-sap-cloud-platform-workflow-part-12/)

[Extend SuccessFactors with SAP Cloud Platform Workflow - Part 2/2](https://blogs.sap.com/2017/08/22/extend-successfactors-with-sap-cloud-platform-workflow-part-22/)

## **Getting Started**
These instructions will get you the sample Onboarding extension workflow model up and running in your landscape. 
>Note that you might have to change the process model or the SAPUI5 source code to suit your need for productive usage.
### **Pre-Requisite**
 - You should have a SAP Cloud Platform Tenant with an active subscription to Workflow service.
 - You should have the administrator privileges to create destinations in SAP Cloud Platform. If not, you can ask your administrator to create the required destinations.
 - You should have developer privileges to create, deploy SAPUI5 applications in SAP Cloud Platform.
 - You should have completed the Workflow service configuration as mentioned [here](https://uacp2.hana.ondemand.com/viewer/aa302ee52d3a4420b6cc3ecaaeee2ee7/Cloud/en-US/3805ffa92af64eafb6ceff83716262ba.html).
 - You should have WorkflowDeveloper role assigned to create and deploy Workflow Model in SAP Cloud Platform.
 - You should have enabled WebIDE multi-cloud version in SAP Cloud Platform (refer to the [help document](https://help.sap.com/viewer/825270ffffe74d9f988a0f0066ad59f0/CF/en-US/51321a804b1a4935b0ab7255447f5f84.html), if needed).
 - You should have enabled Workflow Editor in WebIDE multi-cloud version as described in the [help document](https://uacp2.hana.ondemand.com/viewer/f63bbdc234ce4211ab2cdb44564a0acd/Cloud/en-US/07adfa6d819a42e9966e63de1a654de4.html).
 - You should have an active SuccessFactors subscription with a user who has privileges to call the OData API.
### **Assumption**
You have the same Identity Provider (IdP) for both SAP Cloud Platform and SuccessFactors tenants. If this is not the case, then please refer to footnote **Different IdP** [^differentIdP]
### **Downloads**
Download or checkout the following content from the git repository:
1. taskui -> export -> onboarding.zip
2. workflowmodel -> SFSFOnboardingWorkflow.zip

### **Deployment**

#### **Creating [Destinations](https://help.sap.com/viewer/cca91383641e40ffbe03bdc78f00f681/Cloud/en-US/60735ad11d8a488c83537cdcfb257135.html) in SAP Cloud Platform**
[To be done by an Administrator]
Before you import the downloaded .zip files, you have to create the destination for connecting to SuccessFactors from SAP Cloud Platform. Create a destination with name **SFSF** to connect to SuccessFactors as show in the image below. This destination will be used in the Workflow model.
	![SAP Cloud Platform Destination](https://raw.githubusercontent.com/sesh-r/Images/master/Destination.jpg)
	> Note: If you wish you change the destination name, make sure you change the destination name in the workflow model as well (Service Tasks)
#### **SAPUI5 Application**
1. Login to WebIDE multi-cloud version and import the onboarding.zip into the workspace.
2. Once the import is successful, deploy the SAPUI5 application to SAP Cloud Platform.
This SAPUI5 application contains three UI components which will be later used in the workflow model for the end users to approve or confirm their respective tasks.
> Note: The products list in the 'confirmEquip' component is based on the *products.json* file available under the *models* folder. In order to use the product list available from your procurement system, you need to modify the *Component.js* file.
#### **SAP Cloud Platform Business Rules**
Follow the document < link here> to setup the business rule to determine equipment.
> Note: This is an optional step to determine equipment using SAP Cloud Platform Business Rules.

#### **SAP Cloud Platform Workflow Model**
1. Login to WebIDE multi-cloud version and import the file *SFSFOnboardingWorkflow.zip* into the workspace.
2. Open the project and navigate to *SuccessFactorsOnboarding.workflow* under the *workflows* folder. 
3. Modify the *Order Equipment* service task so that it points to your procurement system destination and also pointing to the right service URL so that the equipment chosen is ordered.
4. If you choose not to have a business rule to determine equipment, then you can remove the service task *Determine Equipment*.
5. Right-click the *SuccessFactorsOnboarding.workflow* and choose *Deploy* -> *Deploy to SAP Cloud Platform Workflow*.

>Note that the *Order Equipment* service task needs to be modified for your procurement backend.

## **Running the Onboarding Extension Process**
### **Starting a workflow instance**
As explained in the [blog](https://blogs.sap.com/2017/08/19/extend-successfactors-with-sap-cloud-platform-workflow-part-12), the workflow should be started via Integration Center when the new hire is recruited. For experiencing the extension workflow, we can use the *Monitor Workflows* app to create workflow instance.

The procedure is explained in detail in the section *Managing Workflow Definitions* in the [help document](https://uacp2.hana.ondemand.com/viewer/aa302ee52d3a4420b6cc3ecaaeee2ee7/Cloud/en-US/e6163e119ba645d0ae6a31022b670381.html).

The initial context required by this workflow model is the user id of the new hire in SuccessFactors (userId). The workflowdefinitionId is displayed under property section in the workflow editor.
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
#### Confirm or Change Equipment - Task for Coworker
Once the workflow instance has been started and is running without errors, a task should be available for the co-workers of the new hire to confirm or change the equipment needed. The recipients of the task is also displayed in the Monitor Workflow App. 
> Note that the recipient of the this task is determined by getting all the employees who report to the manager of new hire. In case different IdP is used, then refer to the footnote **Different IdP**.
![enter image description here](https://github.com/sesh-r/Images/blob/master/Recipients.jpg?raw=true)

#### Approve Equipment - Task for Manager
Once the co-worker confirms the equipment, a task is created for the new hire's manager to approve or reject the proposed equipment. If the manager accepts the task then it moves forward. If the manager rejects the task, then the task goes back to the coworker (previous task) to update the equipment list.

![Approve Equipment](https://github.com/sesh-r/Images/blob/master/approveEquipment.jpg?raw=true)

#### Confirm Order Fulfilment
Once the manager approves the equipment needed, a service is called to place the order in the procurement system. Until a confirmation is received that the order is fulfilled, the workflow will be in a 'waiting' state as per the model definition. This is achieved by the Intermediate Message Event. Ideally this is triggered from your procurement system, but for experiencing the workflow you can manually trigger the same from a REST client (ex: Postman). 
1. Get the XSRF Token
2. Call the *Messages* API to trigger the order fulfilment.
> Note: You need to pass the workflow definition id, business key, intermediate message event id & any new context information like order id, delivery date, etc. In this sampe model, the following is the body:

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

#### Accept Workplace - Task for Coworker
This is the final task in the Onboarding extension process, where the coworker of the new hire will confirm that all the equipment requested are delivered and available.
![Accept Workplace](https://github.com/sesh-r/Images/blob/master/acceptWorkplace.jpg?raw=true)

## **Known Issues**
No known issue at the moment
## **How to obtain support**
Please use the GitHub bug tracking system to ask questions or report bugs.
## **License**
Copyright (c) 2017 SAP SE. All rights reserved.

[^differentIdP]:  **Different IdP:** If the SAP Cloud Platform and SuccessFactors use different Identity Providers for authentication, then the mapping between the users in SAP Cloud Platform and SuccessFactors needs to be performed for productive usages. For testing purposes, you could modify the *Recipients* property of the following user tasks in Workflow to a user in SAP Cloud Platform. 
1. Change or Confirm equipment.
2. Approve Equipment.
3. Accept Workplace for New Hire.
![Modify Recipients](https://github.com/sesh-r/Images/blob/master/modifyRecipients.jpg?raw=true)
> Note: If you need to add multiple recipients, then you can either add a authorization group or individual users seperated by comma (,).
