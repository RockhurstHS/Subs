app.component('standard.request.tile', {
    templateUrl: 'components/request/tile/standard/standard-request-tile.template.html',
    controller: function StandardRequestTileController(Auth, Request, Teacher, $rootScope, $scope) {
        var self = this;

        var data = $scope.$parent.req;

        self.id = data._id;
        self.className = data.className;
        self.date = data.date;
        self.assignedTo = data.assignedTo;
        self.timeslot = data.timeslot;
        self.status = data.status;
        self.style = getStyle(data);
        
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