materialAdmin.factory('tableAccessDetailFactory', function () {

	let TABLEDETAILCONF = {};
	TABLEDETAILCONF = {
		"Booking_Management_Trip": {
			"Trip": {
				"tripNo": {
					"header": "TRIP NO.",
					'bindingKeys': 'trip_no',
					'date': false,
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"category": {
					"header": "CATEGORY",
					"bindingKeys": 'category',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"type": {
					"header": "Type",
					"bindingKeys": 'type',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"grNo": {
					"header": "GR NO.",
					"filter": {
						'name': 'arrayOfGrToString',
						'aParam': [
							'gr',
						]
					},
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"tsNo": {
					'header': 'RT NO',
					'bindingKeys': 'advSettled.tsNo',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"vehNo": {
					"header": "VEHICLE NO.",
					'bindingKeys': 'vehicle.vehicle_reg_no',
					"allowed": true,
					"date": false,
					"visible": true,
					"ordering": true
				},
				"vehType": {
					"header": "VEHICLE TYPE",
					'bindingKeys': 'vehicle.veh_type_name',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"customer": {
					"header": "CUSTOMER",
					'bindingKeys': 'gr[0].customer.name',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"consignee": {
					"header": "CONSIGNEE",
					'bindingKeys': 'gr[0].consignee.name',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"consignor": {
					"header": "CONSIGNOR",
					'bindingKeys': 'gr[0].consignor.name',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"material": {
					"header": "MATERIAL",
					'bindingKeys': 'gr[0].invoices[0].material.groupName',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"vendor": {
					"header": "VENDOR",
					'bindingKeys': 'vendor.name',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"route": {
					"header": "ROUTE",
					'bindingKeys': 'route_name || rName',
					"allowed": true,
					"visible": true,
					"ordering": true
				},

				"intermittentPoint": {
					"header": "Intermittent Point",
					'filter': {
						'name': 'arrayOfString',
						'aParam': [
							'imd',
							'"c"',
						]
					}
				},
				// "intermittentPoint": {
				// 	"header": "Intermittent Point",
				// 	"filter": {
				// 		'name': 'arrayOfIntermitPoint',
				// 		'aParam': [
				// 			'gr',
				// 		]
				// 	},
				// 	"allowed": true,
				// 	"visible": true,
				// 	"ordering": true
				// },
				"km": {
					"header": "KM",
					'bindingKeys': 'route.route_distance || rKm',
					'date': false,
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"source": {
					"header": "SOURCE",
					"bindingKeys": "route_name.split(' to ')[0] || rName.split(' to ')[0]"  ,
					"allowed": true,
					"visible": true,
					"ordering": true
				},
					"destination": {
					"header": "DESTINATION",
					"bindingKeys": "route_name.split(' to ')[1] || rName.split(' to ')[1]",
					"allowed": true,
					"visible": true,
					"ordering": true },
				"tripStart": {
					"header": "TRIP START",
					'bindingKeys': '((statuses | filter:{"status": "Trip started"})[0].date | date:"dd-MMM-yyyy h:mma")',
					'date': 'dd-MMM-yyyy',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"tripEnd": {
					"header": "TRIP END",
					'bindingKeys': '((statuses | filter:{"status": "Trip ended"})[0].date | date:"dd-MMM-yyyy h:mma")',
					'date': 'dd-MMM-yyyy',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"tripEntry": {
					"header": "ALLOCATION DATE",
					'bindingKeys': 'allocation_date | date:"dd-MMM-yyyy h:mma"',
					'date': 'dd-MMM-yyyy',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"ewayExpiry": {
					"header": "E-way Expiry",
					'bindingKeys': 'ewayBill_expiry || ewayBillExpiry',
					'date': 'dd-MMM-yyyy',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"tripStatus": {
					"header": "TRIP STATUS",
					'bindingKeys': '$configs.trip_statuses ? (($configs.trip_statuses|filter:{"key":this.status})[0].label) : this.status',
					'eval': true,
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"ownership": {
					"header": "OWNERSHIP",
					'bindingKeys': 'ownershipType',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"driverName": {
					"header": "DRIVER NAME",
					'bindingKeys': 'driver.nameCode || driver.name || vehicle.driver_name',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"noOfDocs": {
					"header": "No Of Docs",
					'bindingKeys': 'noOfDocs ? noOfDocs : " 0 "',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"hireSlip": {
					"header": "HIRE SLIP",
					'bindingKeys': 'vendorDeal.loading_slip',
					"allowed": true,
					"visible": true,
					"ordering": true,
					"date": false
				},
				"branch": {
					"header": "BRANCH",
					'bindingKeys': 'branch.name',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"vendorComp": {
					"header": "VENDOR COMPANY",
					'bindingKeys': '(($user.client_allowed|filter:{"clientId":this.vendor.clientId})[0].name)',
					'eval': true,
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"lastUpdateTime": {
					"header": "LAST UPDATE TIME",
					'bindingKeys': 'last_modified_at',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"dealDate": {
					"header": "DEAL DATE",
					'bindingKeys': 'vendorDeal.deal_at',
					'date': 'dd-MMM-yyyy',
					"allowed": true,
					"visible": true,
					"ordering": true
				},
				"createdat": {
					"header": "CREATED AT",
					"bindingKeys": "created_at"
				}
			},
			"TripColumn": ['tripNo',
				'category',
				'type',
				'grNo',
				'tsNo',
				'vehNo',
				'vehType',
				'customer',
				'consignor',
				'consignee',
				'material',
				'vendor',
				// 'routeName',
				'intermittentPoint',
				'km',
				'route',
				'source',
				'destination',
				'tripStart',
				'tripEnd',
				'tripEntry',
				'ewayExpiry',
				'tripStatus',
				'ownership',
				'driverName',
				'noOfDocs',
				'hireSlip',
				'branch',
				'vendorComp',
				'lastUpdateTime',
				'dealDate',
				'createdat']
		},
		"Booking_Management_GR": {
			"GR": {
				"tripNo": {
					"header": "Trip No.",
					'bindingKeys': 'trip.trip_no',
					'date': false
				},
				"tripStartDate": {
					"header": "Trip Start Date",
					'bindingKeys': '((this.trip.statuses | filter:{"status": "Trip started"})[0].date | date:"dd-MMM-yyyy")',
					'eval': true,
					'date': 'dd-MMM-yyyy'
				},
				"tripEndDate": {
					"header": "Trip End Date",
					'bindingKeys': '((this.trip.statuses | filter:{"status": "Trip ended"})[0].date | date:"dd-MMM-yyyy")',
					'eval': true,
					'date': 'dd-MMM-yyyy'
				},

				"grNo": {
					"header": "Gr No.",
					'bindingKeys': 'grNumber',
					'date': false
				},
				"grDate": {
					"header": "Gr Date",
					'bindingKeys': 'grDate',
					'date': 'dd-MMM-yyyy'
				},
				"vehNo": {
					"header": "Vehicle No.",
					'bindingKeys': 'trip.vehicle_no',
					"date": false
				},
				"routeName": {
					"header": "Route Name",
					'bindingKeys': 'trip.route_name || trip.rName'
				},
				"GPS Location": {
					"header": "GPS Location",
					'bindingKeys': 'trip.vehicle.gpsData.addr || trip.vehicle.gpsData.address'
				},
				"billingRoute": {
					"header": "Billing Route",
					'bindingKeys': '(acknowledge.source && acknowledge.destination) ? (acknowledge.source) + " to "  + (acknowledge.destination) : "NA" '
				},
				"billingParty": {
					"header": "BillingParty",
					'bindingKeys': 'billingParty.name || booking.billingParty.name'
				},
				"intermittentPoint": {
					"header": "Intermittent Point",
					"filter": {
						'name': 'arrayOfIntermitPoint',
						'aParam': [
							'trip',
						]
					},
				},
				"materialCode": {
					"header": "Material Code",
					'bindingKeys': 'invoices[0].material.groupCode',
					date: false
				},
				"loadingDate": {
					"header": "Loading Date",
					// 'bindingKeys': '((statuses | filter:{"status": "Loading Ended"})[0].date | date:"dd-MMM-yyyy")',
					'bindingKeys': 'pod.billingLoadingTime',
					'date': 'dd-MMM-yyyy'
				},
				"unloadingDate": {
					"header": "Unloading Date",
					// 'bindingKeys': '((statuses | filter:{"status": "Unloading Ended"})[0].date | date:"dd-MMM-yyyy")',
					'bindingKeys': 'pod.billingUnloadingTime',
					'date': 'dd-MMM-yyyy'
				},
				"invNo": {
					"header": "Invoice No",
					'filter': {
						'name': 'arrayOfString',
						'aParam': [
							'invoices',
							'"invoiceNo"',
						]
					}
				},
				"invAmt": {
					"header": "Invoice Amount",
					'filter': {
						'name': 'arrayOfString',
						'aParam': [
							'invoices',
							'"invoiceAmt"',
						]
					}
				},
				"invDate": {
					"header": "Invoice Date",
					'bindingKeys': '(invoices[0].invoiceDate | date:"dd-MMM-yyyy")',
					'date': 'dd-MMM-yyyy'
				},
				"loadRefNo": {
					"header": "Load Ref. No",
					'filter': {
						'name': 'arrayOfString',
						'aParam': [
							'invoices',
							'"loadRefNumber"',
						]
					}
				},
				"km": {
					"header": "KM",
					'bindingKeys': 'invoices[0].routeDistance'
				},
				"noOfDocs": {
					"header": "NO OF DOCS",
					'bindingKeys': 'noOfDocs ? noOfDocs : " 0 "',
				},
				"received": {
					"header": "POD Hard Copy",
					'bindingKeys': 'this.pod.received ? "YES": "NO"',
				},
				"noOfDocs": {
					"header": "POD Soft Copy",
					'bindingKeys': 'noOfDocs ? noOfDocs : " 0 "',
				},
				"qty": {
					"header": "Qty",
					'filter': {
						'name': 'getArrayElementSum',
						'aParam': [
							'invoices',
							'"noOfUnits"',
						]
					}
				},
				"weight": {
					"header": "Weight(T)",
					'filter': {
						'name': 'getArrayElementSum',
						'aParam': [
							'invoices',
							'"weightPerUnit"',
						]
					}
				},
				"billingWeight": {
					"header": "BILLING WEIGHT",
					'filter': {
						'name': 'getArrayElementSum',
						'aParam': [
							'invoices',
							'"billingWeightPerUnit"',
						]
					}
				},
				"billingUnit": {
					"header": "BILLING UNIT",
					'filter': {
						'name': 'getArrayElementSum',
						'aParam': [
							'invoices',
							'"billingNoOfUnits"',
						]
					}
				},
				"rate": {
					"header": "Rate",
					'bindingKeys': 'invoices[0].rate||"NA"',
					'date':false

				},
				"freight": {
					"header": "Freight",
					'bindingKeys': 'basicFreight||"NA"',
					'date':false
				},
				"dphRate": {
					"header": "DPH Rate",
					'bindingKeys': 'invoices[0].dphRate || 0',
					'date': false
				},
				"dph": {
					"header": "DPH",
					'bindingKeys': '(invoices[0].rate * invoices[0].dphRate)/100 ||  0',
					'date': false
				},
				"dphIncludeGst": {
					"header": "DPH Include GST",
					'bindingKeys': 'iGST + (((invoices[0].rate * invoices[0].dphRate)/100)*iGST_percent)/100',
					'date': false
				},
				"totAmtwithDph": {
					"header": "Total Amt with DPH",
					'bindingKeys': '(invoices[0].rate * invoices[0].dphRate)/100  + invoices[0].rate + iGST + (((invoices[0].rate * invoices[0].dphRate)/100)*iGST_percent)/100',
					'date': false
				},

				"LoadingCharge":{
					"header": "Loading Charges",
					'bindingKeys': 'charges.loading_charges'
				},
				"UnLoadingCharge":{
					"header": "UnLoading Charges",
					'bindingKeys': 'charges.unloading_charges'
				},
				"totfreight": {
					"header": "Total Freight",
					'bindingKeys': 'totalFreight'
				},
				"totAmt": {
					"header": "Total Amount",
					'bindingKeys': 'totalAmount'
				},
				"DetAmt": {
					"header": " Detention Amount",
					'bindingKeys': 'charges.detentionLoading+charges.detentionUnloading'
				},
				"totSuppAmt": {
					"header": "Tot supply amount",
					'bindingKeys': 'supplementaryBill.totalFreight || "0"',
					'date': false
				},
				"mrRec": {
					"header": "MR Received",
					'bindingKeys': '((this.moneyReceipt.totalMrAmount || 0) + ((this.moneyReceipt.deduction|sumOfObject)|| 0)).toFixed(2) || "0"',
					'eval': true
				},
				"mrBalFrei": {
					"header": "MR Balance Freight",
					'bindingKeys': '(((this.totalAmount || 0) + (this.supplementaryBill.totalFreight || 0)  - ((this.moneyReceipt.totalMrAmount || 0) + ((this.moneyReceipt.deduction|sumOfObject)|| 0)).toFixed(2)) || "0")|roundOff',
					'eval': true
				},
				"mrChitStatus": {
					"header": "MR Chit Status",
					'bindingKeys': 'moneyReceipt.chitPending'
				},
				"gateoutDate": {
					"header": "Gate Out Date",
					'bindingKeys': 'gateoutDate',
					'date': 'dd-MMM-yyyy'
				},
				"reportDate": {
					"header": "Reporting Date",
					'bindingKeys': 'pod.unloadingArrivalTime',
					'date': 'dd-MMM-yyyy'
				},
				"paymentBasis": {
					"header": "Payment Basis",
					'bindingKeys': 'payment_basis || booking.payment_basis'
				},
				"paymentType": {
					"header": "Payment Type",
					'bindingKeys': 'payment_type || booking.payment_type'
				},
				"billNo": {
					"header": "Bill No",
					'bindingKeys': '(this.bill.billNo) || (this.provisionalBill.ref|arrayOfString:"billNo")',
					'eval': true
				},
				"billDate": {
					"header": "Bill Date",
					'bindingKeys': 'this.bill && (this.bill.billDate|arrayOfStringDate:"billDate") || (this.provisionalBill.ref|arrayOfStringDate:"billDate")',
					'date': 'dd-MMM-yyyy',
					'eval': true
				},
				"remark": {
					"header": "GR REMARK",
					'bindingKeys': 'remarks',
					'date': false
				},
				"arNo": {
					"header": "Ar No",
					'bindingKeys': 'pod.arNo',
					'date': false
				},
				"arDate": {
					"header": "Ar Date",
					'bindingKeys': 'pod.date',
					'date': 'dd-MMM-yyyy'
				},
				"branch": {
					"header": "Branch",
					'bindingKeys': 'branch.name'
				},
				"driver": {
					"header": "Driver Name",
					'bindingKeys': 'trip.driver.name || trip.vehicle.driver_name'
				},
				"incentive": {
					"header": "Incentive",
					'bindingKeys': 'charges.incentive'
				},
				"ewayBill": {
					"header": "EWAY BILLS",
					'filter': {
						'name': 'arrayOfString',
						'aParam': [
							'eWayBills',
							'"number"',
						]
					}
				},
				"ewayExpiry": {
					"header": "EWAY BILL EXPIRY",
					'bindingKeys': '(eWayBills[0].expiry | date:"dd-MMM-yyyy")',
					'date': 'dd-MMM-yyyy'
				},
				"unloadedBy": {
					"header": "Unloaded By",
					'bindingKeys': '((statuses | filter:{"status": "Unloading Ended"})[0].user_id.full_name)'
				},
				"podRem": {
					"header": "POD Remark",
					'bindingKeys': 'pod.arRemark'
				},
				"fpaAmt": {
					"header": "fpa amt",
					'bindingKeys': 'fpa.amt'
				},
				"fpaNo": {
					"header": "Fpa No",
					'bindingKeys': 'fpa.No'
				},
				"hireSlipNo": {
					"header": "HireSlip No",
					'bindingKeys': 'trip.vendorDeal.loading_slip'
				},
				"hireSlipTotPay": {
					"header": "HireSlip Total Payable",
					'bindingKeys': 'totpayable'
				},
				"incidental": {
					"header": "Incidental",
					'filter': {
						'name': 'arrayOfString',
						'aParam': [
							'in',
							'"amt"',
						]
					}
				},
				"customer": {
					"header": "Customer",
					'bindingKeys': 'customer.name || booking.customer.name'
				},
				"customerCategory": {
					"header": "customer Category",
					'bindingKeys': 'customer.category || booking.customer.category'
				},
				"consignor": {
					"header": "Consignor",
					'bindingKeys': 'consignor.name || booking.consignor.name'
				},
				"consignee": {
					"header": "Consignee",
					'bindingKeys': 'consignee.name || booking.consignee.name'
				},
				"billed": {
					"header": "Billed",
					'bindingKeys': '(this.bill||this.provisionalBill && this.provisionalBill.ref && this.provisionalBill.ref.length) ? "Yes" : "No"',
					'eval': true
				},
				"nonBillGr": {
					"header": "NonBillable Gr",
					'bindingKeys': '(this.isNonBillable) ? "Yes" : "No"',
					'eval': true
				},
				"company": {
					"header": "Company",
					'bindingKeys': '(($user.client_allowed|filter:{"clientId":this.billingParty.clientId||this.clientId})[0].name)',
					'eval': true
				},
				"ownership": {
					"header": "Ownership",
					'bindingKeys': 'trip.ownershipType'
				},
				"vehOwnerName": {
					"header": "Vehicle Owner Name",
					'bindingKeys': 'trip.vehicle.owner_name'
				},
				"vehOwnerGroup": {
					"header": "Fleet",
					'bindingKeys': 'trip.vehicle.owner_group'
				},
				"segment": {
					"header": "Segment",
					'bindingKeys': 'trip.segment_type'
				},
				"grRemark": {
					"header": "Gr Remark",
					'bindingKeys': 'remarks',
					'date': false
				},
				"grStatus": {
					"header": "Gr Status",
					'bindingKeys': 'status'
				},
				"materialName": {
					"header": "Material Name",
					'bindingKeys': 'invoices[0].material.groupName'
				},
				"source": {
					"header": "SOURCE",
					'bindingKeys': 'acknowledge.source'
				},
				"destination": {
					"header": "DESTINATION",
					'bindingKeys': 'acknowledge.destination'
				},

				"ref1": {
					"header": "REF1",
					'bindingKeys': 'invoices[0].ref1'
				},
				"ref2": {
					"header": "REF2",
					'bindingKeys': 'invoices[0].ref2'
				},
				"ref3": {
					"header": "REF3",
					'bindingKeys': 'invoices[0].ref3'
				},
				"ref4": {
					"header": "REF4",
					'bindingKeys': 'invoices[0].ref4'
				},
				"num1": {
					"header": "NUM1",
					'filter': {
						'name': 'arrayOfString',
						'aParam': [
							'invoices',
							'"num1"',
						]
					}
				},
				"num2": {
					"header": "NUM2",
					'filter': {
						'name': 'arrayOfString',
						'aParam': [
							'invoices',
							'"num2"',
						]
					}
				},
				"num3": {
					"header": "NUM3",
					'filter': {
						'name': 'arrayOfString',
						'aParam': [
							'invoices',
							'"num3"',
						]
					}
				},
				"totalFreight": {
					"header": "TOTAL FREIGHT",
					'bindingKeys': 'totalFreight'
				},
				"internalRate": {
					"header": "INTERNAL RATE",
					'bindingKeys': 'internal_rate'
				},
				"podUpdatedBy":{
					"header": "POD UPATED BY",
					'bindingKeys' : 'pod.user.full_name'
				},
				"podUpdatedAt" :{
					"header": "POD UPATED AT",
					'bindingKeys' : 'pod.systemDate'
				},
				"entryBy": {
					"header": "ENTRY BY",
					'bindingKeys': 'created_by_full_name'
				},
				"entryAt": {
					"header": "ENTRY AT",
					'bindingKeys': 'created_at | date:"dd-MMM-yyyy"'
				},
				"lastModifiedBy": {
					"header": "lastModified BY",
					'bindingKeys': 'last_modified_by'
				},
				"lastModifiedAt": {
					"header": "lastModified AT",
					'bindingKeys': 'last_modified_at | date:"dd-MMM-yyyy"'
				}

			},
			"GRColumn": ['tripNo',
				'tripStartDate',
				'tripEndDate',
				'grNo',
				'grDate',
				'vehNo',
				'routeName',
				'GPS Location',
				'billingRoute',
				'intermittentPoint',
				'billingParty',
				'materialCode',
				'loadingDate',
				'unloadingDate',
				'invNo',
				'invAmt',
				'invDate',
				'loadRefNo',
				'km',
				'noOfDocs',
				'received',
				'qty',
				'weight',
				'billingWeight',
				'billingUnit',
				'rate',
				'freight',
				'dphRate',
				'dph',
				'dphIncludeGst',
				'totAmtwithDph',
				'LoadingCharge',
				'UnLoadingCharge',
				'totfreight',
				'totAmt',
				'DetAmt',
				'totSuppAmt',
				'mrRec',
				'mrBalFrei',
				'mrChitStatus',
				'gateoutDate',
				'reportDate',
				'paymentBasis',
				'paymentType',
				'billNo',
				'billDate',
				'remark',
				'arNo',
				'arDate',
				'branch',
				'driver',
				'incentive',
				'ewayBill',
				'ewayExpiry',
				'unloadedBy',
				'podRem',
				'fpaAmt',
				'fpaNo',
				'hireSlipNo',
				'hireSlipTotPay',
				'incidental',
				'customer',
				'consignor',
				'consignee',
				'billed',
				'nonBillGr',
				'company',
				'ownership',
				'vehOwnerName',
				'vehOwnerGroup',
				'segment',
				'grRemark',
				'grStatus',
				'materialName',
				'source',
				'destination',
				'ref1',
				'ref2',
				'ref3',
				'ref4',
				'num1',
				'num2',
				'num3',
				'totalFreight',
				'internalRate',
				'podUpdatedBy',
				'podUpdatedAt',
				'entryBy',
				'entryAt',
				'lastModifiedBy',
				'lastModifiedAt',

			]
		},
		"Account_Management_Voucher": {
			"Voucher": {
				"category": {
					"header": "Category",
					'bindingKeys': 'vT'
				},
				"vchType": {
					"header": "Vch Type",
					'bindingKeys': 'type'
				},
				"date": {
					"header": "Date",
					'bindingKeys': 'date'
				},
				"refNo": {
					"header": "Reference",
					'bindingKeys': 'refNo',
					'date': false
				},
				"creditAc": {
					"header": "CREDIT AC",
					html: true,
					filter: {
						name: 'trustAsHtml',
						aParam: ['crAc']
					}
				},
				"crAmt": {
					"header": "CR Amt",
					html: true,
					filter: {
						name: 'trustAsHtml',
						aParam: ['crAmt']
					}
				},
				"debitAc": {
					"header": "DEBIT AC",
					html: true,
					filter: {
						name: 'trustAsHtml',
						aParam: ['drAc']
					}
				},
				"drAmt": {
					"header": "DR Amt",
					html: true,
					filter: {
						name: 'trustAsHtml',
						aParam: ['drAmt']
					}
				},
				"narration": {
					"header": "Narration",
					'bindingKeys': 'narration',
					'date': false
				},
				"billNo": {
					"header": "Bill No",
					'bindingKeys': 'billNo',
					'date': false
				},
				"branch": {
					"header": "Branch",
					'bindingKeys': 'branch.name'
				},
				"payDate": {
					"header": "Pay Date",
					'bindingKeys': 'paymentDate || chequeDate'
				},
				"payRef": {
					"header": "Pay Ref",
					'bindingKeys': 'paymentRef',
					'date': false
				},
				"payMode": {
					"header": "Pay Mode",
					'bindingKeys': 'paymentMode'
				},
				"reversedBy": {
					"header": "Reversed By",
					'bindingKeys': 'by'
				},
				"reversedAt": {
					"header": "Reversed At",
					'bindingKeys': 'at'
				},
				"createdBy": {
					"header": "Created By",
					'bindingKeys': 'createdBy'
				},
				"createdAt": {
					"header": "Created At",
					'bindingKeys': 'created_at'
				},
				"lastModifiedAt": {
					"header": "last modified At",
					'bindingKeys': 'last_modified_at'
				},
				"lastModifiedBy": {
					"header": "last modified By",
					'bindingKeys': 'last_modified_by_name'
				},
				"tallyExportBy": {
					"header": "Tally Export By",
					'bindingKeys': 'acExp.by'
				},
				"reversed": {
					"header": "Reversed",
					'bindingKeys': ''
				},
				"checkClearDate": {
					"header": "Check Clear Date",
					'bindingKeys': 'chequeClear.date',
					'date': true
				},
				"checkClearRemark": {
					"header": "Check Clear Remark",
					'bindingKeys': 'chequeClear.rem'
				}
			},
			"VoucherColumn": ['category',
				'vchType',
				'date',
				'refNo',
				'creditAc',
				'crAmt',
				'debitAc',
				'drAmt',
				'narration',
				'billNo',
				'branch',
				'payDate',
				'payRef',
				'payMode',
				'reversedBy',
				'reversedAt',
				'createdBy',
				'createdAt',
				'lastModifiedAt',
				'lastModifiedBy',
				'tallyExportBy',
				'reversed',
				'checkClearDate',
				'checkClearRemark'
			]
		},
		"Billing_Management_GENBill": {
			"GENBill": {
				"billNo":{
					'header': 'Bill No.',
					'bindingKeys': 'billNo',
					'date': false
				},
				"grNo":{
					'header': 'Gr No.',
					'filter': {
						'name': 'getGrNumber',
						'aParam': [
							'items',
							'"gr"',
						]
					}
				},
				"tMemoNo":{
					'header': 'TMemo No.',
					'filter': {
						'name': 'getTMNumber',
						'aParam': [
							'items',
							'"gr"',
							'"tMemo"',
							'"tMNo"'
						]
					}
				},
				"billType":{
					'header': 'Bill Type',
					'bindingKeys': 'type'
				},
				"status":{
					'header': 'Status',
					'bindingKeys': 'status'
				},
				"billingParty":{
					'header': 'Billing Party',
					'bindingKeys': 'billingParty.name'

				},
				"billingPartyAc":{
					'header': 'Billing Party A/C',
					'bindingKeys': 'billingParty.account.name'
				},
				"billingDate":{
					'header': 'Billing Date',
					'bindingKeys': 'billDate',
					'date': 'dd-MMM-yyyy'
				},
				"dueDate":{
					'header': 'Due Date',
					'bindingKeys': 'dueDate | date:"dd-MMM-yyyy"',
					'date': 'dd-MMM-yyyy'
				},
				"allocatedFreight":{
					'header': 'Allocated Freight',
					'bindingKeys': 'amount'
				},
				"cGSTPercent":{
					'header': 'CGST %',
					'bindingKeys': 'cGST_percent',
				},
				"sGSTPercent":{
					'header': 'SGST %',
					'bindingKeys': 'sGST_percent',
				},
				"iGSTPercent":{
					'header': 'IGST %',
					'bindingKeys': 'iGST_percent',
				},
				"cGST":{
					'header': 'CGST',
					'bindingKeys': 'cGST',
				},
				"sGST":{
					'header': 'SGST',
					'bindingKeys': 'sGST'
				},
				"iGST":{
					'header': 'IGST',
					'bindingKeys': 'iGST'
				},
				"totalTax":{
					'header': 'Total Tax',
					'bindingKeys': 'iGST ? iGST: cGST + sGST'
				},
				"billAmt":{
					'header': 'Bill Amount',
					'bindingKeys': 'billAmount'
				},
				"dphBillTotal":{
					'header': 'DPH Bill Amount',
					'bindingKeys': 'dphfinalAmount'
				},
				"amtReceived":{
					'header': 'Amount Received',
					//'bindingKeys': '(this | calReceivedAmt)|roundOff',
					'bindingKeys': '(this.recAmt || 0)|roundOff',
					'eval': true
				},
				"dueAmt":{
					'header': 'Due Amount',
					//'bindingKeys': '((this.billAmount - (this | calReceivedAmt)) || 0)|roundOff',
					'bindingKeys': '(this.totDueAmt || 0)|roundOff',
					'eval': true

				},
				"mrNo":{
					'header': 'MR No',
					'filter': {
						'name': 'arrayOfString',
						'aParam': [
							'receiving.moneyReceipt',
							'"mrNo"',
						]
					}
				},
				"coverNoteNo":{
					'header': 'CoverNote No',
					'bindingKeys': 'coverNote.cnNo',
					'date': false
				},
				"creditNoteNo":{
					'header': 'Credit Note No',
					'bindingKeys': 'this.creditNo',
					'date': false
				},
				"category":{
					'header': 'Category',
					'bindingKeys': 'this.category',
					'date': false
				},
				"createdBy":{
					'header': 'Created By',
					'bindingKeys': 'created_by_name',
					'date': false
				},
				"createdAt":{
					'header': 'Created At',
					'bindingKeys': 'created_at | date:"dd-MMM-yyyy"',
					'date': 'dd-MMM-yyyy'
				},
				"lastModifiedAt":{
					'header': 'Last Modified At',
					'bindingKeys': 'last_modified_at | date:"dd-MMM-yyyy"',
					'date': 'dd-MMM-yyyy'
				},
				"lastModifiedBy" :{
					'header': 'Last Modified By',
					'bindingKeys': 'last_modified_by',
					'date': false
				},
				"billRemark":{
					'header': 'Bill Remark',
					'bindingKeys': 'remarks',
				},
				"remark":{
					'header': 'Remark',
					'bindingKeys': '(this | currentStatusRemark)',
					 eval: true
				}
			},
			"GENBillColumn": [
				'billNo',
				'grNo',
				'tMemoNo',
				'billType',
				'status',
				'billingParty',
				'billingPartyAc',
				'billingDate',
				'dueDate',
				'allocatedFreight',
				'cGSTPercent',
				'sGSTPercent',
				'iGSTPercent',
				'cGST',
				'sGST',
				'iGST',
				'totalTax',
				'billAmt',
				'dphBillTotal',
				'amtReceived',
				'dueAmt',
				'mrNo',
				'coverNoteNo',
				'creditNoteNo',
				'category',
				'createdBy',
				'createdAt',
				'lastModifiedAt',
				'lastModifiedBy',
				'billRemark',
				'remark',
			]
		}
	};


	return TABLEDETAILCONF;


	//  return function (data) {
	// 	let allowedColumnArr = [];
	//     let tableName = TABLEDETAILCONF.Booking_Management_Trip.Trip;
	// 	TABLEDETAILCONF.forEach(o => {
	// 		if(data[o.extractionKey])
	//         allowedColumnArr.push(`${o.key}: ${data[o.extractionKey]}`);
	// 	});

	// 	return allowedColumnArr.join('; ');
	// }

	// return obj;
});
