(function() {
	angular.module('xo')
			.controller('tableCtrl', tableCtrl);

	tableCtrl.$inject = ['$http', 'Socket', 'UserService', 'GameService', 'getGame', '$scope', '$state'];
	function tableCtrl($http, Socket, UserService, GameService, getGame, $scope, $state) {
		var vm = this;
		vm.player1 = getGame.data.player1;
		vm.player2 = getGame.data.player2;
		vm.gameId = getGame.data._id;
		vm.noGame = false;
		vm.message = '';
		gameEnded = false;
		console.log('player1 je: ', vm.player1);

		//ukoliko nema game, prazan table
		if (getGame.status === 404) {

			Socket.removeListener('playerLeftTable');
			vm.noGame = true;
		}
		
		//Ako user hoce da napusti Table stanje
		/*if (getGame.status !== 404) {
			var odabrao = false;
			$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
				    if (odabrao) {
				    	return;
					}
			         event.preventDefault();
			         

			         
			         bootbox.confirm("Are you sure? Game will count as lose!", function(result) {
			         	if (result) {
				         	 odabrao = true;
					         $state.go(toState.name); 
					         return;
				     	} else {
				     		console.log('we stayed');
				    	 }
				     }); 
			});

		}*/


		vm.getCurrentUser = UserService.getCurrentUser().userName;

		//Ko pocinje prvi igru, logika je na bekendu jer se cuva u modelu u propertiju whoStarts
		vm.playerOnMove = getGame.data.whoStarts;
		if (vm.getCurrentUser !== vm.playerOnMove) {
			vm.message = ('It is player ' + vm.playerOnMove + ' turn');
		} else {
			vm.message = ('It is your turn');
		}

		console.log('getGame');
		console.log(getGame);
		console.log(getGame.data);
		console.log(vm.getCurrentUser);
		console.log('PRE xxx:', xxx);
		var xxx = getGame.data.xMoves;
		console.log('Posle xxx:', xxx);
		console.log('WhoStarts: ', getGame.data.whoStarts);
		console.log('player on move:', vm.playerOnMove)
		var ooo = getGame.data.oMoves;
		var moveCounter = getGame.data.movesDone;
		Socket.on('nextTurn', function(data) {
			console.log('NEXT turn u CTRL slusam');
			console.log("player moved: ", data.playerMoved);    
			console.log('XXX u socketu', xxx); 
			if (data.playerMoved === vm.playerOnMove) {
				if (vm.player1 === vm.playerOnMove) {
					var x = document.getElementById(data.cellId);
					if (x.innerHTML == 0) {
		    			x.innerHTML = "X";
		    			xxx.push(data.cellId);
		    			moveCounter++;
		    			console.log('MoveCounter je : ', moveCounter);
		    			if (GameService.checkWinner(xxx)) {
		    				vm.message = 'Winner is ' + vm.player1;
		    				/*xxx = [];
		    				ooo = [];
		    				moveCounter = 0;*/
		    				gameEnded = true;
		    				if (vm.getCurrentUser === vm.player1) {
		    					GameService.saveScore(vm.player1, vm.player2);
		    					GameService.deleteActiveGame(vm.gameId);	
		    				}
		    				bootbox.confirm({message: "Winner is " + vm.player1 +" !", buttons: {
									        'cancel': {
									            label: 'Cancel',
									            className: 'btn-primary pull-right'
									        },
									        'confirm': {
									            label: 'Rematch',
									            className: 'btn-success pull-right'
									        }
									     }, callback: function(result)  {

									     	if (result) {
									     		Socket.emit('rematch', {user: vm.getCurrentUser, userNameChatRoom: vm.player1});
									     		vm.message = 'Waitting for player to accept Rematch!'
									     		Socket.removeListener('rematch');
									     		// GameService.createGame(vm.player1, vm.player2);
									     		// $state.reload();
									     	} else {
									     		//$state.reload();
									     		Socket.removeListener('rematch');
									     		Socket.removeListener('rematchAccepted');
									     		$state.go('home');
									     	}
									     	
		 								 console.log("Confirm result: "+result);
		 								}
 								 
							}); 
		    				return true;
		    			}
		    			if (moveCounter === 9) {
		    				vm.message = 'It is tie!';
		    				gameEnded = true;
		    				if (vm.getCurrentUser === vm.player1) {
		    					
		    					GameService.deleteActiveGame(vm.gameId);	
		    				}
		    				bootbox.confirm({message: "It is tie!", buttons: {
									        'cancel': {
									            label: 'Cancel',
									            className: 'btn-primary pull-right'
									        },
									        'confirm': {
									            label: 'Rematch',
									            className: 'btn-success pull-right'
									        }
									     }, callback: function(result)  {

									     	if (result) {
									     		Socket.emit('rematch', {user: vm.getCurrentUser, userNameChatRoom: vm.player1});
									     		vm.message = 'Waitting for player to accept Rematch!';
									     		Socket.removeListener('rematch');

									     		// GameService.createGame(vm.player1, vm.player2);
									     		// $state.reload();
									     	} else {
									     		//$state.reload();
									     		Socket.removeListener('rematch');
									     		Socket.removeListener('rematchAccepted');
									     		$state.go('home');

									     	}
 								 console.log("Confirm result: "+result);
 								}
 								 
							}); 
							return;
		    			}
		    			vm.playerOnMove = vm.player2;
		    			if (vm.getCurrentUser !== vm.player2) {
		    				vm.message = ('It is player ' + vm.player2 + ' turn');
		    			} else {
		    				vm.message = ('It is your turn');
	    			}
	    		}
	    		} else if (vm.player2 === vm.playerOnMove) {
	    			var o = document.getElementById(data.cellId);
	    			if (o.innerHTML == 0) {
		    			o.innerHTML = "O";
		    			ooo.push(data.cellId);
		    			moveCounter++;
		    			console.log('MoveCounter je : ', moveCounter);
		    			if (GameService.checkWinner(ooo)) {
		    				vm.message = 'Winner is ' + vm.player2;
		    				/*xxx = [];
		    				ooo = [];
		    				moveCounter = 0;*/
		    				gameEnded = true;
		    				if (vm.getCurrentUser === vm.player2) {
		    					GameService.saveScore(vm.player2, vm.player1);
		    					GameService.deleteActiveGame(vm.gameId);	    				
		    				}
		    				bootbox.confirm({message: "Winner is " + vm.player2 +" !", buttons: {
									        'cancel': {
									            label: 'Cancel',
									            className: 'btn-primary pull-right'
									        },
									        'confirm': {
									            label: 'Rematch',
									            className: 'btn-success pull-right'
									        }
									     }, callback: function(result)  {

									     	if (result) {
									     		Socket.emit('rematch', {user: vm.getCurrentUser, userNameChatRoom: vm.player1});
									     		vm.message = 'Waitting for player to accept Rematch!'
									     		Socket.removeListener('rematch');
									     		// GameService.createGame(vm.player1, vm.player2);
									     		// $state.reload();
									     	} else {
									     		//$state.reload();
									     		Socket.removeListener('rematch');
									     		Socket.removeListener('rematchAccepted');
									     		$state.go('home');
									     	}
 								 console.log("Confirm result: "+result);
 								}
 								 
							}); 
		    				return true;
		    			}
		    			if (moveCounter === 9) {
		    				vm.message = 'It is tie!';
		    				gameEnded = true;
		    				if (vm.getCurrentUser === vm.player2) {
		    					
		    					GameService.deleteActiveGame(vm.gameId);	
		    				}
		    				bootbox.confirm({message: "It is tie!", buttons: {
									        'cancel': {
									            label: 'Cancel',
									            className: 'btn-primary pull-right'
									        },
									        'confirm': {
									            label: 'Rematch',
									            className: 'btn-success pull-right'
									        }
									     }, callback: function(result)  {

									     	if (result) {
									     		Socket.emit('rematch', {user: vm.getCurrentUser, userNameChatRoom: vm.player1});
									     		vm.message = 'Waitting for player to accept Rematch!'
									     		Socket.removeListener('rematch');
									     		// GameService.createGame(vm.player1, vm.player2);
									     		// $state.reload();
									     	} else {
									     		//$state.reload();
									     		Socket.removeListener('rematch');
									     		Socket.removeListener('rematchAccepted');
									     		$state.go('home');
									     	}
 								 console.log("Confirm result: "+result);
 								}
 								 
							}); 
							return;
		    			}
		    			vm.playerOnMove = vm.player1;
		    			if (vm.getCurrentUser !== vm.player1) {
		    				vm.message = ('It is player ' + vm.player1 + ' turn');
		    			} else {
		    				vm.message = ('It is your turn');
		    			}
	    			}
	    		}
	    	}

		});
		
		var rematch = 0;
		Socket.on('rematchAccepted', function(data) {
			console.log('REMATCH LISTENER');
			rematch++;
			if (rematch === 2) {
				console.log('REMATCH oba');
				if (vm.player1 === vm.getCurrentUser) {
					console.log('REMATCH SKROZ');
					GameService.createGame(vm.player1, vm.player2);
				}
				$state.reload();
				Socket.removeListener('rematchAccepted');
				console.log('REMATCH');
			}
		});

		if (getGame.status !== 404) {
			$scope.$on('$stateChangeStart', function(event) {
				Socket.removeListener('nextTurn');
				Socket.removeListener('playerLeftTable');
				if (!gameEnded) {
					console.log('GAME not ENDED ');
					if (vm.getCurrentUser === vm.player1) {
							GameService.saveScore(vm.player2, vm.getCurrentUser);
						} else {
							GameService.saveScore(vm.player1, vm.getCurrentUser);
						}
				    GameService.deleteActiveGame(vm.gameId);
				    gameEnded = true;
				    Socket.emit('playerLeftTable', {userNameChatRoom: vm.player1, playerLeft: vm.getCurrentUser});

					bootbox.alert('You have left the table, game will be counted as Lose!', function() {	
				    	//$state.reload();
					});
				}
			
			});
		}

		Socket.on('playerLeftTable', function(data) {
			console.log('PLAYER left table LISTENER');
			bootbox.alert('Player ' + data.playerLeft + ' has left the table, game will be counted as Win!', function() {
				console.log('GameEnded PRE', gameEnded);
				gameEnded = true;
				$state.reload();
				console.log('GameEnded NAKON RELOAD', gameEnded);
				$state.go('home');
			});
		});

		Socket.emit('join', {userName: vm.player1});

		vm.kliknuo = function(cellId) {
			console.log(cellId);
			console.log('KLIKNUO ');
			if (!gameEnded) {
				Socket.emit('playerMoved', {userNameChatRoom: vm.player1, playerMoved: vm.getCurrentUser,  cellId: cellId});
			}
			
		};

	}



})();