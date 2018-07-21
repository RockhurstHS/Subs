app.controller('sc', function($rootScope, $window, Auth, Teacher) {

    $rootScope.$on('login', function() {

    });
    
    // called by app.module.js `appStart`
    $window.start = function() {
        Auth.start();
    };
});