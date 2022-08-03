materialAdmin.controller('configurationsController', configurationsController);

configurationsController.$inject = ['$modal', '$scope', 'customer', 'billingPartyService', 'growlService','confService'];

function configurationsController($modal, $scope, customer, billingPartyService, growlService,confService) {

	const vm = this;

	const CONFIGS = $scope.$constants.modelConfigs;

	vm.onSchemaChange = onSchemaChange;
	vm.baseValueComparer = baseValueComparer;
	vm.getCustomers = getCustomers;
	vm.onCustomerSelect = onCustomerSelect;
	vm.onCustomerRemove = onCustomerRemove;
	vm.getBillingParty = getBillingParty;
	vm.onBPSelect = onBPSelect;
	vm.onBPRemove = onBPRemove;
	vm.generateFormula = generateFormula;
	vm.saveConf = saveConf;
	vm.addBaseRateConf = addBaseRateConf;
	vm.onBaseRateDel = onBaseRateDel;
	vm.deleteConfigs = deleteConfigs;
	vm.deleteFormula = deleteFormula;
	vm.reqfieldvisible = reqfieldvisible;
	vm.reqfieldremove = reqfieldremove;
	vm.Modifieddate = Modifieddate;

	//init
	(function init() {
		vm.oSend = {};
		vm.selectedConfig = null;
		vm.deleteConfig = null;
		vm.configType = undefined;
		/*let cachedConfig = null*/
	})();

	//Function Defination
	function onSchemaChange(selected) {
		vm.selectedConfig = CONFIGS[selected];
		vm.key = selected;
	}

	function getCustomers(viewValue) {
		if (viewValue.length < 3) return;
		return new Promise(function (resolve) {
			customer.getCname(viewValue, function success(res) {
				resolve(res.data.data.slice(0, 5));
			}, function () {
				resolve([]);
			});
		});
	}

	function onCustomerSelect($item, $model, $label) {
		vm.oSend.customer = $item._id;
		vm.lastUpdateConfigsBy = $item.lastUpdateConfigsBy;
		vm.lastUpdateConfigsAt = $item.lastUpdateConfigsAt;
		if($item.configs && $item.configs[vm.oSend.model] && $item.configs[vm.oSend.model].configs) {
			vm.deleteConfig = $item._id;
			vm.configType ='customer';

			let custConf = $item.configs[vm.oSend.model].configs;
			let cachedConf = {};

			for(let key in custConf){
				if(Array.isArray(CONFIGS[vm.oSend.model][key])){
					cachedConf[key] = custConf[key];
				}
				else{
					cachedConf[key] = {
						...CONFIGS[vm.oSend.model][key],
						...custConf[key],
						ourLabel: CONFIGS[vm.oSend.model] && CONFIGS[vm.oSend.model][key] && CONFIGS[vm.oSend.model][key].ourLabel,
						type: CONFIGS[vm.oSend.model] && CONFIGS[vm.oSend.model][key] && CONFIGS[vm.oSend.model][key].type,
					};
				}
			}

			vm.selectedConfig = {
				...CONFIGS[vm.oSend.model],
				...cachedConf
			};

		} else {
			vm.selectedConfig = CONFIGS[vm.oSend.model];
		}
	}

	function onCustomerRemove() {
		vm.cust=undefined;
		vm.oSend.customer=undefined;
		vm.bp=undefined;
		vm.oSend.billingParty=undefined;
		vm.deleteConfig = undefined;
		vm.configType = undefined;
		vm.selectedConfig = CONFIGS[vm.oSend.model];
	}

	function getBillingParty(viewValue, custId){
		if(!viewValue || viewValue.length < 2)
			return;
		return new Promise(function (resolve, reject) {
			let oFilter = { all: 'true', customer: custId, name: viewValue };
			billingPartyService.getBillingParty(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				resolve([]);
			}

			// Handle success response
			function onSuccess(response){
				resolve(response.data.slice(0, 5));
			}
		});
	}

	function onBPSelect($item, $model, $label) {
		vm.oSend.billingParty = $item._id;
		vm.lastUpdateConfigsBy = $item.lastUpdateConfigsBy;
		vm.lastUpdateConfigsAt = $item.lastUpdateConfigsAt;
		if($item.configs && $item.configs[vm.oSend.model] && $item.configs[vm.oSend.model].configs) {
			vm.deleteConfig = $item._id;
			vm.configType ='billingParty';
			let custConf = $item.configs[vm.oSend.model].configs;
			let cachedConf = {};

			for(let key in custConf) {
				if (Array.isArray(CONFIGS[vm.oSend.model][key])) {
					cachedConf[key] = custConf[key];
				} else {
					cachedConf[key] = {
						...CONFIGS[vm.oSend.model][key],
						...custConf[key],
						ourLabel: CONFIGS[vm.oSend.model] && CONFIGS[vm.oSend.model][key] && CONFIGS[vm.oSend.model][key].ourLabel,
						type: CONFIGS[vm.oSend.model] && CONFIGS[vm.oSend.model][key] && CONFIGS[vm.oSend.model][key].type,
					};
				}
			}

			vm.selectedConfig = {
				...CONFIGS[vm.oSend.model],
				...cachedConf
			};


		} else {
			vm.selectedConfig = CONFIGS[vm.oSend.model];
		}
	}

	function onBPRemove() {
		vm.bp=undefined;
		vm.oSend.billingParty=undefined;
		vm.deleteConfig = undefined;
		vm.configType = undefined;
		vm.selectedConfig = cachedConfig || CONFIGS[vm.oSend.model];
	}

	function Objectfilter(obj, predicate){
		return Object.keys(obj).filter(key => predicate(obj[key])).reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {});
	}

	function generateFormula() {
		if(!vm.selectedFormListEle){
			swal('Error','Please Select a Row','error');
			return;
		}
		openFormulaModal();
	}

	function deleteConfigs() {
		if (vm.deleteConfig && vm.configType) {
			swal({
					title: 'Are you sure you want to delete this config?',
					type: 'warning',
					showCancelButton: true,
					confirmButtonClass: 'btn-danger',
					confirmButtonText: 'Yes',
					cancelButtonText: 'No',
					closeOnConfirm: true,
					closeOnCancel: true,
					allowOutsideClick: true
				},
				function (isConfirm) {
					if (isConfirm) {
						let request = {
							_id: vm.deleteConfig,
							type: vm.configType,
							key: vm.key
						};
						if(vm.configType === 'customer')
						    customer.deleteConfig(request, onSuccess, onFailure);
						else if(vm.configType === 'billingParty')
							billingPartyService.deleteConfig(request, onSuccess, onFailure);

						function onFailure(err) {
							swal('Error', (err.data.message || err.message), 'error');
						}

						function onSuccess(res) {
							swal('Success',  (res.data.message || res.message), 'success');
							vm.selectedConfig = CONFIGS[vm.oSend.model];
						}
					}
				});
			/*return;*/
		}

	}

	function deleteFormula() {
		if (vm.selectedConfig[vm.selectedFormListEle].evalExp) {
			swal({
					title: 'Are you sure you want to delete this Formula?',
					type: 'warning',
					showCancelButton: true,
					confirmButtonClass: 'btn-danger',
					confirmButtonText: 'Yes',
					cancelButtonText: 'No',
					closeOnConfirm: true,
					closeOnCancel: true,
					allowOutsideClick: true
				},
				function (isConfirm) {
					if (isConfirm) {
						delete vm.selectedConfig[vm.selectedFormListEle].expression;
						delete vm.selectedConfig[vm.selectedFormListEle].evalExp;
						delete vm.selectedConfig[vm.selectedFormListEle].postfixExp;

						swal('Success',  'Formula Remove SuccessFully', 'success');
					}
				});
			return;
		}

	}

	function baseValueComparer(expressionType) {
		vm.selectedFormListEle = 'rate';
		openFormulaModal(expressionType);
	}

	vm.isVisible = function(check){
		if(check){
			for(let key in vm.selectedConfig) {
				vm.selectedConfig[key].visible = true;
			}
		}else{
			for(let key in vm.selectedConfig) {
				vm.selectedConfig[key].visible = false;
				vm.selectedConfig[key].req = false;
			}
		}
	};

	vm.isEditable = function(check){
		if(check){
			for(let key in vm.selectedConfig) {
					vm.selectedConfig[key].editable = true;
			}
		}else{
			for(let key in vm.selectedConfig) {
					vm.selectedConfig[key].editable = false;
			}
		}
	};

	vm.isMandatory = function(check){
		if(check){
			for(let key in vm.selectedConfig) {
				vm.selectedConfig[key].req = true;
				vm.selectedConfig[key].visible = true;
			}
		}else{
			for(let key in vm.selectedConfig) {
				vm.selectedConfig[key].req = false;
			}
		}
	};

	vm.isApplyTax = function(check){
		if(check){
			for(let key in vm.selectedConfig) {
				if(vm.selectedConfig[key].notApplyTax != undefined)
				vm.selectedConfig[key].notApplyTax = true;
			}
		}else{
			for(let key in vm.selectedConfig) {
				if(vm.selectedConfig[key].notApplyTax != undefined)
				vm.selectedConfig[key].notApplyTax = false;
			}
		}
	};
	function  reqfieldvisible(check){
		if(check.req){
			check.visible = true;
		}

	};
	function  reqfieldremove(check){
		if(!check.visible){
			check.req = false;
		}

	};

	function openFormulaModal(expressionType){
		let modalInstance = $modal.open({
			templateUrl: 'views/schemaConfiguration/generateFormulaPopUp.html',
			controller: ['$uibModalInstance', 'modalData', 'otherData', generateFormulaPopUpController],
			controllerAs: 'gfVm',
			resolve: {
				modalData: function(){
					return {
						header: `Formula Generate (${vm.selectedConfig[vm.selectedFormListEle].label})`,
						expressionType,
					};
				},
				otherData: function(){
					let filterList = Objectfilter(vm.selectedConfig, x => x.type === 'number' && x.visible);

					return {
						filteredFormList : filterList,
						filteredRateList : vm.oSend.model === 'GR' && getVisibleRateChartList(),
						formListEle: vm.selectedFormListEle,
						formList: vm.selectedConfig
					};

					function getVisibleRateChartList() {
						let obj = {};
						let rateConfig = vm.cust.configs.RATE_CHART && vm.cust.configs.RATE_CHART.configs || {};

						for(let key in rateConfig){
							if(rateConfig[key].visible && rateConfig[key].type === 'number')
								Object.assign(obj, {[key]: rateConfig[key]});
						}

						return obj;
					}
				}
			}
		});
		modalInstance.result.then(function(response) {
			console.log('close',response);
		}, function(data) {
			console.log('cancel');
		});
	}

	function saveConf() {

		if(vm.selectedConfig.detentionLoading && vm.selectedConfig.detentionLoading.visible && vm.selectedConfig.suppDetentionLoading &&  vm.selectedConfig.suppDetentionLoading.visible)
			return swal('Error', 'Loading Detention and Supplementary Loading Detention both cannot be Applied', 'error');

		if(vm.selectedConfig.detentionUnloading && vm.selectedConfig.detentionUnloading.visible && vm.selectedConfig.suppDetentionUnloading && vm.selectedConfig.suppDetentionUnloading.visible)
			return swal('Error', 'Unloading Detention and Supplementary Unloading Detention both cannot be Applied', 'error');
		if (!vm.oSend.customer && !vm.oSend.billingParty) {
			growlService.growl("Please provide customer or billing party", "danger");
			return;
		}
		let obj = { ...vm.oSend, configs: vm.selectedConfig };
		if (obj.billingParty) {
			delete obj.customer;
		}
		if(vm.selectedConfig['baseRate'] && vm.selectedConfig['baseRate'].length) {
			let last = vm.selectedConfig['baseRate'][vm.selectedConfig['baseRate'].length - 1];
			if(!last.label || !last.baseVal || !last.rate) {
				growlService.growl("Please fill existing base value and rate to add more, All fields are mandatory", "danger");
				return;
			}
			vm.selectedConfig['baseRate'].sort((a,b) => a.baseVal - b.baseVal);
		}
		confService.add(obj, (res)=>{
			swal('Success', res.message, 'success');
			},(err)=>{
			swal('Error', err.message, 'error');
		});
	}

	function addBaseRateConf() {
		if (vm.selectedConfig['baseRate'] && vm.selectedConfig['baseRate'].length > 0) {
			let last = vm.selectedConfig['baseRate'][vm.selectedConfig['baseRate'].length - 1];
			if(!last.label || !last.baseVal || !last.rate) {
				growlService.growl("Please fill existing base value and rate to add more. All fields are mandatory", "danger");
				return;
			}
			vm.selectedConfig['baseRate'].push({
				label: '',
				visible: false,
				editable: true,
				field: 'baseRate',
			});
		} else {
			vm.selectedConfig['baseRate'] = [{
				label: '',
				visible: false,
				editable: true,
				field: 'baseRate',
			}];
		}
	}

	function onBaseRateDel(ind) {
		vm.selectedConfig['baseRate'].splice(ind,1);
	}

}


