(function() {
    angular
        .module('xo')
        .factory('Socket', Socket);
    Socket.$inject = ['socketFactory'];
    function Socket(socketFactory) {

      return socketFactory({
        ioSocket: io.connect('http://localhost:3000')
      	 //ioSocket: io.connect('http://localhost:3000', {'force new connection': true})
      	 // ioSocket: io.connect('http://localhost:3000', {forceNew: true})  'multiplex':false 
    	});
	}



})();