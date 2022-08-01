/**
 * Created by JA
 */

materialAdmin.factory('lazyLoadFactory',
	[
		'$timeout',
		function(
			$timeout
		){

			let obj = {},
				currentPage,
				isLast,
				isLoading;

			// functions Identifiers
			obj.getCurrentPage = getCurrentPage;
			obj.incCurrentPage = incCurrentPage;
			obj.reset = reset;
			obj.update = update;
			obj.putArrInScope = putArrInScope;
			obj.stopLoading = stopLoading;
			obj.updateArr = updateArr;


			return function () {
				currentPage = 1;
				isLast = false;
				isLoading = false;
				return obj;
			};


			// Actual Functions

			function getCurrentPage() {
				return currentPage;
			}

			function incCurrentPage() {
				currentPage++;
			}

			function reset() {
				currentPage = 1;
			}

			function update(isGetActive){

				$timeout(function(){
					isLoading = false;
				}, 1000 * 20); // end loading after 20 sec

				if(isLoading)
					return;

				if(isGetActive && isLast)
					return false;

				if(!isGetActive)
					currentPage = 1;

				isLoading = !isLoading;

				return true;
			}

			function putArrInScope(isGetActive, {data}) {

				isLast = !data.length;
				isLoading = false;

				let arrPtr = this.tableApi.bodyKey;
				let selectablePtr = this.tableApi.selectableKey;

				if(!Array.isArray(data))
					data = [];

				if(isGetActive){
					this[arrPtr] = this[arrPtr] || [];
					this[arrPtr].push(...data);
				}else{
					this[arrPtr] = data;
					if(this.tableApi.selectPreserve && Array.isArray(this[selectablePtr])){
						this[arrPtr] = this[arrPtr].filter(o => !(this[selectablePtr].findIndex(os => os._id === o._id)+1));
						this[arrPtr].unshift(...this[selectablePtr]);
					}else
						this.tableApi && this.tableApi.clearSelection && this.tableApi.clearSelection();
				}

				this.tableApi && this.tableApi.refresh();
				currentPage++;
			}

			function updateArr(isGetActive, arr, {data}) {

				isLast = !data.length;
				isLoading = false;

				let arrPtr = arr;

				if(!Array.isArray(data))
					data = [];

				if(isGetActive){
					this[arrPtr] = this[arrPtr] || [];
					this[arrPtr].push(...data);
				}else{
					this[arrPtr] = data;
				}

				currentPage++;
			}

			function stopLoading() {
				isLoading = false;
			}

		}
	]
);
