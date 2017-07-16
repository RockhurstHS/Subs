app.component('home', {
    templateUrl: 'components/home/home.template.html',
    controller: function HomeController(Auth, Http, $scope) {
        var self = this;
        self.requests = [];
        
        var requestsUrl = '/api/requests/' + Auth.getUser().userid;
        
        Http.get(requestsUrl).then(function(response) {
            self.requests = response.data;
            console.log(JSON.stringify(response.data));
            $scope.$apply();
        });
    }
});