app.service('Teacher', function(Http, $rootScope) {

    var self = this;

    self.roster = [];
    
    self.create = function(teacher) {
        return Http.post('/api/admin/teacher', teacher);
    }

    self.getRoster = function() {
        return self.roster;
    };

    self.getHtmlSelectOptions = function() {
        var html = '<option></option>';
        for (var i = 0; i < self.roster.length; i++) {
            html += '<option value="' + self.roster[i] + '">' + self.roster[i] + '</option>';
        }
        return html;
    };

    self.init = function() {
        Http.get('/api/teachers').then(function(response) {
            self.roster = response.data;
        });
    };
});