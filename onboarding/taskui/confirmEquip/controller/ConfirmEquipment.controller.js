sap.ui.define(["sap/m/MessageToast",
	"sap/ui/core/mvc/Controller"
], function(MessageToast, Controller) {
	"use strict";

	return Controller.extend("com.sap.cloud.workflow.samples.onbequip.controller.ConfirmEquipment", {
		
		onAddEquipment: function(oEvent) {
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment("com.sap.cloud.workflow.samples.onbequip.view.NewEquipment", this);
				this.getView().addDependent(this.oDialog);
			}

			// toggle compact style for the dialog
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.oDialog);

			var oModel = oEvent.getSource().getModel();
			var data = oModel.getData();

			if (data.context.newEquipment.EquipmentType === "") {
				data.context.newEquipment.EquipmentType = data.context.products.equipmentTypes[0].text;
				data.context.newEquipment.ProdDesc = data.context.products.equipmentForTypeNot[0].text;
				data.context.newEquipment.RequestedLoc = data.context.products.deliveryLocations[0].text;
			}

			oModel.setData(data);
			this.oDialog.open();
		},
		onTypeSelChange: function(oevt) {
			var selItem = oevt.getParameters().selectedItem.getText();
			var data = oevt.getSource().getModel().getData();

			data.context.newEquipment.EquipmentType = selItem;

			if (selItem === "Notebook") {
				data.context.products.equipmentForType = data.context.products.equipmentForTypeNot;
				data.context.newEquipment.ProdDesc = data.context.products.equipmentForTypeNot[0].text;
			} else if (selItem === "Cables and Accessories") {
				data.context.products.equipmentForType = data.context.products.equipmentForTypeCbl;
				data.context.newEquipment.ProdDesc = data.context.products.equipmentForTypeCbl[0].text;
			} else if (selItem === "Monitor") {
				data.context.products.equipmentForType = data.context.products.equipmentForTypeMon;
				data.context.newEquipment.ProdDesc = data.context.products.equipmentForTypeMon[0].text;
			} else if (selItem === "Audio and Video") {
				data.context.products.equipmentForType = data.context.products.equipmentForTypeAaV;
				data.context.newEquipment.ProdDesc = data.context.products.equipmentForTypeAaV[0].text;
			} else if (selItem === "Smartphone") {
				data.context.products.equipmentForType = data.context.products.equipmentForTypeMob;
				data.context.newEquipment.ProdDesc = data.context.products.equipmentForTypeMob[0].text;
			} else {
				data.context.products.equipmentForType = data.context.products.equipmentForTypeOth;
				data.context.newEquipment.ProdDesc = data.context.products.equipmentForTypeOth[0].text;
			}

			data.context.newEquipment.EquipmentType = selItem;
			oevt.getSource().getModel().setData(data);
		},
		onLocSelChange: function(oevt) {
			var data = oevt.getSource().getModel().getData();
			data.context.newEquipment.RequestedLoc = oevt.getParameters().selectedItem.getText();
		},
		onEquipSelChange: function(oevt) {
			var data = oevt.getSource().getModel().getData();
			data.context.newEquipment.ProdDesc = oevt.getParameters().selectedItem.getText();
		},
		onCancelEquipment: function(oEvt) {
			this.oDialog.close();
		},
		deleteRow: function(oEvt) {
			var path = oEvt.getParameter('listItem').getBindingContext().getPath();
			// radix paramter to parseint into decimal and not octal :)
			var indexToRemove = parseInt(path.substring(path.lastIndexOf('/') + 1), 10);
			var oModel = oEvt.getSource().getModel();
			var data = oModel.getData();
			data.context.equipment.EquipmentsInfo.splice(indexToRemove, 1);
			oModel.setData(data);

			MessageToast.show("Item Removed");
		},
		onSaveEquipment: function(oEvent) {
			var oModel = oEvent.getSource().getModel();
			var data = oModel.getData();

			var ProdDesc = data.context.newEquipment.ProdDesc;
			var RequestedLoc = data.context.newEquipment.RequestedLoc;
			var EquipmentType;
			var Price;
			var Currency = data.context.newEquipment.Currency;
			var ProductID;
			var equipList = data.context.products.equipmentList;

			for (var i in equipList) {
				if (equipList[i].ProdDesc === ProdDesc) {
					EquipmentType = equipList[i].EquipmentType;
					Price = equipList[i].Price;
					ProductID = equipList[i].ProductID;
				}
			}
			var newItem = {
				Status: "New",
				RequestedLoc: RequestedLoc,
				Price: Price,
				ProdDesc: ProdDesc,
				Currency: Currency,
				ProductID: ProductID,
				EquipmentType: EquipmentType,
				ExpectedDate:""
			};

			if (typeof(data.context.equipment.EquipmentsInfo) === "undefined") {
				data.context.equipment.EquipmentsInfo = [];
			}
			data.context.equipment.EquipmentsInfo.push(newItem);
			oModel.setData(data);
			oModel.refresh(true);
			this.oDialog.close();
		}

	});
});




