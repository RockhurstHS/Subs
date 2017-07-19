app.service('Auth', function($http, $location, $rootScope, $window) {
    
    var self = this;

    self.user = {};

    self.isSignedIn = false;
    self.isAdmin = false;
    self.isSuperAdmin = false;

    self.setUser = function(user) {
        self.user = user;
    };

    self.getUser = function() {
        return self.user;
    };

    self.wipe = function() {
        self.user = {};
    };
    
    // google stuff
    var auth2;

    var initSigninV2 = function() {
        console.log('initSigninV2()');
        auth2 = gapi.auth2.getAuthInstance();
        auth2.isSignedIn.listen(signinChanged);
        auth2.currentUser.listen(userChanged);

        if (auth2.isSignedIn.get() == true) {
            auth2.signIn();
        }
    };

    var signinChanged = function(isSignedIn) {
        console.log('signinChanged() = ' + isSignedIn);

        self.isSignedIn = isSignedIn;
        
        if (isSignedIn) {
            console.log('user signed in');
            
            var googleUser = auth2.currentUser.get();
            var authResponse = googleUser.getAuthResponse();
            var profile = googleUser.getBasicProfile();
            
            self.setUser({
                userid      : profile.getId(),
                fullName    : profile.getName(),
                firstName   : profile.getGivenName(),
                lastName    : profile.getFamilyName(),
                photo       : profile.getImageUrl(),
                email       : profile.getEmail(),
                domain      : googleUser.getHostedDomain(),
                idToken     : authResponse.id_token,
                expiresAt   : authResponse.expires_at
            });
            
            Promise.resolve($http({
                url: '/api/credential',
                method: 'GET',
                headers: {
                    'Authorization': self.getUser().idToken
                }
            })).then(function(response) {
                var cred = response.data;
                if(cred.admin)
                    self.isAdmin = true;
                if(cred.superadmin)
                    self.isSuperAdmin = true;
            });
            
            $rootScope.$broadcast('login');
            
            console.log('idtoken = ' + authResponse.id_token);
            // $window.location.href = $location.path('/classes').absUrl();

        } else {
            console.log('user signed out');
            self.wipe();
            
            // redirect and refresh to home page
            $window.location.assign('/');
        }
    };

    var userChanged = function(user) {
        console.log('userChanged()');
    };

    self.signOut = function signOut() {
        console.log('signOut()');
        auth2.signOut().then(function() {
            signinChanged(false);
        });
        console.log(auth2);
    };

    self.disconnect = function disconnect() {
        console.log('disconnect()');
        auth2.disconnect().then(function() {
            signinChanged(false);
        });
        console.log(auth2);
    };
    
    self.start = function() {
        console.log('appStart()');
        gapi.load('auth2', initSigninV2);       
    }
});