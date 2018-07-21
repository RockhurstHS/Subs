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

    var userChanged = function(googleUser) {
        console.log(moment().format() + ': user changed');
        var profile = googleUser.getBasicProfile();
        var authResponse = googleUser.getAuthResponse();
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
    
    self.refresh = function(idToken) {
        // pending testing: https://stackoverflow.com/a/37580494/1161948
        if (self.isSignedIn) {
            var googleUser = auth2.currentUser.get();
            var authResponse = googleUser.getAuthResponse();
            
            console.log('user is signed in');
            console.log('check the id token expiry ' + authResponse.id_token);
            console.log('parsed = ' + JSON.stringify(parseJwt(authResponse.id_token)));
            // example: http://www.jsonmate.com/permalink/5a4d0b57a35702c60cc60d4c

            var jwt = parseJwt(authResponse.id_token);
            var now = moment(); 
            var exp = moment(parseInt('' + jwt.exp + '000'));
            console.log('expiry is ' + exp);
            console.log('now is ' + now);
            if(now.isSame(exp) || now.isAfter(exp)) {
                console.log('time to refresh the token');
                gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse().then(function() {
                    console.log('check it now - ' + JSON.stringify(parseJwt(authResponse.id_token)));
                });
            }
        }
    };
    
    // called by app.controller.js `$window.start`
    self.start = function() {
        console.log('appStart()');
        gapi.load('auth2', initSigninV2);       
    }
    
    // https://stackoverflow.com/a/38552302/1161948
    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(atob(base64));
    };
});