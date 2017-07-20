app.component('admin.request.tile', {
    templateUrl: 'components/request/tile/admin/admin-request-tile.template.html',
    controller: function AdminRequestTileController(Auth, Request, Teacher, $rootScope, $scope) {
        var self = this;

        var data = $scope.$parent.req;

        self.style = getStyle(data);

        self.isAdmin = Auth.isAdmin;

        self.teachers = [];

        self.filterTeachers = function(substring) {
            substring = substring.toLowerCase();
            console.log(substring);
            //var filtered = 
        };

        self.acceptRequest = function(evt) {
            data.status = "Accepted";
            data.assignedTo = angular.element('#' + data._id + ' input.combobox').val();

            Request.accept(data).then(function(response) {
                if (response.status === 200) {
                    self.style = getStyle(data);
                    $scope.$apply();
                }
            });
        };

        self.rejectRequest = function(evt) {
            data.status = "Rejected";
            data.reason = "Unknown";

            Request.reject(data).then(function(response) {
                if (response.status === 200) {
                    self.style = getStyle(data);
                    $scope.$apply();
                }
            });
        };

        // hax : https://stackoverflow.com/a/26961453/1161948
        self.popView = function() {
            console.log('POP VIEW');
            var cbox = angular.element('#' + data._id + ' select.combobox');
            cbox.html(Teacher.getHtmlSelectOptions());
            cbox.combobox();

            if (data.status === 'Accepted' && data.assignedTo) {
                angular.element('#' + data._id + ' input.combobox').val(data.assignedTo);
                angular.element('input.combobox').prop('disabled', true);
                //angular.element('#' + data._id + ' span.dropdown-toggle').unbind('click');
                angular.element('#' + data._id + ' span.dropdown-toggle').css("pointer-events", "none");
            } else {
                angular.element('#' + data._id + ' input.combobox').attr('placeholder', 'Assign To');
            }
            return false;
        };

        // filter search results
        function filterByStartingSubstring(substring) {
            return function(element) {
                return element.indexOf(substring) === 0;
            };
        };

        function getStyle(data) {
            if (data.status === "Pending")
                return "bg-info";
            else if (data.status === "Accepted")
                return "bg-success";
            else if (data.status === "Rejected")
                return "bg-danger";
            else
                return "bg-warning";
        }
    }
});