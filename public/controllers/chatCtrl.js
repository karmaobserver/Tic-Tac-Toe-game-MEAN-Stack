(function() {
	angular.module('xo')
			.controller('chatCtrl', chatCtrl);

	chatCtrl.$inject = ['Socket', '$scope', '$state'];
	function chatCtrl(Socket, $scope, $state) {
		var vm = this;

		Socket.connect();
		vm.users = [];
		vm.messages = [];

		

		var promptUserName = function(message) {
			bootbox.prompt(message, function(name) {
				console.log(name);
				if (name !== null && name !== '') {
					Socket.emit('addUser', {userName: name});
				} else if (name === '') {
					promptUserName('You must enter a userName!');
				} else {
					$state.go('home');
				}
			});

		};

		vm.sendMessage = function(msg) {
			if (msg !== null && msg !== '') {
				Socket.emit('message', {message: msg});
			}
			vm.msg = ''; //posle poslate poruke da polje bude prazno
		};

		promptUserName("Enter your name");

		//trazim users
		Socket.emit('requestUsers', {});


		Socket.on('users', function(data) {
			console.log('PRE');
			console.log(vm.users);
			vm.users = data.users;
			console.log('POSLE');
			console.log(vm.users);
		});

		//od svakog korisnika poruka
		Socket.on('message', function(data) {
			vm.messages.push(data);
		});

		//kad user dodje na chat
		Socket.on('addUser', function(data) {
			vm.users.push(data.userName);
			vm.messages.push({userName: data.userName, message: 'has entered the chat room.'});
		});

		//Kad user izadjeiz chata
		Socket.on('removeUser', function(data) {
			vm.users.splice(vm.users.indexOf(data.userName), 1);
			vm.messages.push({userName: data.userName, message: 'has left the chat room.'});
		});

		Socket.on('existUserName', function(data) {
			promptUserName(data.message);
		});

		$scope.$on('$stateChangeStart', function(event) {
			Socket.disconnect(true);
		});


	}

})();