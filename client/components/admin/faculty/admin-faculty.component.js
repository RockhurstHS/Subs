app.component('admin.faculty', {
    templateUrl: 'components/admin/faculty/admin-faculty.template.html',
    controller: function AdminController(Http, Teacher) {
        var self = this;

        self.faculty = Teacher.getRoster();
        
        self.setAvailability = function(evt) {
            console.log(evt.target.getAttribute('data-slot'));
            
            console.log(evt.target.getAttribute('data-teacher'));
            
            var slot = evt.target.getAttribute('data-slot');
            var email = evt.target.getAttribute('data-teacher');

            Teacher.updateAvailability(email, slot, true);
        };
        
        self.addTeacher = function() {
            Teacher.create({
                email : self.newTeacher,
                availability : [ false, false, false, false, false, false, false, false ]
            }).then(function() {
                console.log('made a teacher');
            });
        };
        
        
    }
});