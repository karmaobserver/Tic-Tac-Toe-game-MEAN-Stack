(function() {
	angular
		.module('xo')
		.factory('StatisticService', StatisticService);

	StatisticService.$inject = ['$http'];
	function StatisticService($http) {

		var getStatisticByUserId = function(userId) {
			console.log('User kod servisa');
			console.log(userId);
			//console.log(user.userName);
			return $http.get('api/userStatistic/' + userId)
						.then(function(response	) {
							return response;
						});
		};

		var getStatistic = function() {
			return $http.get("api/statistic")
						.then(function(response) {
							return response;
						});
		};


		return {
			getStatistic : getStatistic,
			getStatisticByUserId : getStatisticByUserId
		};

	}

})();