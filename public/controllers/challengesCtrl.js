(function() {
	angular.module('xo')
			.controller('challengesCtrl', challengesCtrl);

	challengesCtrl.$inject = [ 'Socket', 'UserService', '$scope', '$state', 'GameService', '$rootScope', '$localStorage'];
	function challengesCtrl( Socket, UserService, $scope, $state, GameService, $rootScope, $localStorage) {
		var vm = this;

		/*$scope.$on('$destroy', function (event) {
   		 Socket.removeAllListeners();
		});*/

		//UserService.updateCurrentUser();
		//vm.user = UserService.getUpdatedCurrentUser();
		vm.user = UserService.getCurrentUser();

		//vm.challengersBaza = currentUser.challengers;
		console.log('Challengers z BAZI:');
		console.log(vm.user);
		console.log(vm.user.challengers);
		
		//Radio kao ADD za challenges
		Socket.on('currentUser', function(data) {
			vm.user = data.user;
		});

		//Ponistavam notifikacije kad odem na stavku challenges
		$rootScope.notifications = 0;
		$localStorage.notifications = 0;
		$scope.$on('$stateChangeStart', function(event) {
			console.log('Ponistava Norifikacije');
			$rootScope.notifications = 0;
			$localStorage.notifications = 0;
		});
		

		vm.acceptChallenge = function (user) {
			GameService.getGame(user)
						.then(function(response) {
							if (response.status === 201) {
								bootbox.alert(user + ' is in game at the moment! You can not accept challenge.', function() {

								});
							} else {
								GameService.createGame(user, vm.user.userName).then(function(response) {
									console.log(response.data.msg);
									Socket.emit('challegeAccepted', {userChallenge: user, acceptedUser: vm.user.userName});

									//izbaci iz liste preuzeto iz Decline
									vm.user.challengers.splice(vm.user.challengers.indexOf(user), 1);
									UserService.getUserByUserName(user)
											.then(function(response) {
												
												response.data.challenged.splice(vm.user.challenged.indexOf(user), 1);
												
												UserService.saveChallengers(response.data)
													.then(function(response) {	
														Socket.emit('updateLocalStorage', {user: response.data});
													})
													.catch(function (response) {
														$rootScope.error = response.data.msg;
													});	


											})	
											.catch(function(response) {
												console.log('doslo je do catch');
									});
									UserService.saveChallengers(vm.user)
											.then(function(response) {
												console.log('VRATIO SE USER');
												console.log(response.data.userName);
												console.log(response.data);

											})
											.catch(function (response) {
												console.log('dOSLO DO CATCH');
												$rootScope.error = response.data.msg;
									});	
									//Do ovde
									 $state.go('table', {}, { reload: true});
								});
							}
						}).catch(function(response) {
							console.log('Doslo je do catch');
							

						});
			
			
		};

		vm.declineChallenge = function (user) {
			vm.user.challengers.splice(vm.user.challengers.indexOf(user), 1);

			UserService.getUserByUserName(user)
						.then(function(response) {
							console.log('uspesan response');
							console.log(response.data);
							console.log('Pre Decline');
							console.log(response.data.challenged);
							response.data.challenged.splice(vm.user.challenged.indexOf(user), 1);
							console.log('Nakon Decline');
							console.log(response.data.challenged);
							UserService.saveChallengers(response.data)
								.then(function(response) {
									
									console.log('Uspesno sacuvao');
									Socket.emit('updateLocalStorage', {user: response.data});


								})
								.catch(function (response) {
									console.log('dOSLO DO CATCH');
									$rootScope.error = response.data.msg;
								});	


						})	
						.catch(function(response) {
							console.log('doslo je do catch');
						});


			UserService.saveChallengers(vm.user)
						.then(function(response) {
							console.log('VRATIO SE USER');
							console.log(response.data.userName);
							console.log(response.data);

						})
						.catch(function (response) {
							console.log('dOSLO DO CATCH');
							$rootScope.error = response.data.msg;
						});	
			

		};


		vm.clearArray = function () {
			vm.user.challengers = [];
			UserService.saveChallengers(vm.user)
						.then(function(response) {
							console.log('VRATIO SE USER');
							console.log(response.data.userName);
							console.log(response.data);
						})
						.catch(function (response) {
							console.log('dOSLO DO CATCH');
							$rootScope.error = response.data.msg;
						});
		};
   	}
})();