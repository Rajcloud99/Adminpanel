materialAdmin.factory('commonTableSettingFactory', ['$timeout', function($timeout) {

	let  TABLEDETAILCONF = {};
	TABLEDETAILCONF = {
		"Booking_Management_TripAdv": {
			"TripAdv": {
				"tripNo": {
					"header":"TRIP NO.",
					'bindingKeys': 'trip_no'
				},
				"vehNo": {
					"header":"VEHICLE NO",
					"bindingKeys": 'vehicle_no',
					"date": false
				},
				"advanceType": {
					"header":"ADVANCE TYPE",
					"bindingKeys": 'advanceType'
				},
				"category": {
					"header":"CATEGORY",
					'bindingKeys': 'category'
				},
				"person": {
					"header":"PERSON",
					'bindingKeys': 'person'
				},
				"date": {
					"header":"DATE",
					'bindingKeys': 'date',
					'date': 'dd-MMM-yyyy'
				},
				"amount": {
					"header":"AMOUNT",
					'bindingKeys': 'amount.toFixed(2)'
				},
				"creditAc": {
					"header":"Credit Ac",
					'bindingKeys': 'from_account.name'
				},
				"debitAc": {
					"header":"Debit Ac",
					'bindingKeys': 'to_account.name',
				},
				"dieseInfoLtr": {
					"header":"TOTAL DIESEL(LIT.)",
					'bindingKeys': 'dieseInfo.litre.toFixed(2)',
				},
				"dieseInfoRt": {
					"header":"DIESEL RATE",
					'bindingKeys': 'dieseInfo.rate.toFixed(2)',
				},
				"billNo": {
					"header":"Bill No",
					'bindingKeys': 'bill_no',
					'date': false
				},
				"refNo": {
					"header":"Reference No",
					'bindingKeys': 'reference_no',
					'date': false
				},
				"driverName": {
					"header":"Driver",
					'bindingKeys': 'driver.nameCode || driver.name'
				},
				"vendorName": {
					"header":"Vendor",
					'bindingKeys': 'dieseInfo._vendorName'
				},
				"vehicleOwnerName": {
					"header":"Vehicle Owner Name",
					'bindingKeys': 'vehicle.owner_name'
				},
				"branchName": {
					"header":"Branch",
					'bindingKeys': 'branch.name'
				},
				"purchaseBill": {
					"header":"DIESEL Bill",
					'bindingKeys': 'purchaseBill ? "Yes" : "No"'
				},
				"noOfDays": {
					"header":"No Of Days",
					'bindingKeys':"('calDays'|dateUtilsFilt:(created_at || uploaded_at):date) || '0'",
					'date': false
				},
				"remark": {
					"header":"Remark",
					'bindingKeys': '(narration || "").concat("  ",(remark || ""))'
				},
				"status": {
					"header":"Status",
					'bindingKeys': 'status'
				},
				"reversedBy": {
					"header":"Reversed By",
					'bindingKeys': 'reversed_by'
				},
				"reversedAt": {
					"header":"Reversed At",
					'bindingKeys': 'reversed_at',
 				},
				"reversed": {
					"header":"Reversed",
					'bindingKeys': 'reversed ? "Yes" : "No"',
				},
				"createdBy": {
					"header":"Entry By",
					'bindingKeys': 'created_by.full_name',
				},
				"createdAt": {
					"header":"Entry Date",
					'bindingKeys': 'created_at || uploaded_at',
					'date': 'dd-MMM-yyyy'
				},
				"modificationby": {
					"header":"Modification By",
					'bindingKeys': 'last_modified_by_name'
				},
				"modificationDate": {
					"header":"Modification Date",
					'bindingKeys': 'last_modified_at',
					'date': 'dd-MMM-yyyy'
				}
			},
			"TripAdvColumn": ['tripNo',
				'vehNo',
				'advanceType',
				'category',
				'person',
				'date',
				'amount',
				'creditAc',
				'debitAc',
				'dieseInfoLtr',
				'dieseInfoRt',
				'billNo',
				'refNo',
				'driverName',
				'vendorName',
				'vehicleOwnerName',
				'branchName',
				'purchaseBill',
				'noOfDays',
				'status',
				'remark',
				'reversedBy',
				'reversedAt',
				'reversed',
				'createdBy',
				'createdAt',
				'modificationby',
				'modificationDate']
		}
	};

	return TABLEDETAILCONF;

}]);