function generateFormulaPopUpController(
	$uibModalInstance,
	modalData,
	otherData,
) {
	const vm = this;

	vm.closeModal = closeModal;
	vm.performOperation = performOperation;
	vm.pushKeyLabelOperand = pushKeyLabelOperand;
	vm.push = push;
	vm.submit = submit;

	// init
	(function init(){

		vm.operator = ['+', '-', '*', '/' , '(', ')'];
		vm.operation = ['Backspace'];
			vm.specialOperator = ['Master'];

		vm.header = modalData.header || 'Modal';
		vm.formList = otherData.formList;
		vm.formListEle = otherData.formListEle;
		vm.filteredFormList = otherData.filteredFormList;
		vm.filteredRateList = otherData.filteredRateList;

		vm.formulaType = 'expression';

		if(vm.formList[vm.formListEle].customValue){
			vm.formulaType = 'customValue';
			vm.aValue = vm.formList[vm.formListEle].aValue || [];
		}

		switch (modalData.expressionType){
			case 'operand':
				vm.hideOperator = true;
				vm.hideInput = true;
				break;
		}

		vm.expression = vm.formList[vm.formListEle].expression || [];
		vm.evalExp = vm.formList[vm.formListEle].evalExp || [];

	})();

	// function Definition
	function closeModal() {
		$uibModalInstance.dismiss('cancel');
	}

	function performOperation(operation) {
		switch (operation){
			case 'Backspace':
				pop();
				break;
		}
	}

	function pushKeyLabelOperand(value, label) {
		vm.expression.push(label);
		vm.evalExp.push(value);
	}

	function push(operator) {
		vm.expression.push(operator);
		vm.evalExp.push(operator);
	}

	function pop(operator) {
		vm.expression.pop(operator);
		vm.evalExp.pop(operator);
	}

	function submit() {

		if(vm.formulaType === 'customValue'){

			vm.formulaType = 'customValue';
			if(!vm.aValue.length){
				swal('Error','Add Atleast one Value','error');
				return;
			}

			vm.formList[vm.formListEle].aValue = vm.aValue;

		}else if(vm.formulaType === 'expression'){

			if(!vm.postfixExp){
				swal('Error','Invalid Formula','error');
				return;
			}

			vm.formList[vm.formListEle].expression = vm.expression;
			vm.formList[vm.formListEle].evalExp = vm.evalExp;
			vm.formList[vm.formListEle].postfixExp = vm.postfixExp;

		}
		closeModal();
	}
}
function Modifieddate()
{


	var x = new Date(document.lastModified);
	document.getElementById("demo").innerHTML = x;
}

