(function() {
	angular.module('xo')
			.controller('indexChatCtrl', indexChatCtrl);

	indexChatCtrl.$inject = ['$http', 'Socket', 'UserService', '$rootScope'];
	function indexChatCtrl($http, Socket, UserService, $rootScope) {
		var vm = this;

		//if (isLoggedIn())
		Socket.connect();
		vm.users = [];
		vm.messages = [];
		//$rootScope.users = vm.users;
		vm.userName = UserService.getCurrentUser().userName;

		Socket.emit('addUser2', {userName: vm.userName});

		Socket.emit('requestUsers2', {});

		Socket.on('users2', function(data) {
			console.log('PRE INDEX');
			console.log(vm.users);
			//if (vm.users.length !== data.users.length) {		
			vm.users = data.users;
			//console.log('usao u index');
		//}
			console.log('POSLE INDEX');
			console.log(vm.users);
		});

		//kad user dodje na chat
		Socket.on('addUser2', function(data) {
			//if (!vm.users.indexOf(data.userName)) {
			vm.users.push(data.userName);
		//}
			vm.messages.push({userName: data.userName, message: 'has joined the chat room.'});
		});

		//Kad user izadjeiz chata
		Socket.on('removeUser', function(data) {
			vm.users.splice(vm.users.indexOf(data.userName), 1);
			vm.messages.push({userName: data.userName, message: 'has left the chat room.'});
		});

		vm.sendMessage = function(msg) {
			console.log(msg);
			if (msg !== null && msg !== '') {
				Socket.emit('message2', {message: msg});
			}
			vm.msg = ''; //posle poslate poruke da polje bude prazno
		};

		//od svakog korisnika poruka
		Socket.on('message2', function(data) {
			vm.messages.push(data);
		});


	}
})();