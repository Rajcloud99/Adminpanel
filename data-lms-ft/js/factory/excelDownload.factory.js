materialAdmin.factory('excelDownload', [function () {

	return {
		html: htmlFn
	};

	function htmlFn(id, sheetName, fileName){
		let excelString = excelExport(id).parseToXLS(sheetName).getRawXLS();
		let excelBlob = new Blob([excelString], {
			type: 'text/plain'
		});
		saveAs(excelBlob, fileName + '.xls');
	}

}]);
