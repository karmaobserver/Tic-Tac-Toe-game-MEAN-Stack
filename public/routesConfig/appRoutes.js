(function (angular) {
  var app = angular.module("xo", ['ui.router', 'angular-jwt', 'ngStorage', 'btford.socket-io']);

  app.config(config)
     .run(run);

 function config($stateProvider, $urlRouterProvider, $locationProvider) {
  
  //
 
  //
  // For any unmatched url, redirect to /home
  $urlRouterProvider.otherwise('/');

  /*var getGame = function(GameService, UserService) { 
  console.log('appROutes getGame');
        return GameService.getGame(UserService.getCurrentUser().userName);
  };*/


  //
  // Now set up the states
  $stateProvider
    .state('homePage', {
      url: "/",
      templateUrl: "views/homePage.html",
      controller: "homePageCtrl",
      controllerAs: "vm"
    })
     .state('register', {
      url: "/register",
      templateUrl: "views/register.html",
      controller: "registerCtrl",
      controllerAs: "vm"
    })
    .state('home', {
      url: "/home",
      templateUrl: "views/home.html",
       controller: "homeCtrl",
       controllerAs: "vm"
    })
    .state('login', {
      url: "/login",
      templateUrl: "views/login.html",
      controller: "loginCtrl",
      controllerAs: "vm"
    })
    .state('logout', {
      url: "/logout",
      //templateUrl: "views/home.html",
       controller: "logoutCtrl",
       controllerAs: "vm"
    })
    .state('profile', {
      url: "/profile",
      templateUrl: "views/profile.html",
      controller: "profileCtrl",
      controllerAs: "vm",
    })
    .state('statistic', {
      url: "/statistic",
      templateUrl: "views/statistic.html",
      controller: "statisticCtrl",
      controllerAs: "vm"
    })
    .state('chat', {
      url: "/chat",
      templateUrl: "views/chat.html",
      controller: "chatCtrl",
      controllerAs: "vm",
    })
    .state('challengePlayer', {
      url: "/challengePlayer",
      templateUrl: "views/challengePlayer.html",
      controller: "challengePlayerCtrl",
      controllerAs: "vm"
    })
    .state('challenges', {
      url: "/challenges",
      templateUrl: "views/challenges.html",
      controller: "challengesCtrl",
      controllerAs: "vm"
    })
    .state('table', {
      url: "/table",
      templateUrl: "views/table.html",
      controller: "tableCtrl",
      controllerAs: "vm",
      resolve: {
           //getGame: getGame
           getGame: ['GameService', 'UserService', function(GameService, UserService) {
            console.log('usao u getGame app route');
              return  GameService.getGame(UserService.getCurrentUser().userName);
           }]
      }
    });
    
    

     //Koristim da bi izbacio # iz url-a. Jos u server.js koristim rewrite mehanizam
     $locationProvider.html5Mode(true); 


  }

  function run($localStorage, $http, $rootScope, UserService, $state, Socket) {
     // postavljanje tokena nakon refresh
    if ($localStorage.currentUser) {
        $http.defaults.headers.common.Authorization = $localStorage.token;
        console.log('RUN funkcija');
    }

    //Ako pogodimo stranicu za koju nemamo prava, redirektujemo se na login
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      var publicStates = ['login', 'greska', 'register', 'homePage', ''];
      //ako nema trazeno ime stanja(toState.name) u nizu publicStates, vratice -1, pa poredim dal je -1
      var restrictedState = publicStates.indexOf(toState.name) === -1;

      //dodatno za poruke
      delete $rootScope.message;
      delete $rootScope.error;


      console.log('state:');
      console.log(publicStates.indexOf(toState.name));
      //console.log(UserService.getCurrentUser());
      if(restrictedState && !UserService.getCurrentUser()) {
        $state.go('login');
      }

      

    });

     //Ako neko usera izazove
     Socket.on('challenged', function(data) {
        console.log('SluSA CHALLENGED');
        //ljem samoho sebe moze vivolac, insak nje uhodzi do if
        if (UserService.getCurrentUser().userName === data.challengedUser) {
          console.log('Trenutni user:');
          console.log(UserService.getCurrentUser().userName);
          console.log('IZAZVAN od: ' + data.userChallenge);
          Socket.emit('addToChallengeList', {userChallenge: data.userChallenge, challengedUser: data.challengedUser });
        }
    });
     //da bi sacuvao usera sa izazovima
     Socket.on('currentUser', function(data) {
        console.log('cuvanje usera');
        $localStorage.currentUser = data.user;
        console.log(data.user);
     });

     Socket.on('updateLocalStorage', function(data) {
        console.log('Slusa updateLocalStorage');
         if (UserService.getCurrentUser().userName === data.user.userName) {
            console.log('Odradio updateLocalStorage');
            $localStorage.currentUser = data.user;
            Socket.emit('refreshLocalStorage', {});
        }
     });

     //kada user prihvati izazov
     Socket.on('stepIntoGame', function(data) {
        console.log('Nakon PRIHVATANJA');
        if (UserService.getCurrentUser().userName === data.userChallenge) {
          //Socket.emit('setupPlayers', {userChallenge: data.userChallenge, acceptedUser: data.acceptedUser});
          //reload uradim da ako vec user se nalazi u table stanju da ga refresujem novim podacima
           $state.go('table', {}, { reload: true});
        }
     });

    $rootScope.isLoggedIn = function () {
            if (UserService.getCurrentUser()){
              return true;
            }
            else{
              return false;
            }
    };

  }

}(angular));