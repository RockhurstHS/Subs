var app = angular.module('s', [
    'ngRoute',
    'angularMoment',
    'ui.calendar'
]);

app.run(['$location', '$rootScope', '$route', 'Auth', function($location, $rootScope, $route, Auth) {
    $rootScope.$on('$routeChangeStart', function(next, current) {
        console.log('route change start');
        //todo: https://stackoverflow.com/questions/20969835/angularjs-login-and-authentication-in-each-route-and-controller

        const ADMIN_PATHS = ['/admin'];
        
        var requestedPath = $location.path();

        if (!Auth.isSignedIn) {
            $location.path('/login');
        } else if (ADMIN_PATHS.indexOf(requestedPath) !== -1 && !Auth.isAdmin) {
            $location.path('/h');
        }
    });

    // detect awake from computer sleep, used to refresh auth tokens
    var wakeWorker = new Worker('workers/detect-wake.js');
    wakeWorker.onmessage = function (ev) {
        if (ev && ev.data === 'wakeup') {
            console.log('computer woke from sleep');
            Auth.refresh();
        }
    }
    
}]);

// called by linked script <https://apis.google.com/js/platform.js?onload=appStart>
// anti-pattern? gapi script callback and it hits the login module eventually
function appStart() {
    window.start();
}
