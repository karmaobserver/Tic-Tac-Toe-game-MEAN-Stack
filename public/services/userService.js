(function() {
	angular
		.module('xo')
		.factory('UserService', UserService);

	UserService.$inject = ['$http', '$localStorage', '$state', 'Socket'];		
	function UserService($http, $localStorage, $state, Socket) {	

		//cuvanje tokena, odnosno jwt token dodajemo u auth header za sve $http zahteve
		var saveToken = function(token) {
			//$window.localStorage['token'] = token;
			$localStorage.token = token;
			$http.defaults.headers.common.Authorization = token;

		};

		var modifyUser = function(user) {
			console.log('PRENOSIM');
			console.log(user._id);
			userId = user._id;
			return $http.put('api/modifyUser/' + user._id, user)
				.then(function(response) {
					$localStorage.currentUser = response.data;
					return response;
				});
		};

		var saveChallengers = function (user) {
			userId = user._id;
			return $http.put('api/saveChallengers/' + user._id, user)
						.then(function(response) {

							return response;
						});

		};

		var getUserByUserName = function (userName) {
			return $http.get('api/getUserByUserName/' + userName)
						.then(function(response) {
							return response;
						});

		};

		var registerUser = function(credentials) {
			return $http.post('/api/register', credentials)
				   		.then(function(response) {
				   			console.log('Poruka od tokena' + response.data.msg + '   VREDNOST: ' + response.data.token);

				   			if (response.data.token) {
				   				saveToken(response.data.token);

				   				return currentUser().then(function(res) {	//RETURN vec anji nje idze daljej
							
							  
							 	console.log('PRVO');
							 	console.log($localStorage.currentUser);
							});

				   				console.log('DRUGO');


				   			} else {
				   				console.log('TRECE');
				   			}

						 
					   		return response;
				   }); 

		};

		var loginUser = function(credentials) {
			console.log('USER NAME: ' + credentials.userName + '   A SIFRA JE: '+ credentials.password + '   A niz je: ' + credentials );
			 return $http.post('api/login', credentials )
					.then(function(response) {
						console.log('Poruka od tokena' + response.data.msg + '   VREDNOST: ' + response.data.token);
						//ukoliko ima tokena, prijava je uspesna
						if (response.data.token) {
							//stavim token u header
							saveToken(response.data.token);
							
							//pozovem funkciju currentUser() gde pokupim podatke od user-a u lokalno skladiste
							return currentUser().then(function(res) {	//RETURN vec anji nje idze daljej
							 // Socket.emit('addUser2', {userName : "PAvel"});
							  //$localStorage.currentUser = res.data.currentUser;
							  
							  console.log('PRVO');
							  console.log($localStorage.currentUser);
							});
							 console.log('DRUGO');
							  //console.log($localStorage.currentUser);

							/*console.log('localStorage: ');
							console.log($localStorage.currentUser);*/
							//callback(true);
							
						} else {
							console.log('TRECE');
							//neuspesan login (nema tokena)
							//callback(false);
						}
					});

		};

		var getCurrentUser = function() {
			//console.log('GETCURR');
			//console.log($localStorage.currentUser);

            return $localStorage.currentUser;
        };
       /* var getUpdatedCurrentUser = function() {
			//console.log('GETCURR');
			//console.log($localStorage.currentUser);
			console.log("Dal nesto vraca update? : ");
		    updateCurrentUser().then(function(response) {
						console.log('Usao u then');
						console.log(response.data);
						return response.data;
			});
			console.log('nakon funkcije update u getUpdated');

           // return $localStorage.currentUser;
        };

        var updateCurrentUser = function() {
        	 var oldUser = $localStorage.currentUser;
        	 userId = oldUser._id;
        	 console.log('OLD USER:');
        	 console.log(oldUser);
			 return $http.get('api/updateCurrentUser/' + userId)
				.then(function(response) {
					console.log("Zoz servisa update");
					console.log(response.data);
					$localStorage.currentUser = response.data;
					
					return response;
				});

        };*/

		var currentUser = function() {
			return $http.get('api/currentUser')
						.then(function(response) {
							$localStorage.currentUser = response.data.currentUser;
							/*console.log(response);
							console.log('2 DALJE');
							console.log(response.data);
							console.log(response.data.currentUser);*/
							
						return response;
				
			});
			//fali jos dal je authentificated.	
		};
		var logoutUser = function() {
			delete $localStorage.currentUser;
			delete $localStorage.token;
			$http.defaults.headers.common.Authorization = '';
			console.log("URADIO LOGOUT");
			Socket.removeAllListeners();	//pravilo duplikate jer socket se skalirao
			Socket.disconnect(true);
			$state.go('homePage');
		};
		var list = function() {

		};

		return {
			modifyUser : modifyUser,
			registerUser : registerUser,
			loginUser : loginUser,
			list : list,
			saveToken : saveToken,
			getCurrentUser : getCurrentUser,
			logoutUser : logoutUser,
			currentUser : currentUser,
			saveChallengers : saveChallengers,
			/*updateCurrentUser : updateCurrentUser,
			getUpdatedCurrentUser : getUpdatedCurrentUser,*/
			getUserByUserName : getUserByUserName
		};
	}
})();