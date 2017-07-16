app.config(['$locationProvider', '$routeProvider', 
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('');
        
        $routeProvider
        .when('/admin', {
            template: '<admin></admin>'
        })
        .when('/h', {
            template: '<home cache-view="false"></home>'
        })
        .when('/hi', {
            template: '<p>HI</p>'
        })
        .when('/login', {
            template: '<login></login>'
        })
        .when('/request', {
            template: '<request.form></request.form>'
        })
        .when('/request/:requestid', {
            template: '<request.form></request.form>'
        })
        .otherwise('/');
    }
]);

