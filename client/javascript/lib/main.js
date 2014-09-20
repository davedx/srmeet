var mainApp = (function(){

	var isLoggedIn = function(){

		var session = hello( "facebook" ).getAuthResponse();
		var current_time = (new Date()).getTime() / 1000;
	    console.log("session = ", session);

		return session && session.access_token && session.expires > current_time;
	};



	return{
		globals: {},

		init: function(){
			console.log("Initializing the app...");
			console.log("User logged in =", isLoggedIn());
			
			if(isLoggedIn()){ // user is logged in so logout
				//hello('facebook').logout('facebook',{force:true});
				document.getElementById('loginButton').innerHTML = 'Logout';
				return;
			}else{ // user is logged out so login
				document.getElementById('loginButton').innerHTML = 'Login';
			}

			hello.init({
			    	facebook: appConf.facebookAppId
			 	}, {
			     display: 'page',
			     force:true
			 });


			hello.on('auth.login', function(auth) {
			    // call user information, for the given network
			    hello(auth.network).api('/me').then(function(r) {
			    		console.log("authentication successfull, data = ", r);
			    		document.getElementById('loginButton').innerHTML = 'Logout';		    		
				    });
			});

			hello.on('auth.logout',	function(){
				console.log("logging out....");
				document.getElementById('loginButton').innerHTML = 'Login';
			});

			//hello('facebook').login();

		},

		toggleLogin: function(){

			if(isLoggedIn()){ // user is logged in so logout
				hello('facebook').logout('facebook',{force:true});
			}else{ // user is logged out so login
				hello('facebook').login();
			}
		}
	}
})();