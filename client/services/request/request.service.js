app.service('Request', function(Http, Auth) {
    var self = this;

    self.getUserRequests = function() {
        var url = '/api/requests/' + Auth.getUser().userid;
        return Http.get(url);
    }

    self.sendNew = function(data) {
        return Http.post('/api/request', data);
    };

    self.accept = function(data) {
        var url = '/api/request/' + data._id;
        return Http.put(url, data);
    };

    self.reject = function(data) {
        var url = '/api/request/' + data._id;
        return Http.put(url, data);
    };
});