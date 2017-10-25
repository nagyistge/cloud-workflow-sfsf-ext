var EquipmentInfo = $.context.equipment.EquipmentInfo;

var EquipInfo = [];

if (EquipmentInfo.length >= 0 ) {
	for (var i = 0; i < EquipmentInfo.length; i++) {
		var equip = EquipmentInfo[i];
		equip.Status = "New";
		equip.ExpectedDate = "";
		equip.RequestedLoc = "Building 01";
		EquipInfo.push(equip);
	}
} else {
	var equip = EquipmentInfo;
	equip.Status = "New";
	equip.ExpectedDate = "";
	equip.RequestedLoc = "Building 01";
	EquipInfo.push(equip);
}

$.context.equipment.EquipmentsInfo = [];
$.context.equipment.EquipmentsInfo = EquipInfo;