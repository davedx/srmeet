var mainApp = (function(){
  
	window.fbAsyncInit = function() {
	    FB.init({
	      appId      : '637163226405149', // App ID
	      status     : true, // check login status
	      cookie     : true, // enable cookies to allow the server to access the session
	      xfbml      : true,  // parse XFBML
	      oauth	: true
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
	                callback(true);
	            } else
	            {
	             console.log('Authorization failed.');
	            }
	         },{
	         		scope: 'public_profile,email,user_birthday,user_location', 
	         		return_scopes: true	
	     		});	
	         
		},

		getUserData: function(callback){
			FB.api('/me', function(response) {
 						callback(response);
			        });	
		},
		
		getUserPicture: function(callback){
			FB.api('/me?fields=id,name,picture,birthday,about', function(response) {
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