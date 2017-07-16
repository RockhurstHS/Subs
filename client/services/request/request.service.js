app.service('Request', function(Http) {
    var self = this;
    
    self.sendNew = function(data) {
        return Http.post('/api/request', data);
    }
});