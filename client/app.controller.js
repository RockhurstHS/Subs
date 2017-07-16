app.controller('sc', function($scope, $window, Auth) {

    $window.start = function() {
        Auth.start();
    };
});