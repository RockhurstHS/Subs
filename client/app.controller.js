app.controller('sc', function($rootScope, $window, Auth, Teacher) {

    $rootScope.$on('login', function() {

    });
    
    $window.start = function() {
        Auth.start();
    };
});