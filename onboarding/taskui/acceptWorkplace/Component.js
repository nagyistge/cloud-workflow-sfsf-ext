sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/cloud/workflow/samples/onbaccept/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.sap.cloud.workflow.samples.onbaccept.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			// get task data
			var startupParameters = this.getComponentData().startupParameters;
			var taskModel = startupParameters.taskModel;
			var taskData = taskModel.getData();
			var taskId = taskData.InstanceID;
			
			// read process context & bind it to the view's model 
			var that = this;
			var jsonModel = new sap.ui.model.json.JSONModel();
			
			$.ajax({
				url:"/bpmworkflowruntime/rest/v1/task-instances/"+taskId+"/context",
				method: "GET",
				contentType: "application/json",
				dataType: "json",
				success: function(result, xhr, data) {
					// Get the process context
					var processContext = new sap.ui.model.json.JSONModel();
					processContext.context = data.responseJSON;
					
					// Get task related data to be set in ObjectHeader
					processContext.context.task = {};
					processContext.context.task.Title = taskData.TaskTitle;
					processContext.context.task.Priority = taskData.Priority;
					processContext.context.task.Status = taskData.Status;

					if (taskData.Priority === "HIGH") {
						processContext.context.task.PriorityState = "Warning";
					} else if (taskData.Priority === "VERY HIGH") {
						processContext.context.task.PriorityState = "Error";
					} else {
						processContext.context.task.PriorityState = "Success";
					}

					processContext.context.task.CreatedOn = taskData.CreatedOn.toDateString();
					
					// get task description and add it to the UI model
					startupParameters.inboxAPI.getDescription("NA", taskData.InstanceID).done(function(dataDescr){
						processContext.context.task.Description = dataDescr.Description;
    					jsonModel.setProperty("/context/task/Description", dataDescr.Description);
			    	}).
			    	fail(function(errorText){
			    		jQuery.sap.require("sap.m.MessageBox");
			    		sap.m.MessageBox.error(errorText, { title: "Error"}); 
			    	});
					
					jsonModel.setData(processContext);
					that.setModel(jsonModel);
				}
			});
			
			// Implementation for the confirm action
			var oPositiveAction = {
				sBtnTxt: "Accept Workplace",
				onBtnPressed: function(e) {
					var model = that.getModel();
					model.refresh(true);
					// Call a local method to perform further action
					that._triggerComplete(that.oComponentData.inboxHandle.attachmentHandle.detailModel.getData().InstanceID, true,
						jQuery.proxy(
							// on successful competion, call a local method to refresh the task list in My Inbox
							that._refreshTask, that));
				}
			};
			
			// Add 'Confirm' action to the task
			startupParameters.inboxAPI.addAction({
				// confirm is a positive action
				action: oPositiveAction.sBtnTxt,
				label: oPositiveAction.sBtnTxt,
				type: "Accept"
				// Set the onClick function
			}, oPositiveAction.onBtnPressed);

		},
		
		// This method is called when the confirm button is click by the end user
		_triggerComplete: function(taskId, approvalStatus, refreshTask) {
			$.ajax({
				// Call workflow API to get the xsrf token
				url: "/bpmworkflowruntime/rest/v1/xsrf-token",
				method: "GET",
				headers: {
					"X-CSRF-Token": "Fetch"
				},
				success: function(result, xhr, data) {
					// After retrieving the xsrf token successfully
					var token = data.getResponseHeader("X-CSRF-Token");
					var dataText;
					// form the context that will be updated - approval status and the equipment list
					dataText = "{ \"status\":\"COMPLETED\",\"context\": {\"workplaceConfirmed\": \"" + approvalStatus + "\" }}";
					
					$.ajax({
						// Call workflow API to complete the task
						url:"/bpmworkflowruntime/rest/v1/task-instances/"+taskId,
						method: "PATCH",
						contentType: "application/json",
						// pass the updated context to the API
						data: dataText,
						headers: {
							// pass the xsrf token retrieved earlier
							"X-CSRF-Token": token
						},
						// refreshTask needs to be called on successful completion 
						success: refreshTask
					});
				}
			});
		},
		
		// Request Inbox to refresh the control once the task is completed
		_refreshTask: function() {
			var taskId = this.getComponentData().startupParameters.taskModel.getData().InstanceID;
    		this.getComponentData().startupParameters.inboxAPI.updateTask("NA", taskId);
		}

	});

});






