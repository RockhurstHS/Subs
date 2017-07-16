app.component('admin', {
    templateUrl: 'components/admin/admin.template.html',
    controller: function AdminController(Http, $scope) {
        var self = this;

        self.requests = [];

        self.isAdmin = true;

        Http.get('/api/admin/requests').then(function(response) {
            console.log('admin reqs = ' + JSON.stringify(response.data));

            self.requests = response.data;
            $scope.$apply();
        });
    }
});