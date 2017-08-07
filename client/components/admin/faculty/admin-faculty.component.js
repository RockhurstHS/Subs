app.component('admin.faculty', {
    templateUrl: 'components/admin/faculty/admin-faculty.template.html',
    controller: function AdminController(Http, Teacher) {
        var self = this;

        self.faculty = Teacher.getRoster();
        
        self.setAvailability = function() {
            console.log('avail');
        };
        
        self.addTeacher = function() {
            Teacher.create({
                email : self.newTeacher
            }).then(function() {
                console.log('made a teacher');
            })
            console.log('hmm');
        };
    }
});