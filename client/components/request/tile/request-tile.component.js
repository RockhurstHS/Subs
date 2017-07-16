app.component('request.tile', {
    templateUrl: 'components/request/tile/request-tile.template.html',
    controller: function RequestTileController(Auth, Teacher, $rootScope, $scope) {
        var self = this;

        self.isAdmin = Auth.isAdmin;

        self.teachers = [];

        self.filterTeachers = function(substring) {
            substring = substring.toLowerCase();
            console.log(substring);
            //var filtered = 
        };

        // filter search results
        function filterByStartingSubstring(substring) {
            return function(element) {
                return element.indexOf(substring) === 0;
            };
        };

        $rootScope.$on('teachers', function() {
            var cbox = angular.element('select.combobox');
            cbox.html(Teacher.getHtmlSelectOptions());
            cbox.combobox();
            angular.element('.combobox').attr('placeholder', 'Assign To');
        });
    }
});