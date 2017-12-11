(function() {
	angular
		.module('xo')
		.controller('homeCtrl', homeCtrl);

	homeCtrl.$inject = ['$state', 'UserService', '$localStorage', '$scope', 'Socket'];
	function homeCtrl($state, UserService, $localStorage, $scope, Socket) {
		/*$scope.$on('$destroy', function (event) {
   		 Socket.removeAllListeners();
		});*/

		var vm = this;
		vm.currentUserLocal = UserService.getCurrentUser();
		console.log(UserService.getCurrentUser());
		/* var currentUser3 = UserService.getCurrentUser().userName;
		console.log('SA STORAGE 3: ' + currentUser3);
		console.log('SA STORAGE: ' + UserService.getCurrentUser());*/
		
		/*UserService.currentUser()
					.then(function success(response) {
						console.log('Uspesno pozvao metodu currentUser!');
							console.log('res:   ' +response.data);
							console.log('res2:   ' +response.data.currentUser.userName);
							console.log('res3:   ' +response.password);
		
							
						vm.currentUser = response.data.currentUser;
					}, function error(response) {
						console.log('DOSLO JE DO GRESKE');
						
					
		});*/
	}

})();