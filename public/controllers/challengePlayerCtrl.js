(function() {
	angular.module('xo')
			.controller('challengePlayerCtrl', challengePlayerCtrl);

	challengePlayerCtrl.$inject = ['$http', 'Socket', 'UserService', '$rootScope', '$scope'];
	function challengePlayerCtrl($http, Socket, UserService, $rootScope, $scope) {
		var vm = this;
		//Socket.removeAllListeners();
		/*$scope.$on('$destroy', function (event) {
   		 Socket.removeAllListeners();
		});*/
			
		vm.usersOnline = [];
		vm.user = UserService.getCurrentUser();

		Socket.emit('requestUsers3', {});

		Socket.on('addUser3', function(data) {
			console.log('usao u IF');
			if(vm.usersOnline.indexOf(data.userName) === -1) {
				vm.usersOnline.push(data.userName);
			}
		});

		Socket.on('users3', function(data) {
			console.log('PRE challenge');
			console.log(vm.users);
			
			vm.usersOnline = data.users;
			//Da ne bi mogao da izazove samog sebe
			vm.usersOnline.splice(vm.usersOnline.indexOf(vm.user.userName), 1);	
			
			console.log('POSLE challenge');
			console.log(vm.users);
		});

		Socket.on('currentUser', function(data) {
			vm.user = data.user;
		});

		$scope.$on('$stateChangeStart', function(event) {
			Socket.removeListener('requestUsers3');
			Socket.removeListener('users3');
			Socket.removeListener('addUser3');	//greska se javlja kod chat-a, nakon menjanja state-a od challaengeplayerCtrl gubio se user
			//Socket.removeAllListeners();
			//Socket.addListener('challenge');
		});

		Socket.on('refreshLocalStorage', function() {
			vm.user = UserService.getCurrentUser();
		});

		//Da bi disablovao button za izazivanje, da ne bi moglo izazvati vise puta za redom istog usera
		vm.userDisabled = function (user) {
			console.log('Ulazi u userDisabled');
			console.log(vm.user.challenged);
			if (vm.user.challenged.indexOf(user) !== -1) {
				return true;
			} else {
				console.log('ulazi u false');
				return false;
			}
		};
		//vm.userDisabled = {};
		vm.challenge = function (user) {		
			console.log(user);
			vm.user.challenged.push(user);
			UserService.saveChallengers(vm.user)
						.then(function(response) {
							
							Socket.emit("challenge", {userChallenge: vm.user.userName, challengedUser: user} );
						})
						.catch(function (response) {
							console.log('dOSLO DO CATCH');
							$rootScope.error = response.data.msg;
						});	
			
			//vm.userDisabled[user] = true;
			
			

		};

		vm.clearArray = function () {
			vm.user.challenged = [];
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

		Socket.on('removeUser', function(data) {
			vm.usersOnline.splice(vm.usersOnline.indexOf(data.userName), 1);
			
		});

	

	}

})();