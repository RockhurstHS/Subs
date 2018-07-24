app.service('Department', function(Http, $rootScope) {

    var self = this;

    self.departments = [];
    
    self.create = function(dept) {
        return Http.post('/api/admin/department', dept);
    }

    self.getDepartments = function() {
        return Http.get('/api/admin/departments');
    };

    self.getHtmlSelectOptions = function() {
        var html = '<option></option>';
        for (var i = 0; i < self.departments.length; i++) {
            html += '<option value="' + self.departments[i] + '">' + self.departments[i] + '</option>';
        }
        return html;
    };
});
