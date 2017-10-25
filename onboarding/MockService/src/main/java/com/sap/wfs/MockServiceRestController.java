/**
 * 
 */
package com.sap.wfs;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@RestController
@EnableWebMvc
public class MockServiceRestController {

	// Get Employee Details
	@SuppressWarnings("unchecked")
	@RequestMapping(method = RequestMethod.GET, value = "/empdetail/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> getEmployeeDetail(ModelMap model, @PathVariable("id") String id) {

		JSONObject empJsonObject = new JSONObject();
		JSONParser parser = new JSONParser();
		try {
			InputStream in = getClass().getResourceAsStream("/json/Employee.json");
			try (BufferedReader br = new BufferedReader(new InputStreamReader(in))) {
				String line;
				while ((line = br.readLine()) != null) {
					empJsonObject = (JSONObject) parser.parse(line);
				}
			}

			JSONObject userObj = (JSONObject) empJsonObject.get("User");
			userObj.put("userId", id);
			empJsonObject.put("User", userObj);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<String>(empJsonObject.toString(), HttpStatus.OK);
	}

	// Get direct reports of the manager to assign them as buddies
	@RequestMapping(method = RequestMethod.GET, value = "/directreports/{managerId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> getDirectReporters(ModelMap model, @PathVariable("managerId") String managerId) {
		JSONObject reporteesJsonObject = new JSONObject();
		JSONParser parser = new JSONParser();
		try {
			InputStream in = getClass().getResourceAsStream("/json/DirectReports.json");
			try (BufferedReader br = new BufferedReader(new InputStreamReader(in))) {
				String line;
				while ((line = br.readLine()) != null) {
					reporteesJsonObject = (JSONObject) parser.parse(line);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<String>(reporteesJsonObject.toString(), HttpStatus.OK);
	}

	// Determine equipments for the new hire
	@RequestMapping(method = RequestMethod.POST, value = "/determineequipment", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> determineEquipment(@RequestBody(required = true) String body) {

		JSONObject equipmentJsonObject = new JSONObject();
		JSONParser parser = new JSONParser();
		try {
			InputStream in = getClass().getResourceAsStream("/json/Equipment.json");
			try (BufferedReader br = new BufferedReader(new InputStreamReader(in))) {
				String line;
				while ((line = br.readLine()) != null) {
					equipmentJsonObject = (JSONObject) parser.parse(line);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<String>(equipmentJsonObject.toString(), HttpStatus.OK);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/orderequipment", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> orderEquipment(@RequestBody(required = true) String body) {
		JSONObject orderJsonObject = new JSONObject();
		JSONParser parser = new JSONParser();
		try {
			InputStream in = getClass().getResourceAsStream("/json/OrderStatus.json");
			try (BufferedReader br = new BufferedReader(new InputStreamReader(in))) {
				String line;
				while ((line = br.readLine()) != null) {
					orderJsonObject = (JSONObject) parser.parse(line);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<String>(orderJsonObject.toString(), HttpStatus.OK);
	}

}
