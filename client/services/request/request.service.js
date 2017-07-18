app.service('Request', function(Http) {
    var self = this;
    
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