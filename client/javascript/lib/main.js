var mainApp = (function(){
  
	var isLoggedIn = function(){
		
		var session = hello( "facebook" ).getAuthResponse();
		var current_time = (new Date()).getTime() / 1000;
		return (session && session.access_token) && (session.expires > current_time);		
	};



	window.fbAsyncInit = function() {
	    FB.init({
	      appId      : '637163226405149', // App ID
	     //channelUrl : 'YOUR_WEBSITE_CHANNEL_URL',
	      status     : true, // check login status
	      cookie     : true, // enable cookies to allow the server to access the session
	      xfbml      : true  // parse XFBML
	    });
     };
 
	  (function(d){
	     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement('script'); js.id = id; js.async = true;
	     js.src = "//connect.facebook.net/en_US/all.js";
	     ref.parentNode.insertBefore(js, ref);
	   }(document));


	return{
	
		init: function(callback){
			console.log("Initializing the app..." );
			console.log("User logged in =", isLoggedIn());

			hello.on('auth.login', function(auth) {
			    // call user information, for the given network
			    console.log("login callback.........");
			    hello(auth.network).api('/me').then(function(r) {
			    		console.log("login callback, authentication successfull", r);
			    		appConf.userData = r;
			    		document.getElementById('loginButton').innerHTML = 'Logout';		    		
				    });
			});

			hello.on('auth.logout',	function(){
				console.log("logging out callback.........");
				appConf.userData = false;
				document.getElementById('loginButton').innerHTML = 'Login';
			});

			if(isLoggedIn()){ // user is logged in so logout
				document.getElementById('loginButton').innerHTML = 'Logout';
				callback()
				return;
			}else{ // user is logged out so login
				document.getElementById('loginButton').innerHTML = 'Login';
				callback();
			}

			hello.init({
					    	facebook: appConf.facebookAppId
					 	});


			

			/*
			hello( "facebook" ).login().then( function(){
				console.log("logged in....");
				callback();
			}, function( e ){
				console.error("Signin error: " + e.error.message );
			});*/
		},
		getUserId: function(){
			if(isLoggedIn())
				return appConf.userData.id;
			else
				return 0;
		},
		login: function(callback){

			FB.login(function(response) {
	           if (response.authResponse) 
	           {
	                //getUserInfo(); // Get User Information.
	                callback();
	            } else
	            {
	             console.log('Authorization failed.');
	            }
	         },{scope: 'email'});

 
			// hello( "facebook" ).login().then( callback(), function(e){
			// 		console.error( "Signed in error:" + e.error.message );
			// 	});
		},
		getUserData: function(callback){
			FB.api('/me', function(response) {
 						callback(response);
			        });	
		},
		logout: function(callback){
			FB.logout(callback);
		},

		getStatus: function(callback) {
			FB.getLoginStatus(function(response) {
				// response.status === 'connected'
			  	callback(response);
			 });
		},

		toggleLogin: function(){
			//debugger;
			if(isLoggedIn()){ // user is logged in so logout
				console.log("trying to logout...");
				
				hello.logout('facebook', {display:'none', force:true}, function(){
					console.log("Signed out =" + isLoggedIn());
				});
			}else{ // user is logged out so login				
				hello( "facebook" ).login().then( function(){
					console.log("Signed in =" + isLoggedIn());
				}, function(e){
					console.error( "Signed in error:" + e.error.message );
				});
	
				// options = {scope:'basic, friends, events, create_event, email, notifications', redirect_uri:''};
			}
		}
	}
})();