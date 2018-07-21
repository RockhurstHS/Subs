app.component('request.form', {
    templateUrl: 'components/request/form/request-form.template.html',
    controller: function RequestFormController($location, $routeParams, $scope, Auth, Http, Request) {
        var self = this;
        
        self.fullName = Auth.getUser().fullName;
        
        if($routeParams.requestid) {
            var reqUrl = '/api/request/' + $routeParams.requestid;
            Http.get(reqUrl).then(function(response) {
                var req = response.data;
                console.log(response);
                self.teacher = req.teacher;
                self.date = req.date;
                self.className = req.className;
                self.roomNumber = req.roomNumber;
                self.assignment1 = req.assignment1;
                self.assignment2 = req.assignment2;
                angular.element('#timeslot' + req.timeslot).addClass('btn-primary');

                $scope.$apply();
            });
        }

        // save button is clicked
        self.submitRequest = function() {
            
            var tslot = angular.element('#timeslot .btn-primary').first().text();
            
            var data = {
                teacher : Auth.getUser().fullName,
                email : Auth.getUser().email,
                date : self.date,
                timeslot : tslot,
                className : self.className,
                roomNumber : self.roomNumber,
                assignment1 : self.assignment1 || "",
                assignment2 : self.assignment || "",
                status : "Pending"
            };
            
            Request.sendNew(data).then(function(response) {
                console.log(JSON.stringify(response));
                $location.path('h');
                $scope.$apply();
            });
        };
        
        // register click handlers on all timeslot options
        var timeslotGroup = angular.element('#timeslot button');
        timeslotGroup.click(function() {
            timeslotGroup.removeClass('btn-primary');
            angular.element(this).addClass('btn-primary');
        });
        
        // register datepicker
        angular.element('.datepicker').datepicker();
    }
});