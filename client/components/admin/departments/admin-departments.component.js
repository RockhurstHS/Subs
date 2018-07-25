app.component('admin.departments', {
    templateUrl: 'components/admin/departments/admin-departments.template.html',
    controller: function AdminDepartmentsController(Http, Department, $scope) {
        var self = this;

        self.departments = [];
        
        Department.getDepartments().then(function(response) {
            self.departments = response.data;
            $scope.$apply();
        });

        self.addDepartment = function() {
            var dept = {
                id : self.newDepartment.toLowerCase().replace(' ','-'),
                name : self.newDepartment
            };
            
            Department.create(dept).then(function() {
                self.departments.push(dept);
                self.newDepartment = '';
                $scope.$apply();
            });
        };
    }
});