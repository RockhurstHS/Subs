app.component('admin.faculty', {
    templateUrl: 'components/admin/faculty/admin-faculty.template.html',
    controller: function AdminController(Http, Teacher, $scope) {
        var self = this;

        self.faculty = [];
        
        Teacher.getRoster().then(function(response) {
            self.faculty = response.data;
            $scope.$apply();
        });
        
        self.setAvailability = function(evt) {
            var slot = evt.target.getAttribute('data-slot');
            var email = evt.target.getAttribute('data-teacher');
            console.log(slot);
            console.log(email);

            Teacher.updateAvailability(email, slot, false);
        };
        
        self.addTeacher = function() {
            var teacher = {
                email : self.newTeacher,
                availability : [ true, true, true, true, true, true, true, true ]
            };
            
            Teacher.create(teacher).then(function() {
                self.faculty.push(teacher);
                $scope.$apply();
            });
        };
    }
});