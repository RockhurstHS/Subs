app.config(['$locationProvider', '$routeProvider', 
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('');
        
        $routeProvider
        .when('/admin', {
            template: '<admin></admin>'
        })
        .when('/calendar', {
            template: '<calendar></calendar>'
        })
        .when('/h', {
            //template: '<home cache-view="false"></home>'
            template: '<home.calendar></home.calendar>'
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

