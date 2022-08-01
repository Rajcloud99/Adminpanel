/**
 * Created by manish on 9/8/16.
 */
materialAdmin.factory('constants', function () {

	var constants = {

		client_front_end_id: "1001",

		employeeStatus: ["Temporary", "Permanent"],

		religion: ["Hinduism", "Islam", "Sikhism", "Christianity", "Buddhism", "Jainism", "Judaism", "Other"],

		gender: ["Male", "Female", "Other"],

		bloodGroupTypes: ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"],

		formula: {
			"Total Payable": "totWithMunshiyana+totalCharges-totalDeduction-tdsAmount-extChargesTdsAmount",
			"Total TDS": "tdsAmount+extChargesTdsAmount",
			"Remaining Amount": "totalPayable-tAdv",
			"Total With Munshiyana": "munshiyana+total_expense"
		},

		client_allowed: [
			{
				"clientId": "10808",
				"name": "DGFC FCM",
				"state_code": "06"
			},
			{
				"clientId": "11009",
				"name": "DGFC RCM",
				"state_code": "07"
			},
			{
				"clientId": "11108",
				"name": "DG Freight Corp",
				"state_code": "06"
			},
			{
				"clientId": "10909",
				"name": "DAPL",
				"state_code": "06"
			}
		],

		aCreditNoteTemplate: [
			{
				name: 'CREDIT NOTE',
				key: "CARV_CREDIT_NOTE_Print_format"
			},
			// {
			// 	name: 'CREDIT NOTE',
			// 	key: "CREDIT_NOTE_Print_format"
			// }, {
			// 	name: 'CREDIT NOTE 2',
			// 	key: "Credit_note2_format"
			// }, {
			// 	name: 'Usha Credit Note',
			// 	key: "DGD_Usha_Credit_Note"
			// },
		],

		aDebitNoteTemplate: [
			{
				name: 'DEBIT NOTE',
				key: "MMP_DEBIT_NOTE_Print_format"
			}
		],

		aPurchaseBillTemplate: [
			{
				name: 'PURCHASE BILL',
				key: "DGFC_PurchaseBillPreview"
			}],

		user_type: ["Driver", "Supervisor", "Trip Manager", "Mechanic", "Marketing Manager", "Employee", "POapprover",
			"PRapprover", "QuotApprover", "SOApprover", "InvoiceApprover", "Dealer", "Customer", "Branch Admin", "Transporter", "Broker", 'SalesExecutive', 'Loading Babu'],

		maritalStatusTypes: ["Married", "Single", "Widow", "Widower"],

		educationTypes: ["Primary", "Secondary", "Senior secondary", "Graduate", "Post graduate", "Diploma", "Doctorate"],

		branchTypes: ["Headquarters", "Regional Head Office", "State Head Office", "Inland Office", "Overseas Office"],

		routeTypes: ["One way", "Two way"],

		aReport: ['DLP', 'DUP', 'RTP', 'RTP Expense', 'Detail RTP'],

		aSettlementReport: ['RT Settled Report'],

		aReportType: ['Bill Report', 'Bill Ledger Transaction Report', 'OutStanding Report (Customer)', 'OutStanding Monthly Report', 'Billing Party Monthly Report', 'Billingparty Group Report', 'Advance Date wise count report', 'Advance Date wise amount report', 'MR Deduction Report', 'CN Deduction Report', 'MR And CN Deduction Report', 'Monthly Deduction', 'GST Sales'],

		tdsSources: [{
			"section": "193",
			"source": "Interest on Securities"
		}, {
			"section": "194",
			"source": "Dividend"
		}, {
			"section": "194A",
			"source": "Interest other than interest on securities"
		}, {
			"section": "194 C",
			"source": "Payments to contractors and sub-contractors"
		}, {
			"section": "194D",
			"source": "Insurance Commission"
		}, {
			"section": "194DA",
			"source": "Payment in respect of life insurance policy"
		}, {
			"section": "194EE",
			"source": "Payments in respect of deposits under National Savings Scheme"
		}, {
			"section": "194F",
			"source": "Payments on account of re-purchase of Units by Mutual Funds or UTI"
		}, {
			"section": "194 J",
			"source": "Fees for Professional or Technical Services"
		}, {
			"section": "194 J",
			"source": "Tds on Professional Fee(Under sec-206AB/206CCA)"
		},
			{
				"section": "206AB/206CCA",
				"source": "TDS Deduction Under Section Sec- 206AB/206CCA"
			}, {
				"section": "94I",
				"source": "94I - Rent"
			},{
				"section": "6CR",
				"source": "6CR - TCS on sale of Goods"
			},{
				"section": "94Q",
				"source": "94Q - Deduction of tax at source on payment of certain sum for purchase of goods"
			}
		],

		// tdsCategory1: ['Individual', 'HUF', 'Firm','Company Public Interested', 'Company not public interested', 'Company Private'],
		tdsCategory: ['Individuals or HUF', 'Non Individual/corporate'],

		modelConfigs: {
			RATE_CHART: {
				effectiveDate: {
					label: 'EFFECTIVE DATE',
					ourLabel: 'EFFECTIVE DATE',
					type: '__date__',
					visible: true,
					editable: true,
				},
				source: {
					label: 'SOURCE',
					ourLabel: 'SOURCE',
					type: 'text',
					visible: true,
					editable: true,
				},
				destination: {
					label: 'DESTINATION',
					ourLabel: 'DESTINATION',
					type: 'text',
					visible: true,
					editable: true,
				},
				materialGroupCode: {
					label: 'Material Group Code',
					ourLabel: 'Material Group Code',
					type: 'text',
					visible: true,
					editable: true,
				},
				baseRate: [],
				routeDistance: {
					label: 'Route KMs',
					ourLabel: 'Route KMs',
					type: 'number',
					visible: true,
					editable: true,
				},
				paymentBasis: {
					label: 'Payment Basis',
					ourLabel: 'Payment Basis',
					type: 'text',
					enum: ['Fixed', 'PUnit', 'PMT', 'Percentage'],
					visible: true,
					editable: true,
				},
				'baseValueLabel': {
					label: 'Base Value Label',
					ourLabel: 'Base Value Label',
					type: 'text',
					// enum: [40, 65],
					visible: true,
					editable: true,
				},
				'baseValue': {
					label: 'Base Value',
					ourLabel: 'Base Value',
					type: 'number',
					// enum: [40, 65],
					visible: true,
					editable: true,
				},
				rate: {
					label: 'Rate',
					ourLabel: 'Rate',
					type: 'number',
					visible: true,
					editable: true,
				},
				unit: {
					label: 'Unit',
					ourLabel: 'Unit',
					type: 'number',
					visible: true,
					editable: true,
				},
				invoiceRate: {
					label: 'Invoice Rate',
					ourLabel: 'Invoice Rate',
					type: 'number',
					visible: true,
					editable: true,
				},
				insurRate: {
					label: 'Insurance Rate',
					ourLabel: 'Insurance Rate',
					type: 'number',
					visible: true,
					editable: true,
				},
				'grCharges.rate': {
					label: 'GR Charges',
					ourLabel: 'GR Charges',
					type: 'number',
					visible: true,
					editable: true,
				},
				'grCharges.basis': {
					label: 'GR Charges Basis',
					ourLabel: 'GR Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'surCharges.rate': {
					label: 'Sur Charges',
					ourLabel: 'Sur Charges',
					type: 'number',
					visible: true,
					editable: true,
				},
				'surCharges.basis': {
					label: 'Sur Charges Basis',
					ourLabel: 'Sur Charges Basis',
					type: 'text',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'cartageCharges.rate': {
					label: 'Cartage Charges',
					ourLabel: 'Cartage Charges',
					type: 'number',
					visible: true,
					editable: true,
				},
				'cartageCharges.basis': {
					label: 'Cartage Charges Basis',
					ourLabel: 'Cartage Charges Basis',
					type: 'text',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'labourCharges.rate': {
					label: 'Labour Charges',
					ourLabel: 'Labour Charges',
					type: 'number',
					visible: true,
					editable: true,
				},
				'labourCharges.basis': {
					label: 'Labour Charges Basis',
					ourLabel: 'Labour Charges Basis',
					type: 'text',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'otherCharges.rate': {
					label: 'Other Charges',
					ourLabel: 'Other Charges',
					type: 'number',
					visible: true,
					editable: true,
				},
				'otherCharges.basis': {
					label: 'Other Charges Basis',
					ourLabel: 'Other Charges Basis',
					type: 'text',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'prevFreightCharges.rate': {
					label: 'Prev Freight Charges',
					ourLabel: 'Prev Freight Charges',
					type: 'number',
					visible: true,
					editable: true,
				},
				'prevFreightCharges.basis': {
					label: 'Prev Freight Charges Basis',
					ourLabel: 'Prev Freight Charges Basis',
					type: 'text',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'detentionLoading.rate': {
					label: 'Detention Loading Rate',
					ourLabel: 'Detention Loading Rate',
					type: 'number',
					visible: true,
					editable: true,
				},
				'detentionLoading.basis': {
					label: 'Detention Loading Basis',
					ourLabel: 'Detention Loading Basis',
					type: 'text',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'detentionUnloading.rate': {
					label: 'Detention Unloading Rate',
					ourLabel: 'Detention Unloading Rate',
					type: 'number',
					visible: true,
					editable: true,
				},
				'detentionUnloading.basis': {
					label: 'Detention Unloading Basis',
					ourLabel: 'Detention Unloading Basis',
					type: 'text',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'discount.rate': {
					label: 'Discount',
					ourLabel: 'Discount',
					type: 'number',
					visible: true,
					editable: true,
				},
				'discount.basis': {
					label: 'Discount Basis',
					ourLabel: 'Discount Basis',
					type: 'text',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'loading_charges.rate': {
					label: 'Loading Charges',
					ourLabel: 'Loading Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'loading_charges.basis': {
					label: 'Loading Charges Basis',
					ourLabel: 'Loading Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'unloading_charges.rate': {
					label: 'Unloading Charges',
					ourLabel: 'Unloading Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'unloading_charges.basis': {
					label: 'Unloading Charges Basis',
					ourLabel: 'Unloading Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'weightman_charges.rate': {
					label: 'WeightMan Charges',
					ourLabel: 'WeightMan Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'weightman_charges.basis': {
					label: 'WeightMan Charges Basis',
					ourLabel: 'WeightMan Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'overweight_charges.rate': {
					label: 'OverWeight Charges',
					ourLabel: 'OverWeight Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'overweight_charges.basis': {
					label: 'OverWeight Charges Basis',
					ourLabel: 'OverWeight Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'advance_charges.rate': {
					label: 'Advance Charges',
					ourLabel: 'Advance Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'advance_charges.basis': {
					label: 'Advance Charges Basis',
					ourLabel: 'Advance Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'damage.rate': {
					label: 'Damage Charges',
					ourLabel: 'Damage Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'damage.basis': {
					label: 'Damage Charges Basis',
					ourLabel: 'Damage Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'incentive.rate': {
					label: 'Incentive Charges',
					ourLabel: 'Incentive Charges',
					type: 'number',
					visible: true,
					editable: true,
				},
				'incentive.basis': {
					label: 'Incentive Charges Basis',
					ourLabel: 'Incentive Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed', 'Percent'],
					visible: true,
					editable: false,
				},
				'shortage.rate': {
					label: 'Shortage Charges',
					ourLabel: 'Shortage Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'shortage.basis': {
					label: 'Shortage Charges Basis',
					ourLabel: 'Shortage Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'penalty.rate': {
					label: 'Penalty Charges',
					ourLabel: 'Penalty Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'penalty.basis': {
					label: 'Penalty Charges Basis',
					ourLabel: 'Penalty Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'extra_running.rate': {
					label: 'Extra Charges',
					ourLabel: 'Extra Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'extra_running.basis': {
					label: 'Extra Charges Basis',
					ourLabel: 'Extra Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'dala_charges.rate': {
					label: 'Dala Charges',
					ourLabel: 'Dala Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'dala_charges.basis': {
					label: 'Dala Charges Basis',
					ourLabel: 'Dala Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'diesel_charges.rate': {
					label: 'Diesel Charges',
					ourLabel: 'Diesel Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'diesel_charges.basis': {
					label: 'Diesel Charges Basis',
					ourLabel: 'Diesel Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'kanta_charges.rate': {
					label: 'Kanta Charges',
					ourLabel: 'Kanta Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'kanta_charges.basis': {
					label: 'Kanta Charges Basis',
					ourLabel: 'Kanta Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'factory_halt.rate': {
					label: 'Factory Halt Charges',
					ourLabel: 'Factory Halt Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'factory_halt.basis': {
					label: 'Factory Halt Charges Basis',
					ourLabel: 'Factory Halt Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'company_halt.rate': {
					label: 'Company Halt Charges',
					ourLabel: 'Company Halt Charges',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'company_halt.basis': {
					label: 'Company Halt Charges Basis',
					ourLabel: 'Company Halt Charges Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'toll_charges.rate': {
					label: 'Toll Tax',
					ourLabel: 'Toll Tax',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'toll_charges.basis': {
					label: 'Toll Tax Basis',
					ourLabel: 'Toll Tax Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'internal_rate.rate': {
					label: 'Internal Rate',
					ourLabel: 'Internal Rate',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'internal_rate.basis': {
					label: 'Internal Rate Basis',
					ourLabel: 'Internal Rate Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'green_tax.rate': {
					label: 'Green Tax ',
					ourLabel: 'Green Tax ',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'green_tax.basis': {
					label: 'Green Tax Basis',
					ourLabel: 'Green Tax Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'twoPtDelivery.rate': {
					label: 'Two Point Delivery ',
					ourLabel: 'Two Point Delivery ',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'twoPtDelivery.basis': {
					label: 'Two Point Delivery Basis',
					ourLabel: 'Two Point Delivery Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
				'standardTime.rate': {
					label: 'Standard Days ',
					ourLabel: 'Standard Days ',
					type: 'number',
					enum: ['Fixed'],
					visible: true,
					editable: true,
				},
				'standardTime.basis': {
					label: 'Standard Days Basis',
					ourLabel: 'Standard Days Basis',
					type: 'text',
					enum: ['Percent of basic freight', 'Fixed'],
					visible: true,
					editable: true,
				},
			},
			GR: {
				branch: {
					label: 'Branch',
					ourLabel: 'Branch',
					type: 'string',
					visible: false,
					editable: true,
					req: true,
				},
				gr_type: {
					label: 'Gr Type',
					ourLabel: 'Gr Type',
					type: 'string',
					visible: false,
					editable: true,
				},
				grNumber: {
					label: 'Gr Number',
					ourLabel: 'Gr Number',
					type: 'string',
					visible: false,
					editable: true,
					req: true,
				},
				grDate: {
					label: 'Gr Date',
					ourLabel: 'Gr Date',
					type: '__date__',
					visible: false,
					editable: true,
					req: true,
				},
				grRemarks: {
					label: 'Gr Remark',
					ourLabel: 'Gr Remark',
					type: 'string',
					visible: false,
					editable: true,
				},
				customer: {
					label: 'Customer',
					ourLabel: 'Customer',
					type: 'string',
					visible: false,
					editable: true,
					req: true,
				},
				consignor: {
					label: 'Consignor',
					ourLabel: 'Consignor',
					type: 'string',
					visible: false,
					editable: true,
					req: true,
				},
				consignee: {
					label: 'Consignee',
					ourLabel: 'Consignee',
					type: 'string',
					visible: false,
					editable: true,
					req: true,
				},
				billingParty: {
					label: 'Billing Party',
					ourLabel: 'Billing Party',
					type: 'string',
					visible: false,
					editable: true,
					req: true,
				},
				payment_basis: {
					label: 'Payment Basis',
					ourLabel: 'Payment Basis',
					type: 'string',
					visible: false,
					editable: true,
					req: true,
				},
				payment_type: {
					label: 'Payment Type',
					ourLabel: 'Payment Type',
					type: 'string',
					visible: false,
					editable: true,
					req: true,
				},
				container: {
					label: 'Container',
					ourLabel: 'Container',
					type: 'string',
					visible: false,
					editable: true,
					req: false,
				},
				internal_rate: {
					label: 'Internal Rate',
					ourLabel: 'Internal Rate',
					type: 'string',
					visible: false,
					editable: true,
				},
				loadingArrivalTime: {
					label: 'Loading Arrival',
					ourLabel: 'Loading Arrival',
					type: 'string',
					visible: false,
					editable: true,
				},
				billingLoadingTime: {
					label: 'Loading End',
					ourLabel: 'Loading End',
					type: 'string',
					visible: false,
					editable: true,
				},
				unloadingArrivalTime: {
					label: 'Unloading Arrival',
					ourLabel: 'Unloading Arrival',
					type: 'string',
					visible: false,
					editable: true,
				},
				billingUnloadingTime: {
					label: 'Unloading End',
					ourLabel: 'Unloading End',
					type: 'string',
					visible: false,
					editable: true,
				},
				standardDays: {
					label: 'Standard Days',
					ourLabel: 'Standard Days',
					type: 'string',
					visible: false,
					editable: true,
				},
				chargeableDays: {
					label: 'Chargeable Days',
					ourLabel: 'Chargeable Days',
					type: 'string',
					visible: false,
					editable: true,
				},
				source: {
					label: 'Source',
					ourLabel: 'Source',
					type: 'string',
					visible: false,
					editable: true,
					req: true,
				},
				destination: {
					label: 'Destination',
					ourLabel: 'Destination',
					type: 'string',
					visible: false,
					editable: true,
					req: true,
				},
				destinationState: {
					label: 'Destination State',
					ourLabel: 'Destination State',
					type: 'string',
					visible: false,
					editable: true,
				},
				billedSource: {
					label: 'Billed Source',
					ourLabel: 'Billed Source',
					type: 'string',
					visible: false,
					editable: true,
					req: true,
				},
				billedDestination: {
					label: 'Billed Destination',
					ourLabel: 'Billed Destination',
					type: 'string',
					visible: false,
					editable: true,
					req: true,
				},
				arRemark: {
					label: 'POD Remark',
					ourLabel: 'POD Remark',
					type: 'string',
					visible: false,
				},
				isGrBillable: {
					label: 'Is Gr Billable',
					ourLabel: 'Is Gr Billable',
					type: 'checkbox',
					visible: false,
					editable: true,
				},
				totFreight: {
					label: 'Trip Total Freight',
					ourLabel: 'Trip Total Freight',
					type: 'string',
					visible: false,
					editable: true,
				},
				totFreightWithCharges: {
					label: 'Trip Total Freight with Charges',
					ourLabel: 'Trip Total Freight with Charges',
					type: 'string',
					visible: false,
					editable: true,
				},
				totQty: {
					label: 'Trip Total Qty',
					ourLabel: 'Trip Total Qty',
					type: 'string',
					visible: false,
					editable: true,
				},
				showOnBill: {
					label: 'Show On Bill',
					ourLabel: 'Show On Bill',
					type: 'string',
					visible: false,
					editable: true,
				},
				materialName: {
					label: 'Material',
					ourLabel: 'Material',
					type: 'string',
					visible: false,
					editable: true,
					req: true,
				},
				materialUnit: {
					label: 'Material Unit',
					ourLabel: 'Material Unit',
					type: 'string',
					visible: false,
					editable: true,
				},
				invoiceNo: {
					label: 'Invoice No.',
					ourLabel: 'Invoice No.',
					type: 'string',
					visible: false,
					editable: true,
				},
				dphRate: {
					label: 'DPH Rate',
					ourLabel: 'DPH Rate',
					type: 'number',
					visible: false,
					editable: true,
				},
				invoiceRate: {
					label: 'Invoice Rate',
					ourLabel: 'Invoice Rate',
					type: 'number',
					visible: false,
					editable: true,
				},
				invoiceAmt: {
					label: 'Invoice Amount',
					ourLabel: 'Invoice Amount',
					type: 'number',
					visible: false,
					editable: true,
				},
				invoiceDate: {
					label: 'Invoice Date',
					ourLabel: 'Invoice Date',
					type: '__date__',
					visible: false,
					editable: true,
				},
				gateoutDate: {
					label: 'Gateout Date',
					ourLabel: 'Gateout Date',
					type: '__date__',
					visible: false,
					editable: true,
				},
				gatePassDate: {
					label: 'GatePass Date',
					ourLabel: 'GatePass Date',
					type: '__date__',
					visible: false,
					editable: true,
				},
				insurRate: {
					label: 'Insurance Rate',
					ourLabel: 'Insurance Rate',
					type: 'number',
					visible: false,
					editable: true,
				},
				insurVal: {
					label: 'Insurance Value',
					ourLabel: 'Insurance Value',
					type: 'number',
					visible: false,
					editable: true,
				},
				loadRefNumber: {
					label: 'Load Ref. Number',
					ourLabel: 'Load Ref. Number',
					type: 'string',
					visible: false,
					editable: true,
				},
				routeDistance: {
					label: 'Km',
					ourLabel: 'Km',
					type: 'number',
					visible: false,
					editable: true,
				},
				rate: {
					label: 'Rate',
					ourLabel: 'Rate',
					type: 'number',
					visible: false,
					editable: true,
					req: true,
				},
				billingRate: {
					label: 'Billing Rate',
					ourLabel: 'Billing Rate',
					type: 'number',
					visible: false,
					editable: true,
				},
				weightPerUnit: {
					label: 'Actual Weight',
					ourLabel: 'Actual Weight',
					type: 'number',
					visible: false,
					editable: true,
				},
				billingWeightPerUnit: {
					label: 'Billing Weight',
					ourLabel: 'Billing Weight',
					type: 'number',
					visible: false,
					editable: true,
				},
				capacity: {
					label: 'Capacity',
					ourLabel: 'Capacity',
					type: 'number',
					visible: false,
					editable: true,
					customValue: true,
					req: true,
				},
				noOfUnits: {
					label: 'Actual Unit',
					ourLabel: 'Actual Unit',
					type: 'number',
					visible: false,
					editable: true,
				},
				billingNoOfUnits: {
					label: 'Billing Unit',
					ourLabel: 'Billing Unit',
					type: 'number',
					visible: false,
					editable: true,
				},
				freight: {
					label: 'Freight',
					ourLabel: 'Freight',
					type: 'computable',
					visible: false,
					editable: true,
				},
				invPayBasis: {
					label: 'Pay. Basis',
					ourLabel: 'Pay. Basis',
					type: 'string',
					visible: false,
					editable: false,
				},
				ref1: {
					label: 'Item Ref 1',
					ourLabel: 'Item Ref 1',
					type: 'string',
					visible: false,
					editable: true,
				},
				ref2: {
					label: 'Item Ref 2',
					ourLabel: 'Item Ref 2',
					type: 'string',
					visible: false,
					editable: true,
				},
				ref3: {
					label: 'Item Ref 3',
					ourLabel: 'Item Ref 3',
					type: 'string',
					editable: true,
				},
				ref4: {
					label: 'Item Ref 4',
					ourLabel: 'Item Ref 4',
					type: 'string',
					editable: true,
				},
				ref5: {
					label: 'Item Ref 5',
					ourLabel: 'Item Ref 5',
					type: 'string',
					editable: true,
				},
				ref6: {
					label: 'Item Ref 6',
					ourLabel: 'Item Ref 6',
					type: 'string',
					editable: true,
				},
				num1: {
					label: 'Num 1',
					ourLabel: 'Num 1',
					type: 'number',
					editable: true,
				},
				num2: {
					label: 'Num 2',
					ourLabel: 'Num 2',
					type: 'number',
					editable: true,
				},
				num3: {
					label: 'Num 3',
					ourLabel: 'Num 3',
					type: 'number',
					editable: true,
				},
				basicFreight: {
					label: 'Basic Freight',
					ourLabel: 'Basic Freight',
					type: 'number',
					visible: true,
					editable: true,
				},
				num4: {
					label: 'Base Value 1',
					ourLabel: 'Base Value 1',
					type: 'number',
					editable: true,
				},
				num5: {
					label: 'Base Value 5',
					ourLabel: 'Base Value 5',
					type: 'number',
					editable: true,
				},
				num6: {
					label: 'Base Value 6',
					ourLabel: 'Base Value 6',
					type: 'number',
					editable: true,
				},
				grCharges: {
					label: 'Gr Charges',
					ourLabel: 'Gr Charges',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				surCharges: {
					label: 'Surcharge',
					ourLabel: 'Surcharge',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				cartageCharges: {
					label: 'Cartage Charge',
					ourLabel: 'Cartage Charge',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				labourCharges: {
					label: 'Labour Charge',
					ourLabel: 'Labour Charge',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				prevFreightCharges: {
					label: 'Prev Freight Charge',
					ourLabel: 'Prev Freight Charge',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				discount: {
					label: 'Discount',
					ourLabel: 'Discount',
					type: 'number',
					deduction: true,
					notApplyTax: false,
					visible: false,
					editable: true,
				},
				loading_charges: {
					label: 'Loading Charges',
					ourLabel: 'Loading Charges',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				unloading_charges: {
					label: 'Unloading Charges',
					ourLabel: 'Unloading Charges',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				loading_amount: {
					label: 'Loading Amount',
					ourLabel: 'Loading Amount',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				unloading_amount: {
					label: 'Unloading Amount',
					ourLabel: 'Unloading Amount',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				weightman_charges: {
					label: 'Weightman Charges',
					ourLabel: 'Weightman Charges',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				overweight_charges: {
					label: 'Overweight Charges',
					ourLabel: 'Overweight Charges',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				advance_charges: {
					label: 'Advance Charges',
					ourLabel: 'Advance Charges',
					type: 'number',
					deduction: true,
					notApplyTax: false,
					visible: false,
					editable: true,
				},
				damage: {
					label: 'Damage Charges',
					ourLabel: 'Damage Charges',
					type: 'number',
					deduction: true,
					notApplyTax: false,
					visible: false,
					editable: true,
				},
				detentionLoading: {
					label: 'Loading Detention',
					ourLabel: 'Loading Detention',
					type: 'number',
					deduction: true,
					notApplyTax: false,
					visible: false,
					editable: true,
				},
				detentionUnloading: {
					label: 'Unloading Detention',
					ourLabel: 'Unloading Detention',
					type: 'number',
					deduction: true,
					notApplyTax: false,
					visible: false,
					editable: true,
				},
				incentivePercent: {
					label: 'Incentive Percent',
					ourLabel: 'Incentive Percent',
					type: 'number',
					visible: false,
				},
				incentive: {
					label: 'Incentive',
					ourLabel: 'Incentive',
					notApplyTax: false,
					type: 'number',
					visible: false,
				},
				shortage: {
					label: 'Shortage Charges',
					ourLabel: 'Shortage Charges',
					type: 'number',
					deduction: true,
					notApplyTax: false,
					visible: false,
					editable: true,
				},
				penalty: {
					label: 'Penalty Charges',
					ourLabel: 'Penalty Charges',
					type: 'number',
					deduction: true,
					notApplyTax: false,
					visible: false,
					editable: true,
				},
				other_charges: {
					label: 'Other Charges',
					ourLabel: 'Other Charges',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				extra_running: {
					label: 'Extra Charges',
					ourLabel: 'Extra Charges',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				dala_charges: {
					label: 'Dala Charges',
					ourLabel: 'Dala Charges',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				kanta_charges: {
					label: 'Kanta Charges',
					ourLabel: 'Kanta Charges',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				factory_halt: {
					label: 'Factory Halt',
					ourLabel: 'Factory Halt',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				company_halt: {
					label: 'Company Halt',
					ourLabel: 'Company Halt',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				toll_charges: {
					label: 'Toll Charges',
					ourLabel: 'Toll Charges',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				green_tax: {
					label: 'Green Tax',
					ourLabel: 'Green Tax',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				ttDelay: {
					label: 'TT Delay',
					ourLabel: 'TT Delay',
					type: 'number',
					deduction: true,
					notApplyTax: false,
					visible: false,
					editable: true,
				},
				twoPtDelivery: {
					label: 'Two Point Delivery',
					ourLabel: 'Two Point Delivery',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				diesel_charges: {
					label: 'Diesel Charge',
					ourLabel: 'Diesel Charge',
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				diesel_index: {
					label: 'Diesel Index',
					ourLabel: 'Diesel Index',
					type: 'number',
					visible: false,
					editable: true,
				},
				freightWithDiesel: {
					label: 'Basic Freight(Diesel)',
					ourLabel: 'Basic Freight(Diesel)',
					notApplyTax: false,
					type: 'computable',
					visible: false,
					editable: false,
				},
				nbLoading: {
					label: 'Non Billable Loading',
					ourLabel: 'NB Loading',
					type: 'number',
					isNonBillable: false,
					visible: false,
					editable: true,
				},
				nbUnLoading: {
					label: 'Non Billable Unloading',
					ourLabel: 'NB Unloading',
					type: 'number',
					visible: false,
					isNonBillable: false,
					editable: true,
				},
				nbDala: {
					label: 'Non Billable Dala',
					ourLabel: 'NB Dala Charges',
					type: 'number',
					visible: false,
					isNonBillable: false,
					editable: true,
				},
				nbKanta: {
					label: 'Non Billable Kanta',
					ourLabel: 'NB Kanta Charges',
					type: 'number',
					visible: false,
					isNonBillable: false,
					editable: true,
				},
				nbToll: {
					label: 'Non Billable Toll',
					ourLabel: 'NB Toll Charges',
					type: 'number',
					visible: false,
					isNonBillable: false,
					editable: true,
				},
				nbGrCharges: {
					label: 'Non Billable GrCharges',
					ourLabel: 'NB Gr Charges',
					type: 'number',
					visible: false,
					isNonBillable: false,
					editable: true,
				},
				nbGreen_tax: {
					label: 'Non Billable GreenTax',
					ourLabel: 'NB Green Tax',
					type: 'number',
					visible: false,
					isNonBillable: false,
					editable: true,
				},
				nbTwoPtDelivery: {
					label: 'Non Billable TwoPt Delivery',
					ourLabel: 'NB TwoPt Delivery',
					type: 'number',
					visible: false,
					isNonBillable: false,
					editable: true,
				},
				nbLabourCharges: {
					label: 'Non Billable Labour',
					ourLabel: 'NB Labour Charges',
					type: 'number',
					visible: false,
					isNonBillable: false,
					editable: true,
				},
				nbOther: {
					label: 'Non Billable Other',
					ourLabel: 'NB Other Charges',
					type: 'number',
					visible: false,
					isNonBillable: false,
					editable: true,
				},
				isSupplementaryShow: {
					label: 'Is Supplementary Show',
					ourLabel: 'Is Supplementary Show',
					notApplyTax: false,
					type: 'checkbox',
					visible: false,
					editable: true,
				},
				suppRate: {
					label: 'Supp Rate',
					ourLabel: 'Supp Rate',
					type: 'number',
					isSupplymentry: true,
					modelKey: 'rate',
					visible: false,
					editable: true,
				},
				suppRouteDistance: {
					label: 'Supp Route Distance',
					ourLabel: 'Supp Route Distance',
					type: 'number',
					isSupplymentry: true,
					modelKey: 'routeDistance',
					visible: false,
					editable: false,
				},
				suppIncentivePercent: {
					label: 'Supp Incentive Percent',
					ourLabel: 'Supp Incentive Percent',
					isSupplymentry: true,
					type: 'number',
					visible: false,
				},
				suppGrCharges: {
					label: 'Supp Gr Charges',
					ourLabel: 'Supp Gr Charges',
					isSupplymentry: true,
					modelKey: 'grCharges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppTtDelay: {
					label: 'Supp TT Delay',
					ourLabel: 'Supp TT Delay',
					isSupplymentry: true,
					modelKey: 'ttDelay',
					deduction: true,
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				suppSurCharges: {
					label: 'Supp SurCharges',
					ourLabel: 'Supp SurCharges',
					isSupplymentry: true,
					modelKey: 'surCharges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppCartageCharges: {
					label: 'Supp Cartage Charge',
					ourLabel: 'Supp Cartage Charge',
					isSupplymentry: true,
					modelKey: 'cartageCharges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppLabourCharges: {
					label: 'Supp Labour Charge',
					ourLabel: 'Supp Labour Charge',
					isSupplymentry: true,
					modelKey: 'labourCharges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppPrevFreightCharges: {
					label: 'Supp Prev Freight Charge',
					ourLabel: 'Supp Prev Freight Charge',
					isSupplymentry: true,
					modelKey: 'prevFreightCharges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppDiscount: {
					label: 'Supp Discount',
					ourLabel: 'Supp Discount',
					isSupplymentry: true,
					modelKey: 'discount',
					deduction: true,
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				suppLoading_charges: {
					label: 'Supp Loading Charges',
					ourLabel: 'Supp Loading Charges',
					isSupplymentry: true,
					modelKey: 'loading_charges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppUnloading_charges: {
					label: 'Supp Unloading Charges',
					ourLabel: 'Supp Unloading Charges',
					isSupplymentry: true,
					modelKey: 'unloading_charges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppWeightman_charges: {
					label: 'Supp Weightman Charges',
					ourLabel: 'Supp Weightman Charges',
					isSupplymentry: true,
					modelKey: 'weightman_charges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppOverweight_charges: {
					label: 'Supp Overweight Charges',
					ourLabel: 'Supp Overweight Charges',
					isSupplymentry: true,
					modelKey: 'overweight_charges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppAdvance_charges: {
					label: 'Supp Advance Charges',
					ourLabel: 'Supp Advance Charges',
					isSupplymentry: true,
					modelKey: 'advance_charges',
					deduction: true,
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				suppDamage: {
					label: 'Supp Damage Charges',
					ourLabel: 'Supp Damage Charges',
					isSupplymentry: true,
					modelKey: 'damage',
					deduction: true,
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				suppIncentive: {
					label: 'Supp Incentive',
					ourLabel: 'Supp Incentive',
					isSupplymentry: true,
					modelKey: 'incentive',
					type: 'number',
					visible: false,
				},
				suppShortage: {
					label: 'Supp Shortage Charges',
					ourLabel: 'Supp Shortage Charges',
					isSupplymentry: true,
					modelKey: 'shortage',
					deduction: true,
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				suppPenalty: {
					label: 'Supp Penalty Charges',
					ourLabel: 'Supp Penalty Charges',
					isSupplymentry: true,
					modelKey: 'penalty',
					deduction: true,
					notApplyTax: false,
					type: 'number',
					visible: false,
					editable: true,
				},
				suppOther_charges: {
					label: 'Supp Other Charges',
					ourLabel: 'Supp Other Charges',
					isSupplymentry: true, modelKey: 'other_charges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppExtra_running: {
					label: 'Supp Extra Charges',
					ourLabel: 'Supp Extra Charges',
					isSupplymentry: true,
					modelKey: 'extra_running',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppDala_charges: {
					label: 'Supp Dala Charges',
					ourLabel: 'Supp Dala Charges',
					isSupplymentry: true,
					modelKey: 'dala_charges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppKanta_charges: {
					label: 'Supp Kanta Charges',
					ourLabel: 'Supp Kanta Charges',
					isSupplymentry: true,
					modelKey: 'kanta_charges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppFactory_halt: {
					label: 'Supp Factory Halt',
					ourLabel: 'Supp Factory Halt',
					isSupplymentry: true,
					modelKey: 'factory_halt',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppCompany_halt: {
					label: 'Supp Company Halt',
					ourLabel: 'Supp Company Halt',
					isSupplymentry: true,
					modelKey: 'company_halt',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppToll_charges: {
					label: 'Supp Toll Charges',
					ourLabel: 'Supp Toll Charges',
					isSupplymentry: true,
					modelKey: 'toll_charges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppGreen_tax: {
					label: 'Supp Green Tax',
					ourLabel: 'Supp Green Tax',
					isSupplymentry: true,
					modelKey: 'green_tax',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppTwoPtDelivery: {
					label: 'Supp Two Point Delivery',
					ourLabel: 'Supp Two Point Delivery',
					isSupplymentry: true,
					modelKey: 'twoPtDelivery',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppDiesel_charges: {
					label: 'Supp Diesel Charge',
					ourLabel: 'Supp Diesel Charge',
					isSupplymentry: true,
					modelKey: 'diesel_charges',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppDetentionLoading: {
					label: 'Supp Loading Detention',
					ourLabel: 'Supp Loading Detention',
					isSupplymentry: true,
					modelKey: 'detentionLoading',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppDetentionUnloading: {
					label: 'Supp Unloading Detention',
					ourLabel: 'Supp Unloading Detention',
					isSupplymentry: true,
					modelKey: 'detentionUnloading',
					type: 'number',
					visible: false,
					editable: true,
				},
				suppBasicFreight: {
					label: 'Supp basicFreight',
					ourLabel: 'Supp basicFreight',
					isSupplymentry: true,
					modelKey: 'basicFreight',
					type: 'number',
					visible: false,
					editable: true,
				},
				eWayBillNum: {
					label: 'Eway Bill',
					ourLabel: 'Eway Bill',
					type: 'computable',
					visible: false,
					editable: true,
					req: true
				},
				eWayBillExp: {
					label: 'Eway Bill Exp',
					ourLabel: 'Eway Bill Exp',
					type: '__date__',
					visible: false,
					editable: true,
					req: true
				},
				detentionLoadingRate: {
					label: 'Detention Loading Rate',
					ourLabel: 'Detention Loading Rate',
					type: 'computable',
					visible: false,
					editable: true,
				},
				detentionUnloadingRate: {
					label: 'Detention Unloading Rate',
					ourLabel: 'Detention Unloading Rate',
					type: 'computable',
					visible: false,
					editable: true,
				}
			},
		},

		aReportTypeConfig: {
			DLP: {
				filter: [
					{
						name: 'from'
					},
					{
						name: 'to'
					}
				],

				tableHeader: {
					Vehicle_No: {
						name: 'Vehicle No',
						key: 'vehicle_no',
						type: 'string',
					},
					Trip_Start: {
						name: 'Trip Start',
						key: 'trip_start_status.date',
						type: '__date__',
					},
					Segment: {
						name: 'Segment',
						key: 'segment_type',
						type: 'string',
					},
					trip_no: {
						name: 'Trip No',
						key: 'trip_no',
						type: 'string',
					},
					Route: {
						name: 'Route',
						key: 'route_name',
						type: 'string',
					},
					KM: {
						name: 'KM',
						key: 'route.route_distance',
						type: 'number',
					},
					Revenue: {
						name: 'Revenue',
						key: 'internal_freight',
						type: 'number',
					},
					Revenue_KM: {
						name: 'Revenue/KM',
						key: 'this["revenue/km"]',
						type: 'number',
						eval: true
					},
					cashAdvance: {
						name: 'Advance cash',
						key: 'tAdv.cashAdvance',
						type: 'number',
					},
					dieselAdvance: {
						name: 'Advance diesel',
						key: 'tAdv.dieselAdvance',
						type: 'number'
					},
					totalAdvance: {
						name: 'Total Advance',
						key: 'tAdv.totalAdvance',
						type: 'number'
					},
					Adv_km: {
						name: 'Advance/KM',
						key: 'this["adv/km"]',
						type: 'number'
					},
					Profit: {
						name: 'Profit',
						key: 'profit',
						type: 'number',
					},
					Profit_KM: {
						name: 'Profit/KM',
						key: 'this["profit/km"]',
						type: 'number',
						eval: true
					},
				},

				summary: {
					'tInternal_freight': {
						label: 'Total Internal Freight',
						type: 'number',
						key: 'tInternal_freight',
						visible: true,
					},
					'tTotalKM': {
						label: 'Total KM',
						type: 'number',
						key: 'tTotalKM',
						visible: true,
					},
					'tTotal_expense': {
						label: 'Total Expense',
						type: 'number',
						key: 'tTotal_expense',
						visible: true,
					},
					'tTotal_profit': {
						label: 'Total Profit',
						type: 'number',
						key: 'tTotal_profit',
						visible: true,
					},
					'tripsCount': {
						label: 'Total Trips',
						type: 'number',
						key: 'tripsCount',
						visible: true,
					},
				},

				api: {
					'name': 'getDlpDupReport'
				}

			},
			DUP: {
				filter: [
					{
						name: 'from'
					},
					{
						name: 'to'
					}
				],

				tableHeader: {
					Vehicle_No: {
						name: 'Vehicle No',
						key: 'vehicle_no',
						type: 'string',
					},
					Trip_Start: {
						name: 'Trip Start',
						key: 'trip_start_status.date',
						type: '__date__',
					},
					Segment: {
						name: 'Segment',
						key: 'segment_type',
						type: 'string',
					},
					trip_no: {
						name: 'Trip No',
						key: 'trip_no',
						type: 'string',
					},
					Route: {
						name: 'Route',
						key: 'route_name',
						type: 'string',
					},
					KM: {
						name: 'KM',
						key: 'route.route_distance',
						type: 'number',
					},
					Revenue: {
						name: 'Revenue',
						key: 'internal_freight',
						type: 'number',
					},
					Revenue_KM: {
						name: 'Revenue/KM',
						key: 'this["revenue/km"]',
						type: 'number',
						eval: true
					},
					cashAdvance: {
						name: 'Advance cash',
						key: 'tAdv.cashAdvance',
						type: 'number',
					},
					dieselAdvance: {
						name: 'Advance diesel',
						key: 'tAdv.dieselAdvance',
						type: 'number'
					},
					totalAdvance: {
						name: 'Total Advance',
						key: 'tAdv.totalAdvance',
						type: 'number'
					},
					Adv_km: {
						name: 'Advance/KM',
						key: 'this["adv/km"]',
						type: 'number'
					},
					Profit: {
						name: 'Profit',
						key: 'profit',
						type: 'number',
					},
					Profit_KM: {
						name: 'Profit/KM',
						key: 'this["profit/km"]',
						type: 'number',
						eval: true
					},
				},

				summary: {
					'tInternal_freight': {
						label: 'Total Internal Freight',
						type: 'number',
						key: 'tInternal_freight',
						visible: true,
					},
					'tTotalKM': {
						label: 'Total KM',
						type: 'number',
						key: 'tTotalKM',
						visible: true,
					},
					'tTotal_expense': {
						label: 'Total Expense',
						type: 'number',
						key: 'tTotal_expense',
						visible: true,
					},
					'tTotal_profit': {
						label: 'Total Profit',
						type: 'number',
						key: 'tTotal_profit',
						visible: true,
					},

				},

				api: {
					'name': 'getDlpDupReport'
				}

			},
			'Job Order Report': {
				filter: [
					{
						name: 'from'
					},
					{
						name: 'to'
					},
					{
						name: 'vehicle'
					}
				],

				tableHeader: {
					Trip_Route_Name: {
						name: 'Trip/Route Name',
						key: 'route_name || "NA"',
						type: 'string',
					},
					Vehicle_Number: {
						name: 'Vehicle Number',
						key: 'vehicle_no || "NA"',
						type: 'string',
					},
					Device_Serial_No: {
						name: 'Device Serial No',
						key: 'device && device.imei || "NA"',
						type: 'string',
					},
					Group: {
						name: 'Group',
						key: 'vendor && vendor.name || "NA"',
						type: 'string',
					},
					Drive_Name: {
						name: 'Driver Name',
						key: 'driver && driver.name || "NA"',
						type: 'string',
					},
					Driver_Number: {
						name: 'Driver Number',
						key: 'driver && driver.prim_contact_no || "NA"',
						type: 'number',
					},
					Start_Date: {
						name: 'StartDate',
						key: 'start_date || "NA"',
						type: '__date__',
					},
					Origin: {
						name: 'Origin',
						key: 'source || "NA"',
						type: 'string',

					},
					Destination: {
						name: 'Destination',
						key: 'destination || "NA"',
						type: 'string',
					},
					Arrival_Date_Time_At_Origin: {
						name: 'Arrival Date & Time At Origin',
						key: 'sourceEntryDate || "NA"',
						type: '__date__'
					},
					Departure_Date_Time_From_Origin: {
						name: 'Arrival Date From Origin',
						key: 'sourceExitDate || "NA"',
						type: '__date__'
					},
					Loading_Duration: {
						name: 'Loading Duration',
						key:'loadingDuration || "0"',
						type: 'string',
						date:false,
					},
					Arrival_Date_Time_At_Destination: {
						name: 'Arrival Date & Time At Destination',
						key: 'destEntryDate|| "NA"',
						type: '__date__'
					},
					Departure_Time_From_Destination: {
						name: 'Departure Time From Destination',
						key: '(destExitDate)? destExitDate: end_date || "NA "',
						type: '__date__'
					},
					Unloading_Duration: {
						name: 'Unloading Duration',
						key: 'unLoadingDuration|| "0"',
						type: 'string',
						date:false
					},
					Job_Status: {
						name: 'Job Status',
						key: 'end_date ? "COMPLETED": "IN PROGRESS"',
						type: 'number'
					},
					Vehicle_Status: {
						name: 'Vehicle Status',
						key: 'end_date ? "UNLOADING": "LOADING"',
						type: 'string'
					},
					Scheduled_Distance: {
						name: 'Scheduled Distance (km)',
						key: 'scheduleDistance || "NA"',
						type: 'string',
					},
					Job_Distance: {
						name: 'Job Distance (km)',
						key: 'jobDistance || "0"',
						type: 'string',
						date:false
					},
					Delay: {
						name: 'Delay',
						key: 'delay || "0"',
						type: 'string',
						date:false,
					},
					Job_ETA_Status: {
						name: 'Job ETA Status',
						key: 'jobEta || "NA"',
						type: 'string',
					},
					Job_End_Date: {
						name: 'Job End Date',
						key: 'end_date || "NA"',
						type: 'date',
					},
					Duration: {
						name: 'Duration',
						key: 'duration || "0"',
						type: 'string',
						date:false,
					},
					Stop_Time: {
						name: 'Stop Time',
						key: 'stopTime || "NA"',
						type: 'string',
					},
					Current_Location: {
						name: 'Current Location',
						key: 'currentLocation || "NA"',
						type: 'string',
					},
					Current_Status: {
						name: 'Current Status',
						key: 'currentStatus || "NA"',
						type: 'string',
					},
					Job_Completed: {
						name: '% Job Completed',
						key: 'jobCompleted || "NA"',
						type: 'string',
					},
					Remaining_Km_To_Next_Point: {
						name: 'Remaining Km To Next Point',
						key: 'remainKM || "NA"',
						type: 'string',
					},
					Expected_time_Of_Arrival: {
						name: 'Expected Time Of Arrival',
						key: 'expectedArrival || "0"',
						type: 'string',
						date:false
					},
					Predicted_Delay: {
						name: 'predectedDelay',
						key: 'predectedDelay || "0"',
						type: 'string',
						date:false
					},
					TAT: {
						name: 'TAT',
						key:  '(tat_hr || "00") + " : " + (tat_min || "00")',
						type: 'string',
					},
					Actual_TAT: {
						name: 'Actual TAT',
						key: 'actualTAT || "0"',
						type: 'number',
						date:false
					},
					Vehicle_State: {
						name: 'Vehicle State',
						key: 'end_date ? "UNLOADING": "LOADING"',
						type: 'string',
					},
					job_Created_On: {
						name: 'job Created On',
						key: 'created_at',
						type: 'string',
					},
					Seal_Present: {
						name: 'Seal Present',
						key: 'sealStatus || "Pending" ',
						type: 'string',
					},
					Hard_acceleration: {
						name: 'Hard acceleration',
						key: '(ha && ha.count)?  ha.count : "0"',
						type: 'number',
						date:false,
					},
					Hard_deceleration: {
						name: 'Hard deceleration',
						key: 'hb && hb.count || "0"' ,
						type: 'number',
						date:false,
					},
					Idling: {
						name: 'Idling',
						key: 'playBack && playBack.num_idle || "0"',
						type: 'number',
						date:false,
					},
					Overspeeding: {
						name: 'Overspeeding',
						key: 'over_speed && over_speed.count || "0"',
						type: 'number',
						date:false,
					},
				},

				api: {
					'name': 'getjobOrderreport'
				}

			},
			'Job Order Risky Report': {
				filter: [
					{
						name: 'from'
					},
					{
						name: 'to'
					},
					{
						name: 'vehicle'
					}
				],

				tableHeader: {
					Job_Name: {
						name: 'Job Name',
						key: 'route_name || "NA"',
						type: 'string',
					},
					Trip_id: {
						name: 'Trip id',
						key: 'trip_no || "NA"',
						type: 'number',
					},
					Job_start_date: {
						name: 'Job start date',
						key: 'start_date || "NA"',
						type: '__date__',
					},
					Vehicle_Number: {
						name: 'Vehicle Number',
						key: 'vehicle_no  || "NA"',
						type: 'string',
					},
					Transporter_Name: {
						name: 'Transporter Name',
						key: 'vendor && vendor.name || "NA"',
						type: 'string',
					},
					Drive_Name: {
						name: 'Driver Name',
						key: 'driver && driver.name || "NA"',
						type: 'string',
					},
					Driver_Number: {
						name: 'Driver Number',
						key: 'driver && driver.prim_contact_no || "NA"',
						type: 'number',
					},
					Stoppage_30_m: {
						name: 'Stoppage >=30 m',
						key: 'stoppage || "NA"',
						type: 'string',
					},
					Idle_Stoppage_30_m: {
						name: 'Idle Stoppage >=30 m',
						key: 'idleStoppage|| "NA"',
						type: 'string',
						'Date':false,
					},
					Distance: {
						name: 'Distance',
						key: 'distance || "NA"',
						type: 'string',
					},
					TAT_In_Hours: {
						name: 'TAT In Hours',
						key: 'tat_hr || "00"',
						type: 'number',
						date:false,
					},
					TAT_In_Minutes: {
						name: 'TAT In Minutes',
						key: 'tat_min || "00"',
						type: 'number',
						date:false,
					},
					Risky_Point_10_m: {
						name: 'Risky Point >=10 m',
						key: 'riskyPoints || "NA"',
						type: 'string',
					},
					Stoppage_30_m_1: {
						name: 'Stoppage >=30 m',
						key: 'stoppage1 || "NA"',
						type: 'string',
					},
					Distance1: {
						name: 'Distance',
						key: 'distance1 || "NA"',
						type: 'string',
					},
					Delay_Jobs: {
						name: 'Delay Jobs',
						key: 'delayJobs1 || "NA"',
						type: 'string',
					},
					Risky_Points: {
						name: 'Risky Points',
						key: 'riskyPoints2 || "NA"',
						type: 'string',
					},
					Total_Score: {
						name: 'Total Score',
						key: 'totalScore || "NA"',
						type: 'string',
					},
					Grade: {
						name: 'Grade',
						key: 'grade || "NA"',
						type: 'string',
					},
					Risk_Level: {
						name: 'Risk Level',
						key: 'riskLevel || "NA"',
						type: 'string',
					},
					Job_Transit_Time_In_Minutes: {
						name: 'Job Transit Time In Minutes',
						key: 'dur || "NA"',
						type: 'string',
					},

					Job_Transit_Time: {
						name: 'Job Transit Time',
						key: 'jobTransitTime || "NA"',
						type: 'string',
					},
					Job_End_Date: {
						name: 'Job End Date',
						key: 'end_date || "NA"',
						type: '__date__',
					},
					Power_Disconnect_Events_Count: {
						name: 'Power Disconnect Events Count',
						key: 'power_cut && oData.power_cut.count || "0"',
						type: 'number',
						date:false,
					},
					Zig_Zag_Stop: {
						name: 'Zig Zag Stop',
						key: '"FALSE"',
						type: 'string',
					},
				},


				api: {
					'name': 'getjobOrderriskreport'
				}

			},
			'Job Order Power Report': {
				filter: [
					{
						name: 'from'
					},
					{
						name: 'to'
					},
					{
						name: 'vehicle'
					}
				],

				tableHeader: {
					Job_Name: {
						name: 'Job Name',
						key: 'route_name || "NA"',
						type: 'string',
					},
					Job_id: {
						name: 'Job id',
						key: 'trip_no || "NA"',
						type: 'number',
					},
					Vehicle_Number: {
						name: 'Vehicle Number',
						key: 'vehicle_no || "NA"',
						type: 'string',
					},
					Power_Disconnect_Time: {
						name: 'Power Disconnect Time',
						key: 'powerCut || "NA"',
						type: '__date__',
					},
					Power_Disconnect_Location: {
						name: 'Power Disconnect Location',
						key: 'powerCutLocation || "NA"',
						type: '__date__',
					},
					Power_Reconnect_Time: {
						name: 'Power Reconnect Time',
						key: 'powerReconnect || "NA"',
						type: '__date__',
					},
					Power_Reconnect_Location: {
						name: 'Power Disconnect Location',
						key: 'powerReconnectLocation || "NA"',
						type: '__date__',
					},
					Disconnect_Duration: {
						name: 'Disconnect Duration (In min)',
						key:'dur||"0"',
						type: 'number',
						date:false
					},
					Disconnect_distance_In_km: {
						name: 'Disconnect distance (In km)',
						key:'disConnectDistance||"0"',
						type: 'number',
						date:false
					},
				},


				api: {
					'name': 'getjobOrderpowercutreport'
				}

			},
			// Expense Report
			'RTP Expense': {
				filter: [
					{
						name: 'from'
					},
					{
						name: 'to'
					},
					{
						name: 'RT No'
					},
					{
						name: 'Segment Type'
					}
				],
				tableHeader: {
					RT_No: {
						name: 'RT No',
						key: '_id',
						type: 'number',
					},
					/*RT_Date: {
						name: 'RT Date',
						key: 'trips.slice(-1)[0].advSettled.date',
						type: '__date__',
					},*/
					Settlement_Date: {
						name: 'Settlement Date',
						key: 'trips.slice(-1)[0].markSettle.date',
						type: '__date__',
						date: 'dd-MMM-yyyy'
					},
					Vehicle_No: {
						name: 'Vehicle No',
						key: 'trips.slice(-1)[0].vehicle_no',
						type: 'string',
					},
					Driver: {
						name: 'Driver',
						key: 'trips.slice(-1)[0].driver.name',
						type: 'string',
					},
					Trip_Start: {
						name: 'RT Start',
						key: 'firstTripStart.date',
						type: '__date__',
						date: 'dd-MMM-yyyy'
					},
					Trip_End: {
						name: 'RT End',
						key: 'lastTripEnd.date',
						type: '__date__',
						date: 'dd-MMM-yyyy'
					},
					// Segment: {
					// 	name: 'Segment',
					// key: 'trips.slice(-1)[0].segment_type',
					// key: 'allSegments.join(", ")',
					// type: 'string',
					// },
					fleet: {
						name: 'Fleet',
						key: 'trips.slice(-1)[0].vehicle.owner_group',
						type: 'string',
					},
					// Vehicle_Type: {
					// 	name: 'Vehicle Type',
					// 	key: 'trips.slice(-1)[0].vehicle.veh_type_name',
					// 	type: 'string',
					// },
					Total_KM: {
						name: 'Total KM',
						key: 'totalKM',
						type: 'number',
					},
					Advance: {
						name: 'Advance',
						key: 'total_advance',
						type: 'number',
					},
					TT_days: {
						name: 'TT days',
						key: 'rtElapsed.toFixed(0)',
						type: 'string',
						date: false
					},
					Revenue: {
						name: 'Revenue',
						key: 'total_internal_freight',
						type: 'number',
					},
					Revenue_KM: {
						name: 'Revenue/KM',
						key: 'this["revenue/km"]',
						type: 'number',
						eval: true
					},
					Expense: {
						name: 'Expense',
						key: 'netExpense',
						type: 'number',
					},
					Expense_KM: {
						name: 'Expense/KM',
						key: 'this["expense/km"]',
						type: 'number',
						eval: true
					},
					Profit: {
						name: 'Profit',
						key: 'total_actual_profit',
						type: 'number',
					},
					Profit_KM: {
						name: 'Profit/KM',
						key: 'this["profit/km"]',
						type: 'number',
						eval: true
					},
					Profit_Day: {
						name: 'Profit/Day',
						key: 'this["profit/day"]',
						type: 'number',
						eval: true
					},
					diesel: {
						name: 'Diesel (Ltr.)',
						key: 'this["total_diesel"]',
						type: 'number',
						eval: true
					},
					// Add New Fields
					Total_Border: {
						name: 'Total Border',
						key: 'this["totBorderExp"]',
						type: 'number',
						eval: true
					},
					Total_Challan: {
						name: 'Total Challan',
						key: 'this["totChallanExp"]',
						type: 'number',
						eval: true
					},
					Total_Dala_Commision: {
						name: 'Total Dala Commision',
						key: 'this["totDatacommiExp"]',
						type: 'number',
						eval: true
					},
					Total_Diesal: {
						name: 'Total Diesal',
						key: 'this["totDiesalExp"]',
						type: 'number',
						eval: true
					},
					Total_Fixed: {
						name: 'Total Fixed',
						key: 'this["totFixedSalExp"]',
						type: 'number',
						eval: true
					},
					Total_OK_Time: {
						name: 'Total OK Time',
						key: 'this["totOktimeExp"]',
						type: 'number',
						eval: true
					},
					Total_Parking: {
						name: 'Total Parking',
						key: 'this["totParkingExp"]',
						type: 'number',
						eval: true
					},
					Total_Rajai: {
						name: 'Total Rajai',
						key: 'this["totRajaiExp"]',
						type: 'number',
						eval: true
					},
					Total_Repair: {
						name: 'Total Repair',
						key: 'this["totRepairExp"]',
						type: 'number',
						eval: true
					},
					Total_Roti: {
						name: 'Total Roti',
						key: 'this["totRotiExp"]',
						type: 'number',
						eval: true
					},
					Total_Service: {
						name: 'Total Service',
						key: 'this["totServiceExp"]',
						type: 'number',
						eval: true
					},
					Total_Extra: {
						name: 'Total Extra',
						key: 'this["totExtraExp"]',
						type: 'number',
						eval: true
					},
					Total_MissPend: {
						name: 'Total MissPend',
						key: 'this["totMissPendExp"]',
						type: 'number',
						eval: true
					},
					Total_TollTax: {
						name: 'Total TollTax',
						key: 'this["totTollTaxExp"]',
						type: 'number',
						eval: true
					},
					Total_Wages: {
						name: 'Total Wages',
						key: 'this["totWagesExp"]',
						type: 'number',
						eval: true
					},
					//END
					Route: {
						name: 'Route',
						key: 'trips|arrayOfString:"route_name"',
						type: 'string',
					},
					Settlement_By: {
						name: 'Settlement By',
						key: 'trips.slice(-1)[0].markSettle.user_full_name',
						type: 'string',
					},
					Settlement_Remark: {
						name: 'Settlement Remark',
						key: 'trips.slice(-1)[0].markSettle.remark',
						type: 'string',
					},
					Audit_Date: {
						name: 'Audit Date',
						key: 'trips.slice(-1)[0].advSettled.creation.date',
						type: '__date__',
					},
					Audit_By: {
						name: 'Audit By',
						key: 'trips.slice(-1)[0].advSettled.creation.user',
						type: 'string',
					},
				},
				summary: {
					'tExpense/km': {
						label: 'Total Expense/KM',
						type: 'number',
						key: 'tExpense/km',
						visible: true,
					},
					'tNetExpense': {
						label: 'Total Net Expense',
						type: 'number',
						key: 'tNetExpense',
						visible: true,
					},
					'tInternalFreight': {
						label: 'Total Internal Freight',
						type: 'number',
						key: 'tInternalFreight',
						visible: true,
					},
					'tProfit/day': {
						label: 'Total Profit/day',
						type: 'number',
						key: 'tProfit/day',
						visible: true,
					},
					'tProfit/km': {
						label: 'Total Profit/km',
						type: 'number',
						key: 'tProfit/km',
						visible: true,
					},
					'tRevenue/km': {
						label: 'Total Revenue/km',
						type: 'number',
						key: 'tRevenue/km',
						visible: true,
					},
					'tRtElapsed': {
						label: 'Total RtElapsed',
						type: 'number',
						key: 'tRtElapsed',
						visible: true,
					},
					'tTotalKM': {
						label: 'Total Round Trip KM',
						type: 'number',
						key: 'tTotalKM',
						visible: true,
					},
					'tTotal_advance': {
						label: 'Total Advance',
						type: 'number',
						key: 'tTotal_advance',
						visible: true,
					},
					'tTotal_actual_profit': {
						label: 'Total Actual Profit',
						type: 'number',
						key: 'tTotal_actual_profit',
						visible: true,
					},
					'tTotal_diesel': {
						label: 'Total Diesel',
						type: 'number',
						key: 'tTotal_diesel',
						visible: true,
					}
				},
				api: {
					'name': 'getReport'
				}
			},
			'RTP Expense New': {
				filter: [
					{
						name: 'from'
					},
					{
						name: 'to'
					},
					{
						name: 'RT No'
					},
					{
						name: 'Segment Type'
					}
				],
				tableHeader: {
					RT_No: {
						name: 'RT No',
						key: '_id',
						type: 'number',
					},
					/*RT_Date: {
						name: 'RT Date',
						key: 'trips.slice(-1)[0].advSettled.date',
						type: '__date__',
					},*/
					Settlement_Date: {
						name: 'Settlement Date',
						key: 'trips.slice(-1)[0].markSettle.date',
						type: '__date__',
						date: 'dd-MMM-yyyy'
					},
					Vehicle_No: {
						name: 'Vehicle No',
						key: 'trips.slice(-1)[0].vehicle_no',
						type: 'string',
					},
					Driver: {
						name: 'Driver',
						key: 'trips.slice(-1)[0].driver.name',
						type: 'string',
					},
					Trip_Start: {
						name: 'RT Start',
						key: 'firstTripStart.date',
						type: '__date__',
						date: 'dd-MMM-yyyy'
					},
					Trip_End: {
						name: 'RT End',
						key: 'lastTripEnd.date',
						type: '__date__',
						date: 'dd-MMM-yyyy'
					},
					// Segment: {
					// 	name: 'Segment',
					// key: 'trips.slice(-1)[0].segment_type',
					// key: 'allSegments.join(", ")',
					// type: 'string',
					// },
					fleet: {
						name: 'Fleet',
						key: 'trips.slice(-1)[0].vehicle.owner_group',
						type: 'string',
					},
					// Vehicle_Type: {
					// 	name: 'Vehicle Type',
					// 	key: 'trips.slice(-1)[0].vehicle.veh_type_name',
					// 	type: 'string',
					// },
					Total_KM: {
						name: 'Total KM',
						key: 'totalKM',
						type: 'number',
					},
					Advance: {
						name: 'Advance',
						key: 'total_advance',
						type: 'number',
					},
					TT_days: {
						name: 'TT days',
						key: 'rtElapsed.toFixed(0)',
						type: 'string',
						date: false
					},
					Revenue: {
						name: 'Revenue',
						key: 'total_internal_freight',
						type: 'number',
					},
					Revenue_KM: {
						name: 'Revenue/KM',
						key: 'this["revenue/km"]',
						type: 'number',
						eval: true
					},
					Expense: {
						name: 'Expense',
						key: 'netExpense',
						type: 'number',
					},
					Expense_KM: {
						name: 'Expense/KM',
						key: 'this["expense/km"]',
						type: 'number',
						eval: true
					},
					Profit: {
						name: 'Profit',
						key: 'total_actual_profit',
						type: 'number',
					},
					Profit_KM: {
						name: 'Profit/KM',
						key: 'this["profit/km"]',
						type: 'number',
						eval: true
					},
					Profit_Day: {
						name: 'Profit/Day',
						key: 'this["profit/day"]',
						type: 'number',
						eval: true
					},
					diesel: {
						name: 'Diesel (Ltr.)',
						key: 'this["total_diesel"]',
						type: 'number',
						eval: true
					},
					// Add New Fields
					Total_Border: {
						name: 'Total Border',
						key: 'this["totBorderExp"]',
						type: 'number',
						eval: true
					},
					Total_Challan: {
						name: 'Total Challan',
						key: 'this["totChallanExp"]',
						type: 'number',
						eval: true
					},
					Total_Dala_Commision: {
						name: 'Total Dala Commision',
						key: 'this["totDatacommiExp"]',
						type: 'number',
						eval: true
					},
					Total_Diesal: {
						name: 'Total Diesal',
						key: 'this["totDiesalExp"]',
						type: 'number',
						eval: true
					},
					Total_Fixed: {
						name: 'Total Fixed',
						key: 'this["totFixedSalExp"]',
						type: 'number',
						eval: true
					},
					Total_OK_Time: {
						name: 'Total OK Time',
						key: 'this["totOktimeExp"]',
						type: 'number',
						eval: true
					},
					Total_Parking: {
						name: 'Total Parking',
						key: 'this["totParkingExp"]',
						type: 'number',
						eval: true
					},
					Total_Rajai: {
						name: 'Total Rajai',
						key: 'this["totRajaiExp"]',
						type: 'number',
						eval: true
					},
					Total_Repair: {
						name: 'Total Repair',
						key: 'this["totRepairExp"]',
						type: 'number',
						eval: true
					},
					Total_Roti: {
						name: 'Total Roti',
						key: 'this["totRotiExp"]',
						type: 'number',
						eval: true
					},
					Total_Service: {
						name: 'Total Service',
						key: 'this["totServiceExp"]',
						type: 'number',
						eval: true
					},
					Total_Extra: {
						name: 'Total Extra',
						key: 'this["totExtraExp"]',
						type: 'number',
						eval: true
					},
					Total_MissPend: {
						name: 'Total MissPend',
						key: 'this["totMissPendExp"]',
						type: 'number',
						eval: true
					},
					Total_TollTax: {
						name: 'Total TollTax',
						key: 'this["totTollTaxExp"]',
						type: 'number',
						eval: true
					},
					Total_Wages: {
						name: 'Total Wages',
						key: 'this["totWagesExp"]',
						type: 'number',
						eval: true
					},
					//END
					Route: {
						name: 'Route',
						key: 'trips|arrayOfString:"route_name"',
						type: 'string',
					},
					Settlement_By: {
						name: 'Settlement By',
						key: 'trips.slice(-1)[0].markSettle.user_full_name',
						type: 'string',
					},
					Settlement_Remark: {
						name: 'Settlement Remark',
						key: 'trips.slice(-1)[0].markSettle.remark',
						type: 'string',
					},
					Audit_Date: {
						name: 'Audit Date',
						key: 'trips.slice(-1)[0].advSettled.creation.date',
						type: '__date__',
					},
					Audit_By: {
						name: 'Audit By',
						key: 'trips.slice(-1)[0].advSettled.creation.user',
						type: 'string',
					},
				},
				summary: {
					'tExpense/km': {
						label: 'Total Expense/KM',
						type: 'number',
						key: 'tExpense/km',
						visible: true,
					},
					'tNetExpense': {
						label: 'Total Net Expense',
						type: 'number',
						key: 'tNetExpense',
						visible: true,
					},
					'tInternalFreight': {
						label: 'Total Internal Freight',
						type: 'number',
						key: 'tInternalFreight',
						visible: true,
					},
					'tProfit/day': {
						label: 'Total Profit/day',
						type: 'number',
						key: 'tProfit/day',
						visible: true,
					},
					'tProfit/km': {
						label: 'Total Profit/km',
						type: 'number',
						key: 'tProfit/km',
						visible: true,
					},
					'tRevenue/km': {
						label: 'Total Revenue/km',
						type: 'number',
						key: 'tRevenue/km',
						visible: true,
					},
					'tRtElapsed': {
						label: 'Total RtElapsed',
						type: 'number',
						key: 'tRtElapsed',
						visible: true,
					},
					'tTotalKM': {
						label: 'Total Round Trip KM',
						type: 'number',
						key: 'tTotalKM',
						visible: true,
					},
					'tTotal_advance': {
						label: 'Total Advance',
						type: 'number',
						key: 'tTotal_advance',
						visible: true,
					},
					'tTotal_actual_profit': {
						label: 'Total Actual Profit',
						type: 'number',
						key: 'tTotal_actual_profit',
						visible: true,
					},
					'tTotal_diesel': {
						label: 'Total Diesel',
						type: 'number',
						key: 'tTotal_diesel',
						visible: true,
					}
				},
				api: {
					'name': 'rtpExpenseNew'
				}
			},
			// END
			RTP: {
				filter: [
					{
						name: 'from'
					},
					{
						name: 'to'
					},
					{
						name: 'RT No'
					},
					{
						name: 'Segment Type'
					}
				],
				tableHeader: {
					RT_No: {
						name: 'RT No',
						key: '_id',
						type: 'number',
					},
					/*RT_Date: {
						name: 'RT Date',
						key: 'trips.slice(-1)[0].advSettled.date',
						type: '__date__',
					},*/
					Settlement_Date: {
						name: 'Settlement Date',
						key: 'trips.slice(-1)[0].markSettle.date',
						type: '__date__',
						date: 'dd-MMM-yyyy'
					},
					Vehicle_No: {
						name: 'Vehicle No',
						key: 'trips.slice(-1)[0].vehicle_no',
						type: 'string',
					},
					Driver: {
						name: 'Driver',
						key: 'trips.slice(-1)[0].driver.name',
						type: 'string',
					},
					Trip_Start: {
						name: 'RT Start',
						key: 'firstTripStart.date',
						type: '__date__',
						date: 'dd-MMM-yyyy'
					},
					Trip_End: {
						name: 'RT End',
						key: 'lastTripEnd.date',
						type: '__date__',
						date: 'dd-MMM-yyyy'
					},
					// Segment: {
					// 	name: 'Segment',
					// key: 'trips.slice(-1)[0].segment_type',
					// key: 'allSegments.join(", ")',
					// type: 'string',
					// },
					fleet: {
						name: 'Fleet',
						key: 'trips.slice(-1)[0].vehicle.owner_group',
						type: 'string',
					},
					// Vehicle_Type: {
					// 	name: 'Vehicle Type',
					// 	key: 'trips.slice(-1)[0].vehicle.veh_type_name',
					// 	type: 'string',
					// },
					Total_KM: {
						name: 'Total KM',
						key: 'totalKM',
						type: 'number',
					},
					Advance: {
						name: 'Advance',
						key: 'total_advance',
						type: 'number',
					},
					TT_days: {
						name: 'TT days',
						key: 'rtElapsed.toFixed(0)',
						type: 'string',
						date: false
					},
					Revenue: {
						name: 'Revenue',
						key: 'total_internal_freight',
						type: 'number',
					},
					Revenue_KM: {
						name: 'Revenue/KM',
						key: 'this["revenue/km"]',
						type: 'number',
						eval: true
					},
					Expense: {
						name: 'Expense',
						key: 'netExpense',
						type: 'number',
					},
					Expense_KM: {
						name: 'Expense/KM',
						key: 'this["expense/km"]',
						type: 'number',
						eval: true
					},
					Profit: {
						name: 'Profit',
						key: 'total_actual_profit',
						type: 'number',
					},
					Profit_KM: {
						name: 'Profit/KM',
						key: 'this["profit/km"]',
						type: 'number',
						eval: true
					},
					Profit_Day: {
						name: 'Profit/Day',
						key: 'this["profit/day"]',
						type: 'number',
						eval: true
					},
					diesel: {
						name: 'Diesel (Ltr.)',
						key: 'this["total_diesel"]',
						type: 'number',
						eval: true
					},
					Route: {
						name: 'Route',
						key: 'trips|arrayOfString:"route_name"',
						type: 'string',
					},
					Settlement_By: {
						name: 'Settlement By',
						key: 'trips.slice(-1)[0].markSettle.user_full_name',
						type: 'string',
					},
					Settlement_Remark: {
						name: 'Settlement Remark',
						key: 'trips.slice(-1)[0].markSettle.remark',
						type: 'string',
					},
					Audit_Date: {
						name: 'Audit Date',
						key: 'trips.slice(-1)[0].advSettled.creation.date',
						type: '__date__',
					},
					Audit_By: {
						name: 'Audit By',
						key: 'trips.slice(-1)[0].advSettled.creation.user',
						type: 'string',
					},
				},
				summary: {
					'tExpense/km': {
						label: 'Total Expense/KM',
						type: 'number',
						key: 'tExpense/km',
						visible: true,
					},
					'tNetExpense': {
						label: 'Total Net Expense',
						type: 'number',
						key: 'tNetExpense',
						visible: true,
					},
					'tInternalFreight': {
						label: 'Total Internal Freight',
						type: 'number',
						key: 'tInternalFreight',
						visible: true,
					},
					'tProfit/day': {
						label: 'Total Profit/day',
						type: 'number',
						key: 'tProfit/day',
						visible: true,
					},
					'tProfit/km': {
						label: 'Total Profit/km',
						type: 'number',
						key: 'tProfit/km',
						visible: true,
					},
					'tRevenue/km': {
						label: 'Total Revenue/km',
						type: 'number',
						key: 'tRevenue/km',
						visible: true,
					},
					'tRtElapsed': {
						label: 'Total RtElapsed',
						type: 'number',
						key: 'tRtElapsed',
						visible: true,
					},
					'tTotalKM': {
						label: 'Total Round Trip KM',
						type: 'number',
						key: 'tTotalKM',
						visible: true,
					},
					'tTotal_advance': {
						label: 'Total Advance',
						type: 'number',
						key: 'tTotal_advance',
						visible: true,
					},
					'tTotal_actual_profit': {
						label: 'Total Actual Profit',
						type: 'number',
						key: 'tTotal_actual_profit',
						visible: true,
					},
					'tTotal_diesel': {
						label: 'Total Diesel',
						type: 'number',
						key: 'tTotal_diesel',
						visible: true,
					}
				},
				api: {
					'name': 'getReport'
				}
			},
			'RTP New': {
				filter: [],
				tableHeader: {},
				summary: {},
				api: {
					'name': 'RTPRNew'
				}
			},
			'Detail RTP': {
				filter: [
					{
						name: 'from'
					},
					{
						name: 'to'
					},
					{
						name: 'RT No'
					},
					{
						name: 'Segment Type'
					}
				],
				tableHeader: {
					RT_No: {
						name: 'RT No',
						key: '_id',
						type: 'number',
					},
					/*RT_Date: {
						name: 'RT Date',
						key: 'trips.slice(-1)[0].advSettled.date',
						type: '__date__',
					},*/
					Settlement_Date: {
						name: 'Settlement Date',
						key: 'trips.slice(-1)[0].markSettle.date',
						type: '__date__',
					},
					Settlement_By: {
						name: 'Settlement By',
						key: 'trips.slice(-1)[0].markSettle.user_full_name',
						type: 'string',
					},
					Settlement_Remark: {
						name: 'Settlement Remark',
						key: 'trips.slice(-1)[0].markSettle.remark',
						type: 'string',
					},
					Audit_Date: {
						name: 'Audit Date',
						key: 'trips.slice(-1)[0].advSettled.creation.date',
						type: '__date__',
					},
					Audit_By: {
						name: 'Audit By',
						key: 'trips.slice(-1)[0].advSettled.creation.user',
						type: 'string',
					},
					Vehicle_No: {
						name: 'Vehicle No',
						key: 'trips.slice(-1)[0].vehicle_no',
						type: 'string',
					},
					Driver: {
						name: 'Driver',
						key: 'trips.slice(-1)[0].driver.name',
						type: 'string',
					},
					Trip_Start: {
						name: 'RT Start',
						key: 'firstTripStart.date',
						type: '__date__',
					},
					Trip_End: {
						name: 'RT End',
						key: 'lastTripEnd.date',
						type: '__date__',
					},
					Segment: {
						name: 'Segment',
						// key: 'trips.slice(-1)[0].segment_type',
						key: 'allSegments.join(", ")',
						type: 'string',
					},
					Vehicle_Type: {
						name: 'Vehicle Type',
						key: 'trips.slice(-1)[0].vehicle.veh_type_name',
						type: 'string',
					},
					Total_KM: {
						name: 'Total KM',
						key: 'totalKM',
						type: 'number',
					},
					Advance: {
						name: 'Advance',
						key: 'total_advance',
						type: 'number',
					},
					TT_days: {
						name: 'TT days',
						key: 'rtElapsed.toFixed(0)',
						type: 'string',
						date: false
					},
					Revenue: {
						name: 'Revenue',
						key: 'total_internal_freight',
						type: 'number',
					},
					Revenue_KM: {
						name: 'Revenue/KM',
						key: 'this["revenue/km"]',
						type: 'number',
						eval: true
					},
					Expense: {
						name: 'Expense',
						key: 'netExpense',
						type: 'number',
					},
					Expense_KM: {
						name: 'Expense/KM',
						key: 'this["expense/km"]',
						type: 'number',
						eval: true
					},
					Profit: {
						name: 'Profit',
						key: 'total_actual_profit',
						type: 'number',
					},
					Profit_KM: {
						name: 'Profit/KM',
						key: 'this["profit/km"]',
						type: 'number',
						eval: true
					},
					Profit_Day: {
						name: 'Profit/Day',
						key: 'this["profit/day"]',
						type: 'number',
						eval: true
					},
					diesel: {
						name: 'Diesel (Ltr.)',
						key: 'this["total_diesel"]',
						type: 'number',
						eval: true
					},
					Route: {
						name: 'Route',
						key: 'trips|arrayOfString:"route_name"',
						type: 'string',
					},
				},
				summary: {
					'tExpense/km': {
						label: 'Total Expense/KM',
						type: 'number',
						key: 'tExpense/km',
						visible: true,
					},
					'tNetExpense': {
						label: 'Total Net Expense',
						type: 'number',
						key: 'tNetExpense',
						visible: true,
					},
					'tInternalFreight': {
						label: 'Total Internal Freight',
						type: 'number',
						key: 'tInternalFreight',
						visible: true,
					},
					'tProfit/day': {
						label: 'Total Profit/day',
						type: 'number',
						key: 'tProfit/day',
						visible: true,
					},
					'tProfit/km': {
						label: 'Total Profit/km',
						type: 'number',
						key: 'tProfit/km',
						visible: true,
					},
					'tRevenue/km': {
						label: 'Total Revenue/km',
						type: 'number',
						key: 'tRevenue/km',
						visible: true,
					},
					'tRtElapsed': {
						label: 'Total RtElapsed',
						type: 'number',
						key: 'tRtElapsed',
						visible: true,
					},
					'tTotalKM': {
						label: 'Total Round Trip KM',
						type: 'number',
						key: 'tTotalKM',
						visible: true,
					},
					'tTotal_advance': {
						label: 'Total Advance',
						type: 'number',
						key: 'tTotal_advance',
						visible: true,
					},
					'tTotal_actual_profit': {
						label: 'Total Actual Profit',
						type: 'number',
						key: 'tTotal_actual_profit',
						visible: true,
					},
					'tTotal_diesel': {
						label: 'Total Diesel',
						type: 'number',
						key: 'tTotal_diesel',
						visible: true,
					}
				},
				api: {
					'name': 'getReport'
				}
			},
			'RTP Gap': {
				api: {
					'name': 'rtpGapReport'
				}
			},
			'Last Settle RTP': {
				api: {
					'name': 'lastSettleRtpr'
				}
			},
			'Last Settle RT Report': {
				api: {
					'name': 'lastSettleRtReport'
				}
			},
			'Monthly Performance': {
				api: {
					'name': 'vehMonthlyPerformanceRpt'
				}
			},
			'RT Gross Profit Report':{
				filter: [],
				api: {
					'name': 'rtgpReport'
				}
			},
			'Combine RTwise Gross Profit Report':{
				filter:[],
				api:{
					'name': 'combrtwisegpReport'
				}
			}
		},

		maxAdvanceDieselAmount: 70000,

		totalKM: 200,
		addKMlimit: 1000,

		aCoastingReportTypes: [{
			'name': 'Vendor Reconciliation',
			'path': 'views/report/vendorReconcilationReport.html'
		}, {
			'name': 'Trip Expense',
			'path': 'views/report/tripExpenseReport.html'
		}, {
			'name': 'Fuel Vendor Reconciliation',
			'path': 'views/report/fuelVendorReconciliationReport.html'
		}],

		aGrType: [
			{
				name: 'Manual Builty',
				_id: "Own"
			}],
		/*{
            name: 'Market Builty',
            _id: "Market"
        },
        {
            name: 'Centralized Builty',
            _id: "Centralized"
        }*/
		advanceAmount: 250000,

		grFreight: 500000,
		tripExpenseAmt: 100000,
		gstinLength: 15,

		aFeature : [
			'Diesel',
			'Driver Cash',
			'Happay',
			'Fastag',
			'Bill',
			'Money Receipt',
			'Shortage',
			'Challan',
			'Staff',
			'Loan',
			'Late Delivery',
			'Damages',
			'Shortage',
			'Claim',
			'Non-Placement',
			'Parking',
			'Loading/Unloading',
			'ESI/PF',
			'GPS Recovery',
			'Insurance',
			'Rate Difference',
			'Misc Recovery',
			'Detention',
			'Deduction',
			'Office',
			'Lorry ',
			'Other'

		],


		customerTypes: ["Customer", "Consignee", "Consignor", "Billing party", "CHA", "Transporter", "Gps user", "Dealer", "Others"],

		customerStatus: ["Active", "Inactive"],

		aVendorCategory: ["Owner", "Broker"],

		companyTypes: ["Public Limited", "Private", "Group"],

		aVehicleStatus: ["Available", "Maintenance", "Booked", "Journey"],

		aBPGroup: ["Freight Corporation", "Fleet Carrier", "Export", "Misc. Fleet", "ToPay Freight"],

		aVehicleProvider: ['Own', 'Associate', 'Market'],

    	contractType: ["Temporary", "Permanent"],

		serviceType: ['Standard', 'Express', 'Time Committed'],

		contractStatus: ["Not started", "Live", "Completed"],

		paymentType: ["To pay", "To be billed", "Advance & to pay", "Advance & to be billed", "Chit", "Advance & chit", "FOC"],

		billingType: ["BOE wise", "Trip wise", "Contract wise", "Monthly", "Weekly", "Bi-Weekly"],

		emailFrequency: ["BOE wise", "Trip wise", "Contract wise", "Monthly", "Weekly", "Bi-Weekly"],

		aOwnershipVehicle: ["Own", "Associate", "Market", /*"Sold"*/],

		aOwnershipVendor: ["Associate", "Market"],

		aStationeryCategory: ['Bill', 'GR', 'Cash Receipt'],

		aBillBookType: ['Bill', 'Gr', 'FPA', 'Hire Slip', 'Ref No', 'Cash Receipt', 'Money Receipt', 'Credit Note', 'Trip Memo','Broker Memo','Debit Note'],

		abillStatus: ["Unapproved", "Approved", "Cancelled", "Dispatched", "Acknowledged"],

		aGrStatuses: ["GR Not Assigned", "GR Assigned", "Vehicle Arrived for loading", "Loading Started", "Loading Ended","Departure", "Vehicle Arrived for unloading", "Unloading Started", "Unloading Ended", "Trip cancelled", "GR Received", "GR Acknowledged"],

		// customer type for master -> add customer
		aCustomerType: ["Customer", "Consignee", "Consignor", "Billing party", "CHA", "Transporter", "Others"],

		aTripStatus: [
			{label: "Trip not started", key: "Trip not started"},
			{label: "Trip started", key: "Trip started"},
			{label: "Trip ended", key: "Trip ended"},
			{label: "Trip cancelled", key: "Trip cancelled"}
		],

		aTripCategoryType: ['Loaded', 'Empty'],

		aPayType: ['Gr Charges', 'Loading Charges', 'Unloading Charges', 'Other Charges',
			'Chalan', 'Driver Cash', 'Diesel', 'Extra Diesel', 'Toll Tax', 'Vendor A/C Pay', 'Vendor Cash',
			'Vendor Cheque', 'Vendor Detention', "Vendor Overload Charges", 'Vendor Penalty', 'Vendor Damage', 'Vendor Chalan', "Happay", "FastTag"],

		aAdvanceType: ['Gr Charges', 'Loading Charges', 'Unloading Charges', 'Other Charges', 'Chalan', 'Driver Cash', 'Diesel', 'Extra Diesel', 'Toll Tax', 'Happay', 'FastTag'],
		// c - > category of payment ,n-> normal,d-> deduction,e->extra

		aTripDocType: [{
			key: 'Loading Slip/Chalan',
			value: "chalan"
		}, {
			key: 'DL',
			value: "dl"
		}, {
			key: 'Fitness',
			value: "fitness"
		}, {
			key: 'Insurance',
			value: "insurance"
		}, {
			key: 'Misc',
			value: "misc"
		}, {
			key: 'Permit',
			value: "permit"
		}, {
			key: 'RC',
			value: "rc"
		}],

		aGrDocType: [{
			key: 'Pod Back',
			value: "back"
		}, {
			key: 'Eway Bill',
			value: "eway"
		}, {
			key: 'Pod Front',
			value: "front"
		}, {
			key: 'Gr Back',
			value: "grBack"
		}, {
			key: 'Gr Front',
			value: "grFront"
		}, {
			key: 'Goods Insurance',
			value: "insur"
		}, {
			key: 'Invoice',
			value: "invoice"
		}, {
			key: 'Misc',
			value: "misc"
		}],

		tripDateType: [
			{
				key: "Trip start",
				value: "Trip started"
			},
			{
				key: "Trip end",
				value: "Trip ended"
			},
			{
				key: "Deal/Chalan",
				value: "vendorDeal.deal_at"
			},
			{
				key: "Deal/Chalan Entry",
				value: "vendorDeal.entryDate"
			},
			/*{
				key: "Loading Date",
				value: "loading_date"
			},
			{
				key: "Unloading Date",
				value: "unloading_date"
			},*/
			{
				key: "Trip Entry",
				value: "allocation_date"
			},
			{
				key: "Acknowledge Date",
				value: "vendorDeal.acknowledge.date"
			}
		],

		advanceDateType: [
			{
				key: "Advance Entry",
				value: "created_at"
			}
		],

		aCharges: [
			{
				name: 'Detention Charges',
				value: 'detention_charge',
				tds: true,
				a1: '$vendor',
				a2: 'Purchase'
			},
			{
				name: 'Overload Charges',
				value: 'oveloading_charge',
				a1: '$vendor',
				a2: 'Purchase'
			},
			{
				name: 'Loading Charges',
				value: 'loading_charges',
				tds: true,
				a1: '$vendor',
				a2: 'Purchase'
			},
			{
				name: 'Unloading Charges',
				value: 'unloading_charges',
				a1: '$vendor',
				a2: 'Purchase'
			},
			{
				name: 'Other Charges',
				value: 'other_charges',
				a1: '$vendor',
				a2: 'Purchase'
			},
			{
				name: 'Chalan Charges',
				value: 'chalan_charges',
				a1: '$vendor',
				a2: 'Purchase'
			},
			{
				name: 'Chalan Charges RTO',
				value: 'chalan_rto_charges',
				a1: '$vendor',
				a2: 'Purchase'
			},
			{
				name: 'Tirpal Charges',
				value: 'tirpal_charges',
				a1: '$vendor',
				a2: 'Purchase'
			},
			{
				name: 'Toll Charges',
				value: 'toll_charges',
				a1: '$vendor',
				a2: 'Purchase'
			},
			{
				name: 'Extra weight',
				value: 'extra_weight',
				a1: '$vendor',
				a2: 'Purchase'
			}
		],

		aDeductionCharges: [
			{
				name: 'Damage',
				value: 'damage_deduction',
				a1: 'Deduction',
				a2: '$vendor'
			},
			{
				name: 'Penalty',
				value: 'penalty_deduction',
				a1: 'Deduction',
				a2: '$vendor'
			},
			{
				name: 'Labour',
				value: 'labourDeduction',
				a1: 'Deduction',
				a2: '$vendor'
			},
			{
				name: 'Claim',
				value: 'claimDeduction',
				a1: 'Deduction',
				a2: '$vendor'
			},
			{
				name: 'Advance Payment Munshiyana',
				value: 'Adv_Paymt_Munshiyana',
				a1: 'Deduction',
				a2: '$vendor'
			},
			{
				name: 'Balance Payment Munshiyana',
				value: 'Bal_Paymt_Munshiyana',
				a1: 'Deduction',
				a2: '$vendor'
			},
			{
				name: 'Other',
				value: 'other_deduction',
				a1: 'Deduction',
				a2: '$vendor'
			}
		],

		expenseObj2: [
			{
				name: 'Driver Cash',
				a1: ['Transaction', 'banks', 'Cashbook'],
				a2: ['$vehicle', '$vendor'],
				a3: null,
				c: 'n',
				oType: 'Associate'
			},
			{
				name: 'Diesel',
				a1: '$fvendor',
				a2: ['$vehicle', '$vendor'],
				a3: null,
				c: 'n'
			},
			/*{
				name: 'Vendor Advance',
				a1: ['Transaction', 'banks', 'Cashbook'],
				a2: '$vendor',
				a3: null,
				c: 'n'
			},
			{
				name: 'Vendor Diesel',
				a1: ['Transaction', 'banks', 'Cashbook'],
				a2: '$vendor',
				a3: null,
				c: 'n'
			},
			{
				name: "Vendor Balance",
				a1: ['Transaction', 'banks', 'Cashbook'],
				a2: '$vendor',
				a3: null,
				c: 'n'
			},*/
			{
				name: "Happay",
				a1: 'Happay Master',
				a2: ['$vehicle', '$vendor', 'Cashbook'],
				a3: null,
				c: 'n'
			},
			{
				name: "Fastag",
				a1: 'FastTag Master',
				a2: ['$vehicle', '$vendor', 'Cashbook'],
				a3: null,
				c: 'n'
			},
			{
				name: "TDS",
				a1: 'TDS Master',
				a2: '$vendor',
				a3: null,
				c: 'd',
				v: 'Journal'
			},
			{
				name: "Damage",
				a1: 'Damage Master',
				a2: '$vendor',
				a3: null,
				c: 'd'
			},
			{
				name: "Penalty",
				a1: 'Penalty Master',
				a2: '$vendor',
				a3: null,
				c: 'd'
			}
		],

		expenseObj: [
			{
				name: 'Driver Cash',
				a1: ['Transaction', 'banks', 'Cashbook', 'Diesel'],
				a2: ['$vehicle', '$vendor'],
				a3: null,
				c: 'n',
				oType: 'Associate'
			},
			{
				name: 'Diesel',
				a1: '$fvendor',
				a2: ['$vehicle', '$vendor'],
				a3: null,
				c: 'n'
			},
			{
				name: 'Vendor Advance',
				a1: ['Transaction', 'banks', 'Cashbook'],
				a2: '$vendor',
				a3: null,
				c: 'n'
			},
			{
				name: 'Vendor Diesel',
				a1: ['Transaction', 'banks', 'Cashbook'],
				a2: '$vendor',
				a3: null,
				c: 'n'
			},
			{
				name: "Vendor Balance",
				a1: ['Transaction', 'banks', 'Cashbook'],
				a2: '$vendor',
				a3: null,
				c: 'n'
			},
			{
				name: "Happay",
				a1: 'Happay Master',
				a2: ['$vehicle', '$vendor', 'Cashbook'],
				a3: null,
				c: 'n'
			},
			{
				name: "Fastag",
				a1: 'FastTag Master',
				a2: ['$vehicle', '$vendor', 'Cashbook'],
				a3: null,
				c: 'n',
			},
			{
				name: "TDS",
				a1: 'TDS Master',
				a2: '$vendor',
				a3: null,
				c: 'd',
				v: 'Journal'
			},
			{
				name: "Damage",
				a1: 'Damage Master',
				a2: '$vendor',
				a3: null,
				c: 'd'
			},
			{
				name: "Penalty",
				a1: 'Penalty Master',
				a2: '$vendor',
				a3: null,
				c: 'd',
			}
		],

		"aDriverPaymentType" : [
			{
				"pType" : "Driver Payment",
				"voucherType" : [
					"Payment"
				],
				"fromGroup" : [
					"Internal Cashbook"
				],
				"toGroup" : [
					"Driver"
				]
			},
			{
				"pType" : "Driver to Driver",
				"voucherType" : [
					"Journal",
					"Contra"
				],
				"fromGroup" : [
					"Driver"
				],
				"toGroup" : [
					"Driver"
				]
			},
			{
				"pType" : "Driver Repay",
				"voucherType" : [
					"Journal",
					"Contra"
				],
				"fromGroup" : [
					"Driver"
				],
				"toGroup" : [
					"Internal Cashbook"
				]
			},
			{
				"pType" : "Shortage",
				"voucherType" : [
					"Payment"
				],
				"fromGroup" : [
					"Internal Cashbook"
				],
				"toGroup" : [
					"Driver"
				]
			},
			{
				"pType" : "Challan",
				"voucherType" : [
					"Payment"
				],
				"fromGroup" : [
					"Internal Cashbook"
				],
				"toGroup" : [
					"Driver"
				]
			},

		],

		aOtherExpense: [
			{
				name: 'Generator',
				a1: '$fvendor',
				a2: 'Generator',
				a3: null
			},
			{
				name: 'Car',
				a1: '$fvendor',
				a2: 'Car',
				a3: null
			},
			{
				name: 'Market',
				a1: '$fvendor',
				a2: 'Generator',
				a3: null
			}
		],

		aPaymentType: [
			{
				pType: 'Driver Payment',
				fromGroup: ['Internal Cashbook'],
				toGroup: ['Driver'],
				voucherGroup: ['Journal'],
			},
			{
				pType: 'Driver to Driver',
				fromGroup: ['Driver'],
				toGroup: ['Driver'],
				voucherGroup: ['Journal'],
			}
		],
		previewBuilty: [
			{
				key: "DGD_Daramic",
				name: "Daramic"
			}
		],
		aPaymentTypeComplete: [
			{
				pType: "Trip Memo Receipt",
				voucherType: ["Receipt"],
			}
			,
			{
				pType: "Other",
				voucherType: ["Journal", "Payment", "Contra", "Receipt"],
			},
			{
				pType: "Customer Receipts",
				fromGroup: ['Customer'],
				toGroup: ['banks', 'cashbook', 'Transaction'],
				voucherType: ['Journal', 'Receipt'],
			},
			{
				pType: "Purchase Discount",
				voucherType: ["Journal", "Payment", "Contra", "Receipt"],
			},
			{
				pType: "Diesel Bill",
				voucherType: ["Journal", "Payment", "Contra", "Receipt"],
			},
			{
				pType: "FPA",
				voucherType: ["Journal"],
			},
			{
				pType: "Vendor Advance",
				voucherType: ["Journal", "Payment", "Contra", "Receipt"],
			},
			{
				pType: "Diesel",
				voucherType: ["Journal", "Payment", "Contra", "Receipt"],
			},
			{
				pType: "Maintenance",
				voucherType: ["Journal", "Payment", "Contra", "Receipt"],
			},
			{
				pType: "Spare Parts",
				voucherType: ["Journal", "Payment", "Contra", "Receipt"],
			},
			{
				pType: "Tyre",
				voucherType: ["Journal", "Payment", "Contra", "Receipt"],
			},
			{
				pType: "Vendor Deal",
				voucherType: ["Journal", "Payment", "Contra", "Receipt"],
			},
			{
				pType: "Vendor TDS",
				voucherType: ["Journal", "Payment", "Contra", "Receipt"],
			},
			{
				pType: "Vendor Charges",
				voucherType: ["Journal", "Payment", "Contra", "Receipt"],
			},
			{
				pType: "Vendor Deduction",
				voucherType: ["Journal", "Payment", "Contra", "Receipt"],
			},
			{
				pType: "Gr Bill",
				voucherType: [],
			},
			{
				pType: "Happay",
				voucherType: [],
			},
			{
				pType: "Fastag",
				voucherType: [],
			},
			{
				pType: "Driver Cash",
				voucherType: [],
			},
			{
				pType: "Driver Payment",
				voucherType: [],
			},
			{
				pType: "Driver to Driver",
				voucherType: [],
			},
			{
				pType: "Driver Repay",
				voucherType: [],
			},
			{
				pType: "Diesel",
				voucherType: [],
			},
			{
				pType: "Advance Udpate",
				voucherType: [],
			},
			{
				pType: "Money Receipt",
				voucherType: [],
			},
			{
				pType: "Credit Note",
				voucherType: [],
			},
			{
				pType: "Debit Note",
				voucherType: [],
			},
			{
				pType: "Fitness Worksheet",
				voucherType: [],
			},
			{
				pType: "Good and Token Tax",
				voucherType: [],
			},
			{
				pType: "Insurance",
				voucherType: [],
			},
			{
				pType: "Permit",
				voucherType: [],
			},
			{
				pType: "Sale Deed",
				voucherType: [],
			},
			{
				pType: "Dr Expense",
				voucherType: [],
			},
			{
				pType: "Dr driverCash",
				voucherType: [],
			},
			{
				pType: "Dr diesel",
				voucherType: [],
			},
			{
				pType: "Dr fastag",
				voucherType: [],
			},
			{
				pType: "Dr happay",
				voucherType: [],
			},
			{
				pType: "Driver Security",
				voucherType: [],
			},
			{
				pType: "Vehicle Expense",
				voucherType: [],
			},
			//'FPA'
		],

		aVoucherPaymentType: [
			{
				pType: "Customer Receipts",
				fromGroup: ['Customer'],
				toGroup: ['banks', 'cashbook', 'Transaction'],
				voucherType: ['Journal', 'Receipt'],
			},
			{
				pType: "Other",
				voucherType: ["Journal", "Payment", "Contra", "Receipt"],
			}
		],

		deductionObj: [
			{
				name: 'Late Delivery',
				type: 'credit'
			},
			{
				name: 'Damages',
				type: 'credit'
			},
			{
				name: 'Shortage',
				type: 'debit'
			},
			{
				name: 'Claim',
				type: 'debit'
			},
			{
				name: 'Non-Placement',
				type: 'credit'
			},
			{
				name: 'Parking',
				type: 'debit'
			},
			{
				name: 'Loading/Unloading',
				type: 'credit'
			},
			{
				name: 'ESI/PF',
				type: 'debit'
			},
			{
				name: 'GPS Recovery',
				type: 'debit'
			},
			{
				name: 'Insurance',
				type: 'debit'
			},
			{
				name: 'Rate Difference',
				type: 'credit'
			},
			{
				name: 'Misc Recovery',
				type: 'debit'
			},
			{
				name: 'Detention',
				type: 'credit'
			},
			{
				name: 'Deduction',
				type: 'credit'
			}

		],

		miscDeductionObj: [
			{
				name: 'Security Recovery',
				value: 'security_recovery',
				type: 'debit'
			},

			{
				name: 'Trucking Charges',
				value: 'trucking_charges',
				type: 'debit'
			},

			{
				name: 'Parking Charges',
				value: 'parking_charges',
				type: 'debit'
			},

			{
				name: 'Employer Contribution - PF',
				value: 'employer_PF',
				type: 'debit'
			},
			{
				name: 'Employer Contribution ESI',
				value: 'employer_ESI',
				type: 'debit'
			},
			{
				name: 'Penalty',
				value: 'penalty',
				type: 'credit'
			},

			{
				name: 'Insurance Charges for goods Intransit',
				value: 'insurance_charges',
				type: 'debit'
			},
			{
				name: 'Loading & Unloading Charges',
				value: 'loadUnloading_charges',
				type: 'credit'
			},
			{
				name: 'Non Placement Charges',
				value: 'nonplacement_charges',
				type: 'credit'
			},
			{
				name: 'Misc Recovery',
				value: 'misc_recovery',
				type: 'debit'
			},
			{
				name: 'Detention charges',
				value: 'detention_charges',
				type: 'debit'
			}

		],

		settlementObj: [
			{
				name: 'Border',
			},
			{
				name: 'Challan',
			},
			{
				name: 'Dala Commision',
			},
			{
				name: 'Diesel',
			},
			{
				name: 'Fixed + Salary',
			},
			{
				name: 'OK + Time',
			},
			{
				name: 'Parking',
			},
			{
				name: 'Rajai',
			},
			{
				name: 'Repair',
			},
			{
				name: 'Roti',
			},
			{
				name: 'Service',
			},
			{
				name: 'Extra',
			},
			{
				name: 'Miscellaneous Pending',
			},
			{
				name: 'Fastag Toll Tax',
			},
			{
				name: 'Cash Toll Tax',
			},
			{
				name: 'Wages'
			},
			{
				name: 'Local Trip'
			},
			{
				name: 'Add Blue'
			},
			{
				name: 'Phone Expense'
			},
			{
				name: 'Consumable store'
			},
			{
				name: 'Loading'
			},
			{
				name: ' Unloading '
			},
			{
				name: ' Def'
			},
			{
				name: ' Tyre Puncture'
			},
			{
				name: ' Tripal'
			}
		],

		vendorTypes: ['Vendor A/C Pay', 'Vendor Cash', 'Vendor Cheque', 'Vendor Detention', "Vendor Overload Charges", 'Vendor Penalty', 'Vendor Damage', 'Vendor Chalan'],
		expenseDateType: [{
			key: "Allocation Date",
			value: "allocation_date"
		}, {
			key: "Expense Date",
			value: "date"
		}, {
			key: "Expense Entry Date",
			value: "created_at"
		}, {
			key: "POD Receiving",
			value: "trip.aGR.acknowledge.systemDate"
		}, {
			key: "Advance Due Date",
			value: "vendorDeal.advance_due_date"
		}, {
			key: "To pay Due Date",
			value: "vendorDeal.topay_due_date"
		}, {
			key: "Ask Payment",
			value: "askPayment.date"
		}, {
			key: "LS Upload Date",
			value: "vendorDeal.ls_uploading_date"
		}
		],
		expensePaymentStatus: ["All", "Pending", "Partial Paid", "Paid", "Over Paid"],

		aGRstate: ["GR Not Assigned", "GR Assigned", "Vehicle Arrived for loading", "Loading Started", "Loading Ended", "Vehicle Arrived for unloading", "Unloading Started", "Unloading Ended", "Trip cancelled", "GR Received", "GR Acknowledged"],

		liveTrackStatus: ["Running", "Stopped", "In Traffic"],

		cargoType: ["Import - Containerized", "Export - Containerized", "Domestic - Containerized", "Import - Loose Cargo", "Export - Loose Cargo", "Domestic - Loose Cargo", "Empty - Containerized", "Empty - Vehicle", "Transporter Booking"],

		aBookingTypes: ["Domestic - Loose Cargo", "Import - Containerized", "Export - Containerized", "Domestic - Containerized", "Import - Loose Cargo", "Export - Loose Cargo", "Empty - Containerized", "Empty - Vehicle", "Transporter Booking"],

		aSegmentType: ['Default'],

		aCreditNoteType: ['Full', 'Full(Gr Reversal)', 'Partial'],

		aReportTypes: ["Profitability Report - Date Wise",
			"Profitability Report - Vehicle Wise",
			"Profitabilty Report - Customer Wise",
			"Trips - Date Wise",
			"Trips - Vehicle Wise",
			"Trips - Driver Wise",
			"Bills - Trip Wise",
			// "Bills - Driver Wise"
		],
		aBookingReportTypes: [
			/*"Booking Number",
            "Booking Type Wise",
            "Booking Date Wise",
            "Customer Wise",
            "Branch Wise"*/
			{key: 'booking_no', value: 'Booking Number'},
			{key: 'booking_type', value: 'Booking Type Wise'},
			{key: 'created_at', value: 'Booking Date Wise'},
			{key: 'customer', value: 'Customer Wise'},
			{key: 'branch_id', value: 'Branch Wise'},
		],
		aGrReportTypes: [
			/*"Booking Number",
            "Booking Type Wise",
            "Booking Date Wise",
            "Customer Wise",
            "Branch Wise"*/
			//{key: 'status', value: 'Status Wise'},
			//{key: 'grDate', value: 'Gr Date Wise'},
			//{key: 'BilledRpt', value: 'Billed Monthly Report'},
			{key: 'UnbilledRpt', value: 'Unbilled Monthly Report'},
			{key: 'UnbilledSumm', value: 'Unbilled Summary Report'},
			{key: 'LoadingRpt', value: 'Loading Monthly Report'},
			{key: 'grReportCron', value: 'Unbilled grs as on date'},
		],
		regVehPattern: "[A-Z]{2}[0-9]{1,}[A-z]{0,}[0-9]{4}",
		aBillStatus: [
			{key: 'pending', value: 'Unbilled'},
			{key: 'approved', value: 'Approved'},
			{key: 'billed', value: 'Billed'},
			{key: 'dispatched', value: 'Dispatched'},
		],
		aBillReportTypes: [
			/*"Booking Number",
            "Booking Type Wise",
            "Booking Date Wise",
            "Customer Wise",
            "Branch Wise"*/
			{key: 'billNo', value: 'Billing Number'},
			{key: 'billDate', value: 'Bill Date'},
			{key: 'dueDate', value: 'Due Date'},
			{key: 'status', value: 'Status '},
			{key: 'billingParty', value: 'Billing Party'},
			{key: 'type', value: 'Bill Type'},


		],
		aBillingRegister: [
			{key: 'all', value: 'All'},
			{key: 'billed', value: 'Billed'},
			{key: 'approved', value: 'Approved'},
			{key: 'dispatched', value: 'Dispatched'},

		],
		aJobCardReportTypes: [
			{key: 'vehicle_number', value: 'Vehicle Number Wise'},
			{key: 'jobId', value: 'Job Id Wise'},
			{key: 'job_type', value: 'Job Type Wise'},
			{key: 'maintenance_type', value: 'Maintenance Type Wise'},
			{key: 'flag', value: 'Flag Wise'},
			{key: 'vehicle_category', value: 'Vehicle Category Wise'},
			{key: 'status', value: 'Status Wise'}
		],
		aSpareConReportType: [
			{key: 'vehicle_number', value: 'Vehicle Number Wise'},
			{key: 'jobId', value: 'Job Id Wise'},
			{key: 'job_type', value: 'Job Type Wise'},
			{key: 'flag', value: 'Flag Wise'},
		],
		aJobCardTaskReportTypes: [
			{key: 'taskId', value: 'Task Id Wise'},
			{key: 'task_name', value: 'Task Name Wise'},
			{key: 'jobId', value: 'Job Id Wise'},
			{key: 'status', value: 'Status Wise'},
			{key: 'supervisor_name', value: 'Supervisor Wise'},
			{key: 'priority', value: 'Priority Wise'}
		],
		aToolReportTypes: [
			{key: 'spare_name', value: 'Tool Name Wise'},
			{key: 'status', value: 'Status Wise'},
			{key: 'invoice_number', value: 'Invoice Number Wise'},
			{key: 'category', value: 'Category Wise'},
			{key: 'vendor_name', value: 'Vendor Wise'}
		],
		aToolIssueReportTypes: [
			{key: 'tool_code', value: 'Tool Code Wise'},
			{key: 'vehicle_number', value: 'Vehicle Number Wise'},
			{key: 'issue_to_employee_name', value: 'Driver Wise'},
			{key: 'issue_to_employee_name', value: 'Mechanic Wise'},
			{key: 'issue_to_employee_name', value: 'Contractor Wise'},
			{key: 'toolId', value: 'Tool Id Wise'}
		],
		aTyreReportTypes: [
			{key: 'tyre_category', value: 'Tyre Category Wise'},
			{key: 'status', value: 'Status Wise'},
			{key: 'vendor_name', value: 'Vendor Wise'},
			{key: 'po_number', value: 'PO Wise'}
		],
		aTyreIssueReportTypes: [
			{key: 'tyre_number', value: 'Tyre Number Wise'},
			{key: 'jobVehicle', value: 'Vehicle Wise'},
			{key: 'structure_name', value: 'Structure Wise'},
			{key: 'jobId', value: 'Job Id Wise'}
		],
		aPRreportTypes: [
			{key: 'tyre_number', value: 'Tyre Number Wise'},
			{key: 'vehicle_no', value: 'Vehicle Wise'},
			{key: 'structure_name', value: 'Structure Wise'},
			{key: 'jobId', value: 'Job Id Wise'}
		],
		aTyreRetReportTypes: [
			{key: 'tyre_number', value: 'Tyre Number Wise'},
			{key: 'vendor_name', value: 'Vendor Wise'},
			{key: 'bill_no', value: 'Bill No. Wise'},
			{key: 'issue_slip_no', value: 'Issue Slip Wise'}
		],
		aPrimeTrailerAssoReportTypes: [
			{key: 'trailer_no', value: 'Trailer No. Wise'},
			{key: 'vehicle_reg_no', value: 'Vehicle Wise'},
			{key: 'associated_by_employee_name', value: 'Employee Name Wise'}
		],
		aBillDispatchReportTypes: [
			"Invoice Wise",
			"Customer Wise",
			"Vehicle Wise",
			"Bill Number Wise",
			"Billing Party Wise",
			"Dispatch Date Wise"
		],
		aContractorExpenseReportTypes: [
			{key: 'jobId', value: 'Job Id Wise'},
			{key: 'taskId', value: 'Task Id Wise'},
			{key: 'task_name', value: 'Task Name Wise'},
			{key: 'vehicle_number', value: 'Vehicle No. Wise'},
			{key: 'contractor_name', value: 'Contractor Wise'},
			{key: 'supervisor_name', value: 'Supervisor Wise'}
		],
		aExpenseReportTypes: [
			{key: 'type', value: 'Type Wise'},
			{key: 'jobId', value: 'Job Id Wise'},
			{key: 'vehicle_no', value: 'Vehicle No. Wise'},
			{key: 'expense_no', value: 'Expense No. Wise'},
			{key: 'bill_no', value: 'Bill No. Wise'}
		],
		aDateType: [
			{key: 'bill_date', value: 'Bill Date'},
			{key: 'created_at', value: 'Created Date'}
		],
		//aBookingTypes : ["Domestic - Loose Cargo"],
		aContainerTypes: ["20 Feet", "40 Feet"],
		aWeightTypes: ["Fixed", /*"PMT",*/ "PUnit", /*"Percentage"*/],
		aWeightUnits: ["MTonne", "Tonne", "Kilogram"],
		aLocationType: ["Loading", "Toll", "Unloading"],
		bookingTypes: {
			import_container: 'Import - Containerized',
			export_container: 'Export - Containerized',
			domestic_container: 'Domestic - Containerized',
			import_cargo: 'Import - Loose Cargo',
			export_cargo: 'Export - Loose Cargo',
			domestic_cargo: 'Domestic - Loose Cargo',
			empty_container: 'Empty - Containerized',
			empty_vehicle: 'Empty - Vehicle',
			//transporter: 'Transporter Booking'
		},

		aGSTstates: [
			{"state": "Jammu and Kashmir", "first_two_txn": "01", "state_code": "JK", "zone": "North"},
			{"state": "Himachal Pradesh", "first_two_txn": "02", "state_code": "HP", "zone": "North"},
			{"state": "Punjab", "first_two_txn": "03", "state_code": "PB", "zone": "North"},
			{"state": "Chandigarh", "first_two_txn": "04", "state_code": "CH", "zone": "North"},
			{"state": "Uttarakhand", "first_two_txn": "05", "state_code": "UK", "zone": "North"},
			{"state": "Haryana", "first_two_txn": "06", "state_code": "HR", "zone": "North"},
			{"state": "Delhi", "first_two_txn": "07", "state_code": "DL", "zone": "North"},
			{"state": "Rajasthan", "first_two_txn": "08", "state_code": "RJ", "zone": "West"},
			{"state": "Uttar Pradesh", "first_two_txn": "09", "state_code": "UP", "zone": "North"},
			{"state": "Bihar", "first_two_txn": "10", "state_code": "BH", "zone": "East"},
			{"state": "Sikkim", "first_two_txn": "11", "state_code": "SK", "zone": "North East"},
			{"state": "Arunachal Pradesh", "first_two_txn": "12", "state_code": "AR", "zone": "North East"},
			{"state": "Nagaland", "first_two_txn": "13", "state_code": "NL", "zone": "North East"},
			{"state": "Manipur", "first_two_txn": "14", "state_code": "MN", "zone": "North East"},
			{"state": "Mizoram", "first_two_txn": "15", "state_code": "MI", "zone": "North East"},
			{"state": "Tripura", "first_two_txn": "16", "state_code": "TR", "zone": "North East"},
			{"state": "Meghalaya", "first_two_txn": "17", "state_code": "ME", "zone": "North East"},
			{"state": "Assam", "first_two_txn": "18", "state_code": "AS", "zone": "North East"},
			{"state": "West Bengal", "first_two_txn": "19", "state_code": "WB", "zone": "East"},
			{"state": "Jharkhand", "first_two_txn": "20", "state_code": "JH", "zone": "East"},
			{"state": "Odisha", "first_two_txn": "21", "state_code": "OR", "zone": "East"},
			{"state": "Chattisgarh", "first_two_txn": "22", "state_code": "CT", "zone": "Central"},
			{"state": "Madhya Pradesh", "first_two_txn": "23", "state_code": "MP", "zone": "Central"},
			{"state": "Gujarat", "first_two_txn": "24", "state_code": "GJ", "zone": "West"},
			{"state": "Daman and Diu", "first_two_txn": "25", "state_code": "DD", "zone": "West"},
			{"state": "Dadra and Nagar Haveli", "first_two_txn": "26", "state_code": "DN", "zone": "West"},
			{"state": "Maharashtra", "first_two_txn": "27", "state_code": "MH", "zone": "West"},
			{"state": "Andhra Pradesh", "first_two_txn": "28", "state_code": "AP", "zone": "South"},
			{"state": "Karnataka", "first_two_txn": "29", "state_code": "KA", "zone": "South"},
			{"state": "Goa", "first_two_txn": "30", "state_code": "GA", "zone": "West"},
			{"state": "Lakshadweep Islands", "first_two_txn": "31", "state_code": "LD", "zone": "Coastal Zone"},
			{"state": "Kerala", "first_two_txn": "32", "state_code": "KL", "zone": "South"},
			{"state": "Tamil Nadu", "first_two_txn": "33", "state_code": "TN", "zone": "South"},
			{"state": "Pondicherry", "first_two_txn": "34", "state_code": "PY", "zone": "South"},
			{"state": "Andaman and Nicobar Islands", "first_two_txn": "35", "state_code": "AN", "zone": "Coastal Zone"},
			{"state": "Telangana", "first_two_txn": "36", "state_code": "TS", "zone": "South"},
			{"state": "Andhra Pradesh (New)", "first_two_txn": "37", "state_code": "AD", "zone": "South"}
		],

		aCategory: ["RCM", "FCM"],

		aPercent: ["0", "5", "12", "18", "24"],

		aRatings: [1, 2, 3, 4, 5],

		aUnits: ['Pcs', 'Ft', 'Tonne', 'Ltr', 'Bags', 'Box','Drum' ,'KG'],

		agpsVendor: ['Axestrack','Netradyne','Sensel','Dhanuka','Intugine', 'UPS','Trimble' ,'Efkon'],

		aConsignorConsigneeTypes: ["Consignor", "Consignee"],

		// aCustomerTypes: av ,

		vehStatus: ["In Trip", "Idle", "Maintenance", "Sold"],

		billingFrequencyClient: ["One time", "Yearly", "Monthly", "Bi-Weekly", "Weekly"],

		clientTypes: ["Indivisual", "Company"],

		idTypes: ["Driving License", "Aadhaar Card", "Passport", "Voter ID"],

		aAccountGroup: ["Bad Dept", "Customer", "Driver", "Happay", "Happay Master", "FastTag", "FastTag Master", "Diesel", "Managers", "Miscellaneous",
			"Vendor", "Sales", "Transaction", "Purchase", 'Toll tax', 'Hire Vehicle', 'Vehicle', 'Cashbook', 'banks', 'Internal Cashbook', 'Diesel-Bill',
			'Car', 'Generator', 'Staff', 'Office', 'Deduction', 'Lorry Hire', 'Loan', 'Others', 'Discount', 'IGST Paid', 'IGST Payable', 'IGST Receivable', 'CGST Paid',
			'CGST Payable', 'CGST Receivable', 'SGST Paid', 'SGST Payable', 'SGST Receivable', 'Adjustment', 'Vendor TDS', 'Receipt Deduction', 'Debtor with Hold'],

		aAccountTypes: ["Purchase Accounts", "Sales Account", "Duties and Taxes", "Direct Expenses", "Indirect Expenses",
			"Indirect Income", "Already Created in Tally", "Bank Account", "Deposit Account", "Capital A/c", "Current Assets",
			"Current Liabilities", "Sundry Creditor", "Loans and Advances (Assets)", "Loans Liabilities", "Fixed Assets",
			"Bank OCC", "Bank OD", "Branch/Divisions", "Cash in Hand", "Investments", "Stock-in-hand", "Misc. Expense (ASSET)",
			"Suspense A/c", "Secured Loan", "Unsecured Loan", "Reserve & Surplus", "Provisions", "Sundry Debtors"],

		fromAcByVoucherType: {
			"Sales": ["Sales Account", "Duties and Taxes", "Indirect Income"],
			"Purchase": ["Direct Expenses", "Indirect Expenses", "Sundry Creditor"],
			"Receipt": ["Duties and Taxes", "Sundry Debtors"],
			"Journal": ["Purchase Accounts", "Sundry Creditor"],
			"Credit Note": ["Sales Account", "Duties and Taxes", "Indirect Income"],
			"Debit Note": ["Purchase Accounts"],
			"Payment": ["Bank Account", "Cash in Hand"]
		},

		toAcByVoucherType: {
			"Receipt": ["Bank Account", "Cash in Hand"],
			"Journal": ["Duties and Taxes", "purchase"],
			"Salse": ["Sundry Debtors"],
			"Credit Note": ["Purchase Accounts"],
			"Debit Note": ["Sales Account", "Indirect Income"],
			"Purchase": ["Purchase Accounts", "Deposit Account"],
			"Payment": ["Duties and Taxes"]
		},

		aVouchersType: ["Receipt", "Journal", "Sales", "Purchase", "Payment", "Contra"],

		employmentTypes: ["Temporary", "Permanent"],

		departmentTypes: ["Production", "Research and Development", "Purchasing", "Marketing",
			"Human Resource Management", "Accounting and Finance"
		],

		roleTypes: ["Manager", "Deputy Manager", "Assistant Manager", "General Manager",
			"Regional Head", "Zonal Head", "Director"
		],

		company_details: {
			company_name: 'FUTURETRUCKS PVT. LTD',
			company_iso: '(AN ISO 9001 : 2008 Certified Company)',
			company_subtitle: 'FLEET OWNERS GOVT. TRANSPORT CONTRACTOR(20,40 FEET TRAILER & COVERED BODY)',
			company_address: 'Registered Office : 75, Khirki Village, Malviya Nagar, New Delhi - 110017. Head Office : F-35/3, Industrial Area, Okhla Phase II, New Delhi - 110020.',
			company_phone: '011-43122798',
			company_fax: '011-43122797',
			company_pan: 'AADCM9293K'
		},
		aExpenseType: ['Spare', 'Tyre', 'Other'],

		roleAccessTypes: ["Read", "Add", "Edit", "Approve", "Remove"],

		mechanicRoleTypes: ["Supervisor", "Mechanic"],

		uomTypes: ["Litre", "Set", "Feet", "Meter", "Kilo", "Piece", "Packet"],

		default_error_message: "Some error occurred. Please try again later",

		vehicleStructureTypes: ["Prime Mover", "Trailer", "Truck"],

		quot_statuses: ["Unapproved", "Expired", "Cancelled", "Approved for sale", "Partially converted to SO",
			"Fully converted to SO"],

		so_statuses: ["Unapproved", "Approved", "Declined", "Partially Invoiced", "Fully Invoiced"],

		billType: ['Maintenance', 'Spare', 'Tyre', 'FPA', 'Printing', 'Diesel', 'Assets', 'lorry Hire'],

		so_invoice_statuses: ["Unapproved", "Approved", "Dispatched", "Cancelled", "Part Payment Received", "Full Payment Received"],

		featureConfigMap: {
			trip: ["start", "end", "arrival", "loading_start", "loading_end", "unloading_start", "unloading_end"],
			booking: ["cancel", "deleted"],
			invoice: ["generated", "approved", "dispatched"],
			payment: ["settlement", "received", "paid", "overdue"],
			maintenance: ["start", "end", "due_date"],
			pod: ["received", "pending_15days"],
			profit_report: ["customer_wise", "date_wise", "daily", "weekly", "monthly", "aggregated"],
			trip_status_report: ["daily", "weekly"],
			"billing_report": ["daily", "weekly", "monthly"],
			"vehicle_status_report": ["daily", "weekly"],
			"costing_report": ["daily", "weekly", "monthly"]
		},

		featureDesc: {
			trip: "Trip",
			booking: "Booking",
			invoice: "Invoice",
			payment: "Payment",
			maintenance: "Maintenance",
			pod: "POD",
			profit_report: "Profitability report",
			trip_status_report: "Trip status report",
			"billing_report": "Billing report",
			"vehicle_status_report": "Vehicle status report",
			"costing_report": "Costing report"
		},

		"featureConfigDesc": {
			"start": "Start",
			"end": "End",
			"arrival": "Arrival",
			"loading_start": "Loading start",
			"loading_end": "Loading end",
			"unloading_start": "Unloading start",
			"unloading_end": "Unloading end",
			"cancel": "Cancel",
			"deleted": "Deleted",
			"generated": "Generated",
			"approved": "Approved",
			"dispatched": "Dispatched",
			"settlement": "Settlement",
			"received": "Received",
			"paid": "Paid",
			"overdue": "Over due",
			"due_date": "Due date",
			"pending_15days": "Pending 15 days",
			"customer_wise": "Customer wise",
			"date_wise": "Date wise",
			"daily": "Daily",
			"weekly": "Weekly",
			"monthly": "Monthly",
			"aggregated": "Aggregated"
		},

		app_key_desc_pair: {
			//"masters": "Masters",
			"branch": "Branch",
			"driver": "Driver",
			"route": "Transport Route",
			"sldo": "SLDO",
			"transportVendor": "All Vendor",
			"billingparty": "Billing Party",
			"consignorConsignee": "Consignor Consignee",
			"cityState": "City State",
			"directory": "Directory",
			"driverCounselling": "Driver Counselling",
			//"maintenanceVendor" :"Maintenance Vendor",
			"courierVendor": "Courier Vendor",
			"fuelVendor": "Fuel Vendor",
			"customerRateChart": "Rate Chart",
			"material": "Material",
			"customer": "Customer",
			//"regvehicle": "Registered Vehicle",
			"vehicle": "Vehicle",
			"registeredFleet": "Fleet",
			"registeredVehicle": "Registered Vehicle",
			"liveTrackPage": "Live Track",
			"liveTracker": "Live Tracker",
			"liveTrip": "Live Trip",
			"grMaster": "GR Master",
			"sendTripLoc": "Trip Location",
			"billBook": "Stationery",
			"incentive": "Incentive",
			"dph": "DPH",
			//"booking": "Booking",
			//"mybooking": "My Booking Management",
			"booking": "Booking",
			"bookings": "Bookings",
			"vehicleAllocation": "Vehicle Allocation",
			"trip": "Trip",
			"tripSettlement": "Trip Settlement",
			"roundTrip": "Round Trip",
			"driverOnVehicle": "Driver And Vehicle Association",
			"tripPerformance": "Trip Performance",
			"gr": "GR",
			"grWithOutTrip": "GR WithOut Trip",
			"createTrip": "Create Trip",
			"locationUpdate": "Update Location",
			"coverNote": "Cover Note",
			"tripAdvance": "Trip Advance",
			"incidental": "Incidental Expense",
			"fpa": "FPA Gr",
			"shipmentTracking": "Shipment Tracking",
			"fpaReports": "FPA Report",
			"diesel": "Diesels",
			"grAcknowledge": "GR Acknowledge",
			"grAckDetails": "GR Acknowledge Details",
			"createGR": "Create GR",
			"vehicleAccident": "Vehicle Accident",
			"tripMemo" : "Trip Memo",
			"brokerMemo" : "Broker Memo",
			"crossDocking" : "Cross Docking",
			"ewayBill" : "Eway Bill",
			"vehicleExp" : "Vehicle Expense",

			//"billing": "Billing Management",
			"savePrintBill": "Unbilled Gr",
			//"combineBill":"Combine Bills",
			"generatedBills": "Generated Bills",
			"genBillOBal": "Gen Multi Debitor Bill",
			"genCrBillOBal": "Gen Multi Creditor Bill",
			"tripExpense": "Trip Expense",
			"customerPayment": "Customer Payment",
			"vendorPayment": "Vendor Payment",
			"tripExpenseDetail": "Trip Expense Detail",
			"billDispatch": "Bill Dispatch",
			"billAcknowledge": "Bill Acknowledge",
			"billSettlement": "Bill Settlement",
			"purchaseBill": "Purchase Bill",
			"duesBill": "Dues Bill",
			"genBill": "Sales Invoice",
			"voucher": "Voucher",
			"tdsReport": "TDS Reports",
			"settleSelectedBill": "Money Receipt",
			"creditNote": "Credit Note",
			"debitNote": "Debit Note",

			//"logs": "Log Report",
			"logreport": "Log Report",

			//"reports": "Reports",
			"bookingReports": "Booking Report",
			"purRpt": "Purchase Bill Report",
			"grReports": "GR Report",
			"driverReports": "Driver Reports",
			"tripPerformanceReport": "Trip Performance Report",
			"dailyKmAnalysis": "Daily KM Analysis",
			"SettlementReport": "Settlement Report",
			"unbilledReport": "Unbilled Report",
			"billReport": "Billing Report",
			"costing": "Costing Report",
			"profit": "Profit Report",
			"profitReportGR": "Profit Report - GR",
			"hirePaymentRpt": "Hire Payment Report",
			"initialProfit": "Initial Profit Report",
			"trips": "Trip Report",
			"vehicles": "Vehicle Report",
			"fleetOwner": "Fleet Owner Report",
			"dieselEscalation": "Diesel Escalation",
			"do": "DO",
			"others": "Others",

			//"masters_maintenance": "Maintenance Masters",
			"mechanic": "Mechanic",
			"contractor": "Contractor",
			"modelList": "Model List",
			"taskMaster": "Task Master",
			"maintenance_inventory": "Maintenance Inventory",
			"inventory": "Inventory",
			"aggreInventory": "Aggregated Inventory",
			"toolMaster": "Tools",
			"spareIssue": "Spare ISsue",
			"printSlips": "Spare Slips",
			"dieselMaintenance": "Diesel",
			"otherExpenses": "Expenses",

			// material resource planing
			"customers": "Customers",
			"partCategory": "Category",
			"mrpVendor": "Vendor",
			"spares": "Materials",
			"spareList": "Spare List",

			// MRP PR-PO
			"pr": "PR",
			"prAdd": "Create New PR",
			"PrPo": "PR-PO",
			"POdetail": "PO Detail",
			"POrelease": "PO Release",


			//"maintenance_process": "Job Card",
			"jobCard": "Job Cards",

			//"maintenance_reports": "Maintenance Reports",
			"spareInventory": "Spare Inventory",
			"spareInventoryInward": "Spare Inventory Inward",
			"inventorySnapshot": "Inventory Snapshot",
			"JobCardReports": "Job Card",
			"JobCardTaskReports": "Job Card Task",
			"toolReports": "Tool",
			"toolIssueReport": "Tool Issue",
			"contractorExpenseReport": "Contractor Expense",
			"PRreport": "PR Report",
			"expenseReport": "Expense Report",
			"spareConsumption": "Spare Consumption",
			"combinedExpense": "Combined Expense",
			"masters_tyre_management": "Tyre Masters",
			"tyre_master": "Tyre Master",
			"trailer_master": "Trailer Master",
			"structure_master": "Structure Master",
			"prime_mover_trailer_association": "Prime mover trailer association",
			"retreated": "Retreated",

			//"masters_tyre_reports": "Tyre Report",
			"tyreReports": "Tyre",
			"tyreIssueReport": "Tyre Issue",
			"tyreRetreatReport": "Tyre Retreat",
			"primeTrailerAssoReport": "Prime Trailer association",

			//"client_management": "Client Management",
			"client": "Client",
			"icd": "ICD",

			//"user_management": "User Management",
			"department": "Department",
			"role": "Role",
			"user": "User",
			"dashboard": 'Dashboard',

			//GPS management
			"device_inventory": "Device Inventory",
			"device_slips": "Device Slips",
			"sim_inventory": "Sim Inventory",
			//"customer_master":"Customer Master"

			"quotation": "Quotation",
			'quote-so': 'Quote to SO',
			'so': 'SO',
			'so_invoice': 'SO Invoice',
			"quotation_report": "Quotation Report",
			"so_report": "SO Report",
			"invoice_report_so": "Invoice Report (SO)",

			//Customer contract documnet upload
			"customer_document": "Customer Document Upload",
			"customer_detention": "Customer Document Detention",

			//Accounting Managment
			"account_manster": "Account Master",
			"dayBook": "DayBook",
			"daywise": "Reports",
			"ledger": "Ledger",
			"bankReconciliation": "Bank Reconciliation",
			'account_report': 'Account Report',
			'gst_report': 'GST Report',
			'tds_report': 'TDS Report',
			'gstr-1': 'GSTR-1',
			'dues': 'Dues',
			'directOpBalance': 'Direct Op Balance',
			'costCategory': 'Cost Category',
			'costCenter': 'Cost Center',

			//Dashboard
			"summary": "Summary",
			"detail": "Detail",

			//Notification
			"notification": "Notification",

			//GPS
			"mapView": "Map View",
			"gpsDashboard": "GPS Dashboard",
			"gpsMoniter": "GPS Moniter",
			"gpsAnalytic": "Analytics",
			"gpsReports": "GPS Reports",
			"parkingReport": "Parking Reports",
			"historicalTripReport": "Historical Trip Report",
			"gpsPlayback": "Playback",
			"landmark": "Landmark",

			//Schema Configuration
			"configurations": "Configurations",

			'fpaMaster': 'FPA Master',
		},

		app_key_sref_pair: {
			"home": "home.apps",
			"masters": "masters.branch",
			"branch": "masters.branch",
			"driver": "masters.driverDetails.profile",
			"route": "masters.routeDetails.allRoutes",
			"sldo": "masters.sldoDetails.list",
			"transportVendor": "masters.vendorRegistration.show",
			"billingparty": "masters.billingParty",
			"consignorConsignee": "masters.consignorConsignee",
			"directory": "masters.directory",
			"driverCounselling": "masters.driverCounsellingList",
			//"maintenanceVendor" :"masters.vendorMaintenance",
			"courierVendor": "masters.vendorCourierCommon.profile",
			"fuelVendor": "masters.vendorFuelCommon.profile",
			"customerRateChart": 'masters.customerRateChart',
			"material": "masters.material",
			"cityState": "masters.cityState",
			"customer": "masters.customer.profile",
			"regvehicle": "masters.vehicle.profile",
			"vehicle": "masters.vehicle",
			"cityState": "masters.cityState",
			"registeredFleet": "masters.registeredFleet",
			"registeredVehicle": "masters.registeredVehicle",
			"liveTrackPage": "masters.liveTrackPage",
			"grMaster": "masters.grMaster.allGrMaster",
			"sendTripLoc": "masters.trip",
			"billBook": "masters.billBook",
			"incentive": "masters.incentive",
			"dph": "masters.dph",
			"configurations": "masters.configurations",
			'fpaMaster': 'masters.fpaMasterMain',

			// JA modified for fixing redirections
			// "sendTripLoc": "masters.trip.getLocInfo",

			"booking": "booking_manage.bookings",
			"mybooking": "mybooking_manage.bookings",
			"bookings": "booking_manage.bookings",
			"vehicleAllocation": "booking_manage.vehicleAlollcation.vehicleProvider",
			"trip": "booking_manage.myTrips",
			"tripSettlement": "booking_manage.tripSettlement",
			"roundTrip": "booking_manage.roundTrip",
			"tripPerformance": "booking_manage.tripAdvance",
			"driverOnVehicle": "booking_manage.driverOnVehicle",
			"gr": "booking_manage.myGR",
			"grWithOutTrip": "booking_manage.grWithOutTrip",
			"createTrip": "booking_manage.createTrip",
			"locationUpdate": "booking_manage.locationUpdate",
			"coverNote": "booking_manage.coverNote",
			"tripAdvance": "booking_manage.tripSuspense",
			"incidental": "booking_manage.incidental",
			"fpa": "booking_manage.fpa",
			"shipmentTracking": "booking_manage.shipmentTracking",
			"diesel": "booking_manage.myDiesel",
			"grAcknowledge": "booking_manage.myGR_acknowledge",
			"grAckDetails": "booking_manage.grAckDetails",
			"createGR": "booking_manage.createGR",
			"vehicleAccident": "booking_manage.vehicleList",
			"brokerMemo": "booking_manage.brokerMemo",
			"crossDocking": "booking_manage.crossDocking",
			"ewayBill": "booking_manage.ewayBill",
			"vehicleExp": "booking_manage.vehicleExp",

			"billing": "billing.bills",
			"generatedBills": "billing.generatedBills",
			"genBillOBal": "billing.genBillOBal",
			"genCrBillOBal": "billing.genCrBillOB",
			//"combineBill":"billing.combineBills",
			"customerPayment": "billing.customerPayment",
			"vendorPayment": "billing.vendorPayment",
			"savePrintBill": "billing.bills",
			"tripExpense": "billing.tripExpense",
			"tripExpenseDetail": "billing.tripExpenseDetail",
			"billDispatch": "billing.billDispatch",
			"billAcknowledge": "billing.billAcknowledge",
			"billSettlement": "billing.billSettlement",
			"purchaseBill": "billing.purchaseBill",
			"duesBill": "billing.duesBill",
			"genBill": "billing.genBill",
			"voucher": "accountManagment.voucher",
			"tdsReport": "accountManagment.tdsReport",
			"settleSelectedBill": "billing.settleSelectedBill",
			"creditNote": "billing.creditNote",
			"debitNote": "billing.debitNote",

			// material resource planing
			"customers": "MRP_master.customers.profile",
			"partCategory": "MRP_master.partCategory",
			"mrpVendor": "MRP_master.mrpVendor",
			"spares": "MRP_master.spares.spareList",
			"spareList": "MRP_master.spares.spareList",

			// MRP PR PO
			"pr": "mrp_pr_po.pr",
			"prAdd": "mrp_pr_po.prAdd",
			"PrPo": "mrp_pr_po.PrPo",
			"POdetail": "mrp_pr_po.POdetail",
			"POrelease": "mrp_pr_po.POrelease",

			"reports": "reports.billReport",
			"bookingReports": "reports.bookingReports",
			"logreport": "reports.logreport",
			"purRpt": "reports.purBillRpt",
			"grReports": "reports.grReports",
			"fpaReports": "reports.fpaReports",
			"driverReports": "reports.driverReports",
			"tripPerformanceReport": "reports.tripPerformanceReport",
			"dailyKmAnalysis": "reports.dailyKmAnalysis",
			"SettlementReport": "reports.SettlementReport",
			"unbilledReport": "reports.unbilledReport",
			"billReport": "reports.billReport",
			"costing": "reports.costingReport",
			"profit": "reports.profitReport",
			"profitReportGR": "reports.profitReportGR",
			"hirePaymentRpt": "reports.hirePaymentRpt",
			"initialProfit": "reports.initialProfitReport",
			"trips": "reports.tripReport",
			"vehicles": "reports.vehicleReport",
			"fleetOwner": "reports.fleetOwnerReport",
			"dieselEscalation": "reports.dieselEscalationReport",
			"do": "reports.doReport",
			"others": "reports.otherReport",

			"masters_maintenance": "maintenance.contractor",
			"contractor": "maintenance.contractor",
			"taskMaster": "maintenance.taskMaster",

			"maintenance_inventory": "maintenance_inventory.inventory",
			"inventory": "maintenance_inventory.inventory",
			"aggreInventory": "maintenance_inventory.aggreInventory",
			"toolMaster": "maintenance_inventory.toolMaster",
			"spareIssue": "maintenance_inventory.spareIssue",
			"printSlips": 'maintenance_inventory.printSlips',
			"dieselMaintenance": 'maintenance_inventory.dieselMaintenance',

			"otherExpenses": 'maintenance.otherExpenses',

			"maintenance_process": "maintenance_process.jobCardMain",
			"jobCard": "maintenance_process.jobCardMain",

			"maintenance_MRP": "maintenance_MRP.pr",

			"maintenance_reports": "maintenance_reports.spareInventory",
			"spareInventory": "maintenance_reports.spareInventory",
			"spareInventoryInward": "maintenance_reports.spareInventoryInward",
			"inventorySnapshot": "maintenance_reports.inventorySnapshot",
			"JobCardReports": "maintenance_reports.JobCardReports",
			"JobCardTaskReports": "maintenance_reports.JobCardTaskReports",
			"toolReports": "maintenance_reports.toolReports",
			"toolIssueReport": "maintenance_reports.toolIssueReport",
			"contractorExpenseReport": "maintenance_reports.contractorExpenseReport",
			"PRreport": "maintenance_reports.PRreport",
			"expenseReport": "maintenance_reports.expenseReport",
			"spareConsumption": "maintenance_reports.spareConsumption",
			"combinedExpense": "maintenance_reports.combinedExpense",

			"masters_tyre_management": "masters_tyre_management.tyre_master",
			"tyre_master": "masters_tyre_management.tyre_master",
			"trailer_master": "masters_tyre_management.trailer_master",
			"structure_master": "masters_tyre_management.structureMaster",
			"prime_mover_trailer_association": "masters_tyre_management.prime_mover_trailer_association",
			"retreated": "masters_tyre_management.retreated",

			"masters_tyre_reports": "masters_tyre_reports.tyreReports",
			"tyreReports": "masters_tyre_reports.tyreReports",
			"tyreRetreatReport": "masters_tyre_reports.tyreRetreatReport",
			"tyreIssueReport": "masters_tyre_reports.tyreIssueReport",
			"primeTrailerAssoReport": "masters_tyre_reports.primeTrailerAssoReport",

			"client_management": "clients.clientInfo",
			"client": "clients.clientInfo",
			"icd": "clients.icd",

			"user_management": "usermanage.users",
			"department": "usermanage.departments",
			"role": "usermanage.roles",
			"user": "usermanage.users",
			"dashboard": "usermanage.dashboard",

			"device_inventory": "gps_master.gpsInventory",
			"device_slips": "gps_master.device_slips",

			'quotation': 'sales_order.quotation',
			'quote-so': 'sales_order.quote-so',
			'so': 'sales_order.so',
			'so_invoice': 'sales_order.invoice',

			'quotation_report': 'reportsMRP.quotationReport',
			'so_report': 'reportsMRP.soReport',
			'invoice_report_so': 'reportsMRP.invoiceReport',

			//	JA customer contract documnet upload
			"customer_document": "masters.customer.document",
			"customer_detention": "masters.customer.detention",

			// Accounting Managment
			"account_manster": "accountManagment.accountMaster",
			"dayBook": "accountManagment.dayBook",
			"daywise": "accountManagment.daywise",
			"ledger": "accountManagment.ledger",
			"bankReconciliation": "accountManagment.bankReconciliation",
			'account_report': 'accountManagment.accountReport',
			'gst_report': 'accountManagment.accountGSTReport',
			'tds_report': 'accountManagment.accountTDSReport',
			'gstr-1': 'accountManagment.gstr-1',
			"dues": "accountManagment.dues",
			"directOpBalance": "accountManagment.openingBalance",
			"costCategory": "accountManagment.costCategory",
			"costCenter": "accountManagment.costCenter",

			// Dashboard
			"summary": "dashboard.summary",
			"detail": "dashboard.detail",

			//Notification
			"notification": "Alerts&Notification.notification",
			"liveTracker": "booking_manage.liveTracker",

			//Gps
			"mapView": "gps.tracking",
			"gpsDashboard": "gps.dashboard",
			"gpsMoniter": "gps.moniter",
			"gpsAnalytic": "gps.analytic",
			"gpsReports": "gps.reports",
			"parkingReport": "gps.parkingReport",
			"historicalTripReport": "gps.historicalTripReport",
			"gpsPlayback": "gps.playback",
			"landmark": "gps.landmark",
		},

		FTData: {
			name: "AKH Tech Logistics Pvt. Ltd. (Future Trucks)",
			pan_no: "22334455",
			tin_no: "33444322",
			service_tax_no: "4322299",
			line1: "F35/3, 2nd Floor",
			line2: "Okhla Industrial Area, Phase 2",
			city: "New Delhi",
			district: "New Delhi",
			state: "New Delhi",
			pincode: "110019",
			country: "India"
		},

		super_admin_role_name: "super_admin",

	};
	return constants;
})

	//Form Validation Global Service
	.service('formValidationgrowlService', function () {
		this.findError = function (error) {
			var dmsg = '';
			//Error Handle*************
			if (error && error.required) {
				for (i = 0; i < error.required.length; i++) {
					if (error.required[i].$name) {
						dmsg = dmsg + " " + error.required[i].$name + " ,";
					}
				}
			}

			if (dmsg) {
				dmsg = dmsg.substring(0, dmsg.length - 1);
				dmsg = dmsg + ' are require field.';
			}

			if ((error.minlength && error.minlength.length > 0) || (error.maxlength && error.maxlength.length > 0)) {
				var mobilemsg = '// Please enter valid mobile number';
				dmsg = dmsg + ' ' + mobilemsg;
			}

			if (error && error.email) {
				if (error.minlength || error.maxlength) {
					var emailmsg = ' and email address';
				} else {
					var emailmsg = ' Please enter valid email address';
				}
				dmsg = dmsg + emailmsg;
			}

			if (dmsg == '') {
				dmsg = 'Something wrong, please fill up form again ';
			}
			//***************************
			return dmsg;
		};
	});


// utils

materialAdmin.factory('utils', function ($rootScope, $http, $localStorage, $timeout) {

	let _marker = {},
		_counter = 1;

	var utils = {

		calTimeDiffCurrentToLastInDHM: function (lastDateTime, cur_date = new Date()) {

			cur_date = new Date(cur_date);

			var day = undefined, hour = undefined, halt_duration = '';
			if (!lastDateTime) return 'NA';
			var pos_date = lastDateTime;
			var diff = Math.abs(cur_date.getTime() - new Date(pos_date).getTime());
			var totalMin = (diff / 60000);
			var min = totalMin % 60;
			var totalHour = totalMin / 60;
			if (totalHour > 24) {
				hour = totalHour % 24;
				day = totalHour / 24;
			} else if (totalHour > 1) {
				hour = totalHour;
			}
			if (day) {
				halt_duration = parseInt(day) + 'd ';
			}
			if (hour) {
				halt_duration = halt_duration + parseInt(hour) + 'h ';
			}
			halt_duration = halt_duration + parseInt(min) + 'm';
			//$rootScope.aTrSheetDevice[j].stoppage_time = halt_duration;
			return halt_duration;
		},

		convertSecondsInToHour: function (seconds) {
			seconds = seconds / 3600;
			var hour = seconds.toFixed(2);
			return hour;
		},

		convertMeterInToKM: function (meter) {
			meter = meter / 1000;
			var KM = meter.toFixed(2);
			return KM;
		}
	};
	utils.setColor = {"running": "#15e425", "online": "#15e425", "stopped": "red", "offline": "grey"};

	function getSVG(status, icon) {
		var sColor = utils.setColor[status] ? utils.setColor[status] : "grey";
		//var svgCode = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" style="" xml:space="preserve" width="49.636" height="49.636"><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none"/> <g class="currentLayer" style=""><title>Layer 1</title><polygon style="" points="31.164264678955078,26.56472873687744 8.163265228271484,22.70972728729248 57.79926681518555,-0.07027208805084229 33.799264907836914,48.34572887420654 " id="svg_1" class="" transform="rotate(-135.31655883789062 32.981266021728516,24.137727737426754) " fill="'+ sColor +'" fill-opacity="1"/><g id="svg_2" class=""> </g><g id="svg_3" class=""> </g><g id="svg_4" class=""> </g><g id="svg_5" class=""></g><g id="svg_6" class=""></g><g id="svg_7" class=""></g><g id="svg_8" class=""></g><g id="svg_9" class=""></g><g id="svg_10" class=""></g><g id="svg_11" class=""></g><g id="svg_12" class=""></g><g id="svg_13" class=""></g><g id="svg_14" class=""></g><g id="svg_15" class=""></g><g id="svg_16" class=""></g></g></svg>';
		var svgCode = utils.takeIcon(icon, sColor);
		return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svgCode);
	}

	if(typeof L !== 'undefined' && typeof L.Icon !== 'undefined'){
		var GpsGaadiIcon = L.Icon.extend({
			options: {
				iconSize: [50, 50],
				shadowSize: [25, 25],
				iconAnchor: [10, 0],
				shadowAnchor: [4, 15],
				popupAnchor: [-3, -70]
			}
		});
	}

	utils.getDistanceInKm = function (lat1, lon1, lat2, lon2) {
		let R = 6371; // Radius of the earth in km
		let dLat = deg2rad(lat2 - lat1);  // deg2rad below
		let dLon = deg2rad(lon2 - lon1);
		let a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) * Math.sin(dLon / 2)
		;
		let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		let d = R * c; // Distance in km
		return d;
	};

	function deg2rad(deg) {
		return deg * (Math.PI / 180)
	}

	utils.initializeMapView = function (mapId, mapConfig, showCluster) {
		mapConfig = mapConfig || {
			zoomControl: true,
			hybrid: true,
			zoom: 5,
			search: false,
			location: false,
			center: new L.LatLng(21, 90)
		};
		var map = new MapmyIndia.Map(mapId, mapConfig);
		var obj = {
			map: map
		};
		if (showCluster) {
			obj.clusterL = utils.initializeCluster(map);
		}
		return obj;
	};

	utils.initializeCluster = function (map) {
		var markerClusterLayer = new PruneClusterForLeaflet();
		var markersLayer = new L.LayerGroup([markerClusterLayer]);	//layer contain searched elements

		map.addLayer(markersLayer);
		return markerClusterLayer;
	};

	utils.getAddress = function (info, callback) {
		if (info.start && info.start.latitude && info.start.longitude) {
			var lat = info.start.latitude;
			var lng = info.start.longitude;
		} else {
			var lat = info.lat;
			var lng = info.lng;
		}
		//var latlngUrl = "http://52.220.18.209/reverse?format=json&lat="+lat+"&lon="+lng+"&zoom=18&addressdetails=0";
		var latlngUrl = "http://13.229.178.235:4242/reverse?lat=" + lat + "&lon=" + lng;
		$http({
			method: "GET",
			url: latlngUrl
		}).then(function mySucces(response) {
			info.formatedAddr = response.data.display_name;
			callback();
		}, function myError(response) {
			info.formatedAddr = response.statusText;
		});

	};
	utils.makeMarker = function (marker, data) {
		var popupText = $('<div class="map-popup">' +
			'<p>Vehicle No.: <span>' + data.vehicle_reg_no + '</span></p>' +
			'<p ng-if="a.acc_high_local">ACC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;: <span>' + data.acc_high_local + '</span></p>' +
			'<p>Speed &nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;: <span>' + data.speed + ' &nbsp;&nbsp;KM/H. </span></p>' +
			'<p ng-show="a.ac_local" id="acId" class="acClass">AC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;: <span>' + data.ac_local + '</span></p>' +
			'<p>Location &nbsp;&nbsp;&nbsp;: <span>' + data.addr + '</span></p>' +
			'<p>Status &nbsp;&nbsp;&nbsp;: <span>' + data.status + '</span></p>' +
			'<p>Location Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span>' + moment(data.location_time).format('LLL') + '</span></p>' +
			'<p>Last Seen &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span>' + moment(a.datetime).format('LLL') + '</span></p>' +
			'<p>Positioning Time &nbsp;&nbsp;&nbsp;: <span>' + moment(data.positioning_time || data.location_time).format('LLL') + '</span></p>' +
			'<p ng-show="a.driver_name">Driver &nbsp;&nbsp;&nbsp;: <span>' + a.driver_name + '</span></p><hr class="m-t-5 m-b-5">' +
			'<p ng-show="a.driver_mobile">Driver No &nbsp;&nbsp;&nbsp;: <span>' + a.driver_mobile + '</span></p><hr class="m-t-5 m-b-5">' +
			'<p ng-if="a.NearLandMark">Nearest Landmark &nbsp;&nbsp;&nbsp;: <span>' + data.NearLandMark + '</span></p><hr class="m-t-5 m-b-5">' +
			'<a href="/#!/mains/mapZoom/' + data.imei + '" uib-tooltip="Tracking" title="Tracking"><span class="glyphicon glyphicon-road"></span></a>&nbsp;&nbsp;&nbsp;' +
			'<a class="' + data.imei + '" id="createLandmark" title="create landmark" uib-tooltip="create landmark"><span class="glyphicon glyphicon-map-marker"></span></a>&nbsp;&nbsp;&nbsp;' +
			'<a class="' + data.imei + '" id="createGeofence11" title="create Geofence" uib-tooltip="create Geofence"><span class="glyphicon glyphicon-globe"></span></a>&nbsp;&nbsp;&nbsp;' +
			'</div>');
		marker.setIcon(L.icon({
			iconUrl: getSVG(data.status, data.icon),
			iconSize: [21, 32]
		}));
		//tooltip on mouseover
		//marker.bindTooltip(data.vehicle_no,{permanent:true,direction:'top'})
		//	.openTooltip();
		marker.bindPopup(data.vehicle_no);
	};
	utils.addOnCluster = function (mapObj, marker, obj) {
		var a = obj;
		a = utils.prepareData(a); //// prepare data for 'ac' and 'acc' status
		a.rotationAngle = a.course || 90;
		var title = a.reg_no;

		mapObj.clusterL.RegisterMarker(marker);

		//set custom marker icon
		mapObj.clusterL.PrepareLeafletMarker = utils.makeMarker;
		mapObj.map.addLayer(mapObj.clusterL);
		//fit map bound
		//mapObj.clusterL.FitBounds();

		//ProcessView function must be

		mapObj.clusterL.ProcessView();
	};

	utils.createMarker = function (obj) {
		var a = obj;
		a = utils.prepareData(a); //// prepare data for 'ac' and 'acc' status
		a.rotationAngle = a.course || 90;
		var marker = new PruneCluster.Marker(a.lat, a.lng); //create prune cluster marker
		marker.data = a;
		return marker;
	};

	function saveInfo(dt) {
		$rootScope.maps.map.closePopup();
		$rootScope.globalDataForLandmark = dt;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/main/landPopMap.html',
			controller: 'crtLandCtrl'
		});
	}

	utils.prepareData = function (info) {
		if (info.acc_high === true) {
			info.acc_high_local = "On";
		} else if (info.acc_high === false) {
			info.acc_high_local = "Off";
		} else if (info.acc_high === undefined) {
			info.acc_high_local = "NA";
		}

		if (info.ac_on === true) {
			info.ac_local = "On";
		} else if (info.ac_on === false) {
			info.ac_local = "Off";
		} else if (info.ac_on === undefined) {
			info.ac_local = "NA";
		}
		return info;
	};

	utils.prepareCluster = function (mapObj, allMarkers) {
		mapObj.clusterL.addLayers(allMarkers);
		mapObj.map.addLayer(mapObj.clusterL);
	};

	utils.lineMarkerSvg = function (color) {
		//return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" style="" xml:space="preserve" width="49.636" height="49.636"><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none"/> <g class="currentLayer" style=""><title>Layer 1</title><polygon style="" points="23.164264678955078,36.56473159790039 0.16326522827148438,32.7097282409668 49.79926681518555,9.929727554321289 25.79926300048828,58.34572982788086" id="svg_1" class="" transform="rotate(-44.91157150268555 24.981266021728523,34.13772583007813) " fill="' + color + '" fill-opacity="1"/><g id="svg_2" class=""> </g><g id="svg_3" class=""> </g><g id="svg_4" class=""> </g><g id="svg_5" class=""></g><g id="svg_6" class=""></g><g id="svg_7" class=""></g><g id="svg_8" class=""></g><g id="svg_9" class=""></g><g id="svg_10" class=""></g><g id="svg_11" class=""></g><g id="svg_12" class=""></g><g id="svg_13" class=""></g><g id="svg_14" class=""></g><g id="svg_15" class=""></g><g id="svg_16" class=""></g></g></svg>';
		return '<svg enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z" fill="' + color + '"/></svg>';
	};

	utils.takeIcon = function (ico, iColor) {
		var svgCode;
		//var svgCode = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" style="" xml:space="preserve" width="49.636" height="49.636"><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none"/> <g class="currentLayer" style=""><title>Layer 1</title><polygon style="" points="23.164264678955078,36.56473159790039 0.16326522827148438,32.7097282409668 49.79926681518555,9.929727554321289 25.79926300048828,58.34572982788086" id="svg_1" class="" transform="rotate(-44.91157150268555 24.981266021728523,34.13772583007813) " fill="#15e425" fill-opacity="1"/><g id="svg_2" class=""> </g><g id="svg_3" class=""> </g><g id="svg_4" class=""> </g><g id="svg_5" class=""></g><g id="svg_6" class=""></g><g id="svg_7" class=""></g><g id="svg_8" class=""></g><g id="svg_9" class=""></g><g id="svg_10" class=""></g><g id="svg_11" class=""></g><g id="svg_12" class=""></g><g id="svg_13" class=""></g><g id="svg_14" class=""></g><g id="svg_15" class=""></g><g id="svg_16" class=""></g></g></svg>';
		if (ico === "bike") {
			svgCode = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
				'          viewBox="0 0 152.1 151.7" style="enable-background:new 0 0 152.1 151.7;" xml:space="preserve">\n' +
				'              <style type="text/css">\n' +
				'      .st0{fill:' + iColor + ';}\n' +
				'      .st1{fill:#FFFFFF;}\n' +
				'      </style>\n' +
				'          <path class="st0" d="M63.7,149.6l4.5-0.1c0,0,1.3,1.8,3.1,2.1s4.8,0.1,4.8,0.1l4.8-0.1c1.8-0.4,3.1-2.1,3.1-2.1l4.5,0.1\n' +
				'          c0,0-1.7,2.5,1.9,2.6s3-1.4,2.9-3s-1.2-2.4-2.5-2.6c-1.3-0.2-2.3,1.9-2.3,1.9s-3.4,0-4,0s2.1-5.8,2.7-8.4c0.6-2.6,0.9-7.3,1-10.8\n' +
				'          c0.1-3.4-0.8-16.3-0.6-17.2c0.2-1,9.3-11.2,8.8-12.7c-0.5-1.5-0.1-2.7,0.5-4.5s2.8-7.2,3.6-8s0.4-5.4,0.2-6.8\n' +
				'          c-0.1-1.4-1.1-4-0.7-5.7c0.4-1.8,1.2-3.8,1.2-3.8s3.8-1.2,4.7-2.4s-1.1-4.7-1.1-4.7s2.3-0.7,3-0.4c0.7,0.3,3,0.7,3.2,0\n' +
				'          c0.2-0.7,1.3,0,1.3,0s0.4-0.8,0-1.7c-0.4-0.9-5.6,0-5.6,0s-0.7-0.2-0.7-1.5c-0.1-1.3-0.4-1.5-1.2-1.9c-0.7-0.4-2.6-2.3-3.3-3.2\n' +
				'          s-2.2-2.9-2.9-2.9c-0.7,0.1-2.6,1.6-2.1,2.1c0.5,0.4,1,2,0.6,2.2c-0.4,0.2-0.7-0.3-2.9-4.3c-2.3-4-4.7-6.8-5.8-7.3\n' +
				'          c-1.1-0.5-3.2,0.1-3.3-0.4c-0.1-0.5,0.2-1.3,1.5-1.6s7.1,2.2,12.4,3.2c5.3,1,6.8-2.3,7-3.5c0.1-1.2-13.5-11.4-13.5-11.4\n' +
				'          s0.2-0.2,0-1.8c-0.2-1.5-2.1-2.6-3.9-2.6c-1.8,0-2.3-1.2-2.3-1.2s-0.2-7.6-0.5-8.2s-3.2-0.5-3.2-0.5s-0.4-9.1-0.4-9.7\n' +
				'          C82.2,6,81.1,6,81.1,6s0-3.2-1-4.7c0,0-1.1-1.3-4.1-1.2c0,0-3.2-0.2-4.1,1.2C71,2.7,71,6,71,6S69.9,6,69.8,6.6\n' +
				'          c-0.1,0.6-0.4,9.7-0.4,9.7s-2.9-0.1-3.2,0.5S65.6,25,65.6,25s-0.5,1.2-2.3,1.2s-3.7,1-3.9,2.6c-0.2,1.5,0,1.8,0,1.8\n' +
				'          S45.8,40.9,46,42.1c0.1,1.2,1.7,4.5,7,3.5c5.3-1,11.2-3.4,12.4-3.2s1.5,1.1,1.5,1.6c-0.1,0.5-2.2-0.1-3.3,0.4\n' +
				'          c-1.1,0.5-3.5,3.4-5.8,7.3c-2.3,4-2.6,4.5-2.9,4.3c-0.4-0.2,0.1-1.8,0.6-2.2c0.5-0.4-1.4-2-2.1-2.1c-0.7-0.1-2.2,1.9-2.9,2.9\n' +
				'          s-2.6,2.9-3.3,3.2c-0.7,0.4-1.1,0.6-1.2,1.9c-0.1,1.3-0.7,1.5-0.7,1.5s-5.2-0.9-5.6,0c-0.4,0.9,0,1.7,0,1.7s1.1-0.7,1.3,0\n' +
				'          c0.2,0.7,2.6,0.3,3.2,0s3,0.4,3,0.4s-2,3.6-1.1,4.7s4.7,2.4,4.7,2.4s0.8,2.1,1.2,3.8c0.4,1.8-0.5,4.3-0.7,5.7\n' +
				'          c-0.1,1.4-0.6,5.9,0.2,6.8s3,6.2,3.6,8s1,3,0.5,4.5c-0.5,1.5,8.6,11.7,8.8,12.7c0.2,1-0.7,13.8-0.6,17.2c0.1,3.4,0.4,8.2,1,10.8\n' +
				'          c0.6,2.6,3.3,8.4,2.7,8.4s-4,0-4,0s-1-2.1-2.3-1.9c-1.3,0.2-2.4,1-2.5,2.6s-0.7,3.1,2.9,3C65.4,152.1,63.7,149.6,63.7,149.6z\n' +
				'          M53.6,67.6c-0.5-0.8-0.1-1.5-0.2-3.3s-1-1.6-0.8-2.1s1.5-0.1,2-0.5c0.5-0.3,2.3-3.2,2-4.1c-0.2-0.8-0.6-0.5-0.3-1.3\n' +
				'          s6.9-10.2,7.5-10.6s2.8,0,2.8,0s1.6,2.5,0,2.5c-1.6,0-6,3.2-7.2,5.4c-1.2,2.2-0.3,5.5-0.3,6.2S58,60,56.7,60.6\n' +
				'          C55.4,61.2,55,69,55,69S54.1,68.4,53.6,67.6z M95.1,60.6c-1.3-0.6-2.4,0-2.4-0.8s0.8-4-0.3-6.2c-1.2-2.2-5.6-5.3-7.2-5.4\n' +
				'          c-1.6,0,0-2.5,0-2.5s2.2-0.4,2.8,0s7.2,9.8,7.5,10.6s-0.1,0.5-0.3,1.3c-0.2,0.8,1.6,3.8,2,4.1c0.5,0.3,1.7-0.1,2,0.5\n' +
				'          s-0.8,0.3-0.8,2.1s0.3,2.5-0.2,3.3c-0.5,0.8-1.4,1.4-1.4,1.4S96.4,61.2,95.1,60.6z"/>\n' +
				'          <path class="st1" d="M70.7,24.1c1.1-1,4.2-1.4,4.2-1.4h2.9c0,0,3.1,0.4,4.2,1.4c1.1,1-4.2,0-4.2,0H75C75,24.1,69.6,25.1,70.7,24.1z"\n' +
				'              />\n' +
				'              <circle class="st1" cx="77.2" cy="43.2" r="1.2"/>\n' +
				'              <circle class="st1" cx="87.4" cy="59.5" r="2.8"/>\n' +
				'              <circle class="st1" cx="64.4" cy="59.5" r="2.8"/>\n' +
				'              <circle class="st1" cx="76.6" cy="53.5" r="3.4"/>\n' +
				'              <path class="st1" d="M70.1,137c-2.8-0.4-4.7-3.6-5.5-4.9s-0.1-4.7,0-6s1.5-3.5,2.7-6.7c1.2-3.1-0.4-7.2-0.4-7.2s-1.5-2.8,0.5-1.4\n' +
				'          s8.6,1.4,8.6,1.4c3.9-0.1,8.2-1.4,8.2-1.4c2-1.5,0.5,1.4,0.5,1.4s-1.6,4.1-0.4,7.2c1.2,3.1,2.6,5.3,2.7,6.7s0.9,4.7,0,6\n' +
				'          s-2.8,4.5-5.5,4.9l-5.6,0.3c0,0-0.1,0-0.2,0C75.1,137.4,72.5,137.4,70.1,137z"/>\n' +
				'          <path class="st1" d="M76.9,79.2c-7.3,0-13.2,6.3-13.2,14s5.9,14,13.2,14s13.2-6.3,13.2-14S84.2,79.2,76.9,79.2z M76.7,83.9\n' +
				'          c-5.6,0.1-9.4,2.9-9.4,2.9c1.9-3.4,5.5-5.7,9.7-5.7c3.8,0,7.2,1.9,9.2,4.9C86.1,85.9,82.3,83.8,76.7,83.9z"/>\n' +
				'          <g>\n' +
				'          </g>\n' +
				'          <g>\n' +
				'          </g>\n' +
				'          <g>\n' +
				'          </g>\n' +
				'          <g>\n' +
				'          </g>\n' +
				'          <g>\n' +
				'          </g>\n' +
				'          <g>\n' +
				'          </g>\n' +
				'          </svg>';
		} else if (ico === "person") {
			svgCode = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 199.27 199.27" style="enable-background:new 0 0 199.27 199.27;" xml:space="preserve"><g><path fill="' + iColor + '" d="M99.568,47.971c13.225,0,23.983-10.76,23.983-23.984C123.552,10.76,112.793,0,99.568,0S75.584,10.76,75.584,23.986C75.584,37.211,86.344,47.971,99.568,47.971z M99.568,15c4.953,0,8.983,4.031,8.983,8.986c0,4.954-4.03,8.984-8.983,8.984c-4.954,0-8.984-4.03-8.984-8.984C90.584,19.031,94.614,15,99.568,15z"/><path fill="' + iColor + '" d="M122.951,152.469v-23.484c5.331-4.412,8.5-10.99,8.5-18.059v-33.23c0-12.935-10.522-23.457-23.455-23.457H91.273c-12.934,0-23.455,10.522-23.455,23.457v33.23c0,7.069,3.168,13.646,8.497,18.059l0.003,23.487c-21.235,1.914-49.852,7.371-49.852,22.886c0,22.759,60.975,23.912,73.197,23.912c12.213,0,73.139-1.153,73.139-23.912C172.803,159.833,144.187,154.379,122.951,152.469z M99.664,184.27c-30.98,0-50.509-5.23-56.713-8.891c4.187-2.426,14.889-6.021,33.37-7.837l0.001,7.814c0.001,4.143,3.359,7.5,7.501,7.499c4.143-0.001,7.5-3.359,7.499-7.501l-0.008-50.328c0-2.771-1.528-5.315-3.973-6.618c-2.79-1.486-4.523-4.354-4.523-7.482v-33.23c0-4.663,3.793-8.457,8.455-8.457h16.723c4.662,0,8.455,3.794,8.455,8.457v33.23c0,3.127-1.734,5.994-4.527,7.482c-2.445,1.304-3.973,3.849-3.973,6.619v50.328c0,4.143,3.357,7.5,7.5,7.5s7.5-3.357,7.5-7.5v-7.816c18.495,1.813,29.198,5.413,33.376,7.84C150.141,179.038,130.63,184.27,99.664,184.27z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>';

		} else if (ico === "child") {
			svgCode = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
				'                  viewBox="0 0 269.3 269.3" style="enable-background:new 0 0 269.3 269.3;" xml:space="preserve">\n' +
				'                      <style type="text/css">\n' +
				'              .st0{fill:none;stroke:#494949;stroke-miterlimit:10;}\n' +
				'              .st1{fill:' + iColor + ';stroke:#494949;stroke-miterlimit:10;}\n' +
				'              </style>\n' +
				'                  <g id="Layer_x0020_1">\n' +
				'                      <rect class="st0" width="269.3" height="269.3"/>\n' +
				'                      <g id="_4955610640">\n' +
				'                      <path class="st1" d="M64.1,118.1c-1.6,3.7-2.5,4.6-2.8,9.7c-0.3,3.9,0,8.1,0.5,12c0.6,4.9,2.5,16.7,4.6,20.1\n' +
				'                  c4.8,7.9,15,15.8,23.8,19.2c1.4,0.5,3.2,0.9,4.5,1.7c1.3,0.2,14.5,3.9,15.5,4.3c3.1,0.5,6.7,1.6,10,2.3c3.5,0.7,7,1.4,10.7,2\n' +
				'                  c8,1.3,14.9,2.1,23.2,2.3c3.5-0.3,5.5-0.6,8.3-1.8c1.3-0.5,2.2-1,3.4-1.6c1.2-0.7,2-1.4,3.4-2l5.6-4.7c2-1.9,3.1-3.2,5.2-5.2\n' +
				'                  l7.5-8.2c5.8-6.2,11-13.4,15.8-20.6c2.2-3.3,4.1-4.4,3.8-7.1c-1.1-0.9-7.8-7.4-8.7-9c-1.4-2.6-1.5-9.5-6.9-11.1\n' +
				'                  c-2.3,0-3.5,0.7-4.9,1.8c-1.5,1.1-2.2,1.6-3.9,2.5c-2.9,1.6-5.1,3.7-6.9,5.9c-2.3,1.6-3.7,4.5-6.1,5.4c0.6,3.6,0.6,7.7-0.1,11.1\n' +
				'                  l-0.8,4c3.1,0.9,5.8,4.3,3.1,5.5c-1.3,0.6-3.3,0.1-4.6-0.1l-0.9,0c-1,3.1-4.9,7.8-6.7,9.4c-23.8,21.3-63.3,3.9-65.7-25\n' +
				'                  c2.3-3.6,2-7.1,0.1-8.2l0.2,0.1l0-0.9l0.5-1.9c-0.1-1.1-0.9-1.4-1.5-2.8c-1.1-1.4-2.6-1.6-2.2-4c-1.2-1.4-2.6-4.6-3.1-6.7\n' +
				'                  c-2.8-4.7-1.8-2.3-4-4.7c-6.5-0.1-8.1-1.8-16.2,3.5c-1,0.7-1.4,0.9-2.1,1.6C65.1,117.4,64.7,118,64.1,118.1z"/>\n' +
				'                  <path class="st1" d="M111.3,107.8c-2.1,0.9-6,4.6-8,6.5l-0.7,1.1c0.3,1.5,0.6,0.8-0.8,1.1c0.1,0.1,0.3,0.1,0.4,0.2\n' +
				'                  c0.1,0.1,0.2,0.1,0.3,0.2c1.1,0.9-0.6-1.1,0.5,0.4c1.1,1.5,0.2-0.2,0.1,0.7c0,0.1-0.3,1-0.3,2l-2.4-0.1c-0.8-0.3-0.7,0.1-0.9-0.4\n' +
				'                  c-0.1-0.1-0.2-0.1-0.3-0.1l-1.7,3.3l-2.1,5.4l-0.6,1.9l-0.5,1.9c-0.6,4.6-0.4,8.2-0.4,8.2l0.1,0.8c2.4,28.9,41.9,46.3,65.7,25\n' +
				'                  c1.8-1.6,5.7-6.3,6.7-9.4l0.9,0l-0.5-0.6c0.3-0.9,0.7-1.7,1-2.6c0.4-1.2,0.3-1.4,1-2.2l0.8-4c-0.3-7.1,0.3-9.8-1.8-16.3\n' +
				'                  c-1.6-4.8-4-8.1-6.5-11.3c-4.6-5.7-19-12.6-24.5-8.1l-0.7-1.2c-0.9-2.4-1.4-4.1-4.5-5.7c-4.5-2.6-5.6-2.3-11.1-1.1\n' +
				'                  C118,104.1,112.6,106.4,111.3,107.8z"/>\n' +
				'                  <path class="st1" d="M98.7,33.4L98.5,34l-0.9,0.1c0.9,3.1,2.8,12.2,1.8,14.7c3.6-0.4,3.8,2.4,0.6,2.5c1,3-0.1,5.8-0.8,9\n' +
				'                  c-0.6,2.6-1.3,5.7-1.9,8.1c0.7,0,0.3-0.2,1,0.1c0.6,0.3,0.3,0.1,0.6,0.6c2.8-0.9,18.5-5.4,20.2-4.8c0.9,3.9-7.1,2.6-11.1,5.1\n' +
				'                  l43.3,0.2c0.1-2-0.1-4.9,1-6.1c1.2,1.1,1.1,4.3,1,6.3l1.4-0.3c2.5-4.1,4.6-4.7,10.8-4.8c0.1-3.6,1.6-8.8,2.9-11.7\n' +
				'                  c0.7-1.5,1.8-3.5,3.4-4c2.6-0.8,3.2,1.2,4.6,2.2c0-7.1,1-13.2-4-16.7c-3.8-2.7-13.7-1.7-19.1-1.7c-6.8,0-37.5-0.4-41.5,0.1l4.8,1\n' +
				'                  c4.3,0.7,2.9,2.5,1.6,2.7c-1.3,0.3,0.9,0-0.6,0.1c-0.4,0-1.1-0.1-1.5-0.2l-7.7-1.4C105.5,34.7,101.7,34.2,98.7,33.4z"/>\n' +
				'                  <path class="st1" d="M51.2,29.4c-1.3,2.7-1.8,7.5-2.3,10.7c-1.3,7.5-2,7,0.8,9.9c-4,2.4-2.6,3.5-1.2,10c0.8,3.7,1.4,8.2,2.9,11.3\n' +
				'                  c2.9,1.2,2.2,1.2,6.1,1.2c2.3,0,4.7,0,7,0c4.7,0,9.8,0.2,14.4-0.1c-1-2.2-5.2-1.2-4.5-4.8c1.5-0.8,1.8-0.3,3.4-0.2\n' +
				'                  c-1.8-3.4-5.4-3.4-3.3-7.3c2-0.3,3.6,0.9,4.2,1.9l0.5-0.1c-1-2-4.6-6.7-0.1-7.7c3.1-0.7,4.6,4.5,4.6,7.3c0.3-2.8-0.2-6.3,0.2-8.8\n' +
				'                  c0.5-2.6,3.2-3.6,5.5-1.9c2.3,1.8,1.7,3.3,1,6.3c-0.8,3.6-0.3,5-0.3,8.2c0.7,0.9,0.6,1.2,0.9,2.4c0.4,2.7,1.1,3.5,2.9,4.6\n' +
				'                  c1.6-0.4,1.7-0.7,2.8-1.3l0.8-1.7l0-1c0.6-2.5,1.3-5.6,1.9-8.1c0.7-3.1,1.8-6,0.8-9l-1.6-0.9l-0.8-0.4l0.7-0.5l1-0.7\n' +
				'                  c1-2.6-0.9-11.6-1.8-14.7v-0.8l-0.5-2.6l-0.6-1.4c-3.1-2.2-6-1.5-10.7-1.5H61.4C56.9,27.8,54,27,51.2,29.4z"/>\n' +
				'                  <path class="st1" d="M166.1,64.8l0.1,1.2c2.7,1.4,4.8,0.1,5.9,3.4l0.1,0.4c0.9,2,0.7,8.2-0.6,9.6l-0.5,0.7\n' +
				'                  c-1.4,2.7-5.7,2.6-6.5,3.7c-0.2,2.6,0.3,1.6,1.2,3.2l0.6,0.6c1.1,0.6,1.2,1.2,2.9,1.7c1.4,0.4,2.7,0.4,4.1,0.2\n' +
				'                  c2.4-0.4,4.4-2.4,6.4-1.8c6.3,5.6,15.1,18.1,18,25.5c-1,1-2.8,2.3-4,3.3c-1.4,1.2-2.4,2.6-3.5,3.6l1.3,0.5\n' +
				'                  c5.4,1.5,5.5,8.5,6.9,11.1c0.9,1.6,7.6,8.1,8.7,9c1,0,0.7,0.1,2.3-1.8c0.7-0.9,1.4-1.4,2.1-2.2c4-4.9,8.7-9.1,10.3-16.2\n' +
				'                  c2.6-11.1-6.4-18.3-11.8-23l-4.5-4.6c-1.4-1.5-3.1-3.4-4.5-4.9c-3.5-3.6-6.9-5.9-8.8-9.9l-0.8-2l-1-3l-0.3-0.9l-2-5.3\n' +
				'                  c-1.7-1.4-0.1-2.3-3.7-2.1c-0.8-2.4-1.2-2.9-4.2-2.5c-0.2-0.6-0.4-0.9-0.7-1.4c-1.2-1-2.1-1.5-4.1-0.6c-2.1,0.9-0.6-0.4-3.6-0.1\n' +
				'                  C169.2,60.5,167,63,166.1,64.8z"/>\n' +
				'                  <path class="st1" d="M79.1,61.9c0.5,0.6-0.1-0.8,0.5,0.6c0.4,1.1,0.1,0-0.2,0.5c-0.9-0.7-0.4-0.4-0.8-1.1c-0.6-1-2.2-2.2-4.2-1.9\n' +
				'                  c-2.1,3.9,1.5,3.9,3.3,7.3c-1.6-0.1-1.9-0.6-3.4,0.2c-0.7,3.6,3.6,2.6,4.5,4.8l0.1,1.4c-0.3,2.2-3.5,7.8-4.6,10.4\n' +
				'                  c-1.7,3.7-3.1,6.7-4.4,10.7c-1.6,4.9-5.4,16.6-6.1,22c-0.2,1.7-0.4,1,0.3,1.2c0.6-0.1,1-0.7,1.6-1.3c0.7-0.7,1.2-0.9,2.1-1.6\n' +
				'                  c8.1-5.4,9.7-3.7,16.2-3.5l0.8-0.2c0.2-6.6,2-8.1,4.2-15.4c5.3-18.1,2-17.1,11.9-14.7c3.1,0.8,6-0.4,6-3.3c0-1.8-2.9-4.5-4.3-5.1\n' +
				'                  c-3-1.2-4,0.4-6.1,0.6c-0.3,0.1-1,0-1.4-0.1c-1-0.3-0.3,0.3-1-0.5c-0.1-0.1-0.3-0.5-0.4-0.7c-1.8-1-2.5-1.9-2.9-4.6\n' +
				'                  c-0.2-0.3-0.1,0.1-0.4-0.7c-0.1-0.1-0.1-0.4-0.2-0.5c-0.1-0.5-0.1-0.7-0.2-1.2c0-3.3-0.5-4.6,0.3-8.2c0.7-3.1,1.3-4.5-1-6.3\n' +
				'                  c-2.2-1.8-5-0.7-5.5,1.9c-0.5,2.5,0.1,6-0.2,8.8c-0.1-2.8-1.5-8-4.6-7.3C74.5,55.2,78.1,59.9,79.1,61.9z"/>\n' +
				'                  <path class="st1" d="M145.5,220.5c-2.8,5.6-6.5,12.5-1.2,17.5c4,3.8,9.8,7.1,16.5,3.2c5.6-3.2,7-7.6,8-15.8\n' +
				'                  c0.5-3.7,3.1-18.9,2.7-21.1c-1.3-3.5-2.4-7-6.6-7.9c-4.8-0.9-8.4,0.9-10.8,3.3c-4.5,4.7,0.5,10.9-5.2,16.8\n' +
				'                  C148.3,217.4,145.9,220.3,145.5,220.5z"/>\n' +
				'                  <path class="st1" d="M95.3,205.3c0.2,2.9,1.7,6.1,2.3,9.6c2.1,10.9,1.9,19.4,11.2,24.4c2.5,1.3,6,2.9,9.3,1.7c2.4-0.8,5.8-3.6,7-5\n' +
				'                  c4.7-5.5,2.5-10.3-1.7-17c-1.1-0.7-1-1.1-2.2-1.8c-3.3-2.3-5.1-2.4-6-5.4c-1.3-4.3,0.3-9.7-2.5-12.9c-2.2-2.6-7.1-4.2-11.6-2.9\n' +
				'                  C97.3,197.1,96.1,200.8,95.3,205.3z"/>\n' +
				'                  <path class="st1" d="M148.9,108.5c9.6,5.2,18.5,13.9,20.8,27.5c2.4-0.9,3.8-3.9,6.1-5.4c-1-1.2-0.7-4.7-3.1-9.7\n' +
				'                  C165.7,105.8,150.8,106.6,148.9,108.5z"/>\n' +
				'                  <path class="st1" d="M154.8,69.5l-0.9,3.5l-0.1,3.4c1.2,2.8,0.7,4,3,6c1.8,1.5,4,2,7,2.2l0.8-0.8c0.8-1.2,5-1,6.5-3.7\n' +
				'                  c-12.8,0.8-11.8-12.5,1-10.6c-1.1-3.2-3.1-1.9-5.9-3.4l-0.1-1.2l-0.5-0.1C159.4,64.8,157.3,65.4,154.8,69.5z"/>\n' +
				'                  <path class="st1" d="M88,116.4c0.5,2.1,1.8,5.3,3.1,6.7c2-1.9,3.7-0.9,6.4-0.5l1.7-3.3l2.3-3.1c0.4-0.5,0.2-0.3,0.5-0.6l0.5-0.3\n' +
				'                  l0.7-1.1c2-1.9,5.9-5.6,8-6.5c-1.6-2.5-10.2-1.5-14.3,0.5c-2.7,1.3-5.3,3.5-7.2,5.9C89.2,114.9,88.8,115.7,88,116.4z"/>\n' +
				'                  <path class="st1" d="M95.4,198.9c1.9-2.2,2.8-4.1,6.3-5.1c1.7-0.5,3.6-0.5,5.5-0.3c2.5,0.3,2.9,0.9,4.6,1.4\n' +
				'                  c-0.2-1.8-0.3-3.3-0.5-5c-0.2-2-0.9-3.2-1-4.7c-1-0.5-14.2-4.1-15.5-4.3c0.4,1.3,0.9,2.8,1.1,4.1c0.2,1.4,0,3.2,0.1,4.8\n' +
				'                  C96.3,193.9,95.8,195.2,95.4,198.9z"/>\n' +
				'                  <path class="st1" d="M169.7,147.1c0.7-3.5,0.7-7.6,0.1-11.1c-2.3-13.6-11.3-22.3-20.8-27.5c-2.6-1.2,0.1-2.4-2.1-3.8\n' +
				'                  c-1.2-0.7-2-0.3-2.9,0.4l-0.8,0.7c-3-0.6-4-1.2-8.3-1.9c-3.5-0.5-2.8-0.2-3.1,0.5c3.1,1.6,3.7,3.3,4.5,5.7l0.7,1.2\n' +
				'                  c5.4-4.5,19.9,2.4,24.5,8.1c2.5,3.1,4.9,6.5,6.5,11.3C169.9,137.3,169.4,140.1,169.7,147.1z"/>\n' +
				'                  <path class="st1" d="M165.6,64.7l0.5,0.1c0.9-1.8,3.1-4.3,5.7-4.5c3-0.3,1.5,1,3.6,0.1c2-0.9,2.9-0.4,4.1,0.6\n' +
				'                  c0.7-2.5-2.5-7.5-2.9-9.7c-1.4-0.9-2.1-3-4.6-2.2c-1.6,0.5-2.7,2.5-3.4,4C167.2,55.9,165.7,61.2,165.6,64.7z"/>\n' +
				'                  <path class="st1" d="M166.2,88.2c0.4,3.9,3.1,12.3,6.9,12c3.7-0.2,6.4-8.2,6.7-12.6c-2-0.7-4,1.3-6.4,1.8\n' +
				'                  c-1.4,0.3-2.7,0.2-4.1-0.2c-1.6-0.5-1.8-1.1-2.9-1.7L166.2,88.2z"/>\n' +
				'                  <path class="st1" d="M95.4,198.9c-1.2,2.7-0.8,3.7-0.1,6.3c0.8-4.5,2-8.1,5.9-9.2c4.6-1.4,9.4,0.3,11.6,2.9\n' +
				'                  c2.7,3.2,1.1,8.6,2.5,12.9c0.9,3,2.7,3.1,6,5.4c1.1,0.7,1,1.2,2.2,1.8c-3.5-6.6-5.2-2.6-7.7-16c-0.2-1-0.4-2.3-0.7-3.3\n' +
				'                  c-0.3-1-1-1.8-1.1-2.6c-0.5-0.3-0.2-0.2-0.6-0.5c-0.1-0.1-0.4-0.4-0.5-0.5c-0.6-0.6-0.5-0.5-0.9-1.1c-1.7-0.5-2.1-1.1-4.6-1.4\n' +
				'                  c-1.9-0.2-3.8-0.2-5.5,0.3C98.2,194.9,97.3,196.7,95.4,198.9z"/>\n' +
				'                  <path class="st1" d="M154.1,191.7l0.1,3.5l0,1.2c3.2-1.3,4.6-2.8,9.5-2.1c4.4,0.7,5.2,2.8,7.4,4.7c-1.8-3.6-1.6-8.6-1.9-12.9\n' +
				'                  c-1.4,0.6-2.2,1.3-3.4,2c-1.2,0.7-2.1,1.1-3.4,1.6C159.6,191.1,157.6,191.4,154.1,191.7z"/>\n' +
				'                  <path class="st1" d="M154.2,196.5c-1.1,1.9-2.2,2.3-2.8,5.3c-0.5,2.2-0.9,4.8-1.4,7c-0.9,4.3-2.8,7.9-4.5,11.7\n' +
				'                  c0.4-0.2,2.8-3.2,3.4-3.8c5.7-6,0.7-12.2,5.2-16.8c2.4-2.5,6-4.3,10.8-3.3c4.2,0.9,5.3,4.3,6.6,7.9c0.1-0.1,0.1-0.3,0.1-0.3\n' +
				'                  c0,0,0.1-0.2,0.1-0.3c0,0,0.3-0.7,0.1-2.3c-0.1-1-0.5-1.6-0.8-2.5c-2.2-1.9-3-4-7.4-4.7C158.8,193.6,157.4,195.2,154.2,196.5z"/>\n' +
				'                  <path class="st1" d="M51.2,29.4c2.8-2.4,5.7-1.6,10.2-1.6h24.3c4.7,0,7.6-0.7,10.7,1.5l-1.2-2.4c-2.4-0.4-0.1-0.6-5.2-0.6h-30\n' +
				'                  C55.9,26.4,52,25.4,51.2,29.4z"/>\n' +
				'                  <path class="st1" d="M98.9,69.1l-1.6,0.3l-0.8,1.7l-0.4,1.2l12-2.9c3.9-2.5,11.9-1.2,11.1-5.1C117.4,63.7,101.7,68.2,98.9,69.1z"\n' +
				'                      />\n' +
				'                      <path class="st1" d="M171.1,80l0.5-0.7c-6.6-2.6-5.4-8.4,0.6-9.6l-0.1-0.4C159.3,67.5,158.3,80.8,171.1,80z"/>\n' +
				'                      <path class="st1" d="M97.6,33.3l1.1,0.1c3,0.7,6.8,1.2,9.9,1.8l7.7,1.4c0.4,0.1,1.1,0.2,1.5,0.2c1.5,0-0.7,0.2,0.6-0.1\n' +
				'                  c1.3-0.2,2.7-2-1.6-2.7l-4.8-1c-3.9,0.1-10.7-1.8-14.9-2.3L97.6,33.3z"/>\n' +
				'                  <path class="st1" d="M78.9,73.8l-0.1-1.4c-4.7,0.2-9.7,0.1-14.4,0.1c-2.3,0-4.7,0-7,0c-3.9,0-3.2,0-6.1-1.2\n' +
				'                  c0.7,2.4,2.2,2.6,4.7,2.6c2.6,0,5.1,0,7.7,0C68.3,73.9,74.5,74.3,78.9,73.8z"/>\n' +
				'                  <path class="st1" d="M171.6,79.3c1.3-1.4,1.5-7.5,0.6-9.6C166.2,71,165,76.8,171.6,79.3z"/>\n' +
				'                      <path class="st1" d="M122.7,48.9c-1.2,0.7-0.7,1.9,0.2,2.2c0.6,0.2,3,0.1,3.9,0.1c1.4,0,6.8,0.3,7.7-0.3c0.8-0.5,0.6-1.6-0.2-2\n' +
				'                  C133.6,48.6,123.7,48.3,122.7,48.9z"/>\n' +
				'                  <path class="st1" d="M118.3,49.1c-0.3-0.1-15.1-2-12.4,1.7c0.9,1.1,5.5,0.5,7.2,0.5C115.9,51.3,119.1,52.2,118.3,49.1z"/>\n' +
				'                      <path class="st1" d="M138.7,48.8c-0.9,3.4,3,2.4,6.1,2.4c2.9,0,7.3,1,6.3-2.2C149.3,48.3,141.3,48.7,138.7,48.8z"/>\n' +
				'                      <path class="st1" d="M155,50.6c1.4,1.1,3.8,0.7,6.2,0.7c2.3,0,5.2,0.4,6.5-0.6l-0.1-1.7c-1.7-0.5-5.1-0.3-7.1-0.3\n' +
				'                  C158.1,48.7,154.7,47.8,155,50.6z"/>\n' +
				'                  <path class="st1" d="M91.1,123.1c-0.4,2.4,1.1,2.6,2.2,4l2.1,0.9l2.1-5.4C94.9,122.3,93.1,121.3,91.1,123.1z"/>\n' +
				'                      <path class="st1" d="M167.4,156.5c1.2,0.2,3.3,0.7,4.6,0.1c2.8-1.2,0-4.6-3.1-5.5c-0.6,0.7-0.6,0.9-1,2.2c-0.3,0.9-0.7,1.7-1,2.6\n' +
				'                  L167.4,156.5z"/>\n' +
				'                  <path class="st1" d="M151.4,69.6l0.2,3.5c0,0,0.2,0.5,0.3,0.6c0.5,0.5,0,0.1,0.6,0.5c0.9-0.6,0.3,0,1-1.2l0-3.2\n' +
				'                  c0.1-2,0.3-5.2-1-6.3C151.3,64.7,151.5,67.6,151.4,69.6z"/>\n' +
				'                  <path class="st1" d="M188.2,66.9l2,5.3l0.8,0.3l0.3,0.6h1.3c-0.1-1.6-0.4-3.2-0.9-4.6c-0.6-1.8-1.1-2.8-3.2-2.4\n' +
				'                  C188.3,66.5,188.3,66.4,188.2,66.9z"/>\n' +
				'                  <path class="st1" d="M178,175.9c4.1-2.1,12.3-16,11.5-18c-0.4,0.5-3.4,6.8-5.2,9.4C183.5,168.6,178.4,174.9,178,175.9z"/>\n' +
				'                      <path class="st1" d="M153.4,76.4l-1.8-0.3c-0.1,2.6-0.7,6.6,0.9,8.3c0.4-0.3,0.2,0,0.5-0.5c0.5-0.8,0.5-1.9,0.5-2.8\n' +
				'                  C153.6,79.5,153.5,78,153.4,76.4z"/>\n' +
				'                  <path class="st1" d="M114.8,117.9c0.8-0.4,3.6-4.5,11.7-1c3.1,1.3,1.4,0.3,2-0.3c-2.4-0.7-3.2-2-7.3-1.9\n' +
				'                  C118.3,114.7,115.3,115.4,114.8,117.9z"/>\n' +
				'                  <path class="st1" d="M136.9,161.2c1.1,0.4,14.4-3.4,15.4-4.3c-0.9-0.4-6.4,1.4-7.8,1.7C142.6,159.1,137.9,160,136.9,161.2z"/>\n' +
				'                      <path class="st1" d="M144.4,115.1c0.7,0.5,0.6,0.4,1.5,0.7c2.9,0.8,5.3,1.4,7.9,3.1c1.2,0.8,1.1,1.5,2.7,1.5c-0.1-1,0.2-0.9-2-2.3\n' +
				'                  c-2-1.4-3.8-1.9-6.3-2.7c-0.5-0.1-1.3-0.4-1.9-0.6C144.1,114.4,144.5,115,144.4,115.1z"/>\n' +
				'                  <path class="st1" d="M83.8,136.8L83.8,136.8l-0.1-1.1c-1.8,0.7-3.1,0.8-4.6,1.8c-3.2,2-8.6,6.4-9.9,9.3\n' +
				'                  C71.2,145.4,75.9,138.1,83.8,136.8z"/>\n' +
				'                  <path class="st1" d="M120.4,170.5c-0.5-0.9-4.3-4.1-5.1-4.8c-1-0.9-1.6-1.6-2.5-2.5c-0.5-0.5-0.9-0.7-1.3-1.3\n' +
				'                  c-0.8-1-0.2-0.8-1.4-1.3c0.7,2.5,6.1,7.1,8.6,9.2C119.3,170.2,119.4,170.3,120.4,170.5z"/>\n' +
				'                  <path class="st1" d="M191.5,76.1h1.2c1.3-0.4,2-0.3,2.7-1.3c-0.6-1.5,0.3-0.4-2.7-1.6h-1.3l-0.8-0.1L191.5,76.1z"/>\n' +
				'                      <path class="st1" d="M99.2,119.4c0.1,0.1,0.2,0,0.3,0.1c0.2,0.5,0.1,0.1,0.9,0.4l2.4,0.1c0-1,0.3-1.9,0.3-2c0.1-0.9,1,0.8-0.1-0.7\n' +
				'                  c-1.1-1.5,0.6,0.5-0.5-0.4c-0.1-0.1-0.2-0.2-0.3-0.2c-0.1-0.1-0.3-0.1-0.4-0.2c1.4-0.3,1.1,0.4,0.8-1.1l-0.5,0.3\n' +
				'                  c-0.3,0.3-0.1,0.1-0.5,0.6L99.2,119.4z"/>\n' +
				'                  <path class="st1" d="M104.4,140.3l-0.6-0.1c0.6,1.7,7.5,11.1,9.2,11.5C112.7,151.1,106.2,143.4,104.4,140.3z"/>\n' +
				'                      <path class="st1" d="M151.6,76.1l1.8,0.3l0.4,0l0.1-3.4l-0.5,0c-0.7,1.2,0,0.5-1,1.2c-0.6-0.4-0.1,0-0.6-0.5c0,0-0.3-0.6-0.3-0.6\n' +
				'                  c-1.2,0.7-0.9,0.3-1.5,1.3C150.3,75.7,150.6,75.5,151.6,76.1z"/>\n' +
				'                  <path class="st1" d="M100.9,213c0.2,0.1-0.4,1.9,2.7-0.3c5.1-3.7,3.1-2,6.3-4c0.4-0.2,0.4-0.3,0.6-0.5c-0.1-0.1-0.2-0.2-0.2-0.1\n' +
				'                  h-0.9c0,0-1.3,0.5-1.4,0.5C105,210,104.1,212.4,100.9,213z"/>\n' +
				'                  <path class="st1" d="M156,214.2c0.6,0.4,9.3,2.7,9.9,2.4c-1.4-1.4-7.7-2.7-9.1-2.6C156.2,214.1,156.3,214.1,156,214.2z"/>\n' +
				'                      <path class="st1" d="M98.4,49.5l0.1,0.9l1.6,0.9c3.2-0.1,3-2.9-0.6-2.5L98.4,49.5z"/>\n' +
				'                      <path class="st1" d="M124.1,171.9l10.2-1.3c-0.3-0.3,0.7-0.7-2.6-0.5c-0.9,0.1-1.9,0.2-2.8,0.3C127.2,170.6,125,171,124.1,171.9z"\n' +
				'                      />\n' +
				'                      <path class="st1" d="M147.3,145.8c1,1.6,5.9,2.9,7.5,2c-0.9-0.7-2.3-0.6-4-1.1C149.6,146.3,148.3,145.2,147.3,145.8z"/>\n' +
				'                      <path class="st1" d="M156.5,210.2l7.8,3.5c-0.3-1-0.1-0.8-1.4-1.5C161,211.3,157.8,209.5,156.5,210.2z"/>\n' +
				'                      <path class="st1" d="M100.1,210.9c0.1-0.1,0.2-0.2,0.2-0.1c0,0.1,0.1-0.1,0.2-0.2c0.5-0.4-0.2,0.1,0.3-0.3c0.6-0.5,0-0.1,0.7-0.6\n' +
				'                  c0.5-0.3,1-0.7,1.6-1.1c1.1-0.6,2.5-0.9,3.6-1.7l-0.4-0.2c-0.1,0-1.9,0.2-3.6,1.1C101.3,208.7,100.1,209.2,100.1,210.9z"/>\n' +
				'                  <path class="st1" d="M77.8,107.5c0.8,0.4,1.9,0,3,0l2.9-0.1c0.7-0.1-0.1,0.5,0.9-0.5C82.8,105.8,79.1,106.4,77.8,107.5z"/>\n' +
				'                      <path class="st1" d="M199.2,112.2c1.2,0.2,5.3-0.7,6-1.7c-1-0.5-1.8-0.1-3,0.2C200.8,111.1,199.7,111,199.2,112.2z"/>\n' +
				'                      <path class="st1" d="M183.2,84.1l3.9-3.1c0.5-0.4,1-0.9,1.2-1.2C186.2,79.7,183.9,82.7,183.2,84.1z"/>\n' +
				'                      <polygon class="st1" points="153.5,69.8 153.4,73 153.9,73 154.8,69.5 \t\t"/>\n' +
				'                      <path class="st1" d="M80.8,72.7c2-2,2-0.8,4-2l-2.7-0.1C80.9,71.1,80.6,71.4,80.8,72.7z"/>\n' +
				'                      <path class="st1" d="M93.7,72.4c0.1,0.1,0.3,0.5,0.4,0.7l1.4,0.1l0.6-0.8l0.4-1.2C95.4,71.7,95.3,72,93.7,72.4z"/>\n' +
				'                      <path class="st1" d="M94.8,129.9l0.6-1.9l-2.1-0.9C93.9,128.6,94.8,128.8,94.8,129.9z"/>\n' +
				'                      <path class="st1" d="M177.5,63.8c-0.4-1.5-0.9-1.9-2.4-2.1c0.6,0.8,0.2,0.3,1,1C176.8,63.2,176.7,63.3,177.5,63.8z"/>\n' +
				'                      <path class="st1" d="M97.3,69.4l1.6-0.3c-0.3-0.5,0-0.3-0.6-0.6c-0.7-0.4-0.2-0.2-1-0.1L97.3,69.4z"/>\n' +
				'                      <polygon class="st1" points="192.3,78 192.6,76.1 191.5,76.1 \t\t"/>\n' +
				'                      <path class="st1" d="M79.1,61.9L78.6,62c0.4,0.7-0.1,0.3,0.8,1.1c0.3-0.5,0.6,0.6,0.2-0.5C79,61.1,79.6,62.5,79.1,61.9z"/>\n' +
				'                      <path class="st1" d="M182,65.3c0.5-0.7,0.8,0.5,0.4-0.7c-0.3-0.8-0.2-0.3-0.9-0.5L182,65.3z"/>\n' +
				'                      <polygon class="st1" points="83.8,136.8 84.4,136.6 84.4,135.6 83.8,135.7 \t\t"/>\n' +
				'                      <polygon class="st1" points="97.6,34.1 98.5,34 98.7,33.4 97.6,33.3 \t\t"/>\n' +
				'                      <path class="st1" d="M90.8,67.8c-0.3-1.2-0.1-1.5-0.9-2.4c0.1,0.4,0.1,0.7,0.2,1.2c0.1,0.1,0.1,0.4,0.2,0.5\n' +
				'                  C90.8,67.9,90.6,67.5,90.8,67.8z"/>\n' +
				'                  <polygon class="st1" points="190.5,73.1 191.3,73.2 191,72.5 190.2,72.2 \t\t"/>\n' +
				'                      <path class="st1" d="M166.2,88.2l0.3-0.7l-0.6-0.6c-0.1,1.1-0.3-0.1,0,0.8c0,0.1,0.1,0.2,0.1,0.3C166,88.1,166.1,88.2,166.2,88.2z\n' +
				'                  "/>\n' +
				'                  <polygon class="st1" points="98.5,50.4 98.4,49.5 97.7,49.9 \t\t"/>\n' +
				'                      </g>\n' +
				'                      </g>\n' +
				'                      </svg>';
		} else if (ico === "truck") {
			svgCode = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
				'\t viewBox="0 0 269.3 269.3" style="enable-background:new 0 0 269.3 269.3;" xml:space="preserve">\n' +
				'<style type="text/css">\n' +
				'\t.st0{fill:none;stroke:#444444;stroke-miterlimit:10;}\n' +
				'\t.st1{fill:' + iColor + ';stroke:#444444;stroke-miterlimit:10;}\n' +
				'</style>\n' +
				'<g id="Layer_x0020_1">\n' +
				'\t<rect class="st0" width="269.3" height="269.3"/>\n' +
				'\t<path class="st1" d="M175.4,254.6H93.2V102.8h10.9c-0.9-4.1-1.5-0.5-9.7-2.6c-2.5-6.2-1-42.9-1.1-53.2l-10.5,2.5\n' +
				'\t\tc-1.9,0-1.3,0.4-1.2-1.6c3.8-3.7,8.8-5.6,12-8.4c0.8-14.5,2.5-20.3,17.7-22c1.1-0.1,3.4-0.2,4.3-0.4c4.6-1.1-2.7-1.6,13-1.6\n' +
				'\t\tc6.5,0,13.4-0.2,19.7,0.1l1.1,1.7l5.7,0.4c13.4-0.3,15.2,6.3,17.7,13.9c2.2,6.6,0.5,6.9,6,9.8c3.9,2.1,6.7,3.9,8.9,6.7\n' +
				'\t\tc0.1,1.9,0.5,1.4-1.3,1.4l-10.6-2.6c0.1,6.7,1.3,45.2-0.2,50.3c-1.6,5.4-6.1,3.1-9.3,3.7c-3.3,0.6-1.8-1.2-2.6,2h11.6V254.6z\n' +
				'\t\t M156.9,19.4c-0.1,3.6,2.8,5.8,5,7.2c2.7,1.9,5.1,4,8.3,4.5C170.2,24,164,19.7,156.9,19.4z M110,19.6c-7.5-0.4-13,4.5-13.3,11.6\n' +
				'\t\tC101.6,30.1,110.4,24.1,110,19.6z M172.5,86.5l-8.9,0c0,8.4,0.9,9.9,8.9,10.3L172.5,86.5z M105.8,87.8l-2.9-0.2l-2.3,0l-3.9,0.1\n' +
				'\t\tl0,10.3C105.3,97.9,105.5,96.1,105.8,87.8z M96.8,44.1l-0.2,5.2l0,18.9v4.5v6.1l0,6.3h9.6C106.2,66.2,108.9,54.6,96.8,44.1z\n' +
				'\t\t M172.8,43c-12,6.8-10.5,29.7-9.4,40.9l9.2,0L172.8,43z M168.5,38c-7.9-4.7-60.2-5.4-69.2-0.6c0,1.9,6.2,15.2,10.3,15.2\n' +
				'\t\tc1.5,0,9.1-1.1,11.5-1.4c4.3-0.5,12.7-4.8,22.8-0.7c3.4,1.4,8.4,1.1,12.2,1.7c6.2,0.9,5.6-0.8,8.2-5.2\n' +
				'\t\tC166,44.1,168.6,41.4,168.5,38z"/>\n' +
				'</g>\n' +
				'</svg>';

		} else if (ico === "bus") {
			svgCode = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
				'\t viewBox="0 0 269.3 269.3" style="enable-background:new 0 0 269.3 269.3;" xml:space="preserve">\n' +
				'<style type="text/css">\n' +
				'\t.st0{fill:none;stroke:#565656;stroke-miterlimit:10;}\n' +
				'\t.st1{fill:' + iColor + ';stroke:#565656;stroke-miterlimit:10;}\n' +
				'\t.st2{fill:#FFFFFF;stroke:#565656;stroke-miterlimit:10;}\n' +
				'</style>\n' +
				'<g id="Layer_x0020_1">\n' +
				'\t<rect class="st0" width="269.3" height="269.3"/>\n' +
				'\t<path class="st1" d="M96.9,248.6l7.7-0.5l-0.5,9.8c13.1,1.7,16.9,2.2,30.7,2.2c6.2,0,25.4-0.3,30.5-2.3l-0.5-9.8l7.7,0.5V57.2\n' +
				'\t\tc-0.1-0.1,0.1-0.2-0.6-0.5c-0.9-0.3-0.1-0.8-0.8,0.2c0.7,3.1-0.2,8.8-0.2,12.3l-0.1,2.3c-0.3,4.8-0.6,9.6-0.8,14.3\n' +
				'\t\tc-0.1,2.2-0.2,4.8-0.6,6.9c-0.5,2.6-1.2,3.1-4,3.3c-1.2-4.1-0.4-17.5,0-22.4c0.1-1.1,0.1-2.4,0.5-3.3c0-2.2,1.6-13,2.6-14.1\n' +
				'\t\tc0.8-0.5,0.3-0.3,1.6-0.3c-0.9-0.7-0.8-0.4-1-1.2c-0.8-3.3,2.8-1.6,3.4-1.4c0-7.7,0.7-20.4-0.7-26.8c-1.1-1.4-1.4-1.3-2.5-2.3\n' +
				'\t\tc-2.1,4.5-7.5,2.2-9.8-0.6c-2-2.4-4.8-5.9-5.8-10.1l0.1-0.2c-8.6-3.1-24.6-3.1-34.1-1.1l-4,1.4c0,1.7-1.5,4-2.4,5.4\n' +
				'\t\tc-0.5,0.7-1,1.7-1.5,2.4c-5.4,7.5-10.9,5.8-11.5,2.7c-1.4,1.1-1.6,1-2.6,2.3c-0.5,2.2-0.7,3.8-0.7,6.3c0,2.4-0.3,4-0.3,6.6\n' +
				'\t\tc0,4.6,0,9.3,0,13.9c0.4-0.1,4.5-2.2,3.7,1.4c-0.3,1.1,0,0.5-1.1,1.1c1.2,0.1,0.9-0.2,1.7,0.4c1,0.9,2.6,12,2.6,14.3\n' +
				'\t\tc0.4,0.9,0.4,1.9,0.5,3.1c0.2,4.5,1.2,18.8-0.1,22.3c-2.7-0.1-3.5-0.8-4-3.3c-0.5-2.7-1.4-19-1.2-20.9l-0.2-2.6\n' +
				'\t\tc0-3.7-0.9-9-0.2-12.4c-0.7-0.9,0.1-0.5-0.8-0.1c-0.3,0.1-0.5,0.3-0.7,0.5c-0.5,2-0.2,42.2-0.2,47.8c0,46.8,0.2,93.9,0,140.7\n' +
				'\t\tC96.6,247.2,96.8,247.5,96.9,248.6z M106.1,69.7c1,0.3,11.6-1.1,13.6-1.3c10.3-0.9,19.4-1,29.8,0c2.1,0.2,12.9,1.6,13.9,1.4\n' +
				'\t\tc0.8-4.8,1.8-9.5,2.7-14.3c0.9-4.7,1.9-11.1-1.8-13.6c-4.4-3-23.5-4.7-29.5-4.7c-6.3,0-24.9,1.6-29.6,4.7\n' +
				'\t\tc-3.7,2.4-2.6,8.9-1.8,13.4C104.2,60.2,105.3,64.8,106.1,69.7z"/>\n' +
				'\t<path class="st1" d="M106.4,74.4l0.1-1.4c-0.1-0.7-0.2-1.4-0.3-2.1c2.8-1.4,26.3-2.4,28.5-2.4c6,0,23,1,28.4,2.3\n' +
				'\t\tc-0.1,6.8-0.7,19.4-0.4,26.3c0.1,1.7-0.2,1,0.6,1.4c0.5-0.3,0.5,0.3,0.4-2.2l0.2-19c0.2-7.8,1.1-11.9,2.5-19.4c1.1-6,3-14.1-2-16.9\n' +
				'\t\tc-3.3-1.8-13.8-3.4-18-3.9c-11.8-1.4-28.3-0.6-39.5,3.1c-6.7,2.3-5.6,9.2-4.2,16c1.2,5.8,2.2,10.3,2.8,16.2\n' +
				'\t\tC105.6,73.8,105.4,74,106.4,74.4z M106.1,69.7c1,0.3,11.6-1.1,13.6-1.3c10.3-0.9,19.4-1,29.8,0c2.1,0.2,12.9,1.6,13.9,1.4\n' +
				'\t\tc0.8-4.8,1.8-9.5,2.7-14.3c0.9-4.7,1.9-11.1-1.8-13.6c-4.4-3-23.5-4.7-29.5-4.7c-6.3,0-24.9,1.6-29.6,4.7\n' +
				'\t\tc-3.7,2.4-2.6,8.9-1.8,13.4C104.2,60.2,105.3,64.8,106.1,69.7z"/>\n' +
				'\t<path class="st1" d="M100.2,24.2c-0.6-1.8,0.9-3.6,1.6-4.7c0.9-1.4,1.8-2.2,3.5-3.1c3.1-1.8,6.3-2.6,10.4-2.6l4-1.4\n' +
				'\t\tc9.5-2,25.5-2,34.1,1.1l-0.1,0.2c4.6,0.3,6.9,0.7,10.5,2.8c1.6,0.9,2.5,1.7,3.4,2.9c1.2,1.6,1.8,2.5,1.8,4.9c1.2,1,1.4,0.9,2.5,2.3\n' +
				'\t\tc0.8-0.4,0.5-0.9,0.1-2.9c-0.9-4.3-2.2-9.1-5.8-11.8c-4.3-3.2-24.7-4.1-31.4-4.1c-9.5,0-18.2,0.5-26,2.3c-4.5,1-6.5,1.8-8.4,5.6\n' +
				'\t\tc-0.9,1.8-1.5,3.1-2,5.1l-1,4.3c-0.1,1.3,0.1,1.2,0.4,1.5C98.6,25.2,98.8,25.3,100.2,24.2z"/>\n' +
				'\t<path class="st1" d="M172.5,248.6l-7.7-0.5l0.5,9.8c-5.1,2-24.3,2.3-30.5,2.3c-13.8,0-17.5-0.5-30.7-2.2l0.5-9.8l-7.7,0.5\n' +
				'\t\tc-0.2,0.3-0.1,0-0.2,0.6c-0.2,1,0.1,1.4,0.2,2.1c0.9,7.8,4.9,8.6,12.7,9.5c4.2,0.5,8.8,0.7,13.5,0.8h11.4h12.5l0.2,0\n' +
				'\t\tc2-0.2,3.8-0.2,6.1-0.2l11.4-1.3c3.4-0.7,6-2.1,7.2-5.5C172.6,252.3,172.5,251.5,172.5,248.6z"/>\n' +
				'\t<path class="st1" d="M115.6,13.7c-4.1,0.1-7.3,0.9-10.4,2.6c-1.7,1-2.6,1.8-3.5,3.1c-0.7,1.1-2.2,2.9-1.6,4.7\n' +
				'\t\tc0.6,3.1,6.1,4.7,11.5-2.7c0.5-0.7,1.1-1.7,1.5-2.4C114.1,17.7,115.6,15.4,115.6,13.7z"/>\n' +
				'\t<path class="st1" d="M169.3,24.2c0-2.4-0.6-3.3-1.8-4.9c-0.9-1.3-1.8-2-3.4-2.9c-3.6-2.1-5.9-2.5-10.5-2.8c1,4.2,3.8,7.7,5.8,10.1\n' +
				'\t\tC161.8,26.4,167.2,28.8,169.3,24.2z"/>\n' +
				'\t<path class="st1" d="M114.3,34c1.1,0.4,16.2-0.9,17.6-1.6l-0.2-4.4c-3.3-0.1-7.6,0.6-10.9,0.9c-6.1,0.5-6-0.1-6.3,2.4\n' +
				'\t\tC114.2,32.4,113.9,33.2,114.3,34z"/>\n' +
				'\t<path class="st1" d="M170.4,200.8v-0.9l-7.1-0.1l0-16.5l7.1,0l0-0.9c-2-0.3-5.1-0.3-7.1,0.1l0-16.6c2.3,0.5,4.8,0.3,7.1,0.1v-0.9\n' +
				'\t\tc-2.3-0.3-4.8-0.3-7.1,0.1l0-17c2.2,0.4,4.9,0.4,7.2,0v-0.8c-2.2-0.3-5-0.3-7.2,0l0.1-16.2l7.1,0v-0.9h-7c-0.3-1.4-0.3-14.9,0-16.4\n' +
				'\t\tl7,0c0.1-0.1,0.1-0.2,0.2-0.2c0.1,0,0.1-0.2,0.1-0.2c-0.1-0.7,0-0.3-0.3-0.6l-7.1,0l0.1-7.7c-0.4,1.4-0.1,91.2-0.1,97.4\n' +
				'\t\tc0,6.8-0.3,27.3,0.1,32.5l-0.1-34.3L170.4,200.8z"/>\n' +
				'\t<path class="st1" d="M133.2,12.8l-0.9-0.6c1.1-0.9,3.6-1,4.8,0c-0.3,0.6,0.5,0.2-0.7,0.6c1,0.3,6.4,0.6,8.2,0.8\n' +
				'\t\tc2.2,0.3,5.6,1.1,7.6,1.2c-0.6-2.2-4.3-2.4-7.4-2.7c-5.8-0.7-14.2-0.7-20,0c-2.4,0.3-7.5,0.3-7.7,2.7\n' +
				'\t\tC122.6,13.6,132.4,13.1,133.2,12.8z"/>\n' +
				'\t<path class="st1" d="M96.8,57.2c0.2-0.1,0.4-0.4,0.7-0.5c0.9-0.3,0.1-0.7,0.8,0.1c0.7-1,1.2-1,2.6-0.6c-0.8-0.6-0.5-0.3-1.7-0.4\n' +
				'\t\tc1.1-0.6,0.8,0,1.1-1.1c0.9-3.5-3.2-1.5-3.7-1.4c-3.8-0.9-8.7,3.2-6.4,4.9C91.2,59,94.1,57.4,96.8,57.2z"/>\n' +
				'\t<path class="st1" d="M171.1,56.9c0.7-0.9-0.1-0.5,0.8-0.2c0.8,0.3,0.5,0.3,0.6,0.5c2,0.1,5.4,1.8,6.9,1.1c0.9-2-0.6-3.3-1.9-4\n' +
				'\t\tc-0.5-0.3-1.9-0.6-2.4-0.8c-1.5-0.4-1.9-0.1-2.6-0.2c-0.6-0.2-4.2-1.9-3.4,1.4c0.2,0.8,0,0.5,1,1.2c-1.2,0-0.8-0.2-1.6,0.3\n' +
				'\t\tC169.9,55.9,170.4,55.8,171.1,56.9z"/>\n' +
				'\t<path class="st1" d="M170.8,71.5l0.1-2.3l-4.9,2.2l-0.1-1c-0.4,0.9-0.5,2.2-0.5,3.3C166.5,73.1,169.5,71.7,170.8,71.5z"/>\n' +
				'\t<path class="st1" d="M104,73.7c-0.1-1.2-0.1-2.2-0.5-3.1l-0.2,0.8l-4.8-2.2l0.2,2.6c0.4-0.3-0.2-0.5,1.2,0c0.4,0.2,0.9,0.4,1.3,0.6\n' +
				'\t\tC102.2,72.8,103.3,73.3,104,73.7z"/>\n' +
				'\t<path class="st1" d="M106.6,148.2l0-0.8c-2.4-0.2-4.8-0.3-7.2,0.1l0,0.7C101.5,148.6,104.4,148.6,106.6,148.2z"/>\n' +
				'\t<path class="st1" d="M106.6,166.1v-1c-2.4-0.1-4.8-0.3-7.2,0.2v0.7C101.7,166.4,104.2,166.2,106.6,166.1z"/>\n' +
				'\t<path class="st1" d="M99,95.2c0.4-1.5,0.1-2.8,0.1-4.3h-1.6l-0.1,2.2C97.3,94.8,97.3,95.8,99,95.2z"/>\n' +
				'\t<path class="st1" d="M172,93.4l-0.1-2.5l-1.6,0c0,0.9-0.3,3.2,0,3.9C170.8,96.2,172.1,95.7,172,93.4z"/>\n' +
				'\t<path class="st1" d="M106.5,114c0.7-0.5,0.3-0.7,0-1.1l-7.1,0.2v0.8L106.5,114z"/>\n' +
				'\t<polygon class="st1" points="106.5,131.3 106.5,130.3 99.4,130.3 99.4,131.3 \t"/>\n' +
				'\t<path class="st1" d="M106.5,183.5v-1c-2.3,0-4.9-0.3-7.1,0.2l0,0.8L106.5,183.5z"/>\n' +
				'\t<path class="st1" d="M106.5,200.8v-1l-7.1,0.1v0.8C101.6,201,104.2,200.8,106.5,200.8z"/>\n' +
				'\t<path class="st1" d="M133.2,12.8l3.3,0c1.2-0.4,0.3,0,0.7-0.6c-1.2-1-3.7-0.9-4.8,0L133.2,12.8z"/>\n' +
				'</g>\n' +
				'<path class="st2" d="M161.7,244.6v-2.4c-3.4-0.7-9.5,0-13.3,0.2c-8.2,0.5-19.2,0.5-27.5,0.1c-3.6-0.2-10.1-1-13.3-0.3\n' +
				'\tc-0.1,5.8,0.4,4.8,11.9,5.7c14.8,1.1,22.6,0.4,36.8-0.5C159,247.2,161.7,247.2,161.7,244.6z"/>\n' +
				'<path class="st2" d="M106.5,200.8c-2.3,0-4.9,0.2-7.1-0.1v30.2c0,3.2-0.1,6.6,3.6,6.6c3.7,0,3.6-3.4,3.6-6.6\n' +
				'\tC106.6,222.1,106.9,208.6,106.5,200.8z"/>\n' +
				'<polygon class="st2" points="106.5,199.8 106.5,183.5 99.4,183.3 99.4,200 "/>\n' +
				'<path class="st2" d="M106.5,182.4l0-16.3c-2.4,0.1-4.8,0.3-7.2-0.2v16.7C101.6,182.2,104.3,182.4,106.5,182.4z"/>\n' +
				'<path class="st2" d="M106.6,165.1l0-16.9c-2.2,0.4-5.1,0.4-7.2,0l0,17.1C101.7,164.7,104.2,165,106.6,165.1z"/>\n' +
				'<path class="st2" d="M106.6,147.4l0-16l-7.1,0l0,16.2C101.7,147,104.2,147.2,106.6,147.4z"/>\n' +
				'<polygon class="st2" points="106.5,130.3 106.5,114 99.4,113.8 99.4,130.3 "/>\n' +
				'<path class="st2" d="M106.5,112.8c0.2-3.9,1.1-10.5-3.6-10.5c-4.8,0-3.5,6.7-3.6,10.6L106.5,112.8z"/>\n' +
				'<path class="st2" d="M170.4,130.3v-16.4l-7,0c-0.3,1.5-0.3,15.1,0,16.4H170.4z"/>\n' +
				'<path class="st2" d="M170.5,147.4l-0.1-16.2l-7.1,0l-0.1,16.2C165.5,147.1,168.3,147.1,170.5,147.4z"/>\n' +
				'<path class="st2" d="M170.4,165.1l0.1-16.9c-2.2,0.4-5,0.4-7.2,0l0,17C165.6,164.8,168.1,164.9,170.4,165.1z"/>\n' +
				'<path class="st2" d="M170.4,182.5V166c-2.3,0.3-4.8,0.4-7.1-0.1l0,16.6C165.3,182.2,168.4,182.2,170.4,182.5z"/>\n' +
				'<polygon class="st2" points="170.4,199.9 170.4,183.4 163.4,183.3 163.4,199.8 "/>\n' +
				'<path class="st2" d="M170.4,200.8l-7.1,0l0.1,34.3c1.2,4.4,5.6,3.3,6.7,0.9C170.8,234.4,170.5,203.5,170.4,200.8z"/>\n' +
				'<path class="st2" d="M170.4,112.8c0-2.3,0.5-7.6-0.8-9.2c-0.7-0.8-2-1.6-3.6-1.2c-1.6,0.4-2.2,1.2-2.5,2.7l-0.1,7.7L170.4,112.8z"/>\n' +
				'</svg>';
		} else if (ico === "car") {
			svgCode = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
				'\t viewBox="0 0 269.3 269.3" style="enable-background:new 0 0 269.3 269.3;" xml:space="preserve">\n' +
				'<style type="text/css">\n' +
				'\t.st0{fill:none;stroke:#474747;stroke-miterlimit:10;}\n' +
				'\t.st1{fill:' + iColor + ';stroke:#474747;stroke-miterlimit:10;}\n' +
				'\t.st2{fill:#FFFFFF;stroke:#474747;stroke-miterlimit:10;}\n' +
				'</style>\n' +
				'<g id="Layer_x0020_1">\n' +
				'\t<rect class="st0" width="269.3" height="269.3"/>\n' +
				'\t<path class="st1" d="M194.6,191.5V54.9c0-14.1,0.1-23.4-11.2-34.7c-10.3-10.3-20.4-8-37.3-8c-7.3,0-40.9-0.5-45.3,0.3\n' +
				'\t\tC88.9,14.6,80.5,24.3,77,34.4c-3.9,11.1-2.3,30.1-2.3,43.5v136.6c0,16.9-0.6,26.4,10.1,35.7c10.5,9.1,21.5,7,38.3,7\n' +
				'\t\tc8.4,0,40,0.4,45.7-0.1c11.9-1.1,21.9-10.7,24.7-20.5C195.7,229.3,194.6,201,194.6,191.5z"/>\n' +
				'</g>\n' +
				'<path class="st2" d="M135.2,61.4c10.6-0.1,39.5,2.5,47,7.1l-11.6,44.2l-71.7-0.2c-1.6-5.9-11.1-40.9-11.2-44.1\n' +
				'\tC95.1,64.1,124.2,61.5,135.2,61.4z"/>\n' +
				'<path class="st2" d="M80.4,89.3c1.4,2.2,4,10.2,5.1,13.1c3.2,8.4,8.7,19.4,8.6,28.1c0,6,0,12,0,18.1l-13.9-1.8\n' +
				'\tC79.4,142.7,79.8,90.7,80.4,89.3z"/>\n' +
				'<path class="st2" d="M80,209.5l0.1-53.5l13.7,1.6c0.8,2.9,0.7,38.2,0.2,42.7C93.1,201.3,81.8,209.1,80,209.5z"/>\n' +
				'<path class="st2" d="M88.5,225.1c0.2-1.4,9.6-14.6,11.3-17.3l71.7,0.1c2,3.1,10.6,15.1,11,17.4L88.5,225.1z"/>\n' +
				'<path class="st2" d="M189.5,208.1l-14-9.4l0.1-40.9c3.2-0.7,10.9-2,14.1-1.7L189.5,208.1z"/>\n' +
				'<path class="st2" d="M189.3,146.6c-1.8,1.2-10.9,2.1-13.7,1.9c-0.6-5.3-0.1-13.4-0.1-19c0-7.8,1.1-8.8,3.5-15\n' +
				'\tc2.1-5.4,8.6-24,10.4-27.4C189.9,88.2,190.3,145.5,189.3,146.6z"/>\n' +
				'</svg>';
		} else {
			svgCode = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" style="" xml:space="preserve" width="49.636" height="49.636"><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none"/> <g class="currentLayer" style=""><title>Layer 1</title><polygon style="" points="23.164264678955078,36.56473159790039 0.16326522827148438,32.7097282409668 49.79926681518555,9.929727554321289 25.79926300048828,58.34572982788086" id="svg_1" class="" transform="rotate(-44.91157150268555 24.981266021728523,34.13772583007813) " fill="' + iColor + '" fill-opacity="1"/><g id="svg_2" class=""> </g><g id="svg_3" class=""> </g><g id="svg_4" class=""> </g><g id="svg_5" class=""></g><g id="svg_6" class=""></g><g id="svg_7" class=""></g><g id="svg_8" class=""></g><g id="svg_9" class=""></g><g id="svg_10" class=""></g><g id="svg_11" class=""></g><g id="svg_12" class=""></g><g id="svg_13" class=""></g><g id="svg_14" class=""></g><g id="svg_15" class=""></g><g id="svg_16" class=""></g></g></svg>';
		}
		return svgCode;
	};

	utils.addMarker = function ({lat, lng, address}) {

		_marker[++_counter] = new L.marker({lat, lng}).addTo($rootScope.maps.map).bindPopup(address);
		//mk1.bindPopup("<div class='info-div'>Hello world info window.<div>");
	}

	utils.removeAllMarker = function () {
		for (let key in _marker) {
			if (_marker[key].hasOwnProperty()) {
				_marker[key].addTo(null);
			}
		}
		_counter = 0;
		_marker = {}
	}

	utils.fitMap = function (cordinates) {

		let bounds = L.latLngBounds()
		cordinates.forEach(oCord => {
			bounds.extend([oCord.lat, oCord.lng]);
		});
		$timeout(function () {
			$rootScope.maps.map.fitBounds(bounds);
		});
	}

	utils.addPolyline =function(cordinates){
		var polylinePoints = [];
		cordinates.forEach(oCord => {
			var pointmid = new L.LatLng(oCord.lat, oCord.lng);
			polylinePoints.push(pointmid)
		});

		var polylineOptions = {
			color: 'blue',
			weight: 5,
			opacity: 0.4
		};
		var fixedPolylineOptions = {
			color: 'green',
			weight: 5,
			opacity: 0.6
		};
		var fixedPolylineLayer = new L.layerGroup().addTo($rootScope.maps.map);
		var fixedPolyline = new L.Polyline(polylinePoints, fixedPolylineOptions);
		fixedPolylineLayer.addLayer(fixedPolyline);

		var lineLayer = new L.layerGroup().addTo($rootScope.maps.map);
		var polyline = new L.Polyline([], polylineOptions);
		lineLayer.addLayer(polyline);

	}

	return utils;
});
