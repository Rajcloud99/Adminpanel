materialAdmin
	.service('jaTableService', jaTableService);

jaTableService.$inject = [];

function jaTableService() {

	this.validateColumnSetting = function (oColSetting) {

		if(typeof oColSetting.allowedColumn === 'undefined' || oColSetting.allowedColumn.length === 0)
			throw 'JA Table-directive: Table Error: Invalid Column Setting';

		if(typeof oColSetting.visibleColumn === 'undefined' || oColSetting.visibleColumn.length === 0){
			oColSetting.visibleColumn  = angular.copy(oColSetting.allowedColumn);
		}

		return oColSetting;
	};

	this.sortVisibleColumn = function (oColSetting) {

		oColSetting.visibleColumn = oColSetting.allowedColumn.filter(objAllowed => {
			if(oColSetting.visibleColumn.indexOf(objAllowed) !== -1)
				return true;
			else
				return false;
		});
	};

}
