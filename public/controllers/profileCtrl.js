(function() {
	angular
		.module('xo')
		.controller('profileCtrl', profileCtrl);


	profileCtrl.$inject = ['$state', 'UserService', 'StatisticService', '$rootScope', '$scope', 'Socket'];
	function profileCtrl($state, UserService, StatisticService, $rootScope, $scope, Socket) {
		/*$scope.$on('$destroy', function (event) {
   		 Socket.removeAllListeners();
		});*/

		var vm = this;
		var isEditing = false;
			vm.isEditing = isEditing;

		vm.user = UserService.getCurrentUser();
		console.log('user ID:');
		console.log(vm.user._id);
		

		StatisticService.getStatisticByUserId(vm.user._id)
						.then(function (response) {
							//console.log('STATIC DATA: ');
							//console.log(response.data);
							vm.statistic = response.data;
						})
						.catch(function (response) {
							console.log('dOSLO DO CATCH');
							$rootScope.error = response.data.msg;
						});

		vm.editProfile = function() {
				vm.isEditing = true;		
		};

	
		vm.editProfileCancle = function() {
				vm.isEditing = false;
			
		};

		vm.modifyProfile = function() {
			vm.isEditing = false;
			UserService.modifyUser(vm.user)
						.then(function(response) {
							console.log('VRATIO SE USER');
							console.log(response.data.userName);
							console.log(response.data);
							vm.user = UserService.getCurrentUser();
						})
						.catch(function (response) {
							console.log('dOSLO DO CATCH');
							$rootScope.error = response.data.msg;
						});

		};

	}



})();