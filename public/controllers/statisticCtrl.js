(function() {
	angular
		.module('xo')
		.controller('statisticCtrl', statisticCtrl);

	statisticCtrl.$inject = ['$http', 'StatisticService'];
	function statisticCtrl($http, StatisticService) {
		var vm = this;

		StatisticService.getStatistic()
						.then(function(response) {
							console.log('ceo response');
							console.log(response.data);
							console.log('res prvog elementa');
							console.log(response.data[0]);
							console.log('user njegovog elementa');
							console.log(response.data[0].user);
							console.log('njegov userName');
							console.log(response.data[0].user[0].userName);
								console.log('proba userName');
							//console.log(response.data.user[0].userName);
							// vm.user = response.data[0].user;
							vm.statistics = response.data;
							//vm.statisticsProba = response.data[0]



						});

	}



})();