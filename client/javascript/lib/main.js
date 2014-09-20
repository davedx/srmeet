var mainApp = (function(){
  
	window.fbAsyncInit = function() {
	    FB.init({
	      appId      : '637163226405149', // App ID
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
		login: function(callback){

			FB.login(function(response) {
	           if (response.authResponse) 
	           {
	                callback();
	            } else
	            {
	             console.log('Authorization failed.');
	            }
	         },{scope: 'email'});			
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
		}	
	}
})();