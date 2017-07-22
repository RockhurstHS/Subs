app.controller('sc', function($rootScope, $window, Auth, Teacher) {

    $rootScope.$on('login', function() {
        console.log('TEACHERS INITIALIZED');
        Teacher.init();
    });
    
    $window.start = function() {
        Auth.start();
    };
});