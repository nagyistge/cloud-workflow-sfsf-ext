<html>
<body>
	<h2>Welcome to the home page of mock services available for SAP
		Cloud Platform Workflow</h2>
	<br />
	<h3>The following mock services are available:</h3>
	<ul>
		<li>Get Details of new hire</li> Path: /rest/empdetail/{userId}
		<br /> Method: GET
		<br />
		<br />
		<li>Get list of direct reports for the user's manager as probable
			buddies</li> Path: /rest/directreports/{managerId}
		<br /> Method: GET
		<br />
		<br />
		<li>Get list of equipment for the new hire</li> Path:
		/rest/determineequipment
		<br /> Method: POST Body: JSON object for the employee details
		<br />
		<br />
		<li>Order the equipment approved for the new hire</li> Path:
		/rest/orderequipment
		<br /> Method: POST
		<br /> Body: JSON object array of the approved equipment
		<br />
		<br />
	</ul>
</body>
</html>