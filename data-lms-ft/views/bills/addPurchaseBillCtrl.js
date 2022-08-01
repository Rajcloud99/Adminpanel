materialAdmin.controller('addPurchaseBillController', addPurchaseBillController);

addPurchaseBillController.$inject = [
	'$modal',
	'$scope',
	'$state',
	'accountingService',
	'billsService',
	'DatePicker',
	'lazyLoadFactory',
	'materialService',
	'NumberUtil',
	'vendorFuelService',
	'Vendor',
	'Vehicle',
	'branchService',
	'billBookService',
	'$stateParams',
	'growlService',
];

function addPurchaseBillController(
	$modal,
	$scope,
	$state,
	accountingService,
	billsService,
	DatePicker,
	lazyLoadFactory,
	materialService,
	NumberUtil,
	vendorFuelService,
	Vendor,
	Vehicle,
	branchService,
	billBookService,
	$stateParams,
	growlService
) {

	let vm = this;

	vm.addMaterial = addMaterial;
	vm.addLabRep = addLabRep;
	vm.getMaterial = getMaterial;
	vm.getHSNCode = getHSNCode;
	vm.onMatSelect = onMatSelect;
	vm.addBill = addBill;
	vm.getVendor = getVendor;
	vm.getVname = getVname;
	vm.onVendSelect = onVendSelect;
	vm.onVehSelect = onVehSelect;
	vm.onSacCodeChange = onSacCodeChange;
	vm.onMaterialSelect = onMaterialSelect;
	vm.onlabSelect = onlabSelect;
	vm.onPurchaseSelect = onPurchaseSelect;
	vm.getAllBranch = getAllBranch;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.accountmaster = accountmaster;
	vm.getAdjAcnt = getAdjAcnt;
	vm.getRefNo = getRefNo;
	vm.onRefSelect = onRefSelect;
	vm.onBranchSelect = onBranchSelect;
	vm.deleteMaterial = deleteMaterial;
	vm.deleteLabRep = deleteLabRep;
	vm.getAllAccount = getAllAccount;
	vm.getTDSRate = getTDSRate;
	vm.onTcsApply = onTcsApply;
	vm.calculateSummary = calculateSummary;
    vm.billnofill = billnofill;
	(function init() {
		vm.isDisabled = false;
		vm.myFilter = {};
		vm.DatePicker = angular.copy(DatePicker);
		vm.lazyLoad = lazyLoadFactory();
		vm.columnSetting = {
			allowedColumn: [
				'Name',
				'Code',
				'Description',
				'HSN',
				'Unit',
				'Rate',
				'Quantity',
				'CGST Rt.',
				'CGST Amt.',
				'SGST Rt.',
				'SGST Amt.',
				'IGST Rt.',
				'IGST Amt.',
				'Total',
			]
		};
		vm.tableHead = [{
				'header': 'Name',
				'bindingKeys': 'name',
			},{
				'header': 'Code',
				'bindingKeys': 'code',
			},{
				'header': 'Description',
				'bindingKeys': 'desc',
			},{
				'header': 'HSN',
				'bindingKeys': 'hsnCode',
			},{
				'header': 'Unit',
				'bindingKeys': 'unit',
			},{
				'header': 'Rate',
				'bindingKeys': 'rate',
			},{
				'header': 'Quantity',
				'bindingKeys': 'quantity',
			},{
				'header': 'CGST Rt.',
				'bindingKeys': 'cGSTPercent',
			},{
				'header': 'CGST Amt.',
				'bindingKeys': 'cGST',
			},{
				'header': 'SGST Rt.',
				'bindingKeys': 'sGSTPercent',
			},{
				'header': 'SGST Amt.',
				'bindingKeys': 'sGST',
			},{
				'header': 'IGST Rt.',
				'bindingKeys': 'iGSTPercent',
			},{
				'header': 'IGST Amt.',
				'bindingKeys': 'iGST',
			},{
				'header': 'Total',
				'bindingKeys': 'total',
			}
		];
		vm.amount = 0; // ∑(of Material + Repair/Labour amount without tax)
		vm.labourAmt = 0; // ∑(of Repair/Labour amount without tax)
		vm.totalAmount = 0; // ∑(of Material + Repair/Labour amount with tax)
		vm.cGST = 0; // cGST% of vm.amount
		vm.sGST = 0; // sGST% of vm.amount
		vm.iGST = 0; // iGST% of vm.amount
		vm.tdsAmt = 0; // ∑(tds% of Repair/Labour amount on which user want ot apply tds)
		vm.aMaterials = [];
		vm.aLabRep = [];
		vm.partyType = 'Registered';

		vm.purchAcc = getAccountFromConfig();

		if($stateParams.data) {
			vm.isEdit = true;
			$stateParams.data.account = $stateParams.data.account || {};
			$stateParams.data.account.ho_address = $stateParams.data.account.ho_address || {};
			vm.vendor = $stateParams.data.vendor;

			getVendor(false, vm.vendor._id).then(function(data){
				data[0] && onVendSelect(data[0]);
			});

			if($stateParams.data.tdsAc)
				vm.tdsAc = {_id:$stateParams.data.tdsAc, name:$stateParams.data.tdsAcName};
			if($stateParams.data.tcsAc)
				vm.tcsAc = {_id:$stateParams.data.tcsAc, name:$stateParams.data.tcsAcName};
			if($stateParams.data.labourAc)
				vm.labourAc = {_id:$stateParams.data.labourAc, name:$stateParams.data.labourAcName};
			if($stateParams.data.discountAcnt)
				vm.discountAcnt = {_id:$stateParams.data.discountAcnt, name:$stateParams.data.discountAcName};

			vm.tdsRate = $stateParams.data.tdsRate;
			vm.tcsRate = $stateParams.data.tcsRate;
			vm.applyTcs = $stateParams.data.tcsRate ? true : false;
			vm.gstn = $stateParams.data.account.gstn;
			vm.state_name = $stateParams.data.account.ho_address.state;
			vm.state_code = $stateParams.data.account.ho_address.state_code;
			vm.from_account = $stateParams.data.from_account;
			vm.adjDebitAc = $stateParams.data.adjDebitAc;
			vm.billNo = $stateParams.data.billNo;
			vm.billDate = moment($stateParams.data.billDate).format('DD/MM/YYYY');
			vm.actulDate = moment($stateParams.data.actulDate).format('DD/MM/YYYY');
			vm.billType = $stateParams.data.billType;
			vm.branch = $stateParams.data.branch;
			vm.remark = $stateParams.data.remark;
			vm.prchType = $stateParams.data.prchType;
			vm.partyType = $stateParams.data.partyType;
			vm.vchType = $stateParams.data.plainVoucher && $stateParams.data.plainVoucher.type;
			vm.refNo = $stateParams.data.refNo;
			vm.amount = $stateParams.data.amount || 0;
			vm.tdsAmt = $stateParams.data.tdsAmt || 0;
			vm.totalAmount = $stateParams.data.totalAmount || 0;
			vm.billAmount = $stateParams.data.billAmount || 0;
			vm.adjAmount = $stateParams.data.adjAmount || 0;
			vm.sGST = $stateParams.data.sGST || 0;
			vm.sgstAcnt = $stateParams.data.sgstAcnt;
			vm.cGST = $stateParams.data.cGST || 0;
			vm.cgstAcnt = $stateParams.data.cgstAcnt;
			vm.iGST = $stateParams.data.iGST || 0;
			vm.igstAcnt = $stateParams.data.igstAcnt;
			vm.taxType = $stateParams.data.iGST > 0 ? '1' : '2';
			vm.aMaterials = $stateParams.data.materialItems;
			vm.aLabRep = $stateParams.data.labRepItems;
			vm.purid = $stateParams.data._id;
			vm.partyType = $stateParams.data.partyType;
			calculateSummary();
			if(vm.branch)
			onBranchSelect();
			vm.refNo = $stateParams.data.refNo;
			if(vm.branch)
				vm.billBookId = vm.branch.refNoBook ? vm.branch.refNoBook.map(o => o.ref) : '';
		}
	})();

	// function definition
	function getAccountFromConfig(){
		return  $scope.$configs.client_allowed.find(o => o.clientId === $scope.selectedClient) || {};
	}

	function addMaterial() {
		if (!vm.taxType || !vm.oMaterial || (vm.oMaterial.gstPercent < 0 ) || !vm.oMaterial.quantity || !vm.oMaterial.rate || !vm.oMaterial.unit) {
			swal('Error','Select tax type and all other fields','error');
			return;
		}
		let oPush = { ...vm.oMaterial };
		oPush.totalWithoutTax = vm.oMaterial.rate * vm.oMaterial.quantity;
		oPush.totAfterDiscount = oPush.totalWithoutTax - (vm.oMaterial.discount || 0);
		vm.oMaterial.frgtGstPercent = vm.oMaterial.frgtGstPercent || 0;
		// vm.taxType === '1' for IGST
		let percent = vm.taxType === '1' ? vm.oMaterial.gstPercent : (vm.oMaterial.gstPercent / 2);
		let frgtPercent = vm.taxType === '1' ? vm.oMaterial.frgtGstPercent : (vm.oMaterial.frgtGstPercent / 2);
		oPush.cGSTPercent = vm.taxType === '1' ? 0 : percent;
		oPush.sGSTPercent = vm.taxType === '1' ? 0 : percent;
		oPush.iGSTPercent = vm.taxType === '1' ? percent : 0;
		oPush.frgtCGSTPercent = vm.taxType === '1' ? 0 : frgtPercent;
		oPush.frgtSGSTPercent = vm.taxType === '1' ? 0 : frgtPercent;
		oPush.frgtIGSTPercent = vm.taxType === '1' ? frgtPercent : 0;

		oPush.frgt = oPush.frgt || 0

		oPush.cGST = oPush.totAfterDiscount * oPush.cGSTPercent / 100;
		oPush.sGST = oPush.totAfterDiscount * oPush.sGSTPercent / 100;
		oPush.iGST = oPush.totAfterDiscount * oPush.iGSTPercent / 100;
		oPush.frgtCGST = oPush.frgt * oPush.frgtCGSTPercent / 100;
		oPush.frgtSGST = oPush.frgt * oPush.frgtSGSTPercent / 100;
		oPush.frgtIGST = oPush.frgt * oPush.frgtIGSTPercent / 100;

		oPush.total = oPush.totAfterDiscount + oPush.cGST + oPush.sGST + oPush.iGST + oPush.frgt + oPush.frgtCGST + oPush.frgtSGST + oPush.frgtIGST;

		oPush.hsnCode = oPush.hsnCode && oPush.hsnCode.hsnCode;
		oPush.material = oPush.material && oPush.material.name;
		if(oPush.vehicle_no) {
			oPush.vehOwnerName = oPush.vehicle_no.owner_name;
			oPush.vehType = oPush.vehicle_no.ownershipType;
			oPush.vehAcc = oPush.vehicle_no.account;
			oPush.vehicle_no = oPush.vehicle_no.vehicle_reg_no;
		}
		vm.aMaterials.push(oPush);
		vm.oMaterial = undefined;
		calculateSummary();
	}

	function addLabRep() {
		if (!vm.taxType || !vm.oLabRep.type || !vm.oLabRep.quantity || !vm.oLabRep.amount) {
			swal('Error','Select tax type and all other fields','error');
			return;
		}
		if(vm.vendor && vm.oLabRep.tds && !(vm.tdsRate))
			return swal('Error','TDS rate not found on selected vendor','error');

		let oPush = vm.oLabRep;
		if(oPush.sacCode)
			oPush.sacCode = vm.oLabRep.sacCode.sacCode;
		vm.oLabRep.gstPercent = vm.oLabRep.gstPercent || 0;
		oPush.totalWithoutTax = vm.oLabRep.amount * vm.oLabRep.quantity;
		oPush.totAfterDiscount = oPush.totalWithoutTax - (vm.oLabRep.discount || 0);

		// vm.taxType === '1' for IGST
		let percent = vm.taxType === '1' ? vm.oLabRep.gstPercent : (vm.oLabRep.gstPercent / 2);
		oPush.cGSTPercent = vm.taxType === '1' ? 0 : percent;
		oPush.sGSTPercent = vm.taxType === '1' ? 0 : percent;
		oPush.iGSTPercent = vm.taxType === '1' ? percent : 0;

		oPush.cGST = oPush.totAfterDiscount * oPush.cGSTPercent / 100;
		oPush.sGST = oPush.totAfterDiscount * oPush.sGSTPercent / 100;
		oPush.iGST = oPush.totAfterDiscount * oPush.iGSTPercent / 100;

		oPush.total = oPush.totAfterDiscount + oPush.cGST + oPush.sGST + oPush.iGST;
		oPush.tds = vm.oLabRep.tds ? true : false;

		if(oPush.vehicle_no) {
			oPush.vehOwnerName = oPush.vehicle_no.owner_name;
			oPush.vehType = oPush.vehicle_no.ownershipType;
			oPush.vehAcc = oPush.vehicle_no.account;
			oPush.vehicle_no = oPush.vehicle_no.vehicle_reg_no;
		}
		vm.aLabRep.push(oPush);
		vm.oLabRep = {};
		calculateSummary();
	}

	function onMaterialSelect($index, mat) {
		vm.oMaterialIndex = $index;
		vm.oMaterialId = mat.$$hashKey;
	}

	function onlabSelect($index, lab) {
		vm.olabrepIndex = $index;
		// vm.olabrepId = lab._id;
		vm.olabrepId = lab.$$hashKey;
	}

	function onPurchaseSelect(type) {
		if(type === 'Opex Other'){
			if(vm.taxType === '1') {
				vm.igstAcnt = {name: vm.purchAcc.igstAccName, _id: vm.purchAcc.igstAcc};

				if(vm.purchAcc.pIgstAcc && vm.purchAcc.pIgstAccName)
					vm.igstAcnt = {name: vm.purchAcc.pIgstAccName, _id: vm.purchAcc.pIgstAcc};
			}
			if(vm.taxType === '2'){
			vm.cgstAcnt = {name:vm.purchAcc.cgstAccName, _id: vm.purchAcc.cgstAcc};
			vm.sgstAcnt = {name:vm.purchAcc.sgstAccName, _id: vm.purchAcc.sgstAcc};

				if(vm.purchAcc.pCgstAcc && vm.purchAcc.pCgstAccName && vm.purchAcc.pSgstAcc && vm.purchAcc.pSgstAccName){
					vm.cgstAcnt = {name:vm.purchAcc.pCgstAccName, _id: vm.purchAcc.pCgstAcc};
					vm.sgstAcnt = {name:vm.purchAcc.pSgstAccName, _id: vm.purchAcc.pSgstAcc};
				}
			}
		}
	}

	function onRefSelect(item){
		vm.selectedRefNo = item;
	}

	function deleteMaterial() {
		if(typeof vm.oMaterialIndex !== 'number') return;
		vm.aMaterials.splice(vm.aMaterials.length-1 - vm.oMaterialIndex, 1);
		calculateSummary();
	}

	function deleteLabRep() {
		if(typeof vm.olabrepIndex !== 'number') return;
		vm.aLabRep.splice(vm.aLabRep.length-1 - vm.olabrepIndex, 1);
		calculateSummary();
	}

	function getRefNo(viewValue, auto) {
		if(!vm.billBookId){
			// swal('Error', `No ${vm.type} Book Linked to ${vm.oVoucher.branch.name} branch`, 'error');
			return;
		}
		return new Promise(function (resolve, reject) {

			let requestObj = {
				billBookId: vm.billBookId,
				type: 'Ref No',
				status: "unused"
			};

			if(viewValue) requestObj.bookNo = viewValue;

			if(auto) {
				requestObj.auto = true;
				requestObj.sch = 'vch';
			}

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function getAllBranch(viewValue, category) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 10,
				};
				branchService.getAllBranches(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});
			});
		}
		return [];
	}

	function getAutoStationaryNo(backDate) {
		if(!(vm.billBookId && vm.billBookId.length))
			return growlService.growl('Ref Book not found on this branch', 'danger');

		let req = {
			"billBookId": vm.billBookId,
			"type": 'Ref No',
			"auto": true,
			"sch": 'vch',
			"status": "unused"
		};

		if(backDate)
			req.backDate = backDate;
			// req.backDate = moment(backDate, 'DD/MM/YYYY').toISOString();

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.refNo = vm.aAutoStationary.bookNo;
			vm.selectedRefNo = vm.aAutoStationary;
			vm.billnofill();
			// vm.preserveRefNo.push({name:vm.branch.name,refNo:vm.aAutoStationary.bookNo,selectedRefNo: vm.aAutoStationary})
		}
	}

	function onBranchSelect() {
		vm.refNo = '';
		vm.billBookId = vm.branch.refNoBook ? vm.branch.refNoBook.map(o => o.ref) : '';
		if($scope.$configs && $scope.$configs.purchaseBill && $scope.$configs.purchaseBill.branchBasedGST){
			if(vm.state_code && vm.branch && vm.branch.gstin){
				vm.taxType = vm.state_code == vm.branch.gstin.substring(0,2) ? '2' : '1';
			}else{
				const foundClientAllowed = getAccountFromConfig();
				vm.taxType = vm.state_code == foundClientAllowed.state_code ? '2' : '1';
			}
			vm.branchStateCode=	vm.branch.gstin.substring(0,2);
		}
	}
	function billnofill(){
		vm.billNo  = vm.refNo;
	}

	function onTcsApply() {
		if (vm.tdsAmt) {
			vm.applyTcs = false;
			return swal('Warning', 'TDS already applied', 'warning');
		}
		if (vm.applyTcs){
			vm.tcsRate = 0.075;
			vm.lastTdsRate = angular.copy(vm.tdsRate);
			vm.tdsRate = 0
	     }else {
			vm.tcsRate = 0;
			vm.tdsRate = vm.lastTdsRate;
		  }
		calculateSummary();
	}

	function calculateSummary() {

		if(vm.partyType == 'Unregistered')
			removeTax();

		vm.tdsAmt = 0;
		vm.tcsAmt = 0;

		vm.totalMaterialWithoutTax = 0;
		vm.tableTotalMaterialWithoutTax = 0
		vm.totalMaterialWithTax = 0;
		vm.totMaterialAfterDiscount = 0;
		vm.cGSTOfMaterial = 0;
		vm.sGSTOfMaterial = 0;
		vm.iGSTOfMaterial = 0;
		vm.tableCGSTOfMaterial = 0;
		vm.tableSGSTOfMaterial = 0;
		vm.tableIGSTOfMaterial = 0;
		vm.discountOfMaterial = 0;
		vm.totFrgt = 0;
		vm.frgtCGSTOfMaterial = 0;
		vm.frgtSGSTOfMaterial = 0;
		vm.frgtIGSTOfMaterial = 0;

		vm.aMaterials.forEach((mat) => {
			vm.totalMaterialWithoutTax += (mat.totalWithoutTax||0) + (mat.frgt || 0);
			vm.tableTotalMaterialWithoutTax += (mat.totalWithoutTax||0);
			vm.totalMaterialWithTax += (mat.total||0);
			vm.cGSTOfMaterial += (mat.cGST||0) + (mat.frgtCGST || 0);
			vm.sGSTOfMaterial += (mat.sGST||0) + (mat.frgtSGST || 0);
			vm.iGSTOfMaterial += (mat.iGST||0) + (mat.frgtIGST || 0);
			vm.tableCGSTOfMaterial += (mat.cGST||0);
			vm.tableSGSTOfMaterial += (mat.sGST||0);
			vm.tableIGSTOfMaterial += (mat.iGST||0);
			vm.rateMaterial += (mat.rate||0);
			vm.discountOfMaterial += (mat.discount || 0);
			vm.totFrgt += (mat.frgt || 0);
			vm.frgtCGSTOfMaterial = (mat.frgtCGST || 0);
			vm.frgtSGSTOfMaterial = (mat.frgtSGST || 0);
			vm.frgtIGSTOfMaterial = (mat.frgtIGST || 0);
		});

		vm.totalLabRepWithoutTax = 0;
		vm.totalLabRepWithTax = 0;
		vm.totLabAfterDiscount = 0;
		vm.discountOfLabRep = 0;
		vm.cGSTOfLabRep = 0;
		vm.sGSTOfLabRep = 0;
		vm.iGSTOfLabRep = 0;
		vm.labourAmt = 0;

		vm.aLabRep.forEach((lab) => {
			vm.totalLabRepWithoutTax += (lab.totalWithoutTax||0);
			vm.labourAmt += (lab.totalWithoutTax||0);
			vm.totalLabRepWithTax += (lab.total||0);
			vm.cGSTOfLabRep += (lab.cGST||0);
			vm.sGSTOfLabRep += (lab.sGST||0);
			vm.iGSTOfLabRep += (lab.iGST||0);
			vm.discountOfLabRep += (lab.discount||0);
			vm.tdsAmt += (lab.tds ? ((lab.totalWithoutTax - (lab.discount ||0)) * (vm.tdsRate||0)/100) : 0);
		});

		vm.totDiscount = vm.discountOfMaterial + vm.discountOfLabRep;
		vm.amt = vm.totalMaterialWithoutTax + vm.totalLabRepWithoutTax;
		vm.amount = NumberUtil.toFixed(vm.amt - vm.totDiscount);
		vm.cGST = NumberUtil.toFixed(vm.cGSTOfMaterial + vm.cGSTOfLabRep);
		vm.sGST = NumberUtil.toFixed(vm.sGSTOfMaterial + vm.sGSTOfLabRep);
		vm.iGST = NumberUtil.toFixed(vm.iGSTOfMaterial + vm.iGSTOfLabRep);
		vm.totGST = vm.cGST + vm.sGST + vm.iGST;
		vm.totalAmount = NumberUtil.toFixed(vm.amount + vm.cGST + vm.sGST + vm.iGST - NumberUtil.toFixed(vm.tdsAmt));
		if(vm.tcsRate && vm.applyTcs) {
			vm.tcsAmt = ((vm.totalAmount || 0) * (vm.tcsRate || 0)) / 100
			vm.totalAmount = vm.totalAmount - NumberUtil.toFixed(vm.tcsAmt)
		}
		vm.billAmount = NumberUtil.toFixed(vm.totalAmount)  + (vm.adjAmount || 0);
		vm.labourAmt -=  vm.discountOfLabRep;
	}

	function removeTax() {
		vm.aMaterials.forEach((mat) => {
			mat.cGST = 0;
			mat.cGSTPercent = 0;
			mat.sGST = 0;
			mat.sGSTPercent = 0;
			mat.iGST = 0;
			mat.iGSTPercent = 0;
			mat.frgtCGST = 0;
			mat.frgtCGSTPercent = 0;
			mat.frgtSGST = 0;
			mat.frgtSGSTPercent = 0;
			mat.frgtIGST = 0;
			mat.frgtIGSTPercent = 0;
			mat.total = mat.totAfterDiscount;
		});

		vm.aLabRep.forEach((lab) => {
			lab.cGST = 0;
			lab.cGSTPercent = 0;
			lab.sGST = 0;
			lab.sGSTPercent = 0;
			lab.iGST = 0;
			lab.iGSTPercent = 0;
			// lab.tds = 0;
			lab.total = lab.totAfterDiscount;
		});
	}

	function getHSNCode(viewValue, code = 'hsnCode') {
		return new Promise(function (resolve, reject) {
			if(viewValue.length < 1) {
				return resolve([]);
			}
			let req = {[code]: viewValue};

				materialService.getMaterialTypes(req, function success(res) {
					resolve(res.data);
				},function (err) {
					console.log(err);
					reject([]);
				});
		});
	}

	function getMaterial(viewValue) {
		return new Promise(function (resolve, reject) {
			if(viewValue.length < 1) {
				return resolve([]);
			}
			let req = {material: viewValue && viewValue.trim()};
			if(vm.oMaterial.hsnCode)
				req.hsnCode = vm.oMaterial.hsnCode.hsnCode;

			materialService.getMaterialTypes(req, function success(res) {
				resolve(res.data);
				if(res.data[0].material){
					vm.allMaterial =  [];
					res.data[0].material.forEach(obj=>{
						vm.allMaterial.push({...res.data[0],name:obj});
					})
				}
			},function (err) {
				console.log(err);
				reject([]);
			});
		});
	}

	function onMatSelect(material,hsn) {
		vm.oMaterial = vm.oMaterial || {};
		vm.oMaterial.quantity = material.quantity;
		vm.oMaterial.rate = material.rate;
		vm.oMaterial.unit = material.unit;
		vm.oMaterial.gstPercent = material.gstPercent;
		if(hsn)
			vm.oMaterial.hsnCode = {hsnCode:material.hsnCode}
	}

	function onVehSelect(item) {
		vm.vehOwner = item.owner_name;
	}

	function onSacCodeChange(item) {
		vm.oLabRep.gstPercent = item.gstPercent;
	}

	function getVname(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {

				let req = {
					vehicle_no: viewValue,
					ownershipType: ["Own", "Associate"]
				};

				Vehicle.getAllVehicles(req, oSuc, oFail);

				function oSuc(response) {
					resolve(response.data);
				}

				function oFail(response) {
					reject([]);
				}
			});
		} else
			return [];
	}

	function accountmaster(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function(resolve, reject) {
				accountingService.getAccountMaster({name: viewValue}, res => resolve(res.data.data), err => reject(err));
			});
		}
	}

	function getAdjAcnt(viewValue, category) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					group: 'Adjustment',
				};
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

	function addBill(isApprove) {
		if (!(vm.aMaterials.length || vm.aLabRep.length)) {
			growlService.growl('Add atleast 1 material or Labour/Repair', 'danger');
			return;
		}
		if(!(vm.vendorAccnt && vm.vendorAccnt.ref)){
			return swal('Error!', 'Account not linked to selected vendor', 'error');
		}

		if (vm.aMaterials.length && !vm.from_account) {
			swal('Error!', 'Purchase Account required', 'error');
			return;
		}

		if (vm.aLabRep.length && !vm.labourAc) {
			swal('Error!', 'Labour/Repair Account required', 'error');
			return;
		}

		if (vm.tdsAmt && !vm.tdsAc) {
			swal('Error!', 'TDS Account required', 'error');
			return;
		}
		if (vm.tcsAmt && !vm.tcsAc) {
			swal('Error!', 'TCS Account required', 'error');
			return;
		}
		if (vm.totDiscount && !vm.discountAcnt) {
			swal('Error!', 'Discount Account required', 'error');
			return;
		}
		if (vm.adjAmount && !vm.adjDebitAc) {
			swal('Error!', 'Adjustment Account required', 'error');
			return;
		}
		if(!vm.billDate) {
			return swal('Error', 'Bill Date required', 'error');
		}
		if(!vm.billNo) {
			return swal('Error', 'Bill No required', 'error');
		}
		if(!vm.billType) {
			return swal('Error', 'Bill Type required', 'error');
		}
		if(!vm.refNo) {
			return swal('Error', 'ref No required', 'error');
		}

		let oSend = {
			itemsType: 'materials',
			vendor: vm.vendorId,
			prchType : vm.prchType,
			partyType : vm.partyType,
			vchType: vm.vchType,
			account: vm.vendorAccnt && vm.vendorAccnt.ref && vm.vendorAccnt.ref._id,
			accountName: vm.vendorAccnt && vm.vendorAccnt.ref && vm.vendorAccnt.ref.ledger_name || vm.vendorAccnt.ref.name,
			from_account: vm.from_account && vm.from_account._id,
			from_accountName: vm.from_account && vm.from_account.name,
			adjDebitAc: vm.adjDebitAc && vm.adjDebitAc._id,
			adjDebitAcName: vm.adjDebitAc && vm.adjDebitAc.name,
			branch: vm.branch._id,
			remark: vm.remark,
			billNo: vm.billNo,
			billDate: moment(vm.billDate, 'DD/MM/YYYY', true).startOf('day').toISOString(),
			actulDate: moment(vm.actulDate, 'DD/MM/YYYY', true).startOf('day').toISOString(),
			billType: vm.billType,
			tdsRate: vm.tdsRate,
			gstn: vm.gstn,
			state_name: vm.state_name,
			state_code: vm.state_code,
			amount: NumberUtil.toFixed(vm.amount),
			totMaterial: NumberUtil.toFixed((vm.amount - (vm.labourAmt || 0))),
			totalAmount: NumberUtil.toFixed(vm.totalAmount),
			billAmount: NumberUtil.toFixed(vm.billAmount),
			adjAmount: (vm.adjAmount),
			sGST: NumberUtil.toFixed(vm.sGST),
			sgstAcnt: vm.sgstAcnt && vm.sgstAcnt._id,
			sgstAcntName: vm.sgstAcnt && vm.sgstAcnt.name,
			cGST: NumberUtil.toFixed(vm.cGST),
			cgstAcnt: vm.cgstAcnt && vm.cgstAcnt._id,
			cgstAcntName: vm.cgstAcnt && vm.cgstAcnt.name,
			iGST: NumberUtil.toFixed(vm.iGST),
			igstAcnt: vm.igstAcnt && vm.igstAcnt._id,
			igstAcntName: vm.igstAcnt && vm.igstAcnt.name,
			materialItems: vm.aMaterials,
			labRepItems: vm.aLabRep,
			refNo: vm.refNo,
			amt: NumberUtil.toFixed(vm.amt),
			totGST: NumberUtil.toFixed(vm.totGST),
			totalMaterialWithoutTax: NumberUtil.toFixed(vm.totalMaterialWithoutTax),
			totalLabRepWithoutTax: NumberUtil.toFixed(vm.totalLabRepWithoutTax),
			discountOfMaterial: NumberUtil.toFixed(vm.discountOfMaterial),
			discountOfLabRep: NumberUtil.toFixed(vm.discountOfLabRep),
		};

		oSend.remMatQty = 0;
		if(vm.aMaterials.length){
			vm.aMaterials.forEach(obj=>{
				oSend.remMatQty += obj.quantity;
			})
		}

		if (vm.labourAc && vm.aLabRep.length){
			oSend.labourAc = vm.labourAc._id;
		    oSend.labourAcName = vm.labourAc.name;
		    oSend.labourAmt = NumberUtil.toFixed(vm.labourAmt);
	    }
		if(vm.tdsAc){
			oSend.tdsAc = vm.tdsAc._id;
			oSend.tdsAcName = vm.tdsAc.name;
			oSend.tdsAmt = NumberUtil.toFixed(vm.tdsAmt);
		}else{
			oSend.tdsAmt = 0;
		}
		if(vm.tcsAc){
			oSend.tcsAc = vm.tcsAc._id;
			oSend.tcsAcName = vm.tcsAc.name;
			oSend.tcsAmt = NumberUtil.toFixed(vm.tcsAmt);
			oSend.tcsRate = vm.tcsRate;
		}else{
			oSend.tcsAmt = 0;
		}
		if(vm.totDiscount){
			oSend.discountAcnt = vm.discountAcnt._id;
			oSend.discountAcName = vm.discountAcnt.name;
			oSend.totDiscount = NumberUtil.toFixed(vm.totDiscount);
		}else{
			oSend.totDiscount = 0;
		}

		if(isApprove) oSend.acknowledge = true;
		if((vm.selectedRefNo && vm.selectedRefNo.bookNo) === vm.refNo) oSend.stationaryId = vm.selectedRefNo._id;
		else delete oSend.stationaryId;
		vm.isDisabled = true;
		if(vm.isEdit) {
			oSend._id = vm.purid;
			billsService.purchaseBillUpdate(oSend, onSuccess, onFailure);
		} else {
			billsService.purchaseBillAdd(oSend, onSuccess, onFailure);
		}
		function onFailure(err) {
			vm.isDisabled = false;
			swal('Error', err.message, 'error');
		}
		function onSuccess(res) {
			vm.isDisabled = false;
			swal('Success', res.message, 'success');
			$state.go('billing.purchaseBill',{},{reload:true});
		}
	}

	function getVendor(viewValue, _id) {
		return new Promise(function (resolve, reject) {
			if(viewValue != false && viewValue && viewValue.length < 3) {
				return resolve([]);
			}

			let oReq = {
				name: viewValue,
				fpa: true,
				cClientId: $scope.selectedClient
			};

			if(_id){
				delete oReq.name;
				oReq._id = _id;
			}

			Vendor.getAllVendorsList(oReq, function success(res) {
				resolve(res.data.data);
			}, function (err) {
				reject([]);
			});
		});
	}

	function getTDSRate() {
        const convertBillDt = moment(vm.billDate, 'DD/MM/YYYY', true).startOf('day').toISOString();
        if(vm.tdsVerify && vm.tdsCategory && vm.tdsSources && vm.vendorAccnt && vm.billDate){
            let oReq = {
                date: convertBillDt,
                cClientId: $scope.selectedClient
            };
            let isGetTDS = true;
            if(vm.vendor && vm.vendor.exeRate && vm.vendor.exeFrom && vm.vendor.exeTo){
                if(new Date(vm.billDate) >= new Date(vm.vendor.exeFrom) && new Date(vm.billDate) <= new Date(vm.vendor.exeTo)) {
                    vm.tdsRate = vm.vendor.exeRate;
                    isGetTDS = false;
                }
            }

            if(isGetTDS)
            billsService.getTDSRate(oReq, onSuccess, onFailure);

            function onSuccess(res) {
                vm.showTDSRate = false;
                if(res.data && res.data.data && res.data.data.length){
                vm.allTDSRate = res.data.data[0];
                    vm.allTDSRate.aRate.forEach(obj=>{
                        if(obj.sources === vm.tdsSources){
                            switch (vm.tdsCategory) {
                                case 'Individuals or HUF':{
                                    if(vm.PanNo)
                                        return  vm.tdsRate = obj.ipRate;
                                    else
                                        return vm.tdsRate = obj.iwpRate;
                                }
                                case 'Non Individual/corporate':
                                {
                                    if(vm.PanNo)
                                        return  vm.tdsRate = obj.nipRate;
                                    else
                                        return vm.tdsRate = obj.niwpRate;
                                }
                                default:
                                    return vm.tdsRate = 0;
                            }
                        }
                    });
                }
            }
            function onFailure(err) {
                vm.allTDSRate = {};
            }
        }

        if(!vm.tdsRate){
            vm.showTDSRate = true;
        }

    }

	function onVendSelect(item) {
		item.ho_address = item.ho_address || {};
		// vm.tdsRate = item.tdsSources && item.tdsSources.tdsRate;
		vm.billType = item.billType || ($stateParams && $stateParams.data && $stateParams.data.billType);
		vm.gstn = item.gstn;
		vm.state_name = item.ho_address.state;
		vm.state_code = item.ho_address.state_code;
		vm.vendorAccnt = item.account;
		vm.PanNo = item.pan_no;
		vm.vendorId = item._id;
		vm.tdsVerify = item.tdsVerify;
		vm.tdsCategory = item.tdsCategory;
		vm.tdsSources = item.tdsSources;
		const foundClientAllowed = getAccountFromConfig();
		if($scope.$configs && $scope.$configs.purchaseBill && $scope.$configs.purchaseBill.branchBasedGST){
			if(vm.branchStateCode && item.ho_address && item.ho_address.state_code){
				vm.taxType = vm.branchStateCode == item.ho_address.state_code ? '2' : '1';
			}else{
				vm.taxType = foundClientAllowed.state_code == item.ho_address.state_code ? '2' : '1';
			}

		}else{
			vm.taxType = foundClientAllowed.state_code == item.ho_address.state_code ? '2' : '1';
		}

		calculateSummary();
		if(!(vm.vendorAccnt && vm.vendorAccnt.ref)){
			 swal('Error!', 'Account not linked to selected vendor', 'error');
		}
		if(item.tdsSources && item.tdsCategory && item.tdsVerify)
	    	getTDSRate();
		else
			vm.showTDSRate = true;

	}

	function getAllAccount(viewValue, group) {
		return new Promise(function (resolve, reject) {
			if(viewValue.length < 3) {
				return resolve([]);
			} else {
				accountingService.getAccountMaster({name: viewValue, group}, res => resolve(res.data.data), err => resolve([]));
			}
		});
	}

}
