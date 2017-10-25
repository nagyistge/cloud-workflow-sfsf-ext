# Enable Mockservices for SAP SuccessFactors New Hire Onboarding Extension Workflow
This sample project contains the source code for a 'mock' service which you can deploy in your SAP Cloud Platform tenant as a Java Application and consume the same from the SAP Cloud Platform Workflow's Service Tasks. 

You would need this only if you 
1. Do not have a SAP SuccessFactors tenant and S/4HANA procurement and
2. Want to experience SAP CP Workflow service and
3. Do not intend for productive usage.

This section will help you to build the service using the provided source code and finally deploy it to SAP Cloud Platform.

### **Downloads**
Get a copy of the folder, subfolders & files of onboarding -> MockService. You can optionally remove README.md file from your local directory.

### **Build and Deploy Mock Service**

#### **Create a Maven Project**

If you are new to building Java projects with Maven, then refer to some articles in the web like [this](https://spring.io/guides/gs/maven/) before proceeding any further. 

1. In the Eclipse JAVA EE IDE (for example, Eclipse 4.6.1 Neon) right-click on empty workspace and choose Import -> Import -> Maven -> Existing Maven Project.
2. Point it to the directory where you have downloaded the MockService source code.
3. Once the import is successful, perform a clean install of the maven project after updating the same.
4. A .war file should have been created in the 'target' folder.

#### **Deploy Mock Service into your SAP Cloud Platform Cockpit**
1. Login to your SAP Cloud Platform Cockpit subaccount.
2. Navigate to Applications -> Java Applications.
3. Click the Deploy Application button.
4. In the subsequent popup, use the Browse button to select the .war file from the target folder of your Maven project.
5. Leave the other values as the default ones and complete the import.
6. Once the import is successful, start the service.
7. The service should be started in approx 5 minutes. 

Refer to [help document](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/e5dfbc6cbb5710149279f67fb43d4e5d.html) for more information on how to deploy/update application.

#### **Access Mock Service**
1. Access the URL for the mock service by navigating into the java application in SAP Cloud Platform Cockpit. The URL should look like this if you are using the trial account: https://mockservice<userid>trial.hanatrial.ondemand.com/mockservice/
2. Click on the url and you should be in the landing page of the mockservice.
3. In the landing page you will have information on how to access the mockservice. For example, to access the service to GET employee details, the service URL would be https://mockservice<userid>trial.hanatrial.ondemand.com/mockservice/rest/empdetail/<employee_ID>. Replace the content within the <> and call it via a REST client to complete the test. Since this is a mock service you can give any values for the employeeID and the service will return a static output.
4. Similarly you can test the following services as well:

  **Get Details of new hire**
  *Path:* /rest/empdetail/{userId} 
  *Method:* GET

  **Get list of direct reports for the user's manager as probable buddies**
  *Path:* https://<mockServiceURL>/rest/directreports/{managerId} 
  *Method:* GET

  **Get list of equipment for the new hire**
  *Path:* https://<mockServiceURL>/rest/determineequipment 
  *Method:* POST 
  *Body:* JSON object for the employee details 
  
  **Order the equipment approved for the new hire**
  *Path:* https://<mockServiceURL>/rest/orderequipment
  *Method:* POST 
  *Body:* JSON object array of the approved equipment

### **Consume in SAP Cloud Platform Workflow**
#### Create HTTP Destination in SAP Cloud Platform

[To be done by an Administrator]
The mockservice is consumed via destinations in the service tasks. So, as a pre-requisite, create a destination in SAP Cloud Platform cockpit for the mockservice. Follow the [help document](https://help.sap.com/viewer/cca91383641e40ffbe03bdc78f00f681/Cloud/en-US/1e110da0ddd8453aaf5aed2485d84f25.html) to create a HTTP destination.

In the 'Destination URL', enter the URL for the mockservice including the path **'rest'** (https://mockservice<userid>trial.hanatrial.ondemand.com/mockservice**/rest**). You can use App2AppSSO for 'authentication'.

#### Consume the mock service in Service Tasks
Once the destination is available, you can change the workflow model's service task to consume them:
1. Get Employee Details from SuccessFactors

   *Destination:* The destination created for mockservice
<br>   *Path:* /empdetail/${context.userId}
<br>   *Method:* GET
<br>   *Response Variable:* ${context.empData}
   
2. Get Co-workers from SFSF
    *Destination:* The destination created for mockservice
<br>   *Path:* /directreports/${context.empData.EmpJob.managerId}
<br>   *Method:* GET
<br>   *Response Variable:* ${context.empData.team}

3. Determine Equipment
    *Destination:* The destination created for mockservice
<br>   *Path:* /determineequipment
<br>   *Method:* POST
<br>   *Path to XSRF token:* 
<br>   *Request Variable:* ${context.empData.Employee}
<br>   *Response Variable:* ${context.equipment}

4. Order Equipment
    *Destination:* The destination created for mockservice
<br>   *Path:* /orderequipment
<br>   *Method:* POST
<br>   *Path to XSRF token:* 
<br>   *Request Variable:* ${context.equipment.EquipmentsInfo}
<br>   *Response Variable:* ${context.order.status}

Save and deploy the workflow.

### **Known Issues**
No known issues at the moment

### **Credits**
The mockservice references the following third party open source or other free download components. The third party licensors of these components may provide additional license rights, terms and conditions 
and/or require certain notices as described below.

Json-simple (https://code.google.com/archive/p/json-simple)
Licensed under Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0

Spring Framework (https://projects.spring.io/spring-framework/)
Licensed under Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0 

API for SAP Cloud Platform (com.sap.cloud)
Licensed under Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0

### **License**
Copyright (c) 2017 SAP SE. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.