app.service('Http', function($http, Auth) {
    
    // todo: https://stackoverflow.com/a/37896285
    
    console.log('Http service loaded');

    var self = this;
    
    function isTokenExpired() {
        
    }

    self.get = function(url) {
        return Promise.resolve($http({
            url: url,
            method: 'GET',
            headers: {
                'Authorization': Auth.getUser().idToken
            }
        }));
    };

    // generic http post with callback
    self.post = function(url, data) {
        return Promise.resolve($http({
            url: url,
            method: 'POST',
            data: data,
            headers: {
                'Authorization': Auth.getUser().idToken
            }
        }));
    };
    
    self.put = function(url, data) {
        return Promise.resolve($http({
            url: url,
            method: 'PUT',
            data: data,
            headers: {
                'Authorization': Auth.getUser().idToken
            }
        }));
    };
});