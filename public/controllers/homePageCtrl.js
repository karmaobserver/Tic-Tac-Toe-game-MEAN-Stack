(function() {
	angular
		.module('xo')
		.controller('homePageCtrl', homePageCtrl);

	homePageCtrl.$inject = ['$state'];
	function homePageCtrl($state) {
		var vm = this;

		vm.register = function() {
			$state.go('register');
		};

		vm.login = function() {
			//$location.path('login');
			$state.go('login');
		};
	}


})();