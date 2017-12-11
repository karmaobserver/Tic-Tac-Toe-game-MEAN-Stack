(function() {

	angular
	.module('xo')
	.controller('logoutCtrl', logoutCtrl);

	logoutCtrl.$inject = ['$state', 'UserService'];
	function logoutCtrl($state, UserService) {
		var vm = this;
		
		

		
			UserService.logoutUser();
						
							
							
					
		
	}
})();