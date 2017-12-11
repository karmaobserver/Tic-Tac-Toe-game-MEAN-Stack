(function() {

	angular
	.module('xo')
	.controller('loginCtrl', loginCtrl);

	loginCtrl.$inject = ['$state', 'UserService', '$rootScope', '$localStorage'];
	function loginCtrl($state, UserService, $rootScope, $localStorage) {
		var vm = this;
		
		vm.credentials = {
			userName : "",
			password : ""
		};

		vm.login = function() {
			UserService.loginUser(vm.credentials)
						.then(function success(response) {
							//$rootScope.message = response.data.msg;
							//$localStorage.notifications = 0;
							$state.go("home");
							
						})
						.catch(function (response) {
							//alert(response.status + ' Greska: ' + response.data.msg);
							$rootScope.error = response.data.msg;
						});
		};
	}
})();