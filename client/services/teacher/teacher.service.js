app.service('Teacher', function(Http, $rootScope) {

    var self = this;

    self.roster = [];
    
    self.create = function(teacher) {
        return Http.post('/api/admin/teacher', teacher);
    }

    self.getRoster = function() {
        return Http.get('/api/teachers');
    };

    self.getHtmlSelectOptions = function() {
        var html = '<option></option>';
        for (var i = 0; i < self.roster.length; i++) {
            html += '<option value="' + self.roster[i] + '">' + self.roster[i] + '</option>';
        }
        return html;
    };
    
    self.updateAvailability = function(teacher, slot, status) {
        return Http.put('/api/admin/faculty/availability', {
            email : teacher,
            slot : slot,
            status: status
        });
    };
});
