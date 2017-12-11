(function() {
	angular
		.module('xo')
		.factory('GameService', GameService);

	GameService.$inject = ['$http'];
	function GameService($http) {

		var createGame = function(user1, user2) {
			return $http.post('/api/createGame', {user1: user1, user2: user2})
				   		.then(function(response) {
						   	console.log('Uspesan http');
						   	console.log('EVO: ' + response.data.msg);
					   		
					   		return response;
				   }); 
		};

		var getGame = function(userName) {
			console.log('usao u getGameService');
			console.log(userName);
			
			return $http.get('api/getGame/' + userName)
						.then(function(response	) {
							return response;
						})
						.catch(function(response) {
							console.log(response.data.msg);
							return response;
						});

		};

		//pomocna funkcija za uporedjivanje nizova, koristim kod checkWinner funkcije
		Array.prototype.compare = function(testArr) {
		    if (this.length != testArr.length) return false;
		    for (var i = 0; i < testArr.length; i++) {
		        if (this[i].compare) { 
		            if (!this[i].compare(testArr[i])) return false;
		        }
		        if (this[i] !== testArr[i]) return false;
		    }
		    return true;
		};

		function arrayContainsAnotherArray(needle, haystack){
			  for(var i = 0; i < needle.length; i++){
			    if(haystack.indexOf(needle[i]) === -1)
			       return false;
			  }
			  return true;
			}

		var checkWinner = function(combination) {
			combination.sort();
			console.log('combination: ', combination);

			winnersCombinations = [['c1', 'c2', 'c3'], ['c1', 'c4', 'c7'], ['c1', 'c5', 'c9'], ['c2', 'c5', 'c8'], ['c3', 'c5', 'c7'], ['c3', 'c6', 'c9'], ['c4', 'c5', 'c6'],
			['c7', 'c8', 'c9']];
			for (var i=0; i<winnersCombinations.length; i++) {
				//console.log('proverava');
				//console.log('combinations: ', winnersCombinations[i]);
				if (arrayContainsAnotherArray( winnersCombinations[i], combination)) {
					//combination.compare(winnersCombinations[i])
					//_.isEmpty(_.xor(combination, winnersCombinations[i])

					console.log('POBEDNIK');
					return true;
				}
			}

		};

		var saveScore = function(winner, loser) {
			return $http.put('api/saveScore/', {winner: winner, loser: loser})
						.then(function(response) {
							console.log('uspesno sacuvao score');
							return response;
						})
						.catch(function(response) {
							console.log('DOSLO JE DO CATCH');
						});
		};

		var deleteActiveGame = function(gameId) {
			return $http.delete('api/deleteActiveGame/' + gameId)
						.then(function(response) {
							console.log('uspesno obrisao igru');
							return response;
						})
						.catch(function(response) {
							console.log('DOSLO JE DO CATCH');
						});

		};

		var inGame = function(userName) {
			return $http.get('api/inGame/' + userName)
						.then(function(response	) {
							return response;
						})
						.catch(function(response) {
							console.log(response.data.msg);
							return response;
						});
		};

		return {
			
			createGame : createGame,
			getGame : getGame,
			checkWinner : checkWinner,
			saveScore : saveScore,
			deleteActiveGame : deleteActiveGame,
			inGame : inGame
		};

	}

})();