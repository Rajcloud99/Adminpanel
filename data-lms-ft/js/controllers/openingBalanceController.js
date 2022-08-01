materialAdmin
    .controller("openingBalanceController", openingBalanceController);

openingBalanceController.$inject = [
    '$scope',
    'DatePicker',
    'accountingService',
    '$state',
];



function openingBalanceController(
    $scope,
    DatePicker,
    accountingService,
    $state,
) {

    //let vm = this;
    $scope.DatePicker = angular.copy(DatePicker); // initialize pagination
    $scope.submit = submit;
    $scope.accountMaster = accountMaster;
    // INIT functions
    (function init() {
        $scope.oAccount = {};
        $scope.oAccount.date = new Date('31-Mar-2019');
        $scope.oAccount.amount = 0;
        $scope.maxDate = new Date();
    })();



    function accountMaster(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 10,
					sort: {name: 1}
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
    
    $scope.onAccountSelect = function (item) {
        if(item) {
            $scope.oAccount._id = item._id;
        }
    }
    $scope.onTypeOpenBal1 = function (value) {
        $scope.oAccount.amount = $scope.oAccount.openBal1 + $scope.oAccount.openBal2;
        
    }
    $scope.onTypeOpenBal2 = function (value) {
        $scope.oAccount.amount =  $scope.oAccount.openBal1 + $scope.oAccount.openBal2;
    }
    
    // submit the form
    function submit(formData) {
        if (formData.$valid) {
            if($scope.oAccount.openBal1 <= 0 || $scope.oAccount.openBal2 <= 0) {
                return swal('Warning', 'Invalid Amount', 'warning');
            }   
                accountingService.updateOpenBal($scope.oAccount, onSuccess, err => {
                    console.log(err);
                });
                function onSuccess(response) {
                    if(response) {
                        swal("Success", response.message, "success");
                        $scope.oAccount = {};
                        $scope.oAccount.date = new Date('31-Mar-2019');
                        $scope.oAccount.amount = 0;
                        $scope.account = null;
                        $scope.openingBalanceForm.$setPristine();
                    }
                }
        } else {
            if (formData.$error.required)
                swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
            else
                swal('Form Error!', 'Form is not Valid', 'error');
        }
    }

}

