(function () {
	angular
	.module('xo')
	.controller('userProbaCtrl', userProbaCtrl);

	userProbaCtrl.$inject = ['$http', '$scope'];
	function userProbaCtrl($http, $scope) {
		$http.get("/api/user")
		.success(function(users) {
		
		$scope.proba = "Mother";
		$scope.users = users;
	});
	}


})();