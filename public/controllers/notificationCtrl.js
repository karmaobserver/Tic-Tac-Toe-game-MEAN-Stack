(function() {
	angular
		.module('xo')
		.controller('notificationCtrl', notificationCtrl);

	notificationCtrl.$inject = ['$rootScope', 'Socket', '$localStorage'];
	function notificationCtrl($rootScope, Socket, $localStorage) {
		var vm = this;

		

		$rootScope.notifications = 0;
		$rootScope.notifications = $localStorage.notifications;

		Socket.on('currentUser', function(data) {

			$rootScope.notifications++;
			$localStorage.notifications++;
			
		});

	}



})();