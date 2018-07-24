app.config(function config($locationProvider, $logProvider, $routeProvider) {
    $locationProvider.hashPrefix('');

    $logProvider.debugEnabled(true);

    $routeProvider
        .when('/admin', {
            template: '<admin></admin>'
            //template: '<admin.calendar></admin.calendar>'
        })
        .when('/admin/faculty', {
            template: '<admin.faculty></admin.faculty>'
        })
        .when('/admin/departments', {
            template: '<admin.departments></admin.departments>'
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
});