materialAdmin.controller('tdsReportController', function (
	accountingService,
	voucherService,
	lazyLoadFactory,
	DatePicker,
	growlService
){

    let vm = this;
	// object Identifiers
	vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	vm.aAccountMaster = []; // to contain account masters
	vm.oFilter = {}; // initialize filter object
	vm.maxDate = new Date();
	vm.month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	// functions Identifiers
	vm.getAccountMasters = getAccountMasters;
	vm.accountmaster = accountmaster;
	vm.downloadReport = downloadReport;
	vm.dateChange = dateChange;
	vm.billtobill= billtobill;
	vm.onReportChange = onReportChange;
	

	// INIT functions
	(function init() {
		vm.oFilter.to = new Date();
		vm.oFilter.from = new Date(new Date().setDate(new Date(vm.oFilter.to).getDate() - 90));
		vm.selectType = 'index';


	})();
	// Actual Functions

	function billtobill(){
    if(vm.reportType === 'TDS daywise'){

			vm.columnSetting ={

				allowedColumn:[
					'Accounts',
					'Date',
					'Opening Bal.',
					'Op. Dr/Cr',
					'Debit Amt',
					'Credit Amt',
					'Closing Bal.',
					'Cl Dr/Cr'
				]

			};

			vm.tableHead = [
				{
					'header': 'Accounts',
					'bindingKeys': 'account.ledger_name'
				},
				{
					'header': 'Date',
					'bindingKeys': 'date',
					date:'dd-MMM-yyyy'
				},
				{
					'header': 'Opening Bal.',
					'bindingKeys':  'this.ob == 0 ? "0" : (this.ob| abs)',
					'date':false
				},
				{
					'header': 'Op. Dr/Cr',
					'bindingKeys': 'this.ob < 0 ? "Cr" : "Dr"',
					'eval': true
				},
				{
					'header': 'Debit Amt',
					'bindingKeys':  'this.dr == 0 ? "0" : this.dr',
					'date':false
				},
				{
					'header': 'Credit Amt',
					'bindingKeys':  'this.cr == 0 ? "0" : this.cr',
					'date':false
				},
				{
					'header': 'Closing Bal.',
					'bindingKeys': 'cb |abs '
				},
				{    
					'header': 'Cl Dr/Cr',
					'bindingKeys': 'this.cb > 0 ? "Dr" : "Cr"',
					'eval': true
				}

			];
		}
		else if(vm.reportType === 'TDS group summary'){


			vm.columnSetting ={

				allowedColumn:[
					'Particulars',
					'Opening Balance',
					'Op. Dr/Cr',
					'Debit',
					'Credit',
					'Closing Balance',
					'Cl Dr/Cr'
				]

			};

			vm.tableHead = [

				{
					'header': 'Particulars',
					'bindingKeys':'account.ledger_name'
				},
				{
					'header': 'Opening Balance',
					'bindingKeys':'this.ob == 0 ? "0" : (this.ob |abs)',
					'date':false

				},
				{
					'header': 'Op. Dr/Cr',
					'bindingKeys': 'this.ob < 0 ? "Cr" : "Dr"',
					'eval': true
				},
				{
					'header':'Debit',
					'bindingKeys':  'this.dr == 0 ? "0" : this.dr',
					'date':false
					
				},
				{
					'header':'Credit',
					'bindingKeys':  'this.cr == 0 ? "0" : this.cr',
					'date':false
					
				},
				{
					'header':'Closing Balance',
					'bindingKeys': 'cb |abs'
				},
				{    
					'header': 'Cl Dr/Cr',
					'bindingKeys': 'this.cb > 0 ? "Dr" : "Cr"',
					'eval': true
				}

			];


		}


		else if(vm.reportType === 'Monthly TDS'){


			vm.columnSetting ={

				allowedColumn: [
					'Accounts',
					'Date',
					'Opening Bal.',
					'Op. Dr/Cr',
					'Debit Amt',
					'Credit Amt',
					'Closing Bal.',
					'Cl Dr/Cr'
				]

			};

			vm.tableHead = [
				{
					'header': 'Accounts',
					'bindingKeys': 'account.ledger_name'
				},
				{
					'header': 'Date',
					'bindingKeys': '_id.month',
					date:'dd-MMM-yyyy'
				},
				{
					'header': 'Opening Bal.',
					'bindingKeys':  'this.ob == 0 ? "0" : (this.ob| abs)',
					'date':false
				},
				{
					'header': 'Op. Dr/Cr',
					'bindingKeys': 'this.ob < 0 ? "Cr" : "Dr"',
					'eval': true
				},
				{
					'header': 'Debit Amt',
					'bindingKeys':  'this.dr == 0 ? "0" : this.dr',
					'date':false
				},
				{
					'header': 'Credit Amt',
					'bindingKeys':  'this.cr == 0 ? "0" : this.cr',
					'date':false
				},
				{
					'header': 'Closing Bal.',
					'bindingKeys': 'cb |abs '
				},
				{    
					'header': 'Cl Dr/Cr',
					'bindingKeys': 'this.cb > 0 ? "Dr" : "Cr"',
					'eval': true
				}

			];


		}
		}
		vm.lazyLoad = lazyLoadFactory(); // init lazyload

	function onReportChange() {
		vm.oFilter.account=undefined;
		vm.oFilter.type=undefined;
		vm.aAccountMaster=[];
		vm.summary=undefined;
		vm.billtobill();
	}

	// Get Account Masters from backend
	function getAccountMasters(isGetActive) {
		if(vm.reportType  =='TDS daywise' || vm.reportType=='Monthly TDS'){
			if (!(vm.oFilter.account )) {
				growlService.growl("Account is mandatory", "danger");
				return;
			}
		}else if(vm.reportType  =='TDS group summary'){
			if (!(vm.oFilter.type )) {
				growlService.growl("ledger group is mandatory", "danger");
				return;
			}
		}
		if(!vm.lazyLoad.update(isGetActive))
			return;

		var oFilter = prepareFilterObject(vm.oFilter);
		if(vm.reportType === 'TDS daywise') {
			voucherService.TdsDayWise(oFilter, onSuccess, onFailure);
		} else if (vm.reportType === 'TDS group summary') {
			voucherService.TdsGroupSummary(oFilter, onSuccess, onFailure);
		}else if (vm.reportType === 'Monthly TDS') {
			voucherService.TdsMonthly(oFilter, onSuccess, onFailure);
		}
		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', 'Message not defined', 'error');
		}

		// Handle success response
		function onSuccess(response) {
				vm.summary = response.summary;
        if (vm.reportType === 'Monthly TDS'){
			for (var i =0; i<= response.data.length-1; i++){
				response.data[i]._id.month = vm.month[response.data[i]._id.month-1]+"-"+response.data[i]._id.year;
			}}
			vm.lazyLoad.putArrInScope.call(vm, isGetActive, response);
			vm.tCr = response.tCr;
			vm.tDr = response.tDr;
			// vm.tableApi && vm.tableApi.refresh();
		}
	}

	function accountmaster(viewValue,type) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 15,
					group: ["Vendor TDS","TDS"],
					sort: {
						name: 1
					}
				};
				if(vm.reportType === 'TDS group summary'){ 
				req.isGroup = true;
				} else{
              	    req.isGroup = false;
				}
				accountingService.getAccountMaster(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function dateChange(dateType) {

		if (dateType === 'startDate' && vm.oFilter.to && vm.oFilter.from) {

			let isDate = vm.oFilter.to instanceof Date,
				monthRange = vm.oFilter.to.getMonth() - vm.oFilter.from.getMonth(),
				dateRange = vm.oFilter.to.getDate() - vm.oFilter.from.getDate(),
				isNotValid = false;
			monthRange += (vm.oFilter.to.getFullYear() -  vm.oFilter.from.getFullYear()) * 12;

			if(monthRange === 0)
				isNotValid = dateRange < 0;
			else if(monthRange === 1)
				isNotValid = monthRange < 0 ? true: false;
			else if(monthRange ===3 && (vm.oFilter.from.getDate() < vm.oFilter.to.getDate()))
				isNotValid = true;
			else if(monthRange === 2 || monthRange === 3)
				isNotValid = false;
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.oFilter.from);
				vm.oFilter.to = new Date(date.setMonth(date.getMonth() + 3));
			}

		} else if (dateType === 'endDate' && vm.oFilter.to && vm.oFilter.from) {

			let isDate = vm.oFilter.from instanceof Date,
				monthRange = vm.oFilter.to.getMonth() - vm.oFilter.from.getMonth(),
				dateRange = vm.oFilter.to.getDate() - vm.oFilter.from.getDate(),
				isNotValid = false;
			monthRange += (vm.oFilter.to.getFullYear() - vm.oFilter.from.getFullYear()) * 12;

			if(monthRange === 0)
				isNotValid = dateRange < 0;
			else if(monthRange === 1)
				isNotValid = monthRange < 0 ? true: false;
			else if(monthRange ===3 && (vm.oFilter.from.getDate() < vm.oFilter.to.getDate()))
				isNotValid = true;
			else if(monthRange === 2 || monthRange === 3)
				isNotValid = false;
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.oFilter.to);
				vm.oFilter.from = new Date(date.setMonth(date.getMonth() - 3));
			}
		}
	}

	function downloadReport() {

		if(!(vm.oFilter.from && vm.oFilter.to)){
			swal('warning', "Both From and To Date should be Filled",'warning');
			return;
		}
		if(!vm.lazyLoad.update(false))
			return;
		var oFilter = prepareFilterObject(vm.oFilter);
		if(vm.reportType){
			oFilter.download = true;
		}
		if (vm.reportType === 'Monthly TDS') {
			if(!oFilter.account)
				return swal('warning', "Account  is mandatory",'warning');
			voucherService.TdsMonthly(oFilter, successCallback, failureCallback);
		}else if (vm.reportType === 'TDS group summary') {
			if(!oFilter.type)
				return swal('warning', "ledger group is mandatory",'warning');
				voucherService.TdsGroupSummary(oFilter, successCallback, failureCallback);
		}else if (vm.reportType === 'TDS daywise') {
			if(!oFilter.account)
				return swal('warning', "Account  is mandatory",'warning');
				voucherService.TdsDayWise(oFilter, successCallback, failureCallback);
		}

		function failureCallback(err) {
			console.log(err);
			swal('Error!', 'Message not defined', 'error');
		}

		function successCallback(res) {
			if(res.url){
				var a = document.createElement('a');
				a.href = res.url;
				a.download = res.url;
				a.target = '_blank';
				a.click();
			}
			else{
				swal('error', 'No Data Found', 'warning');
			}
		}
	}

	function prepareFilterObject(oFilter) {
		var requestFilter = {};


		if (typeof oFilter.from !== 'undefined')
			requestFilter.from = moment(oFilter.from, 'DD/MM/YYYY').startOf('day').toISOString();

		if (typeof oFilter.to !== 'undefined')
			requestFilter.to = moment(oFilter.to, 'DD/MM/YYYY').endOf('day').toISOString();

		if (typeof oFilter.account !== 'undefined')
			requestFilter.account = oFilter.account._id;

		if (typeof oFilter.type !== 'undefined')
		requestFilter.type = oFilter.type._id;
      requestFilter.reportType = "Group Balance";
		requestFilter.skip = vm.lazyLoad.getCurrentPage();
		requestFilter.no_of_docs = 20;
		requestFilter.sort = {date: 1};
		requestFilter.all = true;
		return requestFilter;
	}
});