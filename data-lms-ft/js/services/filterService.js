/**
 * Created by JA
 */

materialAdmin.service('filterService', filterService);

filterService.$inject = [
	'$rootScope'
];


function filterService(
	$rootScope
){
	let ctrl = false;

	// functions Identifiers
	this.hide = hide;
	this.reset = reset;
	this.show = show;
	this.toggle = toggle;
	this.value = value;


	return (function () {
		$rootScope.$new().$on('resetFilter', (function(){
			this.reset();
		}).bind(this));
		return this;
	}).bind(this);

	// Actual Functions

	function hide() {
		ctrl = false;
	}

	function reset() {
		ctrl = false;
	}

	function show() {
		ctrl = true;
	}

	function toggle() {
		ctrl ? hide() : show();
	}

	function value() {
		return !!ctrl;
	}
}


