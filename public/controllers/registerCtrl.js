(function() {
	angular
		.module('xo')
		.controller('registerCtrl', registerCtrl);

	registerCtrl.$inject = ['$state', 'UserService', '$rootScope'];
	function registerCtrl($state, UserService, $rootScope) {
		var vm = this;

		vm.credentials = {
			userName: "",
			password: "",
			email: "",
			firstName: "",
			lastName: ""

		};

		vm.register = function() {
			console.log('Submiting Registration!');
			UserService.registerUser(vm.credentials)
						.then(function (response) {
							
							console.log('prosao registar');
							/*bootbox.alert('You have been successfully registered! You can login now.', function() {
								
							});*/
							$state.go('home');

							//$state.reload('register');
						})
						.catch(function (response) {
							
							$rootScope.error = response.data.msg;
							
							
						});
						
		};
	}

})();