app.component('navbar', {
    templateUrl: 'components/navbar/navbar.template.html',
    controller: function NavbarController(Auth, $rootScope, $scope) {
        var self = this;
        
        self.email = '';
        
        self.signOut = function() {
            Auth.signOut();
        };
        
        self.disconnect = function() {
            Auth.disconnect();
        };
        
        // broadcast from Auth service
        $rootScope.$on('login', function() {
            self.email = Auth.getUser().email;
            $scope.$apply();
        });
    }
});